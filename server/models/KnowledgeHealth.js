import mongoose from "mongoose";

const knowledgeHealthSchema = new mongoose.Schema(
    {
        area: { type: String, required: true },
        value: { type: Number, required: true },
    },
    { timestamps: true }
);

export default mongoose.model("KnowledgeHealth", knowledgeHealthSchema);
