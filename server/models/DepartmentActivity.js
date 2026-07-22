import mongoose from "mongoose";

const departmentActivitySchema = new mongoose.Schema(
    {
        dept: { type: String, required: true },
        value: { type: Number, required: true },
    },
    { timestamps: true }
);

export default mongoose.model("DepartmentActivity", departmentActivitySchema);
