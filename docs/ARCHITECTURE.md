# Alawein Platform - System Architecture

> Last verified: 2025-12-09

Comprehensive guide to the system architecture, data flow, and component
hierarchy.

---

## Table of Contents

1. System Overview
2. Architecture Diagrams
3. Data Flow
4. Component Hierarchy
5. State Management
6. Backend Architecture
7. Security Model
8. Performance
9. Directory Structure

---

## System Overview

The Alawein Platform is a React/TypeScript application featuring:

- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + Shadcn UI + Framer Motion
- **State**: Zustand (global) + TanStack Query (server)
- **Backend**: Lovable Cloud (PostgreSQL + Edge Functions)
- **Auth**: Built-in authentication with RLS

---

## Architecture Diagrams

### High-Level System Architecture

```mermaid
graph TB
    subgraph Client["Client Layer"]
        Browser[Web Browser]
        PWA[PWA / Service Worker]
    end

    subgraph Frontend["Frontend Application"]
        Router[React Router]
        Pages[Page Components]

        subgraph Projects["Platform Dashboards"]
            SimCore[SimCore]
            MEZAN[MEZAN]
            TalAI[TalAI]
            OptiLibria[OptiLibria]
            QMLab[QMLab]
        end

        subgraph UI["UI Layer"]
            Shadcn[Shadcn Components]
            Custom[Custom Components]
            Charts[Recharts]
            Animations[Framer Motion]
        end
    end

    subgraph State["State Layer"]
        Zustand[Zustand Stores]
        TanStack[TanStack Query]
        Context[React Context]
    end

    subgraph Backend["Lovable Cloud"]
        EdgeFunctions[Edge Functions]
        Auth[Authentication]

        subgraph APIs["Platform APIs"]
            SimCoreAPI[simcore-api]
            MEZANAPI[mezan-api]
            TalAIAPI[talai-api]
            OptiLibriaAPI[optilibria-api]
            QMLabAPI[qmlab-api]
        end

        Database[(PostgreSQL)]
        Storage[File Storage]
    end

    Browser --> Router
    PWA --> Router

    Router --> Pages
    Pages --> Projects
    Pages --> UI

    Projects --> State
    UI --> State

    State --> EdgeFunctions
    State --> Auth

    EdgeFunctions --> APIs
    APIs --> Database
    Auth --> Database
    Storage --> Database
```

### Component Architecture

```mermaid
graph LR
    subgraph App["Application Root"]
        AppTsx[App.tsx]
        Router[BrowserRouter]
    end

    subgraph Providers["Context Providers"]
        QueryProvider[QueryClientProvider]
        ThemeProvider[ThemeProvider]
        AuthProvider[AuthProvider]
        ToastProvider[Toaster]
    end

    subgraph Routes["Route Components"]
        Landing[Landing]
        Portfolio[Portfolio]
        ProjectsHub[Projects Hub]
        Studios[Studios]
        Auth[Auth Page]
    end

    subgraph Layouts["Layout Components"]
        PageLayout[PageLayout]
        CyberpunkLayout[CyberpunkLayout]
        ProjectLayout[ProjectLayout]
    end

    AppTsx --> Router
    Router --> Providers
    Providers --> Routes
    Routes --> Layouts
```

---

## Data Flow

### Request Lifecycle

```mermaid
sequenceDiagram
    participant User
    participant Component
    participant Hook
    participant TanStack
    participant EdgeFn
    participant Database

    User->>Component: Interaction
    Component->>Hook: Call custom hook
    Hook->>TanStack: useQuery / useMutation

    alt Cache Hit
        TanStack-->>Hook: Return cached data
        Hook-->>Component: Data
        Component-->>User: Render UI
    else Cache Miss
        TanStack->>EdgeFn: HTTP Request
        EdgeFn->>Database: SQL Query
        Database-->>EdgeFn: Result
        EdgeFn-->>TanStack: Response
        TanStack->>TanStack: Update cache
        TanStack-->>Hook: Data
        Hook-->>Component: Data
        Component-->>User: Render UI
    end
```

### Mutation Flow

```mermaid
sequenceDiagram
    participant User
    participant Form
    participant Hook
    participant TanStack
    participant EdgeFn
    participant Database
    participant UI

    User->>Form: Submit data
    Form->>Hook: mutate(data)
    Hook->>TanStack: useMutation

    TanStack->>TanStack: Optimistic update
    TanStack->>UI: Update cache immediately
    UI-->>User: Instant feedback

    TanStack->>EdgeFn: POST request
    EdgeFn->>Database: INSERT/UPDATE

    alt Success
        Database-->>EdgeFn: Success
        EdgeFn-->>TanStack: 200 OK
        TanStack->>TanStack: Invalidate queries
        TanStack-->>Hook: onSuccess
        Hook-->>Form: Show success toast
    else Error
        Database-->>EdgeFn: Error
        EdgeFn-->>TanStack: Error response
        TanStack->>TanStack: Rollback optimistic
        TanStack-->>Hook: onError
        Hook-->>Form: Show error toast
    end
```

