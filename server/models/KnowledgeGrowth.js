import mongoose from "mongoose";

const knowledgeGrowthSchema = new mongoose.Schema(
    {
        month: { type: String, required: true },
        docs: { type: Number, required: true },
        ai: { type: Number, required: true },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.model("KnowledgeGrowth", knowledgeGrowthSchema);
