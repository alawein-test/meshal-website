# Changelog Guide

> Last verified: 2025-12-09

How to write clear, consistent changelog entries for the Alawein Platform.

---

## Table of Contents

1. Format Overview
2. Entry Types
3. Writing Good Entries
4. Examples
5. Versioning Guidelines
6. Common Mistakes

---

## Format Overview

The changelog follows [Keep a Changelog](https://keepachangelog.com/) format:

```markdown
## [Unreleased]

### Added

- New feature description

### Changed

- Modified behavior description

### Fixed

- Bug fix description

---

## [1.2.0] - 2025-12-15

### Added

- Feature that was released
```

### Key Principles

1. **Newest entries at the top** - Most recent version first
2. **Unreleased section** - Collect changes before release
3. **Date format** - Use ISO format: `YYYY-MM-DD`
4. **Human-readable** - Write for developers, not machines

---

## Entry Types

### Added

New features or capabilities.

```markdown
### Added

- User authentication with email/password login
- SimCore simulation dashboard with real-time progress
- Export functionality for experiment data (CSV, JSON)
```

### Changed

Modifications to existing functionality.

```markdown
### Changed

- Improved simulation performance by 40%
- Updated design tokens for better contrast ratios
- Refactored authentication flow to use Zustand
```

### Deprecated

Features that will be removed in future versions.

```markdown
### Deprecated

- Legacy `/api/v1/` endpoints (use `/functions/v1/` instead)
- `useOldAuth` hook (migrate to `useAuthStore`)
```

### Removed

Features that have been removed.

```markdown
### Removed

- Removed support for Node.js 16
- Removed deprecated `theme.legacy` color tokens
```

### Fixed

Bug fixes.

```markdown
### Fixed

- Fixed authentication redirect loop on expired sessions
- Fixed chart rendering on mobile viewports
- Fixed memory leak in real-time simulation updates
```

### Security

Security-related changes.

```markdown
### Security

- Updated dependencies to patch XSS vulnerability
- Added CSRF protection to form submissions
- Implemented rate limiting on authentication endpoints
```

---

## Writing Good Entries

### Do's

✅ **Start with a verb** (past tense or imperative)

```markdown
- Added user profile editing
- Fixed login button alignment
- Updated TanStack Query to v5
```

✅ **Be specific about what changed**

```markdown
- Added CSV export for simulation results with custom column selection
```

✅ **Include context when helpful**

```markdown
- Fixed chart tooltips not displaying on touch devices (iOS Safari)
```

✅ **Reference issues/PRs for complex changes**

```markdown
- Refactored authentication system (#123)
```

### Don'ts

❌ **Avoid vague descriptions**

```markdown
# Bad

- Fixed bug
- Updated code
- Made improvements

# Good

- Fixed simulation progress bar stuck at 99%
- Updated auth flow to handle session expiry
- Improved dashboard load time by lazy loading charts
```

❌ **Avoid implementation details**

```markdown
# Bad

- Changed useState to useReducer in SimCoreDashboard

# Good

- Improved simulation state management for complex workflows
```

❌ **Avoid duplicate entries**

```markdown
# Bad

- Added export button
- Export button now works
- Fixed export functionality

# Good

- Added data export functionality with CSV and JSON formats
```

---

## Examples

### Feature Release Entry

```markdown
## [1.3.0] - 2025-12-20

### Added

- **OptiLibria**: Added 5 new optimization algorithms
  - Simulated Annealing
  - Tabu Search
  - Harmony Search
  - Firefly Algorithm
  - Cuckoo Search
- Export optimization results to PDF with convergence charts
- Dark mode toggle in user settings

### Changed

- Redesigned Projects Hub with card-based layout
- Improved algorithm selection UI with category filters
- Updated Framer Motion to v12 for better performance

### Fixed

- Fixed algorithm comparison chart legend overlap on mobile
- Fixed optimization run not stopping when navigating away
- Fixed incorrect best score display for minimization problems
```

### Bug Fix Release Entry

```markdown
## [1.2.1] - 2025-12-18

### Fixed

- Fixed authentication token not refreshing on session timeout
- Fixed simulation progress updates stopping after browser tab switch
- Fixed incorrect date formatting in experiment timestamps

### Security

- Updated `vite` to 5.4.3 to address CVE-2024-XXXXX
```

### Breaking Change Entry

```markdown
## [2.0.0] - 2025-12-25

### ⚠️ Breaking Changes

- Minimum Node.js version is now 20 (was 18)
- Removed deprecated `useSimulation` hook (use `useSimulations` instead)
- Changed simulation config format (see migration guide)

### Added

- New unified API client for all platform endpoints
- Real-time collaboration on experiments
- Multi-language support (English, Arabic)

### Changed

- Complete redesign of the authentication flow
- Migrated state management from Redux to Zustand
- Updated to React 19

### Removed

- Removed legacy `/api/` endpoints
- Removed deprecated theme variants
```

---

## Versioning Guidelines

### When to Bump Versions

| Version           | When to Use                      | Example                               |
| ----------------- | -------------------------------- | ------------------------------------- |
| **Major** (X.0.0) | Breaking changes, major features | Removing APIs, changing data formats  |
| **Minor** (0.X.0) | New features, non-breaking       | Adding new platform, new UI component |
| **Patch** (0.0.X) | Bug fixes, minor updates         | Fixing bugs, updating docs            |

### Pre-release Versions

```markdown
## [2.0.0-beta.1] - 2025-12-20

### Added

- Beta: New collaboration features (feedback welcome)
```

### Release Process

1. Collect entries under `[Unreleased]`
2. When releasing, move entries to new version section
3. Add release date in ISO format
4. Update version links at bottom of file

```markdown
[Unreleased]: https://github.com/org/repo/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/org/repo/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/org/repo/releases/tag/v1.2.0
```

---

## Common Mistakes

### 1. Mixing implementation and user impact

❌ **Bad**:

```markdown
- Changed handleSubmit to use async/await
```

✅ **Good**:

```markdown
- Fixed form submission freezing on slow connections
```

### 2. Forgetting to categorize

❌ **Bad**:

```markdown
## [1.2.0]

- New export feature
- Fixed button
- Updated library
```

✅ **Good**:

```markdown
## [1.2.0]

### Added

- New export feature for simulation data

### Fixed

- Fixed submit button not responding on double-click

### Changed

- Updated charting library to Recharts v3
```

### 3. Too much or too little detail

❌ **Too little**:

```markdown
- Fixed auth
```

❌ **Too much**:

```markdown
- Fixed authentication by updating the useAuthStore hook to properly handle the
  case where the JWT token expires while the user is on a protected route, which
  was causing an infinite redirect loop between the dashboard and login page, by
  adding a check for token expiry in the ProtectedRoute component before
  attempting to verify the session
```

✅ **Just right**:

```markdown
- Fixed infinite redirect loop when session expires on protected routes
```

---

## Changelog Maintenance

### Weekly Tasks

- Add entries for completed features/fixes
- Ensure entries are properly categorized

### Release Tasks

1. Review all entries in `[Unreleased]`
2. Consolidate related entries
3. Move to new version section
4. Add release date
5. Update version links
6. Commit with message: `chore: release v1.2.0`

### Quarterly Tasks

- Archive very old entries to separate file if needed
- Review and update versioning strategy
