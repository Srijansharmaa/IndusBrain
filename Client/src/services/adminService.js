import { ADMIN_USERS, ADMIN_METRICS, ACTIVITY_LOG } from "../constants/adminData";

// TODO(backend): replace with `axios.get("/api/admin/users")`
export const getAdminUsers = async () => ADMIN_USERS;

// TODO(backend): replace with `axios.get("/api/admin/metrics")`
export const getAdminMetrics = async () => ADMIN_METRICS;

// TODO(backend): replace with `axios.get("/api/admin/activity-log")`
export const getActivityLog = async () => ACTIVITY_LOG;

// TODO(backend): replace with `axios.post("/api/admin/users/invite", { email, role })`
export const inviteUser = async (email, role) => ({ ok: true });
