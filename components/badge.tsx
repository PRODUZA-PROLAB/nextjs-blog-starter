import Link from 'next/link';

import { slugify } from '@/lib/slug';

export default function Badge({ category }: { category: string }) {
  return (
    <Link
      href={`/category/${slugify(category)}`}
      className="badge badge--link"
    >
      {category}
    </Link>
  );
}
