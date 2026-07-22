import { askRag, searchDocuments } from "../aiService.js";
import Document from "../../models/Document.js";
import escapeRegex from "../../utils/escapeRegex.js";
import logger from "../../utils/logger.js";

import { classifyIntent } from "./intentClassifier.js";
import { buildContext } from "./contextBuilder.js";
import { buildRagQuery, buildTrace } from "./promptManager.js";
import { formatResponse, formatError } from "./responseFormatter.js";
import { recordTurn } from "./conversationManager.js";
import { getRecommendations } from "./recommendationEngine.js";
import { getNotifications } from "./notificationEngine.js";

import * as maintenanceEngine from "./maintenanceEngine.js";
import * as complianceEngine from "./complianceEngine.js";
import * as analyticsEngine from "./analyticsEngine.js";
import * as dashboardEngine from "./dashboardEngine.js";
import * as workflowEngine from "./workflowEngine.js";

/**
 * AI Orchestrator
 *
 * The single entry point every AI-powered request in IndusBrain should go
 * through, mirroring how VS Code Copilot resolves a request:
 *
 *   query -> intent detection -> context collection -> route to the
 *   right engine (calling the existing RAG/Copilot service when the
 *   answer genuinely requires document knowledge) -> combine results ->
 *   one unified response.
 *
 * This file NEVER re-implements retrieval, embeddings, or generation -
 * askRag()/searchDocuments() (server/services/aiService.js) are the only
 * way it reaches AI-generated text, and they call straight into the
 * existing ai_engine microservice untouched.
 */

const sourcesFromRag = (ragResult) =>
    [...new Set((ragResult?.sources || []).map((s) => s.source).filter(Boolean))];

/**
 * Intents whose answer fundamentally requires document knowledge the AI
 * Engine's RAG pipeline owns, rather than structured Mongo data.
 */
const RAG_INTENTS = new Set(["general_copilot", "document_summary"]);

const handleSearchDocument = async ({ query }) => {
    const search = query.trim();
    const terms = search.split(/\s+/).filter((t) => t.length > 2).slice(0, 5);
    const wantsToday = /\btoday\b/i.test(search);

    const filter = {};
    if (wantsToday) {
        filter.createdAt = { $gte: new Date(new Date().setHours(0, 0, 0, 0)) };
    }
    if (terms.length && !wantsToday) {
        filter.originalName = new RegExp(terms.map(escapeRegex).join("|"), "i");
    }

    const documents = await Document.find(filter).sort({ createdAt: -1 }).limit(10).select(
        "originalName status fileType createdAt chunkCount"
    );

    if (documents.length === 0) {
        // Fall back to semantic search over document content, since a
        // filename-only match found nothing.
        const semantic = await searchDocuments(search, 5);
        const results = semantic?.results || [];
        return {
            answer: results.length
                ? `Found ${results.length} relevant passage(s) across your documents for "${search}".`
                : `No documents matched "${search}".`,
            confidence: results.length ? 75 : 40,
            sources: [...new Set(results.map((r) => r.metadata?.filename || r.metadata?.source).filter(Boolean))],
            metadata: { matchType: "semantic" },
        };
    }

    return {
        answer: `Found ${documents.length} document(s) matching "${search}".`,
        confidence: 88,
        sources: documents.map((d) => d.originalName),
        metadata: { matchType: "metadata", documentCount: documents.length },
        documents: documents.map((d) => ({
            id: d._id,
            name: d.originalName,
            status: d.status,
            fileType: d.fileType,
            chunkCount: d.chunkCount,
        })),
    };
};

const handleDocumentSummary = async ({ query, context }) => {
    const ragQuery = context.selectedDocument
        ? `Summarize the document. ${buildRagQuery(query, context)}`
        : buildRagQuery(query, context);

    const ragResult = await askRag(ragQuery);
    return {
        answer: ragResult?.answer || "I couldn't generate a summary from the knowledge base.",
        confidence: ragResult?.sources?.length ? 80 : 45,
        sources: sourcesFromRag(ragResult),
        metadata: { engine: "rag" },
    };
};

const handleGeneralCopilot = async ({ query, context }) => {
    const ragQuery = buildRagQuery(query, context);
    const ragResult = await askRag(ragQuery);

    return {
        answer: ragResult?.answer || "I couldn't find anything relevant to that in the knowledge base yet.",
        confidence: ragResult?.sources?.length ? 78 : 40,
        sources: sourcesFromRag(ragResult),
        metadata: { engine: "rag" },
    };
};

