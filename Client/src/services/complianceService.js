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
  const res = await api.post("/compliance/report", null, { responseType: "blob" });

  const blob = new Blob([res.data], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `compliance-report-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);

  return { success: true };
};
