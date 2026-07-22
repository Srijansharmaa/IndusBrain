import express from "express";
import { body, param } from "express-validator";

import {
    getAdminUsers,
    getAdminMetrics,
    getActivityLog,
    inviteUser,
    updateAdminUser,
    deleteAdminUser,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.get("/users", getAdminUsers);
router.get("/metrics", getAdminMetrics);
router.get("/activity-log", getActivityLog);

router.post(
    "/users/invite",
    [
        body("email").isEmail().withMessage("A valid email is required"),
        body("role")
            .isIn(["maint", "plant", "safety", "compliance", "quality", "admin"])
            .withMessage("Invalid role"),
    ],
    validate,
    inviteUser
);

router.patch(
    "/users/:id",
    [
        param("id").isMongoId().withMessage("Invalid user id"),
        body("role")
            .optional()
            .isIn(["maint", "plant", "safety", "compliance", "quality", "admin"])
            .withMessage("Invalid role"),
        body("status")
            .optional()
            .isIn(["Active", "Invited", "Suspended"])
            .withMessage("Invalid status"),
    ],
    validate,
    updateAdminUser
);

router.delete(
    "/users/:id",
    [param("id").isMongoId().withMessage("Invalid user id")],
    validate,
    deleteAdminUser
);

export default router;
