import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '../types/auth.types';

interface AuthStore {
  // Estado
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Acciones
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

/**
 * Store global de autenticación accesible desde cualquier componente.
 * - El access token se guarda en memoria (sessionStorage) para mayor seguridad
 * - El refresh token se persiste en sessionStorage
 * - Al cerrar la pestaña la sesión se limpia automáticamente
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user: User) => set({ user, isAuthenticated: true }),

      setTokens: (accessToken: string, refreshToken: string) =>
        set({ accessToken, refreshToken, isAuthenticated: true }),

      setLoading: (isLoading: boolean) => set({ isLoading }),

      /**
       * Logout: limpia todo el estado de autenticación.
       * Después del logout el refresh token previo no puede usarse.
       */
      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        }),
    }),
    {
      name: 'auth-storage',
      // Usar sessionStorage: los tokens se eliminan al cerrar el navegador
      storage: createJSONStorage(() => sessionStorage),
      // Solo persistir lo necesario — el accessToken NO se persiste en localStorage
      partialize: (state) => ({
        user: state.user,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
