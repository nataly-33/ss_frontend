import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Wallet, Building2 } from "lucide-react";
import { Button } from "@shared/components/ui/Button";
import { useCartStore } from "@core/store/cart.store";
import { useAuthStore } from "@core/store/auth.store";

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [paymentMethod, setPaymentMethod] = useState<
    "tarjeta" | "paypal" | "billetera"
  >("billetera");
  const [loading, setLoading] = useState(false);

  const subtotal = getTotal();
  const envio = 10;
  const total = subtotal + envio;

  const handleCheckout = async () => {
    setLoading(true);

    try {
      // Aquí irá la integración con el backend
      // Por ahora simulamos el checkout
      await new Promise((resolve) => setTimeout(resolve, 2000));

      clearCart();
      navigate("/orders");
    } catch (error) {
      console.error("Error en checkout:", error);
      alert("Error al procesar el pedido");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-display font-bold text-neutral-900 mb-8">
          Finalizar Compra
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                Dirección de Envío
              </h2>
              <div className="space-y-4">
                <div className="p-4 border-2 border-primary-500 bg-primary-50 rounded-lg">
                  <p className="font-medium text-neutral-900">
                    Dirección Principal
                  </p>
                  <p className="text-sm text-neutral-600 mt-1">
                    Calle Ejemplo 123, Cochabamba, Bolivia
                  </p>
                </div>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  + Agregar nueva dirección
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                Método de Pago
              </h2>
              <div className="space-y-3">
                <label
                  className={`
                    flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all
                    ${
                      paymentMethod === "billetera"
                        ? "border-primary-500 bg-primary-50"
                        : "border-neutral-200"
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="billetera"
                    checked={paymentMethod === "billetera"}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-4 h-4"
                  />
                  <Wallet className="text-primary-600" size={24} />
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">
                      Billetera Virtual
                    </p>
                    <p className="text-sm text-neutral-600">
                      Saldo disponible: ${user?.saldo_billetera || 0}
                    </p>
                  </div>
                </label>

                <label
                  className={`
                    flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all
                    ${
                      paymentMethod === "tarjeta"
                        ? "border-primary-500 bg-primary-50"
                        : "border-neutral-200"
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="tarjeta"
                    checked={paymentMethod === "tarjeta"}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-4 h-4"
                  />
                  <CreditCard className="text-primary-600" size={24} />
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">
                      Tarjeta de Crédito/Débito
                    </p>
                    <p className="text-sm text-neutral-600">
                      Pago seguro con Stripe
                    </p>
                  </div>
                </label>

                <label
                  className={`
                    flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all
                    ${
                      paymentMethod === "paypal"
                        ? "border-primary-500 bg-primary-50"
                        : "border-neutral-200"
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-4 h-4"
                  />
                  <Building2 className="text-primary-600" size={24} />
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">PayPal</p>
                    <p className="text-sm text-neutral-600">
                      Pago con cuenta PayPal
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                Resumen del Pedido
              </h2>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={
                        item.prenda.imagen_principal ||
                        "/images/placeholder.jpg"
                      }
                      alt={item.prenda.nombre}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">
                        {item.prenda.nombre}
                      </p>
                      <p className="text-xs text-neutral-600">
                        Talla: {item.talla.nombre} • Cant: {item.cantidad}
                      </p>
                      <p className="text-sm font-semibold text-primary-600">
                        ${(item.prenda.precio * item.cantidad).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6 pt-6 border-t border-neutral-200">
                <div className="flex justify-between text-neutral-700">
                  <span>Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-700">
                  <span>Envío</span>
                  <span className="font-medium">${envio.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Total</span>
                  <span className="text-primary-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? "Procesando..." : "Confirmar Pedido"}
              </Button>

              <p className="text-xs text-neutral-500 text-center mt-4">
                Al confirmar aceptas nuestros términos y condiciones
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
