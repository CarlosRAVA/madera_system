import { Badge } from '@/shared/components/Badge';
import type { OrderStatus } from '@/shared/types';

const STATUS_LABEL: Record<OrderStatus, string> = {
  RECEIVED: 'Recibido',
  COOKING: 'En cocina',
  ON_THE_WAY: 'En camino',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
};

const STATUS_VARIANT: Record<
  OrderStatus,
  'primary' | 'success' | 'warning' | 'danger' | 'neutral'
> = {
  RECEIVED: 'neutral',
  COOKING: 'warning',
  ON_THE_WAY: 'primary',
  DELIVERED: 'success',
  CANCELLED: 'danger',
};

export const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  'RECEIVED',
  'COOKING',
  'ON_THE_WAY',
  'DELIVERED',
  'CANCELLED',
];

export function orderStatusLabel(status: OrderStatus): string {
  return STATUS_LABEL[status];
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>;
}
