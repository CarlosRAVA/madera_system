import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { LoginResponse } from '@/shared/types';

type AuthUser = LoginResponse['user'];

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuth: (data: LoginResponse) => void;
  logout: () => void;
}

/**
 * Sesión de autenticación (cliente o admin, según user.role). Persistida en
 * localStorage para que el usuario no tenga que volver a iniciar sesión al
 * recargar la página.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      setAuth: ({ accessToken, user }) =>
        set({ accessToken, user, isAuthenticated: true }),
      logout: () =>
        set({ accessToken: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'lr-auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
