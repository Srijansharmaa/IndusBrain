import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
    {
        message: { type: String, required: true },
        actor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model("ActivityLog", activityLogSchema);
