import express from "express";
import { param } from "express-validator";

import upload from "../middleware/uploadMiddleware.js";
import validate from "../middleware/validateMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

import {
    uploadDocument,
    getDocuments,
    getDocumentById,
    deleteDocument,
    reprocessDocumentById,
    getDocumentCategories,
    getRelatedDocuments,
    getDocumentSummary,
} from "../controllers/documentController.js";

const router = express.Router();

router.use(protect);

const validateMongoId = [
    param("id").isMongoId().withMessage("Invalid document id"),
    validate,
];

// Upload a document
router.post("/upload", upload.single("file"), uploadDocument);

// Get all uploaded documents (optional ?page=&limit=&search=)
router.get("/", getDocuments);

// Distinct file-type categories. Must be registered before "/:id" so
// "categories" isn't swallowed as a Mongo id.
router.get("/categories", getDocumentCategories);

// Get a single document
router.get("/:id", validateMongoId, getDocumentById);

// Related documents (metadata-based, no embeddings)
router.get("/:id/related", validateMongoId, getRelatedDocuments);

// AI-generated summary, delegated to the AI Engine's RAG pipeline
router.get("/:id/summary", validateMongoId, getDocumentSummary);

// Retry AI processing for a document that previously failed
router.post("/:id/reprocess", validateMongoId, reprocessDocumentById);

// Delete a document
router.delete("/:id", validateMongoId, deleteDocument);

export default router;
