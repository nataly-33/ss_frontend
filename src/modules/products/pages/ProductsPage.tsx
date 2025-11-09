import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Grid, List } from "lucide-react";
import { ProductCard } from "@modules/products/components/ProductCard";
import { ProductFilters } from "@modules/products/components/ProductFilters";
import { productsService } from "../services/products.service";
import type { Product } from "../types";

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    colors: [],
    sizes: [],
    priceMin: "",
    priceMax: "",
  });

  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    brands: [],
    colors: [],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  });

  useEffect(() => {
    loadFilterOptions();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [filters, searchParams]);

  const loadFilterOptions = async () => {
    try {
      const [categories, brands] = await Promise.all([
        productsService.getCategories(),
        productsService.getBrands(),
      ]);
      setFilterOptions((prev) => ({
        ...prev,
        categories,
        brands,
      }));
    } catch (error) {
      console.error("Error loading filter options:", error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        categories: filters.categories.join(","),
        brands: filters.brands.join(","),
        colors: filters.colors.join(","),
        sizes: filters.sizes.join(","),
        precio_min: Number(filters.priceMin) || 0,
        precio_max: Number(filters.priceMax) || 0,
        featured: searchParams.get("featured"),
        new: searchParams.get("new"),
      } as any;

      const data = await productsService.getProducts(params);
      setProducts(data.results ?? []);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
            Catálogo de Productos
          </h1>
          <p className="text-neutral-600">
            {loading
              ? "Cargando..."
              : `${products.length} productos encontrados`}
          </p>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <ProductFilters
                options={filterOptions}
                activeFilters={filters}
                onFilterChange={setFilters}
              />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <ProductFilters
                options={filterOptions}
                activeFilters={filters}
                onFilterChange={setFilters}
              />

              <div className="flex items-center gap-4">
                {/* Sort */}
                <select className="px-4 py-2 border border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500">
                  <option value="newest">Más recientes</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="name">Nombre A-Z</option>
                </select>

                {/* View Mode */}
                <div className="hidden md:flex border border-neutral-300 rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${
                      viewMode === "grid"
                        ? "bg-primary-50 text-primary-600"
                        : "text-neutral-600"
                    }`}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${
                      viewMode === "list"
                        ? "bg-primary-50 text-primary-600"
                        : "text-neutral-600"
                    }`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-neutral-200 rounded-xl mb-4" />
                    <div className="h-4 bg-neutral-200 rounded mb-2" />
                    <div className="h-4 bg-neutral-200 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-neutral-600 mb-4">
                  No se encontraron productos
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      categories: [],
                      brands: [],
                      colors: [],
                      sizes: [],
                      priceMin: "",
                      priceMax: "",
                    })
                  }
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    : "space-y-6"
                }
              >
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
