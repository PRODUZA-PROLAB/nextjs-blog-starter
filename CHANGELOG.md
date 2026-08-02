# Changelog

Todas as mudanças relevantes do projeto são documentadas neste arquivo.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o
versionamento segue [SemVer](https://semver.org/lang/pt-BR/).

## [1.0.0] — 2026-08-01

### Adicionado

- Listagem de posts em MDX com frontmatter YAML (título, data, categoria,
  tags, descrição) e parser próprio sem dependências.
- Páginas de categoria dinâmicas (`/category/[category]`) com
  `generateStaticParams` e pré-renderização estática.
- Página de busca full-text (`/search`) com relevância, insensível a caixa e
  a acentos, com filtro em tempo real no cliente.
- Tema claro/escuro via CSS variables e `data-theme`, com persistência em
  `localStorage`, respeito a `prefers-color-scheme` e script inline anti-FOUC.
- Feed RSS 2.0 em `/rss.xml`, `sitemap.xml` e `robots.txt`.
- SEO básico: `metadata` raiz, Open Graph, Twitter Cards e `generateMetadata`
  por post.
- Página 404 customizada.
- Suíte de testes com `node:test` cobrindo parsing de posts, busca, slugs,
  tema, RSS, datas e integração com o conteúdo real.
- Configuração completa: TypeScript estrito, Prettier, `.gitignore` e
  `env.example`.

### Infraestrutura

- Next.js 15 App Router com React 19.
- Bibliotecas puras em `lib/` reutilizáveis entre servidor, cliente e testes.
- Scripts npm: `dev`, `build`, `start`, `lint` (type-check) e `test`.
