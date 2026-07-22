import mongoose from "mongoose";

const suggestedQuerySchema = new mongoose.Schema(
    {
        text: { type: String, required: true },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.model("SuggestedQuery", suggestedQuerySchema);
