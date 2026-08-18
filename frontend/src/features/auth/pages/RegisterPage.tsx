import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Card } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { authService } from '@/features/auth/services/authService';
import { useAuthStore } from '@/features/auth/store/authStore';
import type { NormalizedApiError } from '@/core/api/httpClient';

const registerSchema = z.object({
  fullName: z.string().trim().min(3, 'Ingresa tu nombre completo'),
  email: z.string().trim().email('Ingresa un correo válido'),
  phone: z
    .string()
    .trim()
    .regex(/^\d{10}$/, 'Ingresa un teléfono a 10 dígitos')
    .optional()
    .or(z.literal('')),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterValues) {
    setLoading(true);
    try {
      const response = await authService.register({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone || undefined,
        password: values.password,
      });
      setAuth(response);
      toast.success(`Cuenta creada, ¡bienvenido ${response.user.fullName}!`);
      navigate('/', { replace: true });
    } catch (err) {
      const apiError = err as NormalizedApiError;
      toast.error(apiError.message ?? 'No se pudo crear la cuenta.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-sm p-6">
        <h1 className="font-heading text-2xl font-bold text-white mb-1">
          Crea tu cuenta
        </h1>
        <p className="text-sm text-beige/70 mb-6">
          Regístrate para empezar a pedir.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-beige/80 mb-1">
              Nombre completo
            </label>
            <input
              {...register('fullName')}
              className="w-full bg-dark-bg border border-dark-border rounded-btn px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.fullName && (
              <p className="text-red-400 text-xs mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

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
              Teléfono (opcional)
            </label>
            <input
              {...register('phone')}
              className="w-full bg-dark-bg border border-dark-border rounded-btn px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.phone && (
              <p className="text-red-400 text-xs mt-1">
                {errors.phone.message}
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
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </Button>
        </form>

        <p className="text-sm text-beige/60 mt-5 text-center">
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/login"
            className="text-primary font-semibold hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </Card>
    </div>
  );
}
