# Alawein Platform - Top 20 Codemaps

> **Generated**: December 10, 2024 **Purpose**: Comprehensive architectural
> documentation for audit and enhancement

---

## Table of Contents

1. Application Architecture
2. Routing System
3. State Management
4. Authentication Flow
5. Theme System
6. Component Library
7. Platform Dashboards
8. Hooks Architecture
9. Supabase Integration
10. Edge Functions
11. Design System Tokens
12. Notification System
13. Real-time Subscriptions
14. Testing Infrastructure
15. Studios & Templates
16. Services Architecture
17. Accessibility Features
18. Performance Optimizations
19. Error Handling
20. Security Architecture

---

## 1. Application Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         App.tsx (Root)                               │
├─────────────────────────────────────────────────────────────────────┤
│  HelmetProvider                                                      │
│  └── QueryClientProvider (TanStack Query)                           │
│      └── ThemeProvider (7 themes)                                   │
│          └── TooltipProvider                                        │
│              └── BrowserRouter                                      │
│                  └── AppErrorBoundary                               │
│                      ├── SkipToMain (a11y)                          │
│                      ├── RouteProgressBar                           │
│                      ├── RouteAnnouncer (a11y)                      │
│                      ├── AnimatePresence                            │
│                      │   └── AppRoutes (Suspense)                   │
│                      ├── CommandPalette (Cmd+K)                     │
│                      ├── KeyboardShortcutsHelp                      │
│                      ├── OnboardingTour                             │
│                      ├── NewUserOnboarding                          │
│                      ├── AIConsentModal                             │
│                      └── Toaster                                    │
└─────────────────────────────────────────────────────────────────────┘
```

**Key Files:**

- `src/App.tsx` - Main application entry (616 lines)
- `src/main.tsx` - React DOM render
- `src/context/ThemeContext.tsx` - Theme provider

**Dependencies:**

- React 18.3.1
- TanStack Query 5.83.0
- React Router DOM 6.30.1
- Framer Motion 12.23.25
- Zustand 5.0.9

---

## 2. Routing System

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Route Categories                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  PUBLIC ROUTES (Eagerly Loaded)                                     │
│  ├── /                    → Landing                                 │
│  └── /*                   → NotFound                                │
│                                                                      │
│  PUBLIC ROUTES (Lazy Loaded)                                        │
│  ├── /portfolio           → Portfolio                               │
│  ├── /resume              → Resume                                  │
│  ├── /interactive-resume  → InteractiveResume                       │
│  ├── /studios             → StudioSelector                          │
│  ├── /platforms           → PlatformsHub                            │
│  ├── /projects            → ProjectsHub                             │
│  ├── /project/:projectId  → ProjectDetail                           │
│  ├── /preview/:platformId → PlatformPreview                         │
│  ├── /design-system       → DesignSystem                            │
│  ├── /pricing             → Pricing                                 │
│  ├── /book                → Book                                    │
│  └── /install             → Install (PWA)                           │
│                                                                      │
│  PLATFORM DASHBOARDS                                                │
│  ├── /projects/simcore    → SimCoreDashboard                        │
│  ├── /projects/mezan      → MEZANDashboard                          │
│  ├── /projects/talai      → TalAIDashboard                          │
│  ├── /projects/optilibria → OptiLibriaDashboard                     │
│  ├── /projects/qmlab      → QMLabDashboard                          │
│  ├── /projects/repz       → REPZShowcase                            │
│  ├── /projects/liveiticonic → LiveItIconicShowcase                  │
│  ├── /projects/attributa  → AttributaShowcase                       │
│  └── /projects/llmworks   → LLMWorksShowcase                        │
│                                                                      │
│  SERVICES                                                           │
│  ├── /services            → ServicesHub                             │
│  ├── /services/heuristic  → HeuristicEvaluation                     │
│  ├── /services/accessibility → AccessibilityAudit                   │
│  ├── /services/user-flow  → UserFlowAnalysis                        │
│  ├── /services/design-review → DesignSystemReview                   │
│  ├── /services/performance → PerformanceTesting                     │
│  └── /services/security   → SecurityAssessment                      │
│                                                                      │
│  AUTH & USER                                                        │
│  ├── /auth                → Auth                                    │
│  ├── /profile             → Profile                                 │
│  └── /settings            → Settings                                │
│                                                                      │
│  ADMIN                                                              │
│  ├── /admin               → AdminDashboard                          │
│  └── /admin/waitlist      → WaitlistManagement                      │
│                                                                      │
│  LEGAL & INFO                                                       │
│  ├── /transparency        → TransparencyReport                      │
│  ├── /terms               → Terms                                   │
│  ├── /privacy             → Privacy                                 │
│  └── /changelog           → Changelog                               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Route Count:** 45+ routes **Lazy Loading:** All non-critical routes use
`React.lazy()`

---

## 3. State Management

```
┌─────────────────────────────────────────────────────────────────────┐
│                     State Management Architecture                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ZUSTAND STORES (src/stores/)                                       │
│  ├── authStore.ts                                                   │
│  │   ├── user: User | null                                          │
│  │   ├── session: Session | null                                    │
│  │   ├── isLoading: boolean                                         │
│  │   ├── isAuthenticated: boolean                                   │
│  │   └── Actions: setUser, setSession, setLoading, logout           │
│  │                                                                   │
│  ├── notificationStore.ts                                           │
│  │   ├── notifications: Notification[]                              │
│  │   ├── unreadCount: number                                        │
│  │   ├── isLoading: boolean                                         │
│  │   └── Actions: add, markAsRead, markAllAsRead, remove, clearAll  │
│  │                                                                   │
│  ├── guestStore.ts                                                  │
│  │   ├── isGuestMode: boolean                                       │
│  │   └── guestPreferences: object                                   │
│  │                                                                   │
│  └── aiConsentStore.ts                                              │
│      ├── consentLevel: AIConsentLevel                               │
│      └── hasConsented: boolean                                      │
│                                                                      │
│  TANSTACK QUERY (Server State)                                      │
│  ├── Simulations                                                    │
│  ├── Experiments (QM, TalAI)                                        │
│  ├── Workflows (MEZAN)                                              │
│  ├── Optimization Runs (OptiLibria)                                 │
│  └── Real-time subscriptions                                        │
│                                                                      │
│  REACT CONTEXT                                                      │
│  └── ThemeContext                                                   │
│      ├── theme: ThemeName                                           │
│      ├── setTheme: (theme) => void                                  │
│      └── themeObject: ThemeDefinition                               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Persistence:**

