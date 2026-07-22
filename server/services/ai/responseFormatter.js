/**
 * Response Formatter
 *
 * Guarantees every AI Orchestrator response - regardless of which engine
 * handled it - has the exact same top-level shape, so the frontend never
 * needs to branch on "which kind of answer is this".
 */

const DEFAULTS = {
    success: true,
    type: "general_copilot",
    answer: "",
    confidence: 0,
    sources: [],
    actions: [],
    recommendations: [],
    charts: [],
    metadata: {},
    nextSuggestions: [],
};

/**
 * @param {object} fields - any subset of the unified response shape
 */
export const formatResponse = (fields = {}) => {
    return {
        ...DEFAULTS,
        ...fields,
        success: fields.success !== undefined ? fields.success : true,
    };
};

/**
 * @param {number} statusCode
 * @param {string} message
 * @param {string} [type]
 */
export const formatError = (message, type = "general_copilot", metadata = {}) => {
    return formatResponse({
        success: false,
        type,
        answer: message,
        confidence: 0,
        metadata,
    });
};

export default { formatResponse, formatError };
