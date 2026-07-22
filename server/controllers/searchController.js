import { searchDocuments } from "../services/aiService.js";
import SearchLog from "../models/SearchLog.js";
import asyncHandler from "../utils/asyncHandler.js";
import logger from "../utils/logger.js";

/**
 * @route POST /api/search
 * Body: { query: string, k?: number }
 */
export const semanticSearch = asyncHandler(async (req, res) => {
    const { query, k } = req.body;

    const result = await searchDocuments(query, k);

    // Best-effort logging for search analytics - never let a logging
    // failure affect the actual search response.
    SearchLog.create({
        query,
        resultCount: result?.results?.length || 0,
        user: req.user?._id,
    }).catch((err) => logger.warn("Failed to log search query:", err.message));

    res.json(result);
});
