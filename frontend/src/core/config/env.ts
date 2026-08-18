// ─── Configuración de entorno ──────────────────────────────────────────────
// Lee y valida las variables de entorno inyectadas por Vite (prefijo VITE_).

interface EnvConfig {
  apiUrl: string;
}

function readApiUrl(): string {
  const raw = import.meta.env.VITE_API_URL as string | undefined;

  if (!raw || raw.trim() === '') {
    throw new Error(
      'VITE_API_URL no está definida. Configúrala en el archivo .env (ver .env.example).',
    );
  }

  // En producción forzamos HTTPS para no exponer credenciales/tokens en claro.
  if (import.meta.env.PROD && raw.startsWith('http://')) {
    throw new Error(
      `VITE_API_URL debe usar HTTPS en producción (valor actual: "${raw}").`,
    );
  }

  return raw.replace(/\/+$/, '');
}

export const env: EnvConfig = {
  apiUrl: readApiUrl(),
};
