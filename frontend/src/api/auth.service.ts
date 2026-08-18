import { apiClient } from '../api/apiClient';
import { useAuthStore } from '../stores/auth.store';
import type { LoginCredentials, AuthTokens, User } from '../types/auth.types';

/**
 * Servicio de autenticación — encapsula todas las llamadas a /api/auth/*
 */
export const authService = {
  /**
   * Iniciar sesión: obtiene tokens y datos del usuario
   */
  async login(credentials: LoginCredentials): Promise<void> {
    const { setTokens, setUser, setLoading } = useAuthStore.getState();
    setLoading(true);

    try {
      const { data } = await apiClient.post<AuthTokens>('/api/auth/login', credentials);
      setTokens(data.accessToken, data.refreshToken);

      // Decodifica el payload del JWT para obtener info básica del usuario
      const payload = JSON.parse(atob(data.accessToken.split('.')[1])) as {
        sub: number;
        email: string;
        role: 'ADMIN' | 'CUSTOMER';
      };

      setUser({
        id: payload.sub,
        email: payload.email,
        name: payload.email,
        role: payload.role,
      });
    } finally {
      setLoading(false);
    }
  },

  /**
   * Renovar access token usando el refresh token
   * Si falla → logout automático (manejado en el interceptor de apiClient)
   */
  async refresh(): Promise<void> {
    const { refreshToken, setTokens } = useAuthStore.getState();
    if (!refreshToken) return;

    const { data } = await apiClient.post<AuthTokens>('/api/auth/refresh', {
      refreshToken,
    });
    setTokens(data.accessToken, data.refreshToken);
  },

  /**
   * Cerrar sesión: invalida el refresh token en el servidor y limpia el estado local
   */
  async logout(): Promise<void> {
    const { logout } = useAuthStore.getState();
    try {
      await apiClient.post('/api/auth/logout');
    } catch {
      // Si falla el servidor igualmente limpiamos el estado local
    } finally {
      logout();
    }
  },

  /**
   * Obtener perfil del usuario autenticado
   */
  async getProfile(): Promise<User> {
    const { data } = await apiClient.get<User>('/api/users/me');
    return data;
  },
};
