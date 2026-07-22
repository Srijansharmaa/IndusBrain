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

export const askCopilot = asyncHandler(async (req, res) => {
    const { query } = req.body;

    const ragResult = await askRAG(query);
    const results = ragResult?.results || [];

    if (results.length === 0) {
        res.json({

    success: true,

    answer: {

        text: ragResult.answer,

        confidence: ragResult.confidence,

        sources: ragResult.sources,

        actions: ragResult.recommended_actions,

        entities: ragResult.entities

    }

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
