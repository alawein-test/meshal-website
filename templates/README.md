# Templates Directory

This directory contains **template metadata and documentation** for the Alawein
platform implementations.

> **Note:** Actual platform code is located in `src/projects/pages/`. This
> directory serves as a reference and configuration hub.

## Contents

| File                               | Purpose                               |
| ---------------------------------- | ------------------------------------- |
| `config.json`                      | Platform metadata and tech stack info |
| `README.md`                        | This file                             |
| `platforms/template-metadata.json` | Detailed platform specifications      |

## Platform Implementations

All platforms are implemented in the main source code:

| Platform   | Dashboard Location               | API Location                         |
| ---------- | -------------------------------- | ------------------------------------ |
| SimCore    | `src/projects/pages/simcore/`    | `supabase/functions/simcore-api/`    |
| MEZAN      | `src/projects/pages/mezan/`      | `supabase/functions/mezan-api/`      |
| TalAI      | `src/projects/pages/talai/`      | `supabase/functions/talai-api/`      |
| OptiLibria | `src/projects/pages/optilibria/` | `supabase/functions/optilibria-api/` |
| QMLab      | `src/projects/pages/qmlab/`      | `supabase/functions/qmlab-api/`      |

## Platform Overview

### SimCore - Scientific Computing

- Scientific computing and simulation platform
- Real-time data visualization with Recharts
- 3D visualization with Three.js

### MEZAN - Enterprise Automation

- Workflow automation with Arabic/English support
- Task and process management
- Real-time monitoring

### TalAI - AI Research

- AI/ML experiment tracking
- Model training and management
- Hyperparameter optimization

### OptiLibria - Algorithm Optimization

- 31+ optimization algorithms
- Performance benchmarking
- Result comparison

### QMLab - Quantum Computing

- Quantum mechanics laboratory
- Wave function visualization
- Particle simulation

## Configuration

Platform configuration is centralized in `src/projects/config.ts`:

```ts
export const projectRegistry = {
  simcore: { id: 'simcore', name: 'SimCore', ... },
  mezan: { id: 'mezan', name: 'MEZAN', ... },
  talai: { id: 'talai', name: 'TalAI', ... },
  optilibria: { id: 'optilibria', name: 'OptiLibria', ... },
  qmlab: { id: 'qmlab', name: 'QMLab', ... },
};
```

## Adding a New Platform

1. Add config to `src/projects/config.ts`
2. Create dashboard in `src/projects/pages/{name}/`
3. Create edge function in `supabase/functions/{name}-api/`
4. Add route to `src/App.tsx`
5. Update `templates/config.json` with metadata

See [docs/QUICK_START.md](../docs/QUICK_START.md) for detailed instructions.

## Tech Stack

| Category      | Technologies                              |
| ------------- | ----------------------------------------- |
| Frontend      | React 18, TypeScript, Tailwind CSS, Vite  |
| State         | Zustand, TanStack Query                   |
| Visualization | Recharts, Three.js, Framer Motion         |
| Backend       | Lovable Cloud, Edge Functions, PostgreSQL |

---

**Last Updated:** 2024-12-09
