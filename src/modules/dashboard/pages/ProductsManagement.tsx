import React, { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@shared/components/ui/Button";
import api from "@core/config/api.config";

interface Product {
  id: string;
  nombre: string;
  precio: number;
  marca_nombre: string;
  color: string;
  imagen_principal: string | null;
  stock_total: number;
  activa: boolean;
  destacada: boolean;
}

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
      const response = await api.get("/products/prendas/");
      setProducts(response.data.results || response.data);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      await api.delete(`/products/prendas/${productId}/`);
      loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error al eliminar producto");
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await api.patch(`/products/prendas/${product.id}/`, {
        activa: !product.activa,
      });
      loadProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error al actualizar producto");
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.marca_nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-900">
            Gestión de Productos
          </h1>
          <p className="text-neutral-600 mt-1">
            Administra el catálogo de productos
          </p>
        </div>
        <Button variant="primary" size="lg">
          <Plus size={20} className="mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
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
          {filteredProducts.map((product) => (
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
                    onClick={() => handleDelete(product.id)}
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
                  {product.marca_nombre} • {product.color}
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

      {filteredProducts.length === 0 && !loading && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-neutral-600">No se encontraron productos</p>
        </div>
      )}
    </div>
  );
};
