import { Trash2, Plus, Minus } from "lucide-react";
import type { CartItem as CartItemType } from "../types";
import { PUBLIC_ROUTES } from "@/core/config/routes";
import { Link } from "react-router-dom";

interface CartItemProps {
  item: CartItemType;
  isUpdating: boolean;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export function CartItem({ item, isUpdating, onUpdateQuantity, onRemove }: CartItemProps) {
  const handleDecrease = () => {
    if (item.cantidad > 1) {
      onUpdateQuantity(item.id, item.cantidad - 1);
    }
  };

  const handleIncrease = () => {
    onUpdateQuantity(item.id, item.cantidad + 1);
  };

  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg shadow-sm border border-neutral-light">
      {/* Image */}
      <Link to={PUBLIC_ROUTES.PRODUCT_DETAIL(item.prenda.slug)} className="flex-shrink-0">
        <img
          src={item.prenda.imagen_principal || "/placeholder.jpg"}
          alt={item.prenda.nombre}
          className="w-24 h-24 object-cover rounded-lg"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link 
          to={PUBLIC_ROUTES.PRODUCT_DETAIL(item.prenda.slug)}
          className="font-display font-semibold text-text-primary hover:text-primary-main transition-colors"
        >
          {item.prenda.nombre}
        </Link>
        <p className="text-sm text-text-secondary mt-1">
          Talla: <span className="font-medium">{item.talla.nombre}</span>
        </p>
        <p className="text-lg font-bold text-primary-main mt-2">
          ${item.prenda.precio.toFixed(2)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => onRemove(item.id)}
          disabled={isUpdating}
          className="text-text-secondary hover:text-red-500 transition-colors p-1 disabled:opacity-50"
          aria-label="Eliminar producto"
        >
          <Trash2 className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrease}
            disabled={isUpdating || item.cantidad <= 1}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-light hover:border-primary-main hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Disminuir cantidad"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center font-semibold">{item.cantidad}</span>
          <button
            onClick={handleIncrease}
            disabled={isUpdating}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-light hover:border-primary-main hover:bg-primary-light transition-colors disabled:opacity-50"
            aria-label="Aumentar cantidad"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm font-bold text-text-primary mt-2">
          ${item.subtotal.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
