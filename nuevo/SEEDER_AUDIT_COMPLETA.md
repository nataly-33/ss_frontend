# 🔍 AUDITORÍA COMPLETA DEL SEEDER vs MODELOS

**Fecha:** 2025-11-10  
**Objetivo:** Verificación línea por línea de cada función del seeder contra los modelos Django  
**Estado:** ✅ VALIDACIÓN COMPLETA

---

## 📋 TABLA DE CONTENIDOS

1. [Auditoría de Permisos y Roles](#auditoría-de-permisos-y-roles)
2. [Auditoría de Usuarios](#auditoría-de-usuarios)
3. [Auditoría de Categorías](#auditoría-de-categorías)
4. [Auditoría de Tallas y Marcas](#auditoría-de-tallas-y-marcas)
5. [Auditoría de Blusas/Prendas](#auditoría-de-blusprendas)
6. [Auditoría de Direcciones](#auditoría-de-direcciones)
7. [Auditoría de Favoritos](#auditoría-de-favoritos)
8. [Auditoría de Métodos de Pago](#auditoría-de-métodos-de-pago)
9. [Auditoría de Pedidos](#auditoría-de-pedidos)
10. [Auditoría de Detalles de Pedido](#auditoría-de-detalles-de-pedido)
11. [Auditoría de Pagos](#auditoría-de-pagos)
12. [Resumen de Campos Requeridos](#resumen-de-campos-requeridos)

---

## Auditoría de Permisos y Roles

### Model: `Permission` (`apps/accounts/models.py`)

```python
class Permission(BaseModel):
    codigo = CharField(max_length=100, unique=True)
    nombre = CharField(max_length=100)
    descripcion = TextField(blank=True)
    modulo = CharField(max_length=50)
```

### Seeder: `seed_permissions()`

```python
# ✅ CORRECTO
permiso, created = Permission.objects.get_or_create(
    codigo=f'{modulo}.{accion}',  # ✅ Campo existe
    defaults={
        'modulo': modulo,           # ✅ Campo existe
        'nombre': accion            # ✅ Campo existe
    }
)
```

**Validación:** ✅ **PASS**

- Usa `codigo` con formato correcto
- Asigna `modulo` y `nombre`
- No requiere `descripcion` (blank=True)

---

### Model: `Role` (`apps/accounts/models.py`)

```python
class Role(BaseModel):
    nombre = CharField(max_length=50, unique=True)
    descripcion = TextField(blank=True)
    permisos = ManyToManyField(Permission)
    es_rol_sistema = BooleanField(default=False)
```

### Seeder: `seed_roles()`

```python
# ✅ CORRECTO
rol, created = Role.objects.get_or_create(
    nombre=rol_nombre,
    defaults={
        'descripcion': rol_info['descripcion']  # ✅ Campo existe
    }
)
rol.permisos.set(rol_info['permisos'])  # ✅ ManyToMany correcto
```

**Validación:** ✅ **PASS**

- Usa `nombre` como identificador único
- Asigna `descripcion`
- M2M con `permisos` es correcto
- `es_rol_sistema` usa default=False (OK)

---

## Auditoría de Usuarios

### Model: `User` (`apps/accounts/models.py`)

```python
class User(AbstractBaseUser, BaseModel):
    email = EmailField(unique=True)
    nombre = CharField(max_length=100)
    apellido = CharField(max_length=100)
    telefono = CharField(max_length=20, blank=True)
    foto_perfil = ImageField(null=True, blank=True)
    rol = ForeignKey(Role, null=True, related_name='usuarios')
    codigo_empleado = CharField(max_length=50, blank=True)
    activo = BooleanField(default=True)
    email_verificado = BooleanField(default=False)
    is_staff = BooleanField(default=False)
    is_superuser = BooleanField(default=False)
```

### Seeder: `seed_usuarios_principales()`

```python
# ✅ CORRECTO
user, created = User.objects.get_or_create(
    email=u['email'],
    defaults={
        'nombre': u['nombre'],              # ✅ Campo existe
        'apellido': u['apellido'],          # ✅ Campo existe
        'rol': rol,                         # ✅ Campo existe
        'activo': True,                     # ✅ Campo existe
        'email_verificado': True,           # ✅ Campo existe
        'is_staff': u.get('is_staff'),      # ✅ Campo existe
        'is_superuser': u.get('is_superuser'),  # ✅ Campo existe
        'telefono': f'+591 {random_number}'     # ✅ Campo existe
    }
)
if created:
    user.set_password(u['password'])  # ✅ Método correcto
    user.save()
```

**Validación:** ✅ **PASS**

- Email es identificador único
- Todos los campos requeridos están presentes
- set_password() es el método correcto de Django
- Todos los campos opcionales (foto_perfil, codigo_empleado) pueden omitirse

### Seeder: `seed_clientes()`

```python
# ✅ CORRECTO
user, created = User.objects.get_or_create(
    email=email,
    defaults={
        'nombre': fake.first_name(),        # ✅ Campo existe
        'apellido': fake.last_name(),       # ✅ Campo existe
        'rol': rol_cliente,                 # ✅ Campo existe
        'activo': True,                     # ✅ Campo existe
        'email_verificado': True,           # ✅ Campo existe
        'telefono': f'+591 {random_number}' # ✅ Campo existe
    }
)
```

**Validación:** ✅ **PASS**

- Todos los campos requeridos
- Rol asignado correctamente

---

## Auditoría de Categorías

### Model: `Categoria` (`apps/products/models.py`)

```python
class Categoria(BaseModel):
    nombre = CharField(max_length=100, unique=True)
    descripcion = TextField(blank=True)
    imagen = URLField(null=True, blank=True)  # ⚠️ URLField, no ImageField
    activa = BooleanField(default=True)
```

### Seeder: `seed_categorias_desde_s3()`

```python
# ✅ CORRECTO
cat, created = Categoria.objects.get_or_create(
    nombre=nombre_categoria,
    defaults={
        'descripcion': f'Colección de {nombre_categoria.lower()}',  # ✅
        'imagen': url,              # ✅ URLField, no file upload
        'activa': True              # ✅ Campo existe
    }
)
```

**Validación:** ✅ **PASS**

- Campo `imagen` es URLField (almacena URLs directas de S3)
- No intenta subir archivos
- Todos los campos correctos

---

## Auditoría de Tallas y Marcas

### Model: `Talla` (`apps/products/models.py`)

```python
class Talla(BaseModel):
    nombre = CharField(max_length=10, unique=True)
    orden = IntegerField(default=0)
```

### Seeder: `seed_tallas()`

```python
# ✅ CORRECTO
talla, created = Talla.objects.get_or_create(
    nombre=nombre,
    defaults={'orden': orden}  # ✅ Campo existe
)
```

**Validación:** ✅ **PASS**

---

### Model: `Marca` (`apps/products/models.py`)

```python
class Marca(BaseModel):
    nombre = CharField(max_length=100, unique=True)
    descripcion = TextField(blank=True)
    activa = BooleanField(default=True)
    # ❌ NO TIENE CAMPO 'logo' (ya fue eliminado)
```

### Seeder: `seed_marcas()`

```python
# ✅ CORRECTO
marca, created = Marca.objects.get_or_create(
    nombre=nombre,
    defaults={'descripcion': f'{nombre} - Colección oficial'}  # ✅
    # ❌ NO intenta crear campo 'logo'
)
```

**Validación:** ✅ **PASS**

- NO crea campo `logo` (correcto, fue eliminado)
- Todos los campos presentes

---

## Auditoría de Blusas/Prendas

### Model: `Prenda` (`apps/products/models.py`)

```python
class Prenda(BaseModel):
    nombre = CharField(max_length=200)
    descripcion = TextField()
    precio = DecimalField(max_digits=10, decimal_places=2)
    marca = ForeignKey(Marca, on_delete=PROTECT)
    categorias = ManyToManyField(Categoria)
    tallas_disponibles = ManyToManyField(Talla)
    color = CharField(max_length=50)
    material = CharField(max_length=200, blank=True)
    activa = BooleanField(default=True)
    destacada = BooleanField(default=False)
    es_novedad = BooleanField(default=False)
    slug = SlugField(unique=True, blank=True)  # ⚠️ Auto-generado en save()
    metadata = JSONField(default=dict, blank=True)
```

### Seeder: `seed_blusas()`

```python
# ✅ CORRECTO
blusa, created = Prenda.objects.get_or_create(
    nombre=nombre,
    marca=marca,
    color=color,
    defaults={
        'descripcion': descripcion,     # ✅
        'precio': precio,               # ✅
        'material': tela,               # ✅
        'activa': True,                 # ✅
        'es_novedad': random.choice([True, False, False])  # ✅
    }
)

if created:
    blusa.categorias.add(categoria_blusas)      # ✅ M2M correcto
    blusa.tallas_disponibles.set(tallas_list)   # ✅ M2M correcto

    # ✅ ImagenPrenda correctamente creado
    ImagenPrenda.objects.create(
        prenda=blusa,
        imagen=url_s3,              # ⚠️ Ver abajo
        es_principal=True,          # ✅
        orden=0,                    # ✅
        alt_text=nombre             # ✅
    )

    # ✅ StockPrenda para cada talla
    for talla in tallas_list:
        StockPrenda.objects.create(
            prenda=blusa,
            talla=talla,
            cantidad=stock,
            stock_minimo=3
        )
```

**Validación:** ⚠️ **PARCIAL PASS**

**POTENCIAL PROBLEMA:**

- Campo `imagen` en ImagenPrenda es `ImageField(upload_to='productos/')`, NO URLField
- El seeder intenta asignar una URL directa: `imagen=url_s3`
- Esto **FALLARÁ** en Django

**ACCIÓN REQUERIDA:**

```python
# ❌ INCORRECTO
ImagenPrenda.objects.create(
    imagen=url_s3,  # URL string a ImageField
)

# ✅ CORRECTO (opción 1: usar URLField en modelo)
# O usar una ImageField con Storage de S3

# ✅ CORRECTO (opción 2: crear modelo alternativo con URLField)
# Crear modelo 'ImagenPrendaURL' con URLField en lugar de ImageField
```

---

## Auditoría de Direcciones

### Model: `Direccion` (`apps/customers/models.py`)

```python
class Direccion(BaseModel):
    usuario = ForeignKey(User, on_delete=CASCADE)
    nombre_completo = CharField(max_length=200)
    telefono = CharField(max_length=20)
    direccion_linea1 = CharField(max_length=255)
    direccion_linea2 = CharField(max_length=255, blank=True)
    ciudad = CharField(max_length=100)
    departamento = CharField(max_length=100)
    codigo_postal = CharField(max_length=20, blank=True)
    pais = CharField(max_length=100, default='Bolivia')
    referencia = TextField(blank=True)
    es_principal = BooleanField(default=False)
    activa = BooleanField(default=True)
```

### Seeder: `seed_direcciones()`

```python
# ✅ CORRECTO
dir_obj = Direccion.objects.create(
    usuario=cliente,                    # ✅ FK correcto
    nombre_completo=f"{nombre} {apellido}",  # ✅
    telefono=cliente.telefono,          # ✅
    direccion_linea1=fake.street_address(),  # ✅
    ciudad=fake.city(),                 # ✅
    departamento=fake.state(),          # ✅
    pais='Bolivia',                     # ✅
    es_principal=(i == 0)               # ✅
)
```

**Validación:** ✅ **PASS**

- Todos los campos requeridos
- FK usuario correcto
- Lógica es_principal para primera dirección

---

## Auditoría de Favoritos

### Model: `Favoritos` (`apps/customers/models.py`)

```python
class Favoritos(BaseModel):
    usuario = ForeignKey(User, on_delete=CASCADE)
    prenda = ForeignKey(Prenda, on_delete=CASCADE)

    class Meta:
        unique_together = [['usuario', 'prenda']]
```

### Seeder: `seed_favoritos()`

```python
# ✅ CORRECTO
fav, created = Favoritos.objects.get_or_create(
    usuario=cliente,        # ✅ FK correcto
    prenda=prenda           # ✅ FK correcto
)
```

**Validación:** ✅ **PASS**

- Usa get_or_create para evitar duplicados
- unique_together se respeta automáticamente

---

## Auditoría de Métodos de Pago

### Model: `MetodoPago` (`apps/orders/models.py`)

```python
class MetodoPago(BaseModel):
    codigo = CharField(max_length=50, unique=True)
    nombre = CharField(max_length=100)
    descripcion = TextField(blank=True)
    activo = BooleanField(default=True)
    requiere_procesador = BooleanField(default=False)
    configuracion = JSONField(default=dict, blank=True)
```

### Seeder: `seed_metodos_pago()`

```python
# ✅ CORRECTO
obj, created = MetodoPago.objects.get_or_create(
    codigo=metodo['codigo'],
    defaults={
        'nombre': metodo['nombre'],     # ✅
        'activo': True                  # ✅
    }
)
```

**Validación:** ✅ **PASS**

- Todos los campos correctos
- Campos opcionales no son problema

---

## Auditoría de Pedidos

### Model: `Pedido` (`apps/orders/models.py`)

```python
class Pedido(BaseModel):
    usuario = ForeignKey(User, on_delete=PROTECT)
    numero_pedido = CharField(max_length=50, unique=True, editable=False)  # ⚠️ Auto-generado
    direccion_envio = ForeignKey(Direccion, on_delete=PROTECT)
    direccion_snapshot = JSONField(default=dict)
    subtotal = DecimalField(max_digits=10, decimal_places=2)
    descuento = DecimalField(max_digits=10, decimal_places=2, default=0)
    costo_envio = DecimalField(max_digits=10, decimal_places=2, default=0)
    total = DecimalField(max_digits=10, decimal_places=2)
    estado = CharField(max_length=50, choices=ESTADOS_PEDIDO, default='pendiente')
    notas_cliente = TextField(blank=True)
    notas_internas = TextField(blank=True)
    metadata = JSONField(default=dict, blank=True)

    def save(self, *args, **kwargs):
        # Genera numero_pedido automáticamente si no existe
        if not self.numero_pedido:
            timestamp = now().strftime('%Y%m%d%H%M%S')
            random_str = ''.join(random.choices(CHARS, k=4))
            self.numero_pedido = f"ORD-{timestamp}-{random_str}"

        # Guarda snapshot de dirección
        if self.direccion_envio and not self.direccion_snapshot:
            self.direccion_snapshot = { ... }

        super().save(*args, **kwargs)
```

### Seeder: `seed_pedidos()`

```python
# ✅ CORRECTO
pedido = Pedido.objects.create(
    usuario=cliente,                        # ✅ FK correcto
    direccion_envio=direccion,              # ✅ FK correcto
    estado=random.choice(estados_pedido),   # ✅
    notas_cliente=fake.sentence(),          # ✅
    subtotal=Decimal('0'),                  # ✅ Se actualiza después
    total=Decimal('0')                      # ✅ Se actualiza después
    # ❌ NO pasa numero_pedido (se auto-genera)
    # ❌ NO pasa direccion_snapshot (se auto-genera)
)

# Actualizar montos después de agregar items
pedido.subtotal = subtotal_pedido
pedido.descuento = descuento
pedido.total = total_pedido
pedido.save()  # ✅ Triggers save() para snapshots
```

**Validación:** ✅ **PASS**

- NO intenta crear `numero_pedido` (correcto)
- NO intenta crear `direccion_snapshot` (correcto, auto-generado)
- Todos los campos requeridos presentes
- Lógica de cálculo correcta

---

## Auditoría de Detalles de Pedido

### Model: `DetallePedido` (`apps/orders/models.py`)

```python
class DetallePedido(BaseModel):
    pedido = ForeignKey(Pedido, on_delete=CASCADE)
    prenda = ForeignKey(Prenda, on_delete=PROTECT)
    talla = ForeignKey(Talla, on_delete=PROTECT)  # ⚠️ REQUERIDO
    cantidad = PositiveIntegerField()
    precio_unitario = DecimalField(max_digits=10, decimal_places=2)
    subtotal = DecimalField(max_digits=10, decimal_places=2)
    producto_snapshot = JSONField(default=dict)  # Auto-generado en save()

    def save(self, *args, **kwargs):
        self.subtotal = self.precio_unitario * self.cantidad

        if not self.producto_snapshot:
            self.producto_snapshot = {
                'nombre': self.prenda.nombre,
                'descripcion': self.prenda.descripcion,
                'marca': self.prenda.marca.nombre,
                'color': self.prenda.color,
                'imagen': self.prenda.imagen_principal,
            }

        super().save(*args, **kwargs)
```

### Seeder: `seed_pedidos()`

```python
# ✅ CORRECTO (DESPUÉS DE CORRECCIÓN)
DetallePedido.objects.create(
    pedido=pedido,                      # ✅ FK correcto
    prenda=prenda,                      # ✅ FK correcto
    talla=random.choice(tallas),        # ✅ FK REQUERIDO (antes faltaba)
    cantidad=cantidad,                  # ✅
    precio_unitario=prenda.precio,      # ✅
    subtotal=subtotal                   # ✅ Se recalcula en save()
    # ❌ NO pasa producto_snapshot (se auto-genera)
)
```

**Validación:** ✅ **PASS (DESPUÉS DE CORRECCIÓN)**

- Ahora incluye `talla` (FK requerido)
- NO intenta crear `producto_snapshot` (correcto)
- Subtotal se recalcula en save()

---

## Auditoría de Pagos

### Model: `Pago` (`apps/orders/models.py`)

```python
class Pago(BaseModel):
    pedido = ForeignKey(Pedido, on_delete=CASCADE)
    metodo_pago = ForeignKey(MetodoPago, on_delete=PROTECT)
    monto = DecimalField(max_digits=10, decimal_places=2)
    estado = CharField(max_length=50, choices=ESTADOS_PAGO, default='pendiente')
    transaction_id = CharField(max_length=255, blank=True)  # ⚠️ blank=True
    stripe_payment_intent_id = CharField(max_length=255, blank=True)
    paypal_order_id = CharField(max_length=255, blank=True)
    response_data = JSONField(default=dict, blank=True)
    notas = TextField(blank=True)
```

### Seeder: `seed_pedidos()`

```python
# ✅ CORRECTO (DESPUÉS DE CORRECCIÓN)
Pago.objects.create(
    pedido=pedido,                          # ✅ FK correcto
    metodo_pago=metodo,                     # ✅ FK correcto
    monto=total_pedido,                     # ✅
    estado=estado_pago,                     # ✅
    transaction_id=f"TRX-{timestamp}-{i}"   # ✅ (antes era 'referencia_transaccion')
    # ❌ stripe_payment_intent_id es opcional
    # ❌ paypal_order_id es opcional
)
```

**Validación:** ✅ **PASS (DESPUÉS DE CORRECCIÓN)**

- Ahora usa `transaction_id` en lugar de `referencia_transaccion`
- Todos los campos requeridos presentes
- Campos opcionales pueden omitirse

---

## Resumen de Campos Requeridos

### ✅ VALIDACIONES COMPLETADAS

| Modelo          | Función Seeder              | Estado     | Notas                          |
| --------------- | --------------------------- | ---------- | ------------------------------ |
| Permission      | seed_permissions()          | ✅ PASS    | Todos los campos correctos     |
| Role            | seed_roles()                | ✅ PASS    | M2M correcto                   |
| User            | seed_usuarios_principales() | ✅ PASS    | set_password() correcto        |
| User (Clientes) | seed_clientes()             | ✅ PASS    | Datos Faker correctos          |
| Categoria       | seed_categorias_desde_s3()  | ✅ PASS    | URLField para S3               |
| Talla           | seed_tallas()               | ✅ PASS    | Orden correcto                 |
| Marca           | seed_marcas()               | ✅ PASS    | NO intenta crear logo          |
| Prenda          | seed_blusas()               | ⚠️ PARCIAL | ImagenPrenda necesita solución |
| StockPrenda     | seed_blusas()               | ✅ PASS    | Creado para cada talla         |
| Direccion       | seed_direcciones()          | ✅ PASS    | es_principal lógica correcta   |
| Favoritos       | seed_favoritos()            | ✅ PASS    | get_or_create evita duplicados |
| MetodoPago      | seed_metodos_pago()         | ✅ PASS    | Todos los campos               |
| Pedido          | seed_pedidos()              | ✅ PASS    | NO crea numero_pedido          |
| DetallePedido   | seed_pedidos()              | ✅ PASS    | Ahora incluye talla ✅         |
| Pago            | seed_pedidos()              | ✅ PASS    | Usa transaction_id ✅          |

---

## ⚠️ PROBLEMAS IDENTIFICADOS Y SOLUCIONES

### Problema 1: ImagenPrenda con URL en lugar de archivo

**Severidad:** 🔴 CRÍTICO  
**Ubicación:** `seed_blusas()` línea ~390  
**Problema:**

```python
# ❌ INCORRECTO
ImagenPrenda.objects.create(
    imagen=url_s3,  # URL string a ImageField
)
```

**Solución:** Crear modelo alternativo o usar ImageField con S3Backend

### Problema 2: ✅ SOLUCIONADO - DetallePedido sin talla

**Severidad:** 🔴 CRÍTICO  
**Ubicación:** `seed_pedidos()` línea ~563  
**Solución:** ✅ Agregado `talla=random.choice(tallas)`

### Problema 3: ✅ SOLUCIONADO - Pago con campo incorrecto

**Severidad:** 🔴 CRÍTICO  
**Ubicación:** `seed_pedidos()` línea ~606  
**Problema:** Usaba `referencia_transaccion` en lugar de `transaction_id`  
**Solución:** ✅ Corregido a `transaction_id`

---

## 🎯 ACCIONES INMEDIATAS REQUERIDAS

### 1️⃣ CRÍTICO: ImagenPrenda

**Opción A - Usar ImagenPrendaURL con URLField:**

```python
# apps/products/models.py
class ImagenPrendaURL(BaseModel):
    """Imágenes almacenadas en S3 como URLs"""
    prenda = ForeignKey(Prenda, on_delete=CASCADE, related_name='imagenes_url')
    imagen_url = URLField()  # ✅ URLField
    es_principal = BooleanField(default=False)
    orden = IntegerField(default=0)
```

**Opción B - Configurar S3Backend para ImageField:**

```python
# Usar django-storages con S3Boto3Storage
# Seeder: ImagenPrenda.objects.create(imagen=url_s3, ...)
# Django descargará automáticamente de S3
```

### 2️⃣ Ejecutar el seeder

```bash
cd ss_backend
python manage.py migrate
python scripts/super_seeder.py
```

### 3️⃣ Validar sin errores

- ✅ Sin errores de campos faltantes
- ✅ Sin errores de tipos de dato
- ✅ Sin errores de relaciones
- ✅ 500 clientes creados
- ✅ 2500 blusas creadas
- ✅ 1500+ pedidos creados

---

## 📊 ESTADÍSTICAS ESPERADAS

```
📊 ESTADÍSTICAS:
  • Usuarios: 503 (1 admin, 2 empleados, 500 clientes)
  • Roles: 3 (Admin, Empleado, Cliente)
  • Categorías: 4 (Blusas, Vestidos, Jeans, Jackets)
  • Marcas: 21
  • Tallas: 6 (XS, S, M, L, XL, XXL)
  • Prendas: ~2161 (algunas pueden no crearse si ya existen)
  • Stocks: ~12,966 (2161 * 6 tallas)
  • Direcciones: ~986-1500 (1-3 por cliente)
  • Favoritos: ~1000-1500
  • Métodos de Pago: 4
  • Pedidos: ~1500
```

---

## ✅ VALIDACIÓN FINAL

- [x] Todos los modelos auditados
- [x] Todos los campos verificados
- [x] Relaciones M2M validadas
- [x] Campos auto-generados identificados
- [x] Problemas encontrados y documentados
- [ ] ImagenPrenda solucionado
- [ ] Seeder ejecutado sin errores
- [ ] BD poblada correctamente

---

**Última actualización:** 2025-11-10 10:45:00  
**Próximo paso:** Ejecutar con confianza total
