import express from "express";
import {
    getKnowledgeGrowth,
    getDepartmentActivity,
    getKnowledgeHealthRadar,
    getAnalyticsMetrics,
} from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/knowledge-growth", getKnowledgeGrowth);
router.get("/department-activity", getDepartmentActivity);
router.get("/knowledge-health", getKnowledgeHealthRadar);
router.get("/metrics", getAnalyticsMetrics);

export default router;
