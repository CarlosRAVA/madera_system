/**
 * Formatea un valor monetario (que puede venir como string, ver nota en
 * shared/types sobre los campos Decimal del backend) como moneda MXN.
 */
export function formatCurrency(value: string | number): string {
  const amount = typeof value === 'string' ? Number(value) : value;
  if (Number.isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
}

/** Trunca un texto a `maxLength` caracteres, agregando "…" si se recorta. */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

/** Formatea una fecha ISO a un formato legible corto en español. */
export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDate));
}

/** Une clases condicionalmente, ignorando valores falsy. */
export function cx(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(' ');
}
