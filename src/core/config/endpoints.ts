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
    ITEMS: '/api/cart/items/',
    ITEM_BY_ID: (id: string) => `/api/cart/items/${id}/`,
    ADD_ITEM: '/api/cart/items/add/',
    UPDATE_ITEM: (id: string) => `/api/cart/items/${id}/update/`,
    REMOVE_ITEM: (id: string) => `/api/cart/items/${id}/delete/`,
    CLEAR: '/api/cart/clear/',
  },

  ORDERS: {
    BASE: '/api/orders/',
    BY_ID: (id: string) => `/api/orders/${id}/`,
    MY_ORDERS: '/api/orders/my-orders/',
    CREATE: '/api/orders/create/',
    CANCEL: (id: string) => `/api/orders/${id}/cancel/`,
    UPDATE_STATUS: (id: string) => `/api/orders/${id}/update-status/`,
  },

  CUSTOMERS: {
    BASE: '/api/customers/',
    PROFILE: '/api/customers/profile/',
    UPDATE_PROFILE: '/api/customers/profile/update/',
    ADDRESSES: '/api/customers/addresses/',
    ADDRESS_BY_ID: (id: string) => `/api/customers/addresses/${id}/`,
    FAVORITES: '/api/customers/favorites/',
    FAVORITE_BY_ID: (id: string) => `/api/customers/favorites/${id}/`,
    ADD_FAVORITE: '/api/customers/favorites/add/',
    REMOVE_FAVORITE: (productId: string | number) => `/api/customers/favorites/${productId}/remove/`,
  },
} as const;

export type EndpointKey = keyof typeof ENDPOINTS;
