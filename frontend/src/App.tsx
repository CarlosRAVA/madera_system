import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ErrorBoundary } from '@/app/ErrorBoundary';
import { router } from '@/app/router';

export function App() {
  return (
    <ErrorBoundary>
      <Toaster theme="dark" position="top-center" richColors />
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
