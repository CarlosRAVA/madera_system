import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card } from '@/shared/components/Card';
import { Badge } from '@/shared/components/Badge';
import { PageLoader } from '@/shared/components/Spinner';
import { userService } from '@/features/users/services/userService';
import { formatDate } from '@/shared/utils';
import type { User } from '@/shared/types';
import type { NormalizedApiError } from '@/core/api/httpClient';

export function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  function loadAll() {
    setLoading(true);
    userService
      .listAll()
      .then(setUsers)
      .catch(() => toast.error('No se pudieron cargar los usuarios.'))
      .finally(() => setLoading(false));
  }

  useEffect(loadAll, []);

  async function toggleActive(user: User) {
    setUpdatingId(user.id);
    try {
      const updated = await userService.updateStatus(user.id, !user.isActive);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      toast.success(
        `${user.fullName} ahora está ${updated.isActive ? 'activo' : 'inactivo'}`,
      );
    } catch (err) {
      const apiError = err as NormalizedApiError;
      toast.error(apiError.message ?? 'No se pudo actualizar el usuario.');
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-white">Usuarios</h1>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-beige/60 border-b border-dark-border">
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Correo</th>
              <th className="px-4 py-3 font-medium">Rol</th>
              <th className="px-4 py-3 font-medium">Registrado</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-dark-border last:border-b-0"
              >
                <td className="px-4 py-3 text-white">{user.fullName}</td>
                <td className="px-4 py-3 text-beige/70">{user.email}</td>
                <td className="px-4 py-3">
                  <Badge
                    variant={user.role === 'ADMIN' ? 'primary' : 'neutral'}
                  >
                    {user.role}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-beige/70">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={user.isActive ? 'success' : 'danger'}>
                    {user.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <button
                      onClick={() => toggleActive(user)}
                      disabled={updatingId === user.id}
                      className="text-xs font-medium text-primary hover:underline disabled:opacity-50"
                    >
                      {user.isActive ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="text-center text-beige/60 text-sm py-8">
            Aún no hay usuarios.
          </p>
        )}
      </Card>
    </div>
  );
}
