# Alawein Platform Documentation

> Last verified: 2025-12-09

Complete documentation for developers and AI assistants.

---

## Quick Links

### Getting Started

| Guide                                   | Description               | Time   |
| --------------------------------------- | ------------------------- | ------ |
| [Quick Start](./QUICK_START.md)         | Get running in 5 minutes  | 5 min  |
| [Development](./DEVELOPMENT.md)         | Patterns & workflows      | 20 min |
| [Troubleshooting](./TROUBLESHOOTING.md) | Common issues & solutions | 10 min |

### Architecture & Design

| Guide                                          | Description                | Time   |
| ---------------------------------------------- | -------------------------- | ------ |
| [Architecture](./ARCHITECTURE.md)              | System design & data flow  | 15 min |
| [Structure](./STRUCTURE.md)                    | Project file organization  | 10 min |
| [Modules](./MODULES.md)                        | Module & package reference | 20 min |
| [Design System](./DESIGN_SYSTEM.md)            | Tokens & styling           | 15 min |
| [Brand Assets](./BRAND_ASSETS.md)              | Ninja mascot & branding    | 10 min |
| [Platform Briefs](./PLATFORM_DESIGN_BRIEFS.md) | Platform design specs      | 15 min |

### Technical Reference

| Guide                                 | Description                     | Time   |
| ------------------------------------- | ------------------------------- | ------ |
| [Routing](./ROUTING.md)               | Routes & endpoints              | 15 min |
| [ERD](./ERD.md)                       | Database schema & relationships | 15 min |
| [UI Components](./UI_COMPONENTS.md)   | Component library reference     | 20 min |
| [Wireframes](./WIREFRAMES.md)         | Page layout wireframes          | 10 min |
| [Business Flows](./BUSINESS_FLOWS.md) | User flow sequence diagrams     | 15 min |

### APIs & Backend

| Guide                               | Description                | Time   |
| ----------------------------------- | -------------------------- | ------ |
| [APIs](./APIS.md)                   | Edge function overview     | 10 min |
| [API Reference](./API_REFERENCE.md) | Complete API documentation | 25 min |
| [Security](./SECURITY.md)           | Security best practices    | 15 min |

### Testing & Deployment

| Guide                                                   | Description                  | Time   |
| ------------------------------------------------------- | ---------------------------- | ------ |
| [Testing](./TESTING.md)                                 | Playwright & Vitest guide    | 20 min |
| [Testing Strategy](./TESTING_STRATEGY.md)               | Testing patterns & mocking   | 25 min |
| [Deployment](./DEPLOYMENT.md)                           | Production deployment        | 15 min |
| [Infrastructure](./INFRASTRUCTURE.md)                   | Cloud architecture & scaling | 20 min |
| [Lovable Workflow](./developer/LOVABLE-DEV-WORKFLOW.md) | Lovable dev workflow         | 10 min |

### Development Patterns

| Guide                                             | Description                   | Time   |
| ------------------------------------------------- | ----------------------------- | ------ |
| [State Management](./STATE_MANAGEMENT.md)         | React Query, context, Zustand | 20 min |
| [Error Handling](./ERROR_HANDLING.md)             | Error boundaries & patterns   | 15 min |
| [API Design](./API_DESIGN.md)                     | API patterns & versioning     | 15 min |
| [Performance](./PERFORMANCE.md)                   | Optimization & monitoring     | 20 min |
| [Monitoring](./MONITORING.md)                     | Observability & logging       | 15 min |
| [Internationalization](./INTERNATIONALIZATION.md) | i18n & RTL support            | 15 min |
| [Accessibility](./ACCESSIBILITY.md)               | WCAG compliance               | 15 min |
| [Security Checklist](./SECURITY_CHECKLIST.md)     | Security audit checklist      | 15 min |
| [Changelog Automation](./CHANGELOG_AUTOMATION.md) | Automated changelogs          | 10 min |

### AI & Automation

| Guide                                       | Description                    | Time   |
| ------------------------------------------- | ------------------------------ | ------ |
| [AI Guide](./AI_GUIDE.md)                   | Instructions for AI assistants | 10 min |
| [Session Log](./SESSION_LOG.md)             | Session tracking component     | 5 min  |
| [TODO Integrations](./TODO_INTEGRATIONS.md) | Pending integrations           | 5 min  |

### Contributing & Standards

| Guide                                       | Description               | Time   |
| ------------------------------------------- | ------------------------- | ------ |
| [Style Guide](./STYLE_GUIDE.md)             | Documentation standards   | 10 min |
| [Docs Contribution](./CONTRIBUTING_DOCS.md) | How to write good docs    | 15 min |
| [Changelog Guide](./CHANGELOG_GUIDE.md)     | Writing changelog entries | 10 min |
| [Contributing](../CONTRIBUTING.md)          | Contribution guidelines   | 15 min |
| [Changelog](../CHANGELOG.md)                | Version history           | 5 min  |
| [Code of Conduct](../CODE_OF_CONDUCT.md)    | Community standards       | 5 min  |

### Policies & Governance

