import express from "express";
import { param } from "express-validator";
import {
    getEquipmentHealth,
    getRecommendedActions,
    getRecentIncidents,
    getMaintenanceTimeline,
    getPredictiveMaintenance,
    getEquipmentRelationships,
    getMaintenanceStats,
} from "../controllers/maintenanceController.js";
import { protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/equipment-health", getEquipmentHealth);
router.get("/recommended-actions", getRecommendedActions);
router.get("/recent-incidents", getRecentIncidents);
router.get("/timeline", getMaintenanceTimeline);
router.get("/predictive", getPredictiveMaintenance);
router.get(
    "/equipment/:name/relationships",
    [param("name").trim().notEmpty()],
    validate,
    getEquipmentRelationships
);
router.get("/stats", getMaintenanceStats);

export default router;
