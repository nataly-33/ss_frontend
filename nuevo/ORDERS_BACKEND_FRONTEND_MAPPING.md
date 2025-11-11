# 🔗 Mapeo Detallado: Backend → Frontend

## Backend (Django/DRF)

### Modelos

```python
# apps/orders/models.py

class Pedido(BaseModel):
    usuario = ForeignKey(User)
    numero_pedido = CharField(unique=True)
    direccion_envio = ForeignKey(Direccion)
    direccion_snapshot = JSONField()  # Snapshot de la dirección
    subtotal = DecimalField()
    descuento = DecimalField(default=0)
    costo_envio = DecimalField(default=0)
    total = DecimalField()
    estado = CharField(choices=ESTADOS_PEDIDO)  # 8 opciones
    notas_cliente = TextField()
    notas_internas = TextField()
    metadata = JSONField()

class DetallePedido(BaseModel):
    pedido = ForeignKey(Pedido)
    prenda = ForeignKey(Prenda)
    talla = ForeignKey(Talla)
    cantidad = PositiveIntegerField()
    precio_unitario = DecimalField()
    subtotal = DecimalField()
    producto_snapshot = JSONField()

class Pago(BaseModel):
    pedido = ForeignKey(Pedido)
    metodo_pago = ForeignKey(MetodoPago)  # ← Relación con MetodoPago
    monto = DecimalField()
    estado = CharField(choices=ESTADOS_PAGO)
    transaction_id = CharField()
    stripe_payment_intent_id = CharField()
    paypal_order_id = CharField()
    response_data = JSONField()
    notas = TextField()

class MetodoPago(BaseModel):
    codigo = CharField(unique=True)           # 'tarjeta', 'efectivo', etc
    nombre = CharField()                      # 'Tarjeta de Crédito'
    descripcion = TextField()
    activo = BooleanField()
    requiere_procesador = BooleanField()
    configuracion = JSONField()

class HistorialEstadoPedido(BaseModel):
    pedido = ForeignKey(Pedido)
    estado_anterior = CharField(choices=ESTADOS_PEDIDO)
    estado_nuevo = CharField(choices=ESTADOS_PEDIDO)
    usuario_cambio = ForeignKey(User)
    notas = TextField()
```

### Serializers

```python
# apps/orders/serializers.py

class MetodoPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MetodoPago
        fields = ['id', 'codigo', 'nombre', 'descripcion', 'activo', 'requiere_procesador']

class DetallePedidoSerializer(serializers.ModelSerializer):
    prenda_detalle = PrendaListSerializer(source='prenda', read_only=True)
    talla_detalle = TallaSerializer(source='talla', read_only=True)
    class Meta:
        model = DetallePedido
        fields = [
            'id', 'prenda', 'prenda_detalle', 'talla', 'talla_detalle',
            'cantidad', 'precio_unitario', 'subtotal', 'producto_snapshot'
        ]

class PagoSerializer(serializers.ModelSerializer):
    metodo_pago_detalle = MetodoPagoSerializer(source='metodo_pago', read_only=True)
    class Meta:
        model = Pago
        fields = [
            'id', 'metodo_pago', 'metodo_pago_detalle', 'monto', 'estado',
            'transaction_id', 'created_at'
        ]

class HistorialEstadoPedidoSerializer(serializers.ModelSerializer):
    usuario_cambio_detalle = UserSerializer(source='usuario_cambio', read_only=True)
    class Meta:
        model = HistorialEstadoPedido
        fields = [
            'id', 'estado_anterior', 'estado_nuevo', 'usuario_cambio',
            'usuario_cambio_detalle', 'notas', 'created_at'
        ]

class PedidoDetailSerializer(serializers.ModelSerializer):
    usuario_detalle = UserSerializer(source='usuario', read_only=True)
    direccion_envio_detalle = DireccionSerializer(source='direccion_envio', read_only=True)
    detalles = DetallePedidoSerializer(many=True, read_only=True)
    pagos = PagoSerializer(many=True, read_only=True)
    historial_estados = HistorialEstadoPedidoSerializer(many=True, read_only=True)
    total_items = serializers.ReadOnlyField()
    puede_cancelar = serializers.ReadOnlyField()

    class Meta:
        model = Pedido
        fields = [
            'id', 'numero_pedido', 'usuario', 'usuario_detalle',
            'direccion_envio', 'direccion_envio_detalle', 'direccion_snapshot',
            'subtotal', 'descuento', 'costo_envio', 'total', 'estado',
            'notas_cliente', 'notas_internas', 'detalles', 'pagos',
            'historial_estados', 'total_items', 'puede_cancelar',
            'metadata', 'created_at', 'updated_at'
        ]
```

