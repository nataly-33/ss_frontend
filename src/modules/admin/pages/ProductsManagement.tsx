import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@shared/components/ui/Button";
import { ImageCard } from "@shared/components/ui/ImageCard";
import {
  productsService,
  categoriesService,
  brandsService,
  sizesService,
} from "../services/admin.service";
import type { Product, Category, Brand, Size } from "../types";
import { SearchBar } from "../components";
import { Pagination } from "@shared/components/ui/Pagination";

interface FormData {
  nombre: string;
  descripcion: string;
  precio: string;
  marca: string;
  categorias: string[];
  color: string;
  material: string;
  tallas: string[];
  stocks: Array<{
    talla: string;
    cantidad: number;
    stock_minimo: number;
  }>;
  activa: boolean;
  destacada: boolean;
  es_novedad: boolean;
}

export const ProductsManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [tallas, setTallas] = useState<Size[]>([]);
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
    stocks: [],
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
      // Usar el servicio configurado con los interceptores de autenticación
      const tallasData = await sizesService.getAll();
      setTallas(Array.isArray(tallasData) ? tallasData : []);
    } catch (error) {
      console.error("Error loading tallas:", error);
      setTallas([]);
    }
  };

  const loadProducts = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      setPage(pageNum);
      const response = await productsService.getAll({
        search: searchTerm,
        page: pageNum,
      });

      if (response && typeof response === "object" && "results" in response) {
        setProducts(Array.isArray(response.results) ? response.results : []);
        setTotalCount(response.count || 0);
      } else if (Array.isArray(response)) {
        setProducts(response);
        setTotalCount(response.length);
      } else {
        setProducts([]);
        setTotalCount(0);
      }
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

  const openModal = async (product?: Product) => {
    if (product) {
      try {
        // Cargar producto completo para obtener todos los datos incluyendo stocks
        const fullProduct = await productsService.getById(product.id);

        setEditingProduct(fullProduct);

        // Pre-cargar stocks desde la respuesta detallada
        const stocks = (fullProduct.stocks || []).map((stock: any) => ({
          talla: stock.talla,
          cantidad: stock.cantidad,
          stock_minimo: stock.stock_minimo || 5,
        }));

        // Obtener IDs correctamente de las estructuras anidadas
        const marcaId =
          typeof fullProduct.marca === "string"
            ? fullProduct.marca
            : fullProduct.marca?.id || "";

        const categoriasIds = (
          fullProduct.categorias ||
          fullProduct.categorias_detalle ||
          []
        ).map((c: any) => (typeof c === "string" ? c : c.id));

        const tallasIds = (
          fullProduct.tallas_disponibles ||
          fullProduct.tallas_disponibles_detalle ||
          []
        ).map((t: any) => (typeof t === "string" ? t : t.id));

        setFormData({
          nombre: fullProduct.nombre,
          descripcion: fullProduct.descripcion || "",
          precio:
            typeof fullProduct.precio === "number"
              ? fullProduct.precio.toString()
              : fullProduct.precio.toString(),
          marca: marcaId,
          categorias: categoriasIds,
          color: fullProduct.color || "",
          material: fullProduct.material || "",
          tallas: tallasIds,
          stocks: stocks,
          activa: fullProduct.activa,
          destacada: fullProduct.destacada || false,
          es_novedad: fullProduct.es_novedad || false,
        });
      } catch (error) {
        console.error("Error loading product details:", error);
        alert("Error al cargar detalles del producto");
      }
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
        stocks: [],
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
    const isSelected = formData.tallas.includes(talla);

    if (isSelected) {
      // Remover talla y su stock
      setFormData({
        ...formData,
        tallas: formData.tallas.filter((t) => t !== talla),
        stocks: formData.stocks.filter((s) => s.talla !== talla),
      });
    } else {
      // Agregar talla con stock default
      setFormData({
        ...formData,
        tallas: [...formData.tallas, talla],
        stocks: [...formData.stocks, { talla, cantidad: 0, stock_minimo: 5 }],
      });
    }
  };

  const handleStockChange = (
    tallaId: string,
    field: "cantidad" | "stock_minimo",
    value: number
  ) => {
    setFormData({
      ...formData,
      stocks: formData.stocks.map((stock) =>
        stock.talla === tallaId ? { ...stock, [field]: value } : stock
      ),
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
        stocks: formData.stocks,
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

  // Refetch on search (reset to page 1)
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadProducts(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex gap-3 items-center">
        <div className="flex-1 bg-white rounded-lg shadow-sm p-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Buscar productos..."
              />
            </div>
            <select className="px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:border-primary-500">
              <option value="">Categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nombre}
                </option>
              ))}
            </select>
            <select className="px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:border-primary-500">
              <option value="">Estado</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>
        <Button variant="primary" size="md" onClick={() => openModal()}>
          <Plus size={18} className="mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-neutral-600">No se encontraron productos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="relative bg-neutral-100 flex items-center justify-center p-3">
                <ImageCard
                  isAdmin={true}
                  src={product.imagen_principal}
                  alt={product.nombre}
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.destacada && (
                    <span className="px-2 py-0.5 bg-primary-500 text-white text-xs font-medium rounded">
                      Destacado
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded ${
                      product.activa
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {product.activa ? "Activo" : "Inactivo"}
                  </span>
                </div>

                {/* Quick Actions */}
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  <button
                    onClick={() => openModal(product)}
                    className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-neutral-50"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="font-medium text-sm text-neutral-900 mb-1 line-clamp-2">
                  {product.nombre}
                </h3>
                <p className="text-xs text-neutral-600 mb-2">
                  {product.marca?.nombre || product.marca_nombre} •{" "}
                  {product.color}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-primary-600">
                    ${product.precio}
                  </span>
                  <span className="text-xs text-neutral-600">
                    Stock: {product.stock_total}
                  </span>
                </div>

                {/* Toggle Active */}
                <button
                  onClick={() => handleToggleActive(product)}
                  className="w-full mt-2 px-3 py-1.5 text-xs font-medium border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  {product.activa ? "Desactivar" : "Activar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalCount > pageSize && !loading && (
        <div className="flex justify-center">
          <Pagination
            total={totalCount}
            pageSize={pageSize}
            currentPage={page}
            onPageChange={(newPage) => loadProducts(newPage)}
          />
        </div>
      )}

      {/* Product Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-neutral-200 p-4 flex justify-between items-center">
              <h2 className="text-lg font-bold">
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  placeholder="Ej: Vestido Elegante"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Descripción *
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows={3}
                  required
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  placeholder="Describe el producto..."
                />
              </div>

              {/* Precio */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Precio *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="precio"
                  value={formData.precio}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  placeholder="0.00"
                />
              </div>

              {/* Marca y Color */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Marca *
                  </label>
                  <select
                    name="marca"
                    value={formData.marca}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
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
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Color *
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    placeholder="Ej: Rojo, Negro"
                  />
                </div>
              </div>

              {/* Material */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Material
                </label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  placeholder="Ej: Algodón, Poliéster"
                />
              </div>

              {/* Categorías */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Categorías
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.categorias.includes(cat.id)}
                        onChange={() => handleCategoryToggle(cat.id)}
                        className="rounded border-neutral-300"
                      />
                      <span className="text-xs text-neutral-700">
                        {cat.nombre}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tallas */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Tallas
                </label>
                <div className="flex flex-wrap gap-2">
                  {tallas.map((talla: any) => (
                    <button
                      key={talla.id}
                      type="button"
                      onClick={() => handleTallaToggle(talla.id)}
                      className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
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

              {/* Stock por Talla */}
              {formData.tallas.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-2">
                    📦 Stock por Talla
                  </label>
                  <div className="space-y-2 bg-neutral-50 p-3 rounded-lg max-h-48 overflow-y-auto">
                    {formData.tallas.map((tallaId) => {
                      const talla = tallas.find((t: any) => t.id === tallaId);
                      const stock = formData.stocks.find(
                        (s) => s.talla === tallaId
                      );

                      return (
                        <div
                          key={tallaId}
                          className="grid grid-cols-3 gap-2 items-end"
                        >
                          <div>
                            <label className="block text-xs font-medium text-neutral-600 mb-1">
                              Talla: {talla?.nombre}
                            </label>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-neutral-600 mb-1">
                              Cantidad
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={stock?.cantidad || 0}
                              onChange={(e) =>
                                handleStockChange(
                                  tallaId,
                                  "cantidad",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-full px-2 py-1.5 text-sm border border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-neutral-600 mb-1">
                              Stock Mín.
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={stock?.stock_minimo || 5}
                              onChange={(e) =>
                                handleStockChange(
                                  tallaId,
                                  "stock_minimo",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-full px-2 py-1.5 text-sm border border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                              placeholder="5"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Checkboxes */}
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="activa"
                    checked={formData.activa}
                    onChange={handleInputChange}
                    className="rounded border-neutral-300"
                  />
                  <span className="text-xs text-neutral-700">
                    Producto Activo
                  </span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="destacada"
                    checked={formData.destacada}
                    onChange={handleInputChange}
                    className="rounded border-neutral-300"
                  />
                  <span className="text-xs text-neutral-700">Destacado</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="es_novedad"
                    checked={formData.es_novedad}
                    onChange={handleInputChange}
                    className="rounded border-neutral-300"
                  />
                  <span className="text-xs text-neutral-700">Es Novedad</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 text-sm border border-neutral-300 rounded-lg text-neutral-700 font-medium hover:bg-neutral-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-sm bg-gradient-to-r from-primary-light to-primary-light text-black font-medium rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all shadow-md hover:shadow-lg"
                >
                  {editingProduct ? "Guardar Cambios" : "Crear Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
