import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

<<<<<<< HEAD
        console.log("✅ MongoDB Connected");
=======
        console.log("MongoDB Connected");
>>>>>>> ff47bab (Add copilot and dashboard improvements)
    } catch (err) {
        console.error("MongoDB Error:", err.message);
        process.exit(1);
    }
};

export default connectDB;