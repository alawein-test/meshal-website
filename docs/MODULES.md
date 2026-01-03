# Modules Reference

> Last verified: 2025-12-09

Complete breakdown of all major modules in the Alawein Platform.

---

## Table of Contents

1. Pages Module
2. Projects Module
3. Studios Module
4. Components Module
5. Hooks Module
6. Stores Module
7. Context Module
8. Integrations Module

---

## Pages Module

**Location:** `src/pages/`

Core page components that render at specific routes.

| File                    | Route                 | Purpose                                                       |
| ----------------------- | --------------------- | ------------------------------------------------------------- |
| `Landing.tsx`           | `/`                   | Main landing page with hero, about, skills, projects, contact |
| `Portfolio.tsx`         | `/portfolio`          | Cyberpunk-themed portfolio showcase                           |
| `Auth.tsx`              | `/auth`               | Authentication (login/signup)                                 |
| `Profile.tsx`           | `/profile`            | User profile management                                       |
| `Settings.tsx`          | `/settings`           | User settings                                                 |
| `Resume.tsx`            | `/resume`             | Static resume page                                            |
| `InteractiveResume.tsx` | `/interactive-resume` | Interactive resume with animations                            |
| `DesignSystem.tsx`      | `/design-system`      | Design token reference                                        |
| `Pricing.tsx`           | `/pricing`            | Pricing plans                                                 |
| `Install.tsx`           | `/install`            | PWA installation guide                                        |
| `NotFound.tsx`          | `*`                   | 404 error page                                                |

### Services Sub-module

**Location:** `src/pages/services/`

| File                      | Route                            | Purpose                |
| ------------------------- | -------------------------------- | ---------------------- |
| `ServicesHub.tsx`         | `/services`                      | Services overview hub  |
| `AccessibilityAudit.tsx`  | `/services/accessibility-audit`  | A11y audit service     |
| `DesignSystemReview.tsx`  | `/services/design-system-review` | Design review service  |
| `HeuristicEvaluation.tsx` | `/services/heuristic-evaluation` | UX evaluation service  |
| `PerformanceTesting.tsx`  | `/services/performance-testing`  | Performance service    |
| `SecurityAssessment.tsx`  | `/services/security-assessment`  | Security audit service |
| `UserFlowAnalysis.tsx`    | `/services/user-flow-analysis`   | UX flow analysis       |

---

## Projects Module

**Location:** `src/projects/`

Platform dashboard system with registry-based configuration.

### Structure

```
src/projects/
├── config.ts          # Platform registry (central configuration)
├── types.ts           # TypeScript interfaces
├── index.ts           # Module exports
├── components/        # Shared project components
│   ├── ProjectCard.tsx
│   └── ProjectLayout.tsx
└── pages/             # Individual platform dashboards
    ├── ProjectsHub.tsx
    ├── simcore/
    ├── mezan/
    ├── talai/
    ├── optilibria/
    └── qmlab/
```

### Platform Registry

The `config.ts` file defines all platforms:

```typescript
export const projectRegistry = {
  simcore: {
    id: 'simcore',
    name: 'SimCore',
    slug: 'simcore',
    tagline: 'Scientific Computing Engine',
    category: 'scientific-computing',
    status: 'active',
    theme: { primary: 'cyan', accent: 'blue' },
  },
  // ... other platforms
};
```

### Platform Dashboards

| Platform   | Route                  | Database Table        | Edge Function    |
| ---------- | ---------------------- | --------------------- | ---------------- |
| SimCore    | `/projects/simcore`    | `simcore_simulations` | `simcore-api`    |
| MEZAN      | `/projects/mezan`      | `mezan_workflows`     | `mezan-api`      |
| TalAI      | `/projects/talai`      | `talai_experiments`   | `talai-api`      |
| OptiLibria | `/projects/optilibria` | `optilibria_runs`     | `optilibria-api` |
| QMLab      | `/projects/qmlab`      | `qmlab_experiments`   | `qmlab-api`      |

### Adding a New Platform

1. Add entry to `src/projects/config.ts`
2. Create dashboard: `src/projects/pages/{name}/{Name}Dashboard.tsx`
3. Create edge function: `supabase/functions/{name}-api/index.ts`
4. Add database migration for platform table
5. Add route to `src/App.tsx`

---

## Studios Module

**Location:** `src/studios/`

Template and platform browsing system.