### API Response Ejemplo

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "numero_pedido": "ORD-20231115120000-ABC123",
  "usuario": "user-uuid-123",
  "usuario_detalle": {
    "id": "user-uuid-123",
    "email": "john@example.com",
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
      "id": "detail-uuid-1",
      "prenda": "prenda-uuid",
      "prenda_detalle": {
        "id": "prenda-uuid",
        "nombre": "Camiseta Premium",
        "slug": "camiseta-premium",
        "imagen_principal": "http://cdn.example.com/image.jpg"
      },
      "talla": "talla-uuid",
      "talla_detalle": {
        "id": "talla-uuid",
        "nombre": "M"
      },
      "cantidad": 2,
      "precio_unitario": 50.0,
      "subtotal": 100.0,
      "producto_snapshot": {
        "nombre": "Camiseta Premium",
        "descripcion": "Camiseta de algodón 100%",
        "marca": "BrandX",
        "color": "Azul",
        "imagen": "http://cdn.example.com/image.jpg"
      }
    }
  ],
  "direccion_envio": "direccion-uuid",
  "direccion_envio_detalle": {
    "id": "direccion-uuid",
    "nombre_completo": "John Doe",
    "telefono": "555-1234",
    "direccion_completa": "Calle Principal 123",
    "ciudad": "Bogotá",
    "departamento": "Cundinamarca",
    "pais": "Colombia",
    "referencia": "Apartamento 4B"
  },
  "direccion_snapshot": {
    "nombre_completo": "John Doe",
    "telefono": "555-1234",
    "direccion_completa": "Calle Principal 123",
    "ciudad": "Bogotá",
    "departamento": "Cundinamarca",
    "pais": "Colombia",
    "referencia": "Apartamento 4B"
  },
  "pagos": [
    {
      "id": "pago-uuid",
      "metodo_pago": "metodo-uuid",
      "metodo_pago_detalle": {
        "id": "metodo-uuid",
        "codigo": "tarjeta",
        "nombre": "Tarjeta de Crédito",
        "descripcion": "Pago con tarjeta de crédito o débito",
        "activo": true,
        "requiere_procesador": true
      },
      "monto": 110.0,
      "estado": "completado",
      "transaction_id": "stripe_pi_1234567890",
      "created_at": "2023-11-15T12:05:00Z"
    }
  ],
  "historial_estados": [
    {
      "id": "historial-uuid",
      "estado_anterior": "pendiente",
      "estado_nuevo": "pago_recibido",
      "usuario_cambio": "admin-uuid",
      "usuario_cambio_detalle": {
        "id": "admin-uuid",
        "email": "admin@example.com",
        "first_name": "Admin",
        "last_name": "User"
      },
      "notas": "Pago completado via Stripe",
      "created_at": "2023-11-15T12:05:00Z"
    },
    {
      "id": "historial-uuid-2",
      "estado_anterior": "pago_recibido",
      "estado_nuevo": "enviado",
      "usuario_cambio": "admin-uuid",
      "usuario_cambio_detalle": {
        "id": "admin-uuid",
        "email": "admin@example.com",
        "first_name": "Admin",
        "last_name": "User"
      },
      "notas": "Enviado con DHL",
      "created_at": "2023-11-15T14:30:00Z"
    }
  ],
  "notas_cliente": "Por favor entregar en horario de oficina",
  "notas_internas": "Cliente VIP - envío prioritario",
  "metadata": {},
  "created_at": "2023-11-15T12:00:00Z",
  "updated_at": "2023-11-15T14:30:00Z"
}
```

---

## Frontend (React/TypeScript)

### Tipos Actualizados

```typescript
// src/modules/orders/types/index.ts

export interface OrderUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface ShippingAddress {
  id: string;
  nombre_completo: string;
  telefono: string;
  direccion_completa: string;
  ciudad: string;
  departamento: string;
  pais: string;
  referencia?: string;
}

