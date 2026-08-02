/**
 * Busca full-text simples e dependente de zero deps de runtime.
 * Usada tanto na página /search (client) quanto nos testes.
 */
import { normalizeText } from './slug.js';

const DEFAULT_FIELDS = ['title', 'description', 'category', 'tags', 'body'];

/**
 * Busca posts por uma query de texto.
 * - Case-insensitive e insensível a acentos.
 * - Pontua por campo (título vale mais) e por quantidade de tokens casados.
 * - Retorna os posts ordenados por relevância e depois por data desc.
 */
export function searchPosts(
  posts,
  query,
  { fields = DEFAULT_FIELDS, limit = Infinity } = {}
) {
  const normalizedQuery = normalizeText(query).trim();
  if (!normalizedQuery || !Array.isArray(posts)) return [];

  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);

  const scored = posts
    .map((post) => {
      const haystack = fields
        .flatMap((field) => {
          const value = post[field];
          return Array.isArray(value) ? value : [value];
        })
        .join(' ')
        .toLowerCase();

      const normalized = normalizeText(haystack);
      const title = normalizeText(post.title || '');

      let score = 0;
      for (const token of tokens) {
        if (normalized.includes(token)) score += 1;
        if (title.includes(token)) score += 2;
      }
      return { post, score };
    })
    .filter((entry) => entry.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || String(b.post.date).localeCompare(String(a.post.date))
    )
    .slice(0, limit)
    .map((entry) => entry.post);

  return scored;
}

/** Versão simples que só devolve true se houver pelo menos um resultado. */
export function hasMatches(posts, query) {
  return searchPosts(posts, query).length > 0;
}
