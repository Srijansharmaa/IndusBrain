import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        health: { type: Number, required: true, min: 0, max: 100 },
        risk: {
            type: String,
            enum: ["Low", "Medium", "High"],
            required: true,
        },
        failure: { type: Number, required: true }, // failure probability %
        temp: { type: [Number], default: [] }, // recent temperature trend
    },
    { timestamps: true }
);

export default mongoose.model("Equipment", equipmentSchema);
