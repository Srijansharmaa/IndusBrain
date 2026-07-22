import fs from "fs";
import Document from "../models/Document.js";
import { processDocument, reprocessDocument } from "../services/aiService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";
import escapeRegex from "../utils/escapeRegex.js";

/**
 * @route POST /api/documents/upload
 * Upload a document and process it via the AI Engine.
 *
 * The Document record is created BEFORE calling the AI engine so the file
 * always shows up in GET /api/documents, even if processing fails. On
 * failure the record is kept (status: "failed") with a human-readable
 * statusMessage instead of being deleted, and the uploaded file is kept on
 * disk so it can be retried via POST /api/documents/:id/reprocess.
 */
export const uploadDocument = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "No file uploaded.");
    }

    const document = await Document.create({
        filename: req.file.filename,
        originalName: req.file.originalname,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        status: "processing",
        uploadedBy: req.user?._id,
    });

    let aiResult;
    try {
        aiResult = await processDocument(req.file);
    } catch (error) {
        document.status = "failed";
        document.statusMessage = error.message || "AI engine failed to process this document.";
        await document.save();

        logger.warn(`Document ${document._id} failed AI processing: ${document.statusMessage}`);

        return res.status(201).json({
            success: true,
            message: "Document uploaded, but AI processing failed. It can be retried.",
            document,
        });
    }

    document.status = "completed";
    document.chunkCount = aiResult.total_chunks;
    document.analysis = aiResult.analysis || {};
    await document.save();

    res.status(201).json({
        success: true,
        message: "Document uploaded and processed successfully.",
        document,
        aiResult,
    });
});

/**
 * @route POST /api/documents/:id/reprocess
 * Retries AI processing for a document that previously failed (or needs to
 * be re-indexed), using FastAPI's existing /process-existing/{filename}.
 * The uploaded file must still exist on disk at document.filePath.
 */
export const reprocessDocumentById = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id);

    if (!document) {
        throw new ApiError(404, "Document not found");
    }

    if (!fs.existsSync(document.filePath)) {
        throw new ApiError(
            409,
            "Original file is no longer on disk; re-upload the document instead of reprocessing."
        );
    }

    document.status = "processing";
    document.statusMessage = null;
    await document.save();

    try {
        const aiResult = await reprocessDocument(document.filename);
        document.status = "completed";
        document.chunkCount = aiResult.total_chunks;
        document.analysis = aiResult.analysis || {};
        await document.save();

        return res.json({
            success: true,
            message: "Document reprocessed successfully.",
            document,
            aiResult,
        });
    } catch (error) {
        document.status = "failed";
        document.statusMessage = error.message || "AI engine failed to reprocess this document.";
        await document.save();
        throw error;
    }
});

const ALLOWED_DOCUMENT_SORT_FIELDS = new Set(["originalName", "fileSize", "chunkCount", "createdAt", "status"]);

/**
 * @route GET /api/documents
 * Supports optional ?page=&limit=&search=&sort= query params.
 * Called with no params, behaves exactly as before (returns all documents,
 * newest first) so existing frontend calls are unaffected.
 */
export const getDocuments = asyncHandler(async (req, res) => {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 0, 100);
    const search = req.query.search?.trim();

    const filter = search
        ? { originalName: { $regex: escapeRegex(search), $options: "i" } }
        : {};

    let sortField = "createdAt";
    let sortDir = -1;
    if (req.query.sort) {
        const raw = String(req.query.sort);
        const desc = raw.startsWith("-");
        const field = desc ? raw.slice(1) : raw;
        if (ALLOWED_DOCUMENT_SORT_FIELDS.has(field)) {
            sortField = field;
            sortDir = desc ? -1 : 1;
        }
    }

    let query = Document.find(filter).sort({ [sortField]: sortDir });

    if (limit) {
        query = query.skip((page - 1) * limit).limit(limit);
    }

    const [documents, total] = await Promise.all([
        query,
        Document.countDocuments(filter),
    ]);

    res.json({
        success: true,
        documents,
        total,
        page: limit ? page : undefined,
        pages: limit ? Math.ceil(total / limit) : undefined,
    });
});

/**
 * @route GET /api/documents/:id
 */
export const getDocumentById = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id);

    if (!document) {
        throw new ApiError(404, "Document not found");
    }

    res.json({
        success: true,
        document,
    });
});

/**
 * @route DELETE /api/documents/:id
 */
export const deleteDocument = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id);

    if (!document) {
        throw new ApiError(404, "Document not found");
    }

    if (document.filePath && fs.existsSync(document.filePath)) {
        try {
            fs.unlinkSync(document.filePath);
        } catch (err) {
            // Don't fail the whole request just because the file cleanup failed;
            // the DB record is the source of truth for the frontend.
            logger.warn(`Failed to remove file ${document.filePath}:`, err.message);
        }
    }

    await Document.findByIdAndDelete(req.params.id);

    res.json({
        success: true,
        message: "Document deleted successfully",
    });
});
