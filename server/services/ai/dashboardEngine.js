import Metric from "../../models/Metric.js";
import ActivityLog from "../../models/ActivityLog.js";
import RecommendedAction from "../../models/RecommendedAction.js";
import Document from "../../models/Document.js";
import Equipment from "../../models/Equipment.js";
import formatRelativeTime from "../../utils/formatRelativeTime.js";

/**
 * Mirrors dashboardController.getDashboardSummary (same collections, same
 * shape) plus a couple of extra aggregates - trending documents, equipment
 * statistics - that the "generate dashboard insights" intent needs but the
 * plain /api/dashboard/summary endpoint doesn't compute today.
 */

const PRIORITY_TO_SEVERITY = { Critical: "High", High: "Medium", Normal: "Low" };

export const getDashboardSummary = async () => {
    const [heroStats, statCards, activity, actions, documentsToday] = await Promise.all([
        Metric.find({ domain: "dashboard", group: "hero" }).sort({ order: 1 }),
        Metric.find({ domain: "dashboard", group: "cards" }).sort({ order: 1 }),
        ActivityLog.find().sort({ createdAt: -1 }).limit(6),
        RecommendedAction.find().limit(3),
        Document.countDocuments({
            createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        }),
    ]);

    return {
        heroStats: heroStats.map((m) => ({ label: m.label, value: m.value, tone: `text-${m.color}` })),
        statCards: statCards.map((m) => ({
            icon: m.icon,
            label: m.label,
            value: m.value,
            delta: m.delta,
            up: m.up,
            color: m.color,
        })),
        recentActivity: activity.map((a) => ({ t: a.message, time: formatRelativeTime(a.createdAt), type: a.type })),
        maintenanceAlerts: actions.map((a) => ({ t: a.t, sev: PRIORITY_TO_SEVERITY[a.p] || "Medium", tone: a.c })),
        documentsIndexedToday: documentsToday,
    };
};

export const getTrendingDocuments = async (limit = 5) => {
    const docs = await Document.find({ status: "completed" })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select("originalName chunkCount createdAt");

    return docs.map((d) => ({ name: d.originalName, chunkCount: d.chunkCount, uploadedAt: d.createdAt }));
};

export const getEquipmentStatistics = async () => {
    const equipment = await Equipment.find();
    const byRisk = equipment.reduce((acc, e) => {
        acc[e.risk] = (acc[e.risk] || 0) + 1;
        return acc;
    }, {});
    const avgHealth = equipment.length
        ? Math.round(equipment.reduce((sum, e) => sum + e.health, 0) / equipment.length)
        : null;

    return { total: equipment.length, byRisk, averageHealth: avgHealth };
};

export const handleDashboardQuery = async () => {
    const [summary, trendingDocuments, equipmentStatistics] = await Promise.all([
        getDashboardSummary(),
        getTrendingDocuments(),
        getEquipmentStatistics(),
    ]);

    const answer = `Dashboard insights: ${summary.documentsIndexedToday} document(s) indexed today, ${equipmentStatistics.total} equipment assets tracked (avg health ${equipmentStatistics.averageHealth ?? "n/a"}%), and ${summary.maintenanceAlerts.length} active maintenance alert(s).`;

    return {
        answer,
        confidence: 84,
        metadata: { equipmentStatistics },
        sources: [],
        charts: [{ type: "list", label: "Trending documents", data: trendingDocuments }],
        summary,
        trendingDocuments,
    };
};

export default { getDashboardSummary, getTrendingDocuments, getEquipmentStatistics, handleDashboardQuery };
