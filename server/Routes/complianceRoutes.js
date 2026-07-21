import express from "express";
import {
    getComplianceItems,
    getComplianceMetrics,
    generateComplianceReport,
} from "../controllers/complianceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/items", getComplianceItems);
router.get("/metrics", getComplianceMetrics);
router.post("/report", generateComplianceReport);

export default router;
