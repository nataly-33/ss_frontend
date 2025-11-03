import api from "@core/config/api.config";
import type { Product, Category, Brand } from "@modules/products/types";

export const productsService = {
  async getProducts(params?: any) {
    const response = await api.get<{ results: Product[] }>(
      "/products/prendas/",
      { params }
    );
    return response.data.results;
  },

  async getProduct(slug: string) {
    const response = await api.get<Product>(`/products/prendas/${slug}/`);
    return response.data;
  },

  async getFeatured() {
    const response = await api.get<{ results: Product[] }>(
      "/products/prendas/destacadas/"
    );
    return response.data.results;
  },

  async getNewArrivals() {
    const response = await api.get<{ results: Product[] }>(
      "/products/prendas/novedades/"
    );
    return response.data.results;
  },

  async getCategories() {
    const response = await api.get<{ results: Category[] }>(
      "/products/categorias/"
    );
    return response.data.results;
  },

  async getBrands() {
    const response = await api.get<{ results: Brand[] }>("/products/marcas/");
    return response.data.results;
  },

  async search(query: string) {
    const response = await api.get<{ results: Product[] }>(
      "/products/prendas/",
      {
        params: { search: query },
      }
    );
    return response.data.results;
  },
};