- Auth store persists `user` to localStorage
- Theme persists to localStorage (`alawein-theme`)

---

## 4. Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Authentication Flow                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────┐    ┌──────────────┐    ┌─────────────────┐            │
│  │  User    │───▶│  Auth Page   │───▶│  Supabase Auth  │            │
│  └──────────┘    └──────────────┘    └─────────────────┘            │
│                         │                     │                      │
│                         ▼                     ▼                      │
│                  ┌──────────────┐    ┌─────────────────┐            │
│                  │  useAuth()   │◀───│  Session Token  │            │
│                  └──────────────┘    └─────────────────┘            │
│                         │                                            │
│                         ▼                                            │
│                  ┌──────────────┐                                    │
│                  │  authStore   │                                    │
│                  │  (Zustand)   │                                    │
│                  └──────────────┘                                    │
│                         │                                            │
│          ┌──────────────┼──────────────┐                            │
│          ▼              ▼              ▼                             │
│    ┌──────────┐  ┌──────────┐  ┌──────────────┐                     │
│    │ Profile  │  │ Settings │  │ Protected    │                     │
│    │  Page    │  │   Page   │  │   Routes     │                     │
│    └──────────┘  └──────────┘  └──────────────┘                     │
│                                                                      │
│  FEATURES:                                                          │
│  ├── Email/Password authentication                                  │
│  ├── Session persistence (localStorage)                             │
│  ├── Auto token refresh                                             │
│  ├── Guest mode support                                             │
│  └── RLS-protected data access                                      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Key Files:**

- `src/hooks/useAuth.ts` (8945 bytes)
- `src/stores/authStore.ts` (2657 bytes)
- `src/pages/Auth.tsx` (3694 bytes)

---

## 5. Theme System

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Theme Architecture                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  AVAILABLE THEMES (7)                                               │
│  ├── quantum      │ Physics-inspired quantum spectrum (default)     │
│  ├── glassmorphism│ Modern glass-like design                        │
│  ├── dark         │ Classic dark mode                               │
│  ├── light        │ Clean light mode                                │
│  ├── cyberpunk    │ Neon-lit futuristic                             │
│  ├── pastel       │ Soft pastel colors                              │
│  └── midnight     │ Deep midnight blue                              │
│                                                                      │
│  DESIGN TOKENS (src/index.css)                                      │
│  ├── Quantum Spectrum                                               │
│  │   ├── --quantum-purple: 280 100% 60%                             │
│  │   ├── --plasma-pink: 300 100% 60%                                │
│  │   └── --electron-cyan: 180 100% 50%                              │
│  │                                                                   │
│  ├── Void Colors (Backgrounds)                                      │
│  │   ├── --void-start: 240 40% 10%                                  │
│  │   ├── --void-mid: 245 45% 17%                                    │
│  │   └── --void-end: 260 50% 20%                                    │
│  │                                                                   │
│  ├── Surface Colors                                                 │
│  │   ├── --surface-card: 0 0% 100% / 0.02                           │
│  │   ├── --surface-border: 0 0% 100% / 0.08                         │
│  │   └── --surface-glass: 0 0% 100% / 0.03                          │
│  │                                                                   │
│  └── Status Colors                                                  │
│      ├── --success: 160 84% 39%                                     │
│      ├── --warning: 38 92% 50%                                      │
│      ├── --error: 0 84% 60%                                         │
│      └── --info: 193 85% 62%                                        │
│                                                                      │
│  ADDITIONAL DESIGN SYSTEMS                                          │
│  ├── Vaporwave (pink, blue, purple, teal, orange)                   │
│  ├── Swiss/Minimalist (red, black, white, accent)                   │
│  ├── Cyberpunk Enhanced (neon, pink, yellow, dark)                  │
│  ├── Jules Electric Neon                                            │
│  ├── Soft Pastel                                                    │
│  └── Neumorphism                                                    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Implementation:**

