# Project Structure

> Last verified: 2025-12-09

## Directory Overview

```
alawein-platform/
├── docs/                           # Documentation
│   ├── README.md                   # Documentation index
│   ├── QUICK_START.md              # 5-minute setup guide
│   ├── ARCHITECTURE.md             # System architecture
│   ├── STRUCTURE.md                # This file
│   ├── DESIGN_SYSTEM.md            # Design tokens & components
│   ├── DEVELOPMENT.md              # Development guide
│   └── deployment/                 # Deployment docs
│
├── public/                         # Static assets
│   ├── ninja-favicon.svg
│   ├── pwa-192x192.png
│   ├── pwa-512x512.png
│   ├── robots.txt
│   └── sitemap.xml
│
├── src/
│   ├── App.tsx                     # Main app with all routes
│   ├── main.tsx                    # Entry point
│   ├── index.css                   # Global CSS & design tokens
│   │
│   ├── pages/                      # Page components
│   │   ├── Landing.tsx             # / route
│   │   ├── Portfolio.tsx           # /portfolio route (cyberpunk)
│   │   ├── Resume.tsx              # /resume route
│   │   ├── InteractiveResume.tsx   # /interactive-resume route
│   │   ├── Auth.tsx                # /auth route
│   │   ├── Profile.tsx             # /profile route
│   │   ├── Settings.tsx            # /settings route
│   │   ├── DesignSystem.tsx        # /design-system route
│   │   ├── IconAssets.tsx          # /icon-assets route
│   │   ├── StickerPack.tsx         # /stickers route
│   │   ├── BrandConsistency.tsx    # /brand route
│   │   ├── ComponentDocs.tsx       # /docs/components route
│   │   ├── Install.tsx             # /install route (PWA)
│   │   ├── PlatformPreview.tsx     # /preview/:platformId route
│   │   ├── ProjectDetail.tsx       # /project/:projectId route
│   │   └── NotFound.tsx            # 404 page
│   │
│   ├── projects/                   # Platform dashboards module
│   │   ├── index.ts                # Barrel export
│   │   ├── types.ts                # Platform type definitions
│   │   ├── config.ts               # Platform registry
│   │   ├── components/
│   │   │   ├── index.ts
│   │   │   ├── ProjectCard.tsx
│   │   │   └── ProjectLayout.tsx
│   │   └── pages/
│   │       ├── index.ts
│   │       ├── ProjectsHub.tsx     # /projects route
│   │       ├── simcore/
│   │       │   ├── SimCoreDashboard.tsx
│   │       │   └── components/
│   │       ├── mezan/
│   │       │   ├── MEZANDashboard.tsx
│   │       │   └── components/
│   │       ├── talai/
│   │       │   ├── TalAIDashboard.tsx
│   │       │   └── components/
│   │       ├── optilibria/
│   │       │   ├── OptiLibriaDashboard.tsx
│   │       │   └── components/
│   │       └── qmlab/
│   │           ├── QMLabDashboard.tsx
│   │           └── components/
│   │
│   ├── studios/                    # Studios hub
│   │   ├── StudioSelector.tsx      # /studios route
│   │   ├── templates/
│   │   │   ├── TemplatesHub.tsx    # /studio/templates route
│   │   │   ├── components/
│   │   │   └── previews/
│   │   └── platforms/
│   │       └── PlatformsHub.tsx    # /platforms route
│   │
│   ├── components/
│   │   ├── ui/                     # Shadcn UI components (40+)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── toast.tsx
│   │   │   └── [...]
│   │   │
│   │   ├── shared/                 # Shared components
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── PublicHeader.tsx
│   │   │   ├── SEO.tsx
│   │   │   ├── JsonLd.tsx
│   │   │   └── [...]
│   │   │
│   │   ├── auth/                   # Auth components
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignUpForm.tsx
│   │   │
│   │   ├── charts/                 # Chart components
│   │   │   └── AggregateStatsChart.tsx
│   │   │
│   │   ├── dashboard/              # Dashboard components
│   │   │   ├── DashboardHeader.tsx
│   │   │   ├── StatCard.tsx
│   │   │   └── StatsGrid.tsx
│   │   │
│   │   ├── icons/                  # Icon components
│   │   │   ├── AnimatedNinja.tsx
│   │   │   └── NinjaIcon.tsx
│   │   │
│   │   ├── portfolio/              # Portfolio components
│   │   │   └── ProjectShowcase.tsx
│   │   │
│   │   ├── resume/                 # Resume components
│   │   │   ├── Timeline.tsx
│   │   │   ├── SkillsVisualization.tsx
│   │   │   └── TestimonialsCarousel.tsx
│   │   │
│   │   └── [other components]      # Misc components
│   │       ├── Navigation.tsx
│   │       ├── HeroSection.tsx
│   │       ├── Footer.tsx
│   │       ├── GlitchText.tsx
│   │       ├── MatrixRain.tsx
│   │       └── [...]
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── index.ts
│   │   ├── useAuth.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useReducedMotion.ts
│   │   ├── useKeyboardShortcuts.ts
│   │   ├── useSimulations.ts
│   │   ├── useWorkflows.ts
│   │   └── use-mobile.tsx
│   │
│   ├── stores/                     # Zustand state stores
│   │   ├── index.ts
│   │   ├── authStore.ts
│   │   ├── guestStore.ts
│   │   └── notificationStore.ts
│   │
│   ├── context/                    # React Context
│   │   └── ThemeContext.tsx
│   │
│   ├── integrations/               # External services
│   │   └── supabase/
│   │       ├── client.ts           # ⚠️ AUTO-GENERATED
│   │       └── types.ts            # ⚠️ AUTO-GENERATED
│   │
│   ├── types/                      # TypeScript types
│   │   ├── index.ts
│   │   ├── auth.types.ts
│   │   ├── theme.types.ts
│   │   └── user.types.ts
│   │
│   ├── utils/                      # Utility functions
│   │   ├── dataExport.ts
│   │   └── timing.ts
│   │
│   └── lib/                        # Library utilities
│       └── utils.ts                # cn() helper
│
├── supabase/                       # Backend configuration
│   ├── config.toml                 # ⚠️ AUTO-MANAGED
│   └── functions/                  # Edge functions
│       ├── simcore-api/index.ts
│       ├── mezan-api/index.ts
│       ├── talai-api/index.ts
│       ├── optilibria-api/index.ts
│       └── qmlab-api/index.ts
│
├── scripts/                        # Automation scripts
│   ├── validate-structure.js
│   ├── validate-docs.js
│   └── check-imports.js
│
├── tests/                          # Test suites
│   ├── e2e/                        # Playwright E2E tests
│   │   ├── accessibility/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── navigation/
│   │   └── [...]
│   ├── fixtures/
│   └── utils/
│
├── templates/                      # Template library
│   ├── config.json
│   └── README.md
│
├── .github/workflows/              # CI/CD
│   └── playwright.yml
│
├── .husky/                         # Git hooks
│   ├── pre-commit
│   └── commit-msg
│
├── CLAUDE.md                       # AI assistant context
├── README.md                       # Project overview
├── REPOSITORY_GOVERNANCE.md        # Governance rules
├── tailwind.config.ts              # Tailwind configuration
├── vite.config.ts                  # Vite configuration
└── package.json                    # Dependencies
```

