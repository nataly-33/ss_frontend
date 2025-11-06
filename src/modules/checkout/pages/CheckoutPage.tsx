import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Wallet,
  MapPin,
  Plus,
  Check,
  ArrowLeft,
  Package,
} from "lucide-react";
import { Button } from "@shared/components/ui/Button";
import { useAuthStore } from "@core/store/auth.store";
import { cartService } from "@/modules/cart/services/cart.service";
import { ordersService } from "@/modules/orders/services/orders.service";
import { customersService } from "@/modules/customers/services/customers.service";
import type { Cart } from "@/modules/cart/services/cart.service";
import type {
  PaymentMethod,
  CheckoutData,
} from "@/modules/orders/services/orders.service";
import type { Address } from "@/modules/customers/services/customers.service";

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // State
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Confirm
  const [cart, setCart] = useState<Cart | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCheckoutData();
  }, []);

  const loadCheckoutData = async () => {
    try {
      setLoading(true);
      setError("");

      // Load cart, addresses, and payment methods in parallel
      const [cartData, addressesData, paymentMethodsData] = await Promise.all([
        cartService.getCart(),
        customersService.getAddresses(),
        ordersService.getPaymentMethods(),
      ]);

      setCart(cartData);
      setAddresses(addressesData);
      setPaymentMethods(paymentMethodsData.filter((pm) => pm.activo));

      // Auto-select principal address
      const principalAddress = addressesData.find((addr) => addr.es_principal);
      if (principalAddress) {
        setSelectedAddressId(principalAddress.id);
      }

      // Auto-select first active payment method
      if (paymentMethodsData.length > 0) {
        setSelectedPaymentId(paymentMethodsData[0].id);
      }

      // Redirect if cart is empty
      if (!cartData || cartData.items.length === 0) {
        navigate("/cart");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Error al cargar datos del checkout"
      );
      console.error("Error loading checkout data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!selectedAddressId) {
        setError("Por favor selecciona una dirección de envío");
        return;
      }
      setError("");
      setStep(2);
    } else if (step === 2) {
      if (!selectedPaymentId) {
        setError("Por favor selecciona un método de pago");
        return;
      }
      setError("");
      setStep(3);
    }
  };

  const handleConfirmOrder = async () => {
    if (!selectedAddressId || !selectedPaymentId) {
      setError("Faltan datos para completar el pedido");
      return;
    }

    try {
      setProcessing(true);
      setError("");

      const checkoutData: CheckoutData = {
        direccion_envio_id: selectedAddressId,
        metodo_pago_id: selectedPaymentId,
      };

      const order = await ordersService.createOrder(checkoutData);

      // Clear cart after successful order
      if (cart) {
        await cartService.clearCart(cart.id);
      }

      // Navigate to order confirmation
      navigate(`/orders/${order.id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al procesar el pedido");
      console.error("Error creating order:", err);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Cargando checkout...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return null;
  }

  const subtotal = cart.total;
  const envio = subtotal > 100 ? 0 : 10;
  const total = subtotal + envio;

  const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId);
  const selectedPayment = paymentMethods.find((pm) => pm.id === selectedPaymentId);

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : navigate("/cart"))}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-4"
          >
            <ArrowLeft size={20} />
            <span>{step > 1 ? "Paso anterior" : "Volver al carrito"}</span>
          </button>
          <h1 className="text-3xl font-display font-bold text-neutral-900">
            Finalizar Compra
          </h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {[
              { num: 1, label: "Dirección" },
              { num: 2, label: "Pago" },
              { num: 3, label: "Confirmar" },
            ].map((s, idx) => (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step >= s.num
                        ? "bg-primary-600 text-white"
                        : "bg-neutral-200 text-neutral-600"
                    }`}
                  >
                    {step > s.num ? <Check size={20} /> : s.num}
                  </div>
                  <span
                    className={`font-medium ${
                      step >= s.num ? "text-neutral-900" : "text-neutral-500"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div
                    className={`w-16 h-1 ${
                      step > s.num ? "bg-primary-600" : "bg-neutral-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Address */}
            {step === 1 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="text-primary-600" size={24} />
                  <h2 className="text-xl font-semibold text-neutral-900">
                    Dirección de Envío
                  </h2>
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-neutral-600 mb-4">
                      No tienes direcciones registradas
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => navigate("/profile?tab=addresses")}
                    >
                      <Plus size={20} className="mr-2" />
                      Agregar Dirección
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedAddressId === addr.id
                            ? "border-primary-500 bg-primary-50"
                            : "border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          value={addr.id}
                          checked={selectedAddressId === addr.id}
                          onChange={(e) => setSelectedAddressId(e.target.value)}
                          className="mt-1 w-4 h-4"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-neutral-900">
                              {addr.calle} {addr.numero_exterior}
                              {addr.numero_interior && ` Int. ${addr.numero_interior}`}
                            </p>
                            {addr.es_principal && (
                              <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full">
                                Principal
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-neutral-600">
                            {addr.colonia}, {addr.ciudad}, {addr.estado}
                          </p>
                          <p className="text-sm text-neutral-600">
                            CP: {addr.codigo_postal}, {addr.pais}
                          </p>
                          {addr.referencias && (
                            <p className="text-sm text-neutral-500 mt-1">
                              Ref: {addr.referencias}
                            </p>
                          )}
                        </div>
                      </label>
                    ))}

                    <button
                      onClick={() => navigate("/profile?tab=addresses")}
                      className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-neutral-300 rounded-lg text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 transition-all"
                    >
                      <Plus size={20} />
                      <span>Agregar nueva dirección</span>
                    </button>
                  </div>
                )}

                {addresses.length > 0 && (
                  <div className="mt-6">
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full"
                      onClick={handleNextStep}
                    >
                      Continuar al Pago
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="text-primary-600" size={24} />
                  <h2 className="text-xl font-semibold text-neutral-900">
                    Método de Pago
                  </h2>
                </div>

                <div className="space-y-3">
                  {paymentMethods.map((pm) => (
                    <label
                      key={pm.id}
                      className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedPaymentId === pm.id
                          ? "border-primary-500 bg-primary-50"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={pm.id}
                        checked={selectedPaymentId === pm.id}
                        onChange={(e) => setSelectedPaymentId(e.target.value)}
                        className="w-4 h-4"
                      />
                      {pm.tipo === "billetera" ? (
                        <Wallet className="text-primary-600" size={24} />
                      ) : pm.tipo === "tarjeta" ? (
                        <CreditCard className="text-primary-600" size={24} />
                      ) : (
                        <Package className="text-primary-600" size={24} />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900">{pm.nombre}</p>
                        {pm.descripcion && (
                          <p className="text-sm text-neutral-600">{pm.descripcion}</p>
                        )}
                        {pm.tipo === "billetera" && user && (
                          <p className="text-sm text-neutral-600 mt-1">
                            Saldo disponible: ${user.saldo_billetera?.toFixed(2) || "0.00"}
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>

                <div className="mt-6">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={handleNextStep}
                  >
                    Revisar Pedido
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <div className="space-y-6">
                {/* Address Summary */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      Dirección de Envío
                    </h3>
                    <button
                      onClick={() => setStep(1)}
                      className="text-primary-600 hover:text-primary-700 text-sm"
                    >
                      Cambiar
                    </button>
                  </div>
                  {selectedAddress && (
                    <div className="text-sm text-neutral-700">
                      <p className="font-medium">
                        {selectedAddress.calle} {selectedAddress.numero_exterior}
                        {selectedAddress.numero_interior &&
                          ` Int. ${selectedAddress.numero_interior}`}
                      </p>
                      <p>
                        {selectedAddress.colonia}, {selectedAddress.ciudad},{" "}
                        {selectedAddress.estado}
                      </p>
                      <p>
                        CP: {selectedAddress.codigo_postal}, {selectedAddress.pais}
                      </p>
                    </div>
                  )}
                </div>

                {/* Payment Summary */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      Método de Pago
                    </h3>
                    <button
                      onClick={() => setStep(2)}
                      className="text-primary-600 hover:text-primary-700 text-sm"
                    >
                      Cambiar
                    </button>
                  </div>
                  {selectedPayment && (
                    <div className="flex items-center gap-3">
                      {selectedPayment.tipo === "billetera" ? (
                        <Wallet className="text-primary-600" size={20} />
                      ) : selectedPayment.tipo === "tarjeta" ? (
                        <CreditCard className="text-primary-600" size={20} />
                      ) : (
                        <Package className="text-primary-600" size={20} />
                      )}
                      <div>
                        <p className="font-medium text-neutral-900">
                          {selectedPayment.nombre}
                        </p>
                        {selectedPayment.descripcion && (
                          <p className="text-sm text-neutral-600">
                            {selectedPayment.descripcion}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                    Productos ({cart.cantidad_items})
                  </h3>
                  <div className="space-y-3">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <img
                          src={
                            item.prenda.imagen_principal ||
                            "/images/placeholder.jpg"
                          }
                          alt={item.prenda.nombre}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-neutral-900">
                            {item.prenda.nombre}
                          </p>
                          <p className="text-sm text-neutral-600">
                            Talla: {item.talla.nombre} • Cantidad: {item.cantidad}
                          </p>
                          <p className="text-sm font-semibold text-primary-600 mt-1">
                            ${item.subtotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleConfirmOrder}
                  disabled={processing}
                >
                  {processing ? "Procesando..." : "Confirmar y Pagar"}
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                Resumen del Pedido
              </h2>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-neutral-700">
                  <span>Subtotal ({cart.cantidad_items} items)</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-700">
                  <span>Envío</span>
                  <span className="font-medium">
                    {envio === 0 ? "Gratis" : `$${envio.toFixed(2)}`}
                  </span>
                </div>
                {subtotal < 100 && (
                  <p className="text-xs text-neutral-500">
                    Envío gratis en compras mayores a $100
                  </p>
                )}
                <div className="border-t border-neutral-200 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-neutral-900">
                      Total
                    </span>
                    <span className="text-xl font-bold text-primary-600">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm text-neutral-600 pt-4 border-t border-neutral-200">
                <div className="flex items-start gap-2">
                  <Check size={16} className="text-green-600 mt-0.5" />
                  <span>Envío gratis en compras mayores a $100</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={16} className="text-green-600 mt-0.5" />
                  <span>Devoluciones gratis en 30 días</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={16} className="text-green-600 mt-0.5" />
                  <span>Pago 100% seguro</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
