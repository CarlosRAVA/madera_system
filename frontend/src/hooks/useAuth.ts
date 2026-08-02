import { useAuthStore } from '../stores/auth.store';

/**
 * Hook para acceder al estado de autenticación desde cualquier componente.
 * Evita importar el store directamente en los componentes.
 */
export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
  };
};
