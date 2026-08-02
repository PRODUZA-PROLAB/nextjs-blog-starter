/**
 * Utilitários de texto e slug.
 * Módulo JS puro (sem dependências de runtime) para ser usado tanto pelo
 * Next.js quanto pelos testes em `node --test`.
 */

/** Remove acentos e normaliza para minúsculas, preservando o conteúdo pesquisável. */
export function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/**
 * Converte qualquer texto em um slug URL-friendly.
 * Ex.: "Olá Mundo!" -> "ola-mundo"
 */
export function slugify(value) {
  return normalizeText(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

/**
 * Extrai o slug de um nome de arquivo de post.
 * Ex.: "ola-mundo.mdx" -> "ola-mundo"
 */
export function slugFromFilename(filename) {
  const base = String(filename ?? '').split('/').pop() ?? '';
  return base.replace(/\.mdx?$/i, '');
}
