# Repository Governance & Quality Standards

> Last verified: 2025-12-09

**Purpose:** Maintain a clean, organized repository with strict standards and no
policy slips. **Scope:** Internal governance (no CI/CD, local validation only)
**Enforcement:** Pre-commit hooks, local scripts, and developer practices

---

## Table of Contents

1. Folder Structure Standards

2. File Naming Conventions

3. Git Workflow Standards

4. Pre-commit Hooks & Local Validation

5. Code Quality Standards

6. Commit Message Standards

7. Import & Dependency Rules

8. Security Standards

9. Testing Standards

10. Documentation Requirements

11. Review Checklist

12. Enforcement Tools

13. Policy Violations & Fixes

---

## Folder Structure Standards

### Sacred Folder Rules

```bash

alawein-platform/
├── packages/                    ✅ STRICT: Only workspace packages
│   ├── @alawein/design-system  (npm package)
│   ├── @alawein/ui-components  (npm package)
│   └── [more @alawein/* packages only]
│
├── design-system/              ✅ STRICT: Design system only
│   ├── src/
│   │   ├── tokens/            (token files only)
│   │   ├── themes/            (theme files only)
│   │   └── context/           (React context only)
│   └── package.json
│
├── templates/                   ✅ STRICT: Platform templates only
│   ├── platforms/
│   │   ├── simcore/          (complete platform)
│   │   ├── mezan/            (complete platform)
│   │   └── [5 platforms only]
│   ├── styles/               (design templates)
│   └── shared/               (shared resources)
│
├── src/                        ✅ STRICT: Main app only
│   ├── projects/             (platform dashboards)
│   ├── pages/                (route pages)
│   ├── components/           (shared components)
│   ├── stores/               (state management)
│   └── index.tsx             (main entry)
│
├── docs/                       ✅ STRICT: Documentation only
│   ├── deployment/           (deployment guides)
│   └── *.md                  (markdown docs)
│
├── tests/                      ✅ STRICT: Tests only
│   ├── unit/                 (unit tests)
│   ├── e2e/                  (E2E tests)
│   └── integration/          (integration tests)
│
└── [root config files only]   ✅ STRICT: Configs + docs
    ├── *.config.ts | js        (configs)
    ├── *.json                (package.json, tsconfig, etc.)
    └── *.md                  (documentation)

```text

### Folder Structure Enforcement

#### ✅ ALLOWED FOLDERS

```bash

packages/
├── @alawein/[package-name]/
│   ├── src/
│   ├── tests/
│   ├── dist/
│   ├── package.json
│   └── tsconfig.json

src/
├── projects/
│   └── pages/[platform-name]/
│       ├── [PlatformName]Dashboard.tsx
│       ├── components/
│       └── utils/
├── components/
│   ├── [ComponentName].tsx
│   └── [category]/
├── pages/
│   └── [PageName].tsx
└── stores/
    └── [storeName].ts

```text

#### ❌ NOT ALLOWED

```text

❌ src/utils/random-function.ts (should be in specific module)
❌ src/helpers/ (use utils inside modules instead)
❌ packages/other-scope/ (must be @alawein/*)
❌ src/[orphan files] (must be in logical folders)
❌ Random subfolders at root (must follow structure)
❌ Temporary folders (test, temp, tmp, etc.)

```text

### Validation Script

```bash

# Create .repo-structure-rules.json
{
  "rules": {
    "packages/*": {
      "pattern": "@alawein/[a-z-]+",
      "required": ["src", "package.json"],
      "forbidden": ["node_modules (git), dist (git)"]
    },
    "src/projects/pages/*": {
      "pattern": "[a-z]+/[A-Z][a-zA-Z]*Dashboard.tsx",
      "required": ["Dashboard.tsx file"],
      "forbidden": ["other tsx files at root"]
    },
    "root": {
      "forbidden": [
        ".env (except .env.example)",
        "node_modules",
        "dist",
        "build",
        ".DS_Store"
      ]
    }
  }
}

```text

