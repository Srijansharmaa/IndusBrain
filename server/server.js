import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";
import documentRoutes from "./Routes/documentRoutes.js";
import searchRoutes from "./Routes/searchRoutes.js";
import authRoutes from "./Routes/authRoutes.js";
import adminRoutes from "./Routes/adminRoutes.js";
import analyticsRoutes from "./Routes/analyticsRoutes.js";
import complianceRoutes from "./Routes/complianceRoutes.js";
import copilotRoutes from "./Routes/copilotRoutes.js";
import graphRoutes from "./Routes/graphRoutes.js";
import maintenanceRoutes from "./Routes/maintenanceRoutes.js";
import dashboardRoutes from "./Routes/dashboardRoutes.js";
import errorHandler, { notFound } from "./middleware/errorMiddleware.js";
import { checkAiEngineHealth } from "./services/aiService.js";
import logger from "./utils/logger.js";

connectDB();

const app = express();

// ---------- Security & core middleware ----------
app.use(helmet());
// Comma-separated list of allowed frontend origins. Defaults to the Vite
// dev server so local development keeps working out of the box, but
// production deployments MUST set CLIENT_URL - an unrestricted cors()
// reflects any origin, which is unnecessary exposure for an API that
// serves authenticated, cookie-free (Bearer token) requests.
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173").split(",").map((o) => o.trim());
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "10mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Basic protection against brute-force / abuse on the public API surface.
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests, please try again later.",
    },
});
app.use("/api", apiLimiter);

// Tighter limit specifically on auth endpoints - login/register/session are
// the highest-value brute-force / credential-stuffing target on this API.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many authentication attempts, please try again later.",
    },
});
app.use("/api/auth", authLimiter);

// ---------- Routes ----------
app.get("/", (req, res) => {
    res.json({
        message: "IndusBrain Backend Running 🚀",
    });
});

app.get("/api/health", async (req, res) => {
    const aiEngine = await checkAiEngineHealth();

    res.json({
        success: true,
        server: "healthy",
        aiEngine,
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/compliance", complianceRoutes);
app.use("/api/copilot", copilotRoutes);
app.use("/api/graph", graphRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ---------- Error handling (must be last) ----------
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
