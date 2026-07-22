import SuggestedQuery from "../models/SuggestedQuery.js";
import Config from "../models/Config.js";
import { searchDocuments } from "../services/aiService.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getSuggestedQueries = asyncHandler(async (req, res) => {
    const queries = await SuggestedQuery.find().sort({ order: 1 });
    res.json({
        success: true,
        suggestedQueries: queries.map((q) => q.text),
    });
});

export const getInitialMessage = asyncHandler(async (req, res) => {
    const config = await Config.findOne({ key: "copilot.welcomeMessage" });

    res.json({
        success: true,
        message: config?.value || {
            role: "ai",
            text: "Hi, I'm your Knowledge Copilot. Ask me anything about your documents.",
        },
    });
});

/**
 * @route POST /api/copilot/ask
 * Real integration: runs the query through the FastAPI AI engine's
 * semantic search (/search) and turns the top retrieved chunks into an
 * answer object matching the shape the frontend already renders.
 * There is no generative/RAG-answer endpoint exposed by the AI engine
 * (ai_engine/app.py only exposes /search), so this synthesizes a
 * best-effort answer from the retrieved passages rather than fabricating
 * a fully generated response.
 */
export const askCopilot = asyncHandler(async (req, res) => {
    const { query } = req.body;

    const searchResult = await searchDocuments(query, 5);
    const results = searchResult?.results || [];

    if (results.length === 0) {
        return res.json({
            success: true,
            answer: {
                text: "I couldn't find anything relevant to that in the knowledge base yet.",
                confidence: 0,
                sources: [],
                actions: [],
            },
        });
    }

    const text = results
        .slice(0, 3)
        .map((r) => r.text)
        .join("\n\n");

    const sources = [
        ...new Set(
            results.map((r) => r.metadata?.filename || r.metadata?.source || r.id)
        ),
    ];

    const confidence = Math.round(results[0].score);

    res.json({
        success: true,
        answer: {
            text,
            confidence,
            sources,
            actions: [],
        },
    });
});
