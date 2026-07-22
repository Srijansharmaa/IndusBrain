import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
    {
        message: { type: String, required: true },
        type: {
            type: String,
            enum: ["maintenance", "ai", "compliance", "document", "general"],
            default: "general",
        },
        actor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
    },
    { timestamps: true }
);

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ type: 1, createdAt: -1 });

export default mongoose.model("ActivityLog", activityLogSchema);
