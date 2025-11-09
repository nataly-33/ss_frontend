/**
 * ReportsPage
 *
 * Página principal para generar reportes dinámicos desde prompts de texto o voz
 */

import React, { useState } from 'react';
import { FileText, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { ReportPromptInput } from '../components/ReportPromptInput';
import { reportsService } from '../services/reports.service';

export const ReportsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleGenerateReport = async (prompt: string, format: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Generar reporte
      const blob = await reportsService.generateFromPrompt(prompt);

      // Descargar archivo
      const filename = reportsService.generateFilename(prompt, format);
      reportsService.downloadBlob(blob, filename);

      setSuccess(`Reporte "${filename}" generado y descargado exitosamente`);
    } catch (err: any) {
      console.error('Error al generar reporte:', err);
      setError(
        err.response?.data?.error ||
          'Error al generar el reporte. Verifica tu prompt e intenta de nuevo.'
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
              Reportes Rápidos
            </h2>
            <div className="space-y-2">
              <button
                onClick={() =>
                  handleGenerateReport(
                    'Reporte de analytics completo en PDF',
                    'pdf'
                  )
                }
                disabled={isLoading}
                className="w-full text-left px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition disabled:opacity-50"
              >
                <Download className="h-4 w-4 inline mr-2" />
                Analytics Completo (PDF)
              </button>
              <button
                onClick={() =>
                  handleGenerateReport(
                    'Ventas del último mes en Excel',
                    'excel'
                  )
                }
                disabled={isLoading}
                className="w-full text-left px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition disabled:opacity-50"
              >
                <Download className="h-4 w-4 inline mr-2" />
                Ventas Mensuales (Excel)
              </button>
              <button
                onClick={() =>
                  handleGenerateReport(
                    'Productos más vendidos en CSV',
                    'csv'
                  )
                }
                disabled={isLoading}
                className="w-full text-left px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition disabled:opacity-50"
              >
                <Download className="h-4 w-4 inline mr-2" />
                Top Productos (CSV)
              </button>
            </div>
          </div>

          {/* Help */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              Cómo funciona
            </h3>
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