### Structure

```
src/studios/
├── StudioSelector.tsx     # Main studios hub
├── templates/
│   ├── TemplatesHub.tsx   # Template browser
│   ├── components/
│   │   ├── TemplateCard.tsx
│   │   └── TemplatePreview.tsx
│   └── previews/          # Individual template previews
└── platforms/
    └── PlatformsHub.tsx   # Platform browser
```

### Template System

Templates are defined with metadata:

```typescript
interface Template {
  id: string;
  name: string;
  category: 'dashboard' | 'landing' | 'ecommerce' | 'admin';
  preview: React.ComponentType;
  features: string[];
}
```

---

## Components Module

**Location:** `src/components/`

### UI Components (Shadcn)

**Location:** `src/components/ui/`

Base Shadcn components with custom variants:

| Component            | Customizations                              |
| -------------------- | ------------------------------------------- |
| `button.tsx`         | Custom variants: `quantum`, `neon`, `ghost` |
| `card.tsx`           | Glass morphism support                      |
| `badge.tsx`          | Status variants                             |
| `neon-card.tsx`      | Custom neon glow card                       |
| `skill-badge.tsx`    | Skill display badge                         |
| `section-header.tsx` | Consistent section headers                  |
| `kbd.tsx`            | Keyboard shortcut display                   |
| `brand-cta.tsx`      | Brand call-to-action                        |

### Shared Components

**Location:** `src/components/shared/`

| Component               | Purpose                        |
| ----------------------- | ------------------------------ |
| `AuthProvider.tsx`      | Authentication context wrapper |
| `ProtectedRoute.tsx`    | Route guard for auth           |
| `HubHeader.tsx`         | Consistent hub page headers    |
| `PublicHeader.tsx`      | Public navigation header       |
| `PageLayout.tsx`        | Standard page layout wrapper   |
| `CyberpunkLayout.tsx`   | Cyberpunk-themed layout        |
| `QuantumBackground.tsx` | Animated background            |
| `SEO.tsx`               | SEO meta tags                  |
| `JsonLd.tsx`            | Structured data                |
| `LoadingSpinner.tsx`    | Loading indicator              |
| `LoadingSkeleton.tsx`   | Skeleton loader                |
| `ErrorBoundary.tsx`     | Error boundary wrapper         |
| `PreloadLink.tsx`       | Route preloading               |

### Feature Components

**Location:** `src/components/`

| Component             | Purpose               |
| --------------------- | --------------------- |
| `HeroSection.tsx`     | Landing hero          |
| `AboutSection.tsx`    | About section         |
| `SkillsSection.tsx`   | Skills display        |
| `ProjectsSection.tsx` | Projects showcase     |
| `ContactSection.tsx`  | Contact form          |
| `Navigation.tsx`      | Main navigation       |
| `Footer.tsx`          | Site footer           |
| `CommandPalette.tsx`  | Cmd+K command palette |
| `ThemeSwitcher.tsx`   | Theme toggle          |
| `MatrixRain.tsx`      | Matrix animation      |
| `CyberpunkCity.tsx`   | 3D city scene         |
| `GlitchText.tsx`      | Glitch text effect    |

### Chart Components

**Location:** `src/components/charts/`

| Component                 | Purpose              |
| ------------------------- | -------------------- |
| `AggregateStatsChart.tsx` | Dashboard statistics |

### Resume Components

**Location:** `src/components/resume/`

| Component                  | Purpose                  |
| -------------------------- | ------------------------ |
| `Timeline.tsx`             | Career timeline          |
| `InteractiveTimeline.tsx`  | Animated timeline        |
| `SkillsRadarChart.tsx`     | Radar chart for skills   |
| `SkillsVisualization.tsx`  | Skills visual display    |
| `TestimonialsCarousel.tsx` | Testimonials slider      |
| `ResumeExport.tsx`         | PDF export functionality |

### Dashboard Components

**Location:** `src/components/dashboard/`

| Component             | Purpose               |
| --------------------- | --------------------- |
| `DashboardHeader.tsx` | Dashboard page header |
| `StatsGrid.tsx`       | Statistics grid       |
| `StatCard.tsx`        | Individual stat card  |
| `EmptyState.tsx`      | Empty state display   |
| `LoadingState.tsx`    | Loading state display |

---

## Hooks Module

**Location:** `src/hooks/`

Custom React hooks for reusable logic.