- CSS custom properties with HSL values
- `data-theme` attribute on `<html>`
- `useTheme()` hook for programmatic access
- `useThemeColors()` for chart/dashboard colors

---

## 6. Component Library

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Component Architecture                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  UI COMPONENTS (src/components/ui/) - 55 components                 │
│  ├── Layout                                                         │
│  │   ├── accordion, card, carousel, collapsible                     │
│  │   ├── dialog, drawer, sheet, sidebar                             │
│  │   ├── resizable, scroll-area, separator                          │
│  │   └── tabs, aspect-ratio                                         │
│  │                                                                   │
│  ├── Forms                                                          │
│  │   ├── button, input, textarea, checkbox                          │
│  │   ├── radio-group, select, slider, switch                        │
│  │   ├── form, label, input-otp                                     │
│  │   └── calendar, command                                          │
│  │                                                                   │
│  ├── Feedback                                                       │
│  │   ├── alert, alert-dialog, toast, toaster                        │
│  │   ├── progress, skeleton, sonner                                 │
│  │   └── tooltip, hover-card, popover                               │
│  │                                                                   │
│  ├── Navigation                                                     │
│  │   ├── breadcrumb, navigation-menu, menubar                       │
│  │   ├── dropdown-menu, context-menu                                │
│  │   ├── pagination, toggle, toggle-group                           │
│  │   └── kbd (keyboard shortcuts)                                   │
│  │                                                                   │
│  ├── Data Display                                                   │
│  │   ├── avatar, badge, table, chart                                │
│  │   └── skill-badge, section-header                                │
│  │                                                                   │
│  └── Custom                                                         │
│      ├── neon-card, brand-cta                                       │
│      └── use-toast (hook)                                           │
│                                                                      │
│  SHARED COMPONENTS (src/components/shared/) - 26 components         │
│  ├── Layout: PageLayout, CyberpunkLayout, HubHeader                 │
│  ├── Navigation: PublicHeader, UnifiedHeader, UnifiedFooter         │
│  ├── Branding: BrandLogo, HeaderLogo, MALogo                        │
│  ├── Loading: LoadingSkeleton, LoadingSpinner                       │
│  ├── Error: ErrorBoundary, AppErrorBoundary, FeatureErrorBoundary   │
│  ├── SEO: SEO, JsonLd                                               │
│  ├── A11y: SkipToMain, RouteAnnouncer, RouteProgressBar             │
│  ├── Auth: AuthProvider, ProtectedRoute                             │
│  ├── Effects: QuantumBackground                                     │
│  ├── Utils: ExportMenu, PreloadLink                                 │
│  └── Modals: AIConsentModal                                         │
│                                                                      │
│  FEATURE COMPONENTS (src/components/)                               │
│  ├── Portfolio: HeroNinjas, CyberpunkScreen, PixelNinja             │
│  ├── Effects: MatrixRain, GlitchText, SmokeEffect, CRTOverlay       │
│  ├── Sections: HeroSection, AboutSection, ContactSection            │
│  ├── Dashboard: charts/, dashboard/ (7 items)                       │
│  ├── Resume: resume/ (7 items)                                      │
│  └── Admin: admin/, notifications/, onboarding/                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Total Components:** 144+ in src/components/

---

