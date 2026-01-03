# Lovable Development Workflow

> Last verified: 2025-12-09

## Overview

This project is built and maintained using Lovable.dev with bidirectional GitHub
sync.

---

## Repository Structure

This is a **single Vite application** (not a monorepo). All code lives in one
repository:

```
alawein-platform/
├── src/                    # Application source
│   ├── pages/              # Page components
│   ├── projects/           # Platform dashboards
│   ├── components/         # UI components
│   └── ...
├── supabase/               # Backend (Edge Functions)
├── docs/                   # Documentation
└── templates/              # Template metadata
```

---

## GitHub Integration

### Bidirectional Sync

- **Lovable → GitHub**: Changes made in Lovable auto-push to GitHub
- **GitHub → Lovable**: Changes pushed to GitHub auto-sync to Lovable

### Workflow

1. Make changes in Lovable (or locally via GitHub)
2. Changes automatically sync both ways
3. Deploy via Lovable's publish feature

---

## Development Modes

### In Lovable

Best for:

- UI development with live preview
- Quick iterations and prototyping
- AI-assisted code generation
- Database schema changes

### In IDE (via GitHub)

Best for:

- Complex refactoring
- Multi-file changes
- Git operations (branching, merging)
- Local testing with dev tools

---

## Project Structure

### Pages (`src/pages/`)

Standalone page components:

- `Landing.tsx` - Main landing page
- `Portfolio.tsx` - Cyberpunk portfolio
- `Auth.tsx` - Authentication
- etc.

### Projects (`src/projects/`)

Platform dashboard module:

- `config.ts` - Platform registry
- `pages/{platform}/` - Individual dashboards

### Components (`src/components/`)

- `ui/` - Shadcn UI components
- `shared/` - Reusable components

### Backend (`supabase/`)

- `functions/{name}-api/` - Edge functions
- Auto-managed config files

---

## Adding New Features

### New Page

1. Create in `src/pages/`
2. Add route in `src/App.tsx`
3. Sync happens automatically

### New Platform Dashboard

1. Add config to `src/projects/config.ts`
2. Create `src/projects/pages/{name}/`
3. Create `supabase/functions/{name}-api/`
4. Add routes to `src/App.tsx`

### New Edge Function

1. Create `supabase/functions/{name}/index.ts`
2. Deploy automatically on sync

---

## Best Practices

1. **Use semantic tokens** - Never hardcode colors
2. **Use path aliases** - `@/` for src imports
3. **Don't edit auto-generated files** - Supabase client/types
4. **Small, focused components** - Avoid monolithic files
5. **Follow commit conventions** - See CONTRIBUTING.md

---

## Deployment

### Frontend

Changes deploy when you click "Publish" in Lovable.

### Backend

Edge functions deploy automatically when files change.

### Environment Variables

Managed automatically by Lovable Cloud. Never edit `.env` directly.

---

## Troubleshooting

### Sync Issues

- Check GitHub connection in Lovable settings
- Verify no merge conflicts in GitHub

### Build Errors

- Check console for TypeScript errors
- Verify all imports use `@/` alias

### Database Issues

- Check Supabase types are current
- Verify RLS policies are correct
