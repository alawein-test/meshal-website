# Quick Start Guide

> Last verified: 2025-12-09

Get up and running in 5 minutes.

---

## 1. Installation (1 min)

```bash
npm install
npm run dev
```

Visit: **http://localhost:8081**

---

## 2. Project Structure (1 min)

```
src/
├── pages/           → Page components (Landing, Portfolio, Auth, etc.)
├── projects/        → Platform dashboards (SimCore, MEZAN, TalAI, etc.)
├── components/ui/   → Shadcn UI components
├── components/shared/ → Reusable components
├── hooks/           → Custom React hooks
├── stores/          → Zustand state stores
└── index.css        → Design tokens
```

---

## 3. Key Routes

| Route               | Description                    |
| ------------------- | ------------------------------ |
| `/`                 | Landing page                   |
| `/portfolio`        | Portfolio with cyberpunk theme |
| `/projects`         | Projects hub                   |
| `/projects/simcore` | SimCore dashboard              |
| `/projects/mezan`   | MEZAN dashboard                |
| `/auth`             | Login/signup                   |

---

## 4. Adding a New Page (2 min)

### Step 1: Create the page component

```tsx
// src/pages/MyPage.tsx
import { SEO } from '@/components/shared/SEO';

export default function MyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <SEO title="My Page" description="My new page" />
      <h1 className="text-4xl font-bold text-primary">My Page</h1>
    </div>
  );
}
```

### Step 2: Add route in App.tsx

```tsx
// src/App.tsx
import MyPage from './pages/MyPage';

// Inside Routes:
<Route path="/my-page" element={<MyPage />} />;
```

---

## 5. Adding a New Platform Dashboard (3 min)

### Step 1: Add to config

```tsx
// src/projects/config.ts
export const projectRegistry = {
  // ...existing
  myplatform: {
    id: 'myplatform',
    name: 'My Platform',
    slug: 'myplatform',
    tagline: 'Description here',
    category: 'scientific-computing',
    status: 'development',
    theme: { primary: 'hsl(200 80% 50%)', secondary: 'hsl(220 60% 30%)' },
  },
};
```

### Step 2: Create dashboard

```tsx
// src/projects/pages/myplatform/MyPlatformDashboard.tsx
import { ProjectLayout } from '@/projects/components/ProjectLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function MyPlatformDashboard() {
  return (
    <ProjectLayout projectId="myplatform">
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">My Platform</h1>
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Your content here</p>
          </CardContent>
        </Card>
      </div>
    </ProjectLayout>
  );
}
```

### Step 3: Add route

```tsx
// src/App.tsx
import MyPlatformDashboard from './projects/pages/myplatform/MyPlatformDashboard';

<Route path="/projects/myplatform" element={<MyPlatformDashboard />} />;
```

### Step 4: Create edge function (optional)

```ts
// supabase/functions/myplatform-api/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  return new Response(JSON.stringify({ status: 'ok' }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

---

## 6. Styling Rules

```tsx
// ✅ Always use semantic tokens
<div className="bg-background text-foreground">
<div className="bg-primary text-primary-foreground">
<div className="bg-card border-border">

// ❌ Never use raw colors
<div className="bg-purple-500 text-white">
```

---

## 7. Common Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests
npm run lint         # Run ESLint
npm run format       # Run Prettier
```

---

## 8. Helpful Resources

| Resource        | Location                 |
| --------------- | ------------------------ |
| Design tokens   | `src/index.css`          |
| Tailwind config | `tailwind.config.ts`     |
| Project config  | `src/projects/config.ts` |
| UI components   | `src/components/ui/`     |
| Edge functions  | `supabase/functions/`    |

---

## Next Steps

- Read [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed patterns
- Check [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for styling guidelines
- Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system overview
