import type { Order } from "../types";
import {
  Package,
  MapPin,
  CreditCard,
  DollarSign,
  Calendar,
  User,
} from "lucide-react";

interface OrderDetailProps {
  order: Order;
}

// Función para obtener datos de la dirección (usa el snapshot por defecto, o los detalles si no hay snapshot)
const getShippingAddressData = (order: Order) => {
  if (
    order.direccion_snapshot &&
    typeof order.direccion_snapshot === "object"
  ) {
    return order.direccion_snapshot;
  }
  if (
    order.direccion_envio_detalle &&
    typeof order.direccion_envio_detalle === "object"
  ) {
    return order.direccion_envio_detalle;
  }
  return null;
};

// Función para obtener datos del método de pago
const getPaymentMethodData = (order: Order) => {
  if (order.pagos && order.pagos.length > 0) {
    const ultimoPago = order.pagos[order.pagos.length - 1];
    return ultimoPago.metodo_pago || null;
  }
  return null;
};

// Función para obtener datos del usuario
const getUserData = (order: Order) => {
  if (order.usuario_detalle && typeof order.usuario_detalle === "object") {
    return order.usuario_detalle;
  }
  if (typeof order.usuario === "object" && order.usuario) {
    return order.usuario;
  }
  return null;
};

export function OrderDetail({ order }: OrderDetailProps) {
  const detalles = order?.detalles ?? [];
  const total = Number(order?.total ?? 0);

  const direccion = getShippingAddressData(order);
  const metodoPago = getPaymentMethodData(order);
  const usuarioData = getUserData(order);

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-text-primary">
              Pedido #{order.numero_pedido}
            </h2>
            <p className="text-text-secondary flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4" />
              {order?.created_at
                ? new Date(order.created_at).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : "-"}
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-text-secondary">Total</p>
            <p className="text-3xl font-display font-bold text-primary-main">
              ${total.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-display font-bold text-text-primary flex items-center gap-2 mb-4">
          <Package className="w-6 h-6 text-primary-main" />
          Artículos ({detalles.length})
        </h3>

        <div className="space-y-4">
          {detalles.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg"
            >
              {item.prenda?.imagen_principal && (
                <img
                  src={item.prenda.imagen_principal}
                  alt={item.prenda?.nombre}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}

              <div className="flex-1">
                <h4 className="font-semibold text-text-primary">
                  {item.prenda?.nombre}
                </h4>
                <p className="text-sm text-text-secondary mt-1">
                  Talla:{" "}
                  <span className="font-medium">{item.talla?.nombre}</span>
                </p>
                <p className="text-sm text-text-secondary">
                  Cantidad: <span className="font-medium">{item.cantidad}</span>
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-text-secondary">Precio unitario</p>
                <p className="font-semibold text-text-primary">
                  ${Number(item.precio_unitario ?? 0).toFixed(2)}
                </p>
                <p className="text-lg font-display font-bold text-primary-main mt-1">
                  ${Number(item.subtotal ?? 0).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-6 pt-6 border-t space-y-2">
          <div className="flex justify-between text-text-secondary">
            <span>Subtotal:</span>
            <span className="font-semibold">
              $
              {detalles
                .reduce((sum, item) => sum + Number(item.subtotal ?? 0), 0)
                .toFixed(2)}
            </span>
          </div>
          {Number(order.descuento ?? 0) > 0 && (
            <div className="flex justify-between text-text-secondary">
              <span>Descuento:</span>
              <span className="font-semibold">
                -${Number(order.descuento).toFixed(2)}
              </span>
            </div>
          )}
          {Number(order.costo_envio ?? 0) > 0 && (
            <div className="flex justify-between text-text-secondary">
              <span>Costo de envío:</span>
              <span className="font-semibold">
                ${Number(order.costo_envio).toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-xl font-display font-bold text-text-primary pt-2 border-t">
            <span>Total:</span>
            <span className="text-primary-main">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      {direccion && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-display font-bold text-text-primary flex items-center gap-2 mb-4">
            <MapPin className="w-6 h-6 text-primary-main" />
            Dirección de envío
          </h3>

          <div className="bg-neutral-50 rounded-lg p-4">
            <p className="font-semibold text-text-primary mb-2">
              {(direccion as any).nombre_completo ||
                (direccion as any).nombre_completo_contacto}
            </p>
            <p className="text-text-secondary">
              {(direccion as any).direccion_completa}
            </p>
            <p className="text-text-secondary">
              {(direccion as any).ciudad}
              {(direccion as any).departamento &&
                `, ${(direccion as any).departamento}`}
              {(direccion as any).estado && `, ${(direccion as any).estado}`}
            </p>
            {(direccion as any).pais && (
              <p className="text-text-secondary">{(direccion as any).pais}</p>
            )}
            {(direccion as any).referencia && (
              <p className="text-sm text-text-secondary italic mt-2">
                Ref: {(direccion as any).referencia}
              </p>
            )}
            {(direccion as any).referencias && (
              <p className="text-sm text-text-secondary italic mt-2">
                Ref: {(direccion as any).referencias}
              </p>
            )}
            {(direccion as any).telefono && (
              <p className="text-sm text-text-secondary mt-2">
                Tel: {(direccion as any).telefono}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Payment Method */}
      {metodoPago && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-display font-bold text-text-primary flex items-center gap-2 mb-4">
            <CreditCard className="w-6 h-6 text-primary-main" />
            Método de pago
          </h3>

          <div className="bg-neutral-50 rounded-lg p-4 flex items-center gap-3">
            <div className="p-3 bg-white rounded-lg">
              <DollarSign className="w-6 h-6 text-primary-main" />
            </div>
            <div>
              <p className="font-semibold text-text-primary">
                {metodoPago.nombre}
              </p>
              {metodoPago.descripcion && (
                <p className="text-sm text-text-secondary">
                  {metodoPago.descripcion}
                </p>
              )}
              <p className="text-xs text-text-secondary mt-1">
                Código: {metodoPago.codigo}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Customer Info */}
      {usuarioData && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-display font-bold text-text-primary flex items-center gap-2 mb-4">
            <User className="w-6 h-6 text-primary-main" />
            Información del cliente
          </h3>

          <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-text-secondary">Cliente:</span>
              <span className="font-semibold text-text-primary">
                {usuarioData.nombre} {usuarioData.apellido}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Email:</span>
              <span className="font-medium text-text-primary">
                {usuarioData.email}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Client Notes */}
      {order.notas_cliente && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-display font-bold text-text-primary mb-4">
            Notas del cliente
          </h3>
          <p className="text-text-secondary bg-neutral-50 rounded-lg p-4">
            {order.notas_cliente}
          </p>
        </div>
      )}
    </div>
  );
}
