import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Wallet,
  MapPin,
  Package,
  Heart,
  Edit2,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@shared/components/ui/Button";
import { customersService } from "../services/customers.service";
import { ordersService } from "@/modules/orders/services/orders.service";
import type {
  CustomerProfile,
  Address,
  Favorite,
} from "../services/customers.service";
import type { Order } from "@/modules/orders/services/orders.service";

type TabType = "profile" | "addresses" | "orders" | "favorites";

export const ProfilePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>(
    (searchParams.get("tab") as TabType) || "profile"
  );

  // State
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit states
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    telefono: "",
    fecha_nacimiento: "",
    genero: "",
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  useEffect(() => {
    const tab = searchParams.get("tab") as TabType;
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      if (activeTab === "profile") {
        const profileData = await customersService.getProfile();
        setProfile(profileData);
        setProfileForm({
          telefono: profileData.telefono || "",
          fecha_nacimiento: profileData.fecha_nacimiento || "",
          genero: profileData.genero || "",
        });
      } else if (activeTab === "addresses") {
        const addressesData = await customersService.getAddresses();
        setAddresses(addressesData);
      } else if (activeTab === "orders") {
        const ordersData = await ordersService.getOrders();
        setOrders(ordersData);
      } else if (activeTab === "favorites") {
        const favoritesData = await customersService.getFavorites();
        setFavorites(favoritesData);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al cargar datos");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleUpdateProfile = async () => {
    if (!profile) return;

    try {
      setLoading(true);
      await customersService.updateProfile(profile.id, profileForm);
      await loadData();
      setEditingProfile(false);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al actualizar perfil");
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!window.confirm("¿Estás seguro de eliminar esta dirección?")) return;

    try {
      await customersService.deleteAddress(addressId);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al eliminar dirección");
      console.error("Error deleting address:", err);
    }
  };

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      await customersService.removeFavorite(favoriteId);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al eliminar favorito");
      console.error("Error removing favorite:", err);
    }
  };

  if (loading && !profile && !addresses.length && !orders.length) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "profile" as TabType, label: "Mi Perfil", icon: User },
    { id: "addresses" as TabType, label: "Direcciones", icon: MapPin },
    { id: "orders" as TabType, label: "Mis Pedidos", icon: Package },
    { id: "favorites" as TabType, label: "Favoritos", icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
            Mi Cuenta
          </h1>
          <p className="text-neutral-600">
            Gestiona tu información personal y preferencias
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-neutral-200">
            <div className="flex gap-6 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-primary-600 text-primary-600"
                        : "border-transparent text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {/* Profile Tab */}
          {activeTab === "profile" && profile && (
            <div className="space-y-6">
              {/* Profile Info */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
                      <User size={40} className="text-primary-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-900">
                        {profile.usuario.first_name} {profile.usuario.last_name}
                      </h2>
                      <p className="text-neutral-600">{profile.usuario.email}</p>
                    </div>
                  </div>
                  {!editingProfile && (
                    <Button
                      variant="outline"
                      onClick={() => setEditingProfile(true)}
                    >
                      <Edit2 size={18} className="mr-2" />
                      Editar
                    </Button>
                  )}
                </div>

                {editingProfile ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={profileForm.telefono}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, telefono: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                        placeholder="+591 12345678"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Fecha de Nacimiento
                      </label>
                      <input
                        type="date"
                        value={profileForm.fecha_nacimiento}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            fecha_nacimiento: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Género
                      </label>
                      <select
                        value={profileForm.genero}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, genero: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                      >
                        <option value="">Seleccionar</option>
                        <option value="F">Femenino</option>
                        <option value="M">Masculino</option>
                        <option value="O">Otro</option>
                      </select>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="primary"
                        onClick={handleUpdateProfile}
                        disabled={loading}
                      >
                        {loading ? "Guardando..." : "Guardar Cambios"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingProfile(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                      <Mail className="text-neutral-400" size={20} />
                      <div>
                        <p className="text-sm text-neutral-500">
                          Correo Electrónico
                        </p>
                        <p className="font-medium text-neutral-900">
                          {profile.usuario.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="text-neutral-400" size={20} />
                      <div>
                        <p className="text-sm text-neutral-500">Teléfono</p>
                        <p className="font-medium text-neutral-900">
                          {profile.telefono || "No registrado"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="text-neutral-400" size={20} />
                      <div>
                        <p className="text-sm text-neutral-500">
                          Fecha de Nacimiento
                        </p>
                        <p className="font-medium text-neutral-900">
                          {profile.fecha_nacimiento || "No registrada"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <User className="text-neutral-400" size={20} />
                      <div>
                        <p className="text-sm text-neutral-500">Género</p>
                        <p className="font-medium text-neutral-900">
                          {profile.genero === "F"
                            ? "Femenino"
                            : profile.genero === "M"
                            ? "Masculino"
                            : profile.genero === "O"
                            ? "Otro"
                            : "No especificado"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Wallet Card */}
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-sm p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Wallet size={24} />
                      <h3 className="text-lg font-semibold">
                        Billetera Virtual
                      </h3>
                    </div>
                    <p className="text-3xl font-bold mb-1">
                      ${profile.saldo_billetera.toFixed(2)}
                    </p>
                    <p className="text-white/80">Saldo disponible</p>
                  </div>
                  <Button variant="secondary" size="lg">
                    Recargar
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <div className="space-y-4">
              {addresses.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <MapPin size={48} className="text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    No tienes direcciones guardadas
                  </h3>
                  <p className="text-neutral-600 mb-6">
                    Agrega una dirección para facilitar tus compras
                  </p>
                  <Button variant="primary">
                    <Plus size={20} className="mr-2" />
                    Agregar Dirección
                  </Button>
                </div>
              ) : (
                <>
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="bg-white rounded-xl shadow-sm p-6"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-neutral-900">
                              {addr.calle} {addr.numero_exterior}
                              {addr.numero_interior && ` Int. ${addr.numero_interior}`}
                            </h3>
                            {addr.es_principal && (
                              <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                                Principal
                              </span>
                            )}
                          </div>
                          <p className="text-neutral-600 mb-1">
                            {addr.colonia}, {addr.ciudad}
                          </p>
                          <p className="text-neutral-600">
                            {addr.estado}, CP: {addr.codigo_postal}
                          </p>
                          <p className="text-neutral-600">{addr.pais}</p>
                          {addr.referencias && (
                            <p className="text-sm text-neutral-500 mt-2">
                              Referencias: {addr.referencias}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button className="w-full bg-white rounded-xl shadow-sm p-6 border-2 border-dashed border-neutral-300 hover:border-neutral-400 transition-colors">
                    <div className="flex items-center justify-center gap-2 text-neutral-600 hover:text-neutral-900">
                      <Plus size={20} />
                      <span className="font-medium">Agregar nueva dirección</span>
                    </div>
                  </button>
                </>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <Package size={48} className="text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    No tienes pedidos aún
                  </h3>
                  <p className="text-neutral-600 mb-6">
                    Realiza tu primera compra y aparecerá aquí
                  </p>
                  <Button variant="primary" onClick={() => (window.location.href = "/products")}>
                    Explorar Productos
                  </Button>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl shadow-sm p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-900">
                          Pedido #{order.numero_pedido}
                        </h3>
                        <p className="text-sm text-neutral-600">
                          {new Date(order.fecha_creacion).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.estado === "entregado"
                            ? "bg-green-100 text-green-700"
                            : order.estado === "cancelado"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.estado}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      {order.items.slice(0, 2).map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <img
                            src={
                              item.prenda.imagen_principal ||
                              "/images/placeholder.jpg"
                            }
                            alt={item.prenda.nombre}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium text-neutral-900">
                              {item.prenda.nombre}
                            </p>
                            <p className="text-sm text-neutral-600">
                              Talla: {item.talla.nombre} • Cant: {item.cantidad}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-sm text-neutral-500">
                          +{order.items.length - 2} producto(s) más
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                      <p className="text-lg font-semibold text-neutral-900">
                        Total: ${order.total.toFixed(2)}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          (window.location.href = `/orders/${order.id}`)
                        }
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === "favorites" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.length === 0 ? (
                <div className="col-span-full bg-white rounded-xl shadow-sm p-12 text-center">
                  <Heart size={48} className="text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    No tienes favoritos
                  </h3>
                  <p className="text-neutral-600 mb-6">
                    Guarda tus productos favoritos para encontrarlos fácilmente
                  </p>
                  <Button variant="primary" onClick={() => (window.location.href = "/products")}>
                    Explorar Productos
                  </Button>
                </div>
              ) : (
                favorites.map((fav) => (
                  <div
                    key={fav.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden group"
                  >
                    <div className="relative">
                      <img
                        src={
                          fav.prenda.imagen_principal ||
                          "/images/placeholder.jpg"
                        }
                        alt={fav.prenda.nombre}
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={() => handleRemoveFavorite(fav.id)}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-red-50 transition-colors"
                      >
                        <Heart
                          size={20}
                          className="text-red-600 fill-red-600"
                        />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-neutral-900 mb-1">
                        {fav.prenda.nombre}
                      </h3>
                      <p className="text-lg font-bold text-primary-600 mb-3">
                        ${fav.prenda.precio.toFixed(2)}
                      </p>
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full"
                        onClick={() =>
                          (window.location.href = `/products/${fav.prenda.slug}`)
                        }
                      >
                        Ver Producto
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
