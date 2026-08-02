/**
 * Formatação de datas em pt-BR.
 */

/** Formata uma data ISO (ou string) em texto legível: "22 de abril de 2026". */
export function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value ?? '');
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Formata uma data curta: "2026-04-22". */
export function formatDateShort(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value ?? '');
  return date.toISOString().slice(0, 10);
}
