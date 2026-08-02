import Link from 'next/link';

import { SITE } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p>
          © {new Date().getFullYear()} {SITE.author} — {SITE.title}.
        </p>
        <nav aria-label="Links do rodapé">
          <Link href="/">Início</Link>
          <Link href="/search">Busca</Link>
          <Link href="/rss.xml">Feed RSS</Link>
          <Link href="/sitemap.xml">Sitemap</Link>
        </nav>
      </div>
    </footer>
  );
}
