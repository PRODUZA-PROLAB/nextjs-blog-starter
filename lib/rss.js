/**
 * Geração de feed RSS 2.0. Usada pela rota app/rss.xml/route.ts.
 * Funções puras e testáveis.
 */

export function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Monta o XML completo do feed RSS a partir da configuração do site e da
 * lista de posts (já ordenada).
 */
export function buildRssXml({ site, posts }) {
  const items = posts
    .map((post) => {
      const link = `${site.url}/post/${post.slug}`;
      return [
        '  <item>',
        `    <title>${escapeXml(post.title)}</title>`,
        `    <link>${link}</link>`,
        `    <guid isPermaLink="false">${link}</guid>`,
        `    <pubDate>${new Date(post.date).toUTCString()}</pubDate>`,
        `    <category>${escapeXml(post.category)}</category>`,
        `    <description>${escapeXml(post.excerpt)}</description>`,
        '  </item>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    `    <title>${escapeXml(site.title)}</title>`,
    `    <link>${escapeXml(site.url)}</link>`,
    `    <description>${escapeXml(site.description)}</description>`,
    `    <language>${escapeXml(site.language)}</language>`,
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}
