import { searchDocuments } from "../services/aiService.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * @route POST /api/search
 * Body: { query: string, k?: number }
 */
export const semanticSearch = asyncHandler(async (req, res) => {
    const { query, k } = req.body;

    const result = await searchDocuments(query, k);

    res.json(result);
});
