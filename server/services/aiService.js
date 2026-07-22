import "dotenv/config";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";

const AI_ENGINE_URL = process.env.AI_ENGINE_URL;
console.log("AI_ENGINE_URL =", AI_ENGINE_URL);
const AI_REQUEST_TIMEOUT_MS = Number(process.env.AI_REQUEST_TIMEOUT_MS) || 60000;

const aiClient = axios.create({
    baseURL: AI_ENGINE_URL,
    timeout: AI_REQUEST_TIMEOUT_MS,
});

const handleAiEngineError = (error, context) => {
    if (error.response) {
        // FastAPI returned an error response (e.g. unsupported file type)
        const detail = error.response.data?.detail || error.response.statusText;
        logger.error(`AI engine error during ${context}:`, detail);
        throw new ApiError(error.response.status, `AI engine error: ${detail}`);
    }

    if (error.code === "ECONNABORTED") {
        logger.error(`AI engine timeout during ${context}`);
        throw new ApiError(504, "AI engine took too long to respond");
    }

    logger.error(`AI engine unreachable during ${context}:`, error.message);
    throw new ApiError(502, "Could not reach the AI engine. Please make sure it is running.");
};

/**
 * Sends an uploaded file to FastAPI's /process-document endpoint.
 */
export const processDocument = async (file) => {
    try {
        const formData = new FormData();
        formData.append("file", fs.createReadStream(file.path), file.originalname);

        const response = await aiClient.post("/process-document", formData, {
            headers: formData.getHeaders(),
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
        });

        return response.data;
    } catch (error) {
        handleAiEngineError(error, "document processing");
    }
};

/**
 * Runs a semantic search query against FastAPI's /search endpoint.
 */
export const searchDocuments = async (query, k = 5) => {
    try {
        const response = await aiClient.post("/search", { query, k });
        return response.data;
    } catch (error) {
        handleAiEngineError(error, "semantic search");
    }
};

/**
 * Re-runs an already-uploaded file through FastAPI's /process-existing/{filename}
 * endpoint. Used to retry documents that failed AI processing on first upload.
 */
export const reprocessDocument = async (filename) => {
    try {
        const response = await aiClient.post(`/process-existing/${encodeURIComponent(filename)}`);
        return response.data;
    } catch (error) {
        handleAiEngineError(error, "document reprocessing");
    }
};

/**
 * Runs a query through FastAPI's real RAG pipeline (/rag/ask), which retrieves
 * relevant chunks and generates a Gemini-authored answer. This is the endpoint
 * the Copilot must use; do not fall back to re-implementing answer synthesis
 * from raw /search results here.
 */
export const askRag = async (query) => {
    try {
        const response = await aiClient.post("/rag/ask", { query });
        return response.data;
    } catch (error) {
        handleAiEngineError(error, "RAG question answering");
    }
};

/**
 * Basic reachability check, used by /api/health.
 */
export const checkAiEngineHealth = async () => {
    try {
        const response = await aiClient.get("/health", { timeout: 5000 });
        return { reachable: true, status: response.data?.status || "unknown" };
    } catch (error) {
        return { reachable: false, status: "unreachable" };
    }
};
