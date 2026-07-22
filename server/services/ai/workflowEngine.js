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

export const getTaskById = async (taskId) => {
    return WorkflowTask.findById(taskId).populate("document", "originalName").populate("assignedTo", "name role");
};

/**
 * Generic field edit (title/notes/assignedTo/document) - distinct from
 * updateTaskStatus, which is specifically the approve/reject/complete
 * lifecycle transition and logs differently.
 */
export const updateTask = async (taskId, fields = {}) => {
    const allowed = ["title", "notes", "assignedTo", "document"];
    const task = await WorkflowTask.findById(taskId);
    if (!task) return null;

    for (const key of allowed) {
        if (fields[key] !== undefined) task[key] = fields[key];
    }
    await task.save();
    return task;
};

export const deleteTask = async (taskId, actorId) => {
    const task = await WorkflowTask.findById(taskId);
    if (!task) return null;

    await task.deleteOne();
    await ActivityLog.create({
        message: `Workflow item deleted: ${task.title}`,
        type: "general",
        actor: actorId,
    });
    return task;
};

/**
 * Tasks assigned to a specific user - "My Tasks" view.
 */
export const getAssignedTasks = async (userId, { status } = {}) => {
    const filter = { assignedTo: userId };
    if (status) filter.status = status;

    const tasks = await WorkflowTask.find(filter).sort({ createdAt: -1 }).populate("document", "originalName");
    return tasks.map((t) => ({
        id: t._id,
        title: t.title,
        type: t.type,
        status: t.status,
        document: t.document?.originalName || null,
        createdAt: t.createdAt,
    }));
};

/**
 * Counts by type/status for a Workflow dashboard header.
 */
export const getWorkflowStats = async () => {
    const [byType, byStatus, total] = await Promise.all([
        WorkflowTask.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]),
        WorkflowTask.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
        WorkflowTask.countDocuments(),
    ]);

    return {
        total,
        byType: Object.fromEntries(byType.map((t) => [t._id, t.count])),
        byStatus: Object.fromEntries(byStatus.map((s) => [s._id, s.count])),
    };
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
    getTaskById,
    updateTask,
    updateTaskStatus,
    deleteTask,
    getAssignedTasks,
    getWorkflowStats,
    getPendingApprovals,
    getPendingReviews,
    getVersionHistory,
    getActivityTimeline,
    handleWorkflowQuery,
};
