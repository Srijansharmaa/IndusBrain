import express from "express";
import { body, param } from "express-validator";

import {
    query,
    getConversation,
    newSession,
    clearConversation,
    getNotifications,
} from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";

const router = express.Router();

router.use(protect);

router.post(
    "/query",
    [
        body("query").trim().notEmpty().withMessage("A query is required"),
        body("sessionId").optional().isString(),
    ],
    validate,
    query
);

router.post("/conversation/new", newSession);

router.get(
    "/conversation/:sessionId",
    [param("sessionId").notEmpty()],
    validate,
    getConversation
);

router.delete(
    "/conversation/:sessionId",
    [param("sessionId").notEmpty()],
    validate,
    clearConversation
);

router.get("/notifications", getNotifications);

export default router;
