# Changelog Automation Guide

> Last verified: 2025-12-09

---

## Overview

This guide explains how to automate changelog generation using conventional
commits, ensuring consistent and informative release notes.

---

## Table of Contents

1. Conventional Commits
2. Commit Message Format
3. Automation Tools
4. Setup Guide
5. CI/CD Integration
6. Best Practices

---

## Conventional Commits

The [Conventional Commits](https://www.conventionalcommits.org/) specification
provides a standardized format for commit messages that enables automated
changelog generation.

### Benefits

- **Automatic changelog generation** - Tools parse commits to create release
  notes
- **Semantic versioning** - Determine version bumps from commit types
- **Clear history** - Standardized messages improve readability
- **CI/CD automation** - Trigger actions based on commit types

---

## Commit Message Format

### Basic Structure

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Types

| Type       | Description      | Version Bump | Changelog Section |
| ---------- | ---------------- | ------------ | ----------------- |
| `feat`     | New feature      | Minor        | Added             |
| `fix`      | Bug fix          | Patch        | Fixed             |
| `docs`     | Documentation    | None         | -                 |
| `style`    | Formatting       | None         | -                 |
| `refactor` | Code restructure | None         | Changed           |
| `perf`     | Performance      | Patch        | Changed           |
| `test`     | Testing          | None         | -                 |
| `chore`    | Maintenance      | None         | -                 |
| `ci`       | CI/CD changes    | None         | -                 |
| `build`    | Build system     | None         | -                 |

### Scopes

Scopes indicate the affected area:

```
feat(auth): add OAuth2 support
fix(dashboard): resolve chart rendering issue
docs(api): update endpoint documentation
refactor(hooks): simplify useAuth implementation
```

**Common scopes:**

- `auth` - Authentication
- `dashboard` - Dashboard components
- `api` - API/Edge functions
- `ui` - UI components
- `hooks` - Custom hooks
- `config` - Configuration
- `deps` - Dependencies

### Breaking Changes

Use `!` after type/scope or add `BREAKING CHANGE:` in footer:

```
feat(api)!: change authentication endpoint structure

BREAKING CHANGE: The /auth/login endpoint now requires
a different request body format.
```

### Examples

**Feature:**

```
feat(dashboard): add real-time data refresh

Implement WebSocket connection for live updates.
Includes automatic reconnection on connection loss.

Closes #123
```

**Bug Fix:**

```
fix(auth): prevent session timeout on active use

The session was expiring even when the user was actively
using the application. Now resets timeout on any activity.

Fixes #456
```

**Documentation:**

```
docs(readme): update installation instructions

- Add prerequisites section
- Include troubleshooting tips
- Update screenshots
```

---

## Automation Tools

### Option 1: standard-version (Recommended)

Automates versioning and changelog generation.

```bash
# Install
npm install --save-dev standard-version

# Add to package.json
{
  "scripts": {
    "release": "standard-version",
    "release:minor": "standard-version --release-as minor",
    "release:major": "standard-version --release-as major",
    "release:patch": "standard-version --release-as patch"
  }
}
```

**Configuration (.versionrc.json):**

```json
{
  "types": [
    { "type": "feat", "section": "✨ Features" },
    { "type": "fix", "section": "🐛 Bug Fixes" },
    { "type": "perf", "section": "⚡ Performance" },
    { "type": "refactor", "section": "♻️ Refactoring" },
    { "type": "docs", "section": "📚 Documentation", "hidden": false },
    { "type": "chore", "hidden": true },
    { "type": "test", "hidden": true },
    { "type": "ci", "hidden": true }
  ],
  "commitUrlFormat": "https://github.com/your-org/alawein-platform/commit/{{hash}}",
  "compareUrlFormat": "https://github.com/your-org/alawein-platform/compare/{{previousTag}}...{{currentTag}}"
}
```

### Option 2: semantic-release

Fully automated releases including npm publishing.

```bash
# Install
npm install --save-dev semantic-release @semantic-release/changelog @semantic-release/git

# Configuration (.releaserc.json)
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    ["@semantic-release/changelog", {
      "changelogFile": "CHANGELOG.md"
    }],
    "@semantic-release/npm",
    ["@semantic-release/git", {
      "assets": ["CHANGELOG.md", "package.json"],
      "message": "chore(release): ${nextRelease.version} [skip ci]"
    }],
    "@semantic-release/github"
  ]
}
```

### Option 3: release-please (Google)

GitHub Action for automated releases.

```yaml
# .github/workflows/release-please.yml
name: Release Please

on:
  push:
    branches: [main]

jobs:
  release-please:
    runs-on: ubuntu-latest
    steps:
      - uses: google-github-actions/release-please-action@v4
        with:
          release-type: node
          package-name: alawein-platform
```

---

## Setup Guide

### Step 1: Install Dependencies

```bash
npm install --save-dev \
  @commitlint/cli \
  @commitlint/config-conventional \
  husky \
  standard-version
```

### Step 2: Configure Commitlint

**commitlint.config.js:**

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'ci',
        'build',
        'revert',
      ],
    ],
    'scope-enum': [
      1,
      'always',
      [
        'auth',
        'dashboard',
        'api',
        'ui',
        'hooks',
        'config',
        'deps',
        'docs',
        'tests',
      ],
    ],
    'subject-case': [2, 'always', 'lower-case'],
    'header-max-length': [2, 'always', 72],
  },
};
```

### Step 3: Configure Husky

```bash
# Initialize Husky
npx husky install

