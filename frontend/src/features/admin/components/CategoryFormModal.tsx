import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/shared/components/Modal';
import { Button } from '@/shared/components/Button';
import type { Category } from '@/shared/types';

const categorySchema = z.object({
  name: z.string().trim().min(2, 'Ingresa un nombre'),
  description: z.string().trim().optional(),
  isActive: z.boolean(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CategoryFormValues) => void;
  category?: Category | null;
  loading: boolean;
}

export function CategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  category,
  loading,
}: CategoryFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    values: {
      name: category?.name ?? '',
      description: category?.description ?? '',
      isActive: category?.isActive ?? true,
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? 'Editar categoría' : 'Nueva categoría'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-beige/80 mb-1">
            Nombre
          </label>
          <input
            {...register('name')}
            className="w-full bg-dark-bg border border-dark-border rounded-btn px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-beige/80 mb-1">
            Descripción (opcional)
          </label>
          <textarea
            {...register('description')}
            rows={2}
            className="w-full bg-dark-bg border border-dark-border rounded-btn px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-beige/80">
          <input
            type="checkbox"
            {...register('isActive')}
            className="accent-primary"
          />
          Categoría activa
        </label>

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar categoría'}
        </Button>
      </form>
    </Modal>
  );
}
