import { useCallback, useMemo, useState } from "react";

import api from "../api/api.js";
import AuthContext from "./authContext.js";

const getStoredUser = () => {
  const storedUser = localStorage.getItem("user");

  try {
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);

  const persistAuth = useCallback(({ token, user: authenticatedUser }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(authenticatedUser));
    setUser(authenticatedUser);
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    persistAuth(data);
    return data.user;
  }, [persistAuth]);

  const register = useCallback(async (details) => {
    const { data } = await api.post("/auth/register", details);
    persistAuth(data);
    return data.user;
  }, [persistAuth]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, login, logout, register }),
    [user, login, logout, register]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider };
