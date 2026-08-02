/**
 * Tipos compartilhados do blog.
 */

export interface Post {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
  body: string;
  excerpt: string;
}

export interface Category {
  name: string;
  count: number;
}
