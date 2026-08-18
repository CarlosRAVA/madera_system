import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Card } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { authService } from '@/features/auth/services/authService';
import { useAuthStore } from '@/features/auth/store/authStore';
import type { NormalizedApiError } from '@/core/api/httpClient';

const loginSchema = z.object({
  email: z.string().trim().email('Ingresa un correo válido'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginValues) {
    setLoading(true);
    try {
      const response = await authService.login(values);
      setAuth(response);
      toast.success(`Bienvenido, ${response.user.fullName}`);
      const from = (location.state as { from?: { pathname?: string } } | null)
        ?.from;
      navigate(from?.pathname ?? '/', { replace: true });
    } catch (err) {
      const apiError = err as NormalizedApiError;
      toast.error(apiError.message ?? 'No se pudo iniciar sesión.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-sm p-6">
        <h1 className="font-heading text-2xl font-bold text-white mb-1">
          Inicia sesión
        </h1>
        <p className="text-sm text-beige/70 mb-6">
          Accede para hacer tu pedido.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-beige/80 mb-1">
              Correo
            </label>
            <input
              type="email"
              {...register('email')}
              className="w-full bg-dark-bg border border-dark-border rounded-btn px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-beige/80 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              {...register('password')}
              className="w-full bg-dark-bg border border-dark-border rounded-btn px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </form>

        <p className="text-sm text-beige/60 mt-5 text-center">
          ¿No tienes cuenta?{' '}
          <Link
            to="/register"
            className="text-primary font-semibold hover:underline"
          >
            Regístrate
          </Link>
        </p>
      </Card>
    </div>
  );
}
