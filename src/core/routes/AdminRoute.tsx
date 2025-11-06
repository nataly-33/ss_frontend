import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@core/store/auth.store";

export const AdminRoute: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user?.rol_detalle?.nombre === "Admin";
  const isEmpleado = user?.rol_detalle?.nombre === "Empleado";

  if (!isAdmin && !isEmpleado) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
