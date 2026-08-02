import type { Metadata } from 'next';

import SearchBox from '@/components/search-box';
import { getAllPosts } from '@/lib/posts';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Buscar',
  description: `Busca full-text nos posts do ${SITE.title}.`,
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const initialQuery = typeof q === 'string' ? q : '';
  const posts = getAllPosts();

  return (
    <div className="container">
      <section className="hero">
        <h1>Buscar</h1>
        <p>
          Busque por título, descrição, tags ou conteúdo. A busca é
          case-insensitive e ignora acentos.
        </p>
      </section>

      <SearchBox posts={posts} initialQuery={initialQuery} />
    </div>
  );
}
