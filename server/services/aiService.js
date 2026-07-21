import "dotenv/config";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";

const AI_ENGINE_URL = process.env.AI_ENGINE_URL;
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
    const AI_ENGINE_URL = process.env.AI_ENGINE_URL;

    console.log("========== DEBUG ==========");
    console.log("AI_ENGINE_URL:", AI_ENGINE_URL);
    console.log("File path:", file.path);
    console.log("File exists:", fs.existsSync(file.path));
    console.log("Final URL:", `${AI_ENGINE_URL}/process-document`);

    const formData = new FormData();

    formData.append(
      "file",
      fs.createReadStream(file.path),
      file.originalname
    );

    const response = await axios.post(
      `${AI_ENGINE_URL}/process-document`,
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

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
