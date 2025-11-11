import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@shared/components/ui/Button";
import { brandsService } from "../services/admin.service";
import type { Brand } from "../types";
import { SearchBar } from "../components";

export const BrandsManagement: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    activa: true,
  });

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const response = await brandsService.getAll();
      setBrands(response);
    } catch (error) {
      console.error("Error loading brands:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (brand: Brand) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${brand.nombre}"?`)) return;

    try {
      await brandsService.delete(brand.id);
      loadBrands();
    } catch (error) {
      console.error("Error deleting brand:", error);
      alert("Error al eliminar marca");
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      nombre: brand.nombre,
      descripcion: brand.descripcion || "",
      activa: brand.activa,
    });
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingBrand(null);
    setFormData({
      nombre: "",
      descripcion: "",
      activa: true,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const submitData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        activa: formData.activa,
      };

      if (editingBrand) {
        await brandsService.update(editingBrand.id, submitData);
      } else {
        await brandsService.create(submitData);
      }
      setShowForm(false);
      loadBrands();
    } catch (error) {
      console.error("Error saving brand:", error);
      alert("Error al guardar marca");
    }
  };

  return (
    <div className="space-y-4">
      {/* Search + New */}
      <div className="flex gap-3 items-center">
        <div className="flex-1 bg-white rounded-lg shadow-sm p-3">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar marcas..."
          />
        </div>
        <Button variant="primary" size="md" onClick={handleCreate}>
          <Plus size={18} className="mr-2" />
          Nueva Marca
        </Button>
      </div>

      {/* Brands Grid */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : brands.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-neutral-600">No se encontraron marcas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow p-4"
            >
              {/* Info */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-sm text-neutral-900 mb-1">
                    {brand.nombre}
                  </h3>
                  <p className="text-xs text-neutral-600 mb-3 line-clamp-2">
                    {brand.descripcion || "Sin descripción"}
                  </p>
                </div>
                {/* Quick Actions */}
                <div className="flex flex-col gap-1 ml-2">
                  <button
                    onClick={() => handleEdit(brand)}
                    className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-primary-50 hover:text-primary-600"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(brand)}
                    className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded ${
                    brand.activa
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {brand.activa ? "Activa" : "Inactiva"}
                </span>
                {brand.total_prendas && (
                  <span className="text-xs text-neutral-600">
                    {brand.total_prendas} productos
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md">
            <h2 className="text-base font-bold mb-3">
              {editingBrand ? "Editar Marca" : "Nueva Marca"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="activa"
                  checked={formData.activa}
                  onChange={(e) =>
                    setFormData({ ...formData, activa: e.target.checked })
                  }
                  className="rounded"
                />
                <label
                  htmlFor="activa"
                  className="ml-2 text-xs text-neutral-700"
                >
                  Activa
                </label>
              </div>

              <div className="flex gap-2 pt-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  Guardar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
