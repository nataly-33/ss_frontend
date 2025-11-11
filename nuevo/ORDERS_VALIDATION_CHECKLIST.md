# ✅ Guía de Validación y Testing - Órdenes (Orders)

## 1. Validación de Tipos TypeScript

### Verificar que no hay errores de tipos

```bash
cd ss_frontend
npm run type-check
# o
tsc --noEmit
```

**Resultado esperado:** ✅ Sin errores de tipos

### Archivos a verificar

- ✅ `src/modules/orders/types/index.ts` - Tipos principales
- ✅ `src/modules/orders/components/OrderCard.tsx` - Usa `order.detalles`
- ✅ `src/modules/orders/components/OrderDetail.tsx` - Acceso seguro a propiedades
- ✅ `src/modules/orders/components/OrderTimeline.tsx` - Estados correctos
- ✅ `src/modules/orders/components/OrderFilter.tsx` - Filtros actualizados
- ✅ `src/modules/orders/pages/OrderDetailPage.tsx` - Timestamps correctos

---

## 2. Testing Manual en el Navegador

### Escenario 1: Listar órdenes (OrdersPage)

**Pasos:**

1. Navegar a `/pedidos` (mis pedidos)
2. Verificar que se cargan las órdenes

**Validaciones:**

- ✅ Se muestra la cantidad TOTAL de artículos (suma de cantidades), no solo número de items
  - Ejemplo: Si hay 2 camisetas + 1 pantalón = "3 artículos"
- ✅ No hay errores en la consola
- ✅ Los filtros funcionan con los estados correctos

**Estados esperados en filtro:**

```
- Pendiente de pago
- Pago recibido
- Confirmado
- Preparando
- Enviado
- Entregado
- Cancelado
- Reembolsado
```

### Escenario 2: Ver detalle de una orden (OrderDetailPage)

**Pasos:**

1. Hacer click en "Ver detalles" de una orden
2. Navegar a `/pedidos/:id`

**Validaciones:**

- ✅ No hay errores como `Cannot read properties of undefined (reading 'nombre')`
- ✅ Se muestra:
  - ✅ Número de pedido
  - ✅ Estado
  - ✅ Total
  - ✅ Artículos con cantidad correcta
  - ✅ Dirección de envío
  - ✅ Método de pago (con nombre, no vacío)
  - ✅ Información del cliente
  - ✅ Timeline del pedido
- ✅ No hay valores `undefined` o `null` donde no debería

### Escenario 3: OrderDetail - Método de Pago

**Verificación:**

```typescript
// En OrderDetail.tsx
const metodoPago = getPaymentMethodData(order);

// Debe mostrar:
// - Nombre del método: "Tarjeta de Crédito", "PayPal", etc.
// - NO debe estar vacío
// - NO debe mostrar `undefined`
```

### Escenario 4: OrderDetail - Dirección de Envío

**Verificación:**

```typescript
// En OrderDetail.tsx
const direccion = getShippingAddressData(order);

// Debe mostrar:
// - Nombre completo
// - Dirección completa
// - Ciudad
// - Departamento/Estado
// - País
// - Teléfono
// - Referencia (si existe)
```

### Escenario 5: OrderDetail - Usuario

**Verificación:**

```typescript
// En OrderDetail.tsx
const usuarioData = getUserData(order);

// Debe mostrar:
// - Nombre: "John Doe" (first_name + last_name)
// - Email: "john@example.com"
```

### Escenario 6: OrderCard - Cantidad de Artículos

**Verificación:**

```typescript
// En OrderCard.tsx
const cantidadTotal = detalles.reduce((sum, item) => sum + item.cantidad, 0);

// Ejemplo:
// Si la orden tiene:
// - Camiseta (cantidad: 2)
// - Pantalón (cantidad: 1)
// Debe mostrar: "3 artículos" (no "2 artículos" o "2 items")
```

---

## 3. Pruebas de Compatibilidad con Backend

### Verificar que el backend devuelve los campos esperados

```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8000/api/pedidos/ \
  | jq '.results[0]'
```

