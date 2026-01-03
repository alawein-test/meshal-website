# Migration Guide

> Last verified: 2025-12-09

This guide explains how to migrate between major versions of the Alawein
Platform.

---

## Table of Contents

- Version History
- Migration Strategy
- Version 1.x to 2.x
- Common Migration Tasks
- Troubleshooting
- Rollback Procedures

---

## Version History

| Version | Release Date | Status      | Key Changes                 |
| ------- | ------------ | ----------- | --------------------------- |
| 2.0.0   | TBD          | Development | Multi-platform architecture |
| 1.0.0   | 2025-01      | Current     | Initial release             |

---

## Migration Strategy

### Before You Begin

1. **Back up your data** - Export any user data or configurations
2. **Read release notes** - Understand all breaking changes
3. **Test in staging** - Never migrate production first
4. **Plan downtime** - Communicate with users if needed

### Migration Checklist

- [ ] Review breaking changes
- [ ] Update dependencies
- [ ] Run migration scripts
- [ ] Update environment variables
- [ ] Test all features
- [ ] Update documentation

---

## Version 1.x to 2.x

> **Note**: This section will be populated when version 2.0 is released.

### Breaking Changes

#### 1. Component API Changes

```tsx
// v1.x
<Button type="primary" size="large">Click</Button>

// v2.x
<Button variant="default" size="lg">Click</Button>
```

#### 2. Import Path Changes

```tsx
// v1.x
import { Button } from 'components/Button';

// v2.x
import { Button } from '@/components/ui/button';
```

#### 3. State Management

```tsx
// v1.x - Context API
const { user } = useContext(AuthContext);

// v2.x - Zustand stores
const user = useAuthStore((state) => state.user);
```

### Migration Steps

#### Step 1: Update Dependencies

```bash
# Update to latest version
npm install alawein-platform@latest

# Or update specific packages
npm update @radix-ui/react-* framer-motion
```

#### Step 2: Run Codemods

```bash
# Run automated migration scripts
npx @alawein/migrate v1-to-v2
```

#### Step 3: Manual Updates

Some changes require manual intervention:

1. Update component imports
2. Migrate context to Zustand
3. Update route definitions
4. Adjust theme tokens

#### Step 4: Test Everything

```bash
# Run all tests
npm run test

# Run Playwright tests
npx playwright test

# Check for TypeScript errors
npm run typecheck
```

---

## Common Migration Tasks

### Updating Design Tokens

If you've customized design tokens:

```css
/* v1.x tokens */
:root {
  --color-primary: #6366f1;
  --font-size-lg: 18px;
}

/* v2.x tokens */
:root {
  --primary: 239 84% 67%;
  --text-lg: 1.125rem;
}
```

### Migrating Components

#### Button Component

```tsx
// v1.x
<Button
  type="primary"
  size="large"
  loading={isLoading}
>
  Submit
</Button>

// v2.x
<Button
  variant="default"
  size="lg"
  disabled={isLoading}
>
  {isLoading ? <Loader2 className="animate-spin" /> : 'Submit'}
</Button>
```

#### Form Components

```tsx
// v1.x
<Input
  label="Email"
  error={errors.email}
  onChange={handleChange}
/>

// v2.x
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Migrating Routes

```tsx
// v1.x
const routes = [
  { path: '/dashboard', component: Dashboard },
  { path: '/settings', component: Settings },
];

// v2.x
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);
```

### Database Migrations

If using Supabase:

```sql
-- Migration: Add new columns
ALTER TABLE users ADD COLUMN preferences JSONB DEFAULT '{}';

-- Migration: Rename tables
ALTER TABLE old_table_name RENAME TO new_table_name;
```

---

## Troubleshooting

### Common Issues

#### TypeScript Errors After Migration

```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
rm -rf dist

# Regenerate types
npm run typecheck
```

#### Styling Issues

1. Check if CSS variable names changed
2. Verify Tailwind config matches new tokens
3. Clear browser cache

#### Missing Dependencies

```bash
# Check for peer dependencies
npm ls

# Install missing packages
npm install
```

### Error Messages

| Error                                | Solution               |
| ------------------------------------ | ---------------------- |
| `Module not found: @/components/...` | Update import paths    |
| `Property 'variant' does not exist`  | Update component props |
| `Cannot read property of undefined`  | Check for API changes  |

---

## Rollback Procedures

### If Migration Fails

#### Step 1: Restore from Backup

```bash
# If using Git
git checkout v1.x-backup

# If using Lovable
# Use version history to restore
```

#### Step 2: Restore Database

```sql
-- Restore from backup
pg_restore -d database_name backup_file.sql
```

#### Step 3: Clear Caches

```bash
# Clear all caches
rm -rf node_modules
rm -rf .next
rm -rf dist
npm install
```

### Partial Rollback

If only some features need rollback:

1. Identify affected components
2. Revert specific files: `git checkout v1.x -- path/to/file`
3. Test thoroughly
4. Document what was reverted

---

## Need Help?

- Check [FAQ.md](./FAQ.md) for common questions
- Review [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for specific issues
- Open an issue with the `migration` label

---

_This guide is updated with each major release._
