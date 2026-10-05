import React, { useEffect, useState, useContext } from "react";
import api from "../config/Api";
import toast from "react-hot-toast";

const AuthContext = React.createContext();

export const AuthProvider = (props) => {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("RolixerUser");

    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser);
    } catch {
      sessionStorage.removeItem("RolixerUser");
      return null;
    }
  });

  const [isLogin, setIsLogin] = useState(!!user);
  const [role, setRole] = useState(user?.role || "");

  useEffect(() => {
    setIsLogin(!!user);
    setRole(user?.role || "");

    // User state change hone par storage bhi sync rahe
    if (user) {
      sessionStorage.setItem("RolixerUser", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("RolixerUser");
    }
  }, [user]);

  // Login
  const login = (userData) => {
    if (!userData || typeof userData !== "object") {
      throw new Error("Invalid user data received from login.");
    }

    sessionStorage.setItem("RolixerUser", JSON.stringify(userData));
    setUser(userData);
  };

  // Logout
  const logout = async () => {
    try {
      const response = await api.post("/auth/logout");
      toast.success(response?.data?.message || "Logout Succesfull");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setUser(null);
      setIsLogin(false);
      setRole("");
      sessionStorage.removeItem("RolixerUser");
    }
  };

  const value = {
    user,
    setUser,
    isLogin,
    setIsLogin,
    role,
    setRole,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
