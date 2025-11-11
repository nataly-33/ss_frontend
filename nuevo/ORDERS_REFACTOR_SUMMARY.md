# Resumen de Refactorización: Órdenes (Orders)

## Problemas Identificados y Solucionados

### 1. **Cantidad de Artículos en OrderCard** ✅

**Problema:** El OrderCard mostraba solo la cantidad de items (`items.length`) en lugar de la cantidad total de artículos.

**Solución:**

- Cambié `order?.items` a `order?.detalles` (nombre correcto del backend)
- Agregué cálculo de cantidad total: `detalles.reduce((sum, item) => sum + item.cantidad, 0)`
- Ahora se muestra correctamente la cantidad total de artículos (suma de cantidades)

**Archivo modificado:** `OrderCard.tsx`

---

### 2. **Errores en OrderDetail.tsx** ✅

**Problema:**

```
OrderDetail.tsx:158 Uncaught TypeError: Cannot read properties of undefined (reading 'nombre')
```

Causado por acceso a propiedades inexistentes en `order.direccion_envio` (ej: `calle`, `numero_exterior`)

**Solución:**

- Creé función `getShippingAddressData()` que prioriza `direccion_snapshot` sobre `direccion_envio_detalle`
- Creé función `getPaymentMethodData()` para obtener el método de pago desde `order.pagos[0].metodo_pago`
- Creé función `getUserData()` para obtener datos del usuario con fallback entre `usuario_detalle` y `usuario`
- Agregué validaciones con optional chaining (`?.`) en todos los accesos a propiedades
- Agregué validaciones condicionales para solo renderizar secciones si los datos existen
- Agregué soporte para múltiples formatos de campos de dirección (los del backend pueden variar)

**Archivo modificado:** `OrderDetail.tsx`

---

### 3. **Inconsistencia entre Backend y Frontend** ✅

**Problemas:**

- El frontend usaba `order.items` pero el backend devuelve `order.detalles`
- El frontend usaba `order.fecha_creacion` pero el backend devuelve `order.created_at`
- El frontend usaba `order.metodo_pago` como string, pero el backend devuelve un objeto `Pago` que contiene el `MetodoPago`
- Faltaban campos como `pagos`, `historial_estados`, `usuario_detalle`, etc.
- Los estados de pedido no coincidían (backend: `pago_recibido`, `confirmado`, `preparando`; frontend solo: `pendiente`, `procesando`)

**Soluciones:**

#### a) **Tipos TypeScript Actualizados** (`types/index.ts`)

- ✅ Creé interfaces específicas para cada entidad:

  - `OrderUser` - Información del usuario
  - `ShippingAddress` - Dirección de envío
  - `PaymentMethod` - Método de pago (id, codigo, nombre, etc.)
  - `OrderPayment` - Información del pago con relación a MetodoPago
  - `OrderItemProduct` - Producto en el pedido
  - `OrderItemSize` - Talla en el pedido
  - `OrderItem` - Detalle del item
  - `OrderStatusHistory` - Historial de cambios de estado
  - `Order` - Pedido completo

- ✅ El tipo `Order` ahora incluye:
  - `detalles: OrderItem[]` (en lugar de `items`)
  - `pagos: OrderPayment[]` (antes no existía)
  - `historial_estados?: OrderStatusHistory[]` (antes no existía)
  - `usuario_detalle?: OrderUser` (para la relación con UserSerializer)
  - `direccion_envio_detalle?: ShippingAddress` (para la relación con DireccionSerializer)
  - Campos de timestamps correctos: `created_at`, `updated_at` (en lugar de `fecha_creacion`, `fecha_actualizacion`)

#### b) **Componentes Actualizados**

- ✅ `OrderCard.tsx`: Ahora usa `order.detalles` y `order.created_at`
- ✅ `OrderDetail.tsx`: Maneja múltiples formatos de datos y usa funciones de apoyo para acceder de forma segura a propiedades
- ✅ `OrderTimeline.tsx`: Actualizado con estados correctos del backend
- ✅ `OrderFilter.tsx`: Actualizado con estados correctos: `pendiente`, `pago_recibido`, `confirmado`, `preparando`, `enviado`, `entregado`, `cancelado`, `reembolsado`

#### c) **Páginas Actualizadas**

- ✅ `OrderDetailPage.tsx`: Ahora usa `order.created_at` y `order.updated_at`, y la lógica de `canCancel` refleja los estados correctos

#### d) **Servicio Actualizado**

