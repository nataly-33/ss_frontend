import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@shared/components/ui/Button";
import {
  productsService,
  categoriesService,
  brandsService,
} from "../services/admin.service";
import type { Product, Category, Brand } from "../types";
import { PageHeader, SearchBar } from "../components";

interface FormData {
  nombre: string;
  descripcion: string;
  precio: string;
  marca: string;
  categorias: string[];
  color: string;
  material: string;
  tallas: string[];
  activa: boolean;
  destacada: boolean;
  es_novedad: boolean;
}

export const ProductsManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [tallas, setTallas] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    descripcion: "",
    precio: "",
    marca: "",
    categorias: [],
    color: "",
    material: "",
    tallas: [],
    activa: true,
    destacada: false,
    es_novedad: false,
  });

  useEffect(() => {
    loadProducts();
    loadCategoriesAndBrands();
    loadTallas();
  }, []);

  const loadTallas = async () => {
    try {
      // Obtener tallas desde el endpoint del backend
      const response = await fetch("/api/products/tallas/");
      if (response.ok) {
        const data = await response.json();
        const tallasData = Array.isArray(data) ? data : data.results || data;
        setTallas(tallasData);
      }
    } catch (error) {
      console.error("Error loading tallas:", error);
      // Si falla, usar datos locales con UUIDs ficticios (el backend asignará los correctos)
      setTallas([
        { id: "550e8400-e29b-41d4-a716-446655440001", nombre: "XS" },
        { id: "550e8400-e29b-41d4-a716-446655440002", nombre: "S" },
        { id: "550e8400-e29b-41d4-a716-446655440003", nombre: "M" },
        { id: "550e8400-e29b-41d4-a716-446655440004", nombre: "L" },
        { id: "550e8400-e29b-41d4-a716-446655440005", nombre: "XL" },
        { id: "550e8400-e29b-41d4-a716-446655440006", nombre: "XXL" },
      ]);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productsService.getAll({ search: searchTerm });
      setProducts(Array.isArray(response) ? response : response.results || []);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategoriesAndBrands = async () => {
    try {
      const [categoriesResp, brandsResp] = await Promise.all([
        categoriesService.getAll(),
        brandsService.getAll(),
      ]);
      const categoriesData = Array.isArray(categoriesResp)
        ? categoriesResp
        : (categoriesResp as any).results || categoriesResp;
      const brandsData = Array.isArray(brandsResp)
        ? brandsResp
        : (brandsResp as any).results || brandsResp;
      setCategories(categoriesData);
      setBrands(brandsData);
    } catch (error) {
      console.error("Error loading categories/brands:", error);
    }
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nombre: product.nombre,
        descripcion: product.descripcion || "",
        precio: product.precio.toString(),
        marca: product.marca?.id?.toString() || "",
        categorias: product.categorias?.map((c) => c.id) || [],
        color: product.color || "",
        material: product.material || "",
        tallas: [],
        activa: product.activa,
        destacada: product.destacada || false,
        es_novedad: product.es_novedad || false,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        marca: "",
        categorias: [],
        color: "",
        material: "",
        tallas: [],
        activa: true,
        destacada: false,
        es_novedad: false,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData({
      ...formData,
      categorias: formData.categorias.includes(categoryId)
        ? formData.categorias.filter((c) => c !== categoryId)
        : [...formData.categorias, categoryId],
    });
  };

  const handleTallaToggle = (talla: string) => {
    setFormData({
      ...formData,
      tallas: formData.tallas.includes(talla)
        ? formData.tallas.filter((t) => t !== talla)
        : [...formData.tallas, talla],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        nombre: formData.nombre,
        descripcion: formData.descripcion || "",
        precio: parseFloat(formData.precio),
        marca: formData.marca,
        categorias: formData.categorias,
        color: formData.color,
        material: formData.material,
        tallas_disponibles: formData.tallas,
        activa: formData.activa,
        destacada: formData.destacada,
        es_novedad: formData.es_novedad,
      };

      if (editingProduct) {
        await productsService.update(editingProduct.id, data as any);
      } else {
        await productsService.create(data as any);
      }

      loadProducts();
      closeModal();
    } catch (error: any) {
      console.error("Error saving product:", error);
      const errorData = error.response?.data;
      const errorMessage =
        typeof errorData === "object"
          ? Object.entries(errorData)
              .map(
                ([key, value]: [string, any]) =>
                  `${key}: ${Array.isArray(value) ? value.join(", ") : value}`
              )
              .join("\n")
          : "Error al guardar producto";
      alert(`Error al guardar producto:\n${errorMessage}`);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${product.nombre}"?`))
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
          <Button variant="primary" size="lg" onClick={() => openModal()}>
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
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
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
                  <button
                    onClick={() => openModal(product)}
                    className="p-2 bg-white rounded-lg shadow-sm hover:bg-neutral-50"
                  >
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
                  {product.marca?.nombre || product.marca_nombre} •{" "}
                  {product.color}
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

      {/* Product Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-neutral-200 p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  placeholder="Ej: Vestido Elegante"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows={4}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  placeholder="Describe el producto..."
                />
              </div>

              {/* Precio */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Precio *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="precio"
                  value={formData.precio}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  placeholder="0.00"
                />
              </div>

              {/* Marca y Color */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Marca *
                  </label>
                  <select
                    name="marca"
                    value={formData.marca}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="">Selecciona una marca</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Color *
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    placeholder="Ej: Rojo, Negro"
                  />
                </div>
              </div>

              {/* Material */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Material
                </label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  placeholder="Ej: Algodón, Poliéster"
                />
              </div>

              {/* Categorías */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Categorías
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.categorias.includes(cat.id)}
                        onChange={() => handleCategoryToggle(cat.id)}
                        className="rounded border-neutral-300"
                      />
                      <span className="text-sm text-neutral-700">
                        {cat.nombre}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tallas */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Tallas
                </label>
                <div className="flex flex-wrap gap-2">
                  {tallas.map((talla: any) => (
                    <button
                      key={talla.id}
                      type="button"
                      onClick={() => handleTallaToggle(talla.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        formData.tallas.includes(talla.id)
                          ? "bg-primary-500 text-white"
                          : "border border-neutral-300 text-neutral-700 hover:border-primary-500"
                      }`}
                    >
                      {talla.nombre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="activa"
                    checked={formData.activa}
                    onChange={handleInputChange}
                    className="rounded border-neutral-300"
                  />
                  <span className="text-sm text-neutral-700">
                    Producto Activo
                  </span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="destacada"
                    checked={formData.destacada}
                    onChange={handleInputChange}
                    className="rounded border-neutral-300"
                  />
                  <span className="text-sm text-neutral-700">Destacado</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="es_novedad"
                    checked={formData.es_novedad}
                    onChange={handleInputChange}
                    className="rounded border-neutral-300"
                  />
                  <span className="text-sm text-neutral-700">Es Novedad</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg text-neutral-700 font-medium hover:bg-neutral-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all shadow-md hover:shadow-lg"
                >
                  {editingProduct ? "💾 Guardar Cambios" : "➕ Crear Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
