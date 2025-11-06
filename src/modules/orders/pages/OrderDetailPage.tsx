import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronLeft,
  Package,
  Truck,
  CheckCircle,
  MapPin,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { Button } from "@shared/components/ui/Button";
import { ordersService } from "../services/orders.service";
import type { Order } from "../services/orders.service";

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id]);

  const loadOrder = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError("");
      const orderData = await ordersService.getOrder(id);
      setOrder(orderData);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al cargar el pedido");
      console.error("Error loading order:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order || !window.confirm("¿Estás seguro de cancelar este pedido?"))
      return;

    try {
      setCancelling(true);
      await ordersService.cancelOrder(order.id);
      await loadOrder();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al cancelar el pedido");
      console.error("Error cancelling order:", err);
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (estado: string) => {
    const colors: Record<string, string> = {
      pendiente: "bg-yellow-100 text-yellow-800 border-yellow-200",
      pago_recibido: "bg-blue-100 text-blue-800 border-blue-200",
      confirmado: "bg-green-100 text-green-800 border-green-200",
      preparando: "bg-purple-100 text-purple-800 border-purple-200",
      enviado: "bg-indigo-100 text-indigo-800 border-indigo-200",
      entregado: "bg-green-100 text-green-800 border-green-200",
      cancelado: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[estado] || "bg-gray-100 text-gray-800 border-gray-200";
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

  const getStatusStep = (estado: string) => {
    const steps: Record<string, number> = {
      pendiente: 1,
      pago_recibido: 1,
      confirmado: 2,
      preparando: 3,
      enviado: 4,
      entregado: 5,
      cancelado: 0,
    };
    return steps[estado] || 1;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Cargando pedido...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-neutral-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">
            Pedido no encontrado
          </h3>
          <p className="text-neutral-600 mb-6">
            {error || "No se pudo encontrar el pedido solicitado"}
          </p>
          <Button onClick={() => navigate("/orders")}>
            Volver a Mis Pedidos
          </Button>
        </div>
      </div>
    );
  }

  const currentStep = getStatusStep(order.estado);
  const isCancelled = order.estado === "cancelado";

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6 transition-colors"
        >
          <ChevronLeft size={20} />
          <span>Volver a Mis Pedidos</span>
        </button>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                Pedido #{order.numero_pedido}
              </h1>
              <p className="text-neutral-600">
                Realizado el{" "}
                {new Date(order.fecha_creacion).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${getStatusColor(
                order.estado
              )}`}
            >
              {getStatusLabel(order.estado)}
            </span>
          </div>

          {/* Cancel Button */}
          {!isCancelled && currentStep < 4 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              {cancelling ? "Cancelando..." : "Cancelar Pedido"}
            </Button>
          )}
        </div>

        {/* Order Status Timeline */}
        {!isCancelled && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">
              Estado del Pedido
            </h2>
            <div className="flex items-center justify-between">
              {/* Step 1: Confirmado */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    currentStep >= 2
                      ? "bg-green-100 text-green-600"
                      : "bg-neutral-100 text-neutral-400"
                  }`}
                >
                  <CheckCircle size={24} />
                </div>
                <p
                  className={`text-xs text-center ${
                    currentStep >= 2 ? "text-neutral-900" : "text-neutral-500"
                  }`}
                >
                  Confirmado
                </p>
              </div>

              <div
                className={`flex-1 h-1 ${
                  currentStep >= 3 ? "bg-green-200" : "bg-neutral-200"
                }`}
              />

              {/* Step 2: Preparando */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    currentStep >= 3
                      ? "bg-purple-100 text-purple-600"
                      : "bg-neutral-100 text-neutral-400"
                  }`}
                >
                  <Package size={24} />
                </div>
                <p
                  className={`text-xs text-center ${
                    currentStep >= 3 ? "text-neutral-900" : "text-neutral-500"
                  }`}
                >
                  Preparando
                </p>
              </div>

              <div
                className={`flex-1 h-1 ${
                  currentStep >= 4 ? "bg-green-200" : "bg-neutral-200"
                }`}
              />

              {/* Step 3: Enviado */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    currentStep >= 4
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-neutral-100 text-neutral-400"
                  }`}
                >
                  <Truck size={24} />
                </div>
                <p
                  className={`text-xs text-center ${
                    currentStep >= 4 ? "text-neutral-900" : "text-neutral-500"
                  }`}
                >
                  Enviado
                </p>
              </div>

              <div
                className={`flex-1 h-1 ${
                  currentStep >= 5 ? "bg-green-200" : "bg-neutral-200"
                }`}
              />

              {/* Step 4: Entregado */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    currentStep >= 5
                      ? "bg-green-100 text-green-600"
                      : "bg-neutral-100 text-neutral-400"
                  }`}
                >
                  <CheckCircle size={24} />
                </div>
                <p
                  className={`text-xs text-center ${
                    currentStep >= 5 ? "text-neutral-900" : "text-neutral-500"
                  }`}
                >
                  Entregado
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                Productos ({order.items.length})
              </h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b border-neutral-200 last:border-0"
                  >
                    <img
                      src={
                        item.prenda.imagen_principal ||
                        "/images/placeholder.jpg"
                      }
                      alt={item.prenda.nombre}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <Link
                        to={`/products/${item.prenda.slug}`}
                        className="font-medium text-neutral-900 hover:text-primary-600"
                      >
                        {item.prenda.nombre}
                      </Link>
                      <p className="text-sm text-neutral-600 mt-1">
                        Talla: {item.talla.nombre}
                      </p>
                      <p className="text-sm text-neutral-600">
                        Cantidad: {item.cantidad}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-neutral-600">
                        ${item.precio_unitario.toFixed(2)} c/u
                      </p>
                      <p className="text-lg font-semibold text-primary-600 mt-1">
                        ${item.subtotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            {order.direccion_envio && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="text-primary-600" size={20} />
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Dirección de Envío
                  </h2>
                </div>
                <div className="text-neutral-700">
                  <p className="font-medium">
                    {order.direccion_envio.calle}{" "}
                    {order.direccion_envio.numero_exterior}
                    {order.direccion_envio.numero_interior &&
                      ` Int. ${order.direccion_envio.numero_interior}`}
                  </p>
                  <p>
                    {order.direccion_envio.colonia},{" "}
                    {order.direccion_envio.ciudad}
                  </p>
                  <p>
                    {order.direccion_envio.estado}, CP:{" "}
                    {order.direccion_envio.codigo_postal}
                  </p>
                  <p>{order.direccion_envio.pais}</p>
                  {order.direccion_envio.referencias && (
                    <p className="text-sm text-neutral-600 mt-2">
                      Referencias: {order.direccion_envio.referencias}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                Resumen
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-neutral-700">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    $
                    {order.items
                      .reduce((sum, item) => sum + item.subtotal, 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-700">
                  <span>Envío</span>
                  <span className="font-medium">
                    {order.total -
                      order.items.reduce((sum, item) => sum + item.subtotal, 0) >
                    0
                      ? `$${(
                          order.total -
                          order.items.reduce((sum, item) => sum + item.subtotal, 0)
                        ).toFixed(2)}`
                      : "Gratis"}
                  </span>
                </div>
                <div className="pt-3 border-t border-neutral-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-neutral-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-primary-600">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard className="text-primary-600" size={20} />
                <h2 className="text-lg font-semibold text-neutral-900">
                  Método de Pago
                </h2>
              </div>
              <p className="font-medium text-neutral-900">
                {order.metodo_pago.nombre}
              </p>
              {order.metodo_pago.tipo && (
                <p className="text-sm text-neutral-600 capitalize">
                  {order.metodo_pago.tipo}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
