import api from "@core/config/api.config";
import { ENDPOINTS } from "@/core/config/endpoints";
import type { Cart, AddToCartRequest, UpdateCartItemRequest } from "../types";

export const cartService = {
  async getCart(): Promise<Cart> {
    const response = await api.get<Cart>(ENDPOINTS.CART.BASE);
    return response.data;
  },

  async addItem(data: AddToCartRequest): Promise<Cart> {
    const response = await api.post<Cart>(ENDPOINTS.CART.ADD_ITEM, data);
    return response.data;
  },

  async updateItem(itemId: string, data: UpdateCartItemRequest): Promise<Cart> {
    const response = await api.patch<Cart>(
      ENDPOINTS.CART.UPDATE_ITEM(itemId), 
      data
    );
    return response.data;
  },

  async removeItem(itemId: string): Promise<Cart> {
    const response = await api.delete<Cart>(
      ENDPOINTS.CART.REMOVE_ITEM(itemId)
    );
    return response.data;
  },

  async clearCart(): Promise<void> {
    await api.delete(ENDPOINTS.CART.CLEAR);
  },
};
