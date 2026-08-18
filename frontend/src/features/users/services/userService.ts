import { httpClient } from '@/core/api/httpClient';
import { endpoints } from '@/core/api/endpoints';
import type { User } from '@/shared/types';

export interface UpdateProfilePayload {
  fullName?: string;
  phone?: string;
}

export const userService = {
  async me(): Promise<User> {
    const { data } = await httpClient.get<User>(endpoints.users.me);
    return data;
  },

  async updateMe(payload: UpdateProfilePayload): Promise<User> {
    const { data } = await httpClient.patch<User>(endpoints.users.me, payload);
    return data;
  },

  async listAll(): Promise<User[]> {
    const { data } = await httpClient.get<User[]>(endpoints.users.all);
    return data;
  },

  async updateStatus(id: number, isActive: boolean): Promise<User> {
    const { data } = await httpClient.patch<User>(
      endpoints.users.updateStatus(id),
      { isActive },
    );
    return data;
  },
};
