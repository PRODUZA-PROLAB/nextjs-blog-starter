import Link from 'next/link';

import ThemeToggle from '@/components/theme-toggle';
import { SITE } from '@/lib/site';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="site-header__brand">
          {SITE.title}
        </Link>
        <nav className="site-header__nav">
          <Link href="/">Início</Link>
          <Link href="/search">Busca</Link>
          <Link href="/rss.xml">RSS</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
