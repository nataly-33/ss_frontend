# Módulo Admin

Este módulo contiene toda la lógica de administración del sistema SmartSales365.

## 📁 Estructura

```
admin/
├── components/         # Componentes reutilizables
│   ├── Badges.tsx     # StatusBadge, RoleBadge, CategoryBadge
│   ├── DataTable.tsx  # Tabla genérica con sorting y acciones
│   ├── PageHeader.tsx # Header de página con título y acción
│   ├── SearchBar.tsx  # Barra de búsqueda con clear
│   └── index.ts       # Barrel export
├── pages/             # Páginas de administración
│   ├── AdminDashboard.tsx
│   ├── UsersManagment.tsx
│   ├── RolesManagment.tsx
│   ├── ProductsManagement.tsx
│   └── CategoriesManagement.tsx
├── services/          # Servicios API
│   └── admin.service.ts
├── types/             # TypeScript types e interfaces
│   └── index.ts
├── index.ts           # Barrel export del módulo
└── README.md          # Esta documentación
```

## 🎯 Servicios

Todos los servicios están centralizados en `services/admin.service.ts` y usan los `ENDPOINTS` de la configuración central.

### Servicios disponibles

```typescript
import { adminService } from '@modules/admin/services/admin.service';

// Users
await adminService.users.getAll({ search: 'john', rol: 'Cliente' });
await adminService.users.getById(userId);
await adminService.users.create(userData);
await adminService.users.update(userId, updateData);
await adminService.users.delete(userId);
await adminService.users.changePassword(userId, passwordData);

// Roles
await adminService.roles.getAll();
await adminService.roles.getById(roleId);
await adminService.roles.create(roleData);
await adminService.roles.update(roleId, updateData);
await adminService.roles.delete(roleId);
await adminService.roles.getPermissions();

// Products
await adminService.products.getAll({ search: 'vestido', activa: true });
await adminService.products.getById(productId);
await adminService.products.getBySlug(slug);
await adminService.products.create(productData);
await adminService.products.update(productId, updateData);
await adminService.products.delete(productId);

// Categories
await adminService.categories.getAll({ activa: true });
await adminService.categories.getById(categoryId);
await adminService.categories.create(categoryData);
await adminService.categories.update(categoryId, updateData);
await adminService.categories.delete(categoryId);

// Brands
await adminService.brands.getAll();
await adminService.brands.getById(brandId);
await adminService.brands.create(brandData);
await adminService.brands.update(brandId, updateData);
await adminService.brands.delete(brandId);

// Sizes
await adminService.sizes.getAll();
await adminService.sizes.getById(sizeId);
```

## 📦 Types

Todos los types están en `types/index.ts`:

- **User**: Usuario del sistema con rol y permisos
- **Role**: Roles y permisos
- **Product**: Productos/prendas
- **Category**: Categorías de productos
- **Brand**: Marcas
- **Size**: Tallas
- **PaginatedResponse<T>**: Response paginada genérica
- **Filters**: UserFilters, ProductFilters, CategoryFilters

## 🎨 Componentes Reutilizables

### DataTable

Tabla genérica con columnas configurables, acciones y sorting.

```typescript
import { DataTable, commonActions, type Column, type Action } from '@modules/admin/components';

const columns: Column<User>[] = [
  {
    key: 'name',
    label: 'Nombre',
    sortable: true,
    render: (user) => <span>{user.nombre_completo}</span>
  }
];

const actions: Action<User>[] = [
  {
    label: 'Editar',
    icon: commonActions.edit,
    onClick: handleEdit,
    variant: 'primary'
  }
];

<DataTable
  data={users}
  columns={columns}
  actions={actions}
  loading={loading}
/>
```

### SearchBar

Barra de búsqueda con clear automático.

```typescript
import { SearchBar } from '@modules/admin/components';

<SearchBar
  value={searchTerm}
  onChange={setSearchTerm}
  placeholder="Buscar usuarios..."
/>
```

### Badges

Badges para estados, roles y categorías.

```typescript
import { StatusBadge, RoleBadge, CategoryBadge } from '@modules/admin/components';

<StatusBadge status={user.activo} />
<RoleBadge role={user.rol_detalle?.nombre} />
<CategoryBadge label="Destacado" variant="primary" />
```

### PageHeader

Header estándar para páginas de administración.

```typescript
import { PageHeader } from '@modules/admin/components';

<PageHeader
  title="Gestión de Usuarios"
  description="Administra los usuarios del sistema"
  action={
    <Button variant="primary">
      <Plus /> Nuevo Usuario
    </Button>
  }
/>
```

## 🛣️ Rutas

Las páginas de admin están protegidas por `AdminRoute` que verifica:
- Usuario autenticado
- Rol = Admin o Empleado

```typescript
// src/core/routes/Index.tsx
<Route element={<AdminRoute />}>
  <Route path="/admin" element={<AdminDashboard />}>
    <Route path="users" element={<UsersManagement />} />
    <Route path="roles" element={<RolesManagement />} />
    <Route path="products" element={<ProductsManagement />} />
    <Route path="categories" element={<CategoriesManagement />} />
  </Route>
</Route>
```

## 🔧 Uso en Páginas

Ejemplo completo de una página usando el patrón:

```typescript
import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@shared/components/ui/Button';
import { adminService } from '../services/admin.service';
import type { User } from '../types';
import {
  DataTable,
  SearchBar,
  PageHeader,
  StatusBadge,
  commonActions,
  type Column,
  type Action
} from '../components';

export const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.users.getAll({ search: searchTerm });
      setUsers(response.results);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [searchTerm]);

  const columns: Column<User>[] = [
    {
      key: 'nombre_completo',
      label: 'Usuario',
      sortable: true,
      render: (user) => (
        <div>
          <p>{user.nombre_completo}</p>
          <p className="text-sm text-neutral-500">{user.email}</p>
        </div>
      )
    }
  ];

  const actions: Action<User>[] = [
    {
      label: 'Editar',
      icon: commonActions.edit,
      onClick: (user) => console.log('Edit', user),
      variant: 'primary'
    }
  ];

  return (
    <div className="p-8">
      <PageHeader
        title="Gestión de Usuarios"
        action={<Button>Nuevo Usuario</Button>}
      />
      <SearchBar value={searchTerm} onChange={setSearchTerm} />
      <DataTable data={users} columns={columns} actions={actions} loading={loading} />
    </div>
  );
};
```

## 🚀 Próximos Pasos (TODO)

- [ ] Implementar modales para crear/editar (UserModal, RoleModal, etc.)
- [ ] Añadir validación de formularios con react-hook-form
- [ ] Implementar filtros avanzados (por fecha, múltiples criterios)
- [ ] Añadir paginación en DataTable
- [ ] Implementar exportación a CSV/Excel
- [ ] Añadir confirmación de acciones destructivas (toasts/notifications)
- [ ] Implementar drag-and-drop para reordenar
- [ ] Añadir bulk actions (seleccionar múltiples items)

## 📝 Notas

- **Endpoints**: Todos los endpoints usan el prefijo `/api/` y están centralizados en `core/config/endpoints.ts`
- **Errores de ruta**: Si ves "404 Not Found" en consola, verifica que el endpoint incluya `/api/` (ejemplo: `/api/auth/users/` en vez de `/auth/users/`)
- **Tipos**: Todos los tipos están documentados con JSDoc para mejor autocompletado en VS Code
- **Filtros**: Los servicios aceptan filtros opcionales que se convierten automáticamente en query params
- **Responses paginadas**: El backend retorna `{ count, next, previous, results }` para listados

---

**Última actualización**: 6 de Noviembre 2025