## 7. Platform Dashboards

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Platform Dashboard Architecture                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  PROJECT REGISTRY (src/projects/config.ts)                          │
│  ├── 9 Registered Platforms                                         │
│  │   ├── simcore     │ Scientific Computing    │ Active             │
│  │   ├── mezan       │ Enterprise Automation   │ Development        │
│  │   ├── talai       │ AI Research Platform    │ Beta               │
│  │   ├── optilibria  │ Optimization Framework  │ Active             │
│  │   ├── qmlab       │ Quantum Mechanics Lab   │ Beta               │
│  │   ├── repz        │ Fitness Tracking        │ Active (Portfolio) │
│  │   ├── liveiticonic│ Fashion E-commerce      │ Active (Portfolio) │
│  │   ├── attributa   │ Content Attribution     │ Active (Portfolio) │
│  │   └── llmworks    │ LLM Benchmarking        │ Active (Portfolio) │
│  │                                                                   │
│  └── Platform Config Structure                                      │
│      ├── id, name, slug, description, tagline                       │
│      ├── version, status, category                                  │
│      ├── features: string[]                                         │
│      ├── techStack: { frontend, backend, infra, databases }         │
│      ├── theme: { primary, secondary, accent, bg, surface, gradient}│
│      └── routes: { path, name, description }[]                      │
│                                                                      │
│  DASHBOARD STRUCTURE (src/projects/pages/)                          │
│  ├── simcore/                                                       │
│  │   ├── SimCoreDashboard.tsx                                       │
│  │   ├── SimulationsTab.tsx                                         │
│  │   ├── AnalyticsTab.tsx                                           │
│  │   ├── ExperimentsTab.tsx                                         │
│  │   └── VisualizeTab.tsx                                           │
│  │                                                                   │
│  ├── mezan/                                                         │
│  │   ├── MEZANDashboard.tsx                                         │
│  │   ├── WorkflowsTab.tsx                                           │
│  │   ├── IntegrationsTab.tsx                                        │
│  │   └── RulesTab.tsx                                               │
│  │                                                                   │
│  ├── talai/                                                         │
│  │   ├── TalAIDashboard.tsx                                         │
│  │   ├── ExperimentsTab.tsx                                         │
│  │   ├── ModelsTab.tsx                                              │
│  │   └── DatasetsTab.tsx                                            │
│  │                                                                   │
│  ├── optilibria/                                                    │
│  │   ├── OptiLibriaDashboard.tsx                                    │
│  │   ├── AlgorithmsTab.tsx                                          │
│  │   ├── ProblemsTab.tsx                                            │
│  │   └── BenchmarkTab.tsx                                           │
│  │                                                                   │
│  └── qmlab/                                                         │
│      ├── QMLabDashboard.tsx                                         │
│      ├── WavefunctionsTab.tsx                                       │
│      ├── SystemsTab.tsx                                             │
│      └── LearnTab.tsx                                               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Helper Functions:**

- `getProject(slug)` - Get single project config
- `getAllProjects()` - Get all projects
- `getProjectsByCategory(category)` - Filter by category

---

## 8. Hooks Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Custom Hooks Library                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  DATA HOOKS                                                         │
│  ├── useSimulations      │ SimCore simulation CRUD                  │
│  ├── useQMExperiments    │ QMLab quantum experiments                │
│  ├── useTalAIExperiments │ TalAI ML experiments                     │
│  ├── useWorkflows        │ MEZAN workflow management                │
│  ├── useOptimizationRuns │ OptiLibria optimization runs             │
│  └── useApiKeys          │ API key management                       │
│                                                                      │
│  REAL-TIME HOOKS                                                    │
│  ├── useRealtimeSimulations                                         │
│  ├── useRealtimeExperiments                                         │
│  ├── useRealtimeWorkflows                                           │
│  └── useRealtimeOptimizationRuns                                    │
│                                                                      │
│  AUTH & USER HOOKS                                                  │
│  ├── useAuth             │ Authentication state & actions           │
│  ├── useSubscription     │ Billing & subscription tiers             │
│  ├── useOrganization     │ Multi-tenant organization mgmt           │
│  └── useWaitlist         │ Waitlist management                      │
│                                                                      │
│  UI/UX HOOKS                                                        │
│  ├── useToast            │ Toast notifications                      │
│  ├── useLocalStorage     │ Persistent local storage                 │
│  ├── useMediaQuery       │ Responsive breakpoints                   │
│  ├── useIsMobile/Tablet/Desktop │ Device detection                  │
│  ├── useReducedMotion    │ Accessibility motion preference          │
│  └── useKeyboardShortcuts│ Global keyboard shortcuts                │
│                                                                      │
│  NAVIGATION HOOKS                                                   │
│  ├── useArrowNavigation  │ Arrow key navigation                     │
│  ├── useFocusTrap        │ Modal focus trapping                     │
│  └── useGlobalShortcuts  │ App-wide shortcuts (Cmd+K, etc.)         │
│                                                                      │
│  ANALYTICS HOOKS                                                    │
│  ├── useAnalytics        │ Event tracking                           │
│  ├── useVisitorTracking  │ Page views, scroll, clicks               │
│  └── useUnifiedScanner   │ QR/barcode scanning                      │
│                                                                      │
│  NOTIFICATION HOOKS                                                 │
│  └── useEmailNotifications │ Email notification preferences         │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Test Coverage:** 8 test files in `src/hooks/__tests__/`

---

