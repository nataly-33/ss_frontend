// Accesibles sin autenticación
export const PUBLIC_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (slug: string) => `/products/${slug}`,
  ABOUT: '/about',
  CONTACT: '/contact',
} as const;

// Requieren autenticación (cualquier usuario logueado)
export const PRIVATE_ROUTES = {
  PROFILE: '/profile',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_DETAIL: (id: string | number) => `/orders/${id}`,
  FAVORITES: '/favorites',
} as const;

// Requieren autenticación + permisos de admin
export const ADMIN_ROUTES = {
  DASHBOARD: '/admin',
  
  USERS: '/admin/users',
  USER_CREATE: '/admin/users/create',
  USER_EDIT: (id: string | number) => `/admin/users/edit/${id}`,
  
  ROLES: '/admin/roles',
  ROLE_CREATE: '/admin/roles/create',
  ROLE_EDIT: (id: string | number) => `/admin/roles/edit/${id}`,
  
  PRODUCTS: '/admin/products',
  PRODUCT_CREATE: '/admin/products/create',
  PRODUCT_EDIT: (id: string | number) => `/admin/products/edit/${id}`,
  
  CATEGORIES: '/admin/categories',
  CATEGORY_CREATE: '/admin/categories/create',
  CATEGORY_EDIT: (id: string | number) => `/admin/categories/edit/${id}`,
  
  BRANDS: '/admin/brands',
  BRAND_CREATE: '/admin/brands/create',
  BRAND_EDIT: (id: string | number) => `/admin/brands/edit/${id}`,
  
  ORDERS: '/admin/orders',
  ORDER_DETAIL: (id: string | number) => `/admin/orders/${id}`,
  
  REPORTS: '/admin/reports',
  SALES_REPORT: '/admin/reports/sales',
  INVENTORY_REPORT: '/admin/reports/inventory',
  
  SETTINGS: '/admin/settings',
} as const;


export const ROUTES = {
  ...PUBLIC_ROUTES,
  ...PRIVATE_ROUTES,
  ADMIN: ADMIN_ROUTES,
} as const;


export const isPublicRoute = (path: string): boolean => {
  const publicPaths = Object.values(PUBLIC_ROUTES).filter(
    (route) => typeof route === 'string'
  ) as string[];
  
  return publicPaths.some((route) => 
    path === route || path.startsWith(route.replace(':slug', ''))
  );
};


export const isAdminRoute = (path: string): boolean => {
  return path.startsWith('/admin');
};


export const isPrivateRoute = (path: string): boolean => {
  return !isPublicRoute(path);
};
