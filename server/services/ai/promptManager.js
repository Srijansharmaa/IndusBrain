/**
 * Prompt Manager
 *
 * The AI Engine's /rag/ask endpoint takes a single `query` string - it owns
 * retrieval and generation, and this file must never re-implement either.
 * What it DOES own is deciding what text to put in that string: resolving
 * short follow-ups ("what about its last incident?") against conversation
 * history before they're sent, so the AI Engine's retriever gets a
 * self-contained question instead of a dangling pronoun.
 */

const FOLLOW_UP_PATTERN = /\b(it|that|this|those|them|its|their)\b/i;

const isLikelyFollowUp = (query) => {
    const trimmed = query.trim();
    // Short queries containing a pronoun, or queries that are just a
    // clarifying question, are the two shapes most likely to depend on
    // the previous turn.
    return (trimmed.split(/\s+/).length <= 8 && FOLLOW_UP_PATTERN.test(trimmed)) ||
        /^(and|what about|how about|why|when|who)\b/i.test(trimmed);
};

/**
 * @param {string} query - the raw user query
 * @param {object} context - output of contextBuilder.buildContext
 * @returns {string} the query text to send to askRag
 */
export const buildRagQuery = (query, context = {}) => {
    const topic = context.currentTopic;

    if (topic && isLikelyFollowUp(query)) {
        return `Previous question: "${topic}". Follow-up question: "${query}". Answer the follow-up question, using the previous question only for context.`;
    }

    return query;
};

/**
 * Builds a short, human-readable trace of how a query was resolved. Not
 * sent to the AI Engine - this is attached to the orchestrator response's
 * metadata for debuggability (why did this route where it routed).
 */
export const buildTrace = ({ intent, confidence, matchedKeywords, entities }) => ({
    intent,
    confidence,
    matchedKeywords,
    entities,
});

export default { buildRagQuery, buildTrace };
