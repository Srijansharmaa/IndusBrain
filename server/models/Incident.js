import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema(
    {
        t: { type: String, required: true }, // incident title
        d: { type: String, required: true }, // display date string
    },
    { timestamps: true }
);

export default mongoose.model("Incident", incidentSchema);
