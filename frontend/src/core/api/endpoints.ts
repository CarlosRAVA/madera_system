// ─── Endpoints del backend (madera_system/backend) ─────────────────────────
// Centraliza las rutas para evitar strings mágicos repetidos en los services.

export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
  categories: {
    list: '/categories',
    detail: (id: number) => `/categories/${id}`,
  },
  products: {
    list: '/products',
    adminAll: '/products/admin/all',
    detail: (id: number) => `/products/${id}`,
  },
  businessConfig: {
    get: '/business-config',
  },
  orders: {
    create: '/orders',
    mine: '/orders/mine',
    all: '/orders',
    detail: (id: number) => `/orders/${id}`,
    updateStatus: (id: number) => `/orders/${id}/status`,
  },
  users: {
    me: '/users/me',
    all: '/users',
    updateStatus: (id: number) => `/users/${id}/status`,
  },
} as const;
