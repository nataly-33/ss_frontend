import api from "@core/config/api.config";
import { ENDPOINTS } from "@/core/config/endpoints";
import type {
  Product,
  Category,
  Brand,
  ProductsResponse,
  ProductFilters,
} from "../types";

// Helper function to sort products: 1) Con imagen primero, 2) Blusas primero dentro de las que tienen imagen
const sortProductsByImage = (products: Product[]): Product[] => {
  return [...products].sort((a, b) => {
    // Verificar si tienen imagen_principal válida (no null, no vacío)
    const aHasImage =
      a.imagen_principal &&
      a.imagen_principal !== null &&
      a.imagen_principal.trim() !== "";
    const bHasImage =
      b.imagen_principal &&
      b.imagen_principal !== null &&
      b.imagen_principal.trim() !== "";

    // Verificar si es categoría Blusas (case insensitive)
    const aIsBlusas =
      a.categorias_detalle?.some(
        (cat) => cat.nombre?.toLowerCase() === "blusas"
      ) ?? false;
    const bIsBlusas =
      b.categorias_detalle?.some(
        (cat) => cat.nombre?.toLowerCase() === "blusas"
      ) ?? false;

    // PRIORIDAD 1: Productos con imagen van primero
    if (aHasImage && !bHasImage) return -1;
    if (!aHasImage && bHasImage) return 1;

    // PRIORIDAD 2: Entre los que tienen imagen, Blusas van primero
    if (aHasImage && bHasImage) {
      if (aIsBlusas && !bIsBlusas) return -1;
      if (!aIsBlusas && bIsBlusas) return 1;
    }

    // Si ambos tienen/no tienen imagen y ambos son/no son Blusas, mantener orden original
    return 0;
  });
};

export const productsService = {
  async getProducts(params?: ProductFilters): Promise<ProductsResponse> {
    const response = await api.get<ProductsResponse>(ENDPOINTS.PRODUCTS.BASE, {
      params,
    });
    // Sort products to show those with images first
    response.data.results = sortProductsByImage(response.data.results);
    return response.data;
  },

  async getProduct(slug: string): Promise<Product> {
    const response = await api.get<Product>(ENDPOINTS.PRODUCTS.BY_SLUG(slug));
    return response.data;
  },

  async getFeatured(): Promise<Product[]> {
    const response = await api.get<ProductsResponse>(ENDPOINTS.PRODUCTS.BASE, {
      params: { destacada: true },
    });
    // Sort to show products with images first
    return sortProductsByImage(response.data.results);
  },

  async getNewArrivals(): Promise<Product[]> {
    const response = await api.get<ProductsResponse>(ENDPOINTS.PRODUCTS.BASE, {
      params: { es_novedad: true },
    });
    // Sort to show products with images first
    return sortProductsByImage(response.data.results);
  },

  async getCategories(): Promise<Category[]> {
    const response = await api.get<{ results: Category[] }>(
      ENDPOINTS.PRODUCTS.CATEGORIES
    );
    return response.data.results;
  },

  async getBrands(): Promise<Brand[]> {
    const response = await api.get<{ results: Brand[] }>(
      ENDPOINTS.PRODUCTS.BRANDS
    );
    return response.data.results;
  },

  async search(query: string): Promise<Product[]> {
    const response = await api.get<ProductsResponse>(
      ENDPOINTS.PRODUCTS.SEARCH,
      {
        params: { search: query },
      }
    );
    return response.data.results;
  },
};
