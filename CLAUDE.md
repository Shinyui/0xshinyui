# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js 15 tech blog (0xShinyui) using the Pages Router with local MDX files for content. Features a Binance-inspired dark theme and includes utility tools (2FA generator, IP checker).

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

### Content Source

Blog posts are **local MDX files** at `content/posts/[slug]/index.mdx`. There is no CMS. `src/lib/posts.ts` reads the filesystem:
- `getAllPosts()` — reads all directories, parses frontmatter, sorts by date DESC
- `getPostBySlug(slug)` — returns frontmatter + raw MDX content

Post frontmatter shape:
```yaml
title: "..."
date: "2025-09-01"
excerpt: "..."
contentType: "pm|opt|dev|edtech|iGaming|adult|trading|other"
coverImage: "https://..."
draft: false        # optional, excludes from listings
tags: []            # optional
```

### MDX Processing Pipeline

In `src/pages/posts/[slug].tsx`, raw MDX is serialized with `next-mdx-remote`:
- `remarkGfm` — GitHub Flavored Markdown (tables, strikethrough)
- `rehypeSlug` + `rehypeAutolinkHeadings` — heading anchors
- `markdown-toc` — generates table of contents JSON

### Routing (Pages Router)

| Route | Purpose | ISR |
|---|---|---|
| `/` | Home with category stats | 60s |
| `/posts/[slug]` | Post detail | 60s |
| `/category/[category]` | Filtered post list | 60s |
| `/feed.xml`, `/sitemap.xml`, `/robots.txt` | SEO feeds | 60s |
| `/2fa`, `/ip` | Client-side utility tools | — |

### Categories

Defined in `src/utils/category.ts`:
- `pm` (Product Management), `opt` (Operations), `dev` (Development)
- `edtech` (EdTech), `iGaming` (Gaming), `adult` (Adult), `trading` (Trading)
- `other` — always sorted last by `sortCategories()`

### Styling

Tailwind CSS v4. Theme is defined in `src/styles/globals.css` via CSS custom properties:
- `--background: #0B0E11` — page background
- `--accent-mint: #54FFD5` — primary brand color (hovers, CTAs)
- `--accent-positive: #02C076` / `--accent-negative: #F6465D` — trading-style indicators
- `--text-primary: #EAECEF`

### Image Optimization

`src/lib/bunny.ts` provides `bunnyOptimize(src, options)` which appends CDN query params (`width`, `height`, `quality`, `format`, `aspect_ratio`) to Bunny CDN URLs. Use this for all post cover images and MDX images.

### Layout

`src/components/layout/Layout.tsx` wraps all pages. Props:
- `hideSidebar` — toggles the `300px` right column
- `hideTopBanner`, `hideStickyBottom` — ad slot visibility

Includes Vercel Analytics.

### SEO

`src/components/seo/` contains the SEO wrapper and JsonLd components (Article, BreadcrumbList, Organization). Every page should pass SEO props through `Layout`.

## Environment Variables

Required in `.env`:
- `NEXT_PUBLIC_BUNNY_CDN_BASE` — Bunny CDN base URL
- `NEXT_PUBLIC_BUNNY_CDN_HOSTNAME` — Hostname wildcard for next/image allowlist

## Notes

- Uses `@/*` path alias (configured in `tsconfig.json`)
- ESLint is disabled during builds (`ignoreDuringBuilds: true`)
- `draft: true` posts are excluded from `getAllPosts()` but accessible by direct URL if you know the slug
