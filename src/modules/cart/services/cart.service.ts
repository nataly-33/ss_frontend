import api from "@core/config/api.config";

export interface CartItem {
  id: string;
  prenda: {
    id: string;
    nombre: string;
    slug: string;
    precio: number;
    imagen_principal?: string;
  };
  talla: {
    id: string;
    nombre: string;
  };
  cantidad: number;
  subtotal: number;
}

export interface Cart {
  id: string;
  usuario: string;
  items: CartItem[];
  total: number;
  cantidad_items: number;
}

export const cartService = {
  async getCart(): Promise<Cart> {
    const response = await api.get<Cart>("/cart/");
    return response.data;
  },

  async addItem(prendaId: string, tallaId: string, cantidad: number = 1) {
    const response = await api.post("/cart/add/", {
      prenda_id: prendaId,
      talla_id: tallaId,
      cantidad,
    });
    return response.data;
  },

  async updateItem(itemId: string, cantidad: number) {
    const response = await api.patch(`/cart/${itemId}/update-item/`, {
      cantidad,
    });
    return response.data;
  },

  async removeItem(itemId: string) {
    const response = await api.delete(`/cart/${itemId}/remove-item/`);
    return response.data;
  },

  async clearCart(cartId: string) {
    const response = await api.delete(`/cart/${cartId}/clear/`);
    return response.data;
  },
};
