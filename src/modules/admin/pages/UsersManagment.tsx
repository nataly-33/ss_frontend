import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@shared/components/ui/Button";
import { usersService, rolesService } from "../services/admin.service";
import type { User, Role } from "../types";
import { SearchBar } from "../components";
import { Pagination } from "@shared/components/ui/Pagination";

export const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;
  const [formData, setFormData] = useState({
    email: "",
    nombre: "",
    apellido: "",
    telefono: "",
    rol: "",
    codigo_empleado: "",
    activo: true,
    password: "",
    password_confirm: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (pageNum = 1) => {
    try {
      setLoading(true);
      const [usersData, rolesData] = await Promise.all([
        usersService.getAll({
          search: searchTerm,
          page: pageNum,
        }),
        rolesService.getAll(),
      ]);
      const userData = Array.isArray(usersData)
        ? usersData
        : usersData.results || [];
      const count =
        usersData.count ?? (Array.isArray(usersData) ? usersData.length : 0);

      setUsers(userData);
      setTotalCount(count);
      setPage(pageNum);
      setRoles(rolesData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (user: User) => {
    if (!window.confirm(`¿Estás seguro de eliminar a ${user.nombre_completo}?`))
      return;

    try {
      await usersService.delete(user.id);
      loadData();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error al eliminar usuario");
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      telefono: user.telefono || "",
      rol: user.rol_detalle.id,
      codigo_empleado: user.codigo_empleado || "",
      activo: user.activo,
      password: "",
      password_confirm: "",
    });
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({
      email: "",
      nombre: "",
      apellido: "",
      telefono: "",
      rol: "",
      codigo_empleado: "",
      activo: true,
      password: "",
      password_confirm: "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingUser) {
        const updateData = {
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: formData.telefono,
          rol: formData.rol,
          activo: formData.activo,
        };
        await usersService.update(editingUser.id, updateData);
      } else {
        if (
          !formData.password ||
          formData.password !== formData.password_confirm
        ) {
          alert("Las contraseñas no coinciden");
          return;
        }
        await usersService.create({
          ...formData,
          password: formData.password,
          password_confirm: formData.password_confirm,
        });
      }
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Error al guardar usuario");
    }
  };

  // Refetch on search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadData(1); // Reset to page 1 on search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName?.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-700";
      case "vendedor":
        return "bg-blue-100 text-blue-700";
      case "cliente":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-4">
      {/* SearchBar + Nuevo Usuario en misma fila */}
      <div className="flex gap-3 items-center">
        <div className="flex-1 bg-white rounded-lg shadow-sm p-3">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar usuarios por nombre o email..."
          />
        </div>
        <Button variant="primary" size="lg" onClick={handleCreate}>
          <Plus size={20} className="mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700">
                      Usuario
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700">
                      Rol
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700">
                      Teléfono
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700">
                      Fecha de Registro
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-xs font-medium text-neutral-900">
                            {user.nombre_completo}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {user.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${getRoleBadgeColor(
                            user.rol_detalle?.nombre
                          )}`}
                        >
                          {user.rol_detalle?.nombre || "Sin rol"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-neutral-600">
                        {user.telefono || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            user.activo
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-neutral-600">
                        {new Date(user.created_at).toLocaleDateString("es-ES")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-1.5 hover:bg-primary-50 rounded-lg text-primary-600"
                            title="Editar usuario"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="p-1.5 hover:bg-red-50 rounded-lg text-red-600"
                            title="Eliminar usuario"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalCount > pageSize && (
            <div className="p-3 bg-white rounded-lg shadow-sm border-t border-neutral-200">
              <Pagination
                total={totalCount}
                pageSize={pageSize}
                currentPage={page}
                onPageChange={(newPage) => loadData(newPage)}
              />
            </div>
          )}
        </>
      )}

      {users.length === 0 && !loading && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-neutral-600">No se encontraron usuarios</p>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">
              {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  disabled={!!editingUser}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500 disabled:bg-neutral-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Apellido
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.apellido}
                    onChange={(e) =>
                      setFormData({ ...formData, apellido: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Rol
                </label>
                <select
                  required
                  value={formData.rol}
                  onChange={(e) =>
                    setFormData({ ...formData, rol: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500"
                >
                  <option value="">Seleccionar rol...</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Código de Empleado
                </label>
                <input
                  type="text"
                  value={formData.codigo_empleado}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      codigo_empleado: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500"
                />
              </div>

              {!editingUser && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Confirmar Contraseña
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.password_confirm}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          password_confirm: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="activo"
                  checked={formData.activo}
                  onChange={(e) =>
                    setFormData({ ...formData, activo: e.target.checked })
                  }
                  className="rounded"
                />
                <label
                  htmlFor="activo"
                  className="ml-2 text-sm text-neutral-700"
                >
                  Usuario activo
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowForm(false)}
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
