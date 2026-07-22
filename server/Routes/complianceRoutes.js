import express from "express";
import {
    getComplianceItems,
    getComplianceMetrics,
    generateComplianceReport,
    getAuditTimeline,
    getPendingAudits,
    getViolations,
    getRiskAssessment,
    getComplianceRecommendations,
} from "../controllers/complianceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/items", getComplianceItems);
router.get("/metrics", getComplianceMetrics);
router.post("/report", generateComplianceReport);
router.get("/audit-timeline", getAuditTimeline);
router.get("/pending-audits", getPendingAudits);
router.get("/violations", getViolations);
router.get("/risk-assessment", getRiskAssessment);
router.get("/recommendations", getComplianceRecommendations);

export default router;