---

## File Naming Conventions

### TypeScript/React Files

```text

✅ CORRECT
├── SimCoreDashboard.tsx        PascalCase for components
├── useThemeColors.ts           camelCase with use prefix for hooks
├── getProject.ts               camelCase for utilities
├── dashboardUtils.ts           camelCase for modules
└── types.ts                    camelCase for type files

❌ INCORRECT
├── simcore-dashboard.tsx       (should be PascalCase)
├── useThemeColors.tsx          (hooks are .ts not .tsx)
├── get-project.ts             (should be camelCase)
├── DashboardUtils.ts          (should be camelCase)
└── Types.ts                   (should be camelCase)

```text

### Configuration Files

```text

✅ CORRECT
├── vite.config.ts             Lowercase with dots
├── tailwind.config.ts         Lowercase with dots
├── eslint.config.js           Lowercase with dots
├── tsconfig.json              Lowercase with dots
└── .env.example               Lowercase with dots

❌ INCORRECT
├── Vite.config.ts             (should be lowercase)
├── TAILWIND_CONFIG.ts         (should be vite.config.ts style)
├── ESLintConfig.js            (should be lowercase)

```text

### Design System Files

```text

✅ CORRECT
design-system/src/
├── tokens/
│   ├── colors.ts              singular, lowercase
│   ├── typography.ts          singular, lowercase
│   ├── spacing.ts             singular, lowercase
│   └── index.ts               aggregates
├── themes/
│   ├── quantum.ts             singular, lowercase
│   ├── glassmorphism.ts       singular, lowercase
│   └── index.ts               aggregates
└── context/
    ├── ThemeContext.tsx       PascalCase for React context
    └── index.ts

❌ INCORRECT
├── token-colors.ts            (should be colors.ts)
├── Quantum.ts                 (should be lowercase)
├── Theme-Context.tsx          (should be ThemeContext.tsx)
└── index files missing        (must exist)

```text

---

## Git Workflow Standards

### Branching Strategy

```text
main                    ✅ Production-ready code
├── develop             ✅ Integration branch
├── feature/[name]      ✅ Feature development
├── hotfix/[name]       ✅ Critical fixes
└── release/[version]   ✅ Release preparation

```text

### Branch Rules


- **main**: Only merge from develop or hotfix branches

- **develop**: Integration point for features

- **feature**: Descriptive names (feature/auth-system)

- **hotfix**: Critical fixes only, bypass develop

- **release**: Final testing and preparation

### Workflow Commands

```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# Complete feature
git add .
git commit -m "feat(scope): implement feature"
git push origin feature/your-feature-name
# Create PR to develop

# Hotfix process
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix
# ... fix and commit ...
git checkout main
git merge --no-ff hotfix/critical-fix
git push origin main

```text

### Quick Reference### Git Quick Reference

 | Action | Command | Branch | 
 | -------- | --------- | -------- | 
 | New feature | `git checkout -b feature/name` | from develop | 
 | Hotfix | `git checkout -b hotfix/name` | from main | 
 | Merge to main | `git merge --no-ff` | hotfix/release | 
 | Merge to develop | `git merge --no-ff` | feature | 

---

## Pre-commit Hooks & Local Validation

### Setup Pre-commit Hooks (Husky)

```bash

# Install husky
npm install husky --save-dev
npx husky install

# Create pre-commit hook
npx husky add .husky/pre-commit "npm run pre-commit-check"

```text

### Pre-commit Check Script

```json

{
  "scripts": {
    "pre-commit-check": "npm run check:structure && npm run check:format &&",
    "check:structure": "node scripts/validate-structure.js",
    "check:format": "prettier --check .",
    "check:lint": "eslint . --max-warnings 0",
    "check:types": "tsc --noEmit"
  }
}

```text

### Structure Validation Script

