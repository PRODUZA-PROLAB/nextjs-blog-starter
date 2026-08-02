import PostCard from '@/components/post-card';
import type { Post } from '@/lib/types';

export default function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return <p className="empty">Nenhum post encontrado.</p>;
  }

  return (
    <ul className="post-list">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </ul>
  );
}
