# Troubleshooting Guide

> Last verified: 2025-12-09

Common issues and solutions for developers working on the Alawein Platform.

## Table of Contents

- Development Setup Issues
- Build Errors
- Runtime Errors
- Styling Issues
- Supabase/Backend Issues
- Testing Issues

---

## Development Setup Issues

### Node Version Mismatch

**Symptom:** Build fails with syntax errors or dependency issues.

**Solution:**

```bash
# Check your Node version
node --version

# Should be 18+ (recommended: 20+)
# Use nvm to switch versions
nvm use 20
```

### Dependencies Not Installing

**Symptom:** `npm install` fails or hangs.

**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Port Already in Use

**Symptom:** `Error: listen EADDRINUSE :::5173`

**Solution:**

```bash
# Find and kill the process
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

---

## Build Errors

### TypeScript Type Errors

**Symptom:** Build fails with type errors.

**Common Causes:**

1. Missing type definitions
2. Incorrect imports
3. Outdated Supabase types

**Solutions:**

```bash
# For Supabase type issues - types are auto-generated
# Check src/integrations/supabase/types.ts matches your schema

# For missing module types
npm install -D @types/[package-name]
```

### Import Path Errors

**Symptom:** `Cannot find module '@/...'`

**Solution:**

- Ensure the file exists at the specified path
- Check `tsconfig.json` has correct path aliases:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Vite Build Failures

**Symptom:** Build hangs or crashes.

**Solution:**

```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Rebuild
npm run build
```

---

## Runtime Errors

### Blank Page / White Screen

**Common Causes:**

1. JavaScript error preventing render
2. Missing environment variables
3. Router configuration issues

**Debug Steps:**

1. Open browser DevTools (F12)
2. Check Console for errors
3. Check Network tab for failed requests
4. Verify `.env` file exists with required variables

### Component Not Rendering

**Symptom:** Component doesn't appear despite no errors.

**Checklist:**

- [ ] Component is exported correctly
- [ ] Component is imported where used
- [ ] Conditional rendering logic is correct
- [ ] CSS isn't hiding the element

### Hydration Mismatch

**Symptom:** Warning about server/client mismatch.

**Solution:**

- Ensure consistent rendering between server and client
- Use `useEffect` for client-only code
- Check for date/time formatting issues

---

## Styling Issues

### Tailwind Classes Not Applying

**Symptom:** Tailwind classes have no effect.

**Solutions:**

1. Ensure class is in Tailwind's content paths (`tailwind.config.ts`)
2. Check for typos in class names
3. Verify no conflicting CSS

### Dark Mode Not Working

**Symptom:** Theme doesn't switch or colors are wrong.

**Checklist:**

- [ ] Using semantic tokens (e.g., `bg-background`, `text-foreground`)
- [ ] NOT using hardcoded colors (e.g., `bg-white`, `text-black`)
- [ ] Theme context is properly wrapped around app

### Responsive Layout Breaking

**Symptom:** Layout breaks on certain screen sizes.

**Debug:**

```css
/* Add temporary debug borders */
* {
  outline: 1px solid red;
}
```

**Common Fixes:**

- Use `min-w-0` on flex children
- Add `overflow-hidden` on containers
- Check for fixed widths that break responsiveness

---

## Supabase/Backend Issues

### Authentication Not Working

**Symptom:** Login/signup fails or session not persisting.

**Checklist:**

- [ ] Supabase URL and anon key are correct in `.env`
- [ ] RLS policies allow the operation
- [ ] Email confirmation is disabled for development
- [ ] Check browser console for specific errors

### RLS Policy Blocking Requests

**Symptom:** Queries return empty or fail with permission errors.

**Debug Steps:**

1. Check Supabase logs for policy violations
2. Verify user is authenticated: `supabase.auth.getUser()`
3. Test query in SQL editor without RLS
4. Review policy conditions

**Common Policy Issues:**

```sql
-- Ensure user_id column matches auth.uid()
CREATE POLICY "Users can view own data"
ON public.table_name
FOR SELECT
USING (auth.uid() = user_id);
```

### Edge Function Errors

**Symptom:** Edge function returns 500 or unexpected errors.

**Debug Steps:**

1. Check edge function logs in Supabase dashboard
2. Verify all secrets are configured
3. Test with minimal payload first
4. Check CORS headers for browser requests

---

## Testing Issues

### Playwright Tests Failing

**Symptom:** E2E tests fail locally or in CI.

**Solutions:**

```bash
# Install browsers
npx playwright install

# Run with debug mode
npx playwright test --debug

# Run specific test
npx playwright test tests/e2e/navigation/navigation.spec.ts
```

### Test Timeouts

**Symptom:** Tests timeout waiting for elements.

**Solutions:**

- Increase timeout in test config
- Add explicit waits for async operations
- Check if element selector is correct

---

## Performance Issues

### Slow Initial Load

**Possible Causes:**

1. Large bundle size
2. Too many synchronous imports
3. Unoptimized images

**Solutions:**

```typescript
// Use lazy loading for routes
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Use dynamic imports for heavy components
const Chart = lazy(() => import('./components/Chart'));
```

### Memory Leaks

**Symptom:** App becomes slow over time.

**Common Causes:**

- Uncleared intervals/timeouts
- Event listeners not removed
- Subscriptions not unsubscribed

**Solution:**

```typescript
useEffect(() => {
  const interval = setInterval(() => {}, 1000);

  // Always cleanup
  return () => clearInterval(interval);
}, []);
```

---

## Getting Help

If you're still stuck:

1. **Search existing issues** in the repository
2. **Check documentation** in the `docs/` folder
3. **Review similar code** in the codebase
4. **Ask for help** with detailed error messages and steps to reproduce

### Providing Good Bug Reports

Include:

- Expected behavior
- Actual behavior
- Steps to reproduce
- Environment details (Node version, OS, browser)
- Relevant error messages and logs
- Screenshots if applicable
