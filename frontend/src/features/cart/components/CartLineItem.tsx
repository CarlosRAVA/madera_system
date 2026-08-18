import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/shared/utils';
import { useCartStore } from '@/features/cart/store/cartStore';
import type { CartLine } from '@/features/cart/store/cartStore';

interface CartLineItemProps {
  line: CartLine;
}

export function CartLineItem({ line }: CartLineItemProps) {
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="flex items-center gap-4 py-4 border-b border-dark-border last:border-b-0">
      <div className="w-16 h-16 rounded-btn bg-dark-border overflow-hidden shrink-0">
        {line.imageUrl && (
          <img
            src={line.imageUrl}
            alt={line.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-white truncate">{line.name}</p>
        <p className="text-sm text-beige/60">
          {formatCurrency(line.unitPrice)} c/u
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setQuantity(line.productId, line.quantity - 1)}
          className="p-1 rounded-btn border border-dark-border text-beige/70 hover:text-white"
          aria-label="Disminuir cantidad"
        >
          <Minus size={14} />
        </button>
        <span className="w-6 text-center text-sm text-white">
          {line.quantity}
        </span>
        <button
          onClick={() => setQuantity(line.productId, line.quantity + 1)}
          disabled={line.quantity >= line.stock}
          className="p-1 rounded-btn border border-dark-border text-beige/70 hover:text-white disabled:opacity-40"
          aria-label="Aumentar cantidad"
        >
          <Plus size={14} />
        </button>
      </div>

      <span className="font-semibold text-white w-20 text-right">
        {formatCurrency(Number(line.unitPrice) * line.quantity)}
      </span>

      <button
        onClick={() => removeItem(line.productId)}
        className="p-1 text-beige/50 hover:text-red-400"
        aria-label="Eliminar del carrito"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
