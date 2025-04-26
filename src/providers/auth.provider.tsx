import { useAuthContext } from "@/context";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AuthProvider: React.FC = () => {
  const { user } = useAuthContext();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

export default AuthProvider;
