import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@shared/components/ui/Button";
import { usersService, rolesService } from "../services/admin.service";
import type { User, Role } from "../types";
import {
  DataTable,
  SearchBar,
  PageHeader,
  StatusBadge,
  RoleBadge,
  commonActions,
  type Column,
  type Action,
} from "../components";

export const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
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

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, rolesData] = await Promise.all([
        usersService.getAll({ search: searchTerm }),
        rolesService.getAll(),
      ]);
      setUsers(usersData.results || usersData);
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
      loadData();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const columns: Column<User>[] = [
    {
      key: "nombre_completo",
      label: "Usuario",
      sortable: true,
      render: (user) => (
        <div>
          <p className="font-medium text-neutral-900">{user.nombre_completo}</p>
          <p className="text-sm text-neutral-500">{user.email}</p>
        </div>
      ),
    },
    {
      key: "rol",
      label: "Rol",
      render: (user) => <RoleBadge role={user.rol_detalle?.nombre} />,
    },
    {
      key: "activo",
      label: "Estado",
      render: (user) => <StatusBadge status={user.activo} />,
    },
    {
      key: "created_at",
      label: "Fecha de Registro",
      sortable: true,
      render: (user) => (
        <span className="text-sm text-neutral-500">
          {new Date(user.created_at).toLocaleDateString("es-ES")}
        </span>
      ),
    },
  ];

  const actions: Action<User>[] = [
    {
      label: "Editar",
      icon: commonActions.edit,
      onClick: handleEdit,
      variant: "primary",
    },
    {
      label: "Eliminar",
      icon: commonActions.delete,
      onClick: handleDelete,
      variant: "danger",
    },
  ];

  return (
    <div className="p-8">
      <PageHeader
        title="Gestión de Usuarios"
        description="Administra los usuarios del sistema"
        action={
          <Button variant="primary" size="lg" onClick={handleCreate}>
            <Plus size={20} className="mr-2" />
            Nuevo Usuario
          </Button>
        }
      />

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar usuarios..."
        />
      </div>

      {/* Table */}
      <DataTable
        data={users}
        columns={columns}
        actions={actions}
        loading={loading}
        emptyMessage="No se encontraron usuarios"
      />

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
