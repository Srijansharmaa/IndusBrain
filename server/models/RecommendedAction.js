import mongoose from "mongoose";

const recommendedActionSchema = new mongoose.Schema(
    {
        t: { type: String, required: true }, // action text
        p: {
            type: String,
            enum: ["Critical", "High", "Normal"],
            required: true,
        },
        c: {
            type: String,
            enum: ["danger", "warning", "success"],
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("RecommendedAction", recommendedActionSchema);
