import Metric from "../models/Metric.js";
import ActivityLog from "../models/ActivityLog.js";
import RecommendedAction from "../models/RecommendedAction.js";
import Document from "../models/Document.js";
import GraphNode from "../models/GraphNode.js";
import GraphEdge from "../models/GraphEdge.js";
import asyncHandler from "../utils/asyncHandler.js";
import formatRelativeTime from "../utils/formatRelativeTime.js";
import * as dashboardEngine from "../services/ai/dashboardEngine.js";
import * as complianceEngine from "../services/ai/complianceEngine.js";
import * as notificationEngine from "../services/ai/notificationEngine.js";

/**
 * @route GET /api/dashboard/summary
 * Returns everything DashboardPage needs in a single request instead of
 * several separate calls each widget would otherwise make on mount.
 *
 * The original hero/cards/activity/alerts/documentsToday fields are
 * unchanged - anything reading those keeps working exactly as before.
 * Added: recentDocuments, knowledgeGraphOverview, complianceOverview,
 * maintenanceOverview, analyticsSummary, notifications, aiInsights - all
 * additive, all sourced from real collections/engines, no new keys
 * shadow or replace the originals.
 */
export const getDashboardSummary = asyncHandler(async (req, res) => {
    const [
        heroStats,
        statCards,
        activity,
        actions,
        documentsToday,
        recentDocuments,
        graphNodeCount,
        graphEdgeCount,
        complianceItems,
        expiringCompliance,
        maintenanceOverview,
        trendingDocuments,
        notifications,
    ] = await Promise.all([
        Metric.find({ domain: "dashboard", group: "hero" }).sort({ order: 1 }),
        Metric.find({ domain: "dashboard", group: "cards" }).sort({ order: 1 }),
        ActivityLog.find().sort({ createdAt: -1 }).limit(6),
        RecommendedAction.find().limit(3),
        Document.countDocuments({
            createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        }),
        Document.find().sort({ createdAt: -1 }).limit(5).select("originalName status fileType createdAt"),
        GraphNode.countDocuments(),
        GraphEdge.countDocuments(),
        complianceEngine.getComplianceItems(),
        complianceEngine.getExpiringItems(),
        dashboardEngine.getEquipmentStatistics(),
        dashboardEngine.getTrendingDocuments(5),
        notificationEngine.getRecentNotifications(req.user?._id, 5),
    ]);

    const PRIORITY_TO_SEVERITY = { Critical: "High", High: "Medium", Normal: "Low" };

    const complianceByStatus = complianceItems.reduce((acc, i) => {
        acc[i.status] = (acc[i.status] || 0) + 1;
        return acc;
    }, {});

    // Data-driven summary sentence built from the aggregates already
    // computed above - not an LLM call, so the main dashboard load never
    // waits on the AI Engine. Real AI-generated insights are available on
    // demand via POST /api/ai/query (intent: "dashboard").
    const aiInsights = [
        `${documentsToday} document(s) indexed today.`,
        `${maintenanceOverview.total} equipment asset(s) tracked, average health ${maintenanceOverview.averageHealth ?? "n/a"}%.`,
        expiringCompliance.length
            ? `${expiringCompliance.length} compliance item(s) need attention.`
            : "No compliance items are currently expiring.",
    ].join(" ");

    res.json({
        success: true,
        data: {
            heroStats: heroStats.map((m) => ({
                label: m.label,
                value: m.value,
                tone: `text-${m.color}`,
            })),
            statCards: statCards.map((m) => ({
                icon: m.icon,
                label: m.label,
                value: m.value,
                delta: m.delta,
                up: m.up,
                color: m.color,
            })),
            recentActivity: activity.map((a) => ({
                t: a.message,
                time: formatRelativeTime(a.createdAt),
                type: a.type,
            })),
            maintenanceAlerts: actions.map((a) => ({
                t: a.t,
                sev: PRIORITY_TO_SEVERITY[a.p] || "Medium",
                tone: a.c,
            })),
            documentsIndexedToday: documentsToday,
            recentDocuments: recentDocuments.map((d) => ({
                id: d._id,
                name: d.originalName,
                status: d.status,
                fileType: d.fileType,
                uploadedAt: d.createdAt,
            })),
            knowledgeGraphOverview: {
                totalNodes: graphNodeCount,
                totalEdges: graphEdgeCount,
            },
            complianceOverview: {
                total: complianceItems.length,
                byStatus: complianceByStatus,
                expiringCount: expiringCompliance.length,
            },
            maintenanceOverview,
            analyticsSummary: {
                trendingDocuments,
            },
            notifications,
            aiInsights,
        },
    });
});
