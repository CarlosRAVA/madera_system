import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/shared/components/Card';
import { Badge } from '@/shared/components/Badge';
import { Button } from '@/shared/components/Button';
import { PageLoader } from '@/shared/components/Spinner';
import { ConfirmModal } from '@/shared/components/ConfirmModal';
import { CategoryFormModal } from '@/features/admin/components/CategoryFormModal';
import type { CategoryFormValues } from '@/features/admin/components/CategoryFormModal';
import { categoryService } from '@/features/categories/services/categoryService';
import type { Category } from '@/shared/types';
import type { NormalizedApiError } from '@/core/api/httpClient';

export function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<Category | null>(null);

  function loadAll() {
    setLoading(true);
    categoryService
      .list()
      .then(setCategories)
      .catch(() => toast.error('No se pudieron cargar las categorías.'))
      .finally(() => setLoading(false));
  }

  useEffect(loadAll, []);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
    setFormOpen(true);
  }

  async function handleSubmit(values: CategoryFormValues) {
    setSaving(true);
    try {
      if (editing) {
        await categoryService.update(editing.id, values);
        toast.success('Categoría actualizada');
      } else {
        await categoryService.create(values);
        toast.success('Categoría creada');
      }
      setFormOpen(false);
      loadAll();
    } catch (err) {
      const apiError = err as NormalizedApiError;
      toast.error(apiError.message ?? 'No se pudo guardar la categoría.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setSaving(true);
    try {
      await categoryService.remove(deleting.id);
      toast.success('Categoría eliminada');
      setDeleting(null);
      loadAll();
    } catch (err) {
      const apiError = err as NormalizedApiError;
      toast.error(apiError.message ?? 'No se pudo eliminar la categoría.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-white">
          Categorías
        </h1>
        <Button onClick={openCreate} size="sm">
          <Plus size={16} /> Nueva categoría
        </Button>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-beige/60 border-b border-dark-border">
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Productos</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr
                key={category.id}
                className="border-b border-dark-border last:border-b-0"
              >
                <td className="px-4 py-3 text-white">{category.name}</td>
                <td className="px-4 py-3 text-beige/70">
                  {category._count?.products ?? 0}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={category.isActive ? 'success' : 'neutral'}>
                    {category.isActive ? 'Activa' : 'Inactiva'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEdit(category)}
                      className="p-1.5 text-beige/60 hover:text-white rounded-btn hover:bg-dark-border"
                      aria-label="Editar"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setDeleting(category)}
                      className="p-1.5 text-beige/60 hover:text-red-400 rounded-btn hover:bg-dark-border"
                      aria-label="Eliminar"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <p className="text-center text-beige/60 text-sm py-8">
            Aún no hay categorías.
          </p>
        )}
      </Card>

      <CategoryFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        category={editing}
        loading={saving}
      />

      <ConfirmModal
        isOpen={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Eliminar categoría"
        message={`¿Seguro que quieres eliminar "${deleting?.name}"? Esta acción no se puede deshacer.`}
        loading={saving}
      />
    </div>
  );
}
