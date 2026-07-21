import express from "express";
import { body } from "express-validator";

import { semanticSearch } from "../controllers/searchController.js";
import validate from "../middleware/validateMiddleware.js";

const router = express.Router();

router.post(
    "/",
    [
        body("query")
            .trim()
            .notEmpty()
            .withMessage("A search query is required"),
        body("k")
            .optional()
            .isInt({ min: 1, max: 50 })
            .withMessage("k must be an integer between 1 and 50"),
    ],
    validate,
    semanticSearch
);

export default router;
