import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@shared/components/ui/Button";
import { Input } from "@shared/components/ui/Input";

interface SecuritySettingsProps {
  onChangePassword: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
}

export function SecuritySettings({ onChangePassword }: SecuritySettingsProps) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isChanging, setIsChanging] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "La contraseña actual es requerida";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "La nueva contraseña es requerida";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "La contraseña debe tener al menos 8 caracteres";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu nueva contraseña";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = "La nueva contraseña debe ser diferente a la actual";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    if (!validateForm()) return;

    setIsChanging(true);

    try {
      await onChangePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setSuccess(true);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      setErrors({
        currentPassword: error.response?.data?.message || "Error al cambiar la contraseña",
      });
    } finally {
      setIsChanging(false);
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary-light rounded-full">
          <Lock className="w-6 h-6 text-primary-main" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-text-primary">
            Seguridad
          </h2>
          <p className="text-sm text-text-secondary">
            Cambia tu contraseña para mantener tu cuenta segura
          </p>
        </div>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 font-medium">
            ✓ Contraseña actualizada exitosamente
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Contraseña Actual */}
        <div className="relative">
          <Input
            label="Contraseña actual *"
            type={showPasswords.current ? "text" : "password"}
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="Ingresa tu contraseña actual"
            error={errors.currentPassword}
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility("current")}
            className="absolute right-3 top-9 text-neutral-500 hover:text-neutral-700"
          >
            {showPasswords.current ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="border-t pt-5">
          <p className="text-sm font-semibold text-text-primary mb-4">
            Nueva contraseña
          </p>

          {/* Nueva Contraseña */}
          <div className="relative mb-4">
            <Input
              label="Nueva contraseña *"
              type={showPasswords.new ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Mínimo 8 caracteres"
              error={errors.newPassword}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("new")}
              className="absolute right-3 top-9 text-neutral-500 hover:text-neutral-700"
            >
              {showPasswords.new ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Confirmar Contraseña */}
          <div className="relative">
            <Input
              label="Confirmar nueva contraseña *"
              type={showPasswords.confirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repite tu nueva contraseña"
              error={errors.confirmPassword}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirm")}
              className="absolute right-3 top-9 text-neutral-500 hover:text-neutral-700"
            >
              {showPasswords.confirm ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Recomendaciones */}
        <div className="bg-neutral-50 rounded-lg p-4">
          <p className="text-sm font-semibold text-text-primary mb-2">
            Recomendaciones para una contraseña segura:
          </p>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>• Mínimo 8 caracteres</li>
            <li>• Combina letras mayúsculas y minúsculas</li>
            <li>• Incluye números y símbolos</li>
            <li>• No uses información personal</li>
          </ul>
        </div>

        {/* Botón */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            isLoading={isChanging}
          >
            Cambiar contraseña
          </Button>
        </div>
      </form>
    </div>
  );
}
