import { useState } from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/shared/components/Card';
import { Badge } from '@/shared/components/Badge';
import { Button } from '@/shared/components/Button';
import { formatCurrency, truncate } from '@/shared/utils';
import { useCartStore } from '@/features/cart/store/cartStore';
import type { Product } from '@/shared/types';

interface ProductCardProps {
  product: Product;
  canOrder: boolean;
}

export function ProductCard({ product, canOrder }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const outOfStock = product.stock <= 0;
  const disabled = !canOrder || outOfStock;

  function handleAdd() {
    addItem(product, quantity);
    toast.success(`${product.name} agregado al carrito`);
    setQuantity(1);
  }

  return (
    <Card hover className="flex flex-col">
      <div className="aspect-video bg-dark-border overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-beige/30 text-sm">
            Sin imagen
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading font-semibold text-white">
            {product.name}
          </h3>
          {outOfStock && <Badge variant="danger">Agotado</Badge>}
        </div>

        {product.description && (
          <p className="text-sm text-beige/70 flex-1">
            {truncate(product.description, 90)}
          </p>
        )}

        <div className="flex items-center justify-between mt-2">
          <span className="font-heading font-bold text-primary text-lg">
            {formatCurrency(product.price)}
          </span>

          {!disabled && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-1 rounded-btn border border-dark-border text-beige/70 hover:text-white"
                aria-label="Disminuir cantidad"
              >
                <Minus size={14} />
              </button>
              <span className="w-5 text-center text-sm text-white">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity((q) => Math.min(product.stock, q + 1))
                }
                className="p-1 rounded-btn border border-dark-border text-beige/70 hover:text-white"
                aria-label="Aumentar cantidad"
              >
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>

        <Button
          onClick={handleAdd}
          disabled={disabled}
          size="sm"
          fullWidth
          className="mt-1"
        >
          <ShoppingCart size={16} />
          {outOfStock ? 'Agotado' : canOrder ? 'Agregar' : 'Cerrado'}
        </Button>
      </div>
    </Card>
  );
}
