import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { HeroCarousel } from "@modules/products/components/HeroCarousel";
import { ProductCard } from "@modules/products/components/ProductCard";
import { productsService } from "../services/products.service";
import type { Product } from "../types";

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const [featured, newArrivals] = await Promise.all([
        productsService.getFeatured(),
        productsService.getNewArrivals(),
      ]);
      setFeaturedProducts(featured.slice(0, 8));
      setNewProducts(newArrivals.slice(0, 8));
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Categories Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center text-neutral-900 mb-12">
            Compra por Categoría
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group"
              >
                <div className="relative aspect-square overflow-hidden bg-neutral-100">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white font-medium text-lg">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-display font-bold text-neutral-900">
              Productos Destacados
            </h2>
            <Link
              to="/products?featured=true"
              className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              Ver todos
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-neutral-200 rounded-2xl mb-4" />
                  <div className="h-4 bg-neutral-200 rounded mb-2" />
                  <div className="h-4 bg-neutral-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-display font-bold text-neutral-900">
              Nuevos Ingresos
            </h2>
            <Link
              to="/products?new=true"
              className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              Ver todos
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-neutral-200 rounded-xl mb-4" />
                  <div className="h-4 bg-neutral-200 rounded mb-2" />
                  <div className="h-4 bg-neutral-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Banner CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-display font-bold text-neutral-900 mb-6">
            Únete a nuestra comunidad
          </h2>
          <p className="text-lg text-neutral-700 mb-8">
            Recibe actualizaciones exclusivas, ofertas especiales y las últimas
            tendencias
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="px-6 py-3 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 w-full sm:w-80"
            />
            <button className="px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium">
              Suscribirse
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

// Categorías de ejemplo
const categories = [
  { id: 1, name: "Vestidos", image: "/images/categories/vestidos.jpg" },
  { id: 2, name: "Blusas", image: "/images/categories/blusas.jpg" },
  { id: 3, name: "Pantalones", image: "/images/categories/pantalones.jpg" },
  { id: 4, name: "Faldas", image: "/images/categories/faldas.jpg" },
];
