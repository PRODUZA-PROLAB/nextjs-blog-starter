import Link from 'next/link';

import Badge from '@/components/badge';
import type { Post } from '@/lib/types';
import { formatDate } from '@/lib/date';

export default function PostCard({ post }: { post: Post }) {
  return (
    <li>
      <Link href={`/post/${post.slug}`} className="post-card">
        <div className="post-card__meta">
          <Badge category={post.category} />
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
      </Link>
    </li>
  );
}
