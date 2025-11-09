import type { CustomerProfile } from "../types";
import { useState } from "react";
import { Button } from "@shared/components/ui/Button";
import { Input } from "@shared/components/ui/Input";

interface ProfileFormProps {
  profile: CustomerProfile;
  onSave: (data: Partial<CustomerProfile>) => Promise<void>;
}

export function ProfileForm({ profile, onSave }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    nombre: profile.nombre,
    apellido: profile.apellido,
    telefono: profile.telefono || "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await onSave({
        telefono: formData.telefono,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display font-bold text-text-primary">
          Datos Personales
        </h2>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            Editar
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información del Usuario (Solo lectura) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre"
            type="text"
            value={formData.nombre}
            disabled
            helperText="Para cambiar tu nombre, contacta soporte"
          />

          <Input
            label="Apellido"
            type="text"
            value={formData.apellido}
            disabled
            helperText="Para cambiar tu apellido, contacta soporte"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Correo electrónico"
            type="email"
            value={profile.email}
            disabled
            helperText="Para cambiar tu email, contacta soporte"
          />

          <Input
            label="Teléfono"
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="+591 75123456"
            disabled={!isEditing}
          />
        </div>

        {/* Botones de Acción */}
        {isEditing && (
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsEditing(false);
                // Reset form
                setFormData({
                  nombre: profile.nombre,
                  apellido: profile.apellido,
                  telefono: profile.telefono || "",
                });
              }}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              Guardar cambios
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
