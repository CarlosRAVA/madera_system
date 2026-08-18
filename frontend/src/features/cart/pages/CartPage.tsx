import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Card } from '@/shared/components/Card';
import { CartLineItem } from '@/features/cart/components/CartLineItem';
import { DeliveryForm } from '@/features/cart/components/DeliveryForm';
import { ClosedBanner } from '@/features/business-hours/components/ClosedBanner';
import { useBusinessStatus } from '@/features/business-hours/hooks/useBusinessStatus';
import { useCartStore } from '@/features/cart/store/cartStore';
import { useCheckout } from '@/features/cart/hooks/useCheckout';
import { useAuthStore } from '@/features/auth/store/authStore';
import { formatCurrency } from '@/shared/utils';

export function CartPage() {
  const lines = useCartStore((state) => state.lines);
  const subtotal = useCartStore((state) => state.subtotal());
  const { config } = useBusinessStatus();
  const { submitOrder, loading } = useCheckout();
  const user = useAuthStore((state) => state.user);

  const deliveryFee = config ? Number(config.deliveryFee) : 0;
  const total = subtotal + (lines.length > 0 ? deliveryFee : 0);
  const canCheckout = Boolean(config?.isOpenNow) && lines.length > 0;

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <ShoppingBag size={48} className="text-beige/30" />
        <h1 className="font-heading text-2xl font-bold text-white">
          Tu carrito está vacío
        </h1>
        <p className="text-beige/70">Agrega algo delicioso desde el menú.</p>
        <Link to="/menu" className="text-primary font-semibold hover:underline">
          Ir al menú
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-3xl font-bold text-white">Tu carrito</h1>

      <ClosedBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-4">
          {lines.map((line) => (
            <CartLineItem key={line.productId} line={line} />
          ))}
        </Card>

        <div className="flex flex-col gap-5">
          <Card className="p-5 flex flex-col gap-2">
            <div className="flex justify-between text-sm text-beige/80">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-beige/80">
              <span>Envío</span>
              <span>{formatCurrency(deliveryFee)}</span>
            </div>
            <div className="flex justify-between font-heading font-bold text-white text-lg border-t border-dark-border pt-2 mt-1">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-heading font-semibold text-white mb-4">
              Datos de entrega
            </h2>
            <DeliveryForm
              defaultValues={{ customerName: user?.fullName ?? '' }}
              onSubmit={submitOrder}
              loading={loading}
              disabled={!canCheckout}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
