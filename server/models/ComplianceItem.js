import mongoose from "mongoose";

const complianceItemSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        status: {
            type: String,
            enum: ["Valid", "Expiring", "Expired"],
            required: true,
        },
        exp: { type: String, required: true }, // display string, e.g. "18 Aug 2026"
        risk: {
            type: String,
            enum: ["Low", "Medium", "High"],
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("ComplianceItem", complianceItemSchema);
