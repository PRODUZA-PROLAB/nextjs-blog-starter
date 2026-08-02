import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import PostList from '@/components/post-list';
import { getAllPosts, getCategories, getPostsByCategorySlug, listPosts } from '@/lib/posts';
import { slugify } from '@/lib/slug';
import type { Post } from '@/lib/types';

export const dynamicParams = false;

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return getCategories(getAllPosts()).map((category) => ({
    category: slugify(category.name),
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const posts = listPosts(getPostsByCategorySlug(getAllPosts(), category));
  if (posts.length === 0) return {};
  return {
    title: posts[0].category,
    description: `Todos os posts da categoria ${posts[0].category}.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const posts = listPosts(getPostsByCategorySlug(getAllPosts(), category)) as Post[];
  if (posts.length === 0) notFound();

  return (
    <div className="container">
      <section className="hero">
        <h1>Categoria: {posts[0].category}</h1>
        <p>
          {posts.length} {posts.length === 1 ? 'post publicado' : 'posts publicados'}{' '}
          nesta categoria.
        </p>
      </section>

      <PostList posts={posts} />
    </div>
  );
}
