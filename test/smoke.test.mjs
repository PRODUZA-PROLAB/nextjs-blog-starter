import { test } from 'node:test';
import assert from 'node:assert/strict';

import { normalizeText, slugify, slugFromFilename } from '../lib/slug.js';
import {
  parseFrontmatter,
  parsePost,
  getAllPosts,
  listPosts,
  getPostBySlug,
  getCategories,
  getPostsByCategory,
  getPostsByCategorySlug,
} from '../lib/posts.js';
import { searchPosts, hasMatches } from '../lib/search.js';
import {
  THEME_STORAGE_KEY,
  THEMES,
  normalizeTheme,
  resolveTheme,
  toggleTheme,
  themeLabel,
  getInitialThemeScript,
} from '../lib/theme.js';
import { escapeXml, buildRssXml } from '../lib/rss.js';
import { formatDate } from '../lib/date.js';

// ---------------------------------------------------------------------------
// Amostras usadas nos testes de busca/ordenação
// ---------------------------------------------------------------------------

const samplePosts = [
  {
    slug: 'guia-react',
    title: 'Guia de React',
    description: 'Aprenda React do zero',
    category: 'Guia',
    tags: ['react', 'jsx'],
    date: '2026-01-01',
    body: 'Componentes, hooks e estado.',
    excerpt: 'Aprenda React do zero',
  },
  {
    slug: 'como-usar-mdx',
    title: 'Como usar MDX',
    description: 'Conteúdo em markdown',
    category: 'Tutoriais',
    tags: ['mdx'],
    date: '2026-02-01',
    body: 'Escreva posts com JSX.',
    excerpt: 'Conteúdo em markdown',
  },
  {
    slug: 'next-no-servidor',
    title: 'Next.js no servidor',
    description: 'Server Components',
    category: 'Guia',
    tags: ['nextjs'],
    date: '2026-03-01',
    body: 'Renderização no servidor.',
    excerpt: 'Server Components',
  },
];

// ---------------------------------------------------------------------------
// Slug e normalização de texto
// ---------------------------------------------------------------------------

test('slugify remove acentos e converte para minúsculas', () => {
  assert.equal(slugify('Olá Mundo!'), 'ola-mundo');
  assert.equal(slugify('AÇÃO & EFEITO'), 'acao-efeito');
});

test('slugify colapsa espaços e caracteres especiais em um único hífen', () => {
  assert.equal(slugify('Next.js 15  App Router'), 'next-js-15-app-router');
  assert.equal(slugify('---duplo----hífen---'), 'duplo-hifen');
});

test('slugFromFilename extrai o slug do nome do arquivo', () => {
  assert.equal(slugFromFilename('ola-mundo.mdx'), 'ola-mundo');
  assert.equal(slugFromFilename('posts/bem-vindo.md'), 'bem-vindo');
  assert.equal(slugFromFilename('sem-extensao'), 'sem-extensao');
});

test('normalizeText remove acentos e minúsculas', () => {
  assert.equal(normalizeText('Café'), 'cafe');
  assert.equal(normalizeText('AÇÃO'), 'acao');
});

// ---------------------------------------------------------------------------
// Parsing de posts / frontmatter
// ---------------------------------------------------------------------------

const RAW_SAMPLE = `---
title: "Meu Post"
date: "2026-04-22"
category: "Tutoriais"
description: "Uma descrição"
tags:
  - nextjs
  - mdx
---

# Conteúdo

Texto do corpo do post.`;

test('parseFrontmatter extrai os campos escalares do frontmatter', () => {
  const { data } = parseFrontmatter(RAW_SAMPLE);
  assert.equal(data.title, 'Meu Post');
  assert.equal(data.date, '2026-04-22');
  assert.equal(data.category, 'Tutoriais');
  assert.equal(data.description, 'Uma descrição');
});

