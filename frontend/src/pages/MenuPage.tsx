import { useAuth } from '../context/AuthContext';

export default function MenuPage() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#1F1815] px-4 text-center">
      <h1 className="font-serif text-2xl font-bold text-[#F6EFE4]">
        ¡Bienvenido{user ? `, ${user.fullName}` : ''}!
      </h1>
      <p className="max-w-sm text-sm text-[#B8A990]">
        Este es un placeholder del menú principal. Aquí van las categorías y productos cuando se
        implemente esa issue.
      </p>
      {user && (
        <button
          onClick={logout}
          className="rounded-lg bg-[#3A2C1E] px-4 py-2 text-sm font-medium text-[#F6EFE4] hover:bg-[#4A3A28]"
        >
          Cerrar sesión
        </button>
      )}
    </div>
  );
}
