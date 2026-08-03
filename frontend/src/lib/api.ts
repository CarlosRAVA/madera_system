const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

interface ApiErrorBody {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const errorBody = body as ApiErrorBody | null;
    const rawMessage = errorBody?.message;
    const message = Array.isArray(rawMessage)
      ? rawMessage.join(', ')
      : (rawMessage ?? 'Ocurrió un error inesperado. Intenta de nuevo.');
    throw new Error(message);
  }

  return body as T;
}
