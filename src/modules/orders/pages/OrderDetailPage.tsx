import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Package, Truck, CheckCircle } from "lucide-react";
import { Button } from "@shared/components/ui/Button";

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      // Aquí irá la integración con el backend
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOrder(null);
    } catch (error) {
      console.error("Error loading order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600 mb-4">Pedido no encontrado</p>
          <Button onClick={() => navigate("/orders")}>
            Volver a Mis Pedidos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center text-neutral-600 hover:text-primary-600 mb-6"
        >
          <ChevronLeft size={20} />
          <span>Volver a Mis Pedidos</span>
        </button>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-neutral-900 mb-6">
            Pedido #{order?.numero_pedido || "ORD-000"}
          </h1>

          {/* Order Status Timeline */}
          <div className="mb-8">
            <h2 className="font-semibold text-neutral-900 mb-4">
              Estado del Pedido
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-2">
                  <CheckCircle size={24} />
                </div>
                <p className="text-xs text-neutral-600 text-center">
                  Confirmado
                </p>
              </div>
              <div className="flex-1 h-1 bg-green-200 mx-2"></div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                  <Package size={24} />
                </div>
                <p className="text-xs text-neutral-600 text-center">
                  Preparando
                </p>
              </div>
              <div className="flex-1 h-1 bg-neutral-200 mx-2"></div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mb-2">
                  <Truck size={24} />
                </div>
                <p className="text-xs text-neutral-600 text-center">Enviado</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h2 className="font-semibold text-neutral-900 mb-4">Productos</h2>
            <div className="space-y-4">
              {/* Aquí irán los items del pedido */}
              <p className="text-neutral-600">
                No hay productos en este pedido
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-neutral-200 pt-6">
            <h2 className="font-semibold text-neutral-900 mb-4">Resumen</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-700">Subtotal</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-700">Envío</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span className="text-primary-600">$0.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
