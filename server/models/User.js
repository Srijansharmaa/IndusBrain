import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 8,
            select: false,
        },
        role: {
            type: String,
            enum: ["maint", "plant", "safety", "compliance", "quality", "admin"],
            default: "maint",
        },
        plant: {
            type: String,
            default: null,
        },
        status: {
            type: String,
            enum: ["Active", "Invited", "Suspended"],
            default: "Active",
        },
    },
    { timestamps: true }
);

userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ name: "text", email: "text" });

userSchema.pre("save", async function hashPassword() {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
    return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        role: this.role,
        plant: this.plant,
        status: this.status,
        createdAt: this.createdAt,
    };
};

export default mongoose.model("User", userSchema);
