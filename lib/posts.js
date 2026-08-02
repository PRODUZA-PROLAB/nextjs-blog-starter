/**
 * Lógica de leitura e parsing de posts em MDX.
 *
 * A pasta `content/posts/` é a fonte da verdade. Este módulo lê os arquivos
 * .mdx, faz parse do frontmatter YAML (título, data, categoria, tags,
 * descrição) e expõe funções puras de listagem, ordenação, filtro por
 * categoria e busca por slug — todas testáveis com `node --test`.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { slugFromFilename, slugify } from './slug.js';

/** Caminho absoluto para content/posts, derivado da localização deste arquivo. */
export const CONTENT_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'content',
  'posts'
);

function unquote(value) {
  const v = String(value ?? '').trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    return v.slice(1, -1);
  }
  return v;
}

function coerceValue(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value !== '' && !Number.isNaN(Number(value))) return Number(value);
  return value;
}

/**
 * Faz o parse do frontmatter YAML (formato simples) de um arquivo MDX.
 * Retorna `{ data, content }`, onde `data` é o objeto com os metadados e
 * `content` é o corpo do post sem a seção de metadados.
 *
 * Suporta valores escalares (`key: value`), strings com aspas e listas
 * (`key:` seguido de itens `- valor`).
 */
export function parseFrontmatter(raw) {
  const source = String(raw ?? '').replace(/^\uFEFF/, '');
  if (!source.startsWith('---')) {
    return { data: {}, content: source.trim() };
  }

  const endIndex = source.indexOf('\n---');
  if (endIndex === -1) {
    return { data: {}, content: source.trim() };
  }

  const frontmatterLines = source.slice(3, endIndex).split(/\r?\n/);
  let content = source.slice(endIndex + 4);
  if (content.startsWith('\n')) content = content.slice(1);

  const data = {};
  let currentKey = null;
  let collectingArray = false;

  for (const rawLine of frontmatterLines) {
    const line = rawLine.trim();
    if (!line) continue;

    const listItem = line.match(/^-\s+(.*)$/);
    if (collectingArray && listItem) {
      data[currentKey].push(unquote(listItem[1]));
      continue;
    }

    collectingArray = false;
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;

    currentKey = match[1];
    const value = match[2].trim();
    if (value === '') {
      data[currentKey] = [];
      collectingArray = true;
    } else {
      data[currentKey] = coerceValue(unquote(value));
    }
  }

  return { data, content: content.trim() };
}

/**
 * Converte o texto bruto de um post (frontmatter + corpo) em um objeto
 * normalizado com todos os campos usados pelas páginas, busca e RSS.
 */
export function parsePost(slug, raw) {
  const { data, content } = parseFrontmatter(raw);
  const title = String(data.title || slugify(slug));
  const description = String(data.description || '');
  const category = String(data.category || 'Geral');
  const tags = Array.isArray(data.tags) ? data.tags.map(String) : [];
  const date = String(data.date || '1970-01-01');
  const body = String(content).trim();

  const plainText = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#*`>_~\[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const excerpt =
    description ||
    (plainText.length > 160 ? `${plainText.slice(0, 160)}…` : plainText);

  return { slug, title, description, category, tags, date, body, excerpt };
}

/** Lê todos os posts da pasta content/posts e retorna os objetos normalizados. */
export function getAllPosts() {
  if (!existsSync(CONTENT_DIR)) return [];
  return readdirSync(CONTENT_DIR)
    .filter((file) => /\.mdx?$/i.test(file))
    .map((file) => {
      const slug = slugFromFilename(file);
      const raw = readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
      return parsePost(slug, raw);
    });
}

/** Ordena os posts por data (mais recente primeiro). Não muta a entrada. */
export function listPosts(posts) {
  return [...posts].sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

/** Retorna o post com o slug informado, ou `null` se não existir. */
export function getPostBySlug(posts, slug) {
  return posts.find((post) => post.slug === slug) ?? null;
}

/** Lista as categorias presentes nos posts com a contagem de cada uma. */
export function getCategories(posts) {
  const counts = new Map();
  for (const post of posts) {
    const category = post.category || 'Geral';
    counts.set(category, (counts.get(category) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** Filtra posts por categoria (nome exato). */
export function getPostsByCategory(posts, category) {
  return posts.filter((post) => (post.category || 'Geral') === category);
}

/** Filtra posts pela categoria já em formato de slug (robusto a acentos/caixa). */
export function getPostsByCategorySlug(posts, categorySlug) {
  const slug = slugify(categorySlug);
  return posts.filter((post) => slugify(post.category || 'Geral') === slug);
}
