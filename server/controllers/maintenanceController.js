import Equipment from "../models/Equipment.js";
import RecommendedAction from "../models/RecommendedAction.js";
import Incident from "../models/Incident.js";
import ActivityLog from "../models/ActivityLog.js";
import GraphNode from "../models/GraphNode.js";
import GraphEdge from "../models/GraphEdge.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import escapeRegex from "../utils/escapeRegex.js";
import formatRelativeTime from "../utils/formatRelativeTime.js";
import { RISK_RANK_STAGE } from "../utils/riskRank.js";

const DEFAULT_LIMIT = 100;
const ALLOWED_RISKS = new Set(["Low", "Medium", "High"]);
const ALLOWED_PRIORITIES = new Set(["Critical", "High", "Normal"]);

/**
 * @route GET /api/maintenance/equipment-health
 * Query params (all optional, backward compatible - no params behaves
 * exactly as before): search (name), risk, page, limit.
 */
export const getEquipmentHealth = asyncHandler(async (req, res) => {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || DEFAULT_LIMIT, 200);
    const search = req.query.search?.trim();
    const { risk } = req.query;

    const filter = {};
    if (search) filter.name = { $regex: escapeRegex(search), $options: "i" };
    if (risk && ALLOWED_RISKS.has(risk)) filter.risk = risk;

    const [equipment, total] = await Promise.all([
        Equipment.aggregate([
            { $match: filter },
            RISK_RANK_STAGE,
            { $sort: { riskRank: -1, failure: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            { $project: { riskRank: 0 } },
        ]),
        Equipment.countDocuments(filter),
    ]);

    res.json({
        success: true,
        equipmentHealth: equipment.map((e) => ({
            name: e.name,
            health: e.health,
            risk: e.risk,
            failure: e.failure,
            temp: e.temp,
        })),
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
});

/**
 * @route GET /api/maintenance/recommended-actions
 * Query params: priority, page, limit.
 */
export const getRecommendedActions = asyncHandler(async (req, res) => {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || DEFAULT_LIMIT, 200);
    const { priority } = req.query;

    const filter = {};
    if (priority && ALLOWED_PRIORITIES.has(priority)) filter.p = priority;

    const [actions, total] = await Promise.all([
        RecommendedAction.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(),
        RecommendedAction.countDocuments(filter),
    ]);

    res.json({
        success: true,
        recommendedActions: actions.map((a) => ({ t: a.t, p: a.p, c: a.c })),
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
});

/**
 * @route GET /api/maintenance/recent-incidents
 * Query params: search (title), page, limit. Previously unbounded - now
 * defaults to the 20 most recent, matching the "recent" in the route name.
 */
export const getRecentIncidents = asyncHandler(async (req, res) => {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 200);
    const search = req.query.search?.trim();

    const filter = search ? { t: { $regex: escapeRegex(search), $options: "i" } } : {};

    const [incidents, total] = await Promise.all([
        Incident.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(),
        Incident.countDocuments(filter),
    ]);

    res.json({
        success: true,
        recentIncidents: incidents.map((i) => ({ t: i.t, d: i.d })),
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
});

/**
 * @route GET /api/maintenance/timeline
 * Maintenance-scoped slice of ActivityLog (type: "maintenance"), separate
 * from the general activity feed on /api/admin/activity-log and
 * /api/dashboard/summary.
 */
export const getMaintenanceTimeline = asyncHandler(async (req, res) => {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);

    const logs = await ActivityLog.find({ type: "maintenance" })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

    res.json({
        success: true,
        timeline: logs.map((l) => ({ message: l.message, time: formatRelativeTime(l.createdAt), at: l.createdAt })),
    });
});

/**
 * @route GET /api/maintenance/predictive
 * Ranks equipment by failure probability, using the real Equipment
 * collection (health/failure/temp fields already tracked per asset) rather
 * than a separate prediction model - the AI Engine owns modeling, this is
 * a read/rank over data that already exists.
 */
export const getPredictiveMaintenance = asyncHandler(async (req, res) => {
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100);

    const equipment = await Equipment.find().sort({ failure: -1 }).limit(limit).lean();

    res.json({
        success: true,
        predictions: equipment.map((e) => {
            const trendingUp = e.temp?.length >= 2 && e.temp[e.temp.length - 1] > e.temp[0];
            return {
                name: e.name,
                failureProbability: e.failure,
                risk: e.risk,
                health: e.health,
                trend: trendingUp ? "worsening" : "stable",
                recommendation:
                    e.failure >= 30
                        ? `Schedule inspection for ${e.name} within 7 days - failure probability is ${e.failure}%.`
                        : `${e.name} is within normal parameters; continue routine monitoring.`,
            };
        }),
    });
});

/**
 * @route GET /api/maintenance/equipment/:name/relationships
 * Uses the AI Engine's knowledge graph (GraphNode/GraphEdge, synced into
 * Mongo) to find what's connected to a given piece of equipment - other
 * equipment, incidents, documents, people - rather than re-deriving
 * relationships Express has no business computing itself.
 */
export const getEquipmentRelationships = asyncHandler(async (req, res) => {
    const { name } = req.params;

    const node = await GraphNode.findOne({
        type: "equipment",
        label: { $regex: escapeRegex(name), $options: "i" },
    });

    if (!node) {
        throw new ApiError(404, `No knowledge graph node found for equipment matching "${name}"`);
    }

    const edges = await GraphEdge.find({ $or: [{ from: node.nodeId }, { to: node.nodeId }] });
    const relatedIds = edges.map((e) => (e.from === node.nodeId ? e.to : e.from));
    const relatedNodes = await GraphNode.find({ nodeId: { $in: relatedIds } }).lean();

    res.json({
        success: true,
        equipment: { id: node.nodeId, label: node.label },
        relationships: relatedNodes.map((n) => ({ id: n.nodeId, type: n.type, label: n.label })),
    });
});

/**
 * @route GET /api/maintenance/stats
 * Dashboard-style aggregate for the Maintenance page header (asset count,
 * risk breakdown, average health, open recommended actions).
 */
export const getMaintenanceStats = asyncHandler(async (req, res) => {
    const [equipment, actionCount, incidentCount] = await Promise.all([
        Equipment.find().lean(),
        RecommendedAction.countDocuments(),
        Incident.countDocuments(),
    ]);

    const byRisk = equipment.reduce((acc, e) => {
        acc[e.risk] = (acc[e.risk] || 0) + 1;
        return acc;
    }, {});
    const averageHealth = equipment.length
        ? Math.round(equipment.reduce((sum, e) => sum + e.health, 0) / equipment.length)
        : null;

    res.json({
        success: true,
        stats: {
            totalEquipment: equipment.length,
            byRisk,
            averageHealth,
            openRecommendedActions: actionCount,
            totalIncidents: incidentCount,
        },
    });
});
