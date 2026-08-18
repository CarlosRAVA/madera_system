import { httpClient } from '@/core/api/httpClient';
import { endpoints } from '@/core/api/endpoints';
import type { LoginResponse } from '@/shared/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await httpClient.post<LoginResponse>(
      endpoints.auth.login,
      payload,
    );
    return data;
  },

  async register(payload: RegisterPayload): Promise<LoginResponse> {
    const { data } = await httpClient.post<LoginResponse>(
      endpoints.auth.register,
      payload,
    );
    return data;
  },
};
