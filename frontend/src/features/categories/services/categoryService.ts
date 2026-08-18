import { httpClient } from '@/core/api/httpClient';
import { endpoints } from '@/core/api/endpoints';
import type { Category } from '@/shared/types';

export interface CategoryPayload {
  name: string;
  description?: string;
  isActive?: boolean;
}

export const categoryService = {
  async list(): Promise<Category[]> {
    const { data } = await httpClient.get<Category[]>(
      endpoints.categories.list,
    );
    return data;
  },

  async create(payload: CategoryPayload): Promise<Category> {
    const { data } = await httpClient.post<Category>(
      endpoints.categories.list,
      payload,
    );
    return data;
  },

  async update(
    id: number,
    payload: Partial<CategoryPayload>,
  ): Promise<Category> {
    const { data } = await httpClient.put<Category>(
      endpoints.categories.detail(id),
      payload,
    );
    return data;
  },

  async remove(id: number): Promise<void> {
    await httpClient.delete(endpoints.categories.detail(id));
  },
};
