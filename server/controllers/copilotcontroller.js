import SuggestedQuery from "../models/SuggestedQuery.js";
import Config from "../models/Config.js";
import orchestrator from "../services/ai/orchestrator.js";
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
 * Goes through the central AI Orchestrator (server/services/ai/orchestrator.js)
 * rather than calling the AI Engine's /rag/ask directly. The Orchestrator
 * classifies intent first - a maintenance or compliance question gets
 * answered from MongoDB, and only queries that genuinely need document
 * knowledge fall through to the AI Engine's real RAG pipeline. This does
 * not re-implement retrieval or answer synthesis in Express - the AI
 * Engine already owns that logic; the Orchestrator only decides whether
 * to call it.
 *
 * Response shape is kept backward compatible with existing Copilot UI
 * consumers ({ answer: { text, sources } }), with the richer unified
 * fields (confidence, actions, recommendations, nextSuggestions) added
 * alongside for any UI that wants them.
 *
 * Known dependency risk: ai_engine/llm/gemini_llm.py raises at FastAPI
 * startup if GEMINI_API_KEY is not set, so /rag/ask (and therefore any
 * query the Orchestrator routes to it) is unavailable whenever that key
 * is missing. That surfaces here as a 502/504, not a silent failure.
 */
export const askCopilot = asyncHandler(async (req, res) => {
    const { query } = req.body;

    const result = await orchestrator.handleQuery({ query, req, sessionId: req.body.sessionId });

    res.json({
        success: result.success,
        answer: {
            text: result.answer,
            sources: result.sources,
            confidence: result.confidence,
            actions: result.actions,
            recommendations: result.recommendations,
            charts: result.charts,
        },
        type: result.type,
        nextSuggestions: result.nextSuggestions,
        metadata: result.metadata,
    });
});
