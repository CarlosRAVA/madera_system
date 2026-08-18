import axios, { AxiosError } from 'axios';
import { env } from '@/core/config/env';
import { useAuthStore } from '@/features/auth/store/authStore';
import type { ApiErrorShape } from '@/shared/types';

export const httpClient = axios.create({
  baseURL: env.apiUrl,
  headers: { 'Content-Type': 'application/json' },
});

// Adjunta el JWT (si existe sesión) a cada request.
httpClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }
  return config;
});

/** Forma normalizada de un error de API, cómoda de leer para la UI. */
export interface NormalizedApiError {
  status: number | null;
  message: string;
}

function normalizeError(error: AxiosError<ApiErrorShape>): NormalizedApiError {
  const status = error.response?.status ?? null;
  const data = error.response?.data;

  if (data?.message) {
    const message = Array.isArray(data.message)
      ? data.message.join(' ')
      : data.message;
    return { status, message };
  }

  if (error.code === 'ERR_NETWORK') {
    return {
      status,
      message: 'No se pudo conectar con el servidor. Verifica tu conexión.',
    };
  }

  return { status, message: 'Ocurrió un error inesperado. Intenta de nuevo.' };
}

// Normaliza errores y cierra la sesión automáticamente si el token expiró/es inválido.
httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorShape>) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(normalizeError(error));
  },
);
