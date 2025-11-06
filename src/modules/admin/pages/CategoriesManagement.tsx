import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@shared/components/ui/Button";
import { categoriesService } from "../services/admin.service";
import type { Category } from "../types";
import { PageHeader, StatusBadge } from "../components";

export const CategoriesManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  // TODO: Implement modal for create/edit
  // const [showModal, setShowModal] = useState(false);
  // const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesService.getAll();
      setCategories(response.results || response);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (
      !window.confirm(`¿Estás seguro de eliminar la categoría "${category.nombre}"?`)
    )
      return;

    try {
      await categoriesService.delete(category.id);
      loadCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Error al eliminar categoría");
    }
  };

  const handleEdit = (category: Category) => {
    // TODO: Open modal or navigate to edit page
    console.log("Edit category:", category);
  };

  return (
    <div className="p-8">
      <PageHeader
        title="Gestión de Categorías"
        description="Organiza tus productos por categorías"
        action={
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              // TODO: Open modal for creating category
              console.log("Create new category");
            }}
          >
            <Plus size={20} className="mr-2" />
            Nueva Categoría
          </Button>
        }
      />

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
                <StatusBadge status={category.activa} />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                <span className="text-sm text-neutral-600">
                  {category.total_prendas} productos
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(category)}
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
              // TODO: Open modal for creating category
              console.log("Create first category");
            }}
          >
            Crear Primera Categoría
          </Button>
        </div>
      )}
    </div>
  );
};
