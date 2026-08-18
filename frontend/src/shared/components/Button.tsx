import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '@/shared/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-primary hover:bg-secondary text-white shadow-lg shadow-primary/30 hover:shadow-secondary/40',
  secondary: 'bg-wood hover:bg-wood/80 text-beige',
  ghost:
    'bg-transparent hover:bg-dark-card text-beige border border-dark-border',
  outline:
    'bg-transparent border border-primary text-primary hover:bg-primary hover:text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cx(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-btn',
        'transition-all duration-200 cursor-pointer select-none',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? 'w-full' : '',
        className,
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