```javascript

// scripts/validate-structure.js
const fs = require('fs');
const path = require('path');

const RULES = {
  packages: {
    pattern: /^@alawein\/[a-z-]+$/,
    required: ['src', 'package.json'],
  },
  src_projects: {
    pattern: /^[a-z]+$/,
    required: ['[PlatformName]Dashboard.tsx'],
  },
  root: {
    forbidden: ['.env', 'node_modules', 'dist', 'build'],
  },
};

function validate() {
  // Check packages folder
  const packagesDir = path.join(__dirname, '../packages');
  if (fs.existsSync(packagesDir)) {
    const packages = fs.readdirSync(packagesDir);
    packages.forEach((pkg) => {
      if (!RULES.packages.pattern.test(pkg)) {
        console.error(`❌ Package folder must match @alawein/[name]:
        ${pkg}`);
        process.exit(1);
      }
      RULES.packages.required.forEach((file) => {
        if (!fs.existsSync(path.join(packagesDir, pkg, file))) {
          console.error(`❌ Package ${pkg} missing required ${file}`);
          process.exit(1);
        }
      });
    });
  }

  // Check src structure
  const srcDir = path.join(__dirname, '../src');
  if (fs.existsSync(srcDir)) {
    const sections = fs.readdirSync(srcDir);
    const required = ['projects', 'pages', 'components', 'stores'];
    const missing = required.filter((r) => !sections.includes(r));
    if (missing.length > 0) {
      console.error(`❌ src/ missing required folders: ${missing.join(', ')}`);
      process.exit(1);
    }
  }

  console.log('✅ Folder structure is valid');
}

validate();

```text

---

## Code Quality Standards

### ESLint Rules (Enforce Structure)

```javascript

// eslint.config.js additions
module.exports = {
  rules: {
    // Enforce import paths
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          '*/dist',
          '*/src/**/../*', // no parent imports
          '../**/src', // no sibling imports
        ],
      },
    ],

    // No orphaned files
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ImportDeclaration[source.value=/^\.\/\.\./]',
        message:
          'No parent directory imports (../) - use absolute paths via tsconfig paths',
      },
    ],

    // Component naming
    'filenames/match-regex': ['error', '^[a-z]+(-[a-z]+)*$ | ^[A-Z][a-zA-Z]*$'],

    // No default exports from utilities
    'import/no-default-export': [
      'error',
      {
        allowedInterfaces: 'always',
      },
    ],
  },
};

```text

### TypeScript Strict Mode

```json

{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  }
}

```text

### Code Quality Metrics

```bash

# Disallow console.logs in production
# Disallow debugger statements
# Max function length: 50 lines
# Max file size: 500 lines
# Max cyclomatic complexity: 5
# 100% type coverage

```bash

---

## Commit Message Standards

### Commit Format (Conventional Commits)

```text

**type**(**scope**): **subject**

### Body

### Footer

Examples:
✅ feat(design-system): add new color tokens for themes
✅ fix(simcore): resolve dashboard rendering issue
✅ docs(team-onboarding): update installation steps
✅ refactor(packages): reorganize folder structure
✅ test(e2e): add theme switching tests
✅ chore(deps): update react to 18.3

❌ Fixed stuff
❌ update
❌ WIP
❌ asdf

```text

### Commit Types

```text

feat:       New feature
fix:        Bug fix
docs:       Documentation
refactor:   Code refactor
test:       Test addition/update
chore:      Maintenance, dependencies
perf:       Performance improvement
ci:         CI/CD configuration

```text

### Commit Scope

```text

Allowed scopes:


- design-system


- packages


- \[package-name\]


- \[platform-name\]


- docs


- deps


- repo


- config

```text

### Commit Lint Setup

```bash

# Install commitlint
npm install --save-dev @commitlint/config-conventional @commitlint/cli

# Create config
echo "module.exports = {extends: ['@commitlint/config-conventional']}" >
commitlintrc.js

# Add hook
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'

```text

---

## Import & Dependency Rules

### Path Aliases (Enforce These)

