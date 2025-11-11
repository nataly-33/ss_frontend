import React, { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@shared/components/ui/Button";

interface Settings {
  store_name: string;
  store_description: string;
  store_phone: string;
  store_email: string;
  store_address: string;
  store_city: string;
  store_country: string;
  store_currency: string;
  maintenance_mode: boolean;
  allow_registrations: boolean;
  require_email_verification: boolean;
  default_shipping_cost: number;
  max_upload_size: number;
}

export const SettingsManagement: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    store_name: "Smart Sales",
    store_description: "Tienda de ropa y accesorios",
    store_phone: "+34 123 456 789",
    store_email: "info@smartsales.com",
    store_address: "Calle Principal 123",
    store_city: "Madrid",
    store_country: "España",
    store_currency: "EUR",
    maintenance_mode: false,
    allow_registrations: true,
    require_email_verification: false,
    default_shipping_cost: 5.99,
    max_upload_size: 5, // MB
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, type, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setSettings({
      ...settings,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseFloat(value)
          : value,
    });
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // TODO: Implementar endpoint de configuración en el backend
      console.log("Saving settings:", settings);

      // Simular guardado
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Error al guardar la configuración");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {saved && (
        <div className="p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg flex items-center gap-2">
          ✓ Configuración guardada correctamente
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Store Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">
              Información de la Tienda
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Nombre de la Tienda
                </label>
                <input
                  type="text"
                  name="store_name"
                  value={settings.store_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Descripción
                </label>
                <textarea
                  name="store_description"
                  value={settings.store_description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="store_phone"
                    value={settings.store_phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="store_email"
                    value={settings.store_email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  name="store_address"
                  value={settings.store_address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    name="store_city"
                    value={settings.store_city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    País
                  </label>
                  <input
                    type="text"
                    name="store_country"
                    value={settings.store_country}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Moneda
                </label>
                <select
                  name="store_currency"
                  value={settings.store_currency}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                >
                  <option value="EUR">Euro (€)</option>
                  <option value="USD">Dólar ($)</option>
                  <option value="GBP">Libra esterlina (£)</option>
                  <option value="MXN">Peso mexicano ($)</option>
                </select>
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">
              Configuración del Sistema
            </h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="maintenance_mode"
                  checked={settings.maintenance_mode}
                  onChange={handleChange}
                  className="rounded border-neutral-300"
                />
                <div>
                  <span className="text-sm font-medium text-neutral-700">
                    Modo de Mantenimiento
                  </span>
                  <p className="text-xs text-neutral-500">
                    Desactiva la tienda para realizar mantenimiento
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="allow_registrations"
                  checked={settings.allow_registrations}
                  onChange={handleChange}
                  className="rounded border-neutral-300"
                />
                <div>
                  <span className="text-sm font-medium text-neutral-700">
                    Permitir Registros
                  </span>
                  <p className="text-xs text-neutral-500">
                    Permite que nuevos usuarios se registren
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="require_email_verification"
                  checked={settings.require_email_verification}
                  onChange={handleChange}
                  className="rounded border-neutral-300"
                />
                <div>
                  <span className="text-sm font-medium text-neutral-700">
                    Verificación de Email
                  </span>
                  <p className="text-xs text-neutral-500">
                    Requiere verificación de email en registro
                  </p>
                </div>
              </label>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Costo de Envío por Defecto (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="default_shipping_cost"
                  value={settings.default_shipping_cost}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Tamaño Máximo de Carga (MB)
                </label>
                <input
                  type="number"
                  name="max_upload_size"
                  value={settings.max_upload_size}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Save Button */}
          <div className="bg-accent-cream rounded-xl shadow-sm p-6 sticky top-8">
            <Button
              onClick={handleSave}
              disabled={loading}
              variant="primary"
              className="w-full flex items-center justify-center gap-2"
            >
              <Save size={20} />
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
