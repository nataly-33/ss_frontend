import api from "@core/config/api.config";
import { ENDPOINTS } from "@/core/config/endpoints";
import type { Cart, AddToCartRequest, UpdateCartItemRequest } from "../types";

export const cartService = {
  async getCart(): Promise<Cart> {
    const response = await api.get<any>(ENDPOINTS.CART.MY_CART);
    const raw = response.data;
    return normalizeCart(raw);
  },

  async addItem(data: AddToCartRequest): Promise<Cart> {
    const payload = {
      prenda: data.prenda_id,
      talla: data.talla_id,
      cantidad: data.cantidad,
    };
    const response = await api.post<any>(ENDPOINTS.CART.ADD_ITEM, payload);
    const raw = response.data?.carrito ?? response.data;
    return normalizeCart(raw);
  },

  async updateItem(itemId: string, data: UpdateCartItemRequest): Promise<Cart> {
    const payload = { item_id: itemId, cantidad: data.cantidad };
    const response = await api.put<any>(ENDPOINTS.CART.UPDATE_ITEM, payload);
    const raw = response.data?.carrito ?? response.data;
    return normalizeCart(raw);
  },

  async removeItem(itemId: string): Promise<Cart> {
    const response = await api.delete<any>(ENDPOINTS.CART.REMOVE_ITEM, { params: { item_id: itemId } });
    const raw = response.data?.carrito ?? response.data;
    return normalizeCart(raw);
  },

  async clearCart(): Promise<void> {
    await api.post(ENDPOINTS.CART.CLEAR);
  },
};

function normalizeCart(raw: any): Cart {
  if (!raw) {
    return {
      id: "",
      usuario: "",
      items: [],
      total: 0,
      cantidad_items: 0,
    };
  }

  const items = (raw.items || []).map((it: any) => {
    const prenda = it.prenda_detalle || {};
    const talla = it.talla_detalle || {};
    return {
      id: it.id,
      prenda: {
        id: prenda.id ?? "",
        nombre: prenda.nombre ?? "",
        slug: prenda.slug ?? "",
        precio: prenda.precio ?? it.precio_unitario ?? 0,
        imagen_principal: prenda.imagen_principal,
      },
      talla: {
        id: talla.id ?? "",
        nombre: talla.nombre ?? "",
      },
      cantidad: it.cantidad ?? 0,
      subtotal: it.subtotal ?? 0,
    };
  });

  return {
    id: raw.id ?? "",
    usuario: raw.usuario ?? "",
    items,
    total: raw.total ?? 0,
    cantidad_items: raw.total_items ?? items.reduce((s: number, i: any) => s + i.cantidad, 0),
  };
}
