import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/shared/components/Card';
import { Badge } from '@/shared/components/Badge';
import { Button } from '@/shared/components/Button';
import { PageLoader } from '@/shared/components/Spinner';
import { ConfirmModal } from '@/shared/components/ConfirmModal';
import { ProductFormModal } from '@/features/admin/components/ProductFormModal';
import type { ProductFormValues } from '@/features/admin/components/ProductFormModal';
import { productService } from '@/features/products/services/productService';
import { categoryService } from '@/features/categories/services/categoryService';
import { formatCurrency } from '@/shared/utils';
import type { Category, Product } from '@/shared/types';
import type { NormalizedApiError } from '@/core/api/httpClient';

export function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<Product | null>(null);

  function loadAll() {
    setLoading(true);
    Promise.all([productService.listAllAdmin(), categoryService.list()])
      .then(([productsData, categoriesData]) => {
        setProducts(productsData);
        setCategories(categoriesData);
      })
      .catch(() => toast.error('No se pudieron cargar los productos.'))
      .finally(() => setLoading(false));
  }

  useEffect(loadAll, []);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setFormOpen(true);
  }

  async function handleSubmit(values: ProductFormValues) {
    setSaving(true);
    try {
      const { isActive, ...rest } = values;
      const payload = { ...rest, imageUrl: values.imageUrl || undefined };
      if (editing) {
        // El backend solo acepta "isActive" al actualizar (crear siempre inicia activo).
        await productService.update(editing.id, { ...payload, isActive });
        toast.success('Producto actualizado');
      } else {
        await productService.create(payload);
        toast.success('Producto creado');
      }
      setFormOpen(false);
      loadAll();
    } catch (err) {
      const apiError = err as NormalizedApiError;
      toast.error(apiError.message ?? 'No se pudo guardar el producto.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setSaving(true);
    try {
      await productService.remove(deleting.id);
      toast.success('Producto eliminado');
      setDeleting(null);
      loadAll();
    } catch (err) {
      const apiError = err as NormalizedApiError;
      toast.error(apiError.message ?? 'No se pudo eliminar el producto.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-white">
          Productos
        </h1>
        <Button onClick={openCreate} size="sm">
          <Plus size={16} /> Nuevo producto
        </Button>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-beige/60 border-b border-dark-border">
              <th className="px-4 py-3 font-medium">Producto</th>
              <th className="px-4 py-3 font-medium">Categoría</th>
              <th className="px-4 py-3 font-medium">Precio</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-dark-border last:border-b-0"
              >
                <td className="px-4 py-3 text-white">{product.name}</td>
                <td className="px-4 py-3 text-beige/70">
                  {product.category?.name ?? '—'}
                </td>
                <td className="px-4 py-3 text-beige/70">
                  {formatCurrency(product.price)}
                </td>
                <td className="px-4 py-3 text-beige/70">{product.stock}</td>
                <td className="px-4 py-3">
                  <Badge variant={product.isActive ? 'success' : 'neutral'}>
                    {product.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEdit(product)}
                      className="p-1.5 text-beige/60 hover:text-white rounded-btn hover:bg-dark-border"
                      aria-label="Editar"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setDeleting(product)}
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
        {products.length === 0 && (
          <p className="text-center text-beige/60 text-sm py-8">
            Aún no hay productos.
          </p>
        )}
      </Card>

      <ProductFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        categories={categories}
        product={editing}
        loading={saving}
      />

      <ConfirmModal
        isOpen={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Eliminar producto"
        message={`¿Seguro que quieres eliminar "${deleting?.name}"? Esta acción no se puede deshacer.`}
        loading={saving}
      />
    </div>
  );
}
