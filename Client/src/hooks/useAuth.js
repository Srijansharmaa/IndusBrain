import { useState, useCallback } from "react";
import { login as loginService } from "../services/authService";

export function useAuth() {
  const [user, setUser] = useState(null);

  const login = useCallback(async (credentials) => {
    const loggedInUser = await loginService(credentials);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return { user, login, logout };
}
