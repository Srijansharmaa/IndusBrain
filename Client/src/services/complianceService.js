import api from "./api";

export const getComplianceItems = async () => {
  const res = await api.get("/compliance/items");
  return res.data.items;
};

export const getComplianceMetrics = async () => {
  const res = await api.get("/compliance/metrics");
  return res.data.metrics;
};

export const generateComplianceReport = async () => {
  const res = await api.post("/compliance/report");
  return res.data;
};
