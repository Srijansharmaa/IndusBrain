import KnowledgeGrowth from "../models/KnowledgeGrowth.js";
import DepartmentActivity from "../models/DepartmentActivity.js";
import KnowledgeHealth from "../models/KnowledgeHealth.js";
import Metric from "../models/Metric.js";
import Document from "../models/Document.js";
import SearchLog from "../models/SearchLog.js";
import Conversation from "../models/Conversation.js";
import ActivityLog from "../models/ActivityLog.js";
import asyncHandler from "../utils/asyncHandler.js";
import * as analyticsEngine from "../services/ai/analyticsEngine.js";
import * as maintenanceEngine from "../services/ai/maintenanceEngine.js";
import * as complianceEngine from "../services/ai/complianceEngine.js";
import {
    getKnowledgeGraphNodes,
    getKnowledgeGraphEdges,
    getKnowledgeGraphStats,
} from "../services/aiService.js";

const SAFETY_LIMIT = 200;

export const getKnowledgeGrowth = asyncHandler(async (req, res) => {

    const [graphResponse, totalDocuments] = await Promise.all([
        getKnowledgeGraphNodes(),
        Document.countDocuments(),
    ]);

    const totalNodes = (graphResponse.nodes || []).length;

    const knowledgeGrowth = [
        {
            m: "Current",
            docs: totalDocuments,
            ai: totalNodes,
        },
    ];

    res.json({
        success: true,
        knowledgeGrowth,
    });

});

export const getDepartmentActivity = asyncHandler(async (req, res) => {

    const graph = await getKnowledgeGraphNodes();

    const nodes = graph.nodes || [];

    const counts = {};

    nodes.forEach((node) => {

        const dept = node.department || "Unknown";

        counts[dept] = (counts[dept] || 0) + 1;

    });

    const departmentActivity = Object.entries(counts).map(([dept, value]) => ({
        dept,
        value,
    }));

    res.json({
        success: true,
        departmentActivity,
    });

});

export const getKnowledgeHealthRadar = asyncHandler(async (req, res) => {

    const statsResponse = await getKnowledgeGraphStats();

    const stats = statsResponse.stats || {};

    const totalNodes = stats.total_nodes || 0;
    const totalEdges = stats.total_edges || 0;

    const connectivity =
        totalNodes === 0
            ? 0
            : Math.min(100, Math.round((totalEdges / totalNodes) * 20));

    const radar = [
        {
            area: "Coverage",
            value: Math.min(100, totalNodes),
        },
        {
            area: "Connectivity",
            value: connectivity,
        },
        {
            area: "Relationships",
            value: Math.min(100, totalEdges),
        },
        {
            area: "Knowledge",
            value: Math.min(100, Math.round((totalNodes + totalEdges) / 2)),
        },
        {
            area: "Graph Health",
            value: connectivity,
        },
    ];

    res.json({
        success: true,
        radar,
    });

});

export const getAnalyticsMetrics = asyncHandler(async (req, res) => {

    const [nodesResponse, edgesResponse] = await Promise.all([
        getKnowledgeGraphNodes(),
        getKnowledgeGraphEdges(),
    ]);

    const nodes = nodesResponse.nodes || [];
    const edges = edgesResponse.edges || [];

    const departments = new Set();

    let healthyAssets = 0;

    nodes.forEach((node) => {

        if (node.department) {
            departments.add(node.department);
        }

        if (
            node.type === "Equipment" &&
            Number(node.health || node.health_score || 0) >= 90
        ) {
            healthyAssets++;
        }

    });

    res.json({
        success: true,
        metrics: [
            {
                label: "Knowledge Nodes",
                value: nodes.length,
                icon: "Database",
                color: "primary",
            },
            {
                label: "Healthy Assets",
                value: healthyAssets,
                icon: "CheckCircle2",
                color: "success",
            },
            {
                label: "Relationships",
                value: edges.length,
                icon: "Link2",
                color: "purple",
            },
            {
                label: "Departments",
                value: departments.size,
                icon: "Users",
                color: "warning",
            },
        ],
    });

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
 * Same live source as GET /api/graph/stats, so analytics numbers never
 * drift from what Graph Explorer / Graph Statistics show.
 */
export const getGraphMetrics = asyncHandler(async (req, res) => {
    const { stats } = await getKnowledgeGraphStats();

    res.json({
        success: true,
        graphMetrics: {
            totalNodes: stats.total_nodes,
            totalEdges: stats.total_edges,
            byType: stats.entity_types || {},
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
