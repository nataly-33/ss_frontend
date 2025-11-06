# 🔐 Sistema RBAC - Control de Acceso Basado en Roles

**SmartSales365 - Frontend**

**Versión:** 1.0
**Fecha:** 6 de Noviembre, 2025

---

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Arquitectura RBAC](#arquitectura-rbac)
3. [Roles del Sistema](#roles-del-sistema)
4. [Permisos Granulares](#permisos-granulares)
5. [Implementación en Frontend](#implementación-en-frontend)
6. [Protección de Rutas](#protección-de-rutas)
7. [Verificación de Permisos](#verificación-de-permisos)
8. [Casos de Uso](#casos-de-uso)

---

## 🎯 Introducción

**RBAC** (Role-Based Access Control) es un sistema de control de acceso que asigna permisos a usuarios basándose en su rol dentro del sistema.

### ¿Por qué RBAC?

- ✅ **Seguridad**: Control granular de quién puede hacer qué
- ✅ **Escalabilidad**: Fácil agregar nuevos roles y permisos
- ✅ **Mantenibilidad**: Cambios centralizados en roles
- ✅ **Flexibilidad**: Roles personalizados según necesidades

### Principios Clave

1. **Un usuario = Un rol** (SimpleRBAC, no múltiples roles)
2. **Un rol = Múltiples permisos**
3. **Permisos verificados en backend Y frontend**
4. **Frontend oculta UI, backend bloquea acciones**

---

## 🏗️ Arquitectura RBAC

### Modelo de Datos

```
User
  └─> Role (ForeignKey - 1 rol por usuario)
        └─> Permissions (ManyToMany - múltiples permisos por rol)
              └─> Código: "modulo.accion" (ej: "productos.crear")
```

### Flujo de Verificación

```
Usuario hace login
    ↓
Backend retorna: { user, role, permissions[] }
    ↓
Frontend guarda en store (Zustand)
    ↓
Cada ruta/componente verifica permisos
    ↓
Si tiene permiso → Muestra UI
Si NO tiene → Oculta/Deshabilita/Redirige
```

---

## 👥 Roles del Sistema

### 1. Admin (Administrador)

**Descripción:** Administrador completo del sistema.

**Nivel de acceso:** TOTAL (100%)

**Permisos:**
- ✅ TODOS los permisos del sistema
- ✅ Gestión de usuarios, roles y permisos
- ✅ Configuración del sistema
- ✅ Acceso a reportes y IA
- ✅ Todas las operaciones CRUD

**Rutas accesibles:**
- `/admin/*` - Dashboard completo
- `/admin/users` - Gestión de usuarios
- `/admin/roles` - Gestión de roles
- `/admin/products` - Gestión de productos
- `/admin/categories` - Gestión de categorías
- `/admin/brands` - Gestión de marcas (pendiente)
- `/admin/orders` - Todos los pedidos (pendiente)
- `/admin/reports` - Reportes (pendiente)
- `/admin/settings` - Configuración (pendiente)

**Características especiales:**
- Puede crear, editar y eliminar usuarios
- Puede asignar/cambiar roles
- Puede crear roles personalizados
- Acceso a logs de auditoría
- Puede ver datos de todos los clientes

---

### 2. Empleado (Vendedor/Cajero)

**Descripción:** Personal de la tienda que realiza ventas y gestiona inventario.

**Nivel de acceso:** MEDIO (60-70%)

**Permisos:**
- ✅ Productos (CRUD completo)
- ✅ Categorías (CRUD)
- ✅ Marcas (CRUD)
- ✅ Pedidos (Crear, Leer, Actualizar estados)
- ✅ Ventas (Crear, Leer, Cancelar - solo el mismo día)
- ✅ Clientes (Leer, Crear, Actualizar - NO eliminar)
- ✅ Reportes (Generar - solo de ventas)
- ❌ Usuarios (NO puede gestionar)
- ❌ Roles (NO puede gestionar)
- ❌ Configuración del sistema (NO puede acceder)

**Rutas accesibles:**
- `/admin` - Dashboard (vista limitada)
- `/admin/products` - Gestión de productos ✅
- `/admin/categories` - Gestión de categorías ✅
- `/admin/brands` - Gestión de marcas ✅ (pendiente)
- `/admin/orders` - Pedidos (ver todos, cambiar estados) ✅ (pendiente)
- `/admin/reports` - Reportes de ventas ⚠️ (limitado)

**Rutas NO accesibles:**
- `/admin/users` - ❌ NO puede ver
- `/admin/roles` - ❌ NO puede ver
- `/admin/settings` - ❌ NO puede ver

**Características especiales:**
- Puede registrar ventas en POS (punto de venta)
- Puede cambiar estados de pedidos (Pendiente → Confirmado → Preparando)
- NO puede cancelar pedidos de clientes
- Puede generar reportes de sus propias ventas

---

### 3. Cliente

**Descripción:** Usuario final que compra productos online.

**Nivel de acceso:** BAJO (20-30%)

**Permisos:**
- ✅ Productos (Solo lectura)
- ✅ Categorías (Solo lectura)
- ✅ Marcas (Solo lectura)
- ✅ Carrito (Gestión completa de su propio carrito)
- ✅ Pedidos (Crear, Ver sus propios pedidos, Cancelar - si aplica)
- ✅ Perfil (Ver, Editar su propio perfil)
- ✅ Direcciones (CRUD de sus propias direcciones)
- ✅ Favoritos (Agregar, Eliminar sus propios favoritos)
- ❌ Dashboard admin (NO puede acceder)
- ❌ Gestión de productos (NO puede modificar)

**Rutas accesibles:**
- `/` - Página principal ✅
- `/products` - Catálogo ✅
- `/products/:slug` - Detalle de producto ✅
- `/cart` - Carrito ✅
- `/checkout` - Checkout ✅
- `/profile` - Perfil ✅ (pendiente)
- `/orders` - Mis pedidos ✅ (pendiente)
- `/favorites` - Favoritos ✅ (pendiente)

**Rutas NO accesibles:**
- `/admin/*` - ❌ Redirige a `/` si intenta acceder

**Características especiales:**
- Puede ver su historial de compras
- Puede cancelar pedidos (solo si están en estado "Pendiente" o "Confirmado")
- Puede dejar reseñas de productos (funcionalidad futura)
- Puede contactar soporte (funcionalidad futura)

---

## 🔑 Permisos Granulares

### Estructura de Permisos

Formato: `{módulo}.{acción}`

Ejemplos:
- `productos.crear` - Crear productos
- `productos.leer` - Ver productos
- `productos.actualizar` - Editar productos
- `productos.eliminar` - Eliminar productos (soft delete)

### Lista Completa de Permisos

#### Módulo: Productos
- `productos.crear`
- `productos.leer`
- `productos.actualizar`
- `productos.eliminar`
- `productos.importar` (futuro)
- `productos.exportar` (futuro)

#### Módulo: Categorías
- `categorias.crear`
- `categorias.leer`
- `categorias.actualizar`
- `categorias.eliminar`

#### Módulo: Marcas
- `marcas.crear`
- `marcas.leer`
- `marcas.actualizar`
- `marcas.eliminar`

#### Módulo: Pedidos
- `pedidos.crear`
- `pedidos.leer`
- `pedidos.actualizar`
- `pedidos.eliminar`
- `pedidos.aprobar`
- `pedidos.cancelar`
- `pedidos.reembolsar` (futuro)

#### Módulo: Usuarios
- `usuarios.crear`
- `usuarios.leer`
- `usuarios.actualizar`
- `usuarios.eliminar`
- `usuarios.cambiar_rol`

#### Módulo: Roles
- `roles.crear`
- `roles.leer`
- `roles.actualizar`
- `roles.eliminar`
- `roles.asignar_permisos`

#### Módulo: Clientes
- `clientes.crear`
- `clientes.leer`
- `clientes.actualizar`
- `clientes.eliminar`

#### Módulo: Ventas (POS)
- `ventas.crear`
- `ventas.leer`
- `ventas.actualizar`
- `ventas.cancelar`

#### Módulo: Reportes
- `reportes.generar`
- `reportes.leer`
- `reportes.exportar`
- `reportes.ver_predicciones` (IA)

#### Módulo: Configuración
- `configuracion.ver`
- `configuracion.actualizar`

---

## 💻 Implementación en Frontend

### 1. Store de Autenticación

**Archivo:** `src/core/store/auth.store.ts`

```typescript
interface User {
  id: string;
  email: string;
  nombre_completo: string;
  rol_detalle?: {
    nombre: string;
    permisos: Permission[];
  };
}

interface Permission {
  id: string;
  codigo: string; // "productos.crear"
  nombre: string; // "Crear productos"
  descripcion: string;
  modulo: string; // "productos"
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, access: string, refresh: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}
```

**Datos almacenados tras login:**
```json
{
  "user": {
    "id": "uuid",
    "email": "admin@smartsales365.com",
    "nombre_completo": "Admin Sistema",
    "rol_detalle": {
      "nombre": "Admin",
      "permisos": [
        {
          "codigo": "productos.crear",
          "nombre": "Crear productos",
          "modulo": "productos"
        },
        // ... más permisos
      ]
    }
  }
}
```

---

### 2. Hook de Permisos (PENDIENTE IMPLEMENTAR)

**Archivo:** `src/core/hooks/usePermissions.ts`

```typescript
import { useAuthStore } from "@/core/store/auth.store";

export const usePermissions = () => {
  const { user } = useAuthStore();

  const hasPermission = (permissionCode: string): boolean => {
    if (!user) return false;

    // Admin tiene todos los permisos
    if (user.rol_detalle?.nombre === "Admin") return true;

    // Verificar en la lista de permisos del usuario
    return (
      user.rol_detalle?.permisos?.some((p) => p.codigo === permissionCode) ||
      false
    );
  };

  const hasAllPermissions = (...permissionCodes: string[]): boolean => {
    return permissionCodes.every((code) => hasPermission(code));
  };

  const hasAnyPermission = (...permissionCodes: string[]): boolean => {
    return permissionCodes.some((code) => hasPermission(code));
  };

  const canCreate = (module: string) => hasPermission(`${module}.crear`);
  const canRead = (module: string) => hasPermission(`${module}.leer`);
  const canUpdate = (module: string) => hasPermission(`${module}.actualizar`);
  const canDelete = (module: string) => hasPermission(`${module}.eliminar`);

  return {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
  };
};
```

**Uso:**
```typescript
const MyComponent = () => {
  const { hasPermission, canCreate } = usePermissions();

  return (
    <div>
      {hasPermission("productos.crear") && (
        <button>Crear Producto</button>
      )}

      {canCreate("usuarios") && (
        <button>Crear Usuario</button>
      )}
    </div>
  );
};
```

---

### 3. Componente de Protección Condicional (PENDIENTE)

**Archivo:** `src/shared/components/permissions/PermissionGuard.tsx`

```typescript
import { usePermissions } from "@/core/hooks/usePermissions";

interface PermissionGuardProps {
  permission: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  fallback = null,
  children,
}) => {
  const { hasPermission } = usePermissions();

  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
```

**Uso:**
```typescript
<PermissionGuard permission="productos.crear">
  <button>Crear Producto</button>
</PermissionGuard>

<PermissionGuard
  permission="usuarios.eliminar"
  fallback={<p>No tienes permiso para eliminar usuarios</p>}
>
  <button>Eliminar Usuario</button>
</PermissionGuard>
```

---

## 🛣️ Protección de Rutas

### Rutas Públicas

**NO requieren autenticación:**
- `/`
- `/products`
- `/products/:slug`
- `/login`
- `/register`

**Implementación:**
```typescript
<Route path="/" element={<HomePage />} />
<Route path="/products" element={<ProductsPage />} />
<Route path="/login" element={<LoginPage />} />
```

---

### Rutas Protegidas (Autenticadas)

**Requieren estar logueado, PERO todos los roles pueden acceder:**
- `/cart`
- `/checkout`
- `/profile`
- `/orders`
- `/favorites`

**Implementación:**
```typescript
import { ProtectedRoute } from "@/core/routes/ProtectedRoute";

<Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
  <Route path="/cart" element={<CartPage />} />
  <Route path="/checkout" element={<CheckoutPage />} />
  <Route path="/profile" element={<ProfilePage />} />
  <Route path="/orders" element={<OrdersPage />} />
  <Route path="/favorites" element={<FavoritesPage />} />
</Route>
```

**Lógica de ProtectedRoute:**
```typescript
// src/core/routes/ProtectedRoute.tsx
export const ProtectedRoute = ({ children }: Props) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
```

---

### Rutas Admin (Admin + Empleado)

**Solo Admin y Empleado pueden acceder:**
- `/admin/*`

**Implementación:**
```typescript
import { AdminRoute } from "@/core/routes/AdminRoute";

<Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>}>
  <Route path="users" element={<UsersManagment />} />
  <Route path="products" element={<ProductsManagement />} />
  {/* ... más rutas */}
</Route>
```

**Lógica de AdminRoute:**
```typescript
// src/core/routes/AdminRoute.tsx
export const AdminRoute = ({ children }: Props) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user?.rol_detalle?.nombre === "Admin";
  const isEmpleado = user?.rol_detalle?.nombre === "Empleado";

  if (!isAdmin && !isEmpleado) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
```

---

### Rutas con Permisos Específicos (FUTURO)

**Para verificaciones más granulares:**

```typescript
// Componente PermissionRoute (a crear)
<Route
  path="/admin/users"
  element={
    <PermissionRoute permission="usuarios.leer">
      <UsersManagment />
    </PermissionRoute>
  }
/>
```

**Lógica:**
```typescript
export const PermissionRoute = ({ permission, children }: Props) => {
  const { isAuthenticated, user } = useAuthStore();
  const { hasPermission } = usePermissions();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasPermission(permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
```

---

## ✅ Verificación de Permisos

### En Componentes

#### Mostrar/Ocultar Botones

```typescript
import { usePermissions } from "@/core/hooks/usePermissions";

export const ProductsPage = () => {
  const { canCreate, canDelete } = usePermissions();

  return (
    <div>
      <h1>Productos</h1>

      {canCreate("productos") && (
        <button onClick={handleCreate}>Crear Producto</button>
      )}

      <table>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.nombre}</td>
            <td>
              <button onClick={() => handleEdit(product)}>Editar</button>

              {canDelete("productos") && (
                <button onClick={() => handleDelete(product)}>Eliminar</button>
              )}
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};
```

---

#### Deshabilitar Acciones

```typescript
export const ProductForm = () => {
  const { hasPermission } = usePermissions();
  const canSave = hasPermission("productos.actualizar");

  return (
    <form>
      {/* ... campos ... */}

      <button type="submit" disabled={!canSave}>
        {canSave ? "Guardar" : "No tienes permiso para guardar"}
      </button>
    </form>
  );
};
```

---

### En el Sidebar del Dashboard

```typescript
// src/modules/dashboard/pages/AdminDashboard.tsx

const menuItems = [
  {
    name: "Usuarios",
    path: "/admin/users",
    icon: <UsersIcon />,
    permission: "usuarios.leer", // ✅ Requiere permiso
  },
  {
    name: "Productos",
    path: "/admin/products",
    icon: <ShoppingBagIcon />,
    permission: "productos.leer",
  },
  {
    name: "Pedidos",
    path: "/admin/orders",
    icon: <ShoppingCartIcon />,
    // Sin permission → visible para todos los admin/empleado
  },
  {
    name: "Roles",
    path: "/admin/roles",
    icon: <ShieldCheckIcon />,
    permission: "roles.leer", // ✅ Solo Admin
  },
];

export const AdminDashboard = () => {
  const { hasPermission } = usePermissions();

  const visibleItems = menuItems.filter((item) =>
    item.permission ? hasPermission(item.permission) : true
  );

  return (
    <div className="flex">
      <Sidebar>
        {visibleItems.map((item) => (
          <SidebarItem key={item.path} {...item} />
        ))}
      </Sidebar>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};
```

---

## 📚 Casos de Uso

### Caso 1: Admin crea un usuario

**Flujo:**
1. Admin hace login → `user.rol_detalle.nombre === "Admin"`
2. Navega a `/admin/users`
3. AdminRoute verifica: `isAdmin || isEmpleado` → ✅ Pasa
4. UsersManagment verifica: `hasPermission("usuarios.leer")` → ✅ Admin tiene todos los permisos
5. Click en "Crear Usuario"
6. Botón visible porque: `canCreate("usuarios")` → ✅ true
7. Llena formulario y envía
8. Backend valida el permiso `usuarios.crear` → ✅ Admin lo tiene
9. Usuario creado exitosamente

---

### Caso 2: Empleado intenta acceder a Usuarios

**Flujo:**
1. Empleado hace login → `user.rol_detalle.nombre === "Empleado"`
2. Navega a `/admin`
3. AdminRoute verifica: `isAdmin || isEmpleado` → ✅ Pasa
4. En el sidebar, el item "Usuarios" **NO aparece** porque:
   - `menuItem.permission = "usuarios.leer"`
   - `hasPermission("usuarios.leer")` → ❌ Empleado NO tiene ese permiso
5. Si intenta navegar directamente a `/admin/users` (escribiendo en URL):
   - PermissionRoute verifica: `hasPermission("usuarios.leer")` → ❌ false
   - Redirige a `/unauthorized`

---

### Caso 3: Cliente intenta acceder al Dashboard

**Flujo:**
1. Cliente hace login → `user.rol_detalle.nombre === "Cliente"`
2. Intenta navegar a `/admin`
3. AdminRoute verifica: `isAdmin || isEmpleado` → ❌ false
4. Redirige automáticamente a `/`
5. El cliente solo puede acceder a rutas públicas y sus rutas protegidas (carrito, perfil, etc.)

---

### Caso 4: Empleado gestiona productos

**Flujo:**
1. Empleado hace login
2. Navega a `/admin/products`
3. AdminRoute: ✅ Pasa (es Empleado)
4. Sidebar muestra "Productos" porque:
   - `hasPermission("productos.leer")` → ✅ Empleado SÍ tiene ese permiso
5. En ProductsManagement:
   - Botón "Crear Producto" visible porque: `canCreate("productos")` → ✅ true
   - Botón "Editar" visible porque: `hasPermission("productos.actualizar")` → ✅ true
   - Botón "Eliminar" visible porque: `canDelete("productos")` → ✅ true
6. Todas las acciones funcionan porque el Empleado tiene permisos de productos

---

## ⚠️ Problemas Actuales

### 1. Permisos NO Verificados en Frontend

**Ubicación:** `AdminDashboard.tsx` línea ~89

**Código actual:**
```typescript
const hasPermission = (permission?: string) => {
  if (!permission) return true;
  if (user?.rol_detalle?.nombre === "Admin") return true;
  // TODO: Lógica de permisos más detallada
  return true; // ❌ SIEMPRE RETORNA TRUE
};
```

**Problema:** Empleados pueden ver TODO el sidebar, incluyendo Usuarios y Roles.

**Solución:**
```typescript
const hasPermission = (permission?: string) => {
  if (!permission) return true;
  if (user?.rol_detalle?.nombre === "Admin") return true;

  // ✅ Verificar en la lista de permisos
  return user?.rol_detalle?.permisos?.some(
    (p) => p.codigo === permission
  ) || false;
};
```

---

### 2. Hook usePermissions NO Existe

**Estado:** Pendiente de crear

**Ubicación esperada:** `src/core/hooks/usePermissions.ts`

**Uso esperado:**
```typescript
const { hasPermission, canCreate } = usePermissions();

if (hasPermission("usuarios.eliminar")) {
  // Mostrar botón eliminar
}
```

---

### 3. PermissionGuard NO Existe

**Estado:** Pendiente de crear

**Ubicación esperada:** `src/shared/components/permissions/PermissionGuard.tsx`

**Uso esperado:**
```typescript
<PermissionGuard permission="productos.crear">
  <button>Crear Producto</button>
</PermissionGuard>
```

---

### 4. PermissionRoute NO Existe

**Estado:** Pendiente de crear

**Ubicación esperada:** `src/core/routes/PermissionRoute.tsx`

**Uso esperado:**
```typescript
<Route
  path="/admin/users"
  element={
    <PermissionRoute permission="usuarios.leer">
      <UsersManagment />
    </PermissionRoute>
  }
/>
```

---

## 📊 Resumen de Permisos por Rol

| Módulo           | Admin | Empleado | Cliente |
| ---------------- | ----- | -------- | ------- |
| Productos        | CRUD  | CRUD     | Leer    |
| Categorías       | CRUD  | CRUD     | Leer    |
| Marcas           | CRUD  | CRUD     | Leer    |
| Usuarios         | CRUD  | ❌        | ❌       |
| Roles            | CRUD  | ❌        | ❌       |
| Pedidos (todos)  | CRUD  | Leer/Actualizar | ❌ |
| Pedidos (propios)| ✅     | ✅        | Leer/Crear/Cancelar |
| Ventas POS       | CRUD  | Crear/Leer | ❌     |
| Reportes         | ✅     | ⚠️ (limitado) | ❌  |
| Configuración    | ✅     | ❌        | ❌       |
| IA/Predicciones  | ✅     | ❌        | ❌       |

---

## 🚀 Implementación Recomendada

### Prioridad 1: Crear Hook usePermissions
1. Crear `src/core/hooks/usePermissions.ts`
2. Implementar funciones de verificación
3. Exportar desde `src/core/hooks/index.ts`

### Prioridad 2: Arreglar AdminDashboard
1. Usar `usePermissions()` en `AdminDashboard.tsx`
2. Filtrar items del sidebar según permisos
3. Testing con Admin, Empleado y Cliente

### Prioridad 3: Crear PermissionGuard
1. Crear componente en `src/shared/components/permissions/`
2. Usar en páginas de gestión (productos, categorías, etc.)

### Prioridad 4 (Opcional): Crear PermissionRoute
1. Crear en `src/core/routes/PermissionRoute.tsx`
2. Aplicar a rutas sensibles del admin

---

**Última actualización:** 6 de Noviembre 2025
**Estado:** Documentación completa, implementación al 40%
