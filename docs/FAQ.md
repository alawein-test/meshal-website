# Frequently Asked Questions

> Common questions and answers for users and developers of the MA Digital
> Studios Platform

---

## General Questions

### What is the MA Digital Studios Platform?

The MA Digital Studios Platform (also known as Alawein Platform) is a
comprehensive React/TypeScript ecosystem featuring multiple specialized
dashboards for scientific computing, AI research, optimization, and portfolio
management. It includes SimCore, MEZAN, TalAI, OptiLibria, and QMLab.

### What technologies does the platform use?

| Layer        | Technologies                           |
| ------------ | -------------------------------------- |
| **Frontend** | React 18, TypeScript, Vite             |
| **Styling**  | Tailwind CSS, Shadcn/ui                |
| **State**    | Zustand, TanStack Query, React Context |
| **Backend**  | Lovable Cloud, Edge Functions          |
| **Testing**  | Playwright, Vitest                     |

### Is the platform open source?

Yes, the platform is open source. See our
[Contributing Guidelines](../CONTRIBUTING.md) for information on how to
contribute.

---

## Getting Started

### How do I set up the development environment?

```bash
# Clone the repository
git clone <repository-url>
cd ma-digital-studios

# Install dependencies
npm install

# Start development server
npm run dev
```

See the [Quick Start Guide](./QUICK_START.md) for detailed instructions.

### What are the system requirements?

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)
- **RAM**: 4GB minimum, 8GB recommended

### How do I run tests?

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# All tests
npm run test:all
```

---

## Development

### How do I create a new component?

1. Create file in `src/components/` following naming conventions
2. Use TypeScript with proper interfaces
3. Follow the design system tokens
4. Add to barrel export (`index.ts`)
5. Write tests if complex logic involved

See [UI Components Guide](./UI_COMPONENTS.md) for detailed patterns.

### How do I add a new route?

1. Create page component in `src/pages/`
2. Add route to `src/App.tsx`
3. Update navigation if needed
4. Add SEO component with metadata

See [Routing Guide](./ROUTING.md) for more details.

### How do I use the design system?

Always use semantic tokens from `index.css`:

```tsx
// ✅ Correct - uses design tokens
<div className="bg-background text-foreground">

// ❌ Wrong - uses direct colors
<div className="bg-white text-black">
```

See [Design System Guide](./DESIGN_SYSTEM.md) for complete documentation.

### How do I add authentication to a page?

Wrap your component with `ProtectedRoute`:

```tsx
import { ProtectedRoute } from '@/components/shared';

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>;
```

---

## Backend & Database

### How do I interact with the database?

Use the Supabase client:

```typescript
import { supabase } from '@/integrations/supabase/client';

// Query data
const { data, error } = await supabase.from('table_name').select('*');
```

### How do I create a database migration?

Database migrations are handled through the Lovable platform. Describe the
schema changes needed and the migration will be generated automatically.

### How do I add real-time functionality?

Enable real-time on your table and subscribe:

```typescript
const channel = supabase
  .channel('changes')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'my_table' },
    (payload) => console.log(payload)
  )
  .subscribe();
```

---

## Styling & UI

### How do I customize the theme?

Edit design tokens in `src/index.css`:

```css
:root {
  --primary: 210 100% 50%;
  --background: 0 0% 100%;
  /* ... other tokens */
}
```

### How do I add dark mode support?

The platform uses CSS variables with `.dark` class. Define dark mode tokens:

```css
.dark {
  --background: 222 47% 11%;
  --foreground: 210 40% 98%;
}
```

### How do I make a component responsive?

Use Tailwind's responsive prefixes:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Content */}
</div>
```

---

## Testing

### What testing frameworks are used?

- **Vitest**: Unit and integration tests
- **Playwright**: End-to-end browser tests
- **Testing Library**: Component testing utilities

### How do I write a unit test?

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from './myFunction';

describe('myFunction', () => {
  it('should return expected value', () => {
    expect(myFunction(input)).toBe(expected);
  });
});
```

### How do I write an E2E test?

```typescript
import { test, expect } from '@playwright/test';

test('user can navigate to dashboard', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Dashboard');
  await expect(page).toHaveURL('/dashboard');
});
```

---

## Deployment

### How do I deploy the application?

The platform deploys automatically through Lovable. Frontend changes require
clicking "Update" in the publish dialog, while backend changes deploy
immediately.

### How do I set up a custom domain?

1. Navigate to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate provisioning

### How do I manage environment variables?

Environment variables are managed through the Lovable platform. Use the secrets
management tools to add or update sensitive values.

---

## Troubleshooting

### My changes aren't appearing in the preview

1. Check for TypeScript/build errors in console
2. Ensure you saved all files
3. Try refreshing the preview
4. Check network tab for failed requests

### I'm getting TypeScript errors

1. Ensure all imports are correct
2. Check that types are properly defined
3. Run `npm run typecheck` to see all errors
4. Verify dependencies are installed

### Database queries are returning empty

1. Check RLS policies are correctly configured
2. Verify user is authenticated if required
3. Check the query for typos
4. Look at network tab for error responses

### Styles aren't applying correctly

1. Ensure you're using design system tokens
2. Check for CSS specificity conflicts
3. Verify Tailwind classes are valid
4. Check if dark/light mode is affecting styles

---

## Performance

### How can I improve page load times?

- Lazy load routes with `React.lazy()`
- Optimize images (use appropriate formats/sizes)
- Minimize bundle size (check for unnecessary dependencies)
- Use code splitting for large components

### How do I optimize database queries?

- Select only needed columns
- Use appropriate indexes
- Implement pagination for large datasets
- Consider caching frequently accessed data

---

## Contributing

### How do I report a bug?

1. Check existing issues for duplicates
2. Create new issue with bug report template
3. Include reproduction steps
4. Provide browser/environment details

### How do I suggest a feature?

1. Check roadmap and existing discussions
2. Open a GitHub Discussion or Issue
3. Describe the use case and benefits
4. Be open to feedback and alternatives

### How do I submit a pull request?

1. Fork the repository
2. Create feature branch
3. Make changes following style guide
4. Write tests for new functionality
5. Submit PR with clear description

See [Contributing Guidelines](../CONTRIBUTING.md) for complete process.

---

## Security

### How do I report a security vulnerability?

**Do not** open a public issue. Instead:

1. Email security@madigitalstudios.com
2. Include detailed description
3. Provide reproduction steps if possible
4. Allow 48 hours for initial response

See [Security Policy](./SECURITY.md) for more details.

### How is user data protected?

- All data encrypted at rest and in transit
- Row Level Security enforces access control
- Regular security audits conducted
- See [Privacy Policy](./PRIVACY.md) for full details

---

## Related Documents

- [Quick Start](./QUICK_START.md)
- [Architecture](./ARCHITECTURE.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
- [Contributing](../CONTRIBUTING.md)
- [Glossary](./GLOSSARY.md)
