import dotenv from "dotenv";
const result = dotenv.config();
console.log("dotenv result:", result);
console.log("cwd:", process.cwd());
console.log("AI_ENGINE_URL from server.js:", process.env.AI_ENGINE_URL);

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import documentRoutes from "./routes/documentRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";
import searchRoutes from "./routes/searchRoutes.js";

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/documents", documentRoutes);
app.use(errorHandler);
app.use("/api/search", searchRoutes);


app.get("/", (req, res) => {
    res.json({
        message: "IndusBrain Backend Running 🚀"
    });
});
app.use((req,res)=>{
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});