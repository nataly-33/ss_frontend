/**
 * ReportsPage
 *
 * Página principal para generar reportes dinámicos desde prompts de texto o voz
 */

import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { ReportPromptInput } from "../components/ReportPromptInput";
import { reportsService, analyticsService } from "../services/reports.service";
import type { YearlyComparison } from "../types";

export const ReportsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [yearlyData, setYearlyData] = useState<YearlyComparison | null>(null);

  useEffect(() => {
    loadYearlyComparison();
  }, []);

  const loadYearlyComparison = async () => {
    try {
      const data = await analyticsService.getYearlyComparison();
      setYearlyData(data);
    } catch (err) {
      console.error("Error al cargar comparativa:", err);
    }
  };

  const handleGenerateReport = async (prompt: string, format: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // El backend detecta el formato del prompt automáticamente
      // Solo enviar format si no está vacío (para compatibilidad con botones viejos)
      const formatToSend = format && format.trim() ? format : undefined;
      const { blob, filename } = await reportsService.generateFromPrompt(
        prompt,
        formatToSend
      );

      // Descargar archivo con el nombre que viene del backend
      reportsService.downloadBlob(blob, filename);

      setSuccess(`Reporte "${filename}" generado y descargado exitosamente`);
    } catch (err: any) {
      console.error("Error al generar reporte:", err);
      setError(
        err.response?.data?.error ||
          "Error al generar el reporte. Verifica tu prompt e intenta de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Reportes Dinámicos
          </h1>
        </div>
        <p className="text-gray-600">
          Genera reportes personalizados usando lenguaje natural. Puedes
          escribir o usar comandos de voz.
        </p>
      </div>

      {/* Comparativa 2024 vs 2025 */}
      {yearlyData && (
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            Comparativa 2024 vs 2025
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Ventas */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-2">Total Ventas</p>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">2024:</span>
                  <span className="font-semibold text-gray-700">
                    Bs.{" "}
                    {yearlyData.year_2024.total_ventas.toLocaleString("es-BO", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">2025:</span>
                  <span className="font-semibold text-gray-900">
                    Bs.{" "}
                    {yearlyData.year_2025.total_ventas.toLocaleString("es-BO", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
              <div
                className={`mt-3 flex items-center gap-1 text-sm font-medium ${
                  yearlyData.comparison.cambio_ventas_porcentaje >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {yearlyData.comparison.cambio_ventas_porcentaje >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {Math.abs(
                  yearlyData.comparison.cambio_ventas_porcentaje
                ).toFixed(1)}
                %
              </div>
            </div>

            {/* Pedidos */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-2">Total Pedidos</p>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">2024:</span>
                  <span className="font-semibold text-gray-700">
                    {yearlyData.year_2024.total_pedidos}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">2025:</span>
                  <span className="font-semibold text-gray-900">
                    {yearlyData.year_2025.total_pedidos}
                  </span>
                </div>
              </div>
              <div
                className={`mt-3 flex items-center gap-1 text-sm font-medium ${
                  yearlyData.comparison.cambio_pedidos_porcentaje >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {yearlyData.comparison.cambio_pedidos_porcentaje >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {Math.abs(
                  yearlyData.comparison.cambio_pedidos_porcentaje
                ).toFixed(1)}
                %
              </div>
            </div>

            {/* Clientes */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-2">Nuevos Clientes</p>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">2024:</span>
                  <span className="font-semibold text-gray-700">
                    {yearlyData.year_2024.nuevos_clientes}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">2025:</span>
                  <span className="font-semibold text-gray-900">
                    {yearlyData.year_2025.nuevos_clientes}
                  </span>
                </div>
              </div>
              <div
                className={`mt-3 flex items-center gap-1 text-sm font-medium ${
                  yearlyData.comparison.cambio_clientes_porcentaje >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {yearlyData.comparison.cambio_clientes_porcentaje >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {Math.abs(
                  yearlyData.comparison.cambio_clientes_porcentaje
                ).toFixed(1)}
                %
              </div>
            </div>

            {/* Ticket Promedio */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-2">Ticket Promedio</p>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">2024:</span>
                  <span className="font-semibold text-gray-700">
                    Bs. {yearlyData.year_2024.ticket_promedio.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">2025:</span>
                  <span className="font-semibold text-gray-900">
                    Bs. {yearlyData.year_2025.ticket_promedio.toFixed(2)}
                  </span>
                </div>
              </div>
              <div
                className={`mt-3 flex items-center gap-1 text-sm font-medium ${
                  yearlyData.comparison.cambio_ticket_porcentaje >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {yearlyData.comparison.cambio_ticket_porcentaje >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {Math.abs(
                  yearlyData.comparison.cambio_ticket_porcentaje
                ).toFixed(1)}
                %
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Messages */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900">Error</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800"
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-green-900">Éxito</h3>
            <p className="text-sm text-green-700">{success}</p>
          </div>
          <button
            onClick={() => setSuccess(null)}
            className="text-green-600 hover:text-green-800"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prompt Input */}
        <div className="lg:col-span-2">
          <ReportPromptInput
            onSubmit={handleGenerateReport}
            isLoading={isLoading}
          />
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          {/* Quick Reports */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Reportes Predeterminados
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Haz clic para generar reportes comunes al instante
            </p>
            <div className="space-y-2">
              <button
                onClick={() =>
                  handleGenerateReport("Ventas del año 2025 en Excel", "")
                }
                disabled={isLoading}
                className="w-full text-left px-4 py-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition disabled:opacity-50 border border-blue-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-blue-900">
                      Ventas 2025
                    </div>
                    <div className="text-xs text-blue-700">
                      Reporte completo de ventas del año
                    </div>
                  </div>
                  <Download className="h-5 w-5 text-blue-600" />
                </div>
              </button>

              <button
                onClick={() =>
                  handleGenerateReport(
                    "Top 10 productos más vendidos del año 2025 en PDF",
                    ""
                  )
                }
                disabled={isLoading}
                className="w-full text-left px-4 py-3 rounded-lg bg-green-50 hover:bg-green-100 transition disabled:opacity-50 border border-green-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-green-900">
                      Top Productos 2025
                    </div>
                    <div className="text-xs text-green-700">
                      Los 10 productos más vendidos
                    </div>
                  </div>
                  <Download className="h-5 w-5 text-green-600" />
                </div>
              </button>

              <button
                onClick={() =>
                  handleGenerateReport(
                    "Clientes registrados en el año 2025 en Excel",
                    ""
                  )
                }
                disabled={isLoading}
                className="w-full text-left px-4 py-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition disabled:opacity-50 border border-purple-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-purple-900">
                      Clientes 2025
                    </div>
                    <div className="text-xs text-purple-700">
                      Todos los clientes del año
                    </div>
                  </div>
                  <Download className="h-5 w-5 text-purple-600" />
                </div>
              </button>
            </div>

            <div className="mt-4 pt-4 border-t">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Otros reportes rápidos
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() =>
                    handleGenerateReport(
                      "Reporte de analytics completo en PDF",
                      ""
                    )
                  }
                  disabled={isLoading}
                  className="w-full text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition disabled:opacity-50 text-sm"
                >
                  <Download className="h-4 w-4 inline mr-2" />
                  Analytics Completo (PDF)
                </button>
                <button
                  onClick={() =>
                    handleGenerateReport("Ventas del último mes en Excel", "")
                  }
                  disabled={isLoading}
                  className="w-full text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition disabled:opacity-50 text-sm"
                >
                  <Download className="h-4 w-4 inline mr-2" />
                  Ventas Mensuales (Excel)
                </button>
                <button
                  onClick={() =>
                    handleGenerateReport(
                      "Carritos activos con items en CSV",
                      ""
                    )
                  }
                  disabled={isLoading}
                  className="w-full text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition disabled:opacity-50 text-sm"
                >
                  <Download className="h-4 w-4 inline mr-2" />
                  Carritos Activos (CSV)
                </button>
              </div>
            </div>
          </div>

          {/* Help */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Cómo funciona</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>1. Escribe o usa voz para describir tu reporte</li>
              <li>2. Selecciona el formato (PDF, Excel, CSV)</li>
              <li>3. Haz clic en "Generar Reporte"</li>
              <li>4. El archivo se descargará automáticamente</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
