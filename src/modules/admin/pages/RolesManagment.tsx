import React, { useEffect, useState } from "react";
import { Plus, Shield, Edit, Trash2 } from "lucide-react";
import { Button } from "@shared/components/ui/Button";
import { rolesService } from "../services/admin.service";
import type { Role, Permission } from "../types";
import { PageHeader } from "../components";

export const RolesManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    permisos_ids: [] as string[],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rolesData, permsData] = await Promise.all([
        rolesService.getAll(),
        rolesService.getPermissions(),
      ]);
      setRoles(rolesData);
      setPermissions(permsData);
    } catch (error) {
      console.error("Error loading data:", error);
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
      loadData();
    } catch (error) {
      console.error("Error deleting role:", error);
      alert("Error al eliminar rol");
    }
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      nombre: role.nombre,
      descripcion: role.descripcion,
      permisos_ids: role.permisos?.map((p) => p.id) || [],
    });
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingRole(null);
    setFormData({
      nombre: "",
      descripcion: "",
      permisos_ids: [],
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingRole) {
        await rolesService.update(editingRole.id, formData);
      } else {
        await rolesService.create(formData);
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      console.error("Error saving role:", error);
      alert("Error al guardar rol");
    }
  };

  const togglePermission = (permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      permisos_ids: prev.permisos_ids.includes(permissionId)
        ? prev.permisos_ids.filter((id) => id !== permissionId)
        : [...prev.permisos_ids, permissionId],
    }));
  };

  return (
    <div className="p-8">
      <PageHeader
        title="Gestión de Roles y Permisos"
        description="Administra los roles y permisos del sistema"
        action={
          <Button variant="primary" size="lg" onClick={handleCreate}>
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

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">
              {editingRole ? "Editar Rol" : "Nuevo Rol"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Nombre del Rol
                </label>
                <input
                  type="text"
                  required
                  disabled={editingRole?.es_rol_sistema}
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500 disabled:bg-neutral-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">
                  Permisos
                </label>
                <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`perm_${permission.id}`}
                        checked={formData.permisos_ids.includes(permission.id)}
                        onChange={() => togglePermission(permission.id)}
                        className="rounded"
                      />
                      <label
                        htmlFor={`perm_${permission.id}`}
                        className="ml-2 text-sm text-neutral-700"
                      >
                        {permission.nombre}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  Guardar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
