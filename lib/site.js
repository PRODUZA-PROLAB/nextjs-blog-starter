/**
 * Configuração global do site, alimentada por variáveis de ambiente públicas.
 * Copie `env.example` para `.env.local` e ajuste os valores.
 */

export const SITE = {
  title: process.env.NEXT_PUBLIC_SITE_NAME || 'Next.js Blog Starter',
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    'Um blog full-stack com Next.js 15, MDX, busca, temas claro/escuro e RSS.',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),
  language: 'pt-BR',
  author: process.env.NEXT_PUBLIC_SITE_AUTHOR || 'Produza ProLab',
  tags: ['blog', 'nextjs', 'mdx', 'typescript'],
};
