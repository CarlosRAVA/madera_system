import { Badge } from '@/shared/components/Badge';
import { useBusinessStatus } from '@/features/business-hours/hooks/useBusinessStatus';

/** Insignia compacta "Abierto ahora" / "Cerrado", usada en el Navbar. */
export function BusinessStatusBadge() {
  const { config, loading } = useBusinessStatus();

  if (loading || !config) return null;

  return (
    <Badge variant={config.isOpenNow ? 'success' : 'danger'}>
      {config.isOpenNow ? 'Abierto ahora' : 'Cerrado'}
    </Badge>
  );
}
