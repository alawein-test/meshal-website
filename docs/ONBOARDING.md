# Onboarding Guide

> Last verified: 2025-12-09

Welcome to the Alawein Platform team! This guide will help you get up to speed
quickly.

---

## Table of Contents

- Welcome
- First Day
- First Week
- Development Environment
- Codebase Overview
- Key Concepts
- Communication
- Resources
- Checklist

---

## Welcome

The Alawein Platform is a multi-project portfolio showcasing five specialized
applications:

| Platform       | Domain                | Description                 |
| -------------- | --------------------- | --------------------------- |
| **SimCore**    | Scientific Computing  | Real-time simulation engine |
| **MEZAN**      | Enterprise Automation | Bilingual workflow system   |
| **TalAI**      | AI Research           | ML experiment tracking      |
| **OptiLibria** | Optimization          | Mathematical optimization   |
| **QMLab**      | Quantum Mechanics     | Quantum simulation          |

---

## First Day

### 1. Access Setup

Request access to:

- [ ] GitHub repository
- [ ] Lovable workspace (if using Lovable)
- [ ] Communication channels (Slack/Discord)
- [ ] Project management tools

### 2. Clone and Run

```bash
# Clone the repository
git clone <repo-url>
cd alawein-platform

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Read Essential Docs

Spend your first day reading these (in order):

1. [README.md](../README.md) - Project overview
2. [QUICK_START.md](./QUICK_START.md) - 5-minute setup
3. [STRUCTURE.md](./STRUCTURE.md) - Project organization
4. [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) - Community guidelines

---

## First Week

### Day 1-2: Explore the Codebase

- Run the app and click through all pages
- Try all five platforms
- Switch between themes
- Test on mobile viewport

### Day 3-4: Understand the Architecture

Read these docs:

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical design
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - Styling guidelines
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development patterns

### Day 5: First Contribution

Make a small contribution:

1. Find a "good first issue" label
2. Or fix a typo in documentation
3. Or improve a component's accessibility
4. Follow [CONTRIBUTING.md](../CONTRIBUTING.md)

---

## Development Environment

### Required Tools

| Tool    | Version | Purpose            |
| ------- | ------- | ------------------ |
| Node.js | 18+     | JavaScript runtime |
| npm/bun | Latest  | Package manager    |
| Git     | Latest  | Version control    |
| VS Code | Latest  | Recommended editor |

### VS Code Extensions

Install these for the best experience:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "dsznajder.es7-react-js-snippets",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Variables are auto-configured for Lovable Cloud
```

---

## Codebase Overview

### Directory Structure

```
alawein-platform/
├── src/
│   ├── components/       # Shared UI components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── shared/      # Cross-platform components
│   │   └── [feature]/   # Feature-specific components
│   ├── pages/           # Route pages
│   ├── projects/        # Platform-specific code
│   │   └── pages/
│   │       ├── simcore/
│   │       ├── mezan/
│   │       ├── talai/
│   │       ├── optilibria/
│   │       └── qmlab/
│   ├── hooks/           # Custom React hooks
│   ├── stores/          # Zustand state stores
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
├── docs/                # Documentation
├── tests/               # Playwright tests
└── supabase/           # Edge functions
```

### Key Files to Know

| File                 | Purpose                  |
| -------------------- | ------------------------ |
| `src/App.tsx`        | Root component & routing |
| `src/index.css`      | Design system tokens     |
| `tailwind.config.ts` | Tailwind configuration   |
| `src/components/ui/` | All UI components        |

---

## Key Concepts

### 1. Design System

We use semantic tokens, not raw colors:

```tsx
// ✅ Correct
<div className="bg-background text-foreground">

// ❌ Wrong
<div className="bg-white text-black">
```

### 2. Component Patterns

```tsx
// Always use TypeScript interfaces
interface ButtonProps {
  label: string;
  onClick?: () => void;
}

// Export named functions
export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

### 3. Import Aliases

```tsx
// Use path aliases
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
```

### 4. State Management

- **Local state**: `useState` for component state
- **Global state**: Zustand stores in `src/stores/`
- **Server state**: TanStack Query for API data

---

## Communication

### Asking Questions

1. **Check documentation first** - Answer might be in `docs/`
2. **Search existing issues** - Someone may have asked before
3. **Ask in public channels** - Others can benefit from answers
4. **Be specific** - Include error messages, screenshots

### Code Reviews

- Be respectful and constructive
- Explain the "why" behind suggestions
- Approve with minor suggestions inline
- Request changes only for blocking issues

---

## Resources

### Documentation

| Document                            | Content             |
| ----------------------------------- | ------------------- |
| [API Reference](./API_REFERENCE.md) | API documentation   |
| [TESTING.md](./TESTING.md)          | Testing guidelines  |
| [GLOSSARY.md](./GLOSSARY.md)        | Project terminology |
| [FAQ.md](./FAQ.md)                  | Common questions    |

### External Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand](https://github.com/pmndrs/zustand)

---

## Checklist

### First Day

- [ ] Repository access granted
- [ ] Project cloned and running
- [ ] Read README and QUICK_START
- [ ] Explored the app in browser

### First Week

- [ ] Read ARCHITECTURE and DESIGN_SYSTEM
- [ ] Understood project structure
- [ ] Made first contribution
- [ ] Attended team meeting

### First Month

- [ ] Completed a feature or fix
- [ ] Reviewed someone else's PR
- [ ] Updated documentation
- [ ] Comfortable with codebase

---

## Getting Help

- **Technical questions**: Check docs first, then ask team
- **Process questions**: Ask your onboarding buddy
- **Tooling issues**: Check TROUBLESHOOTING.md

Welcome aboard! We're excited to have you on the team. 🎉