```json

{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@alawein/design-system": ["design-system/src"],
      "@alawein/ui-components": ["packages/ui-components/src"],
      "@alawein/api-schema": ["packages/api-schema/src"],
      "@components/*": ["src/components/*"],
      "@pages/*": ["src/pages/*"],
      "@stores/*": ["src/stores/*"],
      "@projects/*": ["src/projects/*"],
      "@templates/*": ["templates/*"]
    }
  }
}

```text

### Import Rules

```text

✅ CORRECT
import { ThemeProvider } from '@alawein/design-system'
import { Button } from '@components/ui/button'
import { useTheme } from '@hooks/useTheme'
import { SimCoreDashboard } from '@projects/pages/simcore'

❌ INCORRECT
import { ThemeProvider } from '../../../design-system/src'
import { Button } from '../../../../src/components'
import useTheme from '../utils'
import SimCoreDashboard from '../../projects'

```text

### No Circular Dependencies

```bash

# Detection script
npm install --save-dev madge

# Check for circular deps
npx madge --circular src/

# Enforce in pre-commit
npx madge --circular src/ | | exit 1

```text

### Dependency Restrictions

```text

✅ ALLOWED at root:


- React ecosystem


- Tailwind CSS


- Framer Motion


- Zustand


- TanStack Query


- UI libraries (Radix)

❌ NOT ALLOWED:


- Duplicate packages


- Outdated versions


- Security vulnerabilities


- Unused packages

```text

---

## Security Standards

### Code Security Principles

```text
✅ NEVER commit:

- API keys, passwords, tokens

- Private certificates

- User data or PII

- Environment files (.env)

✅ ALWAYS:

- Use environment variables for secrets

- Validate all inputs

- Use HTTPS for external requests

- Keep dependencies updated

```text

### Security Tools

```bash
# Scan for secrets
npm install -g git-secrets
git secrets --register-aws
git secrets --install

# Audit dependencies
npm audit
npm audit fix

# SAST scanning
npm install -g snyk
snyk test

```text

### Language-Specific Security

```javascript
// JavaScript/TypeScript
// Sanitize user input
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userInput);

// Use parameterized queries
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);

```text

```python
# Python
# Avoid eval() with user input
# Use subprocess with shell=False
subprocess.run(['ls', '-la'], check=True)

# SQL injection prevention
cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))

```text

```java
// Java
// Input validation
import org.apache.commons.validator.routines.EmailValidator;
EmailValidator validator = EmailValidator.getInstance();
boolean valid = validator.isValid(email);

// Prepared statements
String sql = 'SELECT * FROM users WHERE id = ?';
PreparedStatement stmt = conn.prepareStatement(sql);
stmt.setInt(1, userId);

```text

### Quick Reference### Security Quick Reference

 | Threat | Prevention | Tool | 
 | -------- | ------------- | ------ | 
 | Secret leakage | Environment variables | git-secrets | 
 | Vulnerable deps | Regular audits | npm audit, Snyk | 
 | XSS | Input sanitization | DOMPurify | 
 | SQL injection | Parameterized queries | ORMs, prepared statements | 

---

## Documentation Requirements

### Required Documentation

```text

✅ Every major feature needs:


- README or docstring


- TypeScript types/interfaces


- Usage examples


- Integration instructions

✅ Every package needs:


- package.json with description


- README.md in package root


- CHANGELOG.md (optional but recommended)

✅ Every component needs:


- JSDoc comment


- Props interface


- Usage example


- Accessibility notes (if UI)

```text

### Documentation Validation

```bash

# Enforce JSDoc comments on exported functions
npm install --save-dev eslint-plugin-jsdoc

# Rule: require-jsdoc
rules: {
  'jsdoc/require-jsdoc': [
    'error',
    {
      require: {
        FunctionExpression: true,
        ArrowFunctionExpression: true,
        ClassDeclaration: true,
      },
    },
  ],
}

```bash

---

## Testing Standards

### Testing Pyramid

