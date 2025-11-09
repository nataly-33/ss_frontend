import React, { useEffect, useState } from "react";
import { Trash2, Truck, Plus } from "lucide-react";
import { Button } from "@shared/components/ui/Button";
import { shipmentsService, usersService } from "../services/admin.service";
import type { Shipment, User } from "../types";
import { PageHeader, SearchBar } from "../components";

const ESTADOS_ENVIO = [
  {
    value: "pendiente",
    label: "Pendiente",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    value: "preparando",
    label: "Preparando",
    color: "bg-orange-100 text-orange-700",
  },
  { value: "recogido", label: "Recogido", color: "bg-blue-100 text-blue-700" },
  {
    value: "en_transito",
    label: "En Tránsito",
    color: "bg-purple-100 text-purple-700",
  },
  {
    value: "entregado",
    label: "Entregado",
    color: "bg-green-100 text-green-700",
  },
  { value: "devuelto", label: "Devuelto", color: "bg-gray-100 text-gray-700" },
  { value: "cancelado", label: "Cancelado", color: "bg-red-100 text-red-700" },
];

export const ShipmentsManagement: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [deliveryUsers, setDeliveryUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(
    null
  );
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [selectedDelivery, setSelectedDelivery] = useState("");

  useEffect(() => {
    loadShipments();
    loadDeliveryUsers();
  }, []);

  const loadShipments = async () => {
    try {
      setLoading(true);
      const response = await shipmentsService.getAll({
        search: searchTerm,
        estado: filterEstado,
      });
      setShipments(response.results || response);
    } catch (error) {
      console.error("Error loading shipments:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadDeliveryUsers = async () => {
    try {
      // Filtrar usuarios con rol Delivery
      const response = await usersService.getAll({ rol: "Delivery" });
      const deliveryUsers = Array.isArray(response)
        ? response
        : response.results || [];
      setDeliveryUsers(deliveryUsers);
    } catch (error) {
      console.error("Error loading delivery users:", error);
    }
  };

  const handleDeleteShipment = async (shipment: Shipment) => {
    if (
      !window.confirm(
        `¿Estás seguro de eliminar el envío ${shipment.numero_seguimiento}?`
      )
    )
      return;

    try {
      await shipmentsService.delete(shipment.id);
      loadShipments();
    } catch (error) {
      console.error("Error deleting shipment:", error);
      alert("Error al eliminar envío");
    }
  };

  const handleStatusChange = async () => {
    if (!selectedShipment || !newStatus) return;

    try {
      await shipmentsService.updateStatus(selectedShipment.id, newStatus);
      setShowStatusModal(false);
      loadShipments();
    } catch (error) {
      console.error("Error updating shipment status:", error);
      alert("Error al actualizar estado del envío");
    }
  };

  const handleAssignDelivery = async () => {
    if (!selectedShipment || !selectedDelivery) return;

    try {
      await shipmentsService.assignDelivery(
        selectedShipment.id,
        selectedDelivery
      );
      setShowDeliveryModal(false);
      loadShipments();
    } catch (error) {
      console.error("Error assigning delivery:", error);
      alert("Error al asignar delivery");
    }
  };

  // Refetch on search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadShipments();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, filterEstado]);

  const getStatusColor = (estado: string) => {
    const found = ESTADOS_ENVIO.find((e) => e.value === estado);
    return found?.color || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="p-8">
      <PageHeader
        title="Gestión de Envíos"
        description="Administra todos los envíos de pedidos"
      />

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar por número de seguimiento..."
            />
          </div>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:border-primary-500"
          >
            <option value="">Todos los estados</option>
            {ESTADOS_ENVIO.map((estado) => (
              <option key={estado.value} value={estado.value}>
                {estado.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Shipments Table */}
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
                    Número Seguimiento
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-700">
                    Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-700">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-700">
                    Delivery
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-700">
                    Transportista
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
                {shipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 text-sm font-medium text-neutral-900">
                      {shipment.numero_seguimiento}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {shipment.pedido_numero}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          shipment.estado
                        )}`}
                      >
                        {ESTADOS_ENVIO.find((e) => e.value === shipment.estado)
                          ?.label || shipment.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {shipment.asignado_a?.nombre_completo || "No asignado"}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {shipment.empresa_transportista || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {new Date(shipment.created_at).toLocaleDateString(
                        "es-ES"
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedShipment(shipment);
                            setNewStatus(shipment.estado);
                            setShowStatusModal(true);
                          }}
                          className="p-2 hover:bg-primary-50 rounded-lg text-primary-600"
                          title="Cambiar estado"
                        >
                          <Truck size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedShipment(shipment);
                            setSelectedDelivery(shipment.asignado_a?.id || "");
                            setShowDeliveryModal(true);
                          }}
                          className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                          title="Asignar delivery"
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteShipment(shipment)}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                          title="Eliminar envío"
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

      {shipments.length === 0 && !loading && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-neutral-600">No se encontraron envíos</p>
        </div>
      )}

      {/* Status Change Modal */}
      {showStatusModal && selectedShipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              Cambiar Estado - {selectedShipment.numero_seguimiento}
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
                  {ESTADOS_ENVIO.map((estado) => (
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

      {/* Delivery Assignment Modal */}
      {showDeliveryModal && selectedShipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              Asignar Delivery - {selectedShipment.numero_seguimiento}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Personal de Delivery
                </label>
                <select
                  value={selectedDelivery}
                  onChange={(e) => setSelectedDelivery(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500"
                >
                  <option value="">Seleccionar delivery...</option>
                  {deliveryUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.nombre_completo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowDeliveryModal(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleAssignDelivery}
                  className="flex-1"
                >
                  Asignar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
