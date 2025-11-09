/**
 * Servicio de Reportes
 *
 * Maneja todas las peticiones a la API de reportes y analytics
 */

import api from '@/core/config/api.config';
import type {
  GenerateReportRequest,
  PredefinedReportRequest,
  AnalyticsOverview,
  AnalyticsParams,
  Summary,
  InventorySummary,
  CustomerAnalytics,
  SalesByMonth,
  ProductsByCategory,
} from '../types';

const REPORTS_BASE = '/reports';
const ANALYTICS_BASE = '/analytics';

export const reportsService = {
  /**
   * Generar un reporte desde un prompt de texto
   * Retorna un archivo blob para descargar
   */
  async generateFromPrompt(prompt: string): Promise<Blob> {
    const response = await api.post(
      `${REPORTS_BASE}/generate/`,
      { prompt },
      {
        responseType: 'blob',
      }
    );

    return response.data;
  },

  /**
   * Generar un reporte predefinido
   * Retorna un archivo blob para descargar
   */
  async generatePredefined(request: PredefinedReportRequest): Promise<Blob> {
    const response = await api.post(
      `${REPORTS_BASE}/predefined/`,
      request,
      {
        responseType: 'blob',
      }
    );

    return response.data;
  },

  /**
   * Descargar archivo blob generado
   */
  downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  /**
   * Generar nombre de archivo basado en el prompt y fecha
   */
  generateFilename(prompt: string, format: string): string {
    const date = new Date().toISOString().split('T')[0];
    const safeName = prompt
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .substring(0, 30);
    const ext = format === 'excel' ? 'xlsx' : format;
    return `reporte_${safeName}_${date}.${ext}`;
  },
};

export const analyticsService = {
  /**
   * Obtener overview completo de analytics
   */
  async getOverview(params?: AnalyticsParams): Promise<AnalyticsOverview> {
    const response = await api.get<AnalyticsOverview>(
      `${ANALYTICS_BASE}/overview/`,
      { params }
    );
    return response.data;
  },

  /**
   * Obtener resumen general del sistema
   */
  async getSummary(): Promise<Summary> {
    const response = await api.get<Summary>(`${ANALYTICS_BASE}/summary/`);
    return response.data;
  },

  /**
   * Obtener datos de ventas por mes
   */
  async getSales(months: number = 12): Promise<SalesByMonth[]> {
    const response = await api.get<SalesByMonth[]>(
      `${ANALYTICS_BASE}/sales/`,
      {
        params: { months },
      }
    );
    return response.data;
  },

  /**
   * Obtener analytics de productos
   */
  async getProducts(): Promise<{
    by_category: ProductsByCategory[];
    top_selling: any[];
  }> {
    const response = await api.get(`${ANALYTICS_BASE}/products/`);
    return response.data;
  },

  /**
   * Obtener resumen de inventario
   */
  async getInventory(): Promise<InventorySummary> {
    const response = await api.get<InventorySummary>(
      `${ANALYTICS_BASE}/inventory/`
    );
    return response.data;
  },

  /**
   * Obtener analytics de clientes
   */
  async getCustomers(): Promise<CustomerAnalytics> {
    const response = await api.get<CustomerAnalytics>(
      `${ANALYTICS_BASE}/customers/`
    );
    return response.data;
  },
};

// Export combinado
export default {
  reports: reportsService,
  analytics: analyticsService,
};
