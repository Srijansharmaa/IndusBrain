import KnowledgeGrowth from "../../models/KnowledgeGrowth.js";
import DepartmentActivity from "../../models/DepartmentActivity.js";
import KnowledgeHealth from "../../models/KnowledgeHealth.js";
import Metric from "../../models/Metric.js";
import Document from "../../models/Document.js";
import User from "../../models/User.js";

/**
 * Reuses the same collections analyticsController serves at
 * /api/analytics/*, plus a couple of Document/User aggregates that aren't
 * exposed as their own endpoints yet but are cheap to compute for the
 * orchestrator (upload trends, popular documents, user statistics).
 */

export const getKnowledgeGrowth = async () => {
    const data = await KnowledgeGrowth.find().sort({ order: 1 });
    return data.map((d) => ({ m: d.month, docs: d.docs, ai: d.ai }));
};

export const getDepartmentActivity = async () => {
    const data = await DepartmentActivity.find();
    return data.map((d) => ({ dept: d.dept, value: d.value }));
};

export const getKnowledgeHealthRadar = async () => {
    const data = await KnowledgeHealth.find();
    return data.map((d) => ({ area: d.area, value: d.value }));
};

export const getAnalyticsMetrics = async () => {
    return Metric.find({ domain: "analytics" }).sort({ order: 1 });
};

/**
 * Upload trend from the live Document collection (last 7 days), as a
 * ground-truth complement to the seeded KnowledgeGrowth series.
 */
export const getUploadTrend = async (days = 7) => {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const results = await Document.aggregate([
        { $match: { createdAt: { $gte: since } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    return results.map((r) => ({ date: r._id, count: r.count }));
};

export const getPopularDocuments = async (limit = 5) => {
    const docs = await Document.find({ status: "completed" })
        .sort({ chunkCount: -1 })
        .limit(limit)
        .select("originalName chunkCount fileType");

    return docs.map((d) => ({ name: d.originalName, chunkCount: d.chunkCount, fileType: d.fileType }));
};

export const getUserStatistics = async () => {
    const byRole = await User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]);
    const byStatus = await User.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);

    return {
        total: byRole.reduce((sum, r) => sum + r.count, 0),
        byRole: Object.fromEntries(byRole.map((r) => [r._id, r.count])),
        byStatus: Object.fromEntries(byStatus.map((r) => [r._id, r.count])),
    };
};

export const getAnalyticsSnapshot = async () => {
    const [knowledgeGrowth, departmentActivity, radar, metrics, uploadTrend, popularDocuments, userStatistics] =
        await Promise.all([
            getKnowledgeGrowth(),
            getDepartmentActivity(),
            getKnowledgeHealthRadar(),
            getAnalyticsMetrics(),
            getUploadTrend(),
            getPopularDocuments(),
            getUserStatistics(),
        ]);

    return {
        knowledgeGrowth,
        departmentActivity,
        radar,
        metrics,
        uploadTrend,
        popularDocuments,
        userStatistics,
    };
};

export const handleAnalyticsQuery = async ({ query }) => {
    const snapshot = await getAnalyticsSnapshot();

    const answer = `Analytics snapshot: ${snapshot.userStatistics.total} users, ${snapshot.popularDocuments.length} top documents by chunk count, and ${snapshot.uploadTrend.reduce((sum, d) => sum + d.count, 0)} document(s) uploaded in the last 7 days.`;

    return {
        answer,
        confidence: 82,
        metadata: { userStatistics: snapshot.userStatistics },
        charts: [
            { type: "line", label: "Knowledge growth", data: snapshot.knowledgeGrowth },
            { type: "bar", label: "Department activity", data: snapshot.departmentActivity },
            { type: "radar", label: "Knowledge health", data: snapshot.radar },
            { type: "bar", label: "Upload trend (7d)", data: snapshot.uploadTrend },
        ],
        sources: [],
        snapshot,
    };
};

export default {
    getKnowledgeGrowth,
    getDepartmentActivity,
    getKnowledgeHealthRadar,
    getAnalyticsMetrics,
    getUploadTrend,
    getPopularDocuments,
    getUserStatistics,
    getAnalyticsSnapshot,
    handleAnalyticsQuery,
};
