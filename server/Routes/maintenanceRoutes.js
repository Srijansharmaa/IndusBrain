import express from "express";
import {
    getEquipmentHealth,
    getRecommendedActions,
    getRecentIncidents,
} from "../controllers/maintenanceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/equipment-health", getEquipmentHealth);
router.get("/recommended-actions", getRecommendedActions);
router.get("/recent-incidents", getRecentIncidents);

export default router;
