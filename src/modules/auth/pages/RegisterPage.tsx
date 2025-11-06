import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus, CheckCircle } from "lucide-react";
import { authService } from "../services/auth.service";
import { PUBLIC_ROUTES } from "@/core/config/routes";
import { Button } from "@shared/components/ui/Button";
import { Input } from "@shared/components/ui/Input";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    nombre: "",
    apellido: "",
    telefono: "",
    password: "",
    password_confirm: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const validateForm = () => {
    if (!formData.email || !formData.nombre || !formData.apellido || !formData.password) {
      setError("Por favor, completa todos los campos requeridos");
      return false;
    }

    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return false;
    }

    if (formData.password !== formData.password_confirm) {
      setError("Las contraseñas no coinciden");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Por favor, ingresa un correo electrónico válido");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        email: formData.email,
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        password: formData.password,
        password_confirm: formData.password_confirm,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate(PUBLIC_ROUTES.LOGIN);
      }, 2000);
    } catch (err: any) {
      const errors = err.response?.data;
      if (errors?.email) {
        setError(errors.email[0] || "Este correo ya está registrado");
      } else if (errors?.password) {
        setError(errors.password[0] || "La contraseña no es válida");
      } else {
        setError("Error al registrarse. Por favor, intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Success Screen
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background-light via-background-main to-primary-light flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-display font-bold text-text-primary mb-4">
              ¡Registro Exitoso!
            </h2>
            <p className="text-text-secondary mb-6">
              Tu cuenta ha sido creada correctamente. Redirigiendo al inicio de sesión...
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-main"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Register Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-background-light via-background-main to-primary-light flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-main/10 rounded-full mb-4">
              <UserPlus className="w-8 h-8 text-primary-main" />
            </div>
            <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
              Crear cuenta
            </h1>
            <p className="text-text-secondary">
              Únete a SmartSales y descubre moda única
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre y Apellido - Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre"
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="María"
                required
                disabled={loading}
                autoComplete="given-name"
              />

              <Input
                label="Apellido"
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="García"
                required
                disabled={loading}
                autoComplete="family-name"
              />
            </div>

            {/* Email y Teléfono - Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Correo electrónico"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
                disabled={loading}
                autoComplete="email"
              />

              <Input
                label="Teléfono"
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="+591 75123456"
                disabled={loading}
                autoComplete="tel"
                helperText="Opcional"
              />
            </div>

            {/* Contraseñas - Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  autoComplete="new-password"
                  helperText="Mínimo 8 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-text-secondary hover:text-text-primary transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="Confirmar contraseña"
                  type={showConfirmPassword ? "text" : "password"}
                  name="password_confirm"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[38px] text-text-secondary hover:text-text-primary transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Términos y Condiciones */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                required
                className="w-4 h-4 mt-1 rounded border-neutral-light text-primary-main focus:ring-2 focus:ring-primary-main/50"
              />
              <label className="text-sm text-text-secondary">
                Acepto los{" "}
                <Link to="/terms" className="text-primary-main hover:text-accent-chocolate underline">
                  Términos de Servicio
                </Link>{" "}
                y la{" "}
                <Link to="/privacy" className="text-primary-main hover:text-accent-chocolate underline">
                  Política de Privacidad
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              size="lg"
              isLoading={loading}
            >
              Crear cuenta
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-text-secondary">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to={PUBLIC_ROUTES.LOGIN}
                className="text-primary-main hover:text-accent-chocolate transition-colors font-semibold"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
