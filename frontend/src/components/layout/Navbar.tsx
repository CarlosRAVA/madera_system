import { Link, useNavigate } from 'react-router-dom';
import { LogIn, LogOut, UserCircle, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../api/auth.service';
import './Navbar.css';

/**
 * Navbar principal.
 * - Si NO hay sesión: muestra botones "Login" y "Registro"
 * - Si HAY sesión: muestra "Mi cuenta" y "Logout"
 */
export function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <Link to="/" className="navbar__logo">
          🪵 Leños Rellenos
        </Link>
      </div>

      <nav className="navbar__nav">
        <Link to="/menu" className="navbar__link">
          Menú
        </Link>

        {isAuthenticated ? (
          /* ── Autenticado: Mi cuenta + Logout ── */
          <div className="navbar__auth">
            <Link to="/cuenta" className="navbar__link navbar__link--account">
              <UserCircle size={18} />
              <span>{user?.name ?? 'Mi cuenta'}</span>
            </Link>

            <Link to="/carrito" className="navbar__link">
              <ShoppingCart size={18} />
            </Link>

            <button
              id="btn-logout"
              type="button"
              className="navbar__btn navbar__btn--logout"
              onClick={() => void handleLogout()}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        ) : (
          /* ── No autenticado: Login + Registro ── */
          <div className="navbar__auth">
            <Link id="btn-login" to="/login" className="navbar__btn navbar__btn--ghost">
              <LogIn size={16} />
              Login
            </Link>

            <Link id="btn-registro" to="/registro" className="navbar__btn navbar__btn--primary">
              Registro
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
