import React, { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, Wallet, Edit2 } from "lucide-react";
import { useAuthStore } from "@core/store/auth.store";
import { Button } from "@shared/components/ui/Button";
import api from "@core/config/api.config";

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/customers/profile/me/");
      setProfile(response.data);
      updateUser(response.data);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-display font-bold text-neutral-900 mb-8">
          Mi Perfil
        </h1>

        <div className="grid gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
                  <User size={40} className="text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">
                    {user?.nombre_completo}
                  </h2>
                  <p className="text-neutral-600">{user?.email}</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => setEditMode(!editMode)}>
                <Edit2 size={18} className="mr-2" />
                Editar
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <Mail className="text-neutral-400" size={20} />
                <div>
                  <p className="text-sm text-neutral-500">Correo Electrónico</p>
                  <p className="font-medium text-neutral-900">
                    {profile?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="text-neutral-400" size={20} />
                <div>
                  <p className="text-sm text-neutral-500">Teléfono</p>
                  <p className="font-medium text-neutral-900">
                    {profile?.telefono || "No registrado"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Wallet className="text-neutral-400" size={20} />
                <div>
                  <p className="text-sm text-neutral-500">Billetera Virtual</p>
                  <p className="font-medium text-primary-600">
                    ${profile?.saldo_billetera || 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="text-neutral-400" size={20} />
                <div>
                  <p className="text-sm text-neutral-500">Direcciones</p>
                  <p className="font-medium text-neutral-900">
                    {profile?.direccion_principal?.ciudad || "No registrada"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm text-neutral-500 mb-2">Total de Compras</p>
              <p className="text-3xl font-bold text-neutral-900">
                {profile?.total_compras || 0}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm text-neutral-500 mb-2">Favoritos</p>
              <p className="text-3xl font-bold text-neutral-900">
                {profile?.total_favoritos || 0}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm text-neutral-500 mb-2">Recompensas</p>
              <p className="text-3xl font-bold text-primary-600">0 pts</p>
            </div>
          </div>

          {/* Wallet Actions */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  Billetera Virtual
                </h3>
                <p className="text-white/80">
                  Recarga tu billetera y obtén beneficios exclusivos
                </p>
              </div>
              <Button variant="secondary" size="lg">
                Recargar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
