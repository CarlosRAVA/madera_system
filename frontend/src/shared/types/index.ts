// ─── Tipos de dominio compartidos ──────────────────────────────────────────
// Reflejan las respuestas reales del backend NestJS (madera_system/backend).
//
// Nota importante: los campos monetarios (price, subtotal, deliveryFee,
// total, unitPrice) son `Decimal` en Prisma. Al serializarse a JSON viajan
// como STRING (ej. "35.00"), no como number — por eso el tipo aquí es
// `string` y siempre hay que convertirlos con Number(...) antes de operar
// o formatear (ver shared/utils/formatCurrency).

export type Role = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  fullName: string;
  phone: string | null;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
  _count?: { products: number };
}

export interface Product {
  id: number;
  categoryId: number;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  stock: number;
  isActive: boolean;
  category?: { id: number; name: string };
}

export type OrderStatus =
  'RECEIVED' | 'COOKING' | 'ON_THE_WAY' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: string;
  subtotal: string;
  product?: { id: number; name: string };
}

export interface Order {
  id: number;
  userId: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  subtotal: string;
  deliveryFee: string;
  total: string;
  status: OrderStatus;
  observations: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface CreateOrderResponse {
  order: Order;
  whatsappMessage: string;
  whatsappUrl: string;
}

export interface BusinessConfig {
  id: number;
  businessName: string;
  whatsappNumber: string;
  address: string | null;
  deliveryFee: string;
  isOpen: boolean;
  openingTime: string | null;
  closingTime: string | null;
  isOpenNow: boolean;
}

export interface LoginResponse {
  accessToken: string;
  user: Pick<User, 'id' | 'email' | 'fullName' | 'role'>;
}

/** Forma del error que devuelve NestJS (AllExceptionsFilter / class-validator) */
export interface ApiErrorShape {
  statusCode: number;
  message: string | string[];
  error: string;
}
