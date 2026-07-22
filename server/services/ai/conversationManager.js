import crypto from "crypto";
import Conversation from "../../models/Conversation.js";

// Bounded window: keep the conversation document small and the context
// payload sent to contextBuilder/promptManager cheap to assemble.
const MAX_MESSAGES = 20;

const REFERENCE_LIMIT = 10;

export const createSessionId = () => crypto.randomUUID();

/**
 * Fetches (or lazily creates) the conversation doc for a user's session.
 * A session is scoped to a single user - two users never share memory.
 */
export const getOrCreateConversation = async (userId, sessionId) => {
    const sid = sessionId || createSessionId();

    let conversation = await Conversation.findOne({ user: userId, sessionId: sid });
    if (!conversation) {
        conversation = await Conversation.create({ user: userId, sessionId: sid });
    }
    return conversation;
};

/**
 * Returns the slice of conversation state the orchestrator needs to reason
 * about follow-up queries, without loading the full Mongo document shape.
 */
export const getConversationContext = async (userId, sessionId) => {
    if (!sessionId) {
        return {
            sessionId: createSessionId(),
            currentTopic: null,
            recentQueries: [],
            referencedDocuments: [],
            recentAiResponses: [],
            messages: [],
        };
    }

    const conversation = await Conversation.findOne({ user: userId, sessionId });
    if (!conversation) {
        return {
            sessionId,
            currentTopic: null,
            recentQueries: [],
            referencedDocuments: [],
            recentAiResponses: [],
            messages: [],
        };
    }

    return {
        sessionId: conversation.sessionId,
        currentTopic: conversation.currentTopic,
        recentQueries: conversation.messages
            .filter((m) => m.role === "user")
            .slice(-5)
            .map((m) => m.text),
        referencedDocuments: conversation.referencedDocuments,
        recentAiResponses: conversation.messages
            .filter((m) => m.role === "ai")
            .slice(-3)
            .map((m) => m.text),
        messages: conversation.messages,
    };
};

/**
 * Appends a user turn + the AI's answer to the session, updates the
 * derived "current topic" (just the latest user query, cheap and good
 * enough for follow-up resolution), and trims the window.
 */
export const recordTurn = async ({
    userId,
    sessionId,
    userQuery,
    intent,
    aiText,
    documentIds = [],
}) => {
    const conversation = await getOrCreateConversation(userId, sessionId);

    conversation.messages.push({ role: "user", text: userQuery, intent, documentIds });
    conversation.messages.push({ role: "ai", text: aiText, intent, documentIds });

    if (conversation.messages.length > MAX_MESSAGES) {
        conversation.messages = conversation.messages.slice(-MAX_MESSAGES);
    }

    conversation.currentTopic = userQuery;

    if (documentIds.length) {
        const merged = [...documentIds.map(String), ...conversation.referencedDocuments.map(String)];
        conversation.referencedDocuments = [...new Set(merged)].slice(0, REFERENCE_LIMIT);
    }

    conversation.lastActivityAt = new Date();
    await conversation.save();

    return conversation;
};

export const resetConversation = async (userId, sessionId) => {
    await Conversation.deleteOne({ user: userId, sessionId });
};

export default {
    createSessionId,
    getOrCreateConversation,
    getConversationContext,
    recordTurn,
    resetConversation,
};
