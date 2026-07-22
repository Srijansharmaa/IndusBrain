import mongoose from "mongoose";

const graphNodeSchema = new mongoose.Schema(
    {
        nodeId: { type: String, required: true, unique: true },
        type: {
            type: String,
            enum: ["equipment", "incident", "document", "recommendation", "person"],
            required: true,
        },
        label: { type: String, required: true },
        x: { type: Number, required: true },
        y: { type: Number, required: true },
    },
    { timestamps: true }
);

graphNodeSchema.index({ type: 1 });
graphNodeSchema.index({ label: "text" });

export default mongoose.model("GraphNode", graphNodeSchema);