- ✅ `orders.service.ts`: Ya tenía la estructura correcta de endpoints

---

## Mapeo Backend → Frontend

### Estados del Pedido

| Backend         | Frontend          |
| --------------- | ----------------- |
| `pendiente`     | Pendiente de pago |
| `pago_recibido` | Pago recibido     |
| `confirmado`    | Confirmado        |
| `preparando`    | Preparando        |
| `enviado`       | Enviado           |
| `entregado`     | Entregado         |
| `cancelado`     | Cancelado         |
| `reembolsado`   | Reembolsado       |

### Estructura de Respuesta de Pedido (PedidoDetailSerializer)

```json
{
  "id": "uuid",
  "numero_pedido": "ORD-20231115120000-ABC123",
  "usuario": "uuid or object",
  "usuario_detalle": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
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
        /* JSON snapshot */
      }
    }
  ],
  "direccion_envio": "uuid",
  "direccion_envio_detalle": {
    "id": "uuid",
    "nombre_completo": "John Doe",
    "telefono": "555-1234",
    "direccion_completa": "Calle 123",
    "ciudad": "Bogotá",
    "departamento": "Cundinamarca",
    "pais": "Colombia",
    "referencia": "Cerca del parque"
  },
  "direccion_snapshot": {
    /* JSON snapshot de dirección al momento del pedido */
  },
  "pagos": [
    {
      "id": "uuid",
      "metodo_pago": {
        "id": "uuid",
        "codigo": "tarjeta",
        "nombre": "Tarjeta de Crédito",
        "descripcion": "Pago con tarjeta de crédito/débito",
        "activo": true,
        "requiere_procesador": true
      },
      "monto": 110.0,
      "estado": "completado",
      "transaction_id": "stripe_pi_xxx",
      "created_at": "2023-11-15T12:00:00Z"
    }
  ],
  "historial_estados": [
    {
      "id": "uuid",
      "estado_anterior": "pendiente",
      "estado_nuevo": "pago_recibido",
      "usuario_cambio": "uuid",
      "usuario_cambio_detalle": {
        /* UserSerializer */
      },
      "notas": "Pago completado via Stripe",
      "created_at": "2023-11-15T12:05:00Z"
    }
  ],
  "notas_cliente": "Entregar en horario de oficina",
  "notas_internas": "Cliente VIP, envío prioritario",
  "metadata": {},
  "created_at": "2023-11-15T12:00:00Z",
  "updated_at": "2023-11-15T12:05:00Z"
}
```

---

## Beneficios de la Refactorización

1. **Coherencia Frontend-Backend:** El frontend ahora refleja exactamente la estructura que devuelve el backend
2. **Manejo Seguro de Datos:** Se agregaron validaciones y funciones auxiliares para acceder de forma segura a propiedades opcionales
3. **Estados Correctos:** Todos los estados disponibles en el backend ahora están soportados en el frontend
4. **Métodos de Pago Vinculados:** Ahora se obtiene el método de pago desde el registro de `Pago` en lugar de buscarlo como string
5. **Mejor Mantenibilidad:** Las interfaces TypeScript aseguran que cualquier cambio en el backend será detectado en tiempo de compilación
6. **Datos Históricos:** Se agregó soporte para ver el historial de cambios de estado del pedido

---

## Próximas Mejoras (Recomendadas)

1. **Error Boundaries:** Agregar error boundaries en React para manejar errores de forma elegante
2. **Testing:** Crear tests unitarios para las funciones auxiliares
3. **Logging:** Agregar logging para debugging de problemas con datos faltantes
4. **Caching:** Implementar caching de órdenes para mejorar performance
5. **Real-time Updates:** Agregar WebSockets para actualizaciones en tiempo real del estado de órdenes
6. **UI para Historial:** Mostrar el historial de cambios de estado de forma visual

---

## Archivos Modificados

- ✅ `ss_frontend/src/modules/orders/types/index.ts`
- ✅ `ss_frontend/src/modules/orders/components/OrderCard.tsx`
- ✅ `ss_frontend/src/modules/orders/components/OrderDetail.tsx`
- ✅ `ss_frontend/src/modules/orders/components/OrderTimeline.tsx`
- ✅ `ss_frontend/src/modules/orders/components/OrderFilter.tsx`
- ✅ `ss_frontend/src/modules/orders/pages/OrderDetailPage.tsx`

---

**Fecha de Refactorización:** 8 de Noviembre de 2025
**Estado:** ✅ Completado
