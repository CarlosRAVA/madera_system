import { useEffect, useMemo, useState } from 'react';
import { PageLoader } from '@/shared/components/Spinner';
import { CategoryTabs } from '@/features/menu/components/CategoryTabs';
import { ProductCard } from '@/features/menu/components/ProductCard';
import { ClosedBanner } from '@/features/business-hours/components/ClosedBanner';
import { useBusinessStatus } from '@/features/business-hours/hooks/useBusinessStatus';
import { productService } from '@/features/products/services/productService';
import { categoryService } from '@/features/categories/services/categoryService';
import type { Category, Product } from '@/shared/types';

export function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { config } = useBusinessStatus();

  useEffect(() => {
    categoryService
      .list()
      .then((data) =>
        setCategories(data.filter((category) => category.isActive)),
      )
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    productService
      .list(activeCategory ?? undefined)
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch(() => {
        if (!cancelled)
          setError('No se pudo cargar el menú. Intenta de nuevo.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeCategory]);

  const canOrder = useMemo(() => Boolean(config?.isOpenNow), [config]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white mb-1">
          Nuestro menú
        </h1>
        <p className="text-beige/70">
          Antojitos hechos a leña, directo a tu mesa.
        </p>
      </div>

      <ClosedBanner />

      <CategoryTabs
        categories={categories}
        activeId={activeCategory}
        onChange={setActiveCategory}
      />

      {loading && <PageLoader />}

      {!loading && error && <p className="text-red-400 text-sm">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="text-beige/60 text-sm py-8 text-center">
          No hay productos disponibles en esta categoría.
        </p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              canOrder={canOrder}
            />
          ))}
        </div>
      )}
    </div>
  );
}
