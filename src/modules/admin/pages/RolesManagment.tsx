import React, { useEffect, useState } from "react";
import { Plus, Shield, Edit, Trash2 } from "lucide-react";
import { Button } from "@shared/components/ui/Button";
import { rolesService } from "../services/admin.service";
import type { Role } from "../types";
import { PageHeader } from "../components";

export const RolesManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const data = await rolesService.getAll();
      setRoles(data);
    } catch (error) {
      console.error("Error loading roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (role: Role) => {
    if (role.es_rol_sistema) {
      alert("No se puede eliminar un rol del sistema");
      return;
    }

    if (!window.confirm(`¿Estás seguro de eliminar el rol "${role.nombre}"?`))
      return;

    try {
      await rolesService.delete(role.id);
      loadRoles();
    } catch (error) {
      console.error("Error deleting role:", error);
      alert("Error al eliminar rol");
    }
  };

  const handleEdit = (role: Role) => {
    // TODO: Open modal or navigate to edit page
    console.log("Edit role:", role);
  };

  return (
    <div className="p-8">
      <PageHeader
        title="Gestión de Roles y Permisos"
        description="Administra los roles y permisos del sistema"
        action={
          <Button variant="primary" size="lg">
            <Plus size={20} className="mr-2" />
            Nuevo Rol
          </Button>
        }
      />

      {/* Roles Grid */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div
              key={role.id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <Shield className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">
                      {role.nombre}
                    </h3>
                    {role.es_rol_sistema && (
                      <span className="text-xs text-neutral-500">
                        Rol del sistema
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                {role.descripcion || "Sin descripción"}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                <span className="text-sm text-neutral-600">
                  {role.permisos?.length || 0} permisos
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(role)}
                    className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  {!role.es_rol_sistema && (
                    <button
                      onClick={() => handleDelete(role)}
                      className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
