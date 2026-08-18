import { useEffect, useState, useCallback } from 'react';
import { businessConfigService } from '@/features/business-hours/services/businessConfigService';
import type { BusinessConfig } from '@/shared/types';

const REFRESH_INTERVAL_MS = 60_000;

interface UseBusinessStatusResult {
  config: BusinessConfig | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Expone el estado de horario del negocio (RF6), refrescándolo periódicamente
 * para que "abierto/cerrado" se mantenga correcto sin recargar la página.
 */
export function useBusinessStatus(): UseBusinessStatusResult {
  const [config, setConfig] = useState<BusinessConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    businessConfigService
      .get()
      .then((data) => {
        if (!cancelled) {
          setConfig(data);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) setError('No se pudo obtener el horario del negocio.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tick]);

  useEffect(() => {
    const id = setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  return { config, loading, error, refresh };
}
