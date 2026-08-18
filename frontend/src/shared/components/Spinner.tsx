import { cx } from '@/shared/utils';

interface SpinnerProps {
  size?: number;
  className?: string;
}

export function Spinner({ size = 40, className = '' }: SpinnerProps) {
  return (
    <div
      className={cx(
        'border-2 border-dark-border border-t-primary rounded-full animate-spin',
        className,
      )}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Cargando"
    />
  );
}

/** Spinner de página completa, usado como fallback de Suspense en las rutas. */
export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Spinner size={40} />
    </div>
  );
}
