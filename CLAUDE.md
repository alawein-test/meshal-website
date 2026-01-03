# CLAUDE.md - Project Context for AI Assistants

> Last verified: 2025-12-09 Essential context for Claude Code, Cursor, and other
> AI assistants.

---

## Project Summary

**Alawein Platform** is a React/TypeScript portfolio and platform ecosystem with
a unified design system. Built on Lovable Cloud (Supabase).

**Tech Stack**: React 18, TypeScript, Tailwind CSS, Zustand, TanStack Query,
Framer Motion, Vite

---

## Route Structure

```
/                        → Landing Page
/portfolio               → Portfolio (ninja/cyberpunk theme)
/resume                  → Resume page
/interactive-resume      → Interactive Resume experience
/projects                → Projects Hub
/projects/simcore        → SimCore Dashboard (scientific computing)
/projects/mezan          → MEZAN Dashboard (workflow automation)
/projects/talai          → TalAI Dashboard (AI research)
/projects/optilibria     → OptiLibria Dashboard (optimization)
/projects/qmlab          → QMLab Dashboard (quantum mechanics)
/studios                 → Studios Hub (template browser)
/auth                    → Authentication
/profile                 → User Profile
/settings                → User Settings
/services                → Services Hub
/pricing                 → Pricing Page
```

---

## Critical Rules

### 1. ALWAYS Use Semantic Tokens

```tsx
// ✅ CORRECT
className = 'bg-background text-foreground';
className = 'text-primary hover:text-primary/80';
className = 'border-border bg-card';

// ❌ WRONG - Never use direct colors
className = 'bg-slate-900 text-white';
className = 'text-blue-500 bg-purple-600';
```

### 2. NEVER Edit Auto-Generated Files

- `src/integrations/supabase/client.ts`
- `src/integrations/supabase/types.ts`
- `supabase/config.toml`
- `.env`
- `package.json` (use dependency tools)

### 3. Use Path Aliases

```tsx
// ✅ CORRECT
import { Button } from '@/components/ui/button';

// ❌ WRONG
import { Button } from '../../../components/ui/button';
```

---

## Key Directories

```
src/
├── pages/                      # Page components
├── projects/
│   ├── config.ts               # Platform registry (CHECK THIS FIRST)
│   └── pages/{platform}/       # Dashboard pages
├── components/
│   ├── ui/                     # Shadcn components
│   └── shared/                 # Reusable components
├── hooks/                      # Custom React hooks
├── stores/                     # Zustand stores (authStore, etc.)
├── context/ThemeContext.tsx    # Theme provider
└── index.css                   # Design tokens

supabase/functions/{platform}-api/  # Edge functions
```

---

## Key Files

| Purpose         | Location                       |
| --------------- | ------------------------------ |
| App Router      | `src/App.tsx`                  |
| Project Config  | `src/projects/config.ts`       |
| Theme Context   | `src/context/ThemeContext.tsx` |
| Design Tokens   | `src/index.css`                |
| Tailwind Config | `tailwind.config.ts`           |

---

## Common Tasks

### Add a Feature to Platform

1. Find dashboard: `src/projects/pages/{platform}/{Platform}Dashboard.tsx`
2. Find/update API: `supabase/functions/{platform}-api/index.ts`

### Update Styling

1. Add tokens to `src/index.css`
2. Extend in `tailwind.config.ts`
3. Use semantic classes: `bg-my-color`

### Add New Page

1. Create component in `src/pages/`
2. Add route in `src/App.tsx`

---

## Database Tables

| Table                 | Platform                   |
| --------------------- | -------------------------- |
| `simcore_simulations` | SimCore                    |
| `mezan_workflows`     | MEZAN                      |
| `talai_experiments`   | TalAI                      |
| `optilibria_runs`     | OptiLibria                 |
| `qmlab_experiments`   | QMLab                      |
| `profiles`            | User profiles (shared)     |
| `projects`            | Platform metadata (shared) |

---

## Documentation

| Doc                                              | Purpose                   |
| ------------------------------------------------ | ------------------------- |
| [docs/QUICK_START.md](./docs/QUICK_START.md)     | 5-minute setup            |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)   | System design             |
| [docs/TESTING.md](./docs/TESTING.md)             | Playwright & Vitest guide |
| [docs/API_REFERENCE.md](./docs/API_REFERENCE.md) | Complete API docs         |
| [docs/AI_GUIDE.md](./docs/AI_GUIDE.md)           | Detailed AI instructions  |

---

## Quick Reference

**Always use**: `bg-background`, `text-foreground`, `bg-primary`,
`text-primary-foreground`, `bg-card`, `border-border`

**Never edit**: Supabase client files, `.env`, `package.json` directly

**Check first**: `src/projects/config.ts` for platform info
