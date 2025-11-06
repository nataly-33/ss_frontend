import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@shared/components/ui/Button";
import { productsService } from "../services/admin.service";
import type { Product } from "../types";
import { PageHeader, SearchBar } from "../components";

export const ProductsManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productsService.getAll({ search: searchTerm });
      setProducts(response.results || response);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (
      !window.confirm(`¿Estás seguro de eliminar "${product.nombre}"?`)
    )
      return;

    try {
      await productsService.delete(product.id);
      loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error al eliminar producto");
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await productsService.update(product.id, {
        activa: !product.activa,
      });
      loadProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error al actualizar producto");
    }
  };

  // Refetch on search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="p-8">
      <PageHeader
        title="Gestión de Productos"
        description="Administra el catálogo de productos"
        action={
          <Button variant="primary" size="lg">
            <Plus size={20} className="mr-2" />
            Nuevo Producto
          </Button>
        }
      />

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar productos..."
            />
          </div>
          <select className="px-4 py-2 border border-neutral-300 rounded-lg focus:border-primary-500">
            <option value="">Todas las categorías</option>
            <option value="vestidos">Vestidos</option>
            <option value="blusas">Blusas</option>
            <option value="pantalones">Pantalones</option>
          </select>
          <select className="px-4 py-2 border border-neutral-300 rounded-lg focus:border-primary-500">
            <option value="">Estado</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="relative aspect-[3/4] bg-neutral-100">
                {product.imagen_principal ? (
                  <img
                    src={product.imagen_principal}
                    alt={product.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={48} className="text-neutral-300" />
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.destacada && (
                    <span className="px-2 py-1 bg-primary-500 text-white text-xs font-medium rounded">
                      Destacado
                    </span>
                  )}
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      product.activa
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {product.activa ? "Activo" : "Inactivo"}
                  </span>
                </div>

                {/* Quick Actions */}
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                  <button className="p-2 bg-white rounded-lg shadow-sm hover:bg-neutral-50">
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="p-2 bg-white rounded-lg shadow-sm hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-medium text-neutral-900 mb-1 line-clamp-2">
                  {product.nombre}
                </h3>
                <p className="text-sm text-neutral-600 mb-2">
                  {product.marca?.nombre || product.marca_nombre} • {product.color}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary-600">
                    ${product.precio}
                  </span>
                  <span className="text-sm text-neutral-600">
                    Stock: {product.stock_total}
                  </span>
                </div>

                {/* Toggle Active */}
                <button
                  onClick={() => handleToggleActive(product)}
                  className="w-full mt-3 px-4 py-2 text-sm font-medium border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  {product.activa ? "Desactivar" : "Activar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {products.length === 0 && !loading && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-neutral-600">No se encontraron productos</p>
        </div>
      )}
    </div>
  );
};
