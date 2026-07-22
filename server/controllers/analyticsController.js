import KnowledgeGrowth from "../models/KnowledgeGrowth.js";
import DepartmentActivity from "../models/DepartmentActivity.js";
import KnowledgeHealth from "../models/KnowledgeHealth.js";
import Metric from "../models/Metric.js";
import Document from "../models/Document.js";
import SearchLog from "../models/SearchLog.js";
import GraphNode from "../models/GraphNode.js";
import GraphEdge from "../models/GraphEdge.js";
import Conversation from "../models/Conversation.js";
import ActivityLog from "../models/ActivityLog.js";
import asyncHandler from "../utils/asyncHandler.js";
import * as analyticsEngine from "../services/ai/analyticsEngine.js";
import * as maintenanceEngine from "../services/ai/maintenanceEngine.js";
import * as complianceEngine from "../services/ai/complianceEngine.js";

const SAFETY_LIMIT = 200;

export const getKnowledgeGrowth = asyncHandler(async (req, res) => {
    const data = await KnowledgeGrowth.find().sort({ order: 1 }).limit(SAFETY_LIMIT);
    res.json({
        success: true,
        knowledgeGrowth: data.map((d) => ({ m: d.month, docs: d.docs, ai: d.ai })),
    });
});

export const getDepartmentActivity = asyncHandler(async (req, res) => {
    const data = await DepartmentActivity.find().limit(SAFETY_LIMIT);
    res.json({
        success: true,
        departmentActivity: data.map((d) => ({ dept: d.dept, value: d.value })),
    });
});

export const getKnowledgeHealthRadar = asyncHandler(async (req, res) => {
    const data = await KnowledgeHealth.find().limit(SAFETY_LIMIT);
    res.json({
        success: true,
        radar: data.map((d) => ({ area: d.area, value: d.value })),
    });
});

export const getAnalyticsMetrics = asyncHandler(async (req, res) => {
    const metrics = await Metric.find({ domain: "analytics" }).sort({ order: 1 });
    res.json({ success: true, metrics });
});

/**
 * @route GET /api/analytics/document-stats
 */
export const getDocumentStatistics = asyncHandler(async (req, res) => {
    const [byStatus, byFileType, uploadTrend, popularDocuments, total] = await Promise.all([
        Document.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
        Document.aggregate([{ $group: { _id: "$fileType", count: { $sum: 1 } } }]),
        analyticsEngine.getUploadTrend(),
        analyticsEngine.getPopularDocuments(),
        Document.countDocuments(),
    ]);

    res.json({
        success: true,
        documentStatistics: {
            total,
            byStatus: Object.fromEntries(byStatus.map((s) => [s._id, s.count])),
            byFileType: Object.fromEntries(byFileType.map((f) => [f._id || "unknown", f.count])),
            uploadTrend,
            popularDocuments,
        },
    });
});

/**
 * @route GET /api/analytics/search-analytics
 * Backed by SearchLog, populated by every call to POST /api/search.
 */
export const getSearchAnalytics = asyncHandler(async (req, res) => {
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const [topQueries, volumeByDay, totalSearches] = await Promise.all([
        SearchLog.aggregate([
            { $group: { _id: "$query", count: { $sum: 1 }, avgResults: { $avg: "$resultCount" } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]),
        SearchLog.aggregate([
            { $match: { createdAt: { $gte: since } } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
        ]),
        SearchLog.countDocuments(),
    ]);

    res.json({
        success: true,
        searchAnalytics: {
            totalSearches,
            topQueries: topQueries.map((q) => ({
                query: q._id,
                count: q.count,
                avgResults: Math.round((q.avgResults || 0) * 10) / 10,
            })),
            volumeByDay: volumeByDay.map((v) => ({ date: v._id, count: v.count })),
        },
    });
});

/**
 * @route GET /api/analytics/graph-metrics
 */
export const getGraphMetrics = asyncHandler(async (req, res) => {
    const [byType, nodeCount, edgeCount] = await Promise.all([
        GraphNode.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]),
        GraphNode.countDocuments(),
        GraphEdge.countDocuments(),
    ]);

    res.json({
        success: true,
        graphMetrics: {
            totalNodes: nodeCount,
            totalEdges: edgeCount,
            byType: Object.fromEntries(byType.map((t) => [t._id, t.count])),
        },
    });
});

/**
 * @route GET /api/analytics/copilot-usage
 * Backed by Conversation (AI Orchestrator sessions) and the "ai"-typed
 * ActivityLog entries.
 */
export const getCopilotUsage = asyncHandler(async (req, res) => {
    const [conversationStats, aiActivityCount] = await Promise.all([
        Conversation.aggregate([
            {
                $project: { messageCount: { $size: "$messages" } },
            },
            {
                $group: { _id: null, totalConversations: { $sum: 1 }, totalMessages: { $sum: "$messageCount" } },
            },
        ]),
        ActivityLog.countDocuments({ type: "ai" }),
    ]);

    const stats = conversationStats[0] || { totalConversations: 0, totalMessages: 0 };

    res.json({
        success: true,
        copilotUsage: {
            totalConversations: stats.totalConversations,
            totalMessages: stats.totalMessages,
            aiActivityEvents: aiActivityCount,
        },
    });
});

/**
 * @route GET /api/analytics/maintenance-analytics
 * Reuses maintenanceEngine rather than re-querying Equipment/Incident here.
 */
export const getMaintenanceAnalytics = asyncHandler(async (req, res) => {
    const [equipmentHealth, recommendedActions, recentIncidents] = await Promise.all([
        maintenanceEngine.getEquipmentHealth(),
        maintenanceEngine.getRecommendedActions(),
        maintenanceEngine.getRecentIncidents(),
    ]);

    const byRisk = equipmentHealth.reduce((acc, e) => {
        acc[e.risk] = (acc[e.risk] || 0) + 1;
        return acc;
    }, {});
    const averageHealth = equipmentHealth.length
        ? Math.round(equipmentHealth.reduce((sum, e) => sum + e.health, 0) / equipmentHealth.length)
        : null;

    res.json({
        success: true,
        maintenanceAnalytics: {
            totalEquipment: equipmentHealth.length,
            byRisk,
            averageHealth,
            openRecommendedActions: recommendedActions.length,
            recentIncidentCount: recentIncidents.length,
        },
    });
});

/**
 * @route GET /api/analytics/compliance-analytics
 * Reuses complianceEngine rather than re-querying ComplianceItem here.
 */
export const getComplianceAnalytics = asyncHandler(async (req, res) => {
    const [items, expiringItems] = await Promise.all([
        complianceEngine.getComplianceItems(),
        complianceEngine.getExpiringItems(),
    ]);

    const byStatus = items.reduce((acc, i) => {
        acc[i.status] = (acc[i.status] || 0) + 1;
        return acc;
    }, {});
    const byRisk = items.reduce((acc, i) => {
        acc[i.risk] = (acc[i.risk] || 0) + 1;
        return acc;
    }, {});

    res.json({
        success: true,
        complianceAnalytics: {
            total: items.length,
            byStatus,
            byRisk,
            expiringCount: expiringItems.length,
        },
    });
});
