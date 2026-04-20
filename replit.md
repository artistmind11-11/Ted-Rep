# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### The Executive Desk Website (`artifacts/executive-desk-site`)
- **Type**: react-vite (frontend-only, no backend)
- **URL**: Served at `/` (root)
- **Brand**: Charcoal #2C2C2C, Gold #9B8B5F, Off-white #F8F8F6
- **Fonts**: Cormorant Garamond (serif headings) + Inter (body)
- **Dark/Light mode**: Implemented with ThemeProvider + localStorage sync
- **Pages**: Home, About, Services, Testimonials, Blog (+ individual post), FAQ, Contact, Portal
- **Key files**:
  - `src/index.css` — full brand theme with CSS custom properties
  - `src/lib/theme-provider.tsx` — dark/light mode
  - `src/components/layout.tsx` — shared header/footer with Portal Access button
  - `src/pages/` — all 9 page components

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
