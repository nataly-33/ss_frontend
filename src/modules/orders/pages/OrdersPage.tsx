import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ChevronRight, Filter } from "lucide-react";
import { ordersService } from "../services/orders.service";
import type { Order } from "../services/orders.service";

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    loadOrders();
  }, [filterStatus]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const params = filterStatus !== "all" ? { estado: filterStatus } : {};
      const ordersData = await ordersService.getOrders(params);
      setOrders(ordersData);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al cargar pedidos");
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (estado: string) => {
    const colors: Record<string, string> = {
      pendiente: "bg-yellow-100 text-yellow-800",
      pago_recibido: "bg-blue-100 text-blue-800",
      confirmado: "bg-green-100 text-green-800",
      preparando: "bg-purple-100 text-purple-800",
      enviado: "bg-indigo-100 text-indigo-800",
      entregado: "bg-green-100 text-green-800",
      cancelado: "bg-red-100 text-red-800",
    };
    return colors[estado] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (estado: string) => {
    const labels: Record<string, string> = {
      pendiente: "Pendiente",
      pago_recibido: "Pago Recibido",
      confirmado: "Confirmado",
      preparando: "Preparando",
      enviado: "Enviado",
      entregado: "Entregado",
      cancelado: "Cancelado",
    };
    return labels[estado] || estado;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
            Mis Pedidos
          </h1>
          <p className="text-neutral-600">
            Revisa el estado y detalles de tus compras
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <Filter size={20} className="text-neutral-400" />
            <span className="font-medium text-neutral-700">Filtrar por:</span>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === "all"
                    ? "bg-primary-600 text-white"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterStatus("pendiente")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === "pendiente"
                    ? "bg-primary-600 text-white"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                Pendientes
              </button>
              <button
                onClick={() => setFilterStatus("enviado")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === "enviado"
                    ? "bg-primary-600 text-white"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                Enviados
              </button>
              <button
                onClick={() => setFilterStatus("entregado")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === "entregado"
                    ? "bg-primary-600 text-white"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                Entregados
              </button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={48} className="text-neutral-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              {filterStatus === "all"
                ? "No tienes pedidos aún"
                : "No hay pedidos con este filtro"}
            </h3>
            <p className="text-neutral-600 mb-6">
              {filterStatus === "all"
                ? "Realiza tu primera compra y aparecerá aquí"
                : "Intenta cambiar el filtro para ver otros pedidos"}
            </p>
            {filterStatus === "all" && (
              <Link
                to="/products"
                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Comenzar a Comprar
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-neutral-900">
                        Pedido #{order.numero_pedido}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.estado
                        )}`}
                      >
                        {getStatusLabel(order.estado)}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600">
                      {new Date(order.fecha_creacion).toLocaleDateString(
                        "es-ES",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                  <ChevronRight className="text-neutral-400 flex-shrink-0" />
                </div>

                {/* Order Preview */}
                <div className="flex items-center gap-4 mb-4">
                  {order.items.slice(0, 3).map((item) => (
                    <img
                      key={item.id}
                      src={
                        item.prenda.imagen_principal || "/images/placeholder.jpg"
                      }
                      alt={item.prenda.nombre}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-neutral-600">
                        +{order.items.length - 3}
                      </span>
                    </div>
                  )}
                </div>

                {/* Order Info */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                  <div>
                    <p className="text-sm text-neutral-600">
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "producto" : "productos"}
                    </p>
                    <p className="text-sm text-neutral-600">
                      Pago: {order.metodo_pago.nombre}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-neutral-600 mb-1">Total</p>
                    <p className="text-xl font-bold text-primary-600">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
