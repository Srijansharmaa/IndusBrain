import express from "express";
import { body } from "express-validator";
import {
    getSuggestedQueries,
    getInitialMessage,
    askCopilot,
} from "../controllers/copilotController.js";
import { protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/suggested-queries", getSuggestedQueries);
router.get("/welcome-message", getInitialMessage);

router.post(
    "/ask",
    [
        body("query").trim().notEmpty().withMessage("A query is required"),
        body("sessionId").optional().isString(),
    ],
    validate,
    askCopilot
);

export default router;
