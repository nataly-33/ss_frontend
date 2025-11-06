import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { Card } from "@shared/components/ui/Card";
import { useCartStore } from "@core/store/cart.store";
import { useAuthStore } from "@core/store/auth.store";
import type { Product } from "@modules/products/types";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("Debes iniciar sesión para agregar al carrito");
      return;
    }

    if (!product.tiene_stock) {
      alert("Producto agotado");
      return;
    }

    // Agregar con talla por defecto (primera disponible)
    const defaultSize = product.tallas_disponibles_detalle?.[0];

    if (!defaultSize) {
      alert("No hay tallas disponibles");
      return;
    }

    addItem({
      id: `${product.id}-${defaultSize.id}`,
      prenda: product,
      talla: defaultSize,
      cantidad: 1,
    });

    alert("Producto agregado al carrito");
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("Debes iniciar sesión para agregar a favoritos");
      return;
    }

    // Aquí irá la integración con el backend
    alert("Agregado a favoritos");
  };

  return (
    <Card hover className="group">
      <Link to={`/products/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
          <img
            src={product.imagen_principal || "/images/placeholder.jpg"}
            alt={product.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.es_novedad && (
              <span className="px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                Nuevo
              </span>
            )}
            {product.destacada && (
              <span className="px-3 py-1 bg-neutral-800 text-white text-xs font-medium rounded-full">
                Destacado
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleToggleFavorite}
              className="p-2 bg-white rounded-full shadow-md hover:bg-primary-50 hover:text-primary-600 transition-colors"
              title="Agregar a favoritos"
            >
              <Heart size={18} />
            </button>
            <button
              onClick={handleAddToCart}
              disabled={!product.tiene_stock}
              className="p-2 bg-white rounded-full shadow-md hover:bg-primary-50 hover:text-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Agregar al carrito"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
            {product.marca_nombre}
          </p>
          <h3 className="text-sm font-medium text-neutral-900 mb-1 line-clamp-2">
            {product.nombre}
          </h3>
          <p className="text-sm text-neutral-600 mb-2">{product.color}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-primary-600">
              ${product.precio}
            </span>
            {!product.tiene_stock && (
              <span className="text-xs text-red-600 font-medium">Agotado</span>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
};
