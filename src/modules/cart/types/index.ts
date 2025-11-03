import type { Product, Size } from "@modules/products/types";

export interface CartItem {
  id: string;
  prenda: Product;
  talla: Size;
  cantidad: number;
}
