import React, { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@shared/components/ui/Button";
import api from "@core/config/api.config";

interface Category {
  id: string;
  nombre: string;
  descripcion: string;
  activa: boolean;
  total_prendas: number;
}

export const CategoriesManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

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
    if (!window.confirm("¿Estás seguro de eliminar esta categoría?")) return;

    try {
      await api.delete(`/products/categorias/${categoryId}/`);
      loadCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Error al eliminar categoría");
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-900">
            Gestión de Categorías
          </h1>
          <p className="text-neutral-600 mt-1">
            Organiza tus productos por categorías
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={() => {
            setEditingCategory(null);
            setShowModal(true);
          }}
        >
          <Plus size={20} className="mr-2" />
          Nueva Categoría
        </Button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                    {category.nombre}
                  </h3>
                  <p className="text-sm text-neutral-600 line-clamp-2">
                    {category.descripcion || "Sin descripción"}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    category.activa
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {category.activa ? "Activa" : "Inactiva"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                <span className="text-sm text-neutral-600">
                  {category.total_prendas} productos
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      setShowModal(true);
                    }}
                    className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {categories.length === 0 && !loading && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-neutral-600 mb-4">No hay categorías creadas</p>
          <Button
            variant="primary"
            onClick={() => {
              setEditingCategory(null);
              setShowModal(true);
            }}
          >
            Crear Primera Categoría
          </Button>
        </div>
      )}
    </div>
  );
};
