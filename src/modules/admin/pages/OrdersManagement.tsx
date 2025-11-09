import React, { useEffect, useState } from "react";
import { Eye, Trash2, Package } from "lucide-react";
import { Button } from "@shared/components/ui/Button";
import { ordersService } from "../services/admin.service";
import type { Order } from "../types";
import { PageHeader, SearchBar, StatusBadge } from "../components";

const ESTADOS_PEDIDO = [
  {
    value: "pendiente",
    label: "Pendiente",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    value: "pago_recibido",
    label: "Pago Recibido",
    color: "bg-blue-100 text-blue-700",
  },
  {
    value: "confirmado",
    label: "Confirmado",
    color: "bg-purple-100 text-purple-700",
  },
  {
    value: "preparando",
    label: "Preparando",
    color: "bg-orange-100 text-orange-700",
  },
  {
    value: "enviado",
    label: "Enviado",
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    value: "entregado",
    label: "Entregado",
    color: "bg-green-100 text-green-700",
  },
  { value: "cancelado", label: "Cancelado", color: "bg-red-100 text-red-700" },
];

export const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersService.getAll({
        search: searchTerm,
        estado: filterEstado,
      });
      setOrders(response.results || response);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (order: Order) => {
    if (
      !window.confirm(
        `¿Estás seguro de eliminar el pedido ${order.numero_pedido}?`
      )
    )
      return;

    try {
      // TODO: Implement cancel/delete order
      alert("Funcionalidad en desarrollo");
    } catch (error) {
      console.error("Error canceling order:", error);
      alert("Error al cancelar pedido");
    }
  };

  const handleStatusChange = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      await ordersService.updateStatus(selectedOrder.id, newStatus);
      setShowStatusModal(false);
      loadOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Error al actualizar estado del pedido");
    }
  };

  // Refetch on search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadOrders();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, filterEstado]);

  const getStatusColor = (estado: string) => {
    const found = ESTADOS_PEDIDO.find((e) => e.value === estado);
    return found?.color || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="p-8">
      <PageHeader
        title="Gestión de Pedidos"
        description="Administra todos los pedidos del sistema"
      />

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar por número de pedido..."
            />
          </div>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:border-primary-500"
          >
            <option value="">Todos los estados</option>
            {ESTADOS_PEDIDO.map((estado) => (
              <option key={estado.value} value={estado.value}>
                {estado.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-700">
                    Número
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-700">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-700">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-700">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-700">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 text-sm font-medium text-neutral-900">
                      {order.numero_pedido}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {order.usuario_detalle?.nombre_completo || "Cliente"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-neutral-900">
                      ${order.total}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          order.estado
                        )}`}
                      >
                        {ESTADOS_PEDIDO.find((e) => e.value === order.estado)
                          ?.label || order.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {new Date(order.created_at).toLocaleDateString("es-ES")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setNewStatus(order.estado);
                            setShowStatusModal(true);
                          }}
                          className="p-2 hover:bg-primary-50 rounded-lg text-primary-600"
                          title="Ver/Cambiar estado"
                        >
                          <Package size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order)}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                          title="Cancelar pedido"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {orders.length === 0 && !loading && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-neutral-600">No se encontraron pedidos</p>
        </div>
      )}

      {/* Status Change Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              Cambiar Estado - {selectedOrder.numero_pedido}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Nuevo Estado
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500"
                >
                  {ESTADOS_PEDIDO.map((estado) => (
                    <option key={estado.value} value={estado.value}>
                      {estado.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleStatusChange}
                  className="flex-1"
                >
                  Guardar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
