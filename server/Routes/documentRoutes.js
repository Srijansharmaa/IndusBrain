import express from "express";
import { param } from "express-validator";

import upload from "../middleware/uploadMiddleware.js";
import validate from "../middleware/validateMiddleware.js";

import {
    uploadDocument,
    getDocuments,
    getDocumentById,
    deleteDocument,
} from "../controllers/documentController.js";

const router = express.Router();

const validateMongoId = [
    param("id").isMongoId().withMessage("Invalid document id"),
    validate,
];

// Upload a document
router.post("/upload", upload.single("file"), uploadDocument);

// Get all uploaded documents (optional ?page=&limit=&search=)
router.get("/", getDocuments);

// Get a single document
router.get("/:id", validateMongoId, getDocumentById);

// Delete a document
router.delete("/:id", validateMongoId, deleteDocument);

export default router;
