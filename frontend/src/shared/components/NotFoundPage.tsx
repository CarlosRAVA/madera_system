import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="font-heading text-5xl font-extrabold text-white">404</h1>
      <p className="text-beige/70">La página que buscas no existe.</p>
      <Link to="/" className="text-primary font-semibold hover:underline">
        Volver al inicio
      </Link>
    </div>
  );
}
