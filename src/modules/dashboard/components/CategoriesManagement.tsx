import React, { useEffect, useState } from "react";
import { api } from "@core/config/api.config";
import { Search, Plus, Edit2, Trash2, Grid } from "lucide-react";

interface Category {
  id: string;
  nombre: string;
  descripcion: string;
  slug: string;
  productos_count?: number;
}

export const CategoriesManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products/categorias/");
      setCategories(response.data.results || response.data);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm("¿Estás seguro de eliminar esta categoría?")) return;

    try {
      await api.delete(`/products/categorias/${categoryId}/`);
      setCategories(categories.filter((c) => c.id !== categoryId));
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Error al eliminar categoría");
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-neutral-600">Cargando categorías...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
          Gestión de Categorías
        </h1>
        <p className="text-neutral-600">
          Administra las categorías de productos
        </p>
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
              placeholder="Buscar categorías..."
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
            <span>Nueva Categoría</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Grid size={24} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">
                    {category.nombre}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {category.productos_count || 0} productos
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
              {category.descripcion}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => alert("Funcionalidad en desarrollo")}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm border border-primary-300 text-primary-600 rounded-lg hover:bg-primary-50"
              >
                <Edit2 size={16} />
                Editar
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="flex items-center justify-center px-3 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-neutral-600">No se encontraron categorías</p>
        </div>
      )}
    </div>
  );
};
