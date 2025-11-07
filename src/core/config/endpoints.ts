export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login/',
    LOGOUT: '/api/auth/logout/',
    REFRESH: '/api/auth/refresh/',
    REGISTER: '/api/auth/register/',
    ME: '/api/auth/me/',
    CHANGE_PASSWORD: (id: string) => `/api/auth/users/${id}/change_password/`,
  },

  USERS: {
    BASE: '/api/auth/users/',
    BY_ID: (id: string) => `/api/auth/users/${id}/`,
    PROFILE: '/api/auth/profile/',
  },

  ROLES: {
    BASE: '/api/auth/roles/',
    BY_ID: (id: string ) => `/api/auth/roles/${id}/`,
  },

  PRODUCTS: {
    BASE: '/api/products/prendas/',
    BY_ID: (id: string) => `/api/products/prendas/${id}/`,
    BY_SLUG: (slug: string) => `/api/products/prendas/${slug}/`,
    CATEGORIES: '/api/products/categorias/',
    CATEGORY_BY_ID: (id: string) => `/api/products/categorias/${id}/`,
    BRANDS: '/api/products/marcas/',
    BRAND_BY_ID: (id: string ) => `/api/products/marcas/${id}/`,
    SIZES: '/api/products/tallas/',
    SIZE_BY_ID: (id: string) => `/api/products/tallas/${id}/`,
    SEARCH: '/api/products/prendas/search/',
  },

  CART: {
    BASE: '/api/cart/',
    MY_CART: '/api/cart/mi_carrito/',
    ADD_ITEM: '/api/cart/agregar/',
    UPDATE_ITEM: '/api/cart/actualizar_item/',
    REMOVE_ITEM: '/api/cart/eliminar_item/',
    CLEAR: '/api/cart/limpiar/',
  },

  ORDERS: {
    BASE: '/api/orders/pedidos/',
    BY_ID: (id: string) => `/api/orders/pedidos/${id}/`,
    MY_ORDERS: '/api/orders/pedidos/mis_pedidos/',
    CHECKOUT: '/api/orders/pedidos/checkout/',
    CANCEL: (id: string) => `/api/orders/pedidos/${id}/cancelar/`,
    UPDATE_STATUS: (id: string) => `/api/orders/pedidos/${id}/cambiar_estado/`,
    PAYMENT_METHODS: '/api/orders/metodos-pago/',
  },

  CUSTOMERS: {
    PROFILE: '/api/customers/profile/me/',
    UPDATE_PROFILE: '/api/customers/profile/me/',
    WALLET: '/api/customers/profile/wallet/',
    WALLET_RECHARGE: '/api/customers/profile/wallet_recharge/',
    ADDRESSES: '/api/customers/addresses/',
    ADDRESS_BY_ID: (id: string) => `/api/customers/addresses/${id}/`,
    SET_MAIN_ADDRESS: (id: string) => `/api/customers/addresses/${id}/set_principal/`,
    FAVORITES: '/api/customers/favorites/',
    FAVORITE_BY_ID: (id: string) => `/api/customers/favorites/${id}/`,
    TOGGLE_FAVORITE: '/api/customers/favorites/toggle/',
  },
} as const;

export type EndpointKey = keyof typeof ENDPOINTS;
