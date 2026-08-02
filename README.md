# Next.js Blog Starter

Starter de blog **full-stack** construído com Next.js 15 (App Router), React 19,
TypeScript estrito e conteúdo em **MDX**. Inclui listagem de posts, páginas de
categoria, busca full-text, tema claro/escuro persistente, feed RSS, sitemap,
robots.txt e SEO básico — tudo com testes de unidade usando `node:test`.

## Funcionalidades

- **Posts em MDX** — frontmatter YAML (título, data, categoria, tags e
  descrição) com parser próprio, testável e sem dependências de YAML.
- **App Router** — rotas dinâmicas `/post/[slug]`, `/category/[category]`,
  página de busca e rotas especiais (`rss.xml`, `sitemap.xml`, `robots.txt`).
- **Busca full-text** — case-insensitive e insensível a acentos, com relevância
  (título pesa mais que tags/corpo), usada na página `/search`.
- **Tema claro/escuro** — via CSS variables + atributo `data-theme`, persistido
  em `localStorage` e sem *flash* de tema errado (script inline no layout).
- **RSS 2.0** — feed gerado em `GET /rss.xml` com escape XML correto.
- **SEO básico** — `metadata` dinâmica, Open Graph, Twitter Cards, `sitemap.ts`
  e `robots.ts`.
- **Testes com `node:test`** — suíte de smoke tests que cobre parsing de posts,
  busca, slugs, tema, RSS e integração com o conteúdo real.
- **TypeScript estrito** — `strict: true`, sem `any` implícito no código TS.

## Stack

| Camada       | Tecnologia                                   |
| ------------ | -------------------------------------------- |
| Framework    | Next.js 15 (App Router, React Server Components) |
| UI           | React 19                                     |
| Linguagem    | TypeScript 5 (modo estrito) + JS puro nas libs testáveis |
| Conteúdo     | MDX via `next-mdx-remote/rsc`                |
| Estilos      | CSS modules globais com variáveis de tema    |
| Testes       | `node:test` (node --test)                    |

## Requisitos

- Node.js **>= 18.18** (testado com Node 20+ e Node 24)

## Começando

```bash
# 1. instale as dependências
npm install

# 2. rode em modo desenvolvimento
npm run dev
# http://localhost:3000

# 3. (opcional) crie as variáveis de ambiente
cp env.example .env.local
```

Todos os scripts disponíveis:

| Script            | Descrição                                            |
| ----------------- | ---------------------------------------------------- |
| `npm run dev`     | Servidor de desenvolvimento                          |
| `npm run build`   | Build de produção (`next build`)                     |
| `npm start`       | Servidor de produção (após build)                    |
| `npm run lint`    | Type-check estrito (`tsc --noEmit`)                  |
| `npm test`        | Roda a suíte de testes (`node --test test/`)         |

## Estrutura do projeto

```text
nextjs-blog-starter/
├── app/                     # Rotas do App Router
│   ├── layout.tsx           # Layout raiz (html, tema, header/footer)
│   ├── page.tsx             # Home (posts + categorias)
│   ├── globals.css          # Estilos globais com variáveis de tema
│   ├── post/[slug]/page.tsx # Página de um post
│   ├── category/[category]/page.tsx # Página de categoria
│   ├── search/page.tsx      # Página de busca
│   ├── rss.xml/route.ts     # Feed RSS 2.0
│   ├── sitemap.ts           # sitemap.xml
│   ├── robots.ts            # robots.txt
│   └── not-found.tsx        # Página 404
├── components/              # Header, footer, cards, busca, tema
├── content/posts/           # Posts MDX (fonte da verdade do conteúdo)
├── lib/                     # Lógica pura (testável em node)
│   ├── posts.js             # Leitura/parsing/ordenação/categorias
│   ├── search.js            # Busca full-text
│   ├── slug.js              # Slugs e normalização de texto
│   ├── theme.js             # Tema claro/escuro
│   ├── rss.js               # Geração do feed RSS
│   ├── date.js              # Formatação de datas pt-BR
│   ├── site.js              # Configuração via env vars
│   └── types.ts             # Tipos compartilhados (Post, Category)
├── test/                    # Smoke tests (node:test)
│   ├── index.js             # Shim: importa a suíte
│   └── smoke.test.mjs       # 25+ testes reais
├── env.example              # Modelo de variáveis de ambiente
├── tsconfig.json            # TypeScript estrito
└── package.json
```

