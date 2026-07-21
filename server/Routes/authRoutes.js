import express from "express";
import { body } from "express-validator";

import { register, login, session, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";

const router = express.Router();

router.post(
    "/register",
    [
        body("name").trim().notEmpty().withMessage("Name is required"),
        body("email").isEmail().withMessage("A valid email is required"),
        body("password")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters"),
    ],
    validate,
    register
);

router.post(
    "/login",
    [
        body("email").isEmail().withMessage("A valid email is required"),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    validate,
    login
);

router.post(
    "/session",
    [
        body("name").trim().notEmpty().withMessage("Name is required"),
        body("plant").trim().notEmpty().withMessage("Plant is required"),
        body("role")
            .isIn(["maint", "plant", "safety", "compliance", "quality", "admin"])
            .withMessage("Invalid role"),
    ],
    validate,
    session
);

router.get("/me", protect, getMe);

export default router;
