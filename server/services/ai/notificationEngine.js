import Equipment from "../../models/Equipment.js";
import ComplianceItem from "../../models/ComplianceItem.js";
import WorkflowTask from "../../models/WorkflowTask.js";
import Document from "../../models/Document.js";

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
 * @param {object} [user] - if provided, could be used to scope by plant/role in future; currently org-wide.
 */
export const getNotifications = async () => {
    const [maintenance, approvals, compliance, workflow] = await Promise.all([
        getMaintenanceDueNotifications(),
        getDocumentApprovalNotifications(),
        getComplianceExpiryNotifications(),
        getWorkflowUpdateNotifications(),
    ]);

    const all = [...maintenance, ...approvals, ...compliance, ...workflow];
    const severityRank = { high: 0, medium: 1, low: 2 };
    all.sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);

    return all;
};

export default {
    getMaintenanceDueNotifications,
    getDocumentApprovalNotifications,
    getComplianceExpiryNotifications,
    getWorkflowUpdateNotifications,
    getNotifications,
};
