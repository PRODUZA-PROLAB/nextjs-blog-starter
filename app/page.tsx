import Link from 'next/link';

import PostList from '@/components/post-list';
import { getAllPosts, getCategories, listPosts } from '@/lib/posts';
import { SITE } from '@/lib/site';
import { slugify } from '@/lib/slug';
import type { Category, Post } from '@/lib/types';

export default function HomePage() {
  const posts = listPosts(getAllPosts()) as Post[];
  const categories = getCategories(posts) as Category[];

  return (
    <div className="container">
      <section className="hero">
        <h1>{SITE.title}</h1>
        <p>
          {SITE.description} Todos os posts são escritos em MDX e o conteúdo é
          pré-renderizado com Next.js 15 App Router.
        </p>
      </section>

      <section>
        <h2 className="section-title">Categorias</h2>
        <div className="category-chips">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/category/${slugify(category.name)}`}
              className="badge badge--link"
            >
              {category.name} ({category.count})
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">Posts</h2>
        {posts.length > 0 ? (
          <PostList posts={posts} />
        ) : (
          <p className="empty">
            Nenhum post ainda. Adicione um arquivo `.mdx` em `content/posts/`.
          </p>
        )}
      </section>
    </div>
  );
}
