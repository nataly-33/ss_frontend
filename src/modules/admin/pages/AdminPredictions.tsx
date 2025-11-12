/**
 *  Página de Predicciones de IA
 *
 * Dashboard completo con:
 * - Gráfica de línea (histórico + predicciones)
 * - Gráfica de barras por categoría
 * - Tarjetas con métricas clave
 * - Tabla de predicciones detalladas
 * - Botón para generar nuevas predicciones
 */

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Calendar,
  Target,
  AlertCircle,
  CheckCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import aiService from "../services/ai.service";
import type {
  DashboardResponse,
  PredictionByCategory,
} from "../services/ai.service";

// 🎨 Tooltip personalizado para gráficos
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-700">{entry.name}:</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {typeof entry.value === "number"
                ? aiService.formatNumber(entry.value)
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const AdminPredictions: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [monthsBack, setMonthsBack] = useState(24); // 24 meses por defecto
  const [monthsForward, setMonthsForward] = useState(3);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0); // Para carrusel

  // Cargar dashboard (con dependencias correctas)
  const loadDashboard = async (historic?: number, prediction?: number) => {
    try {
      setLoading(true);
      setError(null);
      const histMonths = historic !== undefined ? historic : monthsBack;
      const predMonths = prediction !== undefined ? prediction : monthsForward;
      const data = await aiService.getDashboard(histMonths, predMonths);
      setDashboard(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar el dashboard");
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  // Generar nuevas predicciones
  const handleGeneratePredictions = async () => {
    try {
      setGenerating(true);
      setError(null);
      await aiService.generatePredictions(monthsForward);
      // Recargar dashboard con las nuevas predicciones
      await loadDashboard();
      alert(" Predicciones generadas exitosamente");
    } catch (err: any) {
      setError(err.message || "Error al generar predicciones");
      alert(" Error al generar predicciones");
      console.error("Error generating predictions:", err);
    } finally {
      setGenerating(false);
    }
  };

  // Manejar cambio de filtro histórico
  const handleHistoricFilterChange = async (months: number) => {
    setMonthsBack(months);
    setCurrentMonthIndex(0); // Reset carrusel
    await loadDashboard(months, monthsForward);
  };

  // Manejar cambio de filtro de predicción
  const handlePredictionFilterChange = async (months: number) => {
    setMonthsForward(months);
    setCurrentMonthIndex(0); // Reset carrusel
    await loadDashboard(monthsBack, months);
  };

  useEffect(() => {
    loadDashboard();
  }, []); // Solo cargar una vez al montar

  // Preparar datos para gráfica combinada (histórico + predicciones)
  const getCombinedChartData = () => {
    if (!dashboard) return [];

    const allData = [];

    // Datos históricos
    dashboard.historical.forEach((item) => {
      allData.push({
        periodo: aiService.formatPeriodo(item.periodo),
        Histórico: item.cantidad_vendida,
        Predicción: null,
      });
    });

    // Agregar el último punto histórico como inicio de predicciones para conectar
    if (dashboard.historical.length > 0 && dashboard.predictions.length > 0) {
      const lastHistorical =
        dashboard.historical[dashboard.historical.length - 1];
      allData.push({
        periodo: aiService.formatPeriodo(lastHistorical.periodo),
        Histórico: null,
        Predicción: lastHistorical.cantidad_vendida, // Usar el último valor histórico
      });
    }

    // Datos de predicciones
    dashboard.predictions.forEach((item) => {
      allData.push({
        periodo: aiService.formatPeriodo(item.periodo),
        Histórico: null,
        Predicción: Math.round(item.ventas_predichas),
      });
    });

    return allData;
  };

  // Preparar datos para gráfica por categoría (AGRUPADOS POR MES)
  const getCategoryChartData = () => {
    if (!dashboard) return [];

    // Agrupar predicciones por período
    const groupedByPeriod: Record<string, any> = {};

    dashboard.predictions_by_category.forEach((pred) => {
      const periodo = aiService.formatPeriodo(pred.periodo);
      if (!groupedByPeriod[periodo]) {
        groupedByPeriod[periodo] = { periodo };
      }
      groupedByPeriod[periodo][pred.categoria] = Math.round(
        pred.ventas_predichas
      );
    });

    return Object.values(groupedByPeriod);
  };

  // Calcular métricas clave
  const getKeyMetrics = () => {
    if (!dashboard || dashboard.predictions.length === 0) {
      return {
        totalPredicted: 0,
        avgPredicted: 0,
        growth: 0,
        confidence: "Media" as const,
      };
    }

    // ✅ CORREGIDO: Total predicho suma TODAS las categorías en TODOS los meses
    const totalPredicted = dashboard.predictions_by_category.reduce(
      (sum, pred) => sum + pred.ventas_predichas,
      0
    );

    // Promedio mensual = total / número de meses predichos
    const numMonths = monthsForward;
    const avgPredicted = totalPredicted / numMonths;

    // Calcular crecimiento (comparar último mes histórico vs promedio de predicciones)
    const lastHistorical =
      dashboard.historical[dashboard.historical.length - 1]?.cantidad_vendida ||
      0;
    const growth = aiService.calculateGrowth(avgPredicted, lastHistorical);

    // Confianza basada en R² del modelo
    const r2 = dashboard.model_info.r2_score;
    let confidence: "Alta" | "Media" | "Baja" = "Media";
    if (r2 >= 0.8) confidence = "Alta";
    else if (r2 < 0.6) confidence = "Baja";

    return { totalPredicted, avgPredicted, growth, confidence };
  };

  const metrics = dashboard ? getKeyMetrics() : null;

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6"></div>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-gray-600">Cargando predicciones...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-6"></div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
          <button
            onClick={() => loadDashboard()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header 
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Predicciones de IA</h1>
        <div className="text-sm text-gray-500 mt-1">Admin / Predicciones</div>
      </div>*/}

      <div className="space-y-6">
        {/* Header con controles */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Brain className="w-7 h-7 text-primary-600" />
                Dashboard de Predicciones
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Modelo activo: {dashboard?.model_info.version} • R² Score:{" "}
                {(dashboard?.model_info.r2_score * 100).toFixed(2)}%
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Selector de períodos */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Histórico:</label>
                <select
                  value={monthsBack}
                  onChange={(e) =>
                    handleHistoricFilterChange(Number(e.target.value))
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value={6}>6 meses</option>
                  <option value={12}>12 meses</option>
                  <option value={24}>24 meses (2 años)</option>
                  <option value={34}>34 meses (hasta Sep 2025)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Predicción:</label>
                <select
                  value={monthsForward}
                  onChange={(e) =>
                    handlePredictionFilterChange(Number(e.target.value))
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value={3}>3 meses</option>
                  <option value={6}>6 meses</option>
                  <option value={12}>12 meses</option>
                </select>
              </div>

              {/* Botón generar predicciones */}
              <button
                onClick={handleGeneratePredictions}
                disabled={generating}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generar Predicciones
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tarjetas de métricas */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total predicho */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Predicho</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {aiService.formatNumber(metrics.totalPredicted)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">unidades</p>
                </div>
                <Target className="w-10 h-10 text-blue-600 opacity-20" />
              </div>
            </div>

            {/* Promedio mensual */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Promedio Mensual</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {aiService.formatNumber(metrics.avgPredicted)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">unidades/mes</p>
                </div>
                <Calendar className="w-10 h-10 text-purple-600 opacity-20" />
              </div>
            </div>

            {/* Tendencia */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tendencia</p>
                  <p
                    className={`text-2xl font-bold mt-1 ${aiService.getGrowthColor(
                      metrics.growth
                    )}`}
                  >
                    {metrics.growth > 0 ? "+" : ""}
                    {metrics.growth.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">vs último mes</p>
                </div>
                {metrics.growth >= 0 ? (
                  <TrendingUp className="w-10 h-10 text-green-600 opacity-20" />
                ) : (
                  <TrendingDown className="w-10 h-10 text-red-600 opacity-20" />
                )}
              </div>
            </div>

            {/* Confianza */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Confianza</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {metrics.confidence}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    R² = {(dashboard.model_info.r2_score * 100).toFixed(1)}%
                  </p>
                </div>
                <CheckCircle
                  className={`w-10 h-10 opacity-20 ${
                    metrics.confidence === "Alta"
                      ? "text-green-600"
                      : metrics.confidence === "Media"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Gráfica principal: Histórico + Predicciones */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ventas Históricas y Predicciones
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={getCombinedChartData()}>
              <defs>
                <linearGradient id="colorHistorico" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient
                  id="colorPrediccion"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="periodo"
                tick={{ fontSize: 12 }}
                stroke="#6B7280"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#6B7280"
                label={{
                  value: "Unidades Vendidas",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: "14px", paddingTop: "10px" }}
                iconType="rect"
              />
              <Area
                type="monotone"
                dataKey="Histórico"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorHistorico)"
                name="Histórico"
                connectNulls={false}
              />
              <Area
                type="monotone"
                dataKey="Predicción"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPrediccion)"
                name="Predicción"
                strokeDasharray="5 5"
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-gray-600">
            <p>
              <span className="inline-block w-3 h-3 bg-blue-500 mr-2"></span>
              Área azul: Datos históricos reales de ventas
            </p>
            <p className="mt-1">
              <span className="inline-block w-3 h-3 bg-green-500 mr-2"></span>
              Área verde (línea punteada): Predicciones del modelo de IA
            </p>
          </div>
        </div>

        {/* Gráfica por categoría con carrusel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Predicciones por Categoría
            </h3>
            {getCategoryChartData().length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentMonthIndex(Math.max(0, currentMonthIndex - 1))
                  }
                  disabled={currentMonthIndex === 0}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-600 min-w-[120px] text-center">
                  {getCategoryChartData()[currentMonthIndex]?.periodo || ""}
                </span>
                <button
                  onClick={() =>
                    setCurrentMonthIndex(
                      Math.min(
                        getCategoryChartData().length - 1,
                        currentMonthIndex + 1
                      )
                    )
                  }
                  disabled={
                    currentMonthIndex === getCategoryChartData().length - 1
                  }
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={[getCategoryChartData()[currentMonthIndex]].filter(Boolean)}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="periodo"
                tick={{ fontSize: 12 }}
                stroke="#6B7280"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#6B7280"
                label={{
                  value: "Unidades Predichas",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "14px" }} iconType="rect" />
              <Bar
                dataKey="Blusas"
                fill="#F59E0B"
                radius={[8, 8, 0, 0]}
                label={{ position: "top" }}
              />
              <Bar
                dataKey="Vestidos"
                fill="#EC4899"
                radius={[8, 8, 0, 0]}
                label={{ position: "top" }}
              />
              <Bar
                dataKey="Jeans"
                fill="#3B82F6"
                radius={[8, 8, 0, 0]}
                label={{ position: "top" }}
              />
              <Bar
                dataKey="Jackets"
                fill="#8B5CF6"
                radius={[8, 8, 0, 0]}
                label={{ position: "top" }}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            {["Blusas", "Vestidos", "Jeans", "Jackets"].map((cat, idx) => {
              const colors = ["#F59E0B", "#EC4899", "#3B82F6", "#8B5CF6"];
              const value =
                getCategoryChartData()[currentMonthIndex]?.[cat] || 0;
              return (
                <div
                  key={cat}
                  className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors[idx] }}
                  ></div>
                  <span className="text-gray-700">{cat}:</span>
                  <span className="font-semibold text-gray-900">
                    {aiService.formatNumber(value)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabla de predicciones detalladas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Predicciones Detalladas por Categoría
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Categoría
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Predicción
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                    Confianza
                  </th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  // Agrupar predicciones por período
                  const groupedByPeriod: Record<
                    string,
                    typeof dashboard.predictions_by_category
                  > = {};
                  dashboard?.predictions_by_category.forEach((pred) => {
                    if (!groupedByPeriod[pred.periodo]) {
                      groupedByPeriod[pred.periodo] = [];
                    }
                    groupedByPeriod[pred.periodo].push(pred);
                  });

                  // Renderizar cada grupo
                  return Object.entries(groupedByPeriod).map(
                    ([periodo, predictions], groupIndex) => (
                      <React.Fragment key={periodo}>
                        {/* Subtítulo del mes */}
                        <tr>
                          <td
                            colSpan={3}
                            className={`py-3 px-4 font-semibold text-gray-900 bg-blue-50 border-t-2 ${
                              groupIndex === 0
                                ? "border-t-gray-300"
                                : "border-t-gray-200"
                            }`}
                          >
                            {aiService.formatPeriodo(periodo)}
                          </td>
                        </tr>
                        {/* Filas de categorías */}
                        {predictions.map((pred) => (
                          <tr
                            key={pred.prediccion_id}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-3 px-4 text-sm text-gray-900 pl-8">
                              {pred.categoria}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-900 text-right font-semibold">
                              {aiService.formatNumber(pred.ventas_predichas)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${aiService.getConfidenceColor(
                                  pred.confianza
                                )}`}
                              >
                                {pred.confianza}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    )
                  );
                })()}
              </tbody>
            </table>
          </div>
        </div>

        {/* Información del modelo */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Información del Modelo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Versión:</span>
              <span className="ml-2 font-medium text-gray-900">
                {dashboard?.model_info.version}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Entrenado:</span>
              <span className="ml-2 font-medium text-gray-900">
                {new Date(
                  dashboard?.model_info.trained_at || ""
                ).toLocaleDateString("es-ES")}
              </span>
            </div>
            <div>
              <span className="text-gray-600">MAE:</span>
              <span className="ml-2 font-medium text-gray-900">
                {dashboard?.model_info.mae.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPredictions;
