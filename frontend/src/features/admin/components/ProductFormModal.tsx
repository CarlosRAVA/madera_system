import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/shared/components/Modal';
import { Button } from '@/shared/components/Button';
import type { Category, Product } from '@/shared/types';

const productSchema = z.object({
  categoryId: z.number().int().positive('Selecciona una categoría'),
  name: z.string().trim().min(2, 'Ingresa un nombre'),
  description: z.string().trim().optional(),
  price: z.number().positive('Ingresa un precio válido'),
  imageUrl: z
    .string()
    .trim()
    .url('Ingresa una URL válida')
    .optional()
    .or(z.literal('')),
  stock: z.number().int().min(0, 'El stock no puede ser negativo'),
  isActive: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ProductFormValues) => void;
  categories: Category[];
  product?: Product | null;
  loading: boolean;
}

export function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  categories,
  product,
  loading,
}: ProductFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    values: {
      categoryId: product?.categoryId ?? categories[0]?.id ?? 0,
      name: product?.name ?? '',
      description: product?.description ?? '',
      price: product ? Number(product.price) : 0,
      imageUrl: product?.imageUrl ?? '',
      stock: product?.stock ?? 0,
      isActive: product?.isActive ?? true,
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Editar producto' : 'Nuevo producto'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-beige/80 mb-1">
            Categoría
          </label>
          <select
            {...register('categoryId', { valueAsNumber: true })}
            className="w-full bg-dark-bg border border-dark-border rounded-btn px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-red-400 text-xs mt-1">
              {errors.categoryId.message}
            </p>
          )}
        </div>

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
            Descripción
          </label>
          <textarea
            {...register('description')}
            rows={2}
            className="w-full bg-dark-bg border border-dark-border rounded-btn px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-beige/80 mb-1">
              Precio
            </label>
            <input
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              className="w-full bg-dark-bg border border-dark-border rounded-btn px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.price && (
              <p className="text-red-400 text-xs mt-1">
                {errors.price.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-beige/80 mb-1">
              Stock
            </label>
            <input
              type="number"
              {...register('stock', { valueAsNumber: true })}
              className="w-full bg-dark-bg border border-dark-border rounded-btn px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.stock && (
              <p className="text-red-400 text-xs mt-1">
                {errors.stock.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-beige/80 mb-1">
            URL de imagen (opcional)
          </label>
          <input
            {...register('imageUrl')}
            className="w-full bg-dark-bg border border-dark-border rounded-btn px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.imageUrl && (
            <p className="text-red-400 text-xs mt-1">
              {errors.imageUrl.message}
            </p>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-beige/80">
          <input
            type="checkbox"
            {...register('isActive')}
            className="accent-primary"
          />
          Producto activo (visible en el menú)
        </label>

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar producto'}
        </Button>
      </form>
    </Modal>
  );
}