**Respuesta esperada debe incluir:**

```json
{
  "id": "uuid",
  "numero_pedido": "ORD-...",
  "usuario": "uuid or object",
  "usuario_detalle": {
    /* UserSerializer */
  },
  "estado": "enviado",
  "subtotal": 100.0,
  "descuento": 0.0,
  "costo_envio": 10.0,
  "total": 110.0,
  "total_items": 3,
  "puede_cancelar": false,
  "detalles": [
    {
      "id": "uuid",
      "prenda": "uuid",
      "prenda_detalle": {
        /* PrendaListSerializer */
      },
      "talla": "uuid",
      "talla_detalle": {
        /* TallaSerializer */
      },
      "cantidad": 2,
      "precio_unitario": 50.0,
      "subtotal": 100.0,
      "producto_snapshot": {
        /* JSON */
      }
    }
  ],
  "direccion_envio": "uuid",
  "direccion_envio_detalle": {
    /* DireccionSerializer */
  },
  "direccion_snapshot": {
    /* JSON */
  },
  "pagos": [
    {
      "id": "uuid",
      "metodo_pago": {
        "id": "uuid",
        "codigo": "tarjeta",
        "nombre": "Tarjeta de Crédito",
        "descripcion": "...",
        "activo": true,
        "requiere_procesador": true
      },
      "monto": 110.0,
      "estado": "completado",
      "transaction_id": "stripe_pi_...",
      "created_at": "2023-11-15T12:05:00Z"
    }
  ],
  "historial_estados": [
    /* HistorialEstadoPedidoSerializer */
  ],
  "notas_cliente": "...",
  "notas_internas": "...",
  "metadata": {},
  "created_at": "2023-11-15T12:00:00Z",
  "updated_at": "2023-11-15T14:30:00Z"
}
```

---

## 4. Checklist de Validación

### Tipos TypeScript

- [ ] `npm run type-check` no muestra errores
- [ ] No hay `any` innecesarios
- [ ] Interfaces están correctamente definidas

### Componentes

- [ ] OrderCard:
  - [ ] Muestra cantidad TOTAL de artículos (suma)
  - [ ] No hay errores en consola
  - [ ] Imagen de productos carga correctamente
- [ ] OrderDetail:
  - [ ] No muestra "undefined" o "null" visibles
  - [ ] Dirección se renderiza correctamente
  - [ ] Método de pago muestra nombre y descripción
  - [ ] Usuario muestra nombre y email
  - [ ] Notas del cliente (si existe) se muestra
- [ ] OrderTimeline:
  - [ ] Estados coinciden con backend
  - [ ] Progreso visual correcto
  - [ ] "Entrega estimada" muestra para estado "enviado"
- [ ] OrderFilter:
  - [ ] 8 estados disponibles
  - [ ] Estados coinciden con ESTADOS_PEDIDO del backend
  - [ ] Filtro por fecha funciona

### Páginas

- [ ] OrdersPage:
  - [ ] Carga órdenes del usuario
  - [ ] Filtros funcionan
  - [ ] Paginación (si existe)
- [ ] OrderDetailPage:
  - [ ] Carga orden específica
  - [ ] Botón "Cancelar pedido" aparece solo cuando puede_cancelar = true
  - [ ] Cancelación funciona

### API/Backend

- [ ] Endpoint GET /api/pedidos/ devuelve `detalles`, no `items`
- [ ] Endpoint GET /api/pedidos/:id/ devuelve todos los campos esperados
- [ ] Métodos de pago vienen completos en `pagos[].metodo_pago`
- [ ] Estados son los 8 correctos
- [ ] Dirección viene en `direccion_envio_detalle`

---

## 5. Debugging y Troubleshooting

### Problema: "Cannot read properties of undefined (reading 'nombre')"

**Solución:**

```typescript
// ❌ No hagas esto:
const nombre = order.metodo_pago.nombre;

// ✅ Haz esto:
const nombre = order.pagos?.[0]?.metodo_pago?.nombre;

// ✅ O usa la función auxiliar:
const metodoPago = getPaymentMethodData(order);
const nombre = metodoPago?.nombre;
```

