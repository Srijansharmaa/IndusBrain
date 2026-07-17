import { GRAPH_NODES, GRAPH_EDGES, HERO_PATH, findNodeById, findRelatedNodeIds } from "../constants/graphData";

// TODO(backend): replace with `axios.get("/api/graph/nodes")`
export const getGraphNodes = async () => GRAPH_NODES;

// TODO(backend): replace with `axios.get("/api/graph/edges")`
export const getGraphEdges = async () => GRAPH_EDGES;

// TODO(backend): replace with `axios.get("/api/graph/hero-path")`
export const getHeroPath = async () => HERO_PATH;

// TODO(backend): replace with `axios.get(`/api/graph/nodes/${nodeId}`)`
export const getNodeDetails = async (nodeId) => ({
  node: findNodeById(nodeId),
  relatedIds: findRelatedNodeIds(nodeId),
});
