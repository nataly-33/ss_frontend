export interface OrderItem {
  id: string;
  prenda: {
    id: string;
    nombre: string;
    slug: string;
    imagen_principal?: string;
  };
  talla: {
    id: string;
    nombre: string;
  };
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface Order {
  id: string;
  numero_pedido: string;
  usuario: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  items: OrderItem[];
  estado: string;
  total: number;
  direccion_envio: any;
  metodo_pago: {
    id: string;
    nombre: string;
    tipo: string;
  };
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface PaymentMethod {
  id: string;
  nombre: string;
  tipo: string;
  activo: boolean;
  descripcion?: string;
}

export interface CheckoutData {
  direccion_envio_id: string;
  metodo_pago_id: string;
  items?: {
    prenda_id: string;
    talla_id: string;
    cantidad: number;
  }[];
  notas?: string;
}

export interface OrdersParams {
  estado?: string;
  page?: number;
  ordering?: string;
}

export interface StripePaymentData {
  order_id: string;
  payment_method_id: string;
}
