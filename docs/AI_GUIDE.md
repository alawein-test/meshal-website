# AI Assistant Guide

> Last verified: 2025-12-09

Detailed instructions for AI assistants (Claude, Cursor, Cline, etc.) working on
this codebase.

> **Quick Reference**: See [CLAUDE.md](../CLAUDE.md) in the project root for a
> condensed version.

---

## Table of Contents

1. Project Overview
2. Critical Rules
3. File Locations
4. Common Tasks
5. Code Patterns
6. What NOT to Do
7. Debugging Tips

---

## Project Overview

**Alawein Platform** is a React/TypeScript application with:

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **State**: Zustand (global), TanStack Query (server)
- **Backend**: Lovable Cloud (Edge Functions, PostgreSQL)
- **UI**: Shadcn components + custom design tokens

### Key Routes

| Route                  | Component                 | Purpose             |
| ---------------------- | ------------------------- | ------------------- |
| `/`                    | `Landing.tsx`             | Landing page        |
| `/portfolio`           | `Portfolio.tsx`           | Cyberpunk portfolio |
| `/resume`              | `Resume.tsx`              | Resume page         |
| `/interactive-resume`  | `InteractiveResume.tsx`   | Interactive resume  |
| `/projects`            | `ProjectsHub.tsx`         | Platform hub        |
| `/projects/simcore`    | `SimCoreDashboard.tsx`    | SimCore             |
| `/projects/mezan`      | `MEZANDashboard.tsx`      | MEZAN               |
| `/projects/talai`      | `TalAIDashboard.tsx`      | TalAI               |
| `/projects/optilibria` | `OptiLibriaDashboard.tsx` | OptiLibria          |
| `/projects/qmlab`      | `QMLabDashboard.tsx`      | QMLab               |
| `/studios`             | `StudioSelector.tsx`      | Studios hub         |
| `/auth`                | `Auth.tsx`                | Authentication      |

---

## Critical Rules

### 1. ALWAYS Use Semantic Tokens

```tsx
// ✅ CORRECT
<div className="bg-background text-foreground">
<div className="bg-primary text-primary-foreground">
<div className="bg-card border-border">

// ❌ WRONG - Never use raw colors
<div className="bg-purple-500 text-white">
<div className="bg-slate-900">
```

### 2. NEVER Edit Auto-Generated Files

These files are managed by Lovable Cloud:

- `src/integrations/supabase/client.ts`
- `src/integrations/supabase/types.ts`
- `supabase/config.toml`
- `.env`

### 3. Use Path Aliases

```tsx
// ✅ CORRECT
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

// ❌ WRONG
import { Button } from '../../../components/ui/button';
```

### 4. Check Project Registry First

Platform config is in `src/projects/config.ts`:

```ts
import { projectRegistry } from '@/projects/config';

// Access platform data
const simcore = projectRegistry.simcore;
```

---

## File Locations

### Where to Find Things

| What                | Location                         |
| ------------------- | -------------------------------- |
| Page components     | `src/pages/`                     |
| Platform dashboards | `src/projects/pages/{platform}/` |
| Platform config     | `src/projects/config.ts`         |
| UI components       | `src/components/ui/`             |
| Shared components   | `src/components/shared/`         |
| Hooks               | `src/hooks/`                     |
| Stores              | `src/stores/`                    |
| Types               | `src/types/`                     |
| Design tokens       | `src/index.css`                  |
| Tailwind config     | `tailwind.config.ts`             |
| Edge functions      | `supabase/functions/{name}-api/` |
| Routes              | `src/App.tsx`                    |

### Key Files

| File                           | Purpose                 |
| ------------------------------ | ----------------------- |
| `src/App.tsx`                  | All routes defined here |
| `src/projects/config.ts`       | Platform registry       |
| `src/context/ThemeContext.tsx` | Theme provider          |
| `src/index.css`                | CSS variables/tokens    |

---

## Common Tasks

### Add a New Page

1. Create component in `src/pages/`:

```tsx
// src/pages/MyPage.tsx
import { SEO } from '@/components/shared/SEO';

export default function MyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <SEO title="My Page" description="Description" />
      <h1 className="text-4xl font-bold">My Page</h1>
    </div>
  );
}
```

