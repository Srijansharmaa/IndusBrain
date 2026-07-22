import mongoose from "mongoose";

const graphEdgeSchema = new mongoose.Schema(
    {
        from: { type: String, required: true },
        to: { type: String, required: true },
    },
    { timestamps: true }
);

graphEdgeSchema.index({ from: 1 });
graphEdgeSchema.index({ to: 1 });

export default mongoose.model("GraphEdge", graphEdgeSchema);
