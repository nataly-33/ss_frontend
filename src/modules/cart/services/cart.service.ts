import api from "@core/config/api.config";
import { ENDPOINTS } from "@/core/config/endpoints";
import type { Cart, AddToCartRequest, UpdateCartItemRequest } from "../types";

export const cartService = {
  async getCart(): Promise<Cart> {
    console.log("🛒 [CART SERVICE] Getting cart...");
    try {
      const response = await api.get<any>(ENDPOINTS.CART.MY_CART);
      console.log("🛒 [CART SERVICE] Get cart response:", response.data);
      const raw = response.data;
      const normalized = normalizeCart(raw);
      console.log("🛒 [CART SERVICE] Normalized cart:", normalized);
      return normalized;
    } catch (error) {
      console.error("🛒 [CART SERVICE] Error getting cart:", error);
      throw error;
    }
  },

  async addItem(data: AddToCartRequest): Promise<Cart> {
    console.log("🛒 [CART SERVICE] Adding item:", data);
    const payload = {
      prenda: data.prenda_id,
      talla: data.talla_id,
      cantidad: data.cantidad,
    };
    try {
      const response = await api.post<any>(ENDPOINTS.CART.ADD_ITEM, payload);
      console.log("🛒 [CART SERVICE] Add item response:", response.data);
      const raw = response.data?.carrito ?? response.data;
      return normalizeCart(raw);
    } catch (error) {
      console.error("🛒 [CART SERVICE] Error adding item:", error);
      throw error;
    }
  },

  async updateItem(itemId: string, data: UpdateCartItemRequest): Promise<Cart> {
    console.log("🛒 [CART SERVICE] Updating item:", itemId, data);
    const payload = { cantidad: data.cantidad };
    try {
      const url = ENDPOINTS.CART.UPDATE_ITEM(itemId);
      console.log("🛒 [CART SERVICE] Update URL:", url);
      const response = await api.put<any>(url, payload);
      console.log("🛒 [CART SERVICE] Update item response:", response.data);
      const raw = response.data?.carrito ?? response.data;
      return normalizeCart(raw);
    } catch (error) {
      console.error("🛒 [CART SERVICE] Error updating item:", error);
      throw error;
    }
  },

  async removeItem(itemId: string): Promise<Cart> {
    console.log("🛒 [CART SERVICE] Removing item:", itemId);
    try {
      const url = ENDPOINTS.CART.REMOVE_ITEM(itemId);
      console.log("🛒 [CART SERVICE] Remove URL:", url);
      const response = await api.delete<any>(url);
      console.log("🛒 [CART SERVICE] Remove item response:", response.data);
      const raw = response.data?.carrito ?? response.data;
      return normalizeCart(raw);
    } catch (error: any) {
      console.error("🛒 [CART SERVICE] Error removing item:", error);
      console.error("🛒 [CART SERVICE] Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
      });
      throw error;
    }
  },

  async clearCart(): Promise<Cart> {
    console.log("🛒 [CART SERVICE] Clearing cart");
    try {
      const response = await api.post<any>(ENDPOINTS.CART.CLEAR);
      console.log("🛒 [CART SERVICE] Clear cart response:", response.data);
      const raw = response.data?.carrito ?? response.data;
      return normalizeCart(raw);
    } catch (error) {
      console.error("🛒 [CART SERVICE] Error clearing cart:", error);
      throw error;
    }
  },
};

function normalizeCart(raw: any): Cart {
  console.log("🛒 [NORMALIZE] Raw data:", raw);

  if (!raw) {
    console.warn("🛒 [NORMALIZE] No raw data provided");
    return {
      id: "",
      usuario: "",
      items: [],
      total: 0,
      total_items: 0,
      cantidad_items: 0,
    };
  }

  const items = (raw.items || []).map((it: any) => {
    const prenda = it.prenda_detalle || {};
    const talla = it.talla_detalle || {};

    // Ensure prices are always numbers
    const precio =
      typeof prenda.precio === "string"
        ? parseFloat(prenda.precio)
        : prenda.precio ?? 0;
    const precioUnitario =
      typeof it.precio_unitario === "string"
        ? parseFloat(it.precio_unitario)
        : it.precio_unitario ?? precio;
    const subtotal =
      typeof it.subtotal === "string"
        ? parseFloat(it.subtotal)
        : it.subtotal ?? precioUnitario * (it.cantidad ?? 0);

    const itemData = {
      id: it.id,
      prenda: {
        id: prenda.id ?? it.prenda ?? "",
        nombre: prenda.nombre ?? "",
        slug: prenda.slug ?? "",
        precio: precio,
        imagen_principal: prenda.imagen_principal,
      },
      talla: {
        id: talla.id ?? it.talla ?? "",
        nombre: talla.nombre ?? "",
      },
      cantidad: it.cantidad ?? 0,
      subtotal: subtotal,
    };

    console.log("🛒 [NORMALIZE] Processed item:", itemData);
    return itemData;
  });

  const total =
    typeof raw.total === "string" ? parseFloat(raw.total) : raw.total ?? 0;
  const totalItems = raw.total_items ?? items.length;
  const cantidadItems =
    raw.cantidad_items ??
    items.reduce((sum: number, item: any) => sum + (item.cantidad ?? 0), 0);

  const normalized = {
    id: raw.id ?? "",
    usuario: raw.usuario ?? "",
    items,
    total: total,
    total_items: totalItems,
    cantidad_items: cantidadItems,
  };

  console.log("🛒 [NORMALIZE] Final normalized cart:", normalized);
  return normalized;
}
