import Equipment from "../../models/Equipment.js";
import ComplianceItem from "../../models/ComplianceItem.js";
import WorkflowTask from "../../models/WorkflowTask.js";
import Document from "../../models/Document.js";
import Notification from "../../models/Notification.js";
import Conversation from "../../models/Conversation.js";

/**
 * Notification Engine
 *
 * Notifications are computed on read from live collection state rather
 * than stored in their own table - there's no "notification sent" event
 * anywhere upstream to persist, and a computed feed can never go stale or
 * duplicate. If IndusBrain later adds push/email delivery, this is the
 * function that would decide what to send; a separate delivery log would
 * track what already went out.
 */

const HIGH_RISK_FAILURE_THRESHOLD = 70;

export const getMaintenanceDueNotifications = async () => {
    const equipment = await Equipment.find({
        $or: [{ risk: "High" }, { failure: { $gte: HIGH_RISK_FAILURE_THRESHOLD } }],
    });

    return equipment.map((e) => ({
        type: "maintenance_due",
        severity: e.risk === "High" ? "high" : "medium",
        message: `${e.name} needs attention: ${e.health}% health, ${e.failure}% failure probability.`,
        refId: e._id,
    }));
};

export const getDocumentApprovalNotifications = async () => {
    const [pendingApprovals, failedDocuments] = await Promise.all([
        WorkflowTask.find({ type: "approval", status: { $in: ["pending", "in_progress"] } }).populate(
            "document",
            "originalName"
        ),
        Document.find({ status: "failed" }).select("originalName statusMessage"),
    ]);

    const approvalNotifications = pendingApprovals.map((t) => ({
        type: "document_approval",
        severity: "medium",
        message: `${t.title} is awaiting approval${t.document ? ` (${t.document.originalName})` : ""}.`,
        refId: t._id,
    }));

    const failedNotifications = failedDocuments.map((d) => ({
        type: "document_approval",
        severity: "high",
        message: `${d.originalName} failed processing and needs attention: ${d.statusMessage || "unknown error"}.`,
        refId: d._id,
    }));

    return [...approvalNotifications, ...failedNotifications];
};

export const getComplianceExpiryNotifications = async () => {
    const items = await ComplianceItem.find({ status: { $in: ["Expiring", "Expired"] } });

    return items.map((i) => ({
        type: "compliance_expiry",
        severity: i.status === "Expired" ? "high" : i.risk === "High" ? "high" : "medium",
        message: `${i.name} is ${i.status.toLowerCase()} (${i.exp}).`,
        refId: i._id,
    }));
};

export const getWorkflowUpdateNotifications = async (limit = 5) => {
    const tasks = await WorkflowTask.find({ status: { $in: ["approved", "rejected", "completed"] } })
        .sort({ updatedAt: -1 })
        .limit(limit);

    return tasks.map((t) => ({
        type: "workflow_update",
        severity: "low",
        message: `${t.title} is now ${t.status.replace("_", " ")}.`,
        refId: t._id,
    }));
};

/**
 * AI/Copilot notifications - currently just recent conversation activity
 * surfaced as a single rollup notification (Conversation is the AI
 * Orchestrator's memory store). Kept separate from
 * getDocumentApprovalNotifications' "failed processing" entries, which
 * are document-processing notifications, not Copilot-usage ones.
 */
export const getAiNotifications = async () => {
    const since = new Date();
    since.setHours(since.getHours() - 24);

    const recentConversations = await Conversation.countDocuments({ lastActivityAt: { $gte: since } });
    if (recentConversations === 0) return [];

    return [
        {
            type: "ai_update",
            severity: "low",
            message: `${recentConversations} Copilot conversation(s) active in the last 24 hours.`,
            refId: null,
        },
    ];
};

/**
 * @param {object} [user] - if provided, could be used to scope by plant/role in future; currently org-wide.
 */
export const getNotifications = async () => {
    const [maintenance, approvals, compliance, workflow, ai] = await Promise.all([
        getMaintenanceDueNotifications(),
        getDocumentApprovalNotifications(),
        getComplianceExpiryNotifications(),
        getWorkflowUpdateNotifications(),
        getAiNotifications(),
    ]);

    const all = [...maintenance, ...approvals, ...compliance, ...workflow, ...ai];
    const severityRank = { high: 0, medium: 1, low: 2 };
    all.sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);

    return all;
};

/**
 * Upserts the current computed feed into the Notification collection so
 * read/unread state persists across requests, without ever resetting a
 * notification that's already been marked read back to unread. Dedupe key
 * is `type:refId` - the same underlying condition (e.g. the same overdue
 * equipment) re-detected on the next sync updates the existing row's
 * message/severity rather than creating a duplicate.
 *
 * Anything previously persisted whose dedupeKey is NOT in the current
 * computed feed means the underlying condition is no longer true (the
 * approval was granted, the compliance item was renewed, the equipment
 * dropped out of high risk) - those rows are marked resolved: true rather
 * than deleted, so history and read/unread state survive. If a resolved
 * condition becomes active again later, it's un-resolved (resolved:
 * false) rather than creating a duplicate row.
 */
export const syncNotifications = async () => {
    const computed = await getNotifications();
    const currentKeys = computed.map((n) => `${n.type}:${n.refId}`);

    await Promise.all(
        computed.map((n) => {
            const dedupeKey = `${n.type}:${n.refId}`;
            return Notification.findOneAndUpdate(
                { dedupeKey },
                {
                    $set: {
                        type: n.type,
                        severity: n.severity,
                        message: n.message,
                        refId: n.refId,
                        resolved: false,
                        resolvedAt: null,
                    },
                    $setOnInsert: { dedupeKey, read: false },
                },
                { upsert: true, new: true }
            );
        })
    );

    // Resolve anything that used to be active but isn't in the current
    // computed feed anymore. Only touches rows that aren't already
    // resolved, and never touches `read`/`readAt`.
    await Notification.updateMany(
        { dedupeKey: { $nin: currentKeys }, resolved: false },
        { resolved: true, resolvedAt: new Date() }
    );

    return computed.length;
};

/**
 * @param {string|null} [userId] - reserved for per-user scoping once
 * notifications are targeted at specific recipients; currently all
 * notifications are org-wide (recipient: null) so this returns the full feed.
 * Only returns active (unresolved) notifications - a resolved one no
 * longer belongs in "recent" since it's no longer true.
 */
export const getRecentNotifications = async (userId, limit = 20) => {
    await syncNotifications();

    const notifications = await Notification.find({ resolved: false }).sort({ createdAt: -1 }).limit(limit);
    return notifications;
};

export const getUnreadCount = async (userId) => {
    await syncNotifications();
    return Notification.countDocuments({ read: false, resolved: false });
};

export const markRead = async (notificationId) => {
    return Notification.findByIdAndUpdate(
        notificationId,
        { read: true, readAt: new Date() },
        { new: true }
    );
};

export const markAllRead = async (userId) => {
    const result = await Notification.updateMany(
        { read: false },
        { read: true, readAt: new Date() }
    );
    return result.modifiedCount;
};

export default {
    getMaintenanceDueNotifications,
    getDocumentApprovalNotifications,
    getComplianceExpiryNotifications,
    getWorkflowUpdateNotifications,
    getAiNotifications,
    getNotifications,
    syncNotifications,
    getRecentNotifications,
    getUnreadCount,
    markRead,
    markAllRead,
};
