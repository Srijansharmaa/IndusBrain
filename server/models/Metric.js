import mongoose from "mongoose";

/**
 * Generic KPI-card metric, reused across admin / analytics / compliance
 * dashboards. `domain` scopes which dashboard a metric belongs to.
 */
const metricSchema = new mongoose.Schema(
    {
        domain: {
            type: String,
            required: true,
            enum: ["admin", "analytics", "compliance"],
            index: true,
        },
        label: { type: String, required: true },
        value: { type: String, required: true },
        delta: { type: String, default: null },
        up: { type: Boolean, default: null },
        icon: { type: String, default: null },
        color: { type: String, default: "primary" },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.model("Metric", metricSchema);
