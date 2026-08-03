import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface FormState {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  form?: string;
}

const initialState: FormState = { email: '', password: '' };

export default function LoginPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!form.email.trim()) newErrors.email = 'El email es requerido';
    if (!form.password) newErrors.password = 'La contraseña es requerida';
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const user = await login(form.email.trim(), form.password);
      navigate(user.role === 'ADMIN' ? '/admin' : '/menu', { replace: true });
    } catch (err) {
      setErrors({
        form: err instanceof Error ? err.message : 'No pudimos iniciar sesión. Intenta de nuevo.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (hasError?: string) =>
    `w-full rounded-lg border bg-white px-3.5 py-2.5 text-[#241C18] placeholder:text-[#B8A990] focus:outline-none focus:ring-2 focus:ring-[#C2551D]/40 ${
      hasError ? 'border-red-400' : 'border-[#E1D3BC]'
    }`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1F1815] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-[#F6EFE4] p-8 shadow-2xl shadow-black/40">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#C2551D]"
            aria-hidden="true"
          >
            <path
              d="M12 2C10 5 8 7 8 10a4 4 0 108 0c0-1-.3-2-1-3 0 1.5-.6 2-1.5 2C14.5 6 13 4 12 2z"
              fill="currentColor"
            />
            <path
              d="M6 14c0 3.3 2.7 6 6 6s6-2.7 6-6c0-1.5-.5-2.7-1.2-3.8.1 1.5-.8 2.6-2 2.6-1.4 0-2-1.1-2-2.3-1 1-1.5 2.3-1.5 3.5 0 1-.6 1.6-1.5 1.6S8 15 8 13.8c0-.6.1-1.1.3-1.6C6.6 13 6 13.4 6 14z"
              fill="currentColor"
              opacity="0.6"
            />
          </svg>
          <h1 className="font-serif text-2xl font-bold text-[#241C18]">Inicia sesión</h1>
          <p className="text-sm text-[#6B5C48]">Accede a tu cuenta para hacer tus pedidos</p>
        </div>

        {errors.form && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#3A2C1E]">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange('email')}
              className={inputClass(errors.email)}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[#3A2C1E]">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange('password')}
              className={inputClass(errors.password)}
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#C2551D] py-2.5 text-sm font-semibold text-white transition hover:bg-[#A8461A] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && (
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                aria-hidden="true"
              />
            )}
            {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6B5C48]">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="font-medium text-[#C2551D] hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
