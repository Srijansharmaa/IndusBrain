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
            enum: ["admin", "analytics", "compliance", "dashboard"],
            index: true,
        },
        // Only used within domain "dashboard" to distinguish the hero banner's
        // mini-stats from the four big stat cards below it, without needing a
        // separate collection for what is still just a labeled KPI value.
        group: {
            type: String,
            enum: ["hero", "cards", null],
            default: null,
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
