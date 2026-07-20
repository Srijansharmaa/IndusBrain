import Document from "../models/Document.js";
import { processDocument } from "../services/aiService.js";

/**
 * Upload a document and process it using the AI Engine
 */
export const uploadDocument = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded."
            });
        }

        // Send file to FastAPI
        const aiResult = await processDocument(req.file);

        // Save metadata + AI response
        const document = await Document.create({
            filename: req.file.filename,
            originalName: req.file.originalname,
            filePath: req.file.path,
            fileType: req.file.mimetype,
            chunkCount: aiResult.total_chunks,
            analysis: aiResult.analysis || {}
        });

        return res.status(201).json({
            success: true,
            message: "Document uploaded successfully.",
            document,
            aiResult
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
            stack: error.stack,
        });
    }
};
/**
 * Get all uploaded documents
 */
export const getDocuments = async (req, res) => {

    try {

        const documents = await Document.find()
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            documents
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }

};
/**
 * Get one document
 */
export const getDocumentById = async (req, res) => {

    try {

        const document = await Document.findById(req.params.id);

        if (!document) {

            return res.status(404).json({
                success: false,
                message: "Document not found"
            });

        }

        res.json({
            success: true,
            document
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }

};
import fs from "fs";

export const deleteDocument = async (req, res) => {
    try {

        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        if (fs.existsSync(document.filePath)) {
            fs.unlinkSync(document.filePath);
        }

        await Document.findByIdAndDelete(req.params.id);

        return res.json({
            success: true,
            message: "Document deleted successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};