### Problema: "items" es undefined pero "detalles" existe

**Solución:**

```typescript
// ❌ Viejo:
const items = order?.items ?? [];

// ✅ Nuevo:
const detalles = order?.detalles ?? [];
```

### Problema: Método de pago es string en lugar de objeto

**Solución:**

```typescript
// ❌ Viejo (backend devuelve PaymentMethod en pagos):
const metodo = order.metodo_pago; // Error: no existe

// ✅ Nuevo:
const metodo = order.pagos?.[0]?.metodo_pago; // Correcto
```

### Problema: Dirección muestra valores incorrectos

**Solución:**

```typescript
// ✅ Usa la función auxiliar que maneja ambos formatos:
const getShippingAddressData = (order: Order) => {
  if (
    order.direccion_snapshot &&
    typeof order.direccion_snapshot === "object"
  ) {
    return order.direccion_snapshot;
  }
  if (
    order.direccion_envio_detalle &&
    typeof order.direccion_envio_detalle === "object"
  ) {
    return order.direccion_envio_detalle;
  }
  return null;
};

const direccion = getShippingAddressData(order);
```

### Problema: Cantidad de artículos incorrecta

**Solución:**

```typescript
// ❌ Viejo (solo cuenta items):
{
  items.length;
}
artículos; // Muestra 2 si hay 2 items

// ✅ Nuevo (suma cantidades):
const cantidadTotal = detalles.reduce((sum, item) => sum + item.cantidad, 0);
{
  cantidadTotal;
}
artículos; // Muestra 3 si hay 2+1 cantidad
```

---

## 6. Pruebas de Regresión

Después de las correcciones, verificar que:

- [ ] Las órdenes anteriores aún se cargan correctamente
- [ ] El filtro por estado funciona con todos los 8 estados
- [ ] La cancelación de órdenes sigue funcionando
- [ ] El timeline visual es correcto
- [ ] Los snapshots de dirección y producto se muestran cuando el objeto principal no existe
- [ ] El cálculo de total_items es correcto
- [ ] Los metadatos y notas se muestran correctamente

---

## 7. Performance

- [ ] Las órdenes se cargan rápidamente
- [ ] No hay llamadas API innecesarias
- [ ] No hay renders innecesarios
- [ ] La paginación funciona si existe

---

## 8. Checklist Final

- [ ] ✅ Cantidad de artículos correcta en OrderCard
- [ ] ✅ Sin errores de undefined en OrderDetail
- [ ] ✅ Tipos TypeScript sincronizados con backend
- [ ] ✅ Estados del pedido completos (8)
- [ ] ✅ Método de pago obtiene del objeto Pago
- [ ] ✅ Dirección segura con fallback
- [ ] ✅ Usuario tipado correctamente
- [ ] ✅ Sin errores en consola del navegador
- [ ] ✅ Todos los campos renderean correctamente
- [ ] ✅ Testing manual completado

---

## 9. Endpoints Verificados

### GET /api/pedidos/

```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:8000/api/pedidos/
```

Verifica:

- [ ] Devuelve lista de órdenes del usuario
- [ ] Cada orden tiene estructura PedidoListSerializer

### GET /api/pedidos/:id/

```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:8000/api/pedidos/123e4567-e89b-12d3-a456-426614174000/
```

Verifica:

- [ ] Devuelve estructura PedidoDetailSerializer completa
- [ ] Incluye `detalles` (no `items`)
- [ ] Incluye `pagos` con `metodo_pago` completo
- [ ] Incluye `usuario_detalle`
- [ ] Incluye `direccion_envio_detalle`
- [ ] Incluye `historial_estados`

### POST /api/metodos-pago/

```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:8000/api/metodos-pago/
```

Verifica:

- [ ] Devuelve lista de métodos de pago activos
- [ ] Estructura: id, codigo, nombre, descripcion, activo, requiere_procesador

---

**Última actualización:** 8 de Noviembre de 2025
**Versión:** 1.0
