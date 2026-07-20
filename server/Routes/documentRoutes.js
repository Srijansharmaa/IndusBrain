import express from "express";

import upload from "../middleware/uploadMiddleware.js";

import {
    uploadDocument,
    getDocuments,
    getDocumentById,
    deleteDocument,
} from "../controllers/documentController.js";

const router = express.Router();

// Upload a document
router.post(
    "/upload",
    upload.single("file"),
    uploadDocument
);

// Get all uploaded documents
router.get(
    "/",
    getDocuments
);

// Get a single document
router.get(
    "/:id",
    getDocumentById
);
router.delete("/:id", deleteDocument);

export default router;