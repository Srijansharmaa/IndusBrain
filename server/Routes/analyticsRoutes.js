import express from "express";
import {
    getKnowledgeGrowth,
    getDepartmentActivity,
    getKnowledgeHealthRadar,
    getAnalyticsMetrics,
    getDocumentStatistics,
    getSearchAnalytics,
    getGraphMetrics,
    getCopilotUsage,
    getMaintenanceAnalytics,
    getComplianceAnalytics,
} from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/knowledge-growth", getKnowledgeGrowth);
router.get("/department-activity", getDepartmentActivity);
router.get("/knowledge-health", getKnowledgeHealthRadar);
router.get("/metrics", getAnalyticsMetrics);
router.get("/document-stats", getDocumentStatistics);
router.get("/search-analytics", getSearchAnalytics);
router.get("/graph-metrics", getGraphMetrics);
router.get("/copilot-usage", getCopilotUsage);
router.get("/maintenance-analytics", getMaintenanceAnalytics);
router.get("/compliance-analytics", getComplianceAnalytics);

export default router;
