import mongoose from "mongoose";

/**
 * Backs the Workflow Engine (approvals, reviews, version bumps, task
 * assignment). Kept intentionally generic - `type` distinguishes the four
 * workflow kinds called for in the spec instead of four separate
 * collections, since they share the same lifecycle (pending -> in review ->
 * resolved) and the same timeline/notification needs.
 */
const workflowTaskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        type: {
            type: String,
            enum: ["approval", "review", "version", "task"],
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: ["pending", "in_progress", "approved", "rejected", "completed"],
            default: "pending",
            index: true,
        },
        document: { type: mongoose.Schema.Types.ObjectId, ref: "Document", default: null },
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
        notes: { type: String, default: null },
        version: { type: Number, default: 1 },
    },
    { timestamps: true }
);

workflowTaskSchema.index({ createdAt: -1 });

export default mongoose.model("WorkflowTask", workflowTaskSchema);
