'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import PostCard from '@/components/post-card';
import { searchPosts } from '@/lib/search';
import type { Post } from '@/lib/types';

interface SearchBoxProps {
  posts: Post[];
  initialQuery: string;
}

export default function SearchBox({ posts, initialQuery }: SearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const results: Post[] = useMemo(() => searchPosts(posts, query) as Post[], [
    posts,
    query,
  ]);

  function handleChange(event: { target: { value: string } }) {
    const value = event.target.value;
    setQuery(value);
    const url = value.trim() ? `/search?q=${encodeURIComponent(value)}` : '/search';
    router.replace(url, { scroll: false });
  }

  return (
    <div>
      <form className="search-box" role="search" onSubmit={(e) => e.preventDefault()}>
        <input
          type="search"
          value={query}
          onChange={handleChange}
          placeholder="Buscar posts…"
          aria-label="Buscar posts"
          autoFocus
        />
      </form>

      {query.trim() ? (
        <p>
          {results.length === 0
            ? 'Nenhum resultado encontrado.'
            : `${results.length} ${results.length === 1 ? 'resultado' : 'resultados'} para "${query}".`}
        </p>
      ) : (
        <p className="empty">Digite uma palavra-chave para buscar nos posts.</p>
      )}

      {results.length > 0 ? (
        <ul className="post-list">
          {results.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </ul>
      ) : null}
    </div>
  );
}