test('parseFrontmatter extrai listas (tags) e separa o corpo', () => {
  const { data, content } = parseFrontmatter(RAW_SAMPLE);
  assert.deepEqual(data.tags, ['nextjs', 'mdx']);
  assert.match(content, /^# Conteúdo/);
  assert.match(content, /Texto do corpo do post\.$/);
});

test('parseFrontmatter devolve corpo inteiro quando não há frontmatter', () => {
  const { data, content } = parseFrontmatter('Apenas texto.\n\nSem metadados.');
  assert.deepEqual(data, {});
  assert.equal(content, 'Apenas texto.\n\nSem metadados.');
});

test('parsePost aplica valores padrão e deriva excerpt', () => {
  const post = parsePost('sem-descricao', '---\ntitle: "Só título"\n---\n\nConteúdo qualquer aqui.');
  assert.equal(post.category, 'Geral');
  assert.equal(post.description, '');
  assert.ok(post.excerpt.length > 0);
  assert.equal(post.tags.length, 0);
});

// ---------------------------------------------------------------------------
// Listagem, ordenação e categorias
// ---------------------------------------------------------------------------

test('listPosts ordena por data, mais recente primeiro', () => {
  const sorted = listPosts(samplePosts);
  assert.deepEqual(
    sorted.map((p) => p.slug),
    ['next-no-servidor', 'como-usar-mdx', 'guia-react']
  );
});

test('getPostBySlug encontra pelo slug e retorna null para desconhecido', () => {
  assert.equal(getPostBySlug(samplePosts, 'como-usar-mdx').title, 'Como usar MDX');
  assert.equal(getPostBySlug(samplePosts, 'nao-existe'), null);
});

test('getCategories retorna categorias com contagem', () => {
  const categories = getCategories(samplePosts);
  const guia = categories.find((c) => c.name === 'Guia');
  assert.equal(guia.count, 2);
  assert.equal(categories.find((c) => c.name === 'Tutoriais').count, 1);
});

test('getPostsByCategory e getPostsByCategorySlug filtram por categoria', () => {
  assert.equal(getPostsByCategory(samplePosts, 'Guia').length, 2);
  assert.equal(getPostsByCategorySlug(samplePosts, 'tutoriais').length, 1);
  assert.equal(getPostsByCategorySlug(samplePosts, 'Tutoriais').length, 1);
});

// ---------------------------------------------------------------------------
// Busca
// ---------------------------------------------------------------------------

test('searchPosts encontra por título, ignorando caixa', () => {
  const results = searchPosts(samplePosts, 'MDX');
  assert.equal(results.length, 1);
  assert.equal(results[0].slug, 'como-usar-mdx');
});

test('searchPosts é insensível a acentos', () => {
  const results = searchPosts(samplePosts, 'sérvidor');
  assert.equal(results.length, 1);
  assert.equal(results[0].slug, 'next-no-servidor');
});

test('searchPosts busca em tags e descrição', () => {
  assert.equal(searchPosts(samplePosts, 'hooks').length, 1);
  assert.equal(searchPosts(samplePosts, 'markdown').length, 1);
});

test('searchPosts retorna vazio para query sem correspondência ou vazia', () => {
  assert.deepEqual(searchPosts(samplePosts, 'inexistenteXYZ'), []);
  assert.deepEqual(searchPosts(samplePosts, ''), []);
  assert.equal(hasMatches(samplePosts, 'inexistenteXYZ'), false);
  assert.equal(hasMatches(samplePosts, 'react'), true);
});

test('searchPosts pontua título acima de outros campos', () => {
  const results = searchPosts(samplePosts, 'guia react');
  assert.equal(results[0].slug, 'guia-react');
});

// ---------------------------------------------------------------------------
// Tema
// ---------------------------------------------------------------------------

test('normalizeTheme só aceita temas válidos', () => {
  assert.equal(normalizeTheme('dark'), 'dark');
  assert.equal(normalizeTheme('light'), 'light');
  assert.equal(normalizeTheme('blue'), null);
  assert.equal(normalizeTheme(undefined), null);
});

test('resolveTheme segue a precedência: preferido > storage > sistema', () => {
  assert.equal(resolveTheme('dark', 'light', false), 'dark');
  assert.equal(resolveTheme(undefined, 'dark', false), 'dark');
  assert.equal(resolveTheme(undefined, undefined, true), 'dark');
  assert.equal(resolveTheme(undefined, undefined, false), 'light');
});

test('toggleTheme alterna entre dark e light', () => {
  assert.equal(toggleTheme('dark'), 'light');
  assert.equal(toggleTheme('light'), 'dark');
  assert.equal(toggleTheme(toggleTheme('dark')), 'dark');
});

test('themeLabel retorna rótulo humano do tema', () => {
  assert.equal(themeLabel('dark'), 'Escuro');
  assert.equal(themeLabel('light'), 'Claro');
});

test('getInitialThemeScript injeta chave do storage e data-theme', () => {
  const script = getInitialThemeScript();
  assert.ok(script.includes(THEME_STORAGE_KEY));
  assert.ok(script.includes("data-theme"));
  assert.ok(script.includes('localStorage'));
});

test('THEMES é a lista canônica de temas', () => {
  assert.deepEqual([...THEMES], ['light', 'dark']);
});

// ---------------------------------------------------------------------------
// RSS
// ---------------------------------------------------------------------------

test('escapeXml escapa caracteres reservados do XML', () => {
  assert.equal(escapeXml('a < b & c > "d"'), 'a &lt; b &amp; c &gt; &quot;d&quot;');
});

test('buildRssXml monta feed válido com itens dos posts', () => {
  const xml = buildRssXml({
    site: { url: 'https://exemplo.com', title: 'Blog', description: 'Desc', language: 'pt-BR' },
    posts: samplePosts,
  });
  assert.ok(xml.includes('<rss version="2.0">'));
  assert.ok(xml.includes('<channel>'));
  assert.ok(xml.includes('<item>'));
  assert.ok(xml.includes('https://exemplo.com/post/guia-react'));
  assert.ok(xml.includes('<category>Guia</category>'));
});

// ---------------------------------------------------------------------------
// Datas
// ---------------------------------------------------------------------------

test('formatDate formata datas ISO em texto pt-BR', () => {
  const formatted = formatDate('2026-04-22');
  assert.ok(typeof formatted === 'string' && formatted.length > 0);
  assert.ok(formatted.includes('2026'));
});

// ---------------------------------------------------------------------------
// Integração com o conteúdo real (content/posts)
// ---------------------------------------------------------------------------

test('getAllPosts lê os posts MDX reais da pasta content/posts', () => {
  const posts = getAllPosts();
  assert.ok(posts.length >= 5, `esperava >= 5 posts, obteve ${posts.length}`);
  const slugs = posts.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length, 'slugs devem ser únicos');
});

test('posts reais têm categorias e a busca encontra conteúdo real', () => {
  const posts = getAllPosts();
  const categories = getCategories(posts);
  for (const expected of ['Guia', 'Tutoriais', 'Novidades']) {
    assert.ok(
      categories.some((c) => c.name === expected),
      `categoria ${expected} deveria existir`
    );
  }
  assert.ok(searchPosts(posts, 'mdx').length >= 2, 'busca por "mdx" deve retornar posts');
  assert.ok(searchPosts(posts, 'dark mode').length >= 1);
});
