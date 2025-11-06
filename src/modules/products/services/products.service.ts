import api from "@core/config/api.config";
import { ENDPOINTS } from "@/core/config/endpoints";
import type { 
  Product, 
  Category, 
  Brand,
  ProductsResponse,
  ProductFilters 
} from "../types";

export const productsService = {
  async getProducts(params?: ProductFilters): Promise<ProductsResponse> {
    const response = await api.get<ProductsResponse>(ENDPOINTS.PRODUCTS.BASE, { 
      params 
    });
    return response.data;
  },

  async getProduct(slug: string): Promise<Product> {
    const response = await api.get<Product>(ENDPOINTS.PRODUCTS.BY_SLUG(slug));
    return response.data;
  },

  async getFeatured(): Promise<Product[]> {
    const response = await api.get<ProductsResponse>(ENDPOINTS.PRODUCTS.BASE, {
      params: { destacada: true }
    });
    return response.data.results;
  },

  async getNewArrivals(): Promise<Product[]> {
    const response = await api.get<ProductsResponse>(ENDPOINTS.PRODUCTS.BASE, {
      params: { es_novedad: true }
    });
    return response.data.results;
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
