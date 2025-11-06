import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@shared/components/ui/Button";
import { usersService } from "../services/admin.service";
import type { User } from "../types";
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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await usersService.getAll({ search: searchTerm });
      setUsers(response.results || response);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (user: User) => {
    if (!window.confirm(`¿Estás seguro de eliminar a ${user.nombre_completo}?`))
      return;

    try {
      await usersService.delete(user.id);
      loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error al eliminar usuario");
    }
  };

  const handleEdit = (user: User) => {
    // TODO: Open modal or navigate to edit page
    console.log("Edit user:", user);
  };

  // Refetch on search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers();
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
          <Button variant="primary" size="lg">
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
    </div>
  );
};