2. Add route in `src/App.tsx`:

```tsx
import MyPage from './pages/MyPage';

<Route path="/my-page" element={<MyPage />} />;
```

### Add Feature to Platform Dashboard

1. Find dashboard: `src/projects/pages/{platform}/{Platform}Dashboard.tsx`
2. Add/modify components in `src/projects/pages/{platform}/components/`
3. If API needed, update `supabase/functions/{platform}-api/index.ts`

### Update Styling

1. Add tokens to `src/index.css`:

```css
:root {
  --my-color: 200 80% 50%;
}
```

2. Add to `tailwind.config.ts`:

```ts
colors: {
  'my-color': 'hsl(var(--my-color))',
}
```

3. Use in components:

```tsx
<div className="bg-my-color">
```

### Add Edge Function

1. Create `supabase/functions/{name}/index.ts`:

```ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data = await req.json();

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

2. Call from frontend:

```ts
import { supabase } from '@/integrations/supabase/client';

const { data, error } = await supabase.functions.invoke('my-function', {
  body: { key: 'value' },
});
```

---

## Code Patterns

### Data Fetching

```tsx
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

function useSimulations() {
  return useQuery({
    queryKey: ['simulations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('simcore_simulations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}
```

### State Management

```tsx
import { useAuthStore } from '@/stores/authStore';

function Component() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return <Dashboard user={user} />;
}
```

### Component Structure

```tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>{/* Content */}</CardContent>
      </Card>
    </motion.div>
  );
}
```

---

## What NOT to Do

### ❌ Don't Edit Auto-Generated Files

- `src/integrations/supabase/client.ts`
- `src/integrations/supabase/types.ts`
- `supabase/config.toml`
- `.env`

### ❌ Don't Use Raw Colors

```tsx
// Never do this
className = 'bg-purple-500 text-white bg-slate-900';
```

### ❌ Don't Use Deep Relative Imports

```tsx
// Never do this
import { Button } from '../../../components/ui/button';
```

### ❌ Don't Create Monorepo Structures

This is a single Vite app, not a monorepo. Don't create:

- `packages/` directories
- `design-system/` as separate package
- Workspace configurations

### ❌ Don't Modify package.json Directly

Use the dependency tools provided to add/remove packages.

---

## Debugging Tips

### Check Console Logs

Use the console log reading tools to check for errors.

### Check Network Requests

Use network request tools to verify API calls.

### Verify Database

Query the database directly to check data:

```sql
SELECT * FROM simcore_simulations LIMIT 10;
```

### Check Edge Function Logs

Use edge function log tools to debug serverless functions.

### Common Issues

| Issue               | Solution                  |
| ------------------- | ------------------------- |
| Module not found    | Check `@/` alias path     |
| Styling not applied | Use semantic tokens       |
| Auth not working    | Check authStore state     |
| Data not loading    | Check TanStack Query keys |
| Edge function error | Check CORS headers        |

---

## Database Tables

### Platform Tables

| Table                 | Platform   |
| --------------------- | ---------- |
| `simcore_simulations` | SimCore    |
| `mezan_workflows`     | MEZAN      |
| `talai_experiments`   | TalAI      |
| `optilibria_runs`     | OptiLibria |
| `qmlab_experiments`   | QMLab      |

### Shared Tables

| Table              | Purpose           |
| ------------------ | ----------------- |
| `projects`         | Platform metadata |
| `profiles`         | User profiles     |
| `project_features` | Feature flags     |

---

## Quick Reference

```
src/
├── pages/           → Add new pages here
├── projects/        → Platform dashboards
├── components/ui/   → Shadcn components
├── hooks/           → Custom hooks
├── stores/          → Zustand stores
└── index.css        → Design tokens

supabase/functions/  → Edge functions
```

**Always use:**

- `bg-background`, `text-foreground`
- `bg-primary`, `text-primary-foreground`
- `bg-card`, `border-border`
- Path alias `@/`

**Never edit:**

- `supabase/` client files
- `.env`
