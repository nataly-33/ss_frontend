# 🧪 Guía de Testing Manual - SmartSales Frontend

**Versión:** 2.3
**Fecha:** 6 de Noviembre, 2025
**Actualizado:** Con RegisterPage, CheckoutPage, ProfilePage, OrdersPage refactorizados

---

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Preparación del Entorno](#preparación-del-entorno)
3. [Casos de Prueba por Módulo](#casos-de-prueba-por-módulo)
4. [Flujos End-to-End](#flujos-end-to-end)
5. [Checklist de Validación](#checklist-de-validación)

---

## 🎯 Introducción

Esta guía proporciona instrucciones paso a paso para probar TODAS las funcionalidades del frontend de SmartSales contra el backend en Django.

### Objetivo

Verificar que:
- ✅ Todas las páginas cargan correctamente
- ✅ Los servicios se conectan al backend
- ✅ La autenticación funciona (JWT)
- ✅ Los flujos de usuario son intuitivos
- ✅ No hay errores en consola
- ✅ El diseño es responsivo

---

## 🛠️ Preparación del Entorno

### 1. Levantar el Backend

```bash
cd ss_backend
python manage.py runserver
```

**Verificar:** Backend corriendo en `http://localhost:8000`

### 2. Levantar el Frontend

```bash
cd ss_frontend
npm run dev
```

**Verificar:** Frontend corriendo en `http://localhost:5173`

### 3. Crear Datos de Prueba (Si es necesario)

```bash
cd ss_backend
python scripts/seed_data.py
```

Esto creará:
- 2 usuarios: admin (admin@test.com) y cliente (cliente@test.com)
- Productos de ejemplo
- Categorías
- Métodos de pago

**Credenciales por defecto:**
- **Admin:** admin@test.com / Admin123!
- **Cliente:** cliente@test.com / Cliente123!

---

## 🧪 Casos de Prueba por Módulo

---

### 🔐 Módulo: Autenticación

#### **TC-AUTH-001: Registro de Usuario**

**Ruta:** `/register`

**Pasos:**
1. Navegar a `http://localhost:5173/register`
2. Verificar que se muestra el formulario de registro
3. Llenar campos:
   - **Nombre:** Juan
   - **Apellido:** Pérez
   - **Email:** juan.perez@test.com
   - **Teléfono:** +591 75123456
   - **Contraseña:** Test1234
   - **Confirmar Contraseña:** Test1234
4. Marcar checkbox de "Acepto los términos y condiciones"
5. Click en "Crear cuenta"

**Resultado Esperado:**
- ✅ Aparece pantalla de éxito con checkmark verde
- ✅ Mensaje: "¡Cuenta creada exitosamente!"
- ✅ Auto-redirect a `/login` después de 3 segundos
- ✅ No hay errores en consola

**Validaciones a probar:**
- ❌ Email inválido (sin @): debe mostrar error
- ❌ Contraseña menor a 8 caracteres: debe mostrar error
- ❌ Contraseñas no coinciden: debe mostrar error
- ❌ Términos no aceptados: botón deshabilitado

---

#### **TC-AUTH-002: Login de Cliente**

**Ruta:** `/login`

**Pasos:**
1. Navegar a `http://localhost:5173/login`
2. Llenar campos:
   - **Email:** cliente@test.com
   - **Contraseña:** Cliente123!
3. Click en "Iniciar sesión"

**Resultado Esperado:**
- ✅ Redirect a `/` (HomePage)
- ✅ Navbar muestra "Hola, [Nombre]" y opciones de usuario
- ✅ Token guardado en localStorage
- ✅ No hay errores en consola

**Validaciones a probar:**
- ❌ Email incorrecto: debe mostrar error del backend
- ❌ Contraseña incorrecta: debe mostrar error del backend
- ✅ Toggle de visibilidad de contraseña funciona (icono Eye/EyeOff)

---

#### **TC-AUTH-003: Login de Admin**

**Ruta:** `/login`

**Pasos:**
1. Navegar a `http://localhost:5173/login`
2. Llenar campos:
   - **Email:** admin@test.com
   - **Contraseña:** Admin123!
3. Click en "Iniciar sesión"

**Resultado Esperado:**
- ✅ Redirect a `/admin` (AdminDashboard)
- ✅ Navbar muestra opciones de admin
- ✅ Token guardado en localStorage
- ✅ No hay errores en consola

---

#### **TC-AUTH-004: Logout**

**Pasos:**
1. Estando logueado, click en menú de usuario (navbar)
2. Click en "Cerrar sesión"

**Resultado Esperado:**
- ✅ Redirect a `/login`
- ✅ Token eliminado de localStorage
- ✅ Navbar vuelve a estado no autenticado

---

### 🛒 Módulo: Carrito

#### **TC-CART-001: Ver Carrito Vacío**

**Ruta:** `/cart`

**Precondición:** Usuario logueado como cliente

**Pasos:**
1. Navegar a `/cart`
2. Verificar que carrito está vacío (o limpiarlo manualmente)

**Resultado Esperado:**
- ✅ Muestra componente EmptyCart con icono de shopping bag
- ✅ Mensaje: "Tu carrito está vacío"
- ✅ Botón "Explorar productos" navega a `/products`

---

#### **TC-CART-002: Agregar Producto al Carrito**

**Ruta:** `/products/:slug`

**Pasos:**
1. Navegar a `/products`
2. Click en un producto
3. Seleccionar una talla del dropdown
4. Cambiar cantidad (ej: 2)
5. Click en "Agregar al carrito"

**Resultado Esperado:**
- ✅ Mensaje de éxito (toast o notificación)
- ✅ Contador de carrito en navbar se actualiza
- ❌ **NOTA:** Actualmente comentado en ProductCard debido a que backend devuelve tallas como string en lugar de array

**Pendiente:** Backend debe devolver `tallas_disponibles_detalle` como:
```json
[
  { "id": "1", "nombre": "S", "stock": 5 },
  { "id": "2", "nombre": "M", "stock": 3 }
]
```

---

#### **TC-CART-003: Ver Carrito con Items**

**Ruta:** `/cart`

**Precondición:** Carrito con al menos 1 item

**Pasos:**
1. Navegar a `/cart`

**Resultado Esperado:**
- ✅ Muestra lista de CartItem (imagen, nombre, talla, precio)
- ✅ Cada item tiene botones +/- para cantidad
- ✅ Cada item tiene botón de eliminar (X rojo)
- ✅ CartSummary muestra subtotal, envío, total correctamente
- ✅ Botón "Proceder al pago" habilitado

---

#### **TC-CART-004: Actualizar Cantidad de Item**

**Ruta:** `/cart`

**Pasos:**
1. En un item del carrito, click en botón "+"
2. Verificar que cantidad aumenta
3. Click en botón "-"
4. Verificar que cantidad disminuye

**Resultado Esperado:**
- ✅ Cantidad se actualiza en el item
- ✅ Subtotal del item se recalcula
- ✅ Total en CartSummary se actualiza
- ✅ Llamada a `cartService.updateItem()` exitosa
- ❌ Si cantidad es 1, botón "-" debe estar deshabilitado o eliminar el item

---

#### **TC-CART-005: Eliminar Item del Carrito**

**Ruta:** `/cart`

**Pasos:**
1. Click en botón de eliminar (X) de un item
2. Confirmar en el diálogo

**Resultado Esperado:**
- ✅ Item desaparece del carrito
- ✅ Total se recalcula
- ✅ Llamada a `cartService.removeItem()` exitosa
- ✅ Si era el último item, muestra EmptyCart

---

### 💳 Módulo: Checkout

#### **TC-CHECKOUT-001: Acceder a Checkout sin Carrito**

**Ruta:** `/checkout`

**Precondición:** Carrito vacío

**Pasos:**
1. Navegar directamente a `/checkout`

**Resultado Esperado:**
- ✅ Redirect automático a `/products`
- ✅ Mensaje indicando que el carrito está vacío

---

#### **TC-CHECKOUT-002: Proceso Completo de Checkout**

**Ruta:** `/checkout`

**Precondición:** 
- Usuario logueado como cliente
- Carrito con al menos 1 item
- Usuario tiene al menos 1 dirección guardada

**Pasos:**
1. Desde `/cart`, click en "Proceder al pago"
2. Verificar que carga checkout con loading spinner
3. **Sección Direcciones:**
   - Verificar que se muestran direcciones del usuario
   - Dirección principal debe estar pre-seleccionada
   - Seleccionar una dirección (radio button)
4. **Sección Métodos de Pago:**
   - Verificar que se muestran métodos de pago disponibles
   - Primer método activo debe estar pre-seleccionado
   - Seleccionar un método (radio button)
5. **Sección Resumen:**
   - Verificar que muestra items del carrito
   - Verificar que muestra dirección seleccionada
   - Verificar que muestra método de pago seleccionado
   - Agregar notas opcionales (ej: "Tocar timbre 2 veces")
   - Verificar totales (subtotal + envío)
6. Click en "Confirmar pedido"

**Resultado Esperado:**
- ✅ Botón muestra loading spinner
- ✅ Se crea el pedido exitosamente
- ✅ Carrito se vacía (llamada a `clearCart()`)
- ✅ Redirect a `/orders/{orderId}`
- ✅ No hay errores en consola

**Validaciones:**
- ❌ Si no hay dirección seleccionada: botón "Confirmar" deshabilitado
- ❌ Si no hay método de pago seleccionado: botón "Confirmar" deshabilitado

---

#### **TC-CHECKOUT-003: Agregar Nueva Dirección desde Checkout**

**Ruta:** `/checkout`

**Pasos:**
1. En sección de direcciones, click en "Agregar nueva dirección"

**Resultado Esperado:**
- ✅ Abre modal o navega a formulario
- ❌ **NOTA:** Actualmente es placeholder (alerta), pendiente implementación completa

---

### 👤 Módulo: Perfil (Customers)

#### **TC-PROFILE-001: Ver Datos Personales**

**Ruta:** `/profile`

**Precondición:** Usuario logueado como cliente

**Pasos:**
1. Navegar a `/profile`
2. Verificar que tab "Datos Personales" está activo por defecto

**Resultado Esperado:**
- ✅ Muestra ProfileForm con datos del usuario
- ✅ Campos de solo lectura: nombre, apellido, email (con helper text indicando contactar soporte)
- ✅ Campos editables deshabilitados: teléfono, fecha nacimiento, género
- ✅ Muestra saldo de billetera con botón "Recargar"
- ✅ Botón "Editar" visible

---

#### **TC-PROFILE-002: Editar Datos Personales**

**Ruta:** `/profile` (tab Datos Personales)

**Pasos:**
1. Click en botón "Editar"
2. Campos editables se habilitan
3. Modificar teléfono: +591 78999888
4. Seleccionar fecha de nacimiento: 15/08/1990
5. Seleccionar género: Femenino
6. Click en "Guardar cambios"

**Resultado Esperado:**
- ✅ Botón muestra loading spinner
- ✅ Llamada a `customersService.updateProfile()` exitosa
- ✅ Campos vuelven a estar deshabilitados
- ✅ Datos actualizados visibles
- ✅ Botón "Editar" reaparece

**Validación:**
- ✅ Botón "Cancelar" descarta cambios y vuelve a modo vista

---

#### **TC-PROFILE-003: Ver Direcciones**

**Ruta:** `/profile` (tab Mis Direcciones)

**Pasos:**
1. Click en tab "Mis Direcciones"
2. Verificar listado de direcciones

**Resultado Esperado:**
- ✅ Muestra AddressList con grid de tarjetas
- ✅ Dirección principal tiene badge "Principal" con estrella
- ✅ Cada dirección muestra: calle, número, colonia, ciudad, estado, CP, referencias
- ✅ Botones visibles: "Hacer principal" (si no es principal), "Editar", "Eliminar"
- ✅ Botón "Nueva dirección" en header

**Si no hay direcciones:**
- ✅ Muestra empty state con icono de mapa
- ✅ Mensaje: "No tienes direcciones guardadas"

---

#### **TC-PROFILE-004: Crear Nueva Dirección**

**Ruta:** `/profile` (tab Mis Direcciones)

**Pasos:**
1. Click en "Nueva dirección"
2. Verificar que abre modal AddressForm
3. Llenar campos:
   - **Calle:** Av. 16 de Julio
   - **N° Exterior:** 1234
   - **N° Interior:** Depto 5A (opcional)
   - **Colonia/Zona:** Sopocachi
   - **Ciudad:** La Paz
   - **Estado:** La Paz
   - **Código Postal:** 00000
   - **Referencias:** Casa esquina, portón azul
4. Marcar checkbox "Establecer como dirección principal"
5. Click en "Crear dirección"

**Resultado Esperado:**
- ✅ Modal se cierra
- ✅ Nueva dirección aparece en AddressList
- ✅ Si se marcó como principal, tiene badge "Principal"
- ✅ Llamada a `customersService.createAddress()` exitosa
- ✅ Lista se recarga

---

#### **TC-PROFILE-005: Editar Dirección**

**Ruta:** `/profile` (tab Mis Direcciones)

**Pasos:**
1. Click en botón "Editar" (ícono de lápiz) de una dirección
2. Verificar que abre modal con datos pre-llenados
3. Modificar campo "Referencias": "Edificio azul, 2do piso"
4. Click en "Guardar cambios"

**Resultado Esperado:**
- ✅ Modal se cierra
- ✅ Dirección actualizada visible en lista
- ✅ Llamada a `customersService.updateAddress()` exitosa

---

#### **TC-PROFILE-006: Eliminar Dirección**

**Ruta:** `/profile` (tab Mis Direcciones)

**Pasos:**
1. Click en botón "Eliminar" (ícono de basura rojo)
2. Confirmar en diálogo de confirmación

**Resultado Esperado:**
- ✅ Dirección desaparece de la lista
- ✅ Llamada a `customersService.deleteAddress()` exitosa

**Validación:**
- ❌ No debería permitir eliminar la única dirección principal (opcional)

---

#### **TC-PROFILE-007: Hacer Dirección Principal**

**Ruta:** `/profile` (tab Mis Direcciones)

**Precondición:** Usuario tiene al menos 2 direcciones

**Pasos:**
1. En una dirección que NO es principal, click en "Hacer principal"

**Resultado Esperado:**
- ✅ Badge "Principal" se mueve a esta dirección
- ✅ Dirección anterior pierde el badge
- ✅ Llamada a `customersService.updateAddress(id, { es_principal: true })` exitosa

---

#### **TC-PROFILE-008: Cambiar Contraseña**

**Ruta:** `/profile` (tab Seguridad)

**Pasos:**
1. Click en tab "Seguridad"
2. Verificar que muestra SecuritySettings
3. Llenar campos:
   - **Contraseña actual:** Cliente123!
   - **Nueva contraseña:** NuevaPass123!
   - **Confirmar nueva contraseña:** NuevaPass123!
4. Verificar toggles de visibilidad funcionan (Eye icons)
5. Click en "Cambiar contraseña"

**Resultado Esperado:**
- ✅ Botón muestra loading spinner
- ✅ Aparece mensaje de éxito en verde: "✓ Contraseña actualizada exitosamente"
- ✅ Form se limpia
- ✅ No hay errores

**Validaciones a probar:**
- ❌ Contraseña actual incorrecta: debe mostrar error
- ❌ Nueva contraseña menor a 8 caracteres: debe mostrar error de validación
- ❌ Contraseñas no coinciden: debe mostrar error de validación
- ❌ Nueva contraseña igual a la actual: debe mostrar error de validación

---

### 📦 Módulo: Pedidos (Orders)

#### **TC-ORDERS-001: Ver Lista de Pedidos Vacía**

**Ruta:** `/orders`

**Precondición:** Usuario sin pedidos

**Pasos:**
1. Navegar a `/orders`

**Resultado Esperado:**
- ✅ Muestra empty state con ícono de paquete
- ✅ Mensaje: "No tienes pedidos aún"
- ✅ Sugerencia: "Comienza a explorar nuestros productos..."

---

#### **TC-ORDERS-002: Ver Lista de Pedidos**

**Ruta:** `/orders`

**Precondición:** Usuario tiene pedidos

**Pasos:**
1. Navegar a `/orders`
2. Verificar que carga con loading spinner
3. Verificar grid de OrderCard

**Resultado Esperado:**
- ✅ Muestra grid de pedidos (1 col móvil, 2 tablet, 3 desktop)
- ✅ Cada OrderCard muestra:
  - Número de pedido
  - Fecha en formato legible (ej: "23 de octubre, 2025")
  - Badge de estado con color (pendiente: amarillo, procesando: azul, enviado: púrpura, entregado: verde, cancelado: rojo)
  - Preview de primeros 2 items con imágenes
  - "+X artículos más" si hay más de 2
  - Total del pedido
  - Botón "Ver detalles"
- ✅ Contador de resultados: "Mostrando X de X pedidos"

---

#### **TC-ORDERS-003: Filtrar Pedidos por Estado**

**Ruta:** `/orders`

**Pasos:**
1. Click en botón "Filtros"
2. Verificar que abre panel flotante
3. En dropdown "Estado", seleccionar "Entregado"
4. Click en "Aplicar"

**Resultado Esperado:**
- ✅ Panel se cierra
- ✅ Lista muestra solo pedidos con estado "entregado"
- ✅ Contador de filtros activos en botón: badge con "1"
- ✅ Contador de resultados actualizado: "Mostrando X de Y pedidos"

---

#### **TC-ORDERS-004: Filtrar Pedidos por Rango de Fechas**

**Ruta:** `/orders`

**Pasos:**
1. Click en botón "Filtros"
2. Seleccionar "Desde": 01/10/2025
3. Seleccionar "Hasta": 31/10/2025
4. Click en "Aplicar"

**Resultado Esperado:**
- ✅ Lista muestra solo pedidos entre esas fechas
- ✅ Badge de filtros activos muestra "2"

---

#### **TC-ORDERS-005: Limpiar Filtros**

**Ruta:** `/orders`

**Pasos:**
1. Con filtros aplicados, abrir panel de filtros
2. Click en "Limpiar"

**Resultado Esperado:**
- ✅ Todos los filtros se resetean
- ✅ Lista muestra todos los pedidos nuevamente
- ✅ Badge de filtros desaparece del botón

---

#### **TC-ORDERS-006: Ver Detalle de Pedido**

**Ruta:** `/orders/:id`

**Pasos:**
1. Desde OrdersPage, click en "Ver detalles" de un pedido
2. Verificar que navega a `/orders/{id}`
3. Verificar que carga con loading spinner

**Resultado Esperado:**
- ✅ **Columna Izquierda (OrderDetail):**
  - Header con número de pedido y total grande
  - Fecha completa con hora
  - Sección "Artículos (X)" con todos los items:
    - Imagen del producto
    - Nombre, talla, cantidad
    - Precio unitario y subtotal
  - Totales: subtotal y total
  - Sección "Dirección de envío" completa
  - Sección "Método de pago" con nombre y tipo
  - Sección "Información del cliente" con nombre y email

- ✅ **Columna Derecha (OrderTimeline):**
  - Timeline vertical con 4 pasos:
    - Pedido recibido (CheckCircle icon)
    - Procesando (Package icon)
    - Enviado (Truck icon)
    - Entregado (Home icon)
  - Paso actual con animación pulse
  - Pasos completados con checkmark verde
  - Línea de progreso vertical coloreada hasta paso actual
  - Si estado es "enviado": mensaje de entrega estimada (3-5 días)

- ✅ **Botón "Volver a mis pedidos"** en header

---

#### **TC-ORDERS-007: Cancelar Pedido**

**Ruta:** `/orders/:id`

**Precondición:** Pedido en estado "pendiente" o "procesando"

**Pasos:**
1. En OrderDetailPage, verificar que botón "Cancelar pedido" está visible (rojo)
2. Click en "Cancelar pedido"
3. Confirmar en diálogo

**Resultado Esperado:**
- ✅ Botón muestra loading spinner
- ✅ Llamada a `ordersService.cancelOrder(id)` exitosa
- ✅ Página se recarga mostrando nuevo estado "cancelado"
- ✅ Timeline muestra estado especial para cancelado (emoji ❌, fondo rojo)
- ✅ Botón "Cancelar pedido" desaparece

**Validación:**
- ❌ Si pedido está en estado "enviado" o "entregado", botón NO debe aparecer

---

### 🏠 Módulo: Productos

#### **TC-PRODUCTS-001: Ver HomePage**

**Ruta:** `/`

**Pasos:**
1. Navegar a `http://localhost:5173/`

**Resultado Esperado:**
- ✅ HeroCarousel se muestra correctamente en la parte superior
- ✅ Slides cambian automáticamente cada 5 segundos
- ✅ Botones de navegación (flechas) funcionan
- ✅ Sección "Productos Destacados" muestra grid de ProductCard
- ✅ Sección "Recién Llegados" muestra grid de ProductCard
- ✅ ProductCard tiene sombras 3D y hover effect (elevación)

---

#### **TC-PRODUCTS-002: Ver Catálogo Completo**

**Ruta:** `/products`

**Pasos:**
1. Click en "Ver todo el catálogo" desde HomePage o navegar a `/products`

**Resultado Esperado:**
- ✅ Muestra grid de ProductCard
- ✅ ProductFilters en sidebar (o modal en móvil)
- ✅ Productos cargados desde backend
- ✅ Loading state mientras carga

---

#### **TC-PRODUCTS-003: Ver Detalle de Producto**

**Ruta:** `/products/:slug`

**Pasos:**
1. Desde ProductsPage, click en un ProductCard
2. Verificar que navega a `/products/{slug}`

**Resultado Esperado:**
- ✅ Muestra galería de imágenes (principal + thumbnails)
- ✅ Nombre, precio, descripción, categoría
- ✅ Selector de talla (dropdown)
- ✅ Selector de cantidad
- ✅ Botón "Agregar al carrito" (actualmente comentado)
- ✅ Tabs de información (Descripción, Cuidados, Envío)
- ✅ Sección de productos relacionados

---

## 🔄 Flujos End-to-End

### **E2E-001: Flujo Completo de Compra (Cliente Nuevo)**

**Objetivo:** Simular un usuario nuevo que se registra, explora, compra y revisa su pedido.

**Pasos:**

1. **Registro**
   - Navegar a `/register`
   - Registrar nuevo usuario
   - Confirmar redirect a `/login`

2. **Login**
   - Login con credenciales del nuevo usuario
   - Confirmar redirect a `/`

3. **Explorar Productos**
   - Navegar por HomePage
   - Click en "Ver todo el catálogo"
   - Filtrar por categoría
   - Click en un producto

4. **Agregar al Carrito**
   - Seleccionar talla
   - Ajustar cantidad
   - Click en "Agregar al carrito"
   - Verificar notificación de éxito

5. **Ver Carrito**
   - Navegar a `/cart`
   - Verificar item agregado
   - Ajustar cantidad si necesario

6. **Configurar Perfil (Primera vez)**
   - Navegar a `/profile`
   - Tab "Mis Direcciones"
   - Click en "Nueva dirección"
   - Crear dirección de envío
   - Marcar como principal

7. **Checkout**
   - Desde `/cart`, click en "Proceder al pago"
   - Verificar dirección pre-seleccionada
   - Seleccionar método de pago
   - Agregar notas opcionales
   - Click en "Confirmar pedido"

8. **Ver Pedido**
   - Verificar redirect a `/orders/{id}`
   - Revisar detalles del pedido
   - Verificar timeline en "Pedido recibido"

9. **Revisar Lista de Pedidos**
   - Navegar a `/orders`
   - Verificar que aparece el nuevo pedido
   - Filtrar por estado "pendiente"

**Resultado Esperado:**
- ✅ Flujo completo sin errores
- ✅ Todos los datos correctos en cada paso
- ✅ No hay errores en consola
- ✅ Pedido creado exitosamente en backend

---

### **E2E-002: Flujo de Gestión de Perfil**

**Pasos:**

1. Login como cliente existente
2. Navegar a `/profile`
3. **Tab Datos Personales:**
   - Editar teléfono, fecha nacimiento, género
   - Guardar cambios
4. **Tab Mis Direcciones:**
   - Crear 2 direcciones nuevas
   - Hacer la segunda como principal
   - Editar la primera
   - Eliminar una dirección
5. **Tab Seguridad:**
   - Cambiar contraseña
   - Logout
   - Login con nueva contraseña

**Resultado Esperado:**
- ✅ Todos los cambios se guardan correctamente
- ✅ Login con nueva contraseña funciona

---

### **E2E-003: Flujo de Admin**

**Pasos:**

1. Login como admin (admin@test.com)
2. Verificar redirect a `/admin`
3. Navegar a cada sección de admin:
   - Dashboard
   - Gestión de Usuarios
   - Gestión de Productos
   - Gestión de Categorías
   - Gestión de Roles
4. Crear un producto nuevo
5. Editar el producto
6. Logout

**Resultado Esperado:**
- ✅ Todas las secciones cargan correctamente
- ✅ CRUD de productos funciona
- ✅ Admin puede gestionar todos los módulos

---

## ✅ Checklist de Validación Final

### Funcionalidades Core

- [ ] **Autenticación**
  - [ ] Registro funciona
  - [ ] Login de cliente funciona
  - [ ] Login de admin funciona
  - [ ] Logout funciona
  - [ ] Tokens se guardan en localStorage
  - [ ] Protected routes redirigen a login si no autenticado

- [ ] **Carrito**
  - [ ] Agregar item funciona
  - [ ] Ver carrito funciona
  - [ ] Actualizar cantidad funciona
  - [ ] Eliminar item funciona
  - [ ] Empty state se muestra correctamente

- [ ] **Checkout**
  - [ ] Carga direcciones correctamente
  - [ ] Carga métodos de pago correctamente
  - [ ] Auto-selección funciona
  - [ ] Crear orden funciona
  - [ ] Carrito se vacía después de orden
  - [ ] Redirect a detalle de orden funciona

- [ ] **Perfil**
  - [ ] Ver datos personales funciona
  - [ ] Editar datos funciona
  - [ ] Ver direcciones funciona
  - [ ] Crear dirección funciona
  - [ ] Editar dirección funciona
  - [ ] Eliminar dirección funciona
  - [ ] Hacer dirección principal funciona
  - [ ] Cambiar contraseña funciona

- [ ] **Pedidos**
  - [ ] Ver lista de pedidos funciona
  - [ ] Filtrar por estado funciona
  - [ ] Filtrar por fecha funciona
  - [ ] Ver detalle de pedido funciona
  - [ ] Timeline se muestra correctamente
  - [ ] Cancelar pedido funciona

- [ ] **Productos**
  - [ ] HomePage carga correctamente
  - [ ] HeroCarousel funciona
  - [ ] Catálogo carga productos
  - [ ] Filtros funcionan
  - [ ] Detalle de producto funciona

### UI/UX

- [ ] Navbar se muestra correctamente
- [ ] Logo visible
- [ ] Colores del tema aplicados
- [ ] Botones tienen hover effects
- [ ] Loading spinners se muestran durante cargas
- [ ] Modales se abren y cierran correctamente
- [ ] Forms tienen validación
- [ ] Mensajes de error son claros
- [ ] Responsive en móvil, tablet, desktop

### Consola del Navegador

- [ ] No hay errores en consola
- [ ] No hay warnings críticos
- [ ] Peticiones HTTP exitosas (200, 201)
- [ ] Tokens se envían en headers (Authorization: Bearer)

---

## 🐛 Reporte de Errores

Si encuentras algún error durante el testing, repórtalo con este formato:

**Título:** Breve descripción del error

**Pasos para reproducir:**
1. Paso 1
2. Paso 2
3. Paso 3

**Resultado esperado:**
Lo que debería pasar

**Resultado actual:**
Lo que realmente pasó

**Consola:**
```
Errores de consola (si los hay)
```

**Screenshot:** (adjuntar si es posible)

---

## 📊 Conclusión

Al completar todos estos casos de prueba, habrás verificado:

✅ Todos los módulos del frontend
✅ Integración completa con el backend
✅ Flujos de usuario end-to-end
✅ UI/UX funcional y atractivo
✅ No hay errores bloqueantes

**¡Listo para producción!** 🚀
