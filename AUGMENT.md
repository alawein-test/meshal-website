# AUGMENT.md - Alawein Platform Development Guide

> Last verified: 2025-12-09 Status: Active Development

---

## Project Overview

**Alawein Platform** is a unified portfolio and platform ecosystem built with
React, TypeScript, and Tailwind CSS. It features multiple specialized dashboards
(SimCore, MEZAN, TalAI, OptiLibria, QMLab) with a shared design system.

### Core Philosophy

- **Token-Based Design**: All styling uses semantic CSS variables
- **Component Reusability**: Shared UI components via Shadcn
- **Type Safety**: Full TypeScript with auto-generated Supabase types
- **Backend Integration**: Lovable Cloud for database, auth, and edge functions

---

## Technology Stack

| Layer     | Technology                                |
| --------- | ----------------------------------------- |
| Frontend  | React 18 + TypeScript                     |
| Styling   | Tailwind CSS + CSS Variables              |
| Animation | Framer Motion                             |
| State     | Zustand (global), TanStack Query (server) |
| Routing   | React Router 6                            |
| Backend   | Lovable Cloud (Supabase)                  |
| Build     | Vite                                      |
| Testing   | Vitest + Playwright                       |
| UI        | Shadcn/ui + Radix                         |

---

## File Structure

```
src/
├── pages/                    # Page components
├── projects/                 # Platform dashboards
│   ├── config.ts             # Platform registry
│   ├── types.ts              # TypeScript interfaces
│   └── pages/                # Individual dashboards
│       ├── simcore/
│       ├── mezan/
│       ├── talai/
│       ├── optilibria/
│       └── qmlab/
├── studios/                  # Studio system
├── components/
│   ├── ui/                   # Shadcn components
│   └── shared/               # Reusable components
├── hooks/                    # Custom React hooks
├── stores/                   # Zustand stores
├── context/                  # React Context (Theme)
└── integrations/supabase/    # Auto-generated client
```

---

## Database Schema

### Platform Tables

| Table                 | Platform   | Key Fields                                 |
| --------------------- | ---------- | ------------------------------------------ |
| `simcore_simulations` | SimCore    | name, simulation_type, status, progress    |
| `mezan_workflows`     | MEZAN      | name, workflow_definition, success_rate    |
| `talai_experiments`   | TalAI      | name, model_type, hyperparameters, metrics |
| `optilibria_runs`     | OptiLibria | problem_name, algorithm, best_score        |
| `qmlab_experiments`   | QMLab      | quantum_system, particle_count             |

### Shared Tables

| Table                      | Purpose                    |
| -------------------------- | -------------------------- |
| `projects`                 | Platform metadata          |
| `profiles`                 | User profiles              |
| `project_features`         | Feature flags              |
| `user_project_preferences` | User settings per platform |

All tables have Row Level Security (RLS) - users can only access their own data.

---

## Design System

### CSS Variables (index.css)

```css
:root {
  --background: 240 40% 10%;
  --foreground: 0 0% 100%;
  --primary: 271 91% 65%;
  --secondary: 245 45% 20%;
  --accent: 330 81% 60%;
}
```

### Usage Pattern

```tsx
// ✅ Always use semantic tokens
<div className="bg-background text-foreground">

// ❌ Never use raw colors
<div className="bg-purple-500 text-white">
```

---

## Platform Themes

| Platform   | Theme                | Colors                  |
| ---------- | -------------------- | ----------------------- |
| SimCore    | Scientific/Cyberpunk | Cyan, purple, dark      |
| MEZAN      | Arabic/Islamic       | Gold, emerald, sand     |
| TalAI      | Neural/AI            | Blue, purple, green     |
| OptiLibria | Mathematical         | Teal, slate, clean      |
| QMLab      | Quantum/Space        | Purple, pink, deep blue |

---

## Development Workflow

### Adding a Feature

1. Locate dashboard: `src/projects/pages/{platform}/`
2. Create/update components
3. Update API if needed: `supabase/functions/{platform}-api/`

### Adding a Platform

1. Add config: `src/projects/config.ts`
2. Create dashboard: `src/projects/pages/{name}/`
3. Create API: `supabase/functions/{name}-api/`
4. Add route: `src/App.tsx`
5. Create database migration

---

## Key Files

| File                     | Purpose             |
| ------------------------ | ------------------- |
| `src/App.tsx`            | All routes          |
| `src/projects/config.ts` | Platform registry   |
| `src/index.css`          | Design tokens       |
| `tailwind.config.ts`     | Tailwind extensions |

### Auto-Generated (DO NOT EDIT)

- `src/integrations/supabase/client.ts`
- `src/integrations/supabase/types.ts`
- `supabase/config.toml`
- `.env`

---

## Documentation

| Doc                                              | Purpose                      |
| ------------------------------------------------ | ---------------------------- |
| [CLAUDE.md](./CLAUDE.md)                         | AI assistant quick reference |
| [docs/QUICK_START.md](./docs/QUICK_START.md)     | 5-minute setup               |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)   | System design                |
| [docs/TESTING.md](./docs/TESTING.md)             | Playwright & Vitest guide    |
| [docs/API_REFERENCE.md](./docs/API_REFERENCE.md) | Complete API docs            |
| [docs/AI_GUIDE.md](./docs/AI_GUIDE.md)           | Detailed AI instructions     |
| [CONTRIBUTING.md](./CONTRIBUTING.md)             | Contribution guidelines      |
