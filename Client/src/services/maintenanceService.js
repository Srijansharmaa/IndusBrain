import api from "./api";

export const getEquipmentHealth = async () => {
  const res = await api.get("/maintenance/equipment-health");
  return res.data.equipmentHealth;
};

export const getRecommendedActions = async () => {
  const res = await api.get("/maintenance/recommended-actions");
  return res.data.recommendedActions;
};

export const getRecentIncidents = async () => {
  const res = await api.get("/maintenance/recent-incidents");
  return res.data.recentIncidents;
};