| Hook                        | Purpose                          |
| --------------------------- | -------------------------------- |
| `useAuth.ts`                | Authentication state and methods |
| `useSimulations.ts`         | SimCore simulation data          |
| `useWorkflows.ts`           | MEZAN workflow data              |
| `useExperiments.ts`         | TalAI experiment data            |
| `useOptimizationRuns.ts`    | OptiLibria run data              |
| `useRealtimeSimulations.ts` | Real-time simulation updates     |
| `useLocalStorage.ts`        | Local storage persistence        |
| `useMediaQuery.ts`          | Responsive breakpoints           |
| `useReducedMotion.ts`       | Accessibility motion preference  |
| `useKeyboardShortcuts.ts`   | Keyboard shortcut handling       |
| `useFocusTrap.ts`           | Focus trap for modals            |
| `useArrowNavigation.ts`     | Arrow key navigation             |
| `useSessionLogger.ts`       | Session activity logging         |
| `use-mobile.tsx`            | Mobile detection                 |
| `use-toast.ts`              | Toast notifications              |

### Hook Patterns

```typescript
// Data fetching hook pattern
export const useSimulations = () => {
  return useQuery({
    queryKey: ['simulations'],
    queryFn: fetchSimulations,
  });
};

// State hook pattern
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });
  // ...
};
```

---

## Stores Module

**Location:** `src/stores/`

Zustand state management stores.

| Store                  | Purpose              | Key State                            |
| ---------------------- | -------------------- | ------------------------------------ |
| `authStore.ts`         | Authentication state | `user`, `session`, `isAuthenticated` |
| `notificationStore.ts` | Notification queue   | `notifications`, `add`, `remove`     |
| `sessionLogStore.ts`   | Session activity log | `logs`, `addLog`                     |
| `guestStore.ts`        | Guest user state     | `guestId`, `preferences`             |

### Store Pattern

```typescript
// Zustand store pattern
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

---

## Context Module

**Location:** `src/context/`

React Context providers.

| Context            | Purpose                                     |
| ------------------ | ------------------------------------------- |
| `ThemeContext.tsx` | Theme management (light/dark/quantum/glass) |

### Theme Context Usage

```typescript
import { useTheme } from '@/context/ThemeContext';

const Component = () => {
  const { theme, setTheme } = useTheme();
  return <button onClick={() => setTheme('dark')}>Dark Mode</button>;
};
```

---

## Integrations Module

**Location:** `src/integrations/`

External service integrations.

### Supabase Integration

**Location:** `src/integrations/supabase/`

| File        | Purpose                                    |
| ----------- | ------------------------------------------ |
| `client.ts` | Supabase client instance (auto-generated)  |
| `types.ts`  | Database type definitions (auto-generated) |

**Important:** These files are auto-generated. Never edit directly.

```typescript
// Usage
import { supabase } from '@/integrations/supabase/client';

const { data, error } = await supabase.from('simcore_simulations').select('*');
```

---

## Design Patterns

### Component Composition

```typescript
// Compound component pattern
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Feature-Based Organization

```
feature/
├── components/     # Feature-specific components
├── hooks/          # Feature-specific hooks
├── types.ts        # Feature types
└── index.ts        # Public exports
```

### Index Exports

Every module uses barrel exports:

```typescript
// src/components/shared/index.ts
export { AuthProvider } from './AuthProvider';
export { ProtectedRoute } from './ProtectedRoute';
export { HubHeader } from './HubHeader';
// ...
```

---

## Module Dependencies

```
┌─────────────────────────────────────────────────────────────┐
│                         Pages                                │
├─────────────────────────────────────────────────────────────┤
│  Projects  │  Studios  │  Services  │  Auth  │  Portfolio   │
├─────────────────────────────────────────────────────────────┤
│                      Components                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │   UI    │  │ Shared  │  │ Charts  │  │ Resume  │        │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘        │
├─────────────────────────────────────────────────────────────┤
│                    Hooks & Stores                            │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │     Hooks       │  │     Stores      │                   │
│  └─────────────────┘  └─────────────────┘                   │
├─────────────────────────────────────────────────────────────┤
│                    Context & Types                           │
├─────────────────────────────────────────────────────────────┤
│                    Integrations                              │
│  ┌─────────────────────────────────────┐                    │
│  │           Supabase Client           │                    │
│  └─────────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
```
