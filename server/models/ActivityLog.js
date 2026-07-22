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

export default mongoose.model("ActivityLog", activityLogSchema);