```text
E2E Tests (10%)     ✅ Critical user journeys
Integration (20%)   ✅ API/database interactions
Unit Tests (70%)    ✅ Business logic, utilities

```text

### Coverage Requirements

```text
✅ Minimum coverage:

- Unit tests: 80%

- Integration: 60%

- E2E: Critical paths only

✅ Files to test:

- All business logic

- API endpoints

- Utility functions

- Component interactions

```text

### Language-Specific Testing

```javascript
// JavaScript/TypeScript - Jest
describe('UserService', () => {
  it('should create user with valid data', async () => {
    const user = await UserService.create(validData);
    expect(user.id).toBeDefined();
    expect(user.email).toBe(validData.email);
  });
});

```text

```python
# Python - pytest
def test_calculate_total():
    items = [{'price': 10}, {'price': 20}]
    total = calculate_total(items)
    assert total == 30

```text

```java
// Java - JUnit
@Test
void shouldCalculateDiscount() {
    Product product = new Product(100.0);
    product.applyDiscount(0.1);
    assertEquals(90.0, product.getPrice());
}

```text

### Testing Tools

```bash
# JavaScript
npm install --save-dev jest @testing-library/react

# Python
pip install pytest pytest-cov

# Java
testImplementation 'junit:junit:4.13.2'

```text

### Quick Reference### Security Quick Reference

 | Test Type | When to Use | Framework | 
 | ----------- | ------------- | ----------- | 
 | Unit | Business logic | Jest, pytest, JUnit | 
 | Integration | APIs/DB | Supertest, TestContainers | 
 | E2E | User flows | Cypress, Playwright, Selenium | 

---

## Review Checklist

Before committing, verify:

### Folder Structure


- [ ] File in correct folder


- [ ] Folder follows naming convention


- [ ] No orphaned files


- [ ] No temporary folders

### File Naming


- [ ] Correct naming convention applied


- [ ] Consistent with codebase


- [ ] No uppercase/lowercase issues


- [ ] No spaces or special chars (except hyphens)

### Code Quality


- [ ] Prettier formatting applied


- [ ] ESLint passes


- [ ] TypeScript compiles


- [ ] No console.log statements


- [ ] No debugger statements


- [ ] Functions <50 lines


- [ ] Complexity <5

### Imports


- [ ] Using path aliases


- [ ] No relative parent imports


- [ ] No circular dependencies


- [ ] Import paths are absolute

### Documentation


- [ ] JSDoc comments on exports


- [ ] README updated if needed


- [ ] Type definitions included


- [ ] Usage examples provided

### Commit


- [ ] Message follows convention


- [ ] Scope is accurate


- [ ] References issue if applicable


- [ ] Body explains why (not what)

### Tests


- [ ] Tests pass locally


- [ ] New code has tests


- [ ] Edge cases covered


- [ ] No console warnings

---

## Enforcement Tools

### Git Hooks Checklist

```bash

.husky/
├── pre-commit         → Check structure, format, lint
├── commit-msg        → Validate commit message
└── pre-push          → Run tests, type check

Create with:
npx husky install
npx husky add .husky/pre-commit "npm run validate"

```text

### Validation Scripts

```bash

# Root scripts
"validate": "npm run check:structure && npm run check:format && npm run
check:lint && npm run check:types",
"check:structure": "node scripts/validate-structure.js",
"check:format": "prettier --check .",
"check:lint": "eslint . --max-warnings 0",
"check:types": "tsc --noEmit",
"check:circular": "madge --circular src/",
"check:security": "npm audit --audit-level=moderate",
"check:all": "npm run check:structure && npm run check:format && npm run
check:lint && npm run check:types && npm run check:circular && npm run
check:security"

```text

### Pre-push Validation

```bash

#!/bin/bash
# .husky/pre-push

echo "🔍 Running comprehensive validation..."

npm run validate | | {
  echo "❌ Validation failed. Commit rejected."
  exit 1
}

npm run test | | {
  echo "❌ Tests failed. Push rejected."
  exit 1
}

echo "✅ All checks passed!"

```text

