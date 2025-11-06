import React, { useEffect, useState } from "react";
import { api } from "@core/config/api.config";
import { Search, Plus, Edit2, Trash2, Package, Eye } from "lucide-react";

interface Product {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  precio: number;
  marca: {
    id: string;
    nombre: string;
  };
  imagen_principal?: string;
  stock_total: number;
  is_active: boolean;
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

  const handleDelete = async (slug: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      await api.delete(`/products/prendas/${slug}/`);
      setProducts(products.filter((p) => p.slug !== slug));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error al eliminar producto");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-neutral-600">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
          Gestión de Productos
        </h1>
        <p className="text-neutral-600">Administra el catálogo de productos</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
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
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <button
            onClick={() => alert("Funcionalidad en desarrollo")}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus size={20} />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-square bg-neutral-100 relative">
              {product.imagen_principal ? (
                <img
                  src={product.imagen_principal}
                  alt={product.nombre}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={48} className="text-neutral-400" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.is_active ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 mb-1 truncate">
                {product.nombre}
              </h3>
              <p className="text-sm text-neutral-600 mb-2">
                {product.marca.nombre}
              </p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-primary-600">
                  S/ {product.precio.toFixed(2)}
                </span>
                <span className="text-sm text-neutral-600">
                  Stock: {product.stock_total}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    window.open(`/products/${product.slug}`, "_blank")
                  }
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50"
                >
                  <Eye size={16} />
                  Ver
                </button>
                <button
                  onClick={() => alert("Funcionalidad en desarrollo")}
                  className="flex items-center justify-center px-3 py-2 text-sm border border-primary-300 text-primary-600 rounded-lg hover:bg-primary-50"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(product.slug)}
                  className="flex items-center justify-center px-3 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-neutral-600">No se encontraron productos</p>
        </div>
      )}
    </div>
  );
};
