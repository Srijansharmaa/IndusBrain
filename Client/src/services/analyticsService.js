import api from "./api";

export const getKnowledgeGrowth = async () => {
  const res = await api.get("/analytics/knowledge-growth");
  return res.data.knowledgeGrowth;
};

export const getDepartmentActivity = async () => {
  const res = await api.get("/analytics/department-activity");
  return res.data.departmentActivity;
};

export const getKnowledgeHealthRadar = async () => {
  const res = await api.get("/analytics/knowledge-health");
  return res.data.radar;
};

export const getAnalyticsMetrics = async () => {
  const res = await api.get("/analytics/metrics");
  return res.data.metrics;
};