# Add commit-msg hook
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

### Step 4: Add Release Scripts

**package.json:**

```json
{
  "scripts": {
    "prepare": "husky install",
    "release": "standard-version",
    "release:first": "standard-version --first-release",
    "release:dry": "standard-version --dry-run",
    "release:alpha": "standard-version --prerelease alpha",
    "release:beta": "standard-version --prerelease beta"
  }
}
```

---

## CI/CD Integration

### GitHub Actions Release Workflow

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      release_type:
        description: 'Release type (patch/minor/major)'
        required: true
        default: 'patch'
        type: choice
        options:
          - patch
          - minor
          - major

jobs:
  release:
    name: Create Release
    runs-on: ubuntu-latest
    if: "!contains(github.event.head_commit.message, 'chore(release)')"

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Configure Git
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"

      - name: Run tests
        run: npm run test -- --run

      - name: Create release
        run: |
          if [ "${{ github.event_name }}" = "workflow_dispatch" ]; then
            npm run release -- --release-as ${{ github.event.inputs.release_type }}
          else
            npm run release
          fi

      - name: Push changes
        run: git push --follow-tags origin main

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v1
        with:
          tag_name: ${{ steps.version.outputs.tag }}
          body_path: CHANGELOG.md
          draft: false
          prerelease: false
```

### Automated Changelog Updates

```yaml
# .github/workflows/changelog.yml
name: Update Changelog

on:
  pull_request:
    types: [closed]
    branches: [main]

jobs:
  update-changelog:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Generate changelog entry
        run: |
          echo "## Changes in this PR" >> pr-changelog.md
          echo "" >> pr-changelog.md
          git log --pretty=format:"- %s" ${{ github.event.pull_request.base.sha }}..${{ github.event.pull_request.head.sha }} >> pr-changelog.md

      - name: Upload changelog artifact
        uses: actions/upload-artifact@v4
        with:
          name: pr-changelog
          path: pr-changelog.md
```

---

## Best Practices

### Writing Good Commit Messages

**Do:**

- ✅ Use imperative mood: "add feature" not "added feature"
- ✅ Keep subject under 72 characters
- ✅ Separate subject from body with blank line
- ✅ Reference issues when applicable
- ✅ Explain "what" and "why", not "how"

**Don't:**

- ❌ Use vague messages: "fix bug", "update code"
- ❌ Include implementation details in subject
- ❌ Mix multiple changes in one commit
- ❌ Forget to mark breaking changes

### Commit Frequency

```
# Good: Atomic commits
feat(auth): add login form component
feat(auth): add form validation
feat(auth): integrate with auth API
test(auth): add login form tests

# Bad: Large monolithic commit
feat(auth): add complete authentication system with login,
signup, password reset, and tests
```

### Squashing Commits

Before merging PRs, consider squashing related commits:

```bash
# Squash last 3 commits
git rebase -i HEAD~3

# Change 'pick' to 'squash' for commits to combine
```

### Version Bump Rules

| Commit Type                  | Description      | Version Change    |
| ---------------------------- | ---------------- | ----------------- |
| `fix:`                       | Bug fixes        | `1.0.0` → `1.0.1` |
| `feat:`                      | New features     | `1.0.0` → `1.1.0` |
| `feat!:` / `BREAKING CHANGE` | Breaking changes | `1.0.0` → `2.0.0` |

---

## Troubleshooting

### Commit Rejected by Commitlint

```bash
# Check commit message format
echo "feat(auth): add login" | npx commitlint

# View commitlint rules
npx commitlint --print-config
```

### Changelog Not Updating

```bash
# Verify conventional commit format
git log --oneline -10

# Run dry-run to preview
npm run release:dry
```

### Wrong Version Bump

```bash
# Force specific version
npm run release -- --release-as 1.2.3

# Skip version bump
npm run release -- --skip.bump
```

---

## Related Documentation

- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [CHANGELOG_GUIDE.md](./CHANGELOG_GUIDE.md) - Manual changelog writing
- [CHANGELOG.md](../CHANGELOG.md) - Project changelog
- [pr-checks.yml](../.github/workflows/pr-checks.yml) - CI workflow
