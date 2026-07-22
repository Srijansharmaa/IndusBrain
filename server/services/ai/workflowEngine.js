import WorkflowTask from "../../models/WorkflowTask.js";
import ActivityLog from "../../models/ActivityLog.js";
import formatRelativeTime from "../../utils/formatRelativeTime.js";

/**
 * Workflow Engine
 *
 * Approval / review / task-assignment lifecycle backed by WorkflowTask,
 * plus version bumps (also modeled as a WorkflowTask of type "version" so
 * they share one timeline). The activity timeline itself reuses the
 * existing ActivityLog collection rather than introducing a parallel log.
 */

export const createTask = async ({ title, type, document, assignedTo, createdBy, notes }) => {
    const task = await WorkflowTask.create({ title, type, document, assignedTo, createdBy, notes });
    await ActivityLog.create({
        message: `${type === "approval" ? "Approval" : type === "review" ? "Review" : "Task"} requested: ${title}`,
        type: "general",
        actor: createdBy,
    });
    return task;
};

export const listTasks = async (filter = {}) => {
    return WorkflowTask.find(filter).sort({ createdAt: -1 }).populate("document", "originalName").populate("assignedTo", "name role");
};

export const updateTaskStatus = async (taskId, status, actorId) => {
    const task = await WorkflowTask.findById(taskId);
    if (!task) return null;

    task.status = status;
    if (task.type === "version" && status === "approved") task.version += 1;
    await task.save();

    await ActivityLog.create({
        message: `${task.title} marked ${status.replace("_", " ")}`,
        type: "general",
        actor: actorId,
    });

    return task;
};

export const getPendingApprovals = async () => {
    const tasks = await WorkflowTask.find({ type: "approval", status: { $in: ["pending", "in_progress"] } })
        .sort({ createdAt: -1 })
        .populate("document", "originalName");
    return tasks.map((t) => ({ id: t._id, title: t.title, status: t.status, document: t.document?.originalName || null }));
};

export const getPendingReviews = async () => {
    const tasks = await WorkflowTask.find({ type: "review", status: { $in: ["pending", "in_progress"] } })
        .sort({ createdAt: -1 })
        .populate("document", "originalName");
    return tasks.map((t) => ({ id: t._id, title: t.title, status: t.status, document: t.document?.originalName || null }));
};

export const getVersionHistory = async (documentId) => {
    const tasks = await WorkflowTask.find({ type: "version", document: documentId }).sort({ createdAt: 1 });
    return tasks.map((t) => ({ version: t.version, status: t.status, notes: t.notes, at: t.createdAt }));
};

export const getActivityTimeline = async (limit = 10) => {
    const activity = await ActivityLog.find().sort({ createdAt: -1 }).limit(limit);
    return activity.map((a) => ({ message: a.message, type: a.type, time: formatRelativeTime(a.createdAt) }));
};

export const handleWorkflowQuery = async ({ query, user }) => {
    const [pendingApprovals, pendingReviews, timeline] = await Promise.all([
        getPendingApprovals(),
        getPendingReviews(),
        getActivityTimeline(),
    ]);

    const answer = `${pendingApprovals.length} approval(s) and ${pendingReviews.length} review(s) are currently pending.`;

    return {
        answer,
        confidence: 80,
        metadata: { pendingApprovalCount: pendingApprovals.length, pendingReviewCount: pendingReviews.length },
        sources: [],
        actions: pendingApprovals.map((a) => ({ label: `Review approval: ${a.title}`, action: "open_approval", refId: a.id })),
        pendingApprovals,
        pendingReviews,
        timeline,
    };
};

export default {
    createTask,
    listTasks,
    updateTaskStatus,
    getPendingApprovals,
    getPendingReviews,
    getVersionHistory,
    getActivityTimeline,
    handleWorkflowQuery,
};
