import { createContext, useContext, useMemo, useState } from "react";

import api from "../api/api.js";

const AuthContext = createContext(null);

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

  const persistAuth = ({ token, user: authenticatedUser }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(authenticatedUser));
    setUser(authenticatedUser);
  };

  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    persistAuth(data);
    return data.user;
  };

  const register = async (details) => {
    const { data } = await api.post("/auth/register", details);
    persistAuth(data);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, login, logout, register }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export { AuthProvider, useAuth };