export interface PaymentMethod {
  id: string;
  codigo: string; // 'tarjeta', 'efectivo', 'paypal', 'billetera'
  nombre: string; // 'Tarjeta de Crédito'
  descripcion?: string;
  activo: boolean;
  requiere_procesador: boolean;
}

export interface OrderPayment {
  id: string;
  metodo_pago: PaymentMethod; // ← Ahora es un objeto
  monto: number;
  estado: string;
  transaction_id?: string;
  created_at: string;
}

export interface OrderItemProduct {
  id: string;
  nombre: string;
  slug: string;
  imagen_principal?: string;
}

export interface OrderItemSize {
  id: string;
  nombre: string;
}

export interface OrderItem {
  id: string;
  prenda: OrderItemProduct;
  prenda_detalle?: OrderItemProduct;
  talla: OrderItemSize;
  talla_detalle?: OrderItemSize;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  producto_snapshot?: Record<string, any>;
}

export interface OrderStatusHistory {
  id: string;
  estado_anterior: string;
  estado_nuevo: string;
  usuario_cambio?: OrderUser;
  usuario_cambio_detalle?: OrderUser;
  notas: string;
  created_at: string;
}

export interface Order {
  id: string;
  numero_pedido: string;
  usuario: string | OrderUser;
  usuario_detalle?: OrderUser;
  estado: string;
  subtotal: number;
  descuento: number;
  costo_envio: number;
  total: number;
  total_items: number;
  puede_cancelar: boolean;

  detalles: OrderItem[]; // ← Cambié de "items"

  direccion_envio: string | ShippingAddress;
  direccion_envio_detalle?: ShippingAddress; // ← Nuevo
  direccion_snapshot?: Record<string, any>;

  pagos: OrderPayment[]; // ← Nuevo

  notas_cliente?: string;
  notas_internas?: string;
  metadata?: Record<string, any>;

  historial_estados?: OrderStatusHistory[]; // ← Nuevo

  created_at: string;
  updated_at: string;
}
```

### Ejemplo de Uso

```tsx
// Obtener una orden del backend
const order = await ordersService.getOrder(orderId);

// Acceder a detalles
order.detalles.map((item) => ({
  prenda: item.prenda.nombre,
  cantidad: item.cantidad,
  precio: item.precio_unitario,
}));

// Acceder a método de pago (ahora es seguro)
const metodoPago = order.pagos?.[0]?.metodo_pago;
console.log(metodoPago?.nombre); // ✅ "Tarjeta de Crédito"

// Acceder a dirección
const direccion = order.direccion_envio_detalle || order.direccion_snapshot;
console.log(direccion?.ciudad); // ✅ "Bogotá"

