import { Clock } from 'lucide-react';
import { useBusinessStatus } from '@/features/business-hours/hooks/useBusinessStatus';

/** Banner de aviso mostrado cuando el negocio está cerrado (bloquea intención de compra). */
export function ClosedBanner() {
  const { config, loading } = useBusinessStatus();

  if (loading || !config || config.isOpenNow) return null;

  const hasSchedule = config.openingTime && config.closingTime;

  return (
    <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-btn px-4 py-3 flex items-start gap-3 text-sm">
      <Clock size={18} className="shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold">Estamos cerrados en este momento.</p>
        {hasSchedule && (
          <p className="text-red-300/80">
            Nuestro horario es de {config.openingTime} a {config.closingTime}{' '}
            hrs.
          </p>
        )}
        <p className="text-red-300/80">
          Puedes ver el menú, pero no se podrán realizar pedidos.
        </p>
      </div>
    </div>
  );
}
