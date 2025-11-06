import type { Address } from "../types";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@shared/components/ui/Button";
import { Input } from "@shared/components/ui/Input";

interface AddressFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Address>) => Promise<void>;
  address?: Address | null;
}

const initialFormData = {
  calle: "",
  numero_exterior: "",
  numero_interior: "",
  colonia: "",
  ciudad: "",
  estado: "",
  codigo_postal: "",
  pais: "Bolivia",
  referencias: "",
  es_principal: false,
};

export function AddressForm({ isOpen, onClose, onSave, address }: AddressFormProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (address) {
      setFormData({
        calle: address.calle,
        numero_exterior: address.numero_exterior,
        numero_interior: address.numero_interior || "",
        colonia: address.colonia,
        ciudad: address.ciudad,
        estado: address.estado,
        codigo_postal: address.codigo_postal,
        pais: address.pais,
        referencias: address.referencias || "",
        es_principal: address.es_principal,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [address, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await onSave(formData);
      onClose();
      setFormData(initialFormData);
    } catch (error) {
      console.error("Error saving address:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-display font-bold text-text-primary">
            {address ? "Editar Dirección" : "Nueva Dirección"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Calle *"
                type="text"
                name="calle"
                value={formData.calle}
                onChange={handleChange}
                placeholder="Av. 16 de Julio"
                required
              />
            </div>
            <Input
              label="N° Exterior *"
              type="text"
              name="numero_exterior"
              value={formData.numero_exterior}
              onChange={handleChange}
              placeholder="1234"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="N° Interior"
              type="text"
              name="numero_interior"
              value={formData.numero_interior}
              onChange={handleChange}
              placeholder="Depto 5A (opcional)"
            />
            <Input
              label="Colonia/Zona *"
              type="text"
              name="colonia"
              value={formData.colonia}
              onChange={handleChange}
              placeholder="Sopocachi"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Ciudad *"
              type="text"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              placeholder="La Paz"
              required
            />
            <Input
              label="Estado/Departamento *"
              type="text"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              placeholder="La Paz"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Código Postal *"
              type="text"
              name="codigo_postal"
              value={formData.codigo_postal}
              onChange={handleChange}
              placeholder="00000"
              required
            />
            <Input
              label="País"
              type="text"
              name="pais"
              value={formData.pais}
              onChange={handleChange}
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Referencias
            </label>
            <textarea
              name="referencias"
              value={formData.referencias}
              onChange={handleChange}
              rows={3}
              placeholder="Casa esquina, portón azul, entre calle A y B..."
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-main/50 focus:border-primary-main"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="es_principal"
              name="es_principal"
              checked={formData.es_principal}
              onChange={handleChange}
              className="w-4 h-4 text-primary-main rounded focus:ring-primary-main"
            />
            <label htmlFor="es_principal" className="text-sm text-text-secondary">
              Establecer como dirección principal
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
            >
              {address ? "Guardar cambios" : "Crear dirección"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
