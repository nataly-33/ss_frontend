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
    nombre: profile.usuario.first_name,
    apellido: profile.usuario.last_name,
    telefono: profile.telefono || "",
    fecha_nacimiento: profile.fecha_nacimiento || "",
    genero: profile.genero || "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        fecha_nacimiento: formData.fecha_nacimiento || undefined,
        genero: formData.genero || undefined,
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
            value={profile.usuario.email}
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

        {/* Información Adicional */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Fecha de Nacimiento"
            type="date"
            name="fecha_nacimiento"
            value={formData.fecha_nacimiento}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Género
            </label>
            <select
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              disabled={!isEditing}
              className={`
                w-full px-4 py-2 border rounded-lg
                focus:ring-2 focus:ring-primary-main/50 focus:border-primary-main
                ${!isEditing ? 'bg-neutral-100 cursor-not-allowed' : 'bg-white'}
              `}
            >
              <option value="">Seleccionar...</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
              <option value="O">Otro</option>
            </select>
          </div>
        </div>

        {/* Saldo de Billetera (Solo lectura) */}
        <div className="p-4 bg-primary-light rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Saldo en Billetera</p>
              <p className="text-2xl font-display font-bold text-primary-main">
                ${profile.saldo_billetera.toFixed(2)}
              </p>
            </div>
            <Button variant="outline" size="sm" type="button">
              Recargar
            </Button>
          </div>
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
                  nombre: profile.usuario.first_name,
                  apellido: profile.usuario.last_name,
                  telefono: profile.telefono || "",
                  fecha_nacimiento: profile.fecha_nacimiento || "",
                  genero: profile.genero || "",
                });
              }}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
            >
              Guardar cambios
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
