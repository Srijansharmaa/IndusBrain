import fs from "fs";
import Document from "../models/Document.js";
import { processDocument } from "../services/aiService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";

/**
 * @route POST /api/documents/upload
 * Upload a document and process it via the AI Engine.
 */
export const uploadDocument = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "No file uploaded.");
    }

    let aiResult;
    try {
        aiResult = await processDocument(req.file);
    } catch (error) {
        // If the AI engine rejected/failed on this file, don't leave an orphaned
        // upload sitting on disk with no matching processed record.
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        throw error;
    }

    const document = await Document.create({
        filename: req.file.filename,
        originalName: req.file.originalname,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        chunkCount: aiResult.total_chunks,
        analysis: aiResult.analysis || {},
        uploadedBy: req.user?._id,
    });

    res.status(201).json({
        success: true,
        message: "Document uploaded successfully.",
        document,
        aiResult,
    });
});

/**
 * @route GET /api/documents
 * Supports optional ?page=&limit=&search= query params.
 * Called with no params, behaves exactly as before (returns all documents,
 * newest first) so existing frontend calls are unaffected.
 */
export const getDocuments = asyncHandler(async (req, res) => {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 0, 100);
    const search = req.query.search?.trim();

    const filter = search
        ? { originalName: { $regex: search, $options: "i" } }
        : {};

    let query = Document.find(filter).sort({ createdAt: -1 });

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
