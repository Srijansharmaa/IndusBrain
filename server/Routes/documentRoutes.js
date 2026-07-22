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

// Get a single document
router.get("/:id", validateMongoId, getDocumentById);

// Retry AI processing for a document that previously failed
router.post("/:id/reprocess", validateMongoId, reprocessDocumentById);

// Delete a document
router.delete("/:id", validateMongoId, deleteDocument);

export default router;
