# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

A Next.js 15 tech blog (0xShinyui) using the Pages Router with Hygraph CMS for content management. Features a Binance-inspired dark theme and includes utility tools (2FA generator, IP checker).

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

### Routing (Pages Router)
- `src/pages/` - File-based routing with Next.js Pages Router
- `src/pages/posts/[slug].tsx` - Dynamic post pages with ISR
- `src/pages/category/[category].tsx` - Category filter pages
- `src/pages/api/` - API routes

### Data Layer
- **Hygraph CMS**: Blog content is fetched from Hygraph via GraphQL
- `src/lib/hygraph.tsx` - GraphQL client and queries for posts
- ISR with 60-second revalidation on all content pages

### Styling
- Tailwind CSS v4 with CSS custom properties for theming
- Theme defined in `src/styles/globals.css` with `:root` variables
- Uses CSS variables like `--accent-gold`, `--card-background`, `--text-primary`

### Content Processing
- Markdown content processed with unified/remark/rehype pipeline
- `src/pages/posts/[slug].tsx` handles MD to HTML conversion with GFM support
- Table of contents generated via `markdown-toc`

### Components Structure
```
src/components/
├── layout/     # Header, Footer, Layout wrapper
├── post/       # PostCard, PostMeta, PostCover, TableOfContents
├── category/   # CategoryFilter, CategoryTag
├── ui/         # Generic Card, Input components
└── tool/       # Tool-specific components
```

### Categories
Defined in `src/utils/category.ts`:
- `pm` (Product Management)
- `opt` (Operations)
- `dev` (Development)
- `edtech` (Online Education)
- `iGaming` (Gaming Industry)
- `trading` (Trading)
- `other` (always sorted last)

## Environment Variables

Required in `.env`:
- `HYGRAPH_ENDPOINT` - Hygraph GraphQL endpoint URL
- `HYGRAPH_TOKEN` - Authentication token for Hygraph

## Notes

- Uses `@/*` path alias configured in tsconfig.json
- ESLint is disabled during builds (`ignoreDuringBuilds: true`)
- Images from Hygraph domain `ap-south-1.graphassets.com` are whitelisted
