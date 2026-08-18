import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { orderService } from '@/features/orders/services/orderService';
import { useCartStore } from '@/features/cart/store/cartStore';
import type { DeliveryFormValues } from '@/features/cart/components/DeliveryForm';
import type { NormalizedApiError } from '@/core/api/httpClient';

export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const lines = useCartStore((state) => state.lines);
  const clearCart = useCartStore((state) => state.clear);
  const navigate = useNavigate();

  async function submitOrder(values: DeliveryFormValues) {
    if (lines.length === 0) {
      toast.error('Tu carrito está vacío.');
      return;
    }

    setLoading(true);
    try {
      const response = await orderService.create({
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        deliveryAddress: values.deliveryAddress,
        observations: values.observations,
        items: lines.map((line) => ({
          productId: line.productId,
          quantity: line.quantity,
        })),
      });

      clearCart();
      toast.success(`Pedido ${response.order.orderNumber} recibido`);

      // Abrimos WhatsApp con el mensaje pre-armado por el backend (RF de confirmación).
      window.open(response.whatsappUrl, '_blank', 'noopener,noreferrer');
      navigate(`/mis-pedidos/${response.order.id}`);
    } catch (err) {
      const apiError = err as NormalizedApiError;
      toast.error(apiError.message ?? 'No se pudo enviar el pedido.');
    } finally {
      setLoading(false);
    }
  }

  return { submitOrder, loading };
}
