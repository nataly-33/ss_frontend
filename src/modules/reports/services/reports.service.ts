/**
 * Servicio de Reportes
 *
 * Maneja todas las peticiones a la API de reportes y analytics
 */

import api from "@/core/config/api.config";
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
  YearlyComparison,
} from "../types";

const REPORTS_BASE = "/reports";
const ANALYTICS_BASE = "/analytics";

export const reportsService = {
  /**
   * Generar un reporte desde un prompt de texto
   * Retorna un archivo blob para descargar
   */
  async generateFromPrompt(
    prompt: string,
    format?: string
  ): Promise<{ blob: Blob; filename: string }> {
    const body: any = { prompt };

    // NO enviar formato - dejar que el backend lo detecte del prompt
    // El format solo se usa si viene explícitamente (botones legacy)
    if (format && format.trim()) {
      body.format = format;
    }

    const response = await api.post(`${REPORTS_BASE}/generate/`, body, {
      responseType: "blob",
    });

    // Detectar formato del blob usando el MIME type
    const blob = response.data as Blob;
    let extension = "pdf";

    if (
      blob.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      extension = "xlsx";
    } else if (blob.type === "text/csv") {
      extension = "csv";
    } else if (blob.type === "application/pdf") {
      extension = "pdf";
    }

    // Generar nombre de archivo basado en el prompt y fecha
    const date = new Date().toISOString().split("T")[0];
    const safeName = prompt
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .substring(0, 30);
    const filename = `reporte_${safeName}_${date}.${extension}`;

    return {
      blob: blob,
      filename: filename,
    };
  },

  /**
   * Generar un reporte predefinido
   * Retorna un archivo blob para descargar
   */
  async generatePredefined(request: PredefinedReportRequest): Promise<Blob> {
    const response = await api.post(`${REPORTS_BASE}/predefined/`, request, {
      responseType: "blob",
    });

    return response.data;
  },

  /**
   * Preview de un reporte (máximo 20 filas)
   */
  async previewReport(prompt: string): Promise<any> {
    const response = await api.post(`${REPORTS_BASE}/preview/`, { prompt });
    return response.data;
  },

  /**
   * Obtener plantillas de reportes predefinidos
   */
  async getTemplates(): Promise<any[]> {
    const response = await api.get(`${REPORTS_BASE}/templates/`);
    return response.data;
  },

  /**
   * Descargar archivo blob generado
   */
  downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
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
    const date = new Date().toISOString().split("T")[0];
    const safeName = prompt
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .substring(0, 30);
    const ext = format === "excel" ? "xlsx" : format;
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
    const response = await api.get<SalesByMonth[]>(`${ANALYTICS_BASE}/sales/`, {
      params: { months },
    });
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

  /**
   * Obtener estadísticas de logins
   */
  async getLogins(
    period: "today" | "7days" | "30days" = "30days"
  ): Promise<any> {
    // Este endpoint se implementará en el backend
    let prompt = "";
    switch (period) {
      case "today":
        prompt = "logins de hoy";
        break;
      case "7days":
        prompt = "logins de los últimos 7 días";
        break;
      case "30days":
        prompt = "logins de los últimos 30 días";
        break;
    }

    try {
      const response = await api.post(`${REPORTS_BASE}/preview/`, { prompt });
      return response.data;
    } catch (error) {
      console.error("Error obteniendo logins:", error);
      return { data: [], metadata: {} };
    }
  },

  /**
   * Obtener carritos activos
   */
  async getActiveCarts(): Promise<any> {
    try {
      const response = await api.post(`${REPORTS_BASE}/preview/`, {
        prompt: "carritos activos con items",
      });
      return response.data;
    } catch (error) {
      console.error("Error obteniendo carritos:", error);
      return { data: [], metadata: {} };
    }
  },

  /**
   * Obtener comparativa anual 2024 vs 2025
   */
  async getYearlyComparison(): Promise<YearlyComparison> {
    const response = await api.get<YearlyComparison>(
      `${ANALYTICS_BASE}/yearly_comparison/`
    );
    return response.data;
  },
};

// Export combinado
export default {
  reports: reportsService,
  analytics: analyticsService,
};
