import React, { useState, useEffect } from "react";
import { Plus, Shield, Edit, Trash2 } from "lucide-react";
import { Button } from "@shared/components/ui/Button";
import { rolesService } from "../services/admin.service";
import type { Role, Permission } from "../types";
import { SearchBar } from "../components";

const RESOURCES = [
  "Productos",
  "Pedidos",
  "Categorías",
  "Marcas",
  "Usuarios",
  "Roles",
  "Carritos",
  "Descuentos",
  "Configuración",
];
const ACTIONS = [
  { key: "listar", label: "Listar (read)" },
  { key: "crear", label: "Crear (create)" },
  { key: "editar", label: "Editar (update)" },
  { key: "eliminar", label: "Eliminar (delete)" },
];

export const RolesManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
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

  const togglePermission = (permId: string) => {
    setFormData((prev) => ({
      ...prev,
      permisos_ids: prev.permisos_ids.includes(permId)
        ? prev.permisos_ids.filter((id) => id !== permId)
        : [...prev.permisos_ids, permId],
    }));
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

  const getPermissionLabel = (permission: Permission): string => {
    return (
      permission.descripcion || `${permission.modulo}.${permission.codigo}`
    );
  };

  const getPermissionIdForResourceAction = (
    resource: string,
    action: string
  ): string | null => {
    // Normalizar el recurso: remover espacios, acentos, minúsculas
    const normalizeText = (text: string) =>
      text
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[áéíóú]/g, (match) => {
          const accents: { [key: string]: string } = {
            á: "a",
            é: "e",
            í: "i",
            ó: "o",
            ú: "u",
          };
          return accents[match] || match;
        });

    const normalizedResource = normalizeText(resource);
    const normalizedAction = normalizeText(action);

    // Buscar por código exacto (modulo.codigo)
    const byCode = permissions.find(
      (p) =>
        normalizeText(p.codigo || "") ===
        `${normalizedResource}.${normalizedAction}`
    );
    if (byCode) return byCode.id;

    // Buscar por descripción si contiene el recurso y acción
    const byDescription = permissions.find(
      (p) =>
        normalizeText(p.descripcion || "").includes(normalizedResource) &&
        normalizeText(p.descripcion || "").includes(normalizedAction)
    );
    if (byDescription) return byDescription.id;

    // Búsqueda flexible - si la descripción contiene ambas palabras
    const flexible = permissions.find((p) => {
      const desc = normalizeText(p.descripcion || "");
      const cod = normalizeText(p.codigo || "");
      return (
        (desc.includes(normalizedResource) &&
          desc.includes(normalizedAction)) ||
        (cod.includes(normalizedResource) && cod.includes(normalizedAction))
      );
    });
    return flexible?.id || null;
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  const filteredRoles = roles.filter((role) =>
    role.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* SearchBar + Nuevo Rol en misma fila */}
      <div className="flex gap-3 items-center">
        <div className="flex-1 bg-white rounded-lg shadow-sm p-3">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar roles..."
          />
        </div>
        <Button variant="primary" size="md" onClick={handleCreate}>
          <Plus size={18} className="mr-2" />
          Nuevo Rol
        </Button>
      </div>

      {/* Roles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRoles.map((role) => (
          <div
            key={role.id}
            className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-base font-semibold text-neutral-900">
                  {role.nombre}
                </h3>
                {role.es_rol_sistema && (
                  <p className="text-xs text-primary-600 font-medium">
                    Rol del Sistema
                  </p>
                )}
              </div>
              <Shield size={18} className="text-primary-600" />
            </div>

            <p className="text-xs text-neutral-600 mb-3">{role.descripcion}</p>

            {/* Permisos por recurso */}
            <div className="mb-4 space-y-2">
              <p className="text-xs font-medium text-neutral-500 uppercase">
                Permisos:
              </p>
              <div className="space-y-1">
                {RESOURCES.map((resource) => {
                  const resourcePerms =
                    role.permisos?.filter((p) =>
                      p.descripcion
                        ?.toLowerCase()
                        .includes(resource.toLowerCase())
                    ) || [];

                  if (resourcePerms.length === 0) return null;

                  return (
                    <div key={resource} className="text-xs text-neutral-700">
                      <span className="font-medium">{resource}:</span>{" "}
                      {resourcePerms
                        .map((p) => {
                          const action = ACTIONS.find((a) =>
                            p.descripcion?.toLowerCase().includes(a.key)
                          )?.label;
                          return action?.split(" ")[0].toLowerCase();
                        })
                        .join(", ")}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-2">
              {!role.es_rol_sistema && (
                <>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleEdit(role)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs"
                  >
                    <Edit size={14} />
                    Editar
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleDelete(role)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs bg-error hover:bg-error/90 text-white"
                  >
                    <Trash2 size={14} />
                    Eliminar
                  </Button>
                </>
              )}
              {role.es_rol_sistema && (
                <p className="text-xs text-neutral-500 py-2">
                  No editable (rol del sistema)
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-neutral-200 p-6">
              <h2 className="text-xl font-bold text-neutral-900">
                {editingRole ? "Editar Rol" : "Nuevo Rol"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Nombre y Descripción */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    placeholder="Ej: Editor de Contenido"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        descripcion: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    placeholder="Descripción del rol..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Matriz Recurso x Acción */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-4">
                  Permisos por Recurso
                </label>
                <div className="overflow-x-auto border border-neutral-200 rounded-lg">
                  <table className="w-full">
                    <thead className="bg-neutral-50 border-b border-neutral-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700">
                          Recurso
                        </th>
                        {ACTIONS.map((action) => (
                          <th
                            key={action.key}
                            className="px-4 py-3 text-center text-xs font-semibold text-neutral-700"
                          >
                            {action.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {RESOURCES.map((resource) => (
                        <tr key={resource} className="hover:bg-neutral-50">
                          <td className="px-4 py-3 font-medium text-neutral-900">
                            {resource}
                          </td>
                          {ACTIONS.map((action) => {
                            const permId = getPermissionIdForResourceAction(
                              resource,
                              action.key
                            );
                            const isChecked =
                              permId && formData.permisos_ids.includes(permId);

                            return (
                              <td
                                key={`${resource}-${action.key}`}
                                className="px-4 py-3 text-center"
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked || false}
                                  onChange={() =>
                                    permId && togglePermission(permId)
                                  }
                                  disabled={!permId}
                                  data-testid={`permissions[${resource.toLowerCase()}.${
                                    action.key
                                  }]`}
                                  className="rounded cursor-pointer"
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Resumen de Permisos Seleccionados */}
              {formData.permisos_ids.length > 0 && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <p className="text-xs font-medium text-primary-900 mb-2">
                    Permisos seleccionados:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {permissions
                      .filter((p) => formData.permisos_ids.includes(p.id))
                      .map((p) => (
                        <span
                          key={p.id}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-white text-xs font-medium text-primary-700 rounded-md border border-primary-200"
                        >
                          {getPermissionLabel(p)}
                          <button
                            type="button"
                            onClick={() => togglePermission(p.id)}
                            className="ml-1 text-primary-600 hover:text-primary-900"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* Botones */}
              <div className="flex gap-3 pt-4 border-t border-neutral-200">
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
