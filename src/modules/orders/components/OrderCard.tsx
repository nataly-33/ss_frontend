import type { Order } from "../types";
import { Package, Calendar, DollarSign, Eye } from "lucide-react";
import { Button } from "@shared/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { PRIVATE_ROUTES } from "@core/config/routes";

interface OrderCardProps {
  order: Order;
}

const getStatusColor = (estado: string) => {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    pendiente: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-200",
    },
    procesando: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    enviado: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
    },
    entregado: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
    },
    cancelado: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
    },
  };

  return colors[estado] || colors.pendiente;
};

const getStatusLabel = (estado: string) => {
  const labels: Record<string, string> = {
    pendiente: "Pendiente",
    procesando: "Procesando",
    enviado: "Enviado",
    entregado: "Entregado",
    cancelado: "Cancelado",
  };

  return labels[estado] || estado;
};

export function OrderCard({ order }: OrderCardProps) {
  const navigate = useNavigate();
  const statusColor = getStatusColor(order.estado);

  const detalles = order?.detalles ?? [];
  const fechaStr = order?.created_at
    ? new Date(order.created_at).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "-";
  const total = Number(order?.total ?? 0);

  // Calcular cantidad total de artículos (suma de cantidades)
  const cantidadTotal = detalles.reduce((sum, item) => sum + item.cantidad, 0);

  const handleViewDetails = () => {
    navigate(PRIVATE_ROUTES.ORDER_DETAIL(order.id));
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="bg-neutral-50 px-6 py-4 border-b flex justify-between items-center">
        <div>
          <h3 className="text-lg font-display font-bold text-text-primary">
            Pedido #{order.numero_pedido}
          </h3>
          <p className="text-sm text-text-secondary flex items-center gap-1 mt-1">
            <Calendar className="w-4 h-4" />
            {fechaStr}
          </p>
        </div>

        <div
          className={`
            px-4 py-2 rounded-full font-semibold text-sm border-2
            ${statusColor.bg} ${statusColor.text} ${statusColor.border}
          `}
        >
          {getStatusLabel(order.estado)}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        {/* Items Preview */}
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-primary-main" />
          <p className="text-text-secondary">
            {cantidadTotal} {cantidadTotal === 1 ? "artículo" : "artículos"}
          </p>
        </div>

        {/* Items List */}
        <div className="space-y-2 mb-4">
          {detalles.slice(0, 2).map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              {item.prenda?.imagen_principal && (
                <img
                  src={item.prenda.imagen_principal}
                  alt={item.prenda.nombre}
                  className="w-12 h-12 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary line-clamp-1">
                  {item.prenda?.nombre}
                </p>
                <p className="text-xs text-text-secondary">
                  Talla: {item.talla?.nombre} • Cantidad: {item.cantidad}
                </p>
              </div>
            </div>
          ))}
          {detalles.length > 2 && (
            <p className="text-xs text-text-secondary italic">
              +{detalles.length - 2} artículos más
            </p>
          )}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2 text-text-secondary">
            <DollarSign className="w-5 h-5" />
            <span className="font-semibold">Total:</span>
          </div>
          <span className="text-2xl font-display font-bold text-primary-main">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-neutral-50 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewDetails}
          className="w-full"
        >
          <Eye className="w-4 h-4 mr-2" />
          Ver detalles
        </Button>
      </div>
    </div>
  );
}