> As bibliotecas em `lib/` são JavaScript puro propositalmente: assim a mesma
> lógica roda no servidor (Next.js), no cliente (busca) e nos testes com
> `node --test`, sem transpilação.

## Escrevendo posts

Crie um arquivo `.mdx` em `content/posts/`. O slug é derivado do nome do
arquivo (ex.: `meu-primeiro-post.mdx` → `/post/meu-primeiro-post`).

```mdx
---
title: "Meu Primeiro Post"
date: "2026-08-01"
category: "Tutoriais"
description: "Uma descrição curta que vira meta description e excerpt."
tags:
  - nextjs
  - mdx
---

Aqui o conteúdo em Markdown. Componentes JSX também funcionam.
```

Campos do frontmatter:

| Campo        | Obrigatório | Uso                                          |
| ------------ | ----------- | -------------------------------------------- |
| `title`      | sim         | Título, `<title>` e cards                    |
| `date`       | sim         | Ordenação e exibição da data (formato ISO)   |
| `category`   | não         | Página de categoria (padrão: `Geral`)        |
| `description`| não         | Meta description e excerpt                    |
| `tags`       | não         | Lista usada pela busca                        |

Categorias e páginas são geradas automaticamente. Não é preciso registrar nada
em nenhum outro lugar.

## Busca

A busca em `/search` funciona com **case-insensitive** e **insensível a
acentos**. Digite e os resultados filtram em tempo real, atualizando a URL via
`router.replace`. A função `searchPosts()` em `lib/search.js` pontua os campos:
título vale mais que tags/descrição/corpo, e resultados são ordenados por
relevância e data.

## Tema claro/escuro

- Botão de sol/lua no cabeçalho alterna o tema.
- A escolha é salva em `localStorage` (chave `nextjs-blog-starter:theme`).
- Na primeira visita, respeita `prefers-color-scheme` do sistema.
- Um script inline no `layout.tsx` aplica o tema antes da primeira pintura
  (sem *flash*). As cores vivem em variáveis CSS em `app/globals.css`.

## RSS, Sitemap e SEO

| Rota            | Descrição                                    |
| --------------- | -------------------------------------------- |
| `/rss.xml`      | Feed RSS 2.0 com todos os posts              |
| `/sitemap.xml`  | Home + cada post com data de modificação     |
| `/robots.txt`   | Regras de rastreio + referência ao sitemap   |

O `layout.tsx` define `metadata` raiz com Open Graph e Twitter Cards; cada
página de post gera metadata própria via `generateMetadata`.

## Testes

```bash
npm test
# ou
node --test test/
```

A suíte (`test/smoke.test.mjs`) cobre: parsing de frontmatter, parsePost e
excerpts, ordenação, categorias, busca por slug, busca full-text (incluindo
caixa e acentos), prioridade de campos, funções de tema, RSS, datas e uma
integração com os posts reais de `content/posts`. O arquivo `test/index.js` é
um shim que importa a suíte para o runner.

## Variáveis de ambiente

Copie `env.example` para `.env.local`. Todas as variáveis são públicas
(`NEXT_PUBLIC_*`) e seguras para versionar como modelo:

- `NEXT_PUBLIC_SITE_URL` — URL pública (metadata, RSS, sitemap).
- `NEXT_PUBLIC_SITE_NAME` — nome exibido no cabeçalho/rodapé.
- `NEXT_PUBLIC_SITE_DESCRIPTION` — descrição padrão para SEO/RSS.
- `NEXT_PUBLIC_SITE_AUTHOR` — autor exibido no rodapé.

## Deploy (Vercel)

```bash
# build local primeiro (0 erros)
npm run build

# deploy com artefato pré-construído (não consome minutos de build remoto)
vercel --prod --prebuilt
```

O build local com `--prebuilt` evita estourar o limite de minutos do plano
Hobby da Vercel. Projetos que rodam fora da Vercel podem usar `npm run build` +
`npm start` em qualquer host Node.

## Licença

MIT — veja [LICENSE](./LICENSE). Histórico de mudanças em
[CHANGELOG.md](./CHANGELOG.md).
