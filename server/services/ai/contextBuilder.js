import Document from "../../models/Document.js";
import { roleLabel, plantLabel } from "../../utils/labels.js";
import { getConversationContext } from "./conversationManager.js";

const RECENT_DOCUMENTS_LIMIT = 5;

/**
 * Pulls the user's most recently touched documents. "Touched" here means
 * uploaded by them - the schema has no per-user "viewed" tracking, so this
 * is the closest honest signal available without inventing new data.
 */
const getRecentDocuments = async (userId) => {
    if (!userId) return [];

    const docs = await Document.find({ uploadedBy: userId })
        .sort({ updatedAt: -1 })
        .limit(RECENT_DOCUMENTS_LIMIT)
        .select("_id originalName status fileType updatedAt");

    return docs.map((d) => ({
        id: d._id,
        name: d.originalName,
        status: d.status,
        fileType: d.fileType,
        updatedAt: d.updatedAt,
    }));
};

/**
 * Builds the single context object every AI Orchestrator request is
 * evaluated against: who's asking, from where, with what they're already
 * looking at, and what's happened earlier in this conversation.
 *
 * @param {import("express").Request} req - authenticated request (req.user set by `protect`)
 * @param {object} [body] - orchestrator request body (query, sessionId, context overrides)
 */
export const buildContext = async (req, body = {}) => {
    const user = req.user;
    const clientContext = body.context || {};

    const [recentDocuments, conversation] = await Promise.all([
        getRecentDocuments(user?._id),
        getConversationContext(user?._id, body.sessionId),
    ]);

    return {
        user: user
            ? {
                  id: user._id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                  roleLabel: roleLabel(user.role),
                  plant: user.plant,
              }
            : null,
        department: user?.plant || null,
        role: user?.role || null,
        organization: {
            plant: user?.plant || null,
            plantLabel: user?.plant ? plantLabel(user.plant) : null,
        },
        currentPage: clientContext.page || null,
        selectedDocument: clientContext.selectedDocumentId || null,
        recentDocuments,
        conversationHistory: conversation.messages,
        currentTopic: conversation.currentTopic,
        recentQueries: conversation.recentQueries,
        referencedDocuments: conversation.referencedDocuments,
        currentFilters: clientContext.filters || {},
        equipment: clientContext.equipment || null,
        sessionId: conversation.sessionId,
    };
};

export default buildContext;
