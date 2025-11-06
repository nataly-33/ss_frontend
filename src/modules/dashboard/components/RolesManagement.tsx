import React, { useEffect, useState } from "react";
import { api } from "@core/config/api.config";
import { Search, Plus, Edit2, Trash2, Shield, Lock } from "lucide-react";

interface Permission {
  id: string;
  nombre: string;
  codigo: string;
}

interface Role {
  id: string;
  nombre: string;
  descripcion: string;
  permisos: Permission[];
  usuarios_count?: number;
}

export const RolesManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const response = await api.get("/auth/roles/");
      setRoles(response.data.results || response.data);
    } catch (error) {
      console.error("Error loading roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roleId: string) => {
    if (!confirm("¿Estás seguro de eliminar este rol?")) return;

    try {
      await api.delete(`/auth/roles/${roleId}/`);
      setRoles(roles.filter((r) => r.id !== roleId));
    } catch (error) {
      console.error("Error deleting role:", error);
      alert("Error al eliminar rol");
    }
  };

  const filteredRoles = roles.filter((role) =>
    role.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-neutral-600">Cargando roles...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
          Gestión de Roles y Permisos
        </h1>
        <p className="text-neutral-600">
          Administra los roles y permisos del sistema
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <button
            onClick={() => alert("Funcionalidad en desarrollo")}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus size={20} />
            <span>Nuevo Rol</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRoles.map((role) => (
          <div
            key={role.id}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Shield size={24} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 text-lg">
                    {role.nombre}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {role.usuarios_count || 0} usuarios
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-neutral-600 mb-4">{role.descripcion}</p>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock size={16} className="text-neutral-500" />
                <span className="text-sm font-medium text-neutral-700">
                  Permisos ({role.permisos?.length || 0})
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {role.permisos?.slice(0, 5).map((permission) => (
                  <span
                    key={permission.id}
                    className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded"
                  >
                    {permission.nombre}
                  </span>
                ))}
                {(role.permisos?.length || 0) > 5 && (
                  <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded">
                    +{(role.permisos?.length || 0) - 5} más
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => alert("Funcionalidad en desarrollo")}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm border border-primary-300 text-primary-600 rounded-lg hover:bg-primary-50"
              >
                <Edit2 size={16} />
                Editar
              </button>
              <button
                onClick={() => handleDelete(role.id)}
                className="flex items-center justify-center px-3 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRoles.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-neutral-600">No se encontraron roles</p>
        </div>
      )}
    </div>
  );
};
