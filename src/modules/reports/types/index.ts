/**
 * Tipos e Interfaces para el módulo de Reportes
 */

// Tipos de reportes soportados
export type ReportType = 'ventas' | 'productos' | 'clientes' | 'analytics';

// Formatos de exportación
export type ReportFormat = 'pdf' | 'excel' | 'csv';

// Request para generar reporte desde prompt
export interface GenerateReportRequest {
  prompt: string;
}

// Request para reporte predefinido
export interface PredefinedReportRequest {
  report_type: ReportType;
  format: ReportFormat;
  filters?: Record<string, any>;
}

// Analytics Overview
export interface AnalyticsOverview {
  sales_by_month: SalesByMonth[];
  products_by_category: ProductsByCategory[];
  activity_by_day: ActivityByDay[];
  top_selling_products: TopProduct[];
  sales_by_status: SalesByStatus[];
  summary: Summary;
  inventory_summary: InventorySummary;
  customer_analytics: CustomerAnalytics;
}

// Ventas por mes
export interface SalesByMonth {
  month: string;
  total_sales: number;
  order_count: number;
  date: string;
}

// Productos por categoría
export interface ProductsByCategory {
  category: string;
  count: number;
}

// Actividad por día
export interface ActivityByDay {
  day: string;
  orders: number;
  total_sales: number;
  date: string;
}

// Top productos
export interface TopProduct {
  product_name: string;
  price: number;
  quantity_sold: number;
  total_revenue: number;
}

// Ventas por estado
export interface SalesByStatus {
  status: string;
  count: number;
  total_amount: number;
}

// Resumen general
export interface Summary {
  total_orders: number;
  orders_this_month: number;
  orders_this_week: number;
  total_sales: number;
  sales_this_month: number;
  total_products: number;
  products_low_stock: number;
  total_customers: number;
  customers_this_month: number;
}

// Resumen de inventario
export interface InventorySummary {
  total_products: number;
  total_stock: number;
  low_stock_items: number;
  out_of_stock_items: number;
}

// Analytics de clientes
export interface CustomerAnalytics {
  total_customers: number;
  customers_with_orders: number;
  customers_without_orders: number;
  top_customer: {
    name: string;
    order_count: number;
  } | null;
  average_order_value: number;
}

// Parámetros para analytics
export interface AnalyticsParams {
  months?: number;
  days?: number;
}
