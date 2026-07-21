import express from "express";
import { body } from "express-validator";

import {
    getAdminUsers,
    getAdminMetrics,
    getActivityLog,
    inviteUser,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/users", getAdminUsers);
router.get("/metrics", getAdminMetrics);
router.get("/activity-log", getActivityLog);

router.post(
    "/users/invite",
    authorize("admin"),
    [
        body("email").isEmail().withMessage("A valid email is required"),
        body("role")
            .isIn(["maint", "plant", "safety", "compliance", "quality", "admin"])
            .withMessage("Invalid role"),
    ],
    validate,
    inviteUser
);

export default router;
