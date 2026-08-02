import type { MetadataRoute } from 'next';

import { getAllPosts } from '@/lib/posts';
import { SITE } from '@/lib/site';
import type { Post } from '@/lib/types';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts() as Post[];

  return [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...posts.map((post) => ({
      url: `${SITE.url}/post/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
