# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lifting Diary Course - a Next.js 16 full-stack web application for fitness/exercise tracking. Built with React 19, TypeScript 5.9, and Tailwind CSS v4.

## IMPORTANT: Documentation Reference

**ALWAYS consult the `/docs` directory before generating any code.** The docs contain project-specific patterns, conventions, and guidelines that must be followed.

Current documentation files:
- `docs/ui.md` - UI components and styling guidelines
- `docs/data-fetching.md` - Data fetching patterns and database access rules
- `docs/data-mutations.md` - Server actions, mutations, and validation rules
- `docs/auth.md` - Authentication patterns using Clerk

Read the relevant docs file(s) first to ensure generated code follows established project patterns and conventions.

## Development Commands

```bash
# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16.1.1 with App Router
- **UI**: React 19.2.3
- **Styling**: Tailwind CSS v4 (using @tailwindcss/postcss)
- **Language**: TypeScript 5.9.3 (strict mode)
- **Authentication**: Clerk (@clerk/nextjs)

### Directory Structure
- `app/` - Next.js App Router directory (pages, layouts, API routes)
- `app/globals.css` - Global styles with Tailwind and CSS theme variables
- `public/` - Static assets

### Path Aliases
- `@/*` maps to `./*` (use `@/app/...` for imports)

### Fonts
Uses Geist font family via next/font/google with CSS variables:
- `--font-geist-sans` - Main sans-serif font
- `--font-geist-mono` - Monospace font

### Theming
CSS variables in globals.css support light/dark mode:
- `--background` and `--foreground` colors
- Dark mode via `prefers-color-scheme: dark`

### Authentication (Clerk)
- `middleware.ts` - Uses `clerkMiddleware()` from `@clerk/nextjs/server`
- `app/layout.tsx` - Wraps app with `<ClerkProvider>`
- Components: `<SignInButton>`, `<SignUpButton>`, `<UserButton>`, `<SignedIn>`, `<SignedOut>`
- Environment variables in `.env.local`: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- Get keys from [Clerk Dashboard](https://dashboard.clerk.com/last-active?path=api-keys)
