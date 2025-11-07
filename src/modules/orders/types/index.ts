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
    nombre: string;
    apellido: string;
  };
  items: OrderItem[];
  estado: string;
  subtotal: number;
  descuento: number;
  costo_envio: number;
  total: number;
  total_items: number;
  puede_cancelar: boolean;
  direccion_envio: any;
  direccion_snapshot?: any;
  notas_cliente?: string;
  notas_internas?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  requiere_procesador: boolean;
}

export interface CheckoutData {
  direccion_envio_id: string;
  metodo_pago: 'efectivo' | 'tarjeta' | 'paypal' | 'billetera';
  notas_cliente?: string;
  payment_method_id?: string;
  paypal_order_id?: string;
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
