import api from "./api";

export const getGraphNodes = async () => {
  const res = await api.get("/graph/nodes");
  return res.data.nodes;
};

export const getGraphEdges = async () => {
  const res = await api.get("/graph/edges");
  return res.data.edges;
};

export const getHeroPath = async () => {
  const res = await api.get("/graph/hero-path");
  return res.data.heroPath;
};

export const getNodeDetails = async (nodeId) => {
  const res = await api.get(`/graph/nodes/${nodeId}`);
  return { node: res.data.node, relatedIds: res.data.relatedIds };
};
