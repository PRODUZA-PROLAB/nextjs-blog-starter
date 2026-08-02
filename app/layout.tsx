import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { SITE } from '@/lib/site';
import { getInitialThemeScript } from '@/lib/theme';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s | ${SITE.title}`,
  },
  description: SITE.description,
  authors: [{ name: SITE.author }],
  keywords: SITE.tags,
  openGraph: {
    type: 'website',
    url: SITE.url,
    title: SITE.title,
    description: SITE.description,
    siteName: SITE.title,
    locale: SITE.language,
  },
  twitter: {
    card: 'summary',
    title: SITE.title,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={SITE.language} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: getInitialThemeScript() }} />
        <div className="shell">
          <Header />
          <main className="site-main">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
