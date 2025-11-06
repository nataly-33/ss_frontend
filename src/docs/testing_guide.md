# 🧪 Guía de Testing - SmartSales365 Frontend

**Cómo Probar Todas las Funcionalidades del Sistema**

**Versión:** 1.0
**Fecha:** 6 de Noviembre, 2025

---

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Pre-requisitos](#pre-requisitos)
3. [Flujo de Prueba - Cliente](#flujo-de-prueba-cliente)
4. [Flujo de Prueba - Administrador](#flujo-de-prueba-administrador)
5. [Flujo de Prueba - Empleado](#flujo-de-prueba-empleado)
6. [Casos de Prueba por Módulo](#casos-de-prueba-por-módulo)
7. [Errores Comunes y Soluciones](#errores-comunes-y-soluciones)

---

## 🎯 Introducción

Esta guía te ayudará a probar **paso a paso** todas las funcionalidades del sistema SmartSales365, simulando los flujos reales de usuarios.

### Objetivos de Testing

- ✅ Verificar que cada funcionalidad trabaja correctamente
- ✅ Validar flujos completos de usuario (E2E)
- ✅ Identificar bugs antes de producción
- ✅ Comprobar la experiencia de usuario

---

## 🔧 Pre-requisitos

### 1. Backend Corriendo

```bash
cd ss_backend
python manage.py runserver
```

**Verificar**: http://localhost:8000/api/docs/ debe cargar Swagger

### 2. Frontend Corriendo

```bash
cd ss_frontend
npm run dev
```

**Verificar**: http://localhost:5173/ debe cargar la página principal

### 3. Base de Datos con Datos de Prueba

```bash
cd ss_backend
python manage.py shell < scripts/seed_data.py
```

**Esto crea**:
- Usuarios de prueba
- Categorías (Vestidos, Blusas, Pantalones, Faldas)
- Marcas (Zara, H&M, Mango, Forever 21, Shein)
- Productos con stock
- Métodos de pago

---

## 👥 Flujo de Prueba - Cliente

### Escenario: Usuario nuevo que quiere comprar ropa

#### Paso 1: Registro

1. Abre el navegador en `http://localhost:5173/`
2. Click en **"Iniciar Sesión"** en el navbar
3. Click en **"¿No tienes cuenta? Regístrate"**
4. Llena el formulario:
   ```
   Nombre: María
   Apellido: García
   Email: maria.garcia@test.com
   Teléfono: +59175123456
   Password: TestPassword123!
   Confirmar Password: TestPassword123!
   ```
5. Click en **"Registrarse"**

**✅ Resultado Esperado:**
- Redirección a la página de login
- Mensaje de éxito "Usuario registrado correctamente"

**❌ Si falla:**
- Verifica que el email no esté ya registrado
- Revisa que el backend esté corriendo

---

#### Paso 2: Login

1. En la página de login (`/login`), ingresa:
   ```
   Email: maria.garcia@test.com
   Password: TestPassword123!
   ```
2. Click en **"Iniciar Sesión"**

**✅ Resultado Esperado:**
- Redirección a la página principal (`/`)
- En el navbar, aparece el nombre del usuario y el icono de carrito
- El botón de "Iniciar Sesión" cambia a menú de perfil

**⚠️ Problema Conocido:**
- Actualmente SIEMPRE redirige a `/` sin importar el rol
- Debería verificar el rol y redirigir según corresponda

---

#### Paso 3: Navegar por el Catálogo

1. En la página principal, verás:
   - Hero carousel (banner principal)
   - Grid de categorías con imágenes
   - Productos destacados
   - Productos nuevos

2. Click en una categoría (ej: "Vestidos")

**✅ Resultado Esperado:**
- Redirección a `/products?categoria={id}`
- Lista filtrada de productos de esa categoría
- Filtros laterales visibles

---

#### Paso 4: Buscar Productos

1. En `/products`, usa la barra de búsqueda
2. Escribe "floral"
3. Los productos se filtran automáticamente

**✅ Resultado Esperado:**
- Solo aparecen productos con "floral" en nombre o descripción
- La URL cambia a `/products?search=floral`

---

#### Paso 5: Aplicar Filtros

1. Selecciona una marca del filtro (ej: "Zara")
2. Ajusta el rango de precio (ej: 100-500)

**✅ Resultado Esperado:**
- Productos filtrados por marca y precio
- URL actualizada con query params

---

#### Paso 6: Ver Detalle de Producto

1. Click en un producto del grid
2. Deberías ver:
   - Galería de imágenes (si tiene múltiples)
   - Nombre del producto
   - Precio
   - Descripción completa
   - Marca
   - Categorías
   - Selector de talla
   - Selector de cantidad
   - Stock disponible por talla
   - Botón "Agregar al Carrito"

**✅ Resultado Esperado:**
- Todos los datos se cargan correctamente
- El selector de talla muestra las tallas disponibles
- Al seleccionar una talla, se muestra el stock de esa talla

---

#### Paso 7: Agregar al Carrito

1. Selecciona una talla (ej: "M")
2. Ajusta la cantidad (ej: 2)
3. Click en **"Agregar al Carrito"**

**✅ Resultado Esperado:**
- Mensaje de éxito "Producto agregado al carrito"
- El contador del icono de carrito en el navbar se actualiza
- Puedes quedarte en la misma página o ir al carrito

**❌ Si falla:**
- Verifica que estés autenticado (el carrito requiere login)
- Revisa que haya stock suficiente de esa talla

---

#### Paso 8: Ver Carrito

1. Click en el icono de carrito en el navbar
2. O navega a `/cart`

**✅ Resultado Esperado:**
- Lista de productos agregados con:
  - Imagen del producto
  - Nombre
  - Talla seleccionada
  - Precio unitario
  - Cantidad (con botones +/-)
  - Subtotal
  - Botón "Eliminar"
- Resumen del pedido:
  - Subtotal
  - Envío (gratis)
  - Total
- Botón "Proceder al Checkout"

**⚠️ Estado Actual:**
- La página CartPage tiene estructura HTML pero **NO funciona**
- Necesita conectarse con `cart.service.ts`

---

#### Paso 9: Modificar Carrito

1. Incrementa la cantidad de un producto con el botón "+"
2. Click en "Eliminar" en otro producto

**✅ Resultado Esperado:**
- Al incrementar: cantidad se actualiza, subtotal y total se recalculan
- Al eliminar: el item desaparece del carrito, total se recalcula

---

#### Paso 10: Proceder al Checkout

1. Click en **"Proceder al Checkout"**
2. Deberías ser redirigido a `/checkout`

**✅ Resultado Esperado (cuando esté implementado):**
- Paso 1: Seleccionar dirección de envío
  - Si no tienes direcciones, formulario para crear una
  - Si tienes, lista de direcciones con radio buttons
- Paso 2: Seleccionar método de pago
  - Efectivo
  - PayPal
  - (Stripe si está activo)
- Paso 3: Resumen del pedido
  - Productos
  - Dirección seleccionada
  - Método de pago
  - Total
  - Campo de notas opcionales
- Botón "Confirmar Pedido"

**⚠️ Estado Actual:**
- CheckoutPage tiene estructura básica pero **NO está completamente implementado**

---

#### Paso 11: Confirmar Pedido

1. Completa todos los pasos del checkout
2. Click en **"Confirmar Pedido"**

**✅ Resultado Esperado:**
- El pedido se crea en el backend
- El stock se reduce automáticamente
- El carrito se vacía
- Redirección a `/orders/{id}` (detalle del pedido)
- Si el método es PayPal, se abre ventana de PayPal

---

#### Paso 12: Ver Mis Pedidos

1. Navega a `/orders` (o click en "Mis Pedidos" en el navbar)

**✅ Resultado Esperado:**
- Lista de todos tus pedidos con:
  - Número de pedido
  - Fecha
  - Estado (Pendiente, Confirmado, Enviado, etc.)
  - Total
  - Botón "Ver Detalle"

**⚠️ Estado Actual:**
- OrdersPage tiene estructura pero **NO está conectado** con el backend

---

#### Paso 13: Ver Detalle de Pedido

1. Click en un pedido de la lista

**✅ Resultado Esperado:**
- Información completa del pedido:
  - Número de pedido
  - Fecha
  - Estado actual
  - Productos incluidos (nombre, cantidad, precio)
  - Dirección de envío
  - Método de pago
  - Subtotal, envío, total
  - Historial de cambios de estado
  - Botón "Cancelar Pedido" (si el estado lo permite)

---

#### Paso 14: Gestionar Perfil

1. Click en tu nombre en el navbar
2. Click en **"Mi Perfil"**
3. Navega a `/profile`

**✅ Resultado Esperado (cuando esté implementado):**
- **Tab "Datos Personales"**:
  - Nombre, Apellido, Email, Teléfono
  - Foto de perfil (opcional)
  - Botón "Editar"
- **Tab "Mis Direcciones"**:
  - Lista de direcciones guardadas
  - Indicador de dirección principal
  - Botones: Editar, Eliminar, Marcar como principal
  - Botón "Agregar Nueva Dirección"
- **Tab "Seguridad"** (opcional):
  - Cambiar contraseña

**⚠️ Estado Actual:**
- ProfilePage **NO está implementado**

---

#### Paso 15: Gestionar Favoritos

1. En la página de un producto, click en icono de corazón
2. El producto se agrega a favoritos
3. Navega a `/favorites`

**✅ Resultado Esperado (cuando esté implementado):**
- Grid de todos tus productos favoritos
- Botón "Eliminar de favoritos" en cada card
- Botón "Agregar al carrito" directo desde favoritos

**⚠️ Estado Actual:**
- FavoritesPage **NO está implementado**
- El botón de favoritos en ProductDetailPage podría no funcionar

---

#### Paso 16: Logout

1. Click en tu nombre en el navbar
2. Click en **"Cerrar Sesión"**

**✅ Resultado Esperado:**
- Se limpia el localStorage (tokens)
- Se limpia el store de autenticación
- Redirección a la página principal
- El navbar muestra "Iniciar Sesión" nuevamente

---

## 👨‍💼 Flujo de Prueba - Administrador

### Escenario: Admin gestiona el sistema completo

#### Paso 1: Login como Admin

1. Navega a `/login`
2. Ingresa credenciales de admin:
   ```
   Email: admin@smartsales365.com
   Password: Admin2024!
   ```
3. Click en **"Iniciar Sesión"**

**✅ Resultado Esperado:**
- Login exitoso
- **DEBERÍA** redirigir a `/admin` (dashboard)
- **ACTUALMENTE** redirige a `/` (bug conocido)

**Solución temporal:**
- Navega manualmente a `/admin`

---

#### Paso 2: Dashboard Administrativo

1. En `/admin`, deberías ver:
   - Sidebar con menú de navegación:
     - Dashboard (estadísticas) ❌ Pendiente
     - Usuarios ✅
     - Productos ✅
     - Categorías ✅
     - Marcas ❌ Pendiente
     - Roles ✅
     - Pedidos ❌ Pendiente
     - Reportes ❌ Pendiente
   - Área de contenido (Outlet)

**⚠️ Problema:**
- El item "Dashboard" redirige a `/admin/users` (no hay overview)

---

#### Paso 3: Gestión de Usuarios

1. Click en **"Usuarios"** en el sidebar
2. Deberías ver:
   - Tabla con todos los usuarios
   - Columnas: Nombre, Email, Rol, Estado (Activo/Inactivo)
   - Barra de búsqueda
   - Filtro por rol
   - Botón "Crear Usuario"
   - Botones de acción: Editar, Eliminar

**Pruebas:**

##### A. Buscar Usuario
1. Escribe "maria" en la búsqueda
2. La tabla se filtra en tiempo real

**✅ Resultado:** Solo aparecen usuarios con "maria" en nombre o email

##### B. Filtrar por Rol
1. Selecciona "Cliente" en el filtro
2. Solo aparecen usuarios con rol Cliente

##### C. Crear Usuario
1. Click en **"Crear Usuario"**
2. Llena el formulario:
   ```
   Nombre: Carlos
   Apellido: López
   Email: carlos.lopez@test.com
   Password: TestPass123!
   Rol: Empleado
   ```
3. Click en **"Guardar"**

**✅ Resultado:** Usuario creado, aparece en la tabla

##### D. Editar Usuario
1. Click en el botón "Editar" de un usuario
2. Modifica el teléfono
3. Click en "Guardar"

**✅ Resultado:** Cambios guardados

##### E. Eliminar Usuario (Soft Delete)
1. Click en "Eliminar"
2. Confirma la acción
3. El usuario desaparece de la lista (pero NO se elimina de la BD)

---

#### Paso 4: Gestión de Productos

1. Click en **"Productos"** en el sidebar

**Pruebas:**

##### A. Ver Grid de Productos
- Grid de cards con:
  - Imagen del producto
  - Nombre
  - Precio
  - Marca
  - Stock total
  - Badge de "Activo/Inactivo"
  - Badge de "Destacado" (si aplica)
  - Botones: Ver, Editar, Eliminar

##### B. Buscar Producto
1. Escribe "vestido" en la búsqueda
2. Grid se filtra en tiempo real

##### C. Crear Producto
1. Click en **"Crear Producto"**
2. Llena el formulario:
   ```
   Nombre: Vestido Casual Verano
   Descripción: Hermoso vestido para el verano...
   Precio: 299.99
   Marca: Zara (seleccionar del dropdown)
   Categorías: Vestidos (checkbox)
   Tallas: S, M, L (checkboxes)
   Color: Azul
   Material: Algodón
   Imagen: Subir archivo
   Stock por talla:
     - S: 10
     - M: 15
     - L: 8
   ```
3. Marcar como "Activo" y "Destacado"
4. Click en **"Guardar"**

**✅ Resultado:**
- Producto creado con slug auto-generado
- Aparece en el grid
- Stock creado para cada talla seleccionada

##### D. Editar Producto
1. Click en "Editar" de un producto
2. Cambia el precio a 350.00
3. Marca como "Es Novedad"
4. Click en "Guardar"

**✅ Resultado:** Cambios guardados

##### E. Eliminar Producto
1. Click en "Eliminar"
2. Confirma
3. El producto desaparece (soft delete)

---

#### Paso 5: Gestión de Categorías

1. Click en **"Categorías"** en el sidebar

**Pruebas:**

##### A. Ver Categorías
- Grid de cards con:
  - Icono
  - Nombre
  - Descripción (truncada)
  - Contador de productos
  - Botones: Editar, Eliminar

##### B. Crear Categoría
1. Click en **"Crear Categoría"**
2. Llena:
   ```
   Nombre: Accesorios
   Descripción: Carteras, cinturones, etc.
   Imagen: Subir archivo
   ```
3. Click en "Guardar"

**✅ Resultado:** Categoría creada

##### C. Editar Categoría
1. Click en "Editar"
2. Cambia la descripción
3. Guarda

##### D. Eliminar Categoría
1. Click en "Eliminar"
2. **Validación:** Si tiene productos asociados, muestra advertencia

---

#### Paso 6: Gestión de Roles

1. Click en **"Roles"** en el sidebar

**Pruebas:**

##### A. Ver Roles
- Grid de cards con:
  - Icono de Shield
  - Nombre del rol
  - Lista de permisos (primeros 5 + contador)
  - Contador de usuarios con ese rol
  - Badge "Rol del Sistema" (no se puede eliminar)
  - Botones: Editar, Eliminar

##### B. Crear Rol Personalizado
1. Click en **"Crear Rol"**
2. Llena:
   ```
   Nombre: Supervisor
   Descripción: Supervisor de ventas
   Permisos: Seleccionar checkboxes de:
     - productos.leer
     - productos.actualizar
     - pedidos.leer
     - pedidos.actualizar
     - reportes.generar
   ```
3. Click en "Guardar"

**✅ Resultado:** Rol creado con permisos asignados

##### C. Editar Rol
1. Click en "Editar" de un rol NO del sistema
2. Agrega/quita permisos
3. Guarda

**✅ Resultado:** Permisos actualizados

##### D. Eliminar Rol
1. Click en "Eliminar" de un rol NO del sistema
2. **Validación:** Si tiene usuarios asignados, muestra advertencia
3. Confirma

**⚠️ Roles del Sistema:**
- Admin, Empleado, Cliente NO se pueden eliminar (es_rol_sistema=True)

---

#### Paso 7: Gestión de Pedidos (Pendiente)

**Ruta esperada:** `/admin/orders`

**Funcionalidades requeridas:**
- Tabla de todos los pedidos del sistema
- Filtros por:
  - Estado (Pendiente, Confirmado, Enviado, etc.)
  - Usuario (buscar por nombre/email)
  - Rango de fechas
  - Método de pago
- Acciones:
  - Ver detalle
  - Cambiar estado (dropdown)
  - Imprimir comprobante (PDF)
  - Cancelar pedido

**⚠️ Estado:** NO implementado

---

#### Paso 8: Reportes (Pendiente)

**Ruta esperada:** `/admin/reports`

**Funcionalidades requeridas:**
- Formulario para generar reportes dinámicos
- Campos:
  - Tipo de reporte (dropdown):
    - Ventas por período
    - Productos más vendidos
    - Clientes con más compras
    - Inventario bajo stock
  - Rango de fechas
  - Formato (PDF, Excel, Pantalla)
  - Agrupación (opcional): por producto, categoría, cliente
- Botón "Generar Reporte"
- **Bonus:** Input de texto/voz para prompts libres
  - Ejemplo: "Quiero un reporte de ventas de septiembre en PDF"

**⚠️ Estado:** NO implementado (parte de Ciclo 2)

---

## 👷 Flujo de Prueba - Empleado

### Escenario: Empleado realiza ventas y gestiona inventario

#### Paso 1: Login como Empleado

1. Navega a `/login`
2. Credenciales:
   ```
   Email: empleado@smartsales365.com
   Password: Empleado2024!
   ```

**✅ Resultado Esperado:**
- Login exitoso
- Redirige a `/admin` (mismo dashboard que Admin)
- **PERO** no puede ver/editar usuarios ni roles

---

#### Paso 2: Verificar Permisos

1. En el sidebar del dashboard, intenta acceder a "Usuarios"

**✅ Resultado Esperado:**
- Si la verificación de permisos está implementada:
  - El item "Usuarios" NO aparece en el menú
  - O aparece deshabilitado
- Si NO está implementada (actualmente):
  - Aparece el item pero **NO debería**

**⚠️ Problema Conocido:**
- La función `hasPermission()` siempre retorna `true`
- Empleados pueden ver secciones que NO deberían

---

#### Paso 3: Gestionar Productos

1. Click en "Productos"
2. El empleado **SÍ** tiene permisos para:
   - Ver productos
   - Crear productos
   - Editar productos
   - Eliminar productos

**Prueba:** Crea un producto nuevo

**✅ Resultado:** Funciona correctamente

---

#### Paso 4: Gestionar Pedidos (cuando esté implementado)

1. Click en "Pedidos"
2. El empleado puede:
   - Ver todos los pedidos
   - Cambiar estados (Confirmado → Preparando → Enviado)
   - NO puede cancelar pedidos (solo Admin)

---

## 🧪 Casos de Prueba por Módulo

### Módulo: Autenticación

| # | Caso de Prueba                            | Pasos                                                | Resultado Esperado                        | Estado |
|---|-------------------------------------------|------------------------------------------------------|-------------------------------------------|--------|
| 1 | Registro exitoso                          | Llenar formulario válido y enviar                    | Usuario creado, redirige a login          | ✅      |
| 2 | Registro con email duplicado              | Intentar registrar email existente                   | Error "Email ya existe"                   | ✅      |
| 3 | Login exitoso (Admin)                     | Credenciales de admin                                | Redirige a `/admin`                       | ❌      |
| 4 | Login exitoso (Cliente)                   | Credenciales de cliente                              | Redirige a `/`                            | ⚠️      |
| 5 | Login con credenciales incorrectas        | Email o password inválido                            | Error "Credenciales inválidas"            | ✅      |
| 6 | Logout                                    | Click en cerrar sesión                               | Limpia store y localStorage, redirige     | ✅      |
| 7 | Acceso a ruta protegida sin login         | Ir a `/cart` sin estar autenticado                   | Redirige a `/login`                       | ✅      |
| 8 | Refresh token automático                  | Esperar 60 min (token expira)                        | Se refresca automáticamente               | ❌      |

---

### Módulo: Productos

| # | Caso de Prueba                | Pasos                                | Resultado Esperado                     | Estado |
|---|-------------------------------|--------------------------------------|----------------------------------------|--------|
| 1 | Ver catálogo                  | Ir a `/products`                     | Lista de productos con imágenes        | ✅      |
| 2 | Buscar producto               | Escribir en búsqueda                 | Productos filtrados                    | ✅      |
| 3 | Filtrar por categoría         | Seleccionar categoría                | Solo productos de esa categoría        | ✅      |
| 4 | Filtrar por marca             | Seleccionar marca                    | Solo productos de esa marca            | ✅      |
| 5 | Filtrar por precio            | Ajustar rango de precio              | Productos dentro del rango             | ✅      |
| 6 | Ver detalle                   | Click en un producto                 | Detalle completo con stock             | ✅      |
| 7 | Ver stock por talla           | Seleccionar talla en detalle         | Muestra stock disponible               | ✅      |
| 8 | Agregar a carrito (autenticado)| Agregar producto con talla          | Mensaje de éxito, carrito actualizado  | ⚠️      |
| 9 | Agregar a carrito (sin login) | Intentar agregar sin estar autenticado| Redirige a login                      | ✅      |

---

### Módulo: Carrito

| # | Caso de Prueba              | Pasos                                  | Resultado Esperado               | Estado |
|---|-----------------------------|----------------------------------------|----------------------------------|--------|
| 1 | Ver carrito vacío           | Ir a `/cart` sin items                 | Mensaje "Carrito vacío"          | ❌      |
| 2 | Ver carrito con items       | Ir a `/cart` con items agregados       | Lista de items con totales       | ❌      |
| 3 | Incrementar cantidad        | Click en botón "+"                     | Cantidad actualizada, total recalculado | ❌ |
| 4 | Decrementar cantidad        | Click en botón "-"                     | Cantidad actualizada (mín 1)     | ❌      |
| 5 | Eliminar item               | Click en "Eliminar"                    | Item desaparece, total recalcula | ❌      |
| 6 | Vaciar carrito              | Click en "Vaciar carrito"              | Todos los items eliminados       | ❌      |
| 7 | Validación de stock         | Intentar agregar más que el stock      | Error "Stock insuficiente"       | ❌      |

---

### Módulo: Checkout

| # | Caso de Prueba                 | Pasos                                       | Resultado Esperado                  | Estado |
|---|--------------------------------|---------------------------------------------|-------------------------------------|--------|
| 1 | Acceder a checkout sin items   | Ir a `/checkout` con carrito vacío          | Redirige a `/cart`                  | ❌      |
| 2 | Seleccionar dirección          | Elegir dirección de la lista                | Dirección marcada como seleccionada | ❌      |
| 3 | Crear nueva dirección          | Llenar formulario de dirección              | Dirección creada y seleccionada     | ❌      |
| 4 | Seleccionar método de pago     | Elegir "Efectivo" o "PayPal"                | Método marcado                      | ❌      |
| 5 | Ver resumen                    | Avanzar a paso 3                            | Resumen completo del pedido         | ❌      |
| 6 | Confirmar pedido (Efectivo)    | Click en "Confirmar"                        | Pedido creado, redirige a detalle   | ❌      |
| 7 | Confirmar pedido (PayPal)      | Click en "Confirmar"                        | Abre ventana de PayPal              | ❌      |
| 8 | Carrito se vacía tras pedido   | Después de confirmar, revisar carrito       | Carrito vacío                       | ❌      |

---

### Módulo: Pedidos

| # | Caso de Prueba           | Pasos                              | Resultado Esperado                | Estado |
|---|--------------------------|------------------------------------|-----------------------------------|--------|
| 1 | Ver mis pedidos          | Ir a `/orders`                     | Lista de todos mis pedidos        | ❌      |
| 2 | Ver detalle de pedido    | Click en un pedido                 | Información completa del pedido   | ❌      |
| 3 | Cancelar pedido (permite)| Cancelar pedido pendiente          | Estado cambia a "Cancelado"       | ❌      |
| 4 | Cancelar pedido (no permite)| Intentar cancelar pedido enviado| Error "No se puede cancelar"      | ❌      |

---

### Módulo: Dashboard Admin

| # | Caso de Prueba                    | Pasos                                  | Resultado Esperado                     | Estado |
|---|-----------------------------------|----------------------------------------|----------------------------------------|--------|
| 1 | Acceso solo Admin/Empleado        | Intentar acceder con rol Cliente       | Redirige a `/`                         | ✅      |
| 2 | Ver lista de usuarios             | Ir a `/admin/users`                    | Tabla de usuarios completa             | ✅      |
| 3 | Buscar usuario                    | Escribir en búsqueda                   | Usuarios filtrados                     | ✅      |
| 4 | Crear usuario                     | Llenar formulario y guardar            | Usuario creado                         | ✅      |
| 5 | Editar usuario                    | Modificar datos y guardar              | Cambios guardados                      | ✅      |
| 6 | Eliminar usuario (soft delete)    | Click en eliminar y confirmar          | Usuario desaparece (is_deleted=true)   | ✅      |
| 7 | Ver lista de productos            | Ir a `/admin/products`                 | Grid de productos                      | ✅      |
| 8 | Crear producto con stock          | Crear producto con 3 tallas            | Producto + 3 registros de stock        | ✅      |
| 9 | Ver roles                         | Ir a `/admin/roles`                    | Grid de roles con permisos             | ✅      |
| 10| Crear rol personalizado           | Crear rol con permisos seleccionados   | Rol creado                             | ✅      |
| 11| Verificación de permisos (Admin)  | Admin accede a todo                    | Sin restricciones                      | ⚠️      |
| 12| Verificación de permisos (Empleado)| Empleado no ve usuarios ni roles      | Items ocultos o deshabilitados         | ❌      |

---

## 🐛 Errores Comunes y Soluciones

### 1. Error 401 (Unauthorized)

**Síntomas:**
- Al hacer peticiones, el backend retorna 401
- El usuario es redirigido al login constantemente

**Causas:**
- Token expirado (después de 60 minutos)
- Token no se está enviando en el header

**Soluciones:**
1. Verifica que el token esté en localStorage:
   ```javascript
   console.log(localStorage.getItem('access_token'));
   ```
2. Verifica el interceptor de request en `api.config.ts`
3. Si el token expiró, debería refrescarse automáticamente (NO implementado aún)

**Solución temporal:** Vuelve a hacer login

---

### 2. CORS Error

**Síntomas:**
- Error en consola: "Access to XMLHttpRequest has been blocked by CORS policy"

**Causas:**
- Backend no tiene CORS configurado para el frontend

**Solución:**
1. En el backend, verifica `config/settings/base.py`:
   ```python
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:5173",  # Frontend Vite
       "http://localhost:3000",  # Alternativa
   ]
   ```
2. Reinicia el backend

---

### 3. Carrito no se actualiza

**Síntomas:**
- Agregas producto pero el contador del navbar no cambia
- El carrito aparece vacío

**Causas:**
- CartPage no está conectado con el servicio
- El servicio `cart.service.ts` existe pero la página no lo usa

**Solución:**
- Implementar la conexión (ver sección de Carrito en documentation_guide.md)

---

### 4. Login siempre redirige a "/"

**Síntomas:**
- Haces login como Admin pero vas a la página principal, no al dashboard

**Causa:**
- Bug conocido en `LoginPage.tsx` línea 33

**Solución temporal:**
- Navega manualmente a `/admin`

**Solución permanente:**
```typescript
// Cambiar esto:
navigate("/");

// Por esto:
const rol = response.user.rol_detalle?.nombre;
if (rol === "Admin" || rol === "Empleado") {
  navigate("/admin");
} else {
  navigate("/");
}
```

---

### 5. Imágenes de productos no se ven

**Síntomas:**
- Los productos aparecen sin imagen o con imagen rota

**Causas:**
- Las imágenes están en S3 pero `USE_S3=False`
- No se subieron imágenes con el seeder

**Solución:**
1. Ejecutar script de subida a S3:
   ```bash
   python scripts/upload_to_s3.py --category vestidos --folder ./datasets/vestidos/
   ```
2. O usar imágenes placeholder en el seeder

---

### 6. Filtros de productos no funcionan

**Síntomas:**
- Cambias filtros pero los productos no se actualizan

**Causa:**
- Falta el `useEffect` que escucha cambios en los filtros

**Solución:**
```typescript
useEffect(() => {
  loadProducts();
}, [filters]); // Agregar filters como dependencia
```

---

## ✅ Checklist de Testing Completo

### Funcionalidades Básicas
- [ ] Registro de usuario
- [ ] Login (Admin, Empleado, Cliente)
- [ ] Logout
- [ ] Ver catálogo de productos
- [ ] Buscar productos
- [ ] Filtrar productos (categoría, marca, precio)
- [ ] Ver detalle de producto
- [ ] Agregar al carrito
- [ ] Ver carrito
- [ ] Modificar cantidad en carrito
- [ ] Eliminar item del carrito
- [ ] Proceder al checkout
- [ ] Seleccionar dirección de envío
- [ ] Seleccionar método de pago
- [ ] Confirmar pedido
- [ ] Ver mis pedidos
- [ ] Ver detalle de pedido
- [ ] Cancelar pedido

### Panel Administrativo
- [ ] Acceso al dashboard admin
- [ ] Ver lista de usuarios
- [ ] Crear usuario
- [ ] Editar usuario
- [ ] Eliminar usuario (soft delete)
- [ ] Ver lista de productos
- [ ] Crear producto
- [ ] Editar producto
- [ ] Eliminar producto
- [ ] Ver categorías
- [ ] CRUD de categorías
- [ ] Ver roles
- [ ] CRUD de roles
- [ ] Verificación de permisos por rol

### Funcionalidades Avanzadas (Ciclo 2)
- [ ] Gestión de favoritos
- [ ] Gestión de perfil
- [ ] Cambiar contraseña
- [ ] Generar reportes dinámicos
- [ ] Dashboard con estadísticas
- [ ] Predicción de ventas (IA)
- [ ] Notificaciones en tiempo real

---

**Última actualización:** 6 de Noviembre 2025

**Estado del Testing:**
- Funcionalidades básicas: 60% probables
- Panel admin: 70% probables
- Funcionalidades avanzadas: 0% (pendientes)
