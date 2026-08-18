import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Card } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { Badge } from '@/shared/components/Badge';
import { PageLoader } from '@/shared/components/Spinner';
import { businessConfigService } from '@/features/business-hours/services/businessConfigService';
import type { BusinessConfig } from '@/shared/types';
import type { NormalizedApiError } from '@/core/api/httpClient';

const configSchema = z.object({
  businessName: z.string().trim().min(2, 'Ingresa un nombre'),
  whatsappNumber: z
    .string()
    .trim()
    .min(10, 'Ingresa un número a 10 dígitos')
    .regex(/^\d+$/, 'Solo números'),
  address: z.string().trim().optional(),
  deliveryFee: z.number().min(0, 'No puede ser negativo'),
  isOpen: z.boolean(),
  openingTime: z.string().trim().optional().or(z.literal('')),
  closingTime: z.string().trim().optional().or(z.literal('')),
});

type ConfigFormValues = z.infer<typeof configSchema>;

export function BusinessConfigAdminPage() {
  const [config, setConfig] = useState<BusinessConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    businessConfigService
      .get()
      .then(setConfig)
      .catch(() =>
        toast.error('No se pudo cargar la configuración del negocio.'),
      )
      .finally(() => setLoading(false));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfigFormValues>({
    resolver: zodResolver(configSchema),
    values: config
      ? {
          businessName: config.businessName,
          whatsappNumber: config.whatsappNumber,
          address: config.address ?? '',
          deliveryFee: Number(config.deliveryFee),
          isOpen: config.isOpen,
          openingTime: config.openingTime ?? '',
          closingTime: config.closingTime ?? '',
        }
      : undefined,
  });

  async function onSubmit(values: ConfigFormValues) {
    setSaving(true);
    try {
      const updated = await businessConfigService.update({
        ...values,
        address: values.address || undefined,
        openingTime: values.openingTime || null,
        closingTime: values.closingTime || null,
      });
      setConfig(updated);
      toast.success('Configuración actualizada');
    } catch (err) {
      const apiError = err as NormalizedApiError;
      toast.error(apiError.message ?? 'No se pudo guardar la configuración.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div className="flex items-center gap-3">
        <h1 className="font-heading text-2xl font-bold text-white">
          Configuración del negocio
        </h1>
        {config && (
          <Badge variant={config.isOpenNow ? 'success' : 'danger'}>
            {config.isOpenNow ? 'Abierto ahora' : 'Cerrado'}
          </Badge>
        )}
      </div>

      <Card className="p-5">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-beige/80 mb-1">
              Nombre del negocio
            </label>
            <input
              {...register('businessName')}
              className="w-full bg-dark-bg border border-dark-border rounded-btn px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.businessName && (
              <p className="text-red-400 text-xs mt-1">
                {errors.businessName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-beige/80 mb-1">
              WhatsApp (con lada, sin espacios)
            </label>
            <input
              {...register('whatsappNumber')}
              className="w-full bg-dark-bg border border-dark-border rounded-btn px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.whatsappNumber && (
              <p className="text-red-400 text-xs mt-1">
                {errors.whatsappNumber.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-beige/80 mb-1">
              Dirección (opcional)
            </label>
            <input
              {...register('address')}
              className="w-full bg-dark-bg border border-dark-border rounded-btn px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-beige/80 mb-1">
              Costo de envío
            </label>
            <input
              type="number"
              step="0.01"
              {...register('deliveryFee', { valueAsNumber: true })}
              className="w-full bg-dark-bg border border-dark-border rounded-btn px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.deliveryFee && (
              <p className="text-red-400 text-xs mt-1">
                {errors.deliveryFee.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-beige/80 mb-1">
                Hora de apertura
              </label>
              <input
                type="time"
                {...register('openingTime')}
                className="w-full bg-dark-bg border border-dark-border rounded-btn px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-beige/80 mb-1">
                Hora de cierre
              </label>
              <input
                type="time"
                {...register('closingTime')}
                className="w-full bg-dark-bg border border-dark-border rounded-btn px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <p className="text-xs text-beige/50 -mt-2">
            Deja ambas horas vacías para controlar el estado abierto/cerrado
            solo manualmente.
          </p>

          <label className="flex items-center gap-2 text-sm text-beige/80">
            <input
              type="checkbox"
              {...register('isOpen')}
              className="accent-primary"
            />
            Negocio habilitado (interruptor manual — desactívalo para vacaciones
            o cierres imprevistos)
          </label>

          <Button type="submit" fullWidth disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
