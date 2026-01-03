# 📋 Repository Standards & Naming Conventions

> This document defines the naming conventions and standards to be applied
> consistently across all repositories.

## Table of Contents

- Project Naming
- File Naming Conventions
- Directory Structure
- Component Naming
- Documentation Standards
- Code Organization
- Git Conventions

---

## Project Naming

### Repository Name

- Use **kebab-case** for repository names

- Format: `{brand}-{product}-{type}`

- Examples:
  - `repz-elite-coaching`
  - `repz-nutrition-tracker`
  - `repz-workout-logger`
  - `meshal-website`

### Package Name (package.json)

- Should match repository name

- Use **kebab-case**

- Example: `"name": "meshal-website"`

---

## File Naming Conventions

### Documentation Files

| Type            | Convention                  | Examples                                      |
| --------------- | --------------------------- | --------------------------------------------- |
| Root docs       | **SCREAMING_SNAKE_CASE.md** | `README.md`, `SECURITY.md`, `CONTRIBUTING.md` |
| Regular docs    | **kebab-case.md**           | `deployment-guide.md`, `api-reference.md`     |
| Audit reports   | **kebab-case-audit.md**     | `security-audit.md`, `dependency-audit.md`    |
| Technical specs | **kebab-case-spec.md**      | `theme-system-spec.md`, `auth-flow-spec.md`   |

### Code Files

| Type       | Convention                  | Examples                                        |
| ---------- | --------------------------- | ----------------------------------------------- |
| Components | **PascalCase.tsx**          | `UserProfile.tsx`, `DashboardHeader.tsx`        |
| Utilities  | **kebab-case.ts**           | `date-utils.ts`, `api-client.ts`                |
| Types      | **kebab-case.types.ts**     | `user.types.ts`, `api.types.ts`                 |
| Constants  | **kebab-case.constants.ts** | `api.constants.ts`, `theme.constants.ts`        |
| Hooks      | **kebab-case.hook.ts**      | `use-auth.hook.ts`, `use-local-storage.hook.ts` |
| Tests      | **kebab-case.test.ts**      | `user-profile.test.ts`, `api-client.test.ts`    |
| Stories    | **kebab-case.stories.ts**   | `button.stories.ts`, `modal.stories.ts`         |

### Configuration Files

| Type        | Convention                  | Examples                             |
| ----------- | --------------------------- | ------------------------------------ |
| Config      | **kebab-case.config.js/ts** | `vite.config.ts`, `eslint.config.js` |
| Environment | **.env**                    | `.env`, `.env.example`, `.env.local` |

---

## Directory Structure

```
project-root/
├── .github/                 # GitHub workflows and templates
│   ├── workflows/
│   └── ISSUE_TEMPLATE/
├── _docs_archive/           # Archived documentation (underscore prefix)
├── docs/                    # Active documentation
│   ├── guides/              # User guides
│   ├── api/                 # API documentation
│   └── architecture/        # Architecture docs
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── shared/          # Generic components
│   │   ├── features/        # Feature-specific components
│   │   └── layout/          # Layout components
│   ├── pages/               # Page components
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript type definitions
│   ├── constants/           # Application constants
│   ├── services/            # API and external services
│   └── assets/              # Static assets
│       ├── images/
│       ├── icons/
│       └── fonts/
├── tests/                   # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── scripts/                 # Build and utility scripts
└── public/                  # Public static files
```

### Directory Naming

- Use **kebab-case** for all directories

- Use underscore prefix for special directories: `_docs_archive`, `_temp`

- Feature directories should be singular: `components/`, `hooks/`, `utils/`

---

## Component Naming

### React Components

- Use **PascalCase** for component names

- File name should match component name

- Use descriptive names that reflect functionality

```tsx
// ✅ Good
UserProfile.tsx
export const UserProfile = () => { ... }

DashboardHeader.tsx
export const DashboardHeader = () => { ... }

// ❌ Bad
userprofile.tsx
dashboard_header.tsx
Header.tsx (too generic)
```

