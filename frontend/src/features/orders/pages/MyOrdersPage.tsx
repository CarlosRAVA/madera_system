import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PackageSearch } from 'lucide-react';
import { PageLoader } from '@/shared/components/Spinner';
import { Card } from '@/shared/components/Card';
import { OrderStatusBadge } from '@/features/orders/components/OrderStatusBadge';
import { orderService } from '@/features/orders/services/orderService';
import { formatCurrency, formatDate } from '@/shared/utils';
import type { Order } from '@/shared/types';

export function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    orderService
      .listMine()
      .then(setOrders)
      .catch(() => setError('No se pudieron cargar tus pedidos.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-3xl font-bold text-white">
        Mis pedidos
      </h1>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {!error && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <PackageSearch size={40} className="text-beige/30" />
          <p className="text-beige/70">Aún no tienes pedidos.</p>
          <Link
            to="/menu"
            className="text-primary font-semibold hover:underline"
          >
            Ir al menú
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <Link key={order.id} to={`/mis-pedidos/${order.id}`}>
            <Card hover className="p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-white">{order.orderNumber}</p>
                <p className="text-xs text-beige/60">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-heading font-bold text-primary">
                  {formatCurrency(order.total)}
                </span>
                <OrderStatusBadge status={order.status} />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
