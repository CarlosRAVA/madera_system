import { Suspense } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Tags,
  ClipboardList,
  Settings,
  Users,
  LogOut,
} from 'lucide-react';
import { cx } from '@/shared/utils';
import { useAuthStore } from '@/features/auth/store/authStore';
import { PageLoader } from '@/shared/components/Spinner';

const NAV_ITEMS = [
  { to: '/admin', end: true, label: 'Panel', icon: LayoutDashboard },
  { to: '/admin/productos', label: 'Productos', icon: Package },
  { to: '/admin/categorias', label: 'Categorías', icon: Tags },
  { to: '/admin/pedidos', label: 'Pedidos', icon: ClipboardList },
  { to: '/admin/usuarios', label: 'Usuarios', icon: Users },
  { to: '/admin/negocio', label: 'Negocio', icon: Settings },
];

export function AdminLayout() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  function handleLogout() {
    // Ver el comentario equivalente en shared/components/Navbar.tsx: usamos una
    // recarga completa para evitar la condición de carrera entre la transición
    // del router y el cambio de estado de autenticación.
    logout();
    window.location.assign('/');
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 shrink-0 bg-dark-card border-r border-dark-border flex flex-col">
        <Link
          to="/"
          className="px-5 h-16 flex items-center font-heading font-extrabold text-white"
        >
          Leños <span className="text-primary">Admin</span>
        </Link>

        <nav className="flex-1 px-3 flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, end, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cx(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-btn text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/15 text-primary'
                    : 'text-beige/70 hover:text-white hover:bg-dark-border',
                )
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-dark-border">
          <p className="text-xs text-beige/50 px-3 mb-2 truncate">
            {user?.email}
          </p>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-btn text-sm font-medium text-beige/70 hover:text-red-400 hover:bg-dark-border transition-colors"
          >
            <LogOut size={17} /> Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-x-hidden">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
