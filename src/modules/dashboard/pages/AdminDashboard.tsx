import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Users,
  Package,
  ShoppingBag,
  Tag,
  Grid,
  Settings,
  Shield,
  Truck,
  BarChart3,
  FileText,
} from "lucide-react";
import { useAuthStore } from "@core/store/auth.store";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  permission?: string;
}

export const AdminDashboard: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  const menuItems: MenuItem[] = [
    {
      label: "Dashboard",
      icon: <BarChart3 size={20} />,
      path: "/admin",
    },
    {
      label: "Usuarios",
      icon: <Users size={20} />,
      path: "/admin/users",
      permission: "usuarios.leer",
    },
    {
      label: "Roles y Permisos",
      icon: <Shield size={20} />,
      path: "/admin/roles",
      permission: "roles.leer",
    },
    {
      label: "Productos",
      icon: <Package size={20} />,
      path: "/admin/products",
      permission: "productos.leer",
    },
    {
      label: "Categorías",
      icon: <Grid size={20} />,
      path: "/admin/categories",
      permission: "categorias.leer",
    },
    {
      label: "Marcas",
      icon: <Tag size={20} />,
      path: "/admin/brands",
      permission: "marcas.leer",
    },
    {
      label: "Pedidos",
      icon: <ShoppingBag size={20} />,
      path: "/admin/orders",
      permission: "pedidos.leer",
    },
    {
      label: "Envíos",
      icon: <Truck size={20} />,
      path: "/admin/shipments",
      permission: "envios.leer",
    },
    {
      label: "Reportes",
      icon: <FileText size={20} />,
      path: "/admin/reports",
      permission: "reportes.leer",
    },
    {
      label: "Configuración",
      icon: <Settings size={20} />,
      path: "/admin/settings",
    },
  ];

  const hasPermission = (permission?: string) => {
    if (!permission) return true;
    if (user?.rol_detalle?.nombre === "Admin") return true;
    // Aquí agregar lógica de permisos más detallada
    return true;
  };

  const filteredMenuItems = menuItems.filter((item) =>
    hasPermission(item.permission)
  );

  return (
    <div className="min-h-screen bg-background-primary flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 flex-shrink-0">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-xl font-display font-bold text-primary-600">
              Panel de Admin
            </h2>
            <p className="text-sm text-neutral-600 mt-1">
              {user?.rol_detalle?.nombre}
            </p>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {filteredMenuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                        ${
                          isActive
                            ? "bg-primary-50 text-primary-600 font-medium"
                            : "text-neutral-700 hover:bg-neutral-50"
                        }
                      `}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-200">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-4 py-2 text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <span>← Volver a la Tienda</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
