import type { Order } from "../types";
import { Package, MapPin, CreditCard, DollarSign, Calendar, User } from "lucide-react";

interface OrderDetailProps {
  order: Order;
}

export function OrderDetail({ order }: OrderDetailProps) {
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
              {new Date(order.fecha_creacion).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-text-secondary">Total</p>
            <p className="text-3xl font-display font-bold text-primary-main">
              ${order.total.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-display font-bold text-text-primary flex items-center gap-2 mb-4">
          <Package className="w-6 h-6 text-primary-main" />
          Artículos ({order.items.length})
        </h3>

        <div className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg"
            >
              {item.prenda.imagen_principal && (
                <img
                  src={item.prenda.imagen_principal}
                  alt={item.prenda.nombre}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}

              <div className="flex-1">
                <h4 className="font-semibold text-text-primary">
                  {item.prenda.nombre}
                </h4>
                <p className="text-sm text-text-secondary mt-1">
                  Talla: <span className="font-medium">{item.talla.nombre}</span>
                </p>
                <p className="text-sm text-text-secondary">
                  Cantidad: <span className="font-medium">{item.cantidad}</span>
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-text-secondary">Precio unitario</p>
                <p className="font-semibold text-text-primary">
                  ${item.precio_unitario.toFixed(2)}
                </p>
                <p className="text-lg font-display font-bold text-primary-main mt-1">
                  ${item.subtotal.toFixed(2)}
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
              ${order.items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-xl font-display font-bold text-text-primary pt-2 border-t">
            <span>Total:</span>
            <span className="text-primary-main">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-display font-bold text-text-primary flex items-center gap-2 mb-4">
          <MapPin className="w-6 h-6 text-primary-main" />
          Dirección de envío
        </h3>

        <div className="bg-neutral-50 rounded-lg p-4">
          <p className="font-semibold text-text-primary mb-2">
            {order.direccion_envio.calle} #{order.direccion_envio.numero_exterior}
            {order.direccion_envio.numero_interior &&
              ` Int. ${order.direccion_envio.numero_interior}`}
          </p>
          <p className="text-text-secondary">
            {order.direccion_envio.colonia}
          </p>
          <p className="text-text-secondary">
            {order.direccion_envio.ciudad}, {order.direccion_envio.estado}
          </p>
          <p className="text-text-secondary">
            CP {order.direccion_envio.codigo_postal}
          </p>
          {order.direccion_envio.referencias && (
            <p className="text-sm text-text-secondary italic mt-2">
              Ref: {order.direccion_envio.referencias}
            </p>
          )}
        </div>
      </div>

      {/* Payment Method */}
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
              {order.metodo_pago.nombre}
            </p>
            <p className="text-sm text-text-secondary">
              {order.metodo_pago.tipo}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-display font-bold text-text-primary flex items-center gap-2 mb-4">
          <User className="w-6 h-6 text-primary-main" />
          Información del cliente
        </h3>

        <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-text-secondary">Cliente:</span>
            <span className="font-semibold text-text-primary">
              {order.usuario.first_name} {order.usuario.last_name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Email:</span>
            <span className="font-medium text-text-primary">
              {order.usuario.email}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
