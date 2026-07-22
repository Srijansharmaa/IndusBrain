import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        logger.error("MONGO_URI is not set in the environment. See .env.example.");
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        logger.info("MongoDB Connected");
    } catch (err) {
        logger.error("MongoDB connection failed:", err.message);
        process.exit(1);
    }
};

export default connectDB;
