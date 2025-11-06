# 📚 Guía de Documentación Técnica - Frontend SmartSales365

**Versión:** 1.0
**Fecha:** 6 de Noviembre, 2025
**Framework:** React 18 + TypeScript + Vite

---

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [Estructura de Carpetas](#estructura-de-carpetas)
4. [Tecnologías Utilizadas](#tecnologías-utilizadas)
5. [Módulos del Sistema](#módulos-del-sistema)
6. [Componentes Reutilizables](#componentes-reutilizables)
7. [Servicios y API](#servicios-y-api)
8. [Stores (Zustand)](#stores-zustand)
9. [Rutas y Navegación](#rutas-y-navegación)
10. [Sistema de Colores](#sistema-de-colores)
11. [Autenticación y Autorización](#autenticación-y-autorización)

---

## 🎯 Introducción

Este documento es la guía técnica completa del frontend de **SmartSales365**, una aplicación E-commerce/POS de ropa femenina con dashboard administrativo.

### Características Principales

- **React 18** con TypeScript para type-safety
- **Vite** para desarrollo rápido y build optimizado
- **TailwindCSS** para estilos utility-first
- **Zustand** para manejo de estado global
- **React Router v6** para navegación
- **Axios** para peticiones HTTP
- **Sistema RBAC** para control de acceso

---

## 🏗️ Arquitectura del Proyecto

### Arquitectura de Capas

```
┌──────────────────────────────────────┐
│       Presentación (UI)              │
│  Componentes, Páginas, Layouts       │
├──────────────────────────────────────┤
│     Estado Global (Stores)           │
│  Zustand: auth, cart (opcional)      │
├──────────────────────────────────────┤
│      Lógica de Negocio               │
│  Hooks personalizados, Utils         │
├──────────────────────────────────────┤
│     Capa de Datos (API)              │
│  Services, API Client, Interceptors  │
├──────────────────────────────────────┤
│        Backend (Django REST)         │
│  API REST con autenticación JWT      │
└──────────────────────────────────────┘
```

### Flujo de Datos

```
Usuario interactúa
    ↓
Componente React
    ↓
Action (si usa store) / Función del servicio
    ↓
Service (API Client)
    ↓
Backend (Django)
    ↓
Response
    ↓
State Update (Store o useState)
    ↓
Re-render del componente
```

---

## 📁 Estructura de Carpetas

```
ss_frontend/
├── public/                      # Archivos estáticos
│   └── logo.png
├── src/
│   ├── assets/                  # Imágenes, iconos, fuentes
│   │   └── images/
│   ├── core/                    # Funcionalidad core
│   │   ├── config/
│   │   │   └── api.config.ts    # Cliente Axios + Interceptors
│   │   ├── routes/
│   │   │   ├── index.tsx        # Definición de rutas
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── AdminRoute.tsx
│   │   ├── store/
│   │   │   ├── auth.store.ts    # Zustand - Autenticación
│   │   │   └── cart.store.ts    # (Opcional) Zustand - Carrito
│   │   ├── theme/
│   │   │   └── colors.ts
│   │   ├── hooks/               # Hooks personalizados
│   │   │   └── usePermissions.ts (pendiente)
│   │   └── types/               # Tipos TypeScript globales
│   │       └── index.ts
│   ├── modules/                 # Módulos por funcionalidad
│   │   ├── auth/                # Autenticación
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── RegisterPage.tsx
│   │   │   ├── components/
│   │   │   └── services/
│   │   │       └── auth.service.ts
│   │   ├── products/            # Catálogo de productos
│   │   │   ├── pages/
│   │   │   │   ├── HomePage.tsx
│   │   │   │   ├── ProductsPage.tsx
│   │   │   │   └── ProductDetailPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   ├── ProductFilters.tsx
│   │   │   │   └── ProductGrid.tsx
│   │   │   └── services/
│   │   │       └── products.service.ts
│   │   ├── cart/                # Carrito de compras
│   │   │   ├── pages/
│   │   │   │   └── CartPage.tsx (PENDIENTE conectar)
│   │   │   └── services/
│   │   │       └── cart.service.ts ✅
│   │   ├── checkout/            # Proceso de checkout
│   │   │   ├── pages/
│   │   │   │   └── CheckoutPage.tsx (PENDIENTE implementar)
│   │   │   └── components/
│   │   ├── customers/           # Cliente (perfil, favoritos)
│   │   │   ├── pages/
│   │   │   │   ├── ProfilePage.tsx (PENDIENTE)
│   │   │   │   └── FavoritesPage.tsx (PENDIENTE)
│   │   │   └── services/
│   │   │       └── customers.service.ts ✅
│   │   ├── orders/              # Pedidos
│   │   │   ├── pages/
│   │   │   │   ├── OrdersPage.tsx (PENDIENTE conectar)
│   │   │   │   └── OrderDetailPage.tsx (PENDIENTE)
│   │   │   └── services/
│   │   │       └── orders.service.ts ✅
│   │   └── dashboard/           # Dashboard administrativo
│   │       ├── pages/
│   │       │   ├── AdminDashboard.tsx ✅
│   │       │   ├── UsersManagment.tsx ✅
│   │       │   ├── ProductsManagement.tsx ✅
│   │       │   ├── CategoriesManagement.tsx ✅
│   │       │   └── RolesManagment.tsx ✅
│   │       └── components/
│   │           ├── UsersManagement.tsx (alternativa)
│   │           ├── ProductsManagement.tsx (alternativa)
│   │           ├── CategoriesManagement.tsx (alternativa)
│   │           └── RolesManagement.tsx (alternativa)
│   ├── shared/                  # Componentes compartidos
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── MainLayout.tsx
│   │   │   └── ui/
│   │   │       ├── Button.tsx
│   │   │       ├── Input.tsx
│   │   │       ├── Card.tsx
│   │   │       └── Modal.tsx
│   │   └── utils/
│   │       └── cn.ts            # Utilidad para clases CSS
│   ├── App.tsx                  # Componente raíz
│   ├── App.css
│   ├── main.tsx                 # Entry point
│   └── index.css                # Estilos base + Tailwind
├── docs/                        # Documentación
│   ├── documentation_guide.md   # Este archivo
│   ├── testing_guide.md
│   ├── rbac.md
│   └── status.md
├── .env                         # Variables de entorno
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js           # Configuración Tailwind
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

---

## 🛠️ Tecnologías Utilizadas

### Core

| Tecnología | Versión | Propósito   |
| ---------- | ------- | ----------- |
| React      | 18.3.1  | Librería UI |
| TypeScript | 5.5.3   | Type safety |
| Vite       | 5.4.2   | Build tool  |

### UI y Estilos

| Tecnología  | Versión | Propósito         |
| ----------- | ------- | ----------------- |
| TailwindCSS | 3.4.1   | Utility-first CSS |
| Lucide React| 0.263.1 | Iconos            |

### Estado y Datos

| Tecnología | Versión | Propósito        |
| ---------- | ------- | ---------------- |
| Zustand    | 4.5.0   | State management |
| Axios      | 1.7.2   | HTTP client      |

### Navegación

| Tecnología   | Versión | Propósito |
| ------------ | ------- | --------- |
| React Router | 6.22.0  | Routing   |

---

## 📦 Módulos del Sistema

### 1. Auth (Autenticación)

**Ruta:** `src/modules/auth/`

#### Páginas

##### LoginPage.tsx

**Ruta:** `/login`

**Descripción:** Página de inicio de sesión con email y contraseña.

**Funcionalidades:**
- Formulario de login con validación básica
- Manejo de errores
- **PROBLEMA**: Siempre redirige a `/` sin importar el rol
- Persistencia de sesión con localStorage

**Código actual:**
```typescript
// src/modules/auth/pages/LoginPage.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await authService.login(email, password);
    login(response.user, response.access, response.refresh);

    // ❌ PROBLEMA: Siempre redirige a /
    navigate("/");
  } catch (error) {
    // Error handling
  }
};
```

**CORRECCIÓN NECESARIA:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await authService.login(email, password);
    login(response.user, response.access, response.refresh);

    // ✅ Redirigir según rol
    const rol = response.user.rol_detalle?.nombre;
    if (rol === "Admin" || rol === "Empleado") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  } catch (error) {
    toast.error("Credenciales inválidas");
  }
};
```

##### RegisterPage.tsx

**Ruta:** `/register`

**Descripción:** Registro de nuevos clientes.

**Funcionalidades:**
- Formulario con nombre, apellido, email, password, teléfono
- Validación de campos
- Crea usuario con rol "Cliente" automáticamente

**Estado:** ✅ Funcional

#### Servicios

##### auth.service.ts

**Descripción:** Maneja autenticación con el backend.

**Ubicación:** `src/modules/auth/services/auth.service.ts`

**Métodos:**

```typescript
interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  nombre_completo: string;
  rol_detalle?: {
    nombre: string;
    permisos: Permission[];
  };
}

export const authService = {
  // Login
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post("/auth/login/", { email, password });
    return response.data;
  },

  // Registro
  async register(data: RegisterData): Promise<User> {
    const response = await api.post("/auth/register/register/", data);
    return response.data;
  },

  // Refresh token
  async refreshToken(refreshToken: string): Promise<string> {
    const response = await api.post("/auth/refresh/", { refresh: refreshToken });
    return response.data.access;
  },

  // Obtener usuario actual
  async getProfile(): Promise<User> {
    const response = await api.get("/auth/users/me/");
    return response.data;
  },

  // Logout
  logout(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    // El store se limpia desde auth.store.logout()
  },
};
```

#### Store

**Archivo:** `src/core/store/auth.store.ts`

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  nombre_completo: string;
  rol_detalle?: {
    nombre: string;
    permisos: Permission[];
  };
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

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (user, access, refresh) => {
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);

        set({
          user,
          accessToken: access,
          refreshToken: refresh,
          isAuthenticated: true,
        });
      },

      logout: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      updateUser: (user) => set({ user }),
    }),
    {
      name: "auth-storage",
    }
  )
);
```

---

### 2. Products (Catálogo de Productos)

**Ruta:** `src/modules/products/`

#### Páginas

##### HomePage.tsx

**Ruta:** `/`

**Descripción:** Página principal con hero, categorías y productos destacados.

**Secciones:**
1. Hero carousel (imágenes destacadas)
2. Grid de categorías con imágenes
3. Productos destacados
4. Productos nuevos

**Estado:** ✅ Funcional

##### ProductsPage.tsx

**Ruta:** `/products`

**Descripción:** Listado de productos con filtros.

**Funcionalidades:**
- Grid responsive de productos
- Búsqueda por nombre
- Filtros por categoría, marca, precio
- Paginación

**Código clave:**
```typescript
const [products, setProducts] = useState<Product[]>([]);
const [filters, setFilters] = useState({
  search: "",
  categoria: "",
  marca: "",
  precio_min: "",
  precio_max: "",
});

useEffect(() => {
  loadProducts();
}, [filters]);

const loadProducts = async () => {
  const data = await productsService.getProducts(filters);
  setProducts(data.results);
};
```

**Estado:** ✅ Funcional

##### ProductDetailPage.tsx

**Ruta:** `/products/:slug`

**Descripción:** Detalle completo del producto.

**Funcionalidades:**
- Galería de imágenes
- Información del producto (nombre, precio, descripción, marca)
- Selector de talla
- Selector de cantidad
- Botón "Agregar al carrito"
- Verificación de stock por talla

**Estado:** ✅ Funcional

#### Componentes

- `ProductCard.tsx` - Card de producto con imagen, nombre, precio
- `ProductFilters.tsx` - Filtros laterales
- `ProductGrid.tsx` - Grid responsive de productos

#### Servicio

**Archivo:** `src/modules/products/services/products.service.ts`

```typescript
export const productsService = {
  // Listar productos
  async getProducts(params?: ProductFilters) {
    const response = await api.get("/products/prendas/", { params });
    return response.data;
  },

  // Detalle de producto
  async getProduct(slug: string): Promise<Product> {
    const response = await api.get(`/products/prendas/${slug}/`);
    return response.data;
  },

  // Categorías
  async getCategories(): Promise<Category[]> {
    const response = await api.get("/products/categorias/");
    return response.data.results;
  },

  // Marcas
  async getBrands(): Promise<Brand[]> {
    const response = await api.get("/products/marcas/");
    return response.data.results;
  },

  // Tallas
  async getSizes(): Promise<Size[]> {
    const response = await api.get("/products/tallas/");
    return response.data.results;
  },
};
```

---

### 3. Cart (Carrito de Compras)

**Ruta:** `src/modules/cart/`

#### Páginas

##### CartPage.tsx

**Ruta:** `/cart`

**Estado actual:** ⚠️ Estructura HTML sin lógica conectada

**Funcionalidades requeridas:**
- Mostrar items del carrito
- Incrementar/decrementar cantidad
- Eliminar items
- Mostrar total
- Botón "Ir a Checkout"

**IMPLEMENTACIÓN PENDIENTE:**

```typescript
// src/modules/cart/pages/CartPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cartService } from "../services/cart.service";
import { Cart } from "../types";

export const CartPage = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      await cartService.updateItem(itemId, newQuantity);
      await loadCart(); // Recargar carrito
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await cartService.removeItem(itemId);
      await loadCart();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (loading) return <div>Cargando...</div>;
  if (!cart || cart.items.length === 0) {
    return <div>Tu carrito está vacío</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mi Carrito</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items del carrito */}
        <div className="lg:col-span-2">
          {cart.items.map((item) => (
            <div key={item.id} className="flex gap-4 border-b py-4">
              <img
                src={item.prenda.imagen_principal}
                alt={item.prenda.nombre}
                className="w-24 h-24 object-cover rounded"
              />

              <div className="flex-1">
                <h3 className="font-semibold">{item.prenda.nombre}</h3>
                <p className="text-gray-600">Talla: {item.talla.nombre}</p>
                <p className="text-primary-600 font-bold">
                  Bs. {item.precio_unitario}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateQuantity(item.id, item.cantidad - 1)}
                  disabled={item.cantidad <= 1}
                  className="px-2 py-1 border rounded"
                >
                  -
                </button>
                <span className="px-4">{item.cantidad}</span>
                <button
                  onClick={() => handleUpdateQuantity(item.id, item.cantidad + 1)}
                  className="px-2 py-1 border rounded"
                >
                  +
                </button>
              </div>

              <div>
                <p className="font-bold">Bs. {item.subtotal}</p>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-600 text-sm mt-2"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="border p-6 rounded-lg h-fit">
          <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal ({cart.total_items} items)</span>
              <span>Bs. {cart.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío</span>
              <span>Gratis</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>Bs. {cart.total}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600"
          >
            Proceder al Checkout
          </button>
        </div>
      </div>
    </div>
  );
};
```

#### Servicio

**Archivo:** `src/modules/cart/services/cart.service.ts` ✅ YA CREADO

```typescript
import { api } from "@/core/config/api.config";

interface CartItem {
  id: string;
  prenda: {
    id: string;
    nombre: string;
    imagen_principal: string;
  };
  talla: {
    id: string;
    nombre: string;
  };
  cantidad: number;
  precio_unitario: string;
  subtotal: string;
}

interface Cart {
  id: string;
  items: CartItem[];
  total_items: number;
  subtotal: string;
  total: string;
}

export const cartService = {
  async getCart(): Promise<Cart> {
    const response = await api.get("/cart/");
    return response.data;
  },

  async addItem(prendaId: string, tallaId: string, cantidad: number = 1) {
    const response = await api.post("/cart/add/", {
      prenda_id: prendaId,
      talla_id: tallaId,
      cantidad,
    });
    return response.data;
  },

  async updateItem(itemId: string, cantidad: number) {
    const response = await api.patch(`/cart/${itemId}/update-item/`, {
      cantidad,
    });
    return response.data;
  },

  async removeItem(itemId: string) {
    await api.delete(`/cart/${itemId}/remove/`);
  },

  async clearCart() {
    await api.post("/cart/clear/");
  },
};
```

---

### 4. Checkout (Proceso de Compra)

**Ruta:** `src/modules/checkout/`

#### Páginas

##### CheckoutPage.tsx

**Ruta:** `/checkout`

**Estado actual:** ❌ Estructura básica sin implementación completa

**Funcionalidades requeridas:**
1. **Paso 1**: Seleccionar o crear dirección de envío
2. **Paso 2**: Seleccionar método de pago
3. **Paso 3**: Resumen del pedido
4. **Paso 4**: Confirmar y crear pedido

**IMPLEMENTACIÓN COMPLETA REQUERIDA:**

```typescript
// src/modules/checkout/pages/CheckoutPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cartService } from "@/modules/cart/services/cart.service";
import { customersService } from "@/modules/customers/services/customers.service";
import { ordersService } from "@/modules/orders/services/orders.service";

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Datos
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  // Selección
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [selectedPaymentId, setSelectedPaymentId] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCheckoutData();
  }, []);

  const loadCheckoutData = async () => {
    try {
      const [cartData, addressesData, paymentMethodsData] = await Promise.all([
        cartService.getCart(),
        customersService.getAddresses(),
        ordersService.getPaymentMethods(),
      ]);

      setCart(cartData);
      setAddresses(addressesData);
      setPaymentMethods(paymentMethodsData);

      // Seleccionar dirección principal por defecto
      const mainAddress = addressesData.find((addr) => addr.es_principal);
      if (mainAddress) {
        setSelectedAddressId(mainAddress.id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmOrder = async () => {
    setLoading(true);
    try {
      const order = await ordersService.createOrder({
        direccion_envio_id: selectedAddressId,
        metodo_pago_id: selectedPaymentId,
        notas: notes,
      });

      // Redirigir a detalle del pedido
      navigate(`/orders/${order.id}`);
    } catch (error) {
      console.error(error);
      alert("Error al crear el pedido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Steps indicator */}
      <div className="flex justify-between mb-8">
        <div className={step >= 1 ? "text-primary-500" : "text-gray-400"}>
          1. Dirección
        </div>
        <div className={step >= 2 ? "text-primary-500" : "text-gray-400"}>
          2. Pago
        </div>
        <div className={step >= 3 ? "text-primary-500" : "text-gray-400"}>
          3. Confirmar
        </div>
      </div>

      {/* Paso 1: Dirección */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Dirección de Envío</h2>
          {addresses.map((address) => (
            <div
              key={address.id}
              onClick={() => setSelectedAddressId(address.id)}
              className={`border p-4 rounded mb-2 cursor-pointer ${
                selectedAddressId === address.id
                  ? "border-primary-500 bg-primary-50"
                  : ""
              }`}
            >
              <p className="font-semibold">{address.direccion_completa}</p>
              {address.es_principal && (
                <span className="text-xs text-primary-600">Principal</span>
              )}
            </div>
          ))}

          <button
            onClick={() => setStep(2)}
            disabled={!selectedAddressId}
            className="mt-4 bg-primary-500 text-white px-6 py-2 rounded"
          >
            Continuar
          </button>
        </div>
      )}

      {/* Paso 2: Método de pago */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Método de Pago</h2>
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              onClick={() => setSelectedPaymentId(method.id)}
              className={`border p-4 rounded mb-2 cursor-pointer ${
                selectedPaymentId === method.id
                  ? "border-primary-500 bg-primary-50"
                  : ""
              }`}
            >
              <p className="font-semibold">{method.nombre}</p>
              <p className="text-sm text-gray-600">{method.descripcion}</p>
            </div>
          ))}

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setStep(1)}
              className="border px-6 py-2 rounded"
            >
              Atrás
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!selectedPaymentId}
              className="bg-primary-500 text-white px-6 py-2 rounded"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* Paso 3: Confirmación */}
      {step === 3 && cart && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Confirmar Pedido</h2>

          {/* Resumen del carrito */}
          <div className="border p-4 rounded mb-4">
            <h3 className="font-semibold mb-2">Productos</h3>
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between py-2">
                <span>
                  {item.prenda.nombre} x{item.cantidad}
                </span>
                <span>Bs. {item.subtotal}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2 flex justify-between font-bold">
              <span>Total</span>
              <span>Bs. {cart.total}</span>
            </div>
          </div>

          {/* Notas */}
          <div className="mb-4">
            <label className="block mb-2">Notas adicionales (opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border rounded p-2"
              rows={3}
              placeholder="Instrucciones de entrega, etc."
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep(2)}
              className="border px-6 py-2 rounded"
            >
              Atrás
            </button>
            <button
              onClick={handleConfirmOrder}
              disabled={loading}
              className="bg-primary-500 text-white px-6 py-2 rounded"
            >
              {loading ? "Procesando..." : "Confirmar Pedido"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
```

---

### 5. Customers (Perfil y Favoritos)

**Ruta:** `src/modules/customers/`

#### Páginas

##### ProfilePage.tsx

**Ruta:** `/profile`

**Estado:** ❌ PENDIENTE IMPLEMENTACIÓN COMPLETA

**Funcionalidades requeridas:**
- Tab 1: Datos personales (editable)
- Tab 2: Mis direcciones (CRUD)
- Tab 3: Seguridad (cambiar contraseña - opcional)

##### FavoritesPage.tsx

**Ruta:** `/favorites`

**Estado:** ❌ PENDIENTE IMPLEMENTACIÓN

**Funcionalidades:**
- Grid de productos favoritos
- Botón eliminar de favoritos
- Botón agregar al carrito

#### Servicio

**Archivo:** `src/modules/customers/services/customers.service.ts` ✅ YA CREADO

```typescript
export const customersService = {
  async getProfile() {
    const response = await api.get("/customers/profile/");
    return response.data;
  },

  async updateProfile(data: Partial<ProfileData>) {
    const response = await api.patch("/customers/profile/", data);
    return response.data;
  },

  async getAddresses() {
    const response = await api.get("/customers/addresses/");
    return response.data;
  },

  async createAddress(data: AddressData) {
    const response = await api.post("/customers/addresses/", data);
    return response.data;
  },

  async updateAddress(id: string, data: Partial<AddressData>) {
    const response = await api.patch(`/customers/addresses/${id}/`, data);
    return response.data;
  },

  async deleteAddress(id: string) {
    await api.delete(`/customers/addresses/${id}/`);
  },

  async getFavorites() {
    const response = await api.get("/customers/favorites/");
    return response.data;
  },

  async addFavorite(prendaId: string) {
    const response = await api.post("/customers/favorites/", {
      prenda_id: prendaId,
    });
    return response.data;
  },

  async removeFavorite(id: string) {
    await api.delete(`/customers/favorites/${id}/`);
  },
};
```

---

### 6. Orders (Pedidos)

**Ruta:** `src/modules/orders/`

#### Páginas

##### OrdersPage.tsx

**Ruta:** `/orders`

**Estado:** ⚠️ Estructura sin conexión a backend

**Funcionalidades requeridas:**
- Lista de pedidos del usuario
- Filtros por estado
- Link a detalle

##### OrderDetailPage.tsx

**Ruta:** `/orders/:id`

**Estado:** ⚠️ Estructura básica

**Funcionalidades:**
- Información completa del pedido
- Productos incluidos
- Estado del pedido
- Dirección de envío
- Método de pago
- Historial de estados
- Botón cancelar (si aplica)

#### Servicio

**Archivo:** `src/modules/orders/services/orders.service.ts` ✅ YA CREADO

```typescript
export const ordersService = {
  async getOrders() {
    const response = await api.get("/orders/pedidos/");
    return response.data;
  },

  async getOrder(id: string) {
    const response = await api.get(`/orders/pedidos/${id}/`);
    return response.data;
  },

  async createOrder(data: CreateOrderData) {
    const response = await api.post("/orders/pedidos/", data);
    return response.data;
  },

  async cancelOrder(id: string) {
    const response = await api.post(`/orders/pedidos/${id}/cancel/`);
    return response.data;
  },

  async getPaymentMethods() {
    const response = await api.get("/orders/metodos-pago/");
    return response.data;
  },
};
```

---

### 7. Dashboard (Administración)

**Ruta:** `src/modules/dashboard/`

#### Páginas Implementadas ✅

1. **AdminDashboard.tsx** (`/admin`) - Layout con sidebar
2. **UsersManagment.tsx** (`/admin/users`) - CRUD usuarios
3. **ProductsManagement.tsx** (`/admin/products`) - CRUD productos
4. **CategoriesManagement.tsx** (`/admin/categories`) - CRUD categorías
5. **RolesManagment.tsx** (`/admin/roles`) - CRUD roles

#### Páginas Pendientes ❌

1. **DashboardOverview** - Estadísticas y métricas
2. **BrandsManagement** - CRUD marcas
3. **OrdersManagement** - Gestión de todos los pedidos
4. **ReportsManagement** - Generación de reportes
5. **SettingsManagement** - Configuración del sistema

#### Problema: Permisos

**Código actual:**
```typescript
// AdminDashboard.tsx
const hasPermission = (permission?: string) => {
  if (!permission) return true;
  if (user?.rol_detalle?.nombre === "Admin") return true;
  // TODO: Lógica de permisos más detallada
  return true; // ❌ SIEMPRE RETORNA TRUE
};
```

**CORRECCIÓN NECESARIA:**
```typescript
const hasPermission = (permission?: string) => {
  if (!permission) return true;
  if (user?.rol_detalle?.nombre === "Admin") return true;

  // Verificar en la lista de permisos del usuario
  return user?.rol_detalle?.permisos?.some(
    (p) => p.codigo === permission
  ) || false;
};
```

---

## 🎨 Componentes Reutilizables

**Ubicación:** `src/shared/components/`

### Layout

#### Navbar.tsx
- Logo
- Menú de navegación
- Icono de carrito con contador
- Botón de login/perfil

#### Footer.tsx
- Links útiles
- Redes sociales
- Copyright

#### MainLayout.tsx
```typescript
export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
```

### UI Components

#### Button.tsx
```typescript
interface ButtonProps {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}
```

#### Input.tsx
```typescript
interface InputProps {
  label?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
}
```

---

## 🔌 Servicios y API

### API Client

**Archivo:** `src/core/config/api.config.ts`

```typescript
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Agregar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ❌ FALTA: Response interceptor para refresh token
// TODO: Implementar
```

**IMPLEMENTACIÓN NECESARIA del Response Interceptor:**

```typescript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Token expirado - intentar refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        localStorage.setItem("access_token", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh falló - logout
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

---

## 🗄️ Stores (Zustand)

### auth.store.ts

Ver sección [Auth](#1-auth-autenticación)

### cart.store.ts (Opcional)

**Estado:** NO implementado

**¿Para qué?** Optimizar UX manteniendo carrito en memoria local.

**Decisión:** NO necesario por ahora, el backend maneja todo.

---

## 🛣️ Rutas y Navegación

### Configuración

**Archivo:** `src/core/routes/index.tsx`

```typescript
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminRoute } from "./AdminRoute";
import { MainLayout } from "@/shared/components/layout/MainLayout";

// Páginas
import { HomePage } from "@/modules/products/pages/HomePage";
import { ProductsPage } from "@/modules/products/pages/ProductsPage";
import { ProductDetailPage } from "@/modules/products/pages/ProductDetailPage";
import { LoginPage } from "@/modules/auth/pages/LoginPage";
import { RegisterPage } from "@/modules/auth/pages/RegisterPage";
import { CartPage } from "@/modules/cart/pages/CartPage";
import { CheckoutPage } from "@/modules/checkout/pages/CheckoutPage";
import { ProfilePage } from "@/modules/customers/pages/ProfilePage";
import { FavoritesPage } from "@/modules/customers/pages/FavoritesPage";
import { OrdersPage } from "@/modules/orders/pages/OrdersPage";
import { OrderDetailPage } from "@/modules/orders/pages/OrderDetailPage";
import { AdminDashboard } from "@/modules/dashboard/pages/AdminDashboard";
// ... más imports

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Rutas protegidas (requieren login) */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
      </Route>

      {/* Rutas admin (Admin/Empleado) */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>}>
        <Route index element={<Navigate to="/admin/users" replace />} />
        <Route path="users" element={<UsersManagment />} />
        <Route path="products" element={<ProductsManagement />} />
        <Route path="categories" element={<CategoriesManagement />} />
        <Route path="roles" element={<RolesManagment />} />
        {/* Agregar más rutas admin */}
      </Route>

      {/* 404 */}
      <Route path="*" element={<div>404 - Página no encontrada</div>} />
    </Routes>
  );
};
```

### ProtectedRoute

**Archivo:** `src/core/routes/ProtectedRoute.tsx`

```typescript
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/core/store/auth.store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
```

### AdminRoute

**Archivo:** `src/core/routes/AdminRoute.tsx`

```typescript
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/core/store/auth.store";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
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

## 🎨 Sistema de Colores

**Archivo:** `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#ec4899", // Principal
          600: "#db2777",
          700: "#be185d",
          800: "#9d174d",
          900: "#831843",
        },
        neutral: {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524", // Texto oscuro
          900: "#1c1917",
        },
        background: {
          DEFAULT: "#fdf2f8", // Rosado claro
          dark: "#1c1917", // Café oscuro
        },
      },
    },
  },
  plugins: [],
};
```

**Uso:**
```tsx
<div className="bg-primary-500 text-white">Botón primario</div>
<div className="bg-background text-neutral-900">Fondo claro</div>
<div className="bg-neutral-800 text-white">Fondo oscuro</div>
```

---

## 🔐 Autenticación y Autorización

### Flujo Completo

1. **Usuario ingresa credenciales** → LoginPage
2. **Frontend envía POST /api/auth/login/** → authService.login()
3. **Backend valida y retorna JWT** → { access, refresh, user }
4. **Frontend guarda en store y localStorage** → useAuthStore.login()
5. **DEBERÍA redirigir según rol** → Admin a `/admin`, Cliente a `/`
6. **Todas las requests incluyen token** → api.interceptors.request
7. **Si token expira (401)** → api.interceptors.response refresca

### Protección de Rutas

- **Públicas**: HomePage, ProductsPage, ProductDetailPage, LoginPage, RegisterPage
- **Autenticadas**: CartPage, CheckoutPage, ProfilePage, FavoritesPage, OrdersPage
- **Admin**: /admin/*

---

## ⚠️ Problemas Críticos Identificados

1. **Login NO redirige por rol** - LoginPage.tsx línea 33
2. **CartPage NO funciona** - Falta conectar con cart.service
3. **CheckoutPage NO funciona** - Falta implementación completa
4. **ProfilePage NO existe** - Crear desde cero
5. **FavoritesPage NO existe** - Crear desde cero
6. **OrdersPage NO conectado** - Conectar con orders.service
7. **NO hay interceptor refresh token** - api.config.ts
8. **Permisos granulares NO funcionan** - AdminDashboard.tsx

---

## 📊 Estado del Frontend

| Módulo     | Completitud | Notas                              |
| ---------- | ----------- | ---------------------------------- |
| Auth       | 90%         | Falta redirección por rol          |
| Products   | 100%        | ✅ Funcional                       |
| Cart       | 30%         | Servicio listo, página sin lógica  |
| Checkout   | 20%         | Estructura básica                  |
| Customers  | 10%         | Solo servicio creado               |
| Orders     | 40%         | Estructura sin conexión backend    |
| Dashboard  | 60%         | 4 páginas listas, faltan 5 más     |

**Promedio: 60%**

---

## 🚀 Próximos Pasos

1. Arreglar redireccion login (15 min)
2. Implementar CartPage (2 horas)
3. Implementar CheckoutPage (3 horas)
4. Implementar ProfilePage (2 horas)
5. Implementar FavoritesPage (1 hora)
6. Conectar OrdersPage (1 hora)
7. Agregar interceptor refresh token (30 min)
8. Implementar hook usePermissions (1 hora)

**Total estimado: 10-12 horas**

---

**Última actualización:** 6 de Noviembre 2025
