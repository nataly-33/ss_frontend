import React, { useEffect, useState } from "react";
import {
  Users,
  Package,
  ShoppingBag,
  Truck,
  TrendingUp,
  DollarSign,
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingShipments: number;
  averageOrderValue: number;
}

export const AdminDashboardOverview: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingShipments: 0,
    averageOrderValue: 0,
  });

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setStats({
        totalUsers: 1250,
        totalProducts: 485,
        totalOrders: 1820,
        totalRevenue: 45680.5,
        pendingShipments: 23,
        averageOrderValue: 25.1,
      });
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    }
  };

  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    color,
  }: {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subtitle?: string;
    color: string;
  }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-neutral-600 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-neutral-900 mt-2">{value}</h3>
          {subtitle && (
            <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>{Icon}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<Users className="text-blue-600" size={24} />}
          title="Usuarios Totales"
          value={stats.totalUsers}
          subtitle="Registrados en el sistema"
          color="bg-blue-50"
        />
        <StatCard
          icon={<Package className="text-purple-600" size={24} />}
          title="Productos"
          value={stats.totalProducts}
          subtitle="En el catálogo"
          color="bg-purple-50"
        />
        <StatCard
          icon={<ShoppingBag className="text-green-600" size={24} />}
          title="Pedidos"
          value={stats.totalOrders}
          subtitle="Total del sistema"
          color="bg-green-50"
        />
        <StatCard
          icon={<DollarSign className="text-emerald-600" size={24} />}
          title="Ingresos"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          subtitle="Total acumulado"
          color="bg-emerald-50"
        />
        <StatCard
          icon={<Truck className="text-orange-600" size={24} />}
          title="Envíos Pendientes"
          value={stats.pendingShipments}
          subtitle="En proceso"
          color="bg-orange-50"
        />
        <StatCard
          icon={<TrendingUp className="text-pink-600" size={24} />}
          title="Ticket Promedio"
          value={`$${stats.averageOrderValue.toFixed(2)}`}
          subtitle="Por pedido"
          color="bg-pink-50"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">
            Pedidos Recientes
          </h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between pb-3 border-b border-neutral-200 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-900">
                    Pedido #{12000 + i}
                  </p>
                  <p className="text-xs text-neutral-500">Hace {i * 2} horas</p>
                </div>
                <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                  Completado
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-neutral-900 mb-4">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Nuevo Usuario", icon: "👤" },
            { label: "Nuevo Producto", icon: "📦" },
            { label: "Ver Pedidos", icon: "🛒" },
            { label: "Gestionar Envíos", icon: "🚚" },
          ].map((action, i) => (
            <button
              key={i}
              className="flex flex-col items-center gap-2 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 hover:border-primary-300 transition-colors"
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-sm text-center text-neutral-700">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
