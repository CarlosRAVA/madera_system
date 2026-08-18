import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageLoader } from '@/shared/components/Spinner';
import { Card } from '@/shared/components/Card';
import { OrderStatusBadge } from '@/features/orders/components/OrderStatusBadge';
import { orderService } from '@/features/orders/services/orderService';
import { formatCurrency, formatDate } from '@/shared/utils';
import type { Order } from '@/shared/types';

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    orderService
      .getById(Number(id))
      .then(setOrder)
      .catch(() => setError('No se pudo cargar el pedido.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader />;

  if (error || !order) {
    return (
      <p className="text-red-400 text-sm">{error ?? 'Pedido no encontrado.'}</p>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <Link
        to="/mis-pedidos"
        className="flex items-center gap-1 text-sm text-beige/70 hover:text-white"
      >
        <ArrowLeft size={16} /> Volver a mis pedidos
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-white">
          {order.orderNumber}
        </h1>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="text-sm text-beige/60 -mt-4">
        {formatDate(order.createdAt)}
      </p>

      <Card className="p-5 flex flex-col gap-3">
        <h2 className="font-heading font-semibold text-white">Productos</h2>
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between text-sm text-beige/80"
          >
            <span>
              {item.quantity}x{' '}
              {item.product?.name ?? `Producto #${item.productId}`}
            </span>
            <span>{formatCurrency(item.subtotal)}</span>
          </div>
        ))}
        <div className="border-t border-dark-border pt-3 flex flex-col gap-1">
          <div className="flex justify-between text-sm text-beige/80">
            <span>Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-beige/80">
            <span>Envío</span>
            <span>{formatCurrency(order.deliveryFee)}</span>
          </div>
          <div className="flex justify-between font-heading font-bold text-white text-lg">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </Card>

      <Card className="p-5 flex flex-col gap-1 text-sm text-beige/80">
        <h2 className="font-heading font-semibold text-white mb-2">
          Datos de entrega
        </h2>
        <p>
          <span className="text-beige/50">Nombre: </span>
          {order.customerName}
        </p>
        <p>
          <span className="text-beige/50">Teléfono: </span>
          {order.customerPhone}
        </p>
        <p>
          <span className="text-beige/50">Dirección: </span>
          {order.deliveryAddress}
        </p>
        {order.observations && (
          <p>
            <span className="text-beige/50">Observaciones: </span>
            {order.observations}
          </p>
        )}
      </Card>
    </div>
  );
}