/**
 * Routes a classified intent to its engine. Every handler returns a
 * partial response object (answer, confidence, sources, metadata, and
 * optionally actions/charts/extra fields) which the orchestrator merges
 * into the unified response shape.
 */
const routeIntent = async (intent, { query, context, entities }) => {
    switch (intent) {
        case "maintenance":
            return maintenanceEngine.handleMaintenanceQuery({ query, entities });
        case "compliance":
            return complianceEngine.handleComplianceQuery({ query });
        case "report":
            // "report" almost always means compliance report in this
            // domain today; complianceEngine already attaches the
            // generate_compliance_report action when it detects the word.
            return complianceEngine.handleComplianceQuery({ query });
        case "dashboard":
            return dashboardEngine.handleDashboardQuery();
        case "analytics":
            return analyticsEngine.handleAnalyticsQuery({ query });
        case "workflow":
            return workflowEngine.handleWorkflowQuery({ query, user: context.user });
        case "search_document":
            return handleSearchDocument({ query });
        case "document_summary":
            return handleDocumentSummary({ query, context });
        case "recommendation":
            return { answer: "Here are some related items I found.", confidence: 75, sources: [], metadata: {} };
        case "general_copilot":
        default:
            return handleGeneralCopilot({ query, context });
    }
};

/**
 * @param {object} params
 * @param {string} params.query
 * @param {import("express").Request} params.req - authenticated request, used to build context
 * @param {string} [params.sessionId]
 */
export const handleQuery = async ({ query, req, sessionId }) => {
    if (!query || !query.trim()) {
        return formatError("A query is required.");
    }

    const classification = classifyIntent(query);
    const { intent, confidence: intentConfidence, entities } = classification;

    const context = await buildContext(req, { sessionId, context: req.body?.context });

    let domainResult;
    try {
        domainResult = await routeIntent(intent, { query, context, entities });
    } catch (error) {
        logger.error(`AI Orchestrator: ${intent} handler failed:`, error.message);
        return formatError(
            "Something went wrong while handling that request. Please try again.",
            intent,
            { error: error.message }
        );
    }

    // Recommendations ride along on every response type except pure RAG
    // chat, where "related items" would mostly just restate the sources
    // already returned.
    const recommendations = RAG_INTENTS.has(intent)
        ? []
        : await getRecommendations({ query, documentId: context.selectedDocument, userId: context.user?.id });

    const nextSuggestions = buildNextSuggestions(intent, domainResult);

    const response = formatResponse({
        type: intent,
        answer: domainResult.answer,
        confidence: domainResult.confidence ?? intentConfidence,
        sources: domainResult.sources || [],
        actions: domainResult.actions || [],
        recommendations,
        charts: domainResult.charts || [],
        nextSuggestions,
        metadata: {
            ...(domainResult.metadata || {}),
            trace: buildTrace(classification),
            sessionId: context.sessionId,
        },
    });

    try {
        await recordTurn({
            userId: context.user?.id,
            sessionId: context.sessionId,
            userQuery: query,
            intent,
            aiText: response.answer,
            documentIds: context.selectedDocument ? [context.selectedDocument] : [],
        });
    } catch (error) {
        // Conversation memory is best-effort - never let a persistence
        // failure take down an otherwise-successful answer.
        logger.warn("AI Orchestrator: failed to record conversation turn:", error.message);
    }

    return response;
};

const buildNextSuggestions = (intent, domainResult) => {
    switch (intent) {
        case "maintenance":
            return ["Show recommended actions", "Show recent incidents", "Generate compliance report"];
        case "compliance":
            return ["Show expiring items", "Generate compliance report"];
        case "dashboard":
            return ["Show analytics trends", "Show maintenance alerts"];
        case "analytics":
            return ["Show department activity", "Show knowledge growth"];
        case "workflow":
            return ["Show pending approvals", "Show activity timeline"];
        case "search_document":
            return domainResult.documents?.length ? ["Summarize this document", "Find similar documents"] : [];
        default:
            return [];
    }
};

/**
 * Exposes the live notification feed through the orchestrator's namespace
 * so a single import covers everything the Orchestrator fans out to,
 * per the architecture spec (Notification Engine included).
 */
export const getNotificationFeed = async () => getNotifications();

export default { handleQuery, getNotificationFeed };
