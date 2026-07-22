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
    const config = await Config.findOne({
        key: "copilot.welcomeMessage",
    });

    res.json({
        success: true,
        message:
            config?.value || {
                role: "ai",
                text: "Hi, I'm your Knowledge Copilot. Ask me anything about your documents.",
            },
    });
});

export const askCopilot = asyncHandler(async (req, res) => {
    const { query, sessionId } = req.body;

    if (!query || !query.trim()) {
        return res.status(400).json({
            success: false,
            message: "Query is required.",
        });
    }

    console.log("========== COPILOT REQUEST ==========");
    console.log(req.body);

    const result = await orchestrator.handleQuery({
        query,
        req,
        sessionId,
    });

    console.log("========== ORCHESTRATOR RESULT ==========");
    console.log(result);

    return res.json({
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