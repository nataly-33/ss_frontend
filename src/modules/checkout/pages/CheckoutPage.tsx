import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@core/store/auth.store";
import { cartService } from "@modules/cart/services/cart.service";
import { customersService } from "@modules/customers/services/customers.service";
import { ordersService } from "@modules/orders/services/orders.service";
import { PUBLIC_ROUTES } from "@/core/config/routes";
import type { Cart } from "@modules/cart/types";
import type { Address } from "@modules/customers/types";
import type { PaymentMethod } from "@modules/orders/types";
import { AddressSelector, PaymentSelector, OrderSummary } from "../components";
import { LoadingSpinner } from "@shared/components/ui/LoadingSpinner";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [cart, setCart] = useState<Cart | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(PUBLIC_ROUTES.LOGIN);
      return;
    }
    loadCheckoutData();
  }, [isAuthenticated, navigate]);

  const loadCheckoutData = async () => {
    try {
      setLoading(true);
      setError("");

      const [cartData, addressesData, paymentMethodsData] = await Promise.all([
        cartService.getCart(),
        customersService.getAddresses(),
        ordersService.getPaymentMethods(),
      ]);

      setCart(cartData);
      setAddresses(addressesData);
      setPaymentMethods(paymentMethodsData);

      // Auto-select principal address
      const principalAddress = addressesData.find(addr => addr.es_principal);
      if (principalAddress) {
        setSelectedAddressId(principalAddress.id);
      }

      // Auto-select first active payment method
      const activeMethod = paymentMethodsData.find(method => method.activo);
      if (activeMethod) {
        setSelectedPaymentMethodId(activeMethod.id);
      }

    } catch (err: any) {
      console.error("Error loading checkout data:", err);
      setError("Error al cargar datos del checkout");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (!selectedAddressId || !selectedPaymentMethodId || !cart) {
      setError("Por favor, completa todos los campos requeridos");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      const orderData = {
        direccion_envio_id: selectedAddressId,
        metodo_pago_id: selectedPaymentMethodId,
        notas: notes || undefined,
      };

      const order = await ordersService.createOrder(orderData);

      // Clear cart
      await cartService.clearCart();

      // Redirect to order detail
      navigate(`/orders/${order.id}`);
      
    } catch (err: any) {
      console.error("Error creating order:", err);
      setError(err.response?.data?.detail || "Error al crear el pedido");
    } finally {
      setProcessing(false);
    }
  };

  const handleCreateNewAddress = () => {
    // TODO: Abrir modal para crear nueva dirección
    alert("Funcionalidad de crear dirección en desarrollo");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-main flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background-main py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-display font-bold text-text-primary mb-4">
              Tu carrito está vacío
            </h2>
            <p className="text-text-secondary mb-6">
              Agrega productos al carrito antes de proceder al checkout
            </p>
            <button
              onClick={() => navigate(PUBLIC_ROUTES.PRODUCTS)}
              className="px-6 py-3 bg-primary-main text-white rounded-lg hover:bg-accent-chocolate transition-colors"
            >
              Explorar productos
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedAddress = addresses.find(addr => addr.id === selectedAddressId) || null;
  const selectedPaymentMethod = paymentMethods.find(method => method.id === selectedPaymentMethodId) || null;

  return (
    <div className="min-h-screen bg-background-main py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-text-primary mb-2">
            Finalizar compra
          </h1>
          <p className="text-text-secondary">
            Completa tu pedido de {cart.cantidad_items} {cart.cantidad_items === 1 ? 'producto' : 'productos'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Address & Payment */}
          <div className="lg:col-span-2 space-y-8">
            {/* Address Selector */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <AddressSelector
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                onSelect={setSelectedAddressId}
                onCreateNew={handleCreateNewAddress}
                isLoading={processing}
              />
            </div>

            {/* Payment Selector */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <PaymentSelector
                paymentMethods={paymentMethods}
                selectedMethodId={selectedPaymentMethodId}
                onSelect={setSelectedPaymentMethodId}
                isLoading={processing}
              />
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <OrderSummary
              cart={cart}
              selectedAddress={selectedAddress}
              selectedPaymentMethod={selectedPaymentMethod}
              notes={notes}
              onNotesChange={setNotes}
              onConfirm={handleConfirmOrder}
              isProcessing={processing}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
