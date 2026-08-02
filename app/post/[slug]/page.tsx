import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import Badge from '@/components/badge';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { formatDate } from '@/lib/date';
import { SITE } from '@/lib/site';
import { slugify } from '@/lib/slug';
import type { Post } from '@/lib/types';

export const dynamicParams = false;

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(getAllPosts(), slug) as Post | null;
  if (!post) return {};

  return {
    title: post.title,
    description: post.description || post.excerpt,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description || post.excerpt,
      url: `${SITE.url}/post/${post.slug}`,
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(getAllPosts(), slug) as Post | null;
  if (!post) notFound();

  return (
    <div className="container">
      <article>
        <header className="post-header">
          <div className="post-card__meta">
            <Badge category={post.category} />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>
          <h1>{post.title}</h1>
          {post.description ? <p>{post.description}</p> : null}
          {post.tags.length > 0 ? (
            <ul className="tag-list">
              {post.tags.map((tag) => (
                <li key={tag}>#{tag}</li>
              ))}
            </ul>
          ) : null}
        </header>

        <div className="prose">
          <MDXRemote source={post.body} />
        </div>

        <p>
          <Link href={`/category/${slugify(post.category)}`}>
            Mais posts em {post.category}
          </Link>
        </p>
      </article>
    </div>
  );
}
