# Contributing to Alawein Platform

> Last verified: 2025-12-09

Thank you for your interest in contributing! This guide will help you get
started.

---

## Table of Contents

- Code of Conduct
- Getting Started
- Development Workflow
- Commit Message Convention
- Pull Request Process
- Code Style Guidelines

---

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun
- Git

### Setup

```bash
# Clone the repository
git clone <repo-url>
cd alawein-platform

# Install dependencies
npm install

# Start development server
npm run dev
```

### Project Overview

Read these docs before contributing:

- [QUICK_START.md](docs/QUICK_START.md) - 5-minute setup
- [STRUCTURE.md](docs/STRUCTURE.md) - Project layout
- [DEVELOPMENT.md](docs/DEVELOPMENT.md) - Development patterns
- [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) - Styling guidelines

---

## Development Workflow

### 1. Create a Branch

```bash
# For features
git checkout -b feat/your-feature-name

# For fixes
git checkout -b fix/issue-description

# For documentation
git checkout -b docs/what-you-updated
```

### 2. Make Your Changes

- Follow the code style guidelines
- Write meaningful commit messages
- Keep changes focused and atomic

### 3. Test Your Changes

```bash
# Run linting
npm run lint

# Run formatting
npm run format

# Run Playwright tests (if applicable)
npx playwright test
```

### 4. Submit a Pull Request

- Push your branch to GitHub
- Open a PR against the `main` branch
- Fill out the PR template
- Wait for review

---

## Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/). All commit
messages must follow this format:

```
<type>(<scope>): <subject>
```

### Types

| Type       | Description                          |
| ---------- | ------------------------------------ |
| `feat`     | New feature                          |
| `fix`      | Bug fix                              |
| `docs`     | Documentation changes                |
| `refactor` | Code refactoring (no feature change) |
| `test`     | Adding or updating tests             |
| `chore`    | Maintenance tasks                    |
| `perf`     | Performance improvements             |
| `ci`       | CI/CD changes                        |

### Scopes

| Scope        | Description              |
| ------------ | ------------------------ |
| `simcore`    | SimCore platform         |
| `mezan`      | MEZAN platform           |
| `talai`      | TalAI platform           |
| `optilibria` | OptiLibria platform      |
| `qmlab`      | QMLab platform           |
| `components` | UI components            |
| `docs`       | Documentation            |
| `deps`       | Dependencies             |
| `config`     | Configuration            |
| `repo`       | Repository-level changes |

### Examples

```bash
# Good examples
feat(simcore): add real-time simulation chart
fix(mezan): resolve workflow save issue
docs(readme): update installation instructions
refactor(components): extract button variants
chore(deps): update react to 18.3
test(auth): add login flow tests

# Bad examples
Fixed bug                    # Missing type and scope
feat: add feature            # Missing scope
FEAT(simcore): Add Chart     # Wrong case
```

### Commit Message Rules

- **Type**: Required, lowercase
- **Scope**: Required, lowercase
- **Subject**: Required, lowercase, no period at end
- Max 72 characters for subject line

---

## Pull Request Process

### Before Submitting

1. ✅ Code follows style guidelines
2. ✅ All tests pass
3. ✅ Commit messages follow convention
4. ✅ Branch is up-to-date with `main`
5. ✅ No merge conflicts

### PR Title Format

Same as commit messages:

```
feat(simcore): add particle visualization
```

### PR Description Template

```markdown
## Summary

Brief description of changes.

## Changes

- Added X component
- Updated Y function
- Fixed Z issue

## Testing

- [ ] Tested locally
- [ ] Works in all themes
- [ ] Responsive on mobile

## Screenshots (if UI changes)

[Add screenshots here]

## Related Issues

Closes #123
```

### Review Process

1. Submit PR
2. Automated checks run (lint, tests)
3. Reviewer provides feedback
4. Address feedback with new commits
5. Reviewer approves
6. Merge to `main`

---

## Code Style Guidelines

### TypeScript

```tsx
// ✅ Use interfaces for props
interface ButtonProps {
  label: string;
  onClick?: () => void;
}

// ✅ Use named exports
export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

// ❌ Avoid any
const data: any = fetchData();

// ✅ Type properly
const data: UserData = fetchData();
```

### React Components

```tsx
// ✅ Functional components with TypeScript
export function UserCard({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
    </Card>
  );
}
```

### Styling

```tsx
// ✅ Use semantic tokens
<div className="bg-background text-foreground">
<div className="bg-primary text-primary-foreground">

// ❌ Never use raw colors
<div className="bg-purple-500 text-white">
```

### Imports

```tsx
// ✅ Use path aliases
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

// ❌ Avoid deep relative imports
import { Button } from '../../../components/ui/button';
```

### File Organization

- One component per file
- Colocate related files (component + types + styles)
- Use barrel exports (`index.ts`) for directories

---

## Issue Templates

We provide templates for common issue types:

- **Bug Report**: Use for reporting bugs and unexpected behavior
- **Feature Request**: Use for suggesting new features
- **Documentation**: Use for documentation improvements

Find templates in `.github/ISSUE_TEMPLATE/`.

---

## PR Template

All pull requests use our PR template automatically. Key sections:

- **Summary**: Brief description of changes
- **Type of Change**: Bug fix, feature, breaking change, etc.
- **Testing**: Checklist of testing performed
- **Platform Impact**: Which platforms are affected

---

## Questions?

- Check existing documentation in `docs/`
- Check [FAQ.md](docs/FAQ.md) for common questions
- Look at similar code in the codebase
- Open an issue for discussion

Thank you for contributing! 🎉
