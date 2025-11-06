import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useAuthStore } from "@core/store/auth.store";
import { Button } from "@shared/components/ui/Button";
import { cartService } from "../services/cart.service";
import type { Cart } from "../services/cart.service";

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await cartService.getCart();
      setCart(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al cargar el carrito");
      console.error("Error loading cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      setUpdatingItems((prev) => new Set(prev).add(itemId));
      await cartService.updateItem(itemId, newQuantity);
      await loadCart();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al actualizar cantidad");
      console.error("Error updating quantity:", err);
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      setUpdatingItems((prev) => new Set(prev).add(itemId));
      await cartService.removeItem(itemId);
      await loadCart();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al eliminar producto");
      console.error("Error removing item:", err);
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/checkout");
      return;
    }
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={48} className="text-neutral-400" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Tu carrito está vacío
            </h2>
            <p className="text-neutral-600 mb-8">
              Agrega productos para comenzar tu compra
            </p>
            <Link to="/products">
              <Button variant="primary" size="lg">
                Explorar Productos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cart.total;
  const envio = subtotal > 100 ? 0 : 10;
  const total = subtotal + envio;

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-display font-bold text-neutral-900 mb-8">
          Carrito de Compras
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => {
              const isUpdating = updatingItems.has(item.id);
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl p-6 shadow-sm transition-opacity ${
                    isUpdating ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex gap-6">
                    {/* Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={
                          item.prenda.imagen_principal ||
                          "/images/placeholder.jpg"
                        }
                        alt={item.prenda.nombre}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <Link
                            to={`/products/${item.prenda.slug}`}
                            className="text-lg font-medium text-neutral-900 hover:text-primary-600"
                          >
                            {item.prenda.nombre}
                          </Link>
                          <p className="text-sm text-neutral-600 mt-1">
                            Talla:{" "}
                            <span className="font-medium">
                              {item.talla.nombre}
                            </span>
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-semibold text-primary-600">
                            ${item.prenda.precio.toFixed(2)}
                          </p>
                          <p className="text-sm text-neutral-500">c/u</p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.cantidad - 1)
                            }
                            disabled={isUpdating || item.cantidad <= 1}
                            className="p-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-12 text-center font-medium">
                            {item.cantidad}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.cantidad + 1)
                            }
                            disabled={isUpdating}
                            className="p-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className="flex items-center gap-4">
                          <p className="text-lg font-semibold text-neutral-900">
                            ${item.subtotal.toFixed(2)}
                          </p>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={isUpdating}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Resumen del Pedido
              </h3>

              <div className="space-y-3 mb-6">
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
                <div className="border-t border-neutral-200 pt-3">
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

              <Button
                variant="primary"
                size="lg"
                className="w-full mb-3"
                onClick={handleCheckout}
              >
                Proceder al Pago
                <ArrowRight size={20} className="ml-2" />
              </Button>

              <Link to="/products">
                <Button variant="outline" size="lg" className="w-full">
                  Continuar Comprando
                </Button>
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <div className="space-y-3 text-sm text-neutral-600">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Envío gratis en compras mayores a $100</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Devoluciones gratis en 30 días</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Pago 100% seguro</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
