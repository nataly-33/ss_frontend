import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@shared/components/ui/Button";

interface OrderFilterProps {
  onFilterChange: (filters: {
    estado?: string;
    fechaDesde?: string;
    fechaHasta?: string;
  }) => void;
}

export function OrderFilter({ onFilterChange }: OrderFilterProps) {
  const [estado, setEstado] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleApplyFilters = () => {
    onFilterChange({
      estado: estado || undefined,
      fechaDesde: fechaDesde || undefined,
      fechaHasta: fechaHasta || undefined,
    });
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    setEstado("");
    setFechaDesde("");
    setFechaHasta("");
    onFilterChange({});
  };

  const activeFiltersCount =
    (estado ? 1 : 0) + (fechaDesde ? 1 : 0) + (fechaHasta ? 1 : 0);

  return (
    <div className="relative">
      {/* Filter Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Filter className="w-4 h-4 mr-2" />
        Filtros
        {activeFiltersCount > 0 && (
          <span className="ml-2 bg-primary-main text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {activeFiltersCount}
          </span>
        )}
      </Button>

      {/* Filter Panel */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-neutral-200 z-50 p-6">
            <h3 className="text-lg font-display font-bold text-text-primary mb-4">
              Filtrar pedidos
            </h3>

            <div className="space-y-4">
              {/* Estado Filter */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Estado
                </label>
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-main/50 focus:border-primary-main"
                >
                  <option value="">Todos</option>
                  <option value="pendiente">Pendiente de pago</option>
                  <option value="pago_recibido">Pago recibido</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="preparando">Preparando</option>
                  <option value="enviado">Enviado</option>
                  <option value="entregado">Entregado</option>
                  <option value="cancelado">Cancelado</option>
                  <option value="reembolsado">Reembolsado</option>
                </select>
              </div>

              {/* Fecha Desde */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Desde
                </label>
                <input
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-main/50 focus:border-primary-main"
                />
              </div>

              {/* Fecha Hasta */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Hasta
                </label>
                <input
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-main/50 focus:border-primary-main"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-6 pt-4 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="flex-1"
              >
                Limpiar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleApplyFilters}
                className="flex-1"
              >
                Aplicar
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
