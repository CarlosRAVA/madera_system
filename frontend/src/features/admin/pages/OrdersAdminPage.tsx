import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/shared/components/Card';
import { PageLoader } from '@/shared/components/Spinner';
import { ConfirmModal } from '@/shared/components/ConfirmModal';
import {
  OrderStatusBadge,
  ORDER_STATUS_OPTIONS,
  orderStatusLabel,
} from '@/features/orders/components/OrderStatusBadge';
import { orderService } from '@/features/orders/services/orderService';
import { formatCurrency, formatDate } from '@/shared/utils';
import type { Order, OrderStatus } from '@/shared/types';
import type { NormalizedApiError } from '@/core/api/httpClient';

export function OrdersAdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<Order | null>(null);

  function loadAll() {
    setLoading(true);
    orderService
      .listAll()
      .then(setOrders)
      .catch(() => toast.error('No se pudieron cargar los pedidos.'))
      .finally(() => setLoading(false));
  }

  useEffect(loadAll, []);

  async function handleStatusChange(order: Order, status: OrderStatus) {
    setUpdatingId(order.id);
    try {
      const updated = await orderService.updateStatus(order.id, status);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      toast.success(
        `Pedido ${order.orderNumber} actualizado a "${orderStatusLabel(status)}"`,
      );
    } catch (err) {
      const apiError = err as NormalizedApiError;
      toast.error(apiError.message ?? 'No se pudo actualizar el estado.');
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await orderService.remove(deleting.id);
      toast.success('Pedido eliminado');
      setOrders((prev) => prev.filter((o) => o.id !== deleting.id));
      setDeleting(null);
    } catch (err) {
      const apiError = err as NormalizedApiError;
      toast.error(apiError.message ?? 'No se pudo eliminar el pedido.');
    }
  }

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-white">Pedidos</h1>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-beige/60 border-b border-dark-border">
              <th className="px-4 py-3 font-medium">Pedido</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-dark-border last:border-b-0"
              >
                <td className="px-4 py-3 text-white">{order.orderNumber}</td>
                <td className="px-4 py-3 text-beige/70">
                  <div>{order.customerName}</div>
                  <div className="text-xs text-beige/50">
                    {order.customerPhone}
                  </div>
                </td>
                <td className="px-4 py-3 text-beige/70">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-4 py-3 text-beige/70">
                  {formatCurrency(order.total)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <OrderStatusBadge status={order.status} />
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) =>
                        handleStatusChange(order, e.target.value as OrderStatus)
                      }
                      className="bg-dark-bg border border-dark-border rounded-btn px-2 py-1 text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {ORDER_STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {orderStatusLabel(status)}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <button
                      onClick={() => setDeleting(order)}
                      className="p-1.5 text-beige/60 hover:text-red-400 rounded-btn hover:bg-dark-border"
                      aria-label="Eliminar pedido"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="text-center text-beige/60 text-sm py-8">
            Aún no hay pedidos.
          </p>
        )}
      </Card>

      <ConfirmModal
        isOpen={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Eliminar pedido"
        message={`¿Seguro que quieres eliminar el pedido "${deleting?.orderNumber}"? Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