---

## Component Hierarchy

### Page Structure

```mermaid
graph TD
    subgraph Pages["Page Components"]
        Landing[Landing.tsx]
        Portfolio[Portfolio.tsx]
        Projects[ProjectsHub.tsx]
        Auth[Auth.tsx]
        Settings[Settings.tsx]
    end

    subgraph Sections["Section Components"]
        Hero[HeroSection]
        About[AboutSection]
        Skills[SkillsSection]
        Contact[ContactSection]
    end

    subgraph Shared["Shared Components"]
        Navigation[Navigation]
        Footer[Footer]
        SEO[SEO]
        Breadcrumbs[Breadcrumbs]
    end

    Landing --> Hero
    Landing --> About
    Landing --> Skills
    Landing --> Contact

    Landing --> Navigation
    Landing --> Footer
    Landing --> SEO
```

### Platform Dashboard Structure

```mermaid
graph TD
    subgraph Dashboard["Platform Dashboard"]
        ProjectLayout[ProjectLayout]
        DashboardHeader[DashboardHeader]
        StatsGrid[StatsGrid]
        MainContent[Main Content Area]
    end

    subgraph SimCore["SimCore Components"]
        SimControls[SimulationControls]
        RealTimeChart[RealTimeChart]
        ParamPanel[ParameterPanel]
    end

    subgraph MEZAN["MEZAN Components"]
        BilingualToggle[BilingualToggle]
        IslamicPattern[IslamicPattern]
        WorkflowEditor[Workflow Editor]
    end

    subgraph TalAI["TalAI Components"]
        HyperparamControls[HyperparameterControls]
        TrainingChart[TrainingChart]
        MetricsDisplay[Metrics Display]
    end

    Dashboard --> SimCore
    Dashboard --> MEZAN
    Dashboard --> TalAI
```

---

## State Management

### State Architecture

```mermaid
graph TB
    subgraph Global["Global State (Zustand)"]
        AuthStore[authStore]
        NotificationStore[notificationStore]
        SessionLogStore[sessionLogStore]
        GuestStore[guestStore]
    end

    subgraph Server["Server State (TanStack Query)"]
        Simulations[useSimulations]
        Workflows[useWorkflows]
        Experiments[useExperiments]
        OptRuns[useOptimizationRuns]
    end

    subgraph Local["Local State (React)"]
        useState[useState]
        useReducer[useReducer]
        FormState[Form State]
    end

    subgraph Context["React Context"]
        ThemeContext[ThemeContext]
        QueryClient[QueryClient]
    end

    Global --> Components[Components]
    Server --> Components
    Local --> Components
    Context --> Components
```

### Store Interactions

```mermaid
sequenceDiagram
    participant Component
    participant AuthStore
    participant NotificationStore
    participant TanStack

    Component->>AuthStore: useAuthStore()
    AuthStore-->>Component: { user, isAuthenticated }

    Component->>TanStack: useSimulations()
    TanStack-->>Component: { data, isLoading }

    alt Error occurs
        TanStack->>NotificationStore: addNotification(error)
        NotificationStore-->>Component: Toast displayed
    end

    alt Auth required
        Component->>AuthStore: Check isAuthenticated
        AuthStore-->>Component: false
        Component->>Component: Redirect to /auth
    end
```

---

## Backend Architecture

### Edge Function Structure

```mermaid
graph LR
    subgraph EdgeFunctions["Edge Functions"]
        SimCoreAPI["simcore-api/index.ts"]
        MEZANAPI["mezan-api/index.ts"]
        TalAIAPI["talai-api/index.ts"]
        OptiLibriaAPI["optilibria-api/index.ts"]
        QMLabAPI["qmlab-api/index.ts"]
    end

    subgraph Actions["API Actions"]
        List[list]
        Get[get]
        Create[create]
        Update[update]
        Delete[delete]
        Run[run/execute]
    end

    SimCoreAPI --> Actions
    MEZANAPI --> Actions
    TalAIAPI --> Actions
    OptiLibriaAPI --> Actions
    QMLabAPI --> Actions

    Actions --> Database[(PostgreSQL)]
```

### API Request Pattern

```mermaid
flowchart TD
    A[Incoming Request] --> B{CORS Preflight?}
    B -->|Yes| C[Return CORS headers]
    B -->|No| D[Parse request body]

    D --> E{Valid action?}
    E -->|No| F[Return 400 error]
    E -->|Yes| G[Create Supabase client]

    G --> H{Auth required?}
    H -->|Yes| I[Verify JWT]
    H -->|No| J[Execute action]

    I --> K{Valid token?}
    K -->|No| L[Return 401]
    K -->|Yes| J

    J --> M{Action type}
    M -->|list| N[SELECT query]
    M -->|get| O[SELECT by ID]
    M -->|create| P[INSERT]
    M -->|update| Q[UPDATE]
    M -->|delete| R[DELETE]

    N --> S[Return JSON response]
    O --> S
    P --> S
    Q --> S
    R --> S
```

---

## Security Model

### Authentication Flow