---

## Policy Violations & Fixes

### Common Violations & Solutions

#### Violation 1: Wrong Folder Structure

```text

❌ src/utils/helpers/theme.ts
✅ Move to: src/components/theme-related-component/

Rule: Utilities go inside modules, not isolated

```text

#### Violation 2: Package Naming

```text

❌ packages/my-package (not @alawein/*)
✅ Rename to: packages/@alawein/my-package

Rule: All packages must be @alawein/\[name\]

```text

#### Violation 3: File Naming

```text

❌ src/utils/Get-Project.ts (PascalCase)
✅ Rename to: src/utils/getProject.ts (camelCase)

Rule: Utils must be camelCase

```text

#### Violation 4: Import Paths

```text

❌ import { func } from '../../../utils'
✅ import { func } from '@utils'

Rule: Use path aliases, no relative paths

```text

#### Violation 5: Commit Messages

```text

❌ fixed bug
❌ update stuff
✅ fix(dashboard): resolve rendering issue

Rule: Follow conventional commits

```text

#### Violation 6: Console Statements

```text

❌ console.log('debug info')
❌ debugger

✅ Remove before commit

Rule: No console logs in production code

```text

#### Violation 7: Type Safety

```text

❌ const value: any
❌ return data as unknown

✅ const value: string
✅ return data as ThemeType

Rule: No any/unknown types, strict mode

```text

#### Violation 8: Unused Code

```text

❌ import { unused } from 'module'
❌ const x = 1; // never used

✅ Remove unused imports/variables

Rule: No dead code

```text

---

## Automated Cleanup Scripts

### Auto-fix Script

```javascript

// scripts/auto-fix.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Running auto-fixes...');

// Format all files
execSync('npx prettier --write .', { stdio: 'inherit' });
console.log('✅ Formatted with Prettier');

// Fix ESLint issues (if --fix available)
execSync('npx eslint . --fix', { stdio: 'inherit' });
console.log('✅ Fixed ESLint issues');

// Remove console logs (optional)
// ... custom logic

console.log('✅ Auto-fixes complete');

```text

### Run Before Commit

```json

{
  "scripts": {
    "fix": "node scripts/auto-fix.js",
    "pre-commit-check": "npm run fix && npm run validate"
  }
}

```text

---

## Monitoring & Maintenance

### Weekly Review

```bash

# Check for policy violations
npm run check:all

# Review git history
git log --oneline -20

# Check for outdated dependencies
npm outdated

# Security audit
npm audit

```text

### Monthly Audit

```bash

# Full structure validation
node scripts/validate-structure.js

# Code quality metrics
npm run lint -- --format=json > quality-report.json

# Dependency audit
npm audit > security-report.json

# Review all PRs/commits
git log --oneline --since="30 days ago"

```text

---


---

## Getting Started with Governance

### Step 1: Install Hooks

```bash

npm install husky --save-dev
npx husky install
npx husky add .husky/pre-commit "npm run validate"
npx husky add .husky/commit-msg "npx commitlint --edit"

```text

### Step 2: Add Validation Scripts

```bash

# Create scripts/validate-structure.js
# Update package.json with scripts

```text

### Step 3: Commit Existing Code

```bash

# Run auto-fix
npm run fix

# Validate
npm run validate

# Commit
git add .
git commit -m "chore(repo): enforce governance standards"

```text

### Step 4: Team Alignment

```bash

# Share this document
# Review expectations
# Set up local development

```text

---

## Conclusion

This governance system ensures:


- ✅ Clean, organized repository


- ✅ No policy slips


- ✅ Strict folder structures


- ✅ Consistent code quality


- ✅ Easy to maintain


- ✅ Easy to onboard new developers


- ✅ Future-proof architecture

**Enforcement is local and automatic. No CI/CD required.**

---

**Last Updated:** December 5, 2024 **Status:** Ready to Implement
