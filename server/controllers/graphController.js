import GraphNode from "../models/GraphNode.js";
import GraphEdge from "../models/GraphEdge.js";
import Config from "../models/Config.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

export const getGraphNodes = asyncHandler(async (req, res) => {
    const nodes = await GraphNode.find();
    res.json({
        success: true,
        nodes: nodes.map((n) => ({ id: n.nodeId, type: n.type, label: n.label, x: n.x, y: n.y })),
    });
});

export const getGraphEdges = asyncHandler(async (req, res) => {
    const edges = await GraphEdge.find();
    res.json({
        success: true,
        edges: edges.map((e) => [e.from, e.to]),
    });
});

export const getHeroPath = asyncHandler(async (req, res) => {
    const config = await Config.findOne({ key: "graph.heroPath" });
    res.json({
        success: true,
        heroPath: config?.value || [],
    });
});

export const getNodeDetails = asyncHandler(async (req, res) => {
    const { nodeId } = req.params;

    const node = await GraphNode.findOne({ nodeId });
    if (!node) {
        throw new ApiError(404, "Node not found");
    }

    const edges = await GraphEdge.find({ $or: [{ from: nodeId }, { to: nodeId }] });
    const relatedIds = edges.map((e) => (e.from === nodeId ? e.to : e.from));

    res.json({
        success: true,
        node: { id: node.nodeId, type: node.type, label: node.label, x: node.x, y: node.y },
        relatedIds,
    });
});
