import Document from "../../models/Document.js";
import Incident from "../../models/Incident.js";
import ComplianceItem from "../../models/ComplianceItem.js";
import RecommendedAction from "../../models/RecommendedAction.js";
import ActivityLog from "../../models/ActivityLog.js";
import escapeRegex from "../../utils/escapeRegex.js";

/**
 * Recommendation Engine
 *
 * Deliberately metadata-only, per spec: no embeddings, no vector search -
 * that's ai_engine/vector_db's job, not this one's. Everything here is
 * plain Mongo querying (text index / regex / recency / grouping) over
 * fields that already exist on Document, Incident, ComplianceItem, etc.
 */

const SOP_HINT = /\bsop\b|\bstandard operating procedure\b/i;

export const getRelatedDocuments = async ({ documentId, query } = {}, limit = 5) => {
    if (documentId) {
        const source = await Document.findById(documentId);
        if (!source) return [];

        // "Related" = same file type, excluding itself, most recent first -
        // the cheapest honest proxy for relatedness without embeddings.
        const related = await Document.find({
            _id: { $ne: documentId },
            fileType: source.fileType,
            status: "completed",
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .select("originalName fileType createdAt");

        return related.map((d) => ({ id: d._id, name: d.originalName, fileType: d.fileType }));
    }

    if (query) {
        const terms = query.split(/\s+/).filter((t) => t.length > 2).slice(0, 5);
        if (!terms.length) return [];

        const regex = new RegExp(terms.map(escapeRegex).join("|"), "i");
        const docs = await Document.find({ originalName: regex, status: "completed" })
            .sort({ createdAt: -1 })
            .limit(limit)
            .select("originalName fileType createdAt");

        return docs.map((d) => ({ id: d._id, name: d.originalName, fileType: d.fileType }));
    }

    return [];
};

export const getSimilarSops = async (query, limit = 5) => {
    const terms = (query || "").split(/\s+/).filter((t) => t.length > 2);
    const namePattern = terms.length
        ? new RegExp(terms.map(escapeRegex).join("|"), "i")
        : SOP_HINT;

    const docs = await Document.find({
        $or: [{ originalName: SOP_HINT }, { originalName: namePattern }],
        status: "completed",
    })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select("originalName createdAt");

    return docs.map((d) => ({ id: d._id, name: d.originalName }));
};

export const getRelatedIncidents = async (query, limit = 5) => {
    const terms = (query || "").split(/\s+/).filter((t) => t.length > 2);
    if (!terms.length) return Incident.find().sort({ createdAt: -1 }).limit(limit).select("t d");

    const regex = new RegExp(terms.map(escapeRegex).join("|"), "i");
    const incidents = await Incident.find({ t: regex }).sort({ createdAt: -1 }).limit(limit);
    return incidents.map((i) => ({ title: i.t, date: i.d }));
};

export const getRelatedMaintenanceLogs = async (limit = 5) => {
    const actions = await RecommendedAction.find().sort({ createdAt: -1 }).limit(limit);
    return actions.map((a) => ({ title: a.t, priority: a.p }));
};

export const getComplianceReferences = async (query, limit = 5) => {
    const terms = (query || "").split(/\s+/).filter((t) => t.length > 2);
    const filter = terms.length ? { name: new RegExp(terms.map(escapeRegex).join("|"), "i") } : {};
    const items = await ComplianceItem.find(filter).sort({ createdAt: -1 }).limit(limit);
    return items.map((i) => ({ name: i.name, status: i.status, risk: i.risk }));
};

/**
 * "Frequently viewed" without a view-counter table is approximated from
 * document-type ActivityLog entries (each represents a real event that
 * touched a document), grouped by message. This is an honest proxy, not a
 * true view count - flagged here so it isn't mistaken for one downstream.
 */
export const getFrequentlyReferencedDocuments = async (limit = 5) => {
    const results = await ActivityLog.aggregate([
        { $match: { type: "document" } },
        { $group: { _id: "$message", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit },
    ]);

    return results.map((r) => ({ label: r._id, mentions: r.count }));
};

export const getRecentlyAccessedDocuments = async (userId, limit = 5) => {
    const filter = userId ? { uploadedBy: userId } : {};
    const docs = await Document.find(filter).sort({ updatedAt: -1 }).limit(limit).select("originalName updatedAt");
    return docs.map((d) => ({ id: d._id, name: d.originalName, updatedAt: d.updatedAt }));
};

/**
 * Aggregates everything above into the `recommendations` array the
 * orchestrator attaches to a unified response.
 */
export const getRecommendations = async ({ query, documentId, userId } = {}) => {
    const [relatedDocuments, similarSops, relatedIncidents, complianceReferences, recentlyAccessed] =
        await Promise.all([
            getRelatedDocuments({ documentId, query }),
            getSimilarSops(query),
            getRelatedIncidents(query),
            getComplianceReferences(query),
            getRecentlyAccessedDocuments(userId, 3),
        ]);

    const recommendations = [];
    relatedDocuments.forEach((d) => recommendations.push({ type: "document", label: d.name, refId: d.id }));
    similarSops.forEach((d) => recommendations.push({ type: "sop", label: d.name, refId: d.id }));
    relatedIncidents.forEach((i) => recommendations.push({ type: "incident", label: i.title }));
    complianceReferences.forEach((c) => recommendations.push({ type: "compliance", label: c.name }));
    recentlyAccessed.forEach((d) => recommendations.push({ type: "recently_accessed", label: d.name, refId: d.id }));

    return recommendations;
};

export default {
    getRelatedDocuments,
    getSimilarSops,
    getRelatedIncidents,
    getRelatedMaintenanceLogs,
    getComplianceReferences,
    getFrequentlyReferencedDocuments,
    getRecentlyAccessedDocuments,
    getRecommendations,
};
