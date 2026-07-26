import { useState, useCallback, useEffect } from "react";
import { login as loginService, logout as logoutService, getCurrentUser } from "../services/authService";
import { getToken } from "../services/api";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      if (getToken()) {
        try {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        } catch {
          logoutService();
        }
      }
      setInitializing(false);
    };
    restoreSession();
  }, []);

  const login = useCallback(async (credentials) => {
    const loggedInUser = await loginService(credentials);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const logout = useCallback(() => {
    logoutService();
    setUser(null);
  }, []);

  return { user, login, logout, initializing };
}
