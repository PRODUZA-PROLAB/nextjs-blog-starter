import { getAllPosts, listPosts } from '@/lib/posts';
import { buildRssXml } from '@/lib/rss';
import { SITE } from '@/lib/site';

export const dynamic = 'force-static';

export function GET() {
  const posts = listPosts(getAllPosts());
  const xml = buildRssXml({ site: SITE, posts });
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=3600',
    },
  });
}
