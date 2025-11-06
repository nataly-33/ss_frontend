import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ChevronRight } from "lucide-react";

interface Order {
  id: string;
  numero_pedido: string;
  estado: string;
  total: number;
  total_items: number;
  created_at: string;
}

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      // Aquí irá la integración con el backend
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOrders([]);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (estado: string) => {
    const colors: any = {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-display font-bold text-neutral-900 mb-8">
          Mis Pedidos
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={48} className="text-neutral-400" />
            </div>
            <p className="text-neutral-600 mb-4">No tienes pedidos aún</p>
            <Link
              to="/products"
              className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Comenzar a Comprar
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="font-semibold text-neutral-900">
                        Pedido #{order.numero_pedido}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.estado
                        )}`}
                      >
                        {order.estado}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600">
                      {new Date(order.created_at).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-neutral-600 mt-1">
                      {order.total_items}{" "}
                      {order.total_items === 1 ? "producto" : "productos"}
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="text-lg font-bold text-primary-600">
                        ${order.total}
                      </p>
                    </div>
                    <ChevronRight className="text-neutral-400" />
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
