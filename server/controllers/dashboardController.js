import Metric from "../models/Metric.js";
import ActivityLog from "../models/ActivityLog.js";
import RecommendedAction from "../models/RecommendedAction.js";
import Document from "../models/Document.js";
import asyncHandler from "../utils/asyncHandler.js";
import formatRelativeTime from "../utils/formatRelativeTime.js";

/**
 * @route GET /api/dashboard/summary
 * Returns everything DashboardPage needs (hero mini-stats, stat cards,
 * recent activity, maintenance alerts) in a single request instead of the
 * 3-4 separate calls each widget would otherwise make on mount.
 *
 * Reuses existing collections rather than introducing new ones:
 * - Metric (domain: "dashboard", group: "hero" | "cards")
 * - ActivityLog for the activity feed
 * - RecommendedAction, reshaped, for maintenance alerts
 * - Document, for a live "indexed today" count as a sanity check against
 *   whatever the seeded "Indexed Documents" metric says
 */
export const getDashboardSummary = asyncHandler(async (req, res) => {
    const [heroStats, statCards, activity, actions, documentsToday] = await Promise.all([
        Metric.find({ domain: "dashboard", group: "hero" }).sort({ order: 1 }),
        Metric.find({ domain: "dashboard", group: "cards" }).sort({ order: 1 }),
        ActivityLog.find().sort({ createdAt: -1 }).limit(6),
        RecommendedAction.find().limit(3),
        Document.countDocuments({
            createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        }),
    ]);

    const PRIORITY_TO_SEVERITY = { Critical: "High", High: "Medium", Normal: "Low" };

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
        },
    });
});
