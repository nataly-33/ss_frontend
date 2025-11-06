import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@core/store/auth.store";
import { cartService } from "../services/cart.service";
import { PUBLIC_ROUTES } from "@/core/config/routes";
import type { Cart } from "../types";
import { CartItem } from "../components/CartItem";
import { CartSummary } from "../components/CartSummary";
import { EmptyCart } from "../components/EmptyCart";
import { LoadingSpinner } from "@shared/components/ui/LoadingSpinner";

export default function CartPage() {
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
      const data: any = { cantidad: newQuantity };
      await cartService.updateItem(itemId, data);
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
      navigate(`${PUBLIC_ROUTES.LOGIN}?redirect=/checkout`);
      return;
    }
    navigate("/checkout");
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
          <EmptyCart />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-main py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-text-primary mb-2">
            Carrito de compras
          </h1>
          <p className="text-text-secondary">
            {cart.cantidad_items} {cart.cantidad_items === 1 ? 'producto' : 'productos'} en tu carrito
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
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                isUpdating={updatingItems.has(item.id)}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>

          {/* Summary */}
          <div>
            <CartSummary
              total={cart.total}
              itemCount={cart.cantidad_items}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