| Guide                          | Description                   | Time   |
| ------------------------------ | ----------------------------- | ------ |
| [Privacy Policy](./PRIVACY.md) | Data collection & user rights | 10 min |
| [Roadmap](./ROADMAP.md)        | Planned features & priorities | 10 min |
| [Governance](./GOVERNANCE.md)  | Project governance & roles    | 15 min |
| [Glossary](./GLOSSARY.md)      | Domain-specific terms         | 10 min |
| [FAQ](./FAQ.md)                | Frequently asked questions    | 10 min |

### Visual Assets

| Asset                                                       | Description                 |
| ----------------------------------------------------------- | --------------------------- |
| [Architecture Overview](./assets/architecture-overview.svg) | System architecture diagram |
| [Data Flow](./assets/data-flow.svg)                         | Request/response flow       |
| [Component Hierarchy](./assets/component-hierarchy.svg)     | React component structure   |

---

## Table of Contents

1. Overview
2. Platform Routes
3. Key Concepts
4. File Organization
5. Database Tables
6. For AI Assistants

---

## Overview

**Alawein Platform** is a React/TypeScript portfolio and platform ecosystem
featuring:

- 🎨 **Unified Design System** - Token-based theming with 4 theme variants
- 🚀 **5 Platform Dashboards** - SimCore, MEZAN, TalAI, OptiLibria, QMLab
- 🔐 **Authentication** - Built-in auth with Lovable Cloud
- 📊 **Real-time Data** - TanStack Query + Zustand state management
- ⚡ **Edge Functions** - Serverless APIs for each platform

---

## Platform Routes

| Platform      | Route                  | Description                | Status      |
| ------------- | ---------------------- | -------------------------- | ----------- |
| Landing       | `/`                    | Main landing page          | Active      |
| Portfolio     | `/portfolio`           | Cyberpunk-themed portfolio | Active      |
| Projects Hub  | `/projects`            | All platforms overview     | Active      |
| SimCore       | `/projects/simcore`    | Scientific computing       | Active      |
| MEZAN         | `/projects/mezan`      | Workflow automation        | Development |
| TalAI         | `/projects/talai`      | AI research                | Beta        |
| OptiLibria    | `/projects/optilibria` | Optimization library       | Active      |
| QMLab         | `/projects/qmlab`      | Quantum mechanics          | Beta        |
| Studios       | `/studios`             | Template browser           | Active      |
| Design System | `/design-system`       | Design reference           | Active      |

---

## Key Concepts

### 1. Project Registry

All platforms are configured in `src/projects/config.ts`:

```ts
export const projectRegistry = {
  simcore: {
    id: 'simcore',
    name: 'SimCore',
    slug: 'simcore',
    // ...
  },
  // ...
};
```

### 2. Design Tokens

Styling uses semantic CSS variables from `src/index.css`:

```css
--background: 240 40% 10%;
--foreground: 0 0% 100%;
--primary: 271 91% 65%;
```

### 3. State Management

- **Zustand** - Global state (auth, notifications)
- **TanStack Query** - Server state (API data)
- **React Context** - Theme provider

---

## File Organization

```
src/
├── pages/           → Page components
├── projects/        → Platform dashboards
│   ├── config.ts    → Platform registry
│   ├── types.ts     → TypeScript interfaces
│   └── pages/       → Individual dashboards
├── components/
│   ├── ui/          → Shadcn components
│   └── shared/      → Reusable components
├── hooks/           → Custom React hooks
├── stores/          → Zustand stores
├── context/         → React Context (Theme)
└── index.css        → Design tokens
```

See [STRUCTURE.md](./STRUCTURE.md) for complete details.

---

## Database Tables

### Platform Tables

| Table                 | Platform   | Purpose              |
| --------------------- | ---------- | -------------------- |
| `simcore_simulations` | SimCore    | Simulation runs      |
| `mezan_workflows`     | MEZAN      | Workflow definitions |
| `talai_experiments`   | TalAI      | ML experiments       |
| `optilibria_runs`     | OptiLibria | Optimization runs    |
| `qmlab_experiments`   | QMLab      | Quantum experiments  |

### Shared Tables

| Table                      | Purpose           |
| -------------------------- | ----------------- |
| `projects`                 | Platform metadata |
| `project_features`         | Feature flags     |
| `project_tech_stack`       | Technologies      |
| `user_project_preferences` | User settings     |
| `profiles`                 | User profiles     |

---

## For AI Assistants

### Important Rules

1. **Use semantic tokens** - Never hardcode colors
2. **Check project registry** - Platform config in `src/projects/config.ts`
3. **Auto-generated files** - Don't edit `supabase/` client files
4. **Edge functions** - Located in `supabase/functions/{platform}-api/`

### Common Tasks

**Add feature to platform:**

1. Find dashboard: `src/projects/pages/{platform}/`
2. Find API: `supabase/functions/{platform}-api/`

**Update styling:**

1. Tokens: `src/index.css`
2. Tailwind: `tailwind.config.ts`
3. Use: `bg-primary`, `text-foreground`, etc.

**Add new platform:**

1. Add to `src/projects/config.ts`
2. Create `src/projects/pages/{name}/`
3. Create `supabase/functions/{name}-api/`
4. Add route to `src/App.tsx`

---

## Additional Resources

- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [CHANGELOG.md](../CHANGELOG.md) - Version history
- [CLAUDE.md](../CLAUDE.md) - AI assistant quick reference
- [README.md](../README.md) - Project overview

---

## Deployment

See [deployment/README.md](./deployment/README.md) for deployment instructions.
