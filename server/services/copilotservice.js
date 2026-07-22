import aiClient from "./aiClient.js";

export const askCopilot = async (query) => {
  try {
    const { data } = await aiClient.post("/rag/ask", {
      query,
    });

    return data;

  } catch (error) {

    console.error("Copilot Error:");

    if (error.response) {
      console.error(error.response.status);
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }

    throw new Error("Failed to communicate with AI Copilot.");
  }
};
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

export const askCopilot = async (query, sessionId) => {
  try {
    console.log("Sending:", { query, sessionId });

    const res = await api.post("/copilot/ask", {
      query,
      sessionId,
    });

    console.log("Response:", res.data);

    return {
      ...res.data.answer,
      type: res.data.type,
      nextSuggestions: res.data.nextSuggestions,
      metadata: res.data.metadata,
    };
  } catch (err) {
    console.error("========== COPILOT ERROR ==========");
    console.error("Status:", err.response?.status);
    console.error("Data:", err.response?.data);
    console.error("Message:", err.message);
    throw err;
  }
};
