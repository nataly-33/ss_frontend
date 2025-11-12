import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import { StatCard } from "../components/StatCard";
import { analyticsService } from "../services/reports.service";
import type { AnalyticsOverview } from "../types";

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const analyticsData = await analyticsService.getOverview({
        months: 6,
        days: 30,
      });
      setData(analyticsData);
    } catch (err) {
      console.error("Error al cargar analytics:", err);
      setError("Error al cargar los datos");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-800">
            {error || "No se pudieron cargar los datos"}
          </p>
          <button
            onClick={loadAnalytics}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const { summary, sales_by_month, top_selling_products, inventory_summary } =
    data;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Analytics & Estadísticas
          </h1>
        </div>
        <p className="text-gray-600">
          Visualiza el rendimiento de tu negocio en tiempo real
        </p>
      </div>*/}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Ventas"
          value={`Bs. ${summary.total_sales.toLocaleString("es-BO", {
            minimumFractionDigits: 2,
          })}`}
          icon={TrendingUp}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
          trend={{
            value: `Bs. ${summary.sales_this_month.toLocaleString(
              "es-BO"
            )} este mes`,
            isPositive: true,
          }}
        />

        <StatCard
          title="Total Pedidos"
          value={summary.total_orders}
          icon={ShoppingCart}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
          trend={{
            value: `${summary.orders_this_month} este mes`,
            isPositive: summary.orders_this_month > 0,
          }}
        />

        <StatCard
          title="Productos"
          value={summary.total_products}
          icon={Package}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
          trend={{
            value: `${inventory_summary.low_stock_items} con stock bajo`,
            isPositive: false,
          }}
        />

        <StatCard
          title="Clientes"
          value={summary.total_customers}
          icon={Users}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
          trend={{
            value: `${summary.customers_this_month} nuevos este mes`,
            isPositive: true,
          }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales by Month Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Ventas por Mes
          </h2>
          <div className="space-y-3">
            {sales_by_month.slice(-6).map((item, index) => {
              const maxSales = Math.max(
                ...sales_by_month.map((s) => s.total_sales)
              );
              const percentage = (item.total_sales / maxSales) * 100;

              return (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">
                      {item.month}
                    </span>
                    <span className="text-gray-600">
                      Bs. {item.total_sales.toLocaleString("es-BO")}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.order_count} pedidos
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Top Productos Más Vendidos
          </h2>
          <div className="space-y-3">
            {top_selling_products.slice(0, 5).map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {index + 1}. {product.product_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {product.quantity_sold} vendidos
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    Bs. {product.total_revenue.toLocaleString("es-BO")}
                  </p>
                  <p className="text-xs text-gray-500">
                    Bs. {product.price} c/u
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Resumen de Inventario
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">
              {inventory_summary.total_products}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total Productos</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">
              {inventory_summary.total_stock}
            </p>
            <p className="text-sm text-gray-600 mt-1">Stock Total</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-3xl font-bold text-yellow-600">
              {inventory_summary.low_stock_items}
            </p>
            <p className="text-sm text-gray-600 mt-1">Stock Bajo</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-3xl font-bold text-red-600">
              {inventory_summary.out_of_stock_items}
            </p>
            <p className="text-sm text-gray-600 mt-1">Sin Stock</p>
          </div>
        </div>
      </div>
    </div>
  );
};