```mermaid
sequenceDiagram
    participant Browser
    participant App
    participant AuthStore
    participant Supabase
    participant Database

    Browser->>App: Load application
    App->>AuthStore: Initialize
    AuthStore->>Supabase: Check session

    alt Has valid session
        Supabase-->>AuthStore: Session + User
        AuthStore->>AuthStore: setUser(user)
        AuthStore-->>App: Authenticated
    else No session
        Supabase-->>AuthStore: null
        AuthStore-->>App: Not authenticated
    end

    Note over App: User navigates to protected route

    App->>AuthStore: Check isAuthenticated

    alt Authenticated
        AuthStore-->>App: true
        App->>App: Render protected content
    else Not authenticated
        AuthStore-->>App: false
        App->>App: Redirect to /auth
    end
```

### Row Level Security

```mermaid
graph TD
    subgraph Request["Database Request"]
        Query[SQL Query]
        UserID[auth.uid]
    end

    subgraph RLS["RLS Policies"]
        Select[SELECT Policy]
        Insert[INSERT Policy]
        Update[UPDATE Policy]
        Delete[DELETE Policy]
    end

    subgraph Validation["Policy Check"]
        OwnerCheck{user_id = auth.uid?}
        PublicCheck{is_public = true?}
    end

    Query --> RLS
    UserID --> RLS

    Select --> OwnerCheck
    Select --> PublicCheck
    Insert --> OwnerCheck
    Update --> OwnerCheck
    Delete --> OwnerCheck

    OwnerCheck -->|Yes| Allow[Allow Access]
    OwnerCheck -->|No| Deny[Deny Access]
    PublicCheck -->|Yes| Allow
```

---

## Performance

### Optimization Strategies

```mermaid
graph TB
    subgraph Build["Build Time"]
        Vite[Vite Bundling]
        TreeShake[Tree Shaking]
        CodeSplit[Code Splitting]
        Minify[Minification]
    end

    subgraph Runtime["Runtime"]
        LazyLoad[Lazy Loading]
        Suspense[React Suspense]
        Virtualization[List Virtualization]
    end

    subgraph Caching["Caching"]
        QueryCache[TanStack Query Cache]
        ServiceWorker[Service Worker]
        BrowserCache[Browser Cache]
    end

    subgraph Network["Network"]
        EdgeFunctions[Edge Functions]
        CDN[Static Asset CDN]
        Compression[Gzip/Brotli]
    end

    Build --> Runtime
    Runtime --> Caching
    Caching --> Network
```

---

## Directory Structure

```
alawein-platform/
├── src/                        # Main application
│   ├── App.tsx                 # Root with router
│   ├── main.tsx                # Entry point
│   ├── index.css               # Design tokens
│   │
│   ├── pages/                  # Page components
│   │   ├── Landing.tsx
│   │   ├── Portfolio.tsx
│   │   ├── Auth.tsx
│   │   └── ...
│   │
│   ├── projects/               # Platform dashboards
│   │   ├── config.ts           # Platform registry
│   │   ├── types.ts            # Interfaces
│   │   └── pages/
│   │       ├── simcore/
│   │       ├── mezan/
│   │       ├── talai/
│   │       ├── optilibria/
│   │       └── qmlab/
│   │
│   ├── studios/                # Studios hub
│   │   ├── StudioSelector.tsx
│   │   ├── templates/
│   │   └── platforms/
│   │
│   ├── components/             # UI library
│   │   ├── ui/                 # Shadcn (40+)
│   │   └── shared/             # Shared components
│   │
│   ├── hooks/                  # Custom hooks
│   ├── stores/                 # Zustand state
│   ├── context/                # React Context
│   ├── integrations/           # External services
│   ├── types/                  # TypeScript types
│   └── utils/                  # Utilities
│
├── supabase/                   # Backend
│   ├── config.toml
│   └── functions/              # Edge functions
│
├── docs/                       # Documentation
├── tests/                      # Test suites
└── scripts/                    # Automation
```

---

## Design System

### Token-Based Approach

All styling uses semantic tokens defined in `src/index.css`:

```css
/* Core tokens */
--background: 240 40% 10%;
--foreground: 0 0% 100%;
--primary: 271 91% 65%;
--secondary: 245 45% 20%;
--accent: 330 81% 60%;
--muted: 245 30% 25%;
--border: 0 0% 100% / 0.08;
```

### Available Themes

| Theme         | Description                      |
| ------------- | -------------------------------- |
| Quantum       | Space-like purple/cyan (default) |
| Glassmorphism | Frosted glass effects            |
| Dark          | High contrast minimal            |
| Light         | Clean whites                     |

---

## Related Documentation

- [Modules](./MODULES.md) - Detailed module breakdown
- [Routing](./ROUTING.md) - Route and API documentation
- [ERD](./ERD.md) - Database schema
- [Business Flows](./BUSINESS_FLOWS.md) - User journey diagrams
- [Design System](./DESIGN_SYSTEM.md) - Styling tokens
- [UI Components](./UI_COMPONENTS.md) - Component reference
