/**
 * Intent Classifier
 *
 * Lightweight, dependency-free intent detection for the AI Orchestrator.
 * This intentionally does NOT call an LLM to classify intent - that would
 * add latency and a second AI round-trip for something a rule table
 * handles reliably for a known, closed set of enterprise intents. If a
 * query doesn't match any domain pattern, it falls through to
 * "general_copilot" so the real RAG pipeline (ai_engine) always has the
 * final say on anything domain rules can't confidently route.
 *
 * Each rule is tried in priority order; the first match wins. Rules are
 * ordered most-specific-first so e.g. "compliance report for pump P101"
 * resolves to "report" rather than "maintenance".
 */

const INTENTS = [
    "search_document",
    "maintenance",
    "compliance",
    "dashboard",
    "analytics",
    "workflow",
    "report",
    "document_summary",
    "recommendation",
    "general_copilot",
];

const RULES = [
    {
        intent: "report",
        keywords: [
            "generate report",
            "compliance report",
            "export report",
            "download report",
            "generate a report",
            "create a report",
        ],
        patterns: [/\bgenerate\s+.*\breport\b/i, /\breport\b.*\bexport\b/i],
    },
    {
        intent: "document_summary",
        keywords: ["summarize", "summarise", "summary of", "tl;dr", "give me a summary"],
        patterns: [/\bsummar(y|ize|ise)\b/i],
    },
    {
        intent: "maintenance",
        keywords: [
            "maintenance",
            "equipment health",
            "pump",
            "compressor",
            "turbine",
            "failure probability",
            "breakdown",
            "incident",
            "schedule",
            "recommended action",
        ],
        patterns: [/\b(p\d{2,4}|equip(ment)?)\b/i, /what happened to/i],
    },
    {
        intent: "compliance",
        keywords: [
            "compliance",
            "certificate",
            "certification",
            "expiry",
            "expiring",
            "audit",
            "regulation",
            "regulatory",
        ],
        patterns: [/\bcompliance\b/i],
    },
    {
        intent: "workflow",
        keywords: [
            "approve",
            "approval",
            "review",
            "assign",
            "task",
            "version history",
            "sign off",
            "pending approval",
        ],
        patterns: [/\bassign(ed)?\b/i, /\bapprov(e|al|ed)\b/i],
    },
    {
        intent: "dashboard",
        keywords: ["dashboard", "overview", "insights", "kpi", "summary of the plant", "hero stats"],
        patterns: [/\bdashboard\b/i, /\bgenerate\b.*\binsights?\b/i],
    },
    {
        intent: "analytics",
        keywords: [
            "analytics",
            "trend",
            "trends",
            "usage",
            "growth",
            "statistics",
            "stats",
            "department activity",
            "knowledge growth",
        ],
        patterns: [/\banalytic/i, /\btrend/i],
    },
    {
        intent: "recommendation",
        keywords: [
            "similar",
            "related",
            "recommend",
            "suggest",
            "find similar",
            "sop",
            "frequently viewed",
            "recently accessed",
        ],
        patterns: [/\bsimilar\b/i, /\brecommend/i],
    },
    {
        intent: "search_document",
        keywords: [
            "show documents",
            "find document",
            "search for",
            "uploaded today",
            "list documents",
            "documents uploaded",
        ],
        patterns: [/\bdocuments?\b.*\b(uploaded|today|list|show)\b/i],
    },
];

const scoreRule = (rule, normalizedQuery) => {
    let score = 0;
    let matched = [];

    for (const kw of rule.keywords) {
        if (normalizedQuery.includes(kw)) {
            score += 2;
            matched.push(kw);
        }
    }

    for (const pattern of rule.patterns || []) {
        if (pattern.test(normalizedQuery)) {
            score += 3;
            matched.push(pattern.toString());
        }
    }

    return { score, matched };
};

/**
 * Pulls an equipment-like token (e.g. "P101", "Pump P101") out of the
 * query so downstream engines can filter without re-parsing the string.
 */
const extractEquipmentMention = (query) => {
    const match = query.match(/\b([A-Za-z]{1,4}-?\d{2,4}[A-Za-z]?)\b/);
    return match ? match[1].toUpperCase() : null;
};

/**
 * @param {string} query
 * @returns {{ intent: string, confidence: number, matchedKeywords: string[], entities: object, alternatives: Array<{intent:string, score:number}> }}
 */
export const classifyIntent = (query) => {
    if (!query || typeof query !== "string" || !query.trim()) {
        return {
            intent: "general_copilot",
            confidence: 0,
            matchedKeywords: [],
            entities: {},
            alternatives: [],
        };
    }

    const normalized = query.toLowerCase().trim();

    const scored = RULES.map((rule) => ({
        intent: rule.intent,
        ...scoreRule(rule, normalized),
    })).filter((r) => r.score > 0);

    scored.sort((a, b) => b.score - a.score);

    const entities = {};
    const equipment = extractEquipmentMention(query);
    if (equipment) entities.equipment = equipment;

    if (scored.length === 0) {
        return {
            intent: "general_copilot",
            confidence: 40,
            matchedKeywords: [],
            entities,
            alternatives: [],
        };
    }

    const top = scored[0];
    // Simple confidence heuristic: more/stronger matches -> higher
    // confidence, capped so the classifier never claims false certainty.
    const confidence = Math.min(95, 55 + top.score * 8);

    return {
        intent: top.intent,
        confidence,
        matchedKeywords: top.matched,
        entities,
        alternatives: scored.slice(1, 3).map((s) => ({ intent: s.intent, score: s.score })),
    };
};

export const SUPPORTED_INTENTS = INTENTS;

export default classifyIntent;
