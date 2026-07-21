import api, { setToken, clearToken } from "./api";

/**
 * Matches the existing LoginScreen (name + plant + role, no password).
 * Issues a real JWT behind the scenes via POST /api/auth/session.
 */
export const login = async ({ name, plant, role }) => {
  const res = await api.post("/auth/session", { name, plant, role });

  setToken(res.data.token);

  return {
    name: res.data.user.name,
    plant: res.data.user.plant,
    role: res.data.user.role,
  };
};

export const logout = () => {
  clearToken();
};

/** Full email/password registration, for when a real signup form exists. */
export const register = async ({ name, email, password, role }) => {
  const res = await api.post("/auth/register", { name, email, password, role });
  setToken(res.data.token);
  return res.data.user;
};

/** Full email/password login, for when a real login form exists. */
export const loginWithPassword = async ({ email, password }) => {
  const res = await api.post("/auth/login", { email, password });
  setToken(res.data.token);
  return res.data.user;
};

export const getCurrentUser = async () => {
  const res = await api.get("/auth/me");
  return res.data.user;
};
