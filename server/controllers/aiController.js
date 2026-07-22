import asyncHandler from "../utils/asyncHandler.js";
import orchestrator from "../services/ai/orchestrator.js";
import { createSessionId, resetConversation, getConversationContext } from "../services/ai/conversationManager.js";

/**
 * @route POST /api/ai/query
 * Body: { query: string, sessionId?: string, context?: object }
 *
 * The single entry point for every AI-powered feature in the frontend -
 * Copilot chat, "generate dashboard insights", "show maintenance
 * schedule", etc. all post here and get back the same unified response
 * shape from responseFormatter, regardless of which engine handled it.
 */
export const query = asyncHandler(async (req, res) => {
    const { query: userQuery, sessionId } = req.body;

    const response = await orchestrator.handleQuery({ query: userQuery, req, sessionId });

    res.json(response);
});

/**
 * @route GET /api/ai/conversation/:sessionId
 * Returns the rolling conversation window for a session, for a frontend
 * that wants to render chat history on reload.
 */
export const getConversation = asyncHandler(async (req, res) => {
    const context = await getConversationContext(req.user._id, req.params.sessionId);
    res.json({ success: true, conversation: context });
});

/**
 * @route POST /api/ai/conversation/new
 * Mints a fresh session id for the client to use on subsequent /query calls.
 */
export const newSession = asyncHandler(async (req, res) => {
    res.json({ success: true, sessionId: createSessionId() });
});

/**
 * @route DELETE /api/ai/conversation/:sessionId
 */
export const clearConversation = asyncHandler(async (req, res) => {
    await resetConversation(req.user._id, req.params.sessionId);
    res.json({ success: true, message: "Conversation cleared." });
});

/**
 * @route GET /api/ai/notifications
 * Live notification feed (Maintenance Due, Document Approval, Compliance
 * Expiry, Workflow Updates) computed from current data.
 */
export const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await orchestrator.getNotificationFeed();
    res.json({ success: true, notifications });
});

export default { query, getConversation, newSession, clearConversation, getNotifications };
