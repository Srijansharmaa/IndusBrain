import mongoose from "mongoose";

/**
 * Generic key/value store for small pieces of config-shaped data that don't
 * warrant their own collection, e.g. the knowledge-graph "hero path"
 * (ordered list of node ids highlighted on first load) or the Copilot's
 * static welcome message.
 */
const configSchema = new mongoose.Schema(
    {
        key: { type: String, required: true, unique: true },
        value: { type: mongoose.Schema.Types.Mixed, required: true },
    },
    { timestamps: true }
);

export default mongoose.model("Config", configSchema);