// Acceder a usuario
const usuario = order.usuario_detalle || order.usuario;
console.log(usuario?.first_name); // ✅ "John"
```

---

## Tabla de Mapeo Detallada

| Concepto                    | Backend                            | Frontend Tipo                    | Frontend Acceso                     |
| --------------------------- | ---------------------------------- | -------------------------------- | ----------------------------------- |
| **ID del Pedido**           | `Pedido.id`                        | `Order.id`                       | `order.id`                          |
| **Número de Pedido**        | `Pedido.numero_pedido`             | `Order.numero_pedido`            | `order.numero_pedido`               |
| **Estado**                  | `Pedido.estado` (8 opciones)       | `Order.estado`                   | `order.estado`                      |
| **Total**                   | `Pedido.total`                     | `Order.total`                    | `order.total`                       |
| **Subtotal**                | `Pedido.subtotal`                  | `Order.subtotal`                 | `order.subtotal`                    |
| **Descuento**               | `Pedido.descuento`                 | `Order.descuento`                | `order.descuento`                   |
| **Costo Envío**             | `Pedido.costo_envio`               | `Order.costo_envio`              | `order.costo_envio`                 |
| **Items**                   | `Pedido.detalles.all()`            | `Order.detalles`                 | `order.detalles`                    |
| **Cantidad Total**          | `Pedido.total_items`               | `Order.total_items`              | `order.total_items`                 |
| **Cantidad por Item**       | `DetallePedido.cantidad`           | `OrderItem.cantidad`             | `order.detalles[0].cantidad`        |
| **Usuario (ID)**            | `Pedido.usuario_id`                | `Order.usuario` (string)         | `order.usuario`                     |
| **Usuario (Datos)**         | N/A en modelo                      | `Order.usuario_detalle`          | `order.usuario_detalle`             |
| **Dirección (ID)**          | `Pedido.direccion_envio_id`        | `Order.direccion_envio` (string) | `order.direccion_envio`             |
| **Dirección (Detalles)**    | N/A en modelo                      | `Order.direccion_envio_detalle`  | `order.direccion_envio_detalle`     |
| **Dirección (Snapshot)**    | `Pedido.direccion_snapshot`        | `Order.direccion_snapshot`       | `order.direccion_snapshot`          |
| **Método de Pago (Datos)**  | `Pago.metodo_pago` (FK)            | `OrderPayment.metodo_pago`       | `order.pagos[0].metodo_pago`        |
| **Método de Pago (Nombre)** | `MetodoPago.nombre`                | `PaymentMethod.nombre`           | `order.pagos[0].metodo_pago.nombre` |
| **Pagos**                   | `Pedido.pagos.all()`               | `Order.pagos`                    | `order.pagos`                       |
| **Historial de Estados**    | `Pedido.historial_estados.all()`   | `Order.historial_estados`        | `order.historial_estados`           |
| **Fecha Creación**          | `BaseModel.created_at`             | `Order.created_at`               | `order.created_at`                  |
| **Fecha Actualización**     | `BaseModel.updated_at`             | `Order.updated_at`               | `order.updated_at`                  |
| **Notas del Cliente**       | `Pedido.notas_cliente`             | `Order.notas_cliente`            | `order.notas_cliente`               |
| **Notas Internas**          | `Pedido.notas_internas`            | `Order.notas_internas`           | `order.notas_internas`              |
| **Puede Cancelar**          | `Pedido.puede_cancelar` (property) | `Order.puede_cancelar`           | `order.puede_cancelar`              |

---

## Estados del Pedido: Mapeo Completo

```typescript
// Backend (apps/core/constants.py)
ESTADOS_PEDIDO = [
  ("pendiente", "Pendiente de pago"),
  ("pago_recibido", "Pago recibido"),
  ("confirmado", "Confirmado"),
  ("preparando", "Preparando"),
  ("enviado", "Enviado"),
  ("entregado", "Entregado"),
  ("cancelado", "Cancelado"),
  ("reembolsado", "Reembolsado"),
];

// Frontend (OrderFilter, OrderTimeline)
enum OrderStatus {
  PENDING = "pendiente", // Pendiente de pago
  PAYMENT_RECEIVED = "pago_recibido", // Pago recibido
  CONFIRMED = "confirmado", // Confirmado
  PREPARING = "preparando", // Preparando
  SHIPPED = "enviado", // Enviado
  DELIVERED = "entregado", // Entregado
  CANCELED = "cancelado", // Cancelado
  REFUNDED = "reembolsado", // Reembolsado
}
```

---

## Métodos de Pago: Mapeo Completo

```typescript
// Backend (apps/core/constants.py)
METODOS_PAGO = [
  ("efectivo", "Efectivo"),
  ("tarjeta", "Tarjeta"),
  ("paypal", "PayPal"),
  ("billetera", "Billetera Virtual"),
];

// Frontend
enum PaymentMethodCode {
  CASH = "efectivo", // Efectivo
  CARD = "tarjeta", // Tarjeta (Stripe)
  PAYPAL = "paypal", // PayPal
  WALLET = "billetera", // Billetera Virtual
}

// El código se obtiene del objeto PaymentMethod
const codigo = order.pagos[0]?.metodo_pago?.codigo;
```

---

## Ejemplo Completo: De Backend a Frontend

### Backend Response (JSON)

```json
GET /api/pedidos/123e4567-e89b-12d3-a456-426614174000/

