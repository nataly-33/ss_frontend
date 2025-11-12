import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AdminLayout } from "@shared/components/layout/AdminLayout";

export const AdminDashboard: React.FC = () => {
  const location = useLocation();

  // Determinar el título basado en la ruta
  const getTitleFromPath = () => {
    if (location.pathname === "/admin") return "Dashboard";
    if (location.pathname === "/admin/users") return "Gestión de Usuarios";
    if (location.pathname === "/admin/roles") return "Gestión de Roles";
    if (location.pathname === "/admin/products") return "Gestión de Productos";
    if (location.pathname === "/admin/categories")
      return "Gestión de Categorías";
    if (location.pathname === "/admin/brands") return "Gestión de Marcas";
    if (location.pathname === "/admin/orders") return "Gestión de Pedidos";
    if (location.pathname === "/admin/shipments") return "Gestión de Envíos";
    if (location.pathname === "/admin/settings") return "Configuración";
    if (location.pathname === "/admin/reports") return "Reportes Dinámicos";
    if (location.pathname === "/admin/analytics") return "Estadísticas";
    if (location.pathname === "/admin/predictions")
      return "Predicciones con AI";

    return "Panel de Administración";
  };

  return (
    <AdminLayout title={getTitleFromPath()}>
      <Outlet />
    </AdminLayout>
  );
};
