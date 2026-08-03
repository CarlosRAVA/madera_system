import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialState: FormState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  address: '',
};

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.name.trim()) {
    errors.name = 'El nombre es requerido';
  }

  if (!form.email.trim()) {
    errors.email = 'El email es requerido';
  } else if (!EMAIL_REGEX.test(form.email)) {
    errors.email = 'El email no tiene un formato válido';
  }

  if (!form.password) {
    errors.password = 'La contraseña es requerida';
  } else if (form.password.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres';
  }

  if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'Las contraseñas no coinciden';
  }

  return errors;
}

function FieldLabel({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string;
  children: ReactNode;
  optional?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-[#3A2C1E]">
      {children}
      {optional && <span className="ml-1 font-normal text-[#9C8B76]">(opcional)</span>}
    </label>
  );
}

export default function RegisterPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim() || undefined,
        address: form.address.trim() || undefined,
      });
      navigate('/menu', { replace: true });
    } catch (err) {
      setErrors({
        form: err instanceof Error ? err.message : 'No pudimos crear tu cuenta. Intenta de nuevo.',
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
          <h1 className="font-serif text-2xl font-bold text-[#241C18]">Crea tu cuenta</h1>
          <p className="text-sm text-[#6B5C48]">
            Regístrate para guardar tus datos y pedir más rápido
          </p>
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
            <FieldLabel htmlFor="name">Nombre</FieldLabel>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={handleChange('name')}
              className={inputClass(errors.name)}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          <div>
            <FieldLabel htmlFor="email">Email</FieldLabel>
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
            <FieldLabel htmlFor="password">Contraseña</FieldLabel>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange('password')}
              className={inputClass(errors.password)}
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>

          <div>
            <FieldLabel htmlFor="confirmPassword">Confirmar contraseña</FieldLabel>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              className={inputClass(errors.confirmPassword)}
              aria-invalid={Boolean(errors.confirmPassword)}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <div>
            <FieldLabel htmlFor="phone" optional>
              Teléfono
            </FieldLabel>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={handleChange('phone')}
              className={inputClass()}
            />
          </div>

          <div>
            <FieldLabel htmlFor="address" optional>
              Dirección
            </FieldLabel>
            <input
              id="address"
              type="text"
              autoComplete="street-address"
              value={form.address}
              onChange={handleChange('address')}
              className={inputClass()}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-lg bg-[#C2551D] py-2.5 text-sm font-semibold text-white transition hover:bg-[#A8461A] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Creando cuenta...' : 'Registrarme'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6B5C48]">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium text-[#C2551D] hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