{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "numero_pedido": "ORD-20231115120000-ABC123",
  "usuario": "user-uuid",
  "usuario_detalle": {
    "id": "user-uuid",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe"
  },
  "estado": "enviado",
  "subtotal": 100.00,
  "descuento": 0.00,
  "costo_envio": 10.00,
  "total": 110.00,
  "total_items": 2,
  "puede_cancelar": false,
  "detalles": [
    {
      "id": "detail-1",
      "prenda": "prenda-uuid",
      "prenda_detalle": {
        "id": "prenda-uuid",
        "nombre": "Camiseta Premium",
        "slug": "camiseta-premium",
        "imagen_principal": "http://cdn.example.com/1.jpg"
      },
      "talla": "talla-uuid",
      "talla_detalle": {
        "id": "talla-uuid",
        "nombre": "M"
      },
      "cantidad": 2,
      "precio_unitario": 50.00,
      "subtotal": 100.00,
      "producto_snapshot": {...}
    }
  ],
  "direccion_envio": "dir-uuid",
  "direccion_envio_detalle": {
    "id": "dir-uuid",
    "nombre_completo": "John Doe",
    "telefono": "555-1234",
    "direccion_completa": "Calle 123",
    "ciudad": "Bogotá",
    "departamento": "Cundinamarca",
    "pais": "Colombia",
    "referencia": "Apt 4B"
  },
  "direccion_snapshot": {...},
  "pagos": [
    {
      "id": "pago-uuid",
      "metodo_pago": {
        "id": "metodo-uuid",
        "codigo": "tarjeta",
        "nombre": "Tarjeta de Crédito",
        "descripcion": "Pago con tarjeta...",
        "activo": true,
        "requiere_procesador": true
      },
      "monto": 110.00,
      "estado": "completado",
      "transaction_id": "stripe_pi_...",
      "created_at": "2023-11-15T12:05:00Z"
    }
  ],
  "historial_estados": [...],
  "notas_cliente": "Entregar en horario de oficina",
  "notas_internas": "Cliente VIP",
  "metadata": {},
  "created_at": "2023-11-15T12:00:00Z",
  "updated_at": "2023-11-15T14:30:00Z"
}
```

### Frontend TypeScript

```typescript
// ordersService.getOrder() retorna este tipo:
const order: Order = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  numero_pedido: "ORD-20231115120000-ABC123",
  usuario: "user-uuid",
  usuario_detalle: {
    id: "user-uuid",
    email: "john@example.com",
    first_name: "John",
    last_name: "Doe"
  },
  estado: "enviado",
  subtotal: 100.00,
  descuento: 0.00,
  costo_envio: 10.00,
  total: 110.00,
  total_items: 2,
  puede_cancelar: false,
  detalles: [{
    id: "detail-1",
    prenda: { id: "prenda-uuid", nombre: "Camiseta Premium", ... },
    prenda_detalle: { id: "prenda-uuid", nombre: "Camiseta Premium", ... },
    talla: { id: "talla-uuid", nombre: "M" },
    talla_detalle: { id: "talla-uuid", nombre: "M" },
    cantidad: 2,
    precio_unitario: 50.00,
    subtotal: 100.00,
    producto_snapshot: {...}
  }],
  direccion_envio: "dir-uuid",
  direccion_envio_detalle: {
    id: "dir-uuid",
    nombre_completo: "John Doe",
    telefono: "555-1234",
    direccion_completa: "Calle 123",
    ciudad: "Bogotá",
    departamento: "Cundinamarca",
    pais: "Colombia",
    referencia: "Apt 4B"
  },
  pagos: [{
    id: "pago-uuid",
    metodo_pago: {
      id: "metodo-uuid",
      codigo: "tarjeta",
      nombre: "Tarjeta de Crédito",
      descripcion: "Pago con tarjeta...",
      activo: true,
      requiere_procesador: true
    },
    monto: 110.00,
    estado: "completado",
    transaction_id: "stripe_pi_...",
    created_at: "2023-11-15T12:05:00Z"
  }],
  historial_estados: [...],
  notas_cliente: "Entregar en horario de oficina",
  notas_internas: "Cliente VIP",
  metadata: {},
  created_at: "2023-11-15T12:00:00Z",
  updated_at: "2023-11-15T14:30:00Z"
}

// Acceso seguro a datos
console.log(order.detalles[0].cantidad);                    // ✅ 2
console.log(order.pagos[0].metodo_pago.nombre);             // ✅ "Tarjeta de Crédito"
console.log(order.usuario_detalle?.first_name);             // ✅ "John"
console.log(order.direccion_envio_detalle?.ciudad);         // ✅ "Bogotá"
```

---

**Fecha de Actualización:** 8 de Noviembre de 2025
**Versión:** 1.0
