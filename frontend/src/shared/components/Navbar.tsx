import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  Menu as MenuIcon,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useCartStore } from '@/features/cart/store/cartStore';
import { BusinessStatusBadge } from '@/features/business-hours/components/BusinessStatusBadge';
import { cx } from '@/shared/utils';

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/menu', label: 'Menú' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const itemCount = useCartStore((state) => state.totalItems());

  function handleLogout() {
    // Cerrar sesión con una navegación SPA (navigate()) compite con la propia
    // transición del router: si estamos en una ruta protegida (ej. /mis-pedidos),
    // ProtectedRoute puede reaccionar al cambio de isAuthenticated antes de que
    // "navigate('/')" se resuelva y termina redirigiendo a /login. Usamos una
    // recarga completa a "/" para evitar esa condición de carrera por completo:
    // no hay SPA transition con la que competir.
    setMobileOpen(false);
    logout();
    window.location.assign('/');
  }

  return (
    <header className="sticky top-0 z-40 bg-dark-bg/95 backdrop-blur border-b border-dark-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="font-heading font-extrabold text-lg text-white shrink-0"
        >
          Leños <span className="text-primary">Rellenos</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 flex-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-beige/80 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <BusinessStatusBadge />

          <Link
            to="/cart"
            className="relative p-2 text-beige/80 hover:text-white transition-colors"
            aria-label="Carrito"
          >
            <ShoppingCart size={22} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 text-sm font-medium text-beige/80 hover:text-white transition-colors"
                >
                  <LayoutDashboard size={16} /> Admin
                </Link>
              )}
              <Link
                to="/mis-pedidos"
                className="flex items-center gap-1.5 text-sm font-medium text-beige/80 hover:text-white transition-colors"
              >
                <User size={16} /> Mis pedidos
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-medium text-beige/60 hover:text-red-400 transition-colors"
              >
                <LogOut size={16} /> Salir
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-btn text-sm font-semibold text-white bg-primary hover:bg-secondary transition-colors"
            >
              Iniciar sesión
            </Link>
          )}
        </div>

        <button
          className="md:hidden p-2 text-beige"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label="Abrir menú"
        >
          {mobileOpen ? <X size={22} /> : <MenuIcon size={22} />}
        </button>
      </div>

      <div
        className={cx(
          'md:hidden overflow-hidden transition-[max-height] duration-300 border-t border-dark-border',
          mobileOpen ? 'max-h-96' : 'max-h-0',
        )}
      >
        <div className="px-4 py-4 flex flex-col gap-4">
          <BusinessStatusBadge />
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-beige/80"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/cart"
            className="text-beige/80"
            onClick={() => setMobileOpen(false)}
          >
            Carrito {itemCount > 0 && `(${itemCount})`}
          </Link>
          {isAuthenticated ? (
            <>
              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="text-beige/80"
                  onClick={() => setMobileOpen(false)}
                >
                  Admin
                </Link>
              )}
              <Link
                to="/mis-pedidos"
                className="text-beige/80"
                onClick={() => setMobileOpen(false)}
              >
                Mis pedidos
              </Link>
              <button onClick={handleLogout} className="text-left text-red-400">
                Salir
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-primary font-semibold"
              onClick={() => setMobileOpen(false)}
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
