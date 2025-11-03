export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  marca_nombre: string;
  color: string;
  slug: string;
  imagen_principal: string | null;
  stock_total: number;
  tiene_stock: boolean;
  activa: boolean;
  destacada: boolean;
  es_novedad: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string | null;
  activa: boolean;
  total_prendas: number;
}

export interface Brand {
  id: string;
  nombre: string;
  descripcion: string;
  logo: string | null;
  activa: boolean;
  total_prendas: number;
}

export interface Size {
  id: string;
  nombre: string;
  orden: number;
}
