import GraphNode from "../models/GraphNode.js";
import GraphEdge from "../models/GraphEdge.js";
import Config from "../models/Config.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import escapeRegex from "../utils/escapeRegex.js";

const ALLOWED_NODE_TYPES = new Set(["equipment", "incident", "document", "recommendation", "person"]);
const DEFAULT_LIMIT = 200;

/**
 * @route GET /api/graph/nodes
 * Reads the real Knowledge Graph synced from the AI Engine into
 * GraphNode/GraphEdge - no mock or hardcoded nodes. Query params (all
 * optional, backward compatible): search (label), type, page, limit.
 */
export const getGraphNodes = asyncHandler(async (req, res) => {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || DEFAULT_LIMIT, 500);
    const search = req.query.search?.trim();
    const { type } = req.query;

    const filter = {};
    if (search) filter.label = { $regex: escapeRegex(search), $options: "i" };
    if (type && ALLOWED_NODE_TYPES.has(type)) filter.type = type;

    const [nodes, total] = await Promise.all([
        GraphNode.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(),
        GraphNode.countDocuments(filter),
    ]);

    res.json({
        success: true,
        nodes: nodes.map((n) => ({ id: n.nodeId, type: n.type, label: n.label, x: n.x, y: n.y })),
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
});

/**
 * @route GET /api/graph/edges
 * Query params: page, limit (edges can outnumber nodes as the graph
 * grows, so this is paginated defensively even though it wasn't before).
 */
export const getGraphEdges = asyncHandler(async (req, res) => {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || DEFAULT_LIMIT, 500);

    const [edges, total] = await Promise.all([
        GraphEdge.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(),
        GraphEdge.countDocuments(),
    ]);

    res.json({
        success: true,
        edges: edges.map((e) => [e.from, e.to]),
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
});

export const getHeroPath = asyncHandler(async (req, res) => {
    const config = await Config.findOne({ key: "graph.heroPath" });
    res.json({
        success: true,
        heroPath: config?.value || [],
    });
});

/**
 * @route GET /api/graph/nodes/:nodeId
 * @route GET /api/graph/node/:nodeId (alias, singular form)
 */
export const getNodeDetails = asyncHandler(async (req, res) => {
    const { nodeId } = req.params;

    const node = await GraphNode.findOne({ nodeId });
    if (!node) {
        throw new ApiError(404, "Node not found");
    }

    const edges = await GraphEdge.find({ $or: [{ from: nodeId }, { to: nodeId }] }).lean();
    const relatedIds = edges.map((e) => (e.from === nodeId ? e.to : e.from));
    const relatedNodes = await GraphNode.find({ nodeId: { $in: relatedIds } }).lean();

    res.json({
        success: true,
        node: { id: node.nodeId, type: node.type, label: node.label, x: node.x, y: node.y },
        relatedIds,
        relatedNodes: relatedNodes.map((n) => ({ id: n.nodeId, type: n.type, label: n.label })),
    });
});

/**
 * @route GET /api/graph/stats
 * Node/edge counts by type - backs the Analytics module's "Knowledge
 * Graph Metrics" without a second copy of this logic living there.
 */
export const getGraphStats = asyncHandler(async (req, res) => {
    const [nodesByType, nodeCount, edgeCount] = await Promise.all([
        GraphNode.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]),
        GraphNode.countDocuments(),
        GraphEdge.countDocuments(),
    ]);

    res.json({
        success: true,
        stats: {
            totalNodes: nodeCount,
            totalEdges: edgeCount,
            byType: Object.fromEntries(nodesByType.map((n) => [n._id, n.count])),
        },
    });
});
