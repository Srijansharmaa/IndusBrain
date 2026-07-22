import SuggestedQuery from "../models/SuggestedQuery.js";
import Config from "../models/Config.js";
import { askRag } from "../services/aiService.js";
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
 * Real integration: runs the query through the FastAPI AI engine's actual
 * RAG pipeline (/rag/ask), which retrieves relevant chunks AND generates a
 * Gemini-authored answer from them. This does not re-implement retrieval or
 * answer synthesis in Express - the AI engine already owns that logic.
 *
 * Known dependency risk: ai_engine/llm/gemini_llm.py raises at FastAPI
 * startup if GEMINI_API_KEY is not set, so /rag/ask (and therefore this
 * endpoint) is unavailable whenever that key is missing. That surfaces here
 * as a 502/504 from aiService's error handling, not a silent failure.
 */
export const askCopilot = asyncHandler(async (req, res) => {
    const { query } = req.body;

    const ragResult = await askRag(query);

    const sources = (ragResult?.sources || [])
        .map((s) => s.source)
        .filter(Boolean);
    const uniqueSources = [...new Set(sources)];

    res.json({
        success: true,
        answer: {
            text: ragResult?.answer || "I couldn't find anything relevant to that in the knowledge base yet.",
            sources: uniqueSources,
        },
    });
});