---

## Key Files

### Entry Points

| File           | Purpose                 |
| -------------- | ----------------------- |
| `src/main.tsx` | React entry point       |
| `src/App.tsx`  | All routes defined here |

### Configuration

| File                           | Purpose                       |
| ------------------------------ | ----------------------------- |
| `src/projects/config.ts`       | Platform registry             |
| `src/projects/types.ts`        | Platform interfaces           |
| `src/context/ThemeContext.tsx` | Theme provider                |
| `tailwind.config.ts`           | Tailwind theme                |
| `src/index.css`                | Design tokens (CSS variables) |

### Auto-Generated (DO NOT EDIT)

| File                                  | Managed By    |
| ------------------------------------- | ------------- |
| `src/integrations/supabase/client.ts` | Lovable Cloud |
| `src/integrations/supabase/types.ts`  | Lovable Cloud |
| `supabase/config.toml`                | Lovable Cloud |
| `.env`                                | Lovable Cloud |

---

## Module Organization

### Projects Module (`src/projects/`)

Self-contained module for all platform dashboards:

- `config.ts` - Platform metadata and registry
- `types.ts` - TypeScript interfaces
- `components/` - Shared project components
- `pages/` - Individual dashboard pages

### Studios Module (`src/studios/`)

Template and platform browsing:

- `StudioSelector.tsx` - Main hub
- `templates/` - Template browser
- `platforms/` - Platform browser

### Components (`src/components/`)

UI component library:

- `ui/` - Shadcn components
- `shared/` - Reusable patterns
- Domain-specific folders (auth, charts, etc.)

---

## Naming Conventions

| Type       | Convention                    | Example           |
| ---------- | ----------------------------- | ----------------- |
| Components | PascalCase                    | `UserProfile.tsx` |
| Hooks      | camelCase with `use` prefix   | `useAuth.ts`      |
| Stores     | camelCase with `Store` suffix | `authStore.ts`    |
| Types      | camelCase with `.types.ts`    | `auth.types.ts`   |
| Utils      | camelCase                     | `dataExport.ts`   |
