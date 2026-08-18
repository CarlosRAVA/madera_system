import type { ReactNode } from 'react';
import { cx } from '@/shared/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={cx(
        'bg-dark-card border border-dark-border rounded-card overflow-hidden',
        hover &&
          'transition-transform duration-300 hover:-translate-y-1 hover:shadow-glow-card hover:border-wood',
        className,
      )}
    >
      {children}
    </div>
  );
}