### Component Organization

- Group related components in subdirectories

- Use index files for cleaner imports

- Separate presentational from container components

```
components/
├── user/
│   ├── UserProfile.tsx
│   ├── UserAvatar.tsx
│   ├── UserSettings.tsx
│   └── index.ts
├── dashboard/
│   ├── DashboardHeader.tsx
│   ├── DashboardStats.tsx
│   └── index.ts
```

---

## Documentation Standards

### File Naming

- Root documentation: **SCREAMING_SNAKE_CASE.md**

- Nested documentation: **kebab-case.md**

- Numbered lists for sequences: `01-getting-started.md`, `02-configuration.md`

### Documentation Structure

```markdown
# Title (H1)

Brief description.

## Table of Contents (if long)

## Section 1 (H2)

### Subsection (H3)

- Use bullet points for lists

- Include code examples with language specifiers

- Add proper blank lines around headings and code blocks
```

### Required Documentation

Every repository should include:

- `README.md` - Project overview and quick start

- `CONTRIBUTING.md` - Contribution guidelines

- `CHANGELOG.md` - Version history

- `SECURITY.md` - Security policy

- `LICENSE` - License file

---

## Code Organization

### Import Order

1. External libraries (React, etc.)
2. Internal modules (use @/ alias)
3. Relative imports
4. Types only imports

```typescript
// ✅ Good
import React from 'react';
import { Button } from '@/components/shared';
import { UserAvatar } from './UserAvatar';
import type { User } from '@/types/user';
```

### Export Patterns

- Use named exports for components
- Use default exports only for pages or main exports
- Group related exports

```typescript
// ✅ Good
export const UserProfile = () => { ... };
export const UserAvatar = () => { ... };
export type UserProps = { ... };

// ❌ Avoid
export default UserProfile; // Unless it's a page component
```

---

## Git Conventions

### Branch Naming

- Use **kebab-case**
- Format: `{type}/{description}`
- Types: `feat/`, `fix/`, `docs/`, `refactor/`, `test/`, `chore/`

```bash
feat/user-authentication
fix/login-validation
docs/api-endpoints
refactor/component-structure
```

### Commit Messages

Follow Conventional Commits:

```bash
type(scope): description

feat(auth): add user authentication
fix(api): resolve login timeout issue
docs(readme): update installation guide
```

---

## Migration Checklist

When applying these standards to an existing repository:

1. ✅ Rename root documentation to SCREAMING_SNAKE_CASE
2. ✅ Rename nested documentation to kebab-case
3. ✅ Ensure all components use PascalCase
4. ✅ Organize files into proper directory structure
5. ✅ Update import statements
6. ✅ Verify build still works
7. ✅ Update documentation to reflect new structure

---

## Tools & Automation

### Recommended Linting Rules

```json
{
  "rules": {
    "filenames/match-regex": [2, "^(?!.*[A-Z])[a-z0-9-]+$"],
    "filenames/match-exported": 2,
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index"
        ]
      }
    ]
  }
}
```

### Naming Convention Checker Script

```bash
# scripts/check-naming-conventions.sh
#!/bin/bash
echo "Checking naming conventions..."
# Add checks for file naming patterns
```

---

## Examples

### Before (Inconsistent)

```
alawein-platform/
├── VALIDATION_RESULTS.md
├── ThemeFixesApplied.md
├── security_dependency_audit.md
├── src/components/userProfile.tsx
├── src/components/dashboard-header.tsx
└── docs/API_Reference.md
```

### After (Consistent)

```
meshal-website/
├── VALIDATION_RESULTS.md
├── THEME_FIXES.md
├── SECURITY_DEPENDENCY_AUDIT.md
├── src/components/UserProfile.tsx
├── src/components/DashboardHeader.tsx
└── docs/api-reference.md
```

---

**Version**: 1.0.0 **Last Updated**: December 2024 **Apply to**: All new and
existing repositories
