import api from "@core/config/api.config";

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

export const ordersService = {
  // Orders
  async getOrders(params?: any): Promise<Order[]> {
    const response = await api.get<Order[]>("/orders/pedidos/", { params });
    return response.data;
  },

  async getOrder(orderId: string): Promise<Order> {
    const response = await api.get<Order>(`/orders/pedidos/${orderId}/`);
    return response.data;
  },

  async createOrder(data: CheckoutData): Promise<Order> {
    const response = await api.post<Order>("/orders/pedidos/", data);
    return response.data;
  },

  async updateOrderStatus(orderId: string, estado: string) {
    const response = await api.patch(`/orders/pedidos/${orderId}/`, {
      estado,
    });
    return response.data;
  },

  async cancelOrder(orderId: string) {
    const response = await api.post(`/orders/pedidos/${orderId}/cancel/`);
    return response.data;
  },

  // Payment Methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await api.get<PaymentMethod[]>("/orders/metodos-pago/");
    return response.data;
  },

  // Stripe Payment
  async processStripePayment(orderId: string, paymentMethodId: string) {
    const response = await api.post("/orders/process-payment/", {
      order_id: orderId,
      payment_method_id: paymentMethodId,
    });
    return response.data;
  },
};
