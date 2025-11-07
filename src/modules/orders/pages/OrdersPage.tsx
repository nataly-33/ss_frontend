import type { Order } from "../types";
import { useState, useEffect } from "react";
import { Package } from "lucide-react";
import { ordersService } from "../services/orders.service";
import { OrderCard, OrderFilter } from "../components";
import { LoadingSpinner } from "@shared/components/ui/LoadingSpinner";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<{
    estado?: string;
    fechaDesde?: string;
    fechaHasta?: string;
  }>({});

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, filters]);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await ordersService.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...orders];

    // Filter by estado
    if (filters.estado) {
      filtered = filtered.filter((order) => order.estado === filters.estado);
    }

    // Filter by fecha desde
    if (filters.fechaDesde) {
      const desde = new Date(filters.fechaDesde);
      filtered = filtered.filter(
        (order) => new Date(order.created_at) >= desde
      );
    }

    // Filter by fecha hasta
    if (filters.fechaHasta) {
      const hasta = new Date(filters.fechaHasta);
      hasta.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter(
        (order) => new Date(order.created_at) <= hasta
      );
    }

    setFilteredOrders(filtered);
  };

  const handleFilterChange = (newFilters: {
    estado?: string;
    fechaDesde?: string;
    fechaHasta?: string;
  }) => {
    setFilters(newFilters);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-main py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start px-6">
          <div>
            <h1 className="text-4xl font-display font-bold text-text-primary mb-2">
              Mis Pedidos
            </h1>
            <p className="text-text-secondary">
              Revisa el estado y detalles de tus compras
            </p>
          </div>

          <OrderFilter onFilterChange={handleFilterChange} />
        </div>

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Package className="w-20 h-20 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-2xl font-display font-bold text-text-primary mb-2">
              {orders.length === 0
                ? "No tienes pedidos aún"
                : "No hay pedidos que coincidan con los filtros"}
            </h3>
            <p className="text-text-secondary mb-6">
              {orders.length === 0
                ? "Comienza a explorar nuestros productos y realiza tu primera compra"
                : "Intenta ajustar los filtros para ver más resultados"}
            </p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-text-secondary">
                Mostrando {filteredOrders.length} de {orders.length} pedidos
              </p>
            </div>

            {/* Orders List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
