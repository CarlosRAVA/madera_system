import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/components/Button';

const deliverySchema = z.object({
  customerName: z.string().trim().min(3, 'Ingresa tu nombre completo'),
  customerPhone: z
    .string()
    .trim()
    .min(10, 'Ingresa un teléfono a 10 dígitos')
    .regex(/^\d+$/, 'Solo números, sin espacios ni guiones'),
  deliveryAddress: z.string().trim().min(10, 'Ingresa una dirección completa'),
  observations: z.string().trim().optional(),
});

export type DeliveryFormValues = z.infer<typeof deliverySchema>;

interface DeliveryFormProps {
  defaultValues?: Partial<DeliveryFormValues>;
  onSubmit: (values: DeliveryFormValues) => void;
  loading: boolean;
  disabled?: boolean;
}

export function DeliveryForm({
  defaultValues,
  onSubmit,
  loading,
  disabled,
}: DeliveryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliverySchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-beige/80 mb-1">
          Nombre completo
        </label>
        <input
          {...register('customerName')}
          className="w-full bg-dark-bg border border-dark-border rounded-btn px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Ej. Juan Pérez"
        />
        {errors.customerName && (
          <p className="text-red-400 text-xs mt-1">
            {errors.customerName.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-beige/80 mb-1">
          Teléfono
        </label>
        <input
          {...register('customerPhone')}
          className="w-full bg-dark-bg border border-dark-border rounded-btn px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="10 dígitos"
        />
        {errors.customerPhone && (
          <p className="text-red-400 text-xs mt-1">
            {errors.customerPhone.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-beige/80 mb-1">
          Dirección de entrega
        </label>
        <textarea
          {...register('deliveryAddress')}
          rows={2}
          className="w-full bg-dark-bg border border-dark-border rounded-btn px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          placeholder="Calle, número, colonia, referencias"
        />
        {errors.deliveryAddress && (
          <p className="text-red-400 text-xs mt-1">
            {errors.deliveryAddress.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-beige/80 mb-1">
          Observaciones (opcional)
        </label>
        <textarea
          {...register('observations')}
          rows={2}
          className="w-full bg-dark-bg border border-dark-border rounded-btn px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          placeholder="Ej. sin cebolla, tocar el timbre"
        />
      </div>

      <Button type="submit" size="lg" fullWidth disabled={loading || disabled}>
        {loading ? 'Enviando pedido...' : 'Confirmar pedido por WhatsApp'}
      </Button>
    </form>
  );
}
