import { httpClient } from '@/core/api/httpClient';
import { endpoints } from '@/core/api/endpoints';
import type { Product } from '@/shared/types';

export interface ProductPayload {
  categoryId: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock: number;
  isActive?: boolean;
}

export const productService = {
  /** Catálogo público: solo productos activos, opcionalmente filtrados por categoría. */
  async list(categoryId?: number): Promise<Product[]> {
    const { data } = await httpClient.get<Product[]>(endpoints.products.list, {
      params: categoryId ? { categoryId } : undefined,
    });
    return data;
  },

  /** Listado completo (incluye inactivos), solo ADMIN. */
  async listAllAdmin(): Promise<Product[]> {
    const { data } = await httpClient.get<Product[]>(
      endpoints.products.adminAll,
    );
    return data;
  },

  async getById(id: number): Promise<Product> {
    const { data } = await httpClient.get<Product>(
      endpoints.products.detail(id),
    );
    return data;
  },

  async create(payload: ProductPayload): Promise<Product> {
    const { data } = await httpClient.post<Product>(
      endpoints.products.list,
      payload,
    );
    return data;
  },

  async update(id: number, payload: Partial<ProductPayload>): Promise<Product> {
    const { data } = await httpClient.put<Product>(
      endpoints.products.detail(id),
      payload,
    );
    return data;
  },

  async remove(id: number): Promise<void> {
    await httpClient.delete(endpoints.products.detail(id));
  },
};
