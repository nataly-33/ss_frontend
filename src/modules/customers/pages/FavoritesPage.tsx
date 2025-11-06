import React, { useEffect, useState } from "react";
import { Trash2, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@shared/components/ui/Card";
import type { Product } from "@modules/products/types";

export const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      // Aquí irá la integración con el backend
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setFavorites([]);
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (productId: string) => {
    setFavorites(favorites.filter((f) => f.id !== productId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-display font-bold text-neutral-900 mb-8">
          Mis Favoritos
        </h1>

        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-600 mb-4">
              No tienes productos favoritos
            </p>
            <Link
              to="/products"
              className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Explorar Productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <Card key={product.id} hover>
                <div className="relative">
                  <Link to={`/products/${product.slug}`}>
                    <img
                      src={
                        product.imagen_principal || "/images/placeholder.jpg"
                      }
                      alt={product.nombre}
                      className="w-full aspect-[3/4] object-cover"
                    />
                  </Link>
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="p-4">
                  <Link to={`/products/${product.slug}`}>
                    <h3 className="font-medium text-neutral-900 mb-1 hover:text-primary-600">
                      {product.nombre}
                    </h3>
                  </Link>
                  <p className="text-lg font-semibold text-primary-600 mb-3">
                    ${product.precio}
                  </p>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                    <ShoppingCart size={18} />
                    Agregar al Carrito
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