## 9. Supabase Integration

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Supabase Architecture                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  CLIENT (src/integrations/supabase/)                                │
│  ├── client.ts           │ Supabase client instance                 │
│  └── types.ts            │ Database type definitions                │
│                                                                      │
│  CONFIGURATION                                                      │
│  ├── VITE_SUPABASE_URL                                              │
│  └── VITE_SUPABASE_PUBLISHABLE_KEY                                  │
│                                                                      │
│  CLIENT OPTIONS                                                     │
│  ├── auth.storage: localStorage                                     │
│  ├── auth.persistSession: true                                      │
│  └── auth.autoRefreshToken: true                                    │
│                                                                      │
│  DATABASE TABLES (via migrations)                                   │
│  ├── users                │ User profiles                           │
│  ├── notifications        │ User notifications                      │
│  ├── simulations          │ SimCore simulations                     │
│  ├── experiments          │ QMLab/TalAI experiments                 │
│  ├── workflows            │ MEZAN workflows                         │
│  ├── optimization_runs    │ OptiLibria runs                         │
│  ├── waitlist             │ Beta waitlist entries                   │
│  ├── organizations        │ Multi-tenant orgs                       │
│  ├── api_keys             │ API key management                      │
│  └── subscriptions        │ Billing subscriptions                   │
│                                                                      │
│  MIGRATIONS (supabase/migrations/) - 12 files                       │
│                                                                      │
│  REAL-TIME SUBSCRIPTIONS                                            │
│  ├── postgres_changes on INSERT/UPDATE/DELETE                       │
│  └── Channel-based subscriptions per user                           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 10. Edge Functions

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Edge Functions Architecture                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  FUNCTIONS (supabase/functions/)                                    │
│  │                                                                   │
│  ├── _shared/            │ Shared utilities                         │
│  │   ├── cors.ts         │ CORS headers                             │
│  │   └── supabase.ts     │ Supabase admin client                    │
│  │                                                                   │
│  ├── PLATFORM APIs                                                  │
│  │   ├── simcore-api/    │ Simulation endpoints                     │
│  │   ├── mezan-api/      │ Workflow automation                      │
│  │   ├── talai-api/      │ AI/ML experiment APIs                    │
│  │   ├── optilibria-api/ │ Optimization algorithms                  │
│  │   ├── qmlab-api/      │ Quantum simulation                       │
│  │   └── librex-api/     │ Library/resource API                     │
│  │                                                                   │
│  ├── UTILITY APIs                                                   │
│  │   ├── unified-scanner-api/ │ QR/barcode scanning                 │
│  │   └── send-email/     │ Email notifications                      │
│  │                                                                   │
│  └── BILLING                                                        │
│      ├── create-checkout/│ Stripe checkout session                  │
│      └── stripe-webhook/ │ Stripe webhook handler                   │
│                                                                      │
│  TOTAL: 11 Edge Functions                                           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 11. Design System Tokens

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Design Token System                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  SEMANTIC TOKENS (Theme-aware)                                      │
│  ├── --background        │ Page background                          │
│  ├── --foreground        │ Primary text                             │
│  ├── --card              │ Card backgrounds                         │
│  ├── --card-foreground   │ Card text                                │
│  ├── --popover           │ Popover backgrounds                      │
│  ├── --popover-foreground│ Popover text                             │
│  ├── --primary           │ Primary actions                          │
│  ├── --primary-foreground│ Primary action text                      │
│  ├── --secondary         │ Secondary elements                       │
│  ├── --secondary-foreground                                         │
│  ├── --muted             │ Muted backgrounds                        │
│  ├── --muted-foreground  │ Muted text                               │
│  ├── --accent            │ Accent highlights                        │
│  ├── --accent-foreground │ Accent text                              │
│  ├── --destructive       │ Destructive actions                      │
│  ├── --destructive-foreground                                       │
│  ├── --border            │ Borders                                  │
│  ├── --input             │ Input borders                            │
│  ├── --ring              │ Focus rings                              │
│  └── --radius            │ Border radius (0.75rem)                  │
│                                                                      │
│  SIDEBAR TOKENS                                                     │
│  ├── --sidebar-background                                           │
│  ├── --sidebar-foreground                                           │
│  ├── --sidebar-primary                                              │
│  ├── --sidebar-primary-foreground                                   │
│  ├── --sidebar-accent                                               │
│  ├── --sidebar-accent-foreground                                    │
│  ├── --sidebar-border                                               │
│  └── --sidebar-ring                                                 │
│                                                                      │
│  TYPOGRAPHY                                                         │
│  ├── Fira Code           │ Monospace                                │
│  ├── JetBrains Mono      │ Code blocks                              │
│  ├── Inter               │ Body text                                │
│  ├── Space Grotesk       │ Headings                                 │
│  └── Orbitron            │ Display/Cyberpunk                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 12. Notification System

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Notification Architecture                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  NOTIFICATION TYPES                                                 │
│  ├── success  │ Green  │ Successful operations                      │
│  ├── error    │ Red    │ Error states                               │
│  ├── info     │ Blue   │ Informational                              │
│  ├── warning  │ Yellow │ Warnings                                   │
│  └── system   │ Gray   │ System messages                            │
│                                                                      │
│  NOTIFICATION SOURCES                                               │
│  ├── local      │ Ephemeral, in-memory only                         │
│  └── persistent │ Database-backed, synced with Supabase             │
│                                                                      │
│  FEATURES                                                           │
│  ├── Max 50 notifications (FIFO)                                    │
│  ├── Read/unread tracking                                           │
│  ├── Action buttons with navigation                                 │
│  ├── Real-time sync via Supabase channels                           │
│  ├── Expiration support                                             │
│  └── Bulk operations (mark all read, clear all)                     │
│                                                                      │
│  COMPONENTS                                                         │
│  ├── NotificationCenter.tsx │ Dropdown notification list            │
│  ├── Toaster.tsx            │ Toast notifications                   │
│  └── notifications/         │ Notification components               │
│                                                                      │
│  STORE ACTIONS                                                      │
│  ├── addNotification(notification)                                  │
│  ├── markAsRead(id)                                                 │
│  ├── markAllAsRead()                                                │
│  ├── removeNotification(id)                                         │
│  ├── clearAll()                                                     │
│  ├── fetchNotifications()                                           │
│  └── subscribeToRealtime(userId)                                    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 13. Real-time Subscriptions

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Real-time Subscription System                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  SUBSCRIPTION HOOKS (src/hooks/useRealtimeSimulations.ts)           │
│  │                                                                   │
│  ├── useRealtimeSimulations                                         │
│  │   └── Subscribes to: simulations table                           │
│  │       Events: INSERT, UPDATE, DELETE                             │
│  │       Filter: user_id                                            │
│  │                                                                   │
│  ├── useRealtimeExperiments                                         │
│  │   └── Subscribes to: experiments table                           │
│  │       Events: INSERT, UPDATE, DELETE                             │
│  │       Filter: user_id                                            │
│  │                                                                   │
│  ├── useRealtimeWorkflows                                           │
│  │   └── Subscribes to: workflows table                             │
│  │       Events: INSERT, UPDATE, DELETE                             │
│  │       Filter: user_id                                            │
│  │                                                                   │
│  └── useRealtimeOptimizationRuns                                    │
│      └── Subscribes to: optimization_runs table                     │
│          Events: INSERT, UPDATE, DELETE                             │
│          Filter: user_id                                            │
│                                                                      │
│  IMPLEMENTATION PATTERN                                             │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  const channel = supabase                                     │   │
│  │    .channel('channel-name')                                   │   │
│  │    .on('postgres_changes', {                                  │   │
│  │      event: '*',                                              │   │
│  │      schema: 'public',                                        │   │
│  │      table: 'table_name',                                     │   │
│  │      filter: `user_id=eq.${userId}`                           │   │
│  │    }, (payload) => { /* handle change */ })                   │   │
│  │    .subscribe();                                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  CLEANUP                                                            │
│  └── supabase.removeChannel(channel) on unmount                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 14. Testing Infrastructure

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Testing Architecture                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  UNIT TESTS (Vitest)                                                │
│  ├── Config: vitest.config.ts                                       │
│  ├── Coverage: vitest run --coverage                                │
│  ├── UI: vitest --ui                                                │
│  │                                                                   │
│  ├── Hook Tests (src/hooks/__tests__/)                              │
│  │   ├── useAuth.test.ts                                            │
│  │   ├── useSimulations.test.ts                                     │
│  │   ├── useWorkflows.test.ts                                       │
│  │   ├── useExperiments.test.ts                                     │
│  │   ├── useOptimizationRuns.test.ts                                │
│  │   ├── useKeyboardShortcuts.test.ts                               │
│  │   ├── useLocalStorage.test.ts                                    │
│  │   └── useMediaQuery.test.ts                                      │
│  │                                                                   │
│  └── Store Tests (src/stores/__tests__/)                            │
│      └── notificationStore.test.ts                                  │
│                                                                      │
│  E2E TESTS (Playwright)                                             │
│  ├── Config: playwright.config.ts                                   │
│  ├── Tests: tests/e2e/ (14 test files)                              │
│  │   ├── navigation.spec.ts                                         │
│  │   ├── auth.spec.ts                                               │
│  │   ├── dashboard.spec.ts                                          │
│  │   ├── theme.spec.ts                                              │
│  │   └── ... (10 more)                                              │
│  │                                                                   │
│  ├── Fixtures: tests/fixtures/                                      │
│  └── Utils: tests/utils/                                            │
│                                                                      │
│  TEST COMMANDS                                                      │
│  ├── npm run test          │ Run unit tests                         │
│  ├── npm run test:watch    │ Watch mode                             │
│  ├── npm run test:coverage │ Coverage report                        │
│  └── npm run test:ui       │ Vitest UI                              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 15. Studios & Templates

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Studios Architecture                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  STUDIOS (src/studios/)                                             │
│  ├── StudioSelector.tsx    │ Main studio hub                        │
│  │                                                                   │
│  ├── platforms/                                                     │
│  │   └── PlatformsHub.tsx  │ Platform browser                       │
│  │                                                                   │
│  └── templates/ (19 items)                                          │
│      ├── TemplatesHub.tsx  │ Template browser                       │
│      ├── TemplateCard.tsx  │ Template preview card                  │
│      ├── TemplateFilters.tsx │ Filter controls                      │
│      ├── TemplateGrid.tsx  │ Grid layout                            │
│      ├── TemplatePreview.tsx │ Full preview                         │
│      └── ... (14 more template components)                          │
│                                                                      │
│  TEMPLATE MARKETPLACE                                               │
│  ├── Route: /store/templates                                        │
│  ├── Page: src/pages/store/TemplateMarketplace.tsx                  │
│  │                                                                   │
│  └── Features:                                                      │
│      ├── Category filtering                                         │
│      ├── Search functionality                                       │
│      ├── Preview mode                                               │
│      ├── Pricing tiers                                              │
│      └── Download/purchase flow                                     │
│                                                                      │
│  STUDIO ROUTES                                                      │
│  ├── /studios             → StudioSelector                          │
│  ├── /studio/templates    → TemplatesHub                            │
│  ├── /studio/platforms    → PlatformsHub                            │
│  └── /store/templates     → TemplateMarketplace                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 16. Services Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Services Architecture                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  SERVICES HUB (src/pages/services/)                                 │
│  │                                                                   │
│  ├── ServicesHub.tsx       │ Services landing page                  │
│  │                                                                   │
│  ├── UX AUDIT SERVICES                                              │
│  │   ├── HeuristicEvaluation.tsx                                    │
│  │   │   └── Nielsen's 10 heuristics analysis                       │
│  │   │                                                               │
│  │   ├── AccessibilityAudit.tsx                                     │
│  │   │   └── WCAG compliance checking                               │
│  │   │                                                               │
│  │   ├── UserFlowAnalysis.tsx                                       │
│  │   │   └── User journey mapping                                   │
│  │   │                                                               │
│  │   └── DesignSystemReview.tsx                                     │
│  │       └── Design consistency audit                               │
│  │                                                                   │
│  └── TECHNICAL SERVICES                                             │
│      ├── PerformanceTesting.tsx                                     │
│      │   └── Core Web Vitals, load testing                          │
│      │                                                               │
│      └── SecurityAssessment.tsx                                     │
│          └── Security vulnerability scanning                        │
│                                                                      │
│  SERVICE ROUTES                                                     │
│  ├── /services            → ServicesHub                             │
│  ├── /services/heuristic  → HeuristicEvaluation                     │
│  ├── /services/accessibility → AccessibilityAudit                   │
│  ├── /services/user-flow  → UserFlowAnalysis                        │
│  ├── /services/design-review → DesignSystemReview                   │
│  ├── /services/performance → PerformanceTesting                     │
│  └── /services/security   → SecurityAssessment                      │
│                                                                      │
│  BOOKING FLOW                                                       │
│  ├── /pricing             → Pricing page                            │
│  └── /book                → Booking/scheduling                      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 17. Accessibility Features

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Accessibility Architecture                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  SKIP NAVIGATION                                                    │
│  └── SkipToMain.tsx        │ Skip to main content link              │
│                                                                      │
│  ROUTE ANNOUNCEMENTS                                                │
│  └── RouteAnnouncer.tsx    │ Screen reader route announcements      │
│                                                                      │
│  FOCUS MANAGEMENT                                                   │
│  ├── useFocusTrap.ts       │ Modal focus trapping                   │
│  ├── useArrowNavigation.ts │ Arrow key navigation                   │
│  └── Focus visible styles  │ Keyboard focus indicators              │
│                                                                      │
│  MOTION PREFERENCES                                                 │
│  └── useReducedMotion.ts   │ Respects prefers-reduced-motion        │
│                                                                      │
│  KEYBOARD NAVIGATION                                                │
│  ├── useKeyboardShortcuts.ts │ Global shortcuts                     │
│  ├── KeyboardShortcutsHelp.tsx │ Shortcuts reference modal          │
│  ├── CommandPalette.tsx    │ Cmd+K command palette                  │
│  └── Kbd.tsx               │ Keyboard key display component         │
│                                                                      │
│  SEMANTIC HTML                                                      │
│  ├── Proper heading hierarchy                                       │
│  ├── ARIA labels and roles                                          │
│  ├── Form labels and descriptions                                   │
│  └── Alt text for images                                            │
│                                                                      │
│  COLOR CONTRAST                                                     │
│  ├── WCAG AA compliant color tokens                                 │
│  └── Multiple theme options including light mode                    │
│                                                                      │
│  LOADING STATES                                                     │
│  ├── RouteProgressBar.tsx  │ Visual loading indicator               │
│  ├── LoadingSkeleton.tsx   │ Content placeholders                   │
│  └── LoadingSpinner.tsx    │ Spinner with aria-busy                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 18. Performance Optimizations

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Performance Optimizations                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  CODE SPLITTING                                                     │
│  ├── React.lazy() for all non-critical routes                       │
│  ├── Suspense boundaries with fallback loaders                      │
│  └── Only Landing + NotFound eagerly loaded                         │
│                                                                      │
│  CACHING                                                            │
│  ├── TanStack Query                                                 │
│  │   └── staleTime: 5 minutes default                               │
│  ├── localStorage persistence for auth                              │
│  └── Theme preference caching                                       │
│                                                                      │
│  BUNDLE OPTIMIZATION                                                │
│  ├── Vite build with tree-shaking                                   │
│  ├── SWC for fast compilation                                       │
│  └── Rollup for production bundles                                  │
│                                                                      │
│  ASSET OPTIMIZATION                                                 │
│  ├── SVG icons (Lucide React)                                       │
│  ├── Font preloading (Google Fonts)                                 │
│  └── Image optimization via CDN                                     │
│                                                                      │
│  RUNTIME OPTIMIZATIONS                                              │
│  ├── Framer Motion AnimatePresence                                  │
│  ├── Virtualization for long lists                                  │
│  ├── Debounced search inputs                                        │
│  └── Memoized components where needed                               │
│                                                                      │
│  PWA SUPPORT                                                        │
│  ├── vite-plugin-pwa                                                │
│  ├── Service worker for offline support                             │
│  └── Install page at /install                                       │
│                                                                      │
│  PRELOADING                                                         │
│  └── PreloadLink.tsx       │ Route preloading on hover              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 19. Error Handling

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Error Handling Architecture                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ERROR BOUNDARIES                                                   │
│  ├── AppErrorBoundary.tsx  │ Root-level error boundary              │
│  │   └── Catches all unhandled errors                               │
│  │   └── Shows recovery UI with retry option                        │
│  │                                                                   │
│  ├── FeatureErrorBoundary.tsx │ Feature-level boundaries            │
│  │   └── Isolates feature failures                                  │
│  │   └── Graceful degradation                                       │
│  │                                                                   │
│  └── ErrorBoundary.tsx     │ Generic error boundary                 │
│      └── Reusable wrapper component                                 │
│                                                                      │
│  API ERROR HANDLING                                                 │
│  ├── TanStack Query error states                                    │
│  ├── Supabase error handling in hooks                               │
│  └── Toast notifications for user feedback                          │
│                                                                      │
│  404 HANDLING                                                       │
│  └── NotFound.tsx          │ Custom 404 page                        │
│      └── Cyberpunk-themed error page                                │
│      └── Navigation suggestions                                     │
│                                                                      │
│  FORM VALIDATION                                                    │
│  ├── Zod schema validation                                          │
│  ├── React Hook Form integration                                    │
│  └── Inline error messages                                          │
│                                                                      │
│  LOGGING                                                            │
│  ├── Console error logging                                          │
│  └── Error tracking (ready for Sentry integration)                  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 20. Security Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Security Architecture                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  AUTHENTICATION                                                     │
│  ├── Supabase Auth                                                  │
│  │   ├── Email/password authentication                              │
│  │   ├── Session tokens (JWT)                                       │
│  │   └── Auto token refresh                                         │
│  │                                                                   │
│  └── Protected Routes                                               │
│      └── ProtectedRoute.tsx │ Auth-gated routes                     │
│                                                                      │
│  AUTHORIZATION                                                      │
│  ├── Row Level Security (RLS)                                       │
│  │   └── All tables protected by user_id policies                   │
│  │                                                                   │
│  └── Role-based access                                              │
│      ├── Admin routes (/admin/*)                                    │
│      └── Organization roles (owner, admin, member)                  │
│                                                                      │
│  DATA PROTECTION                                                    │
│  ├── Environment variables for secrets                              │
│  │   ├── VITE_SUPABASE_URL                                          │
│  │   └── VITE_SUPABASE_PUBLISHABLE_KEY                              │
│  │                                                                   │
│  ├── No hardcoded credentials                                       │
│  └── .env.example for documentation                                 │
│                                                                      │
│  API SECURITY                                                       │
│  ├── Edge Functions with CORS                                       │
│  ├── API key management (useApiKeys hook)                           │
│  └── Rate limiting (Supabase built-in)                              │
│                                                                      │
│  CONSENT & PRIVACY                                                  │
│  ├── AIConsentModal.tsx    │ AI feature consent                     │
│  ├── aiConsentStore.ts     │ Consent state management               │
│  ├── Privacy policy page   │ /privacy                               │
│  └── Terms of service      │ /terms                                 │
│                                                                      │
│  SECURITY AUDIT                                                     │
│  ├── npm audit             │ Dependency vulnerability scan          │
│  └── SecurityAssessment service page                                │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Summary Statistics

| Category                | Count |
| ----------------------- | ----- |
| **Routes**              | 45+   |
| **Components**          | 144+  |
| **UI Components**       | 55    |
| **Shared Components**   | 26    |
| **Custom Hooks**        | 24+   |
| **Zustand Stores**      | 4     |
| **Edge Functions**      | 11    |
| **Themes**              | 7     |
| **Platform Dashboards** | 9     |
| **E2E Tests**           | 14    |
| **Unit Test Files**     | 9     |
| **Database Migrations** | 12    |

---

## Next Steps: Audit Recommendations

Based on these codemaps, the following areas should be audited:

1. **Performance** - Bundle size analysis, lazy loading coverage
2. **Accessibility** - WCAG compliance verification
3. **Security** - RLS policy review, API key rotation
4. **Testing** - Coverage gaps, E2E test completeness
5. **Code Quality** - Circular dependencies, unused exports
6. **Documentation** - JSDoc coverage, README updates
7. **Type Safety** - Any types, strict mode compliance
8. **Error Handling** - Edge case coverage
9. **State Management** - Store optimization, subscription cleanup
10. **SEO** - Meta tags, structured data completeness
