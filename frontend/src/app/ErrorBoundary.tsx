import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Button } from '@/shared/components/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/** Boundary genérico para evitar que un error de render tumbe toda la app. */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary capturó un error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
          <h1 className="font-heading text-2xl font-bold text-white">
            Algo salió mal
          </h1>
          <p className="text-beige/70 max-w-md">
            Ocurrió un error inesperado. Intenta recargar la página; si el
            problema continúa, contáctanos.
          </p>
          <Button onClick={() => window.location.assign('/')}>
            Volver al inicio
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
