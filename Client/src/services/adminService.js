import api from "./api";

export const getAdminUsers = async (params = {}) => {
  const res = await api.get("/admin/users", { params });
  return res.data;
};

export const getAdminMetrics = async () => {
  const res = await api.get("/admin/metrics");
  return res.data.metrics;
};

export const getActivityLog = async () => {
  const res = await api.get("/admin/activity-log");
  return res.data.activityLog;
};

export const inviteUser = async (email, role) => {
  const res = await api.post("/admin/users/invite", { email, role });
  return res.data;
};

export const updateUser = async (id, updates) => {
  const res = await api.patch(`/admin/users/${id}`, updates);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/admin/users/${id}`);
  return res.data;
};
