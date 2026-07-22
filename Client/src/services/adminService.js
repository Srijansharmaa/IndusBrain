import api from "./api";

export const getAdminUsers = async () => {
  const res = await api.get("/admin/users");
  return res.data.users;
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
