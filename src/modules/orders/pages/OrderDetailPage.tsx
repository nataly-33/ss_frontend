import type { Order } from "../types";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import { ordersService } from "../services/orders.service";
import { OrderDetail, OrderTimeline } from "../components";
import { Button } from "@shared/components/ui/Button";
import { LoadingSpinner } from "@shared/components/ui/LoadingSpinner";
import { PRIVATE_ROUTES } from "@core/config/routes";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id]);

  const loadOrder = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const data = await ordersService.getOrder(id);
      setOrder(data);
    } catch (error) {
      console.error("Error loading order:", error);
      navigate(PRIVATE_ROUTES.ORDERS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!id || !order) return;

    const confirmed = window.confirm(
      "¿Estás seguro de que deseas cancelar este pedido? Esta acción no se puede deshacer."
    );

    if (!confirmed) return;

    setIsCancelling(true);
    try {
      await ordersService.cancelOrder(id);
      await loadOrder(); // Reload to see updated status
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("No se pudo cancelar el pedido. Por favor intenta nuevamente.");
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const canCancel =
    order.estado === "pendiente" ||
    order.estado === "pago_recibido" ||
    order.estado === "confirmado";

  return (
    <div className="min-h-screen bg-background-main py-8">
      <div className="container-custom">
        {/* Back Button */}
        <button
          onClick={() => navigate(PRIVATE_ROUTES.ORDERS)}
          className="flex items-center gap-2 text-text-secondary hover:text-primary-main transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Volver a mis pedidos</span>
        </button>

        {/* Page Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold text-text-primary mb-2">
              Detalle del Pedido
            </h1>
            <p className="text-text-secondary">
              Toda la información sobre tu compra
            </p>
          </div>

          {canCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelOrder}
              isLoading={isCancelling}
              className="text-red-600 hover:bg-red-50"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar pedido
            </Button>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2">
            <OrderDetail order={order} />
          </div>

          {/* Right Column - Timeline */}
          <div className="lg:col-span-1">
            <OrderTimeline
              estado={order.estado}
              fechaCreacion={order.created_at}
              fechaActualizacion={order.updated_at}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
