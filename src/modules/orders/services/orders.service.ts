import api from "@core/config/api.config";
import { ENDPOINTS } from "@/core/config/endpoints";
import type { 
  Order, 
  PaymentMethod, 
  CheckoutData, 
  OrdersParams,
  StripePaymentData 
} from "../types";

export const ordersService = {
  // Orders
  async getOrders(params?: OrdersParams): Promise<Order[]> {
    const response = await api.get<{ results: Order[] }>(
      ENDPOINTS.ORDERS.BASE, 
      { params }
    );
    return response.data.results || response.data;
  },

  async getMyOrders(): Promise<Order[]> {
    const response = await api.get<{ results: Order[] }>(
      ENDPOINTS.ORDERS.MY_ORDERS
    );
    return response.data.results || response.data;
  },

  async getOrder(orderId: string): Promise<Order> {
    const response = await api.get<Order>(ENDPOINTS.ORDERS.BY_ID(orderId));
    return response.data;
  },

  async createOrder(data: CheckoutData): Promise<Order> {
    const response = await api.post<Order>(ENDPOINTS.ORDERS.CREATE, data);
    return response.data;
  },

  async updateOrderStatus(orderId: string, estado: string): Promise<Order> {
    const response = await api.patch<Order>(
      ENDPOINTS.ORDERS.UPDATE_STATUS(orderId),
      { estado }
    );
    return response.data;
  },

  async cancelOrder(orderId: string): Promise<Order> {
    const response = await api.post<Order>(
      ENDPOINTS.ORDERS.CANCEL(orderId)
    );
    return response.data;
  },

  // Payment Methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    // Este endpoint puede estar en ORDERS o crear uno nuevo
    const response = await api.get<{ results: PaymentMethod[] }>(
      "/api/orders/metodos-pago/"
    );
    return response.data.results || response.data;
  },

  // Stripe Payment
  async processStripePayment(data: StripePaymentData): Promise<any> {
    const response = await api.post("/api/orders/process-payment/", data);
    return response.data;
  },
};
