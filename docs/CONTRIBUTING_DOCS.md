# Documentation Contribution Guide

> Last verified: 2025-12-09

How to write, maintain, and contribute documentation for the Alawein Platform.

---

## Table of Contents

1. Getting Started
2. Documentation Types
3. Best Practices
4. Examples of Good Documentation
5. Common Mistakes to Avoid
6. Review Checklist

---

## Getting Started

### Prerequisites

Before contributing documentation:

1. Read the [Style Guide](./STYLE_GUIDE.md) for formatting standards
2. Review existing docs to understand the structure
3. Run validation: `node scripts/validate-docs.js --verbose`

### Creating New Documentation

```bash
# 1. Create file in docs/ directory
touch docs/NEW_GUIDE.md

# 2. Use the standard template
cat > docs/NEW_GUIDE.md << 'EOF'
# Guide Title

> Last verified: YYYY-MM-DD

Brief description of what this document covers.

---

## Table of Contents

1. Section One
2. Section Two

---

## Section One

Content here...

---

## Section Two

Content here...
EOF

# 3. Add to docs/README.md index
# 4. Run validation
node scripts/validate-docs.js --verbose
```

---

## Documentation Types

### Reference Documentation

Technical specifications and API details.

**Example: API endpoint documentation**

````markdown
### GET /simulations

List all simulations for the authenticated user.

**Request**

```bash
curl -X GET "https://api.example.com/simulations" \
  -H "Authorization: Bearer <token>"
```
````

**Response**

```json
{
  "simulations": [
    {
      "id": "uuid",
      "name": "My Simulation",
      "status": "completed"
    }
  ]
}
```

**Error Codes**

| Code | Description                             |
| ---- | --------------------------------------- |
| 401  | Unauthorized - Invalid or missing token |
| 404  | Not found - Simulation doesn't exist    |

````

### Tutorial Documentation

Step-by-step guides for completing tasks.

**Example: Adding a new platform**

```markdown
## Adding a New Platform

This guide walks you through adding a new platform to the Alawein ecosystem.

### Step 1: Define the platform configuration

Add your platform to `src/projects/config.ts`:

```typescript
export const projectRegistry = {
  // ... existing platforms
  newplatform: {
    id: 'newplatform',
    name: 'New Platform',
    slug: 'newplatform',
    tagline: 'Brief description',
    category: 'scientific-computing',
    status: 'development',
    theme: {
      primary: 'purple',
      accent: 'cyan'
    }
  }
};
````

### Step 2: Create the dashboard component

Create `src/projects/pages/newplatform/NewPlatformDashboard.tsx`:

```tsx
import { ProjectLayout } from '@/projects/components';

const NewPlatformDashboard = () => {
  return (
    <ProjectLayout projectId="newplatform">
      <h1>New Platform Dashboard</h1>
      {/* Add your dashboard content */}
    </ProjectLayout>
  );
};

export default NewPlatformDashboard;
```

### Step 3: Add the route

In `src/App.tsx`, add:

```tsx
<Route path="/projects/newplatform" element={<NewPlatformDashboard />} />
```

````

### Conceptual Documentation

Explains how things work and why decisions were made.

**Example: Architecture explanation**

```markdown
## State Management Architecture

The Alawein Platform uses a layered state management approach:

### Why this approach?

1. **Separation of concerns** - Global UI state (Zustand) is separate from server state (TanStack Query)
2. **Optimistic updates** - TanStack Query provides built-in optimistic update patterns
3. **Caching** - Server data is automatically cached and invalidated

### Layer diagram

````

┌─────────────────────────────────────┐ │ Component Layer │ │ (useState for
local UI state) │ ├─────────────────────────────────────┤ │ Zustand Stores │ │
(authStore, notificationStore) │ ├─────────────────────────────────────┤ │
TanStack Query │ │ (useSimulations, useWorkflows) │
├─────────────────────────────────────┤ │ Edge Functions / DB │
└─────────────────────────────────────┘

```

```

---

## Best Practices

### 1. Lead with the user's goal

❌ **Bad**: "This document explains the authentication system."

✅ **Good**: "Learn how to add user authentication to your platform dashboard."

### 2. Show, don't just tell

❌ **Bad**: "Use semantic tokens for colors."

✅ **Good**:

```typescript
// ✅ Correct - Use semantic tokens
<div className="bg-background text-foreground">

// ❌ Wrong - Don't use raw colors
<div className="bg-purple-500 text-white">
```

### 3. Provide complete, runnable examples

❌ **Bad**:

```typescript
// Configure the query
const { data } = useQuery({ ... });
```

✅ **Good**:

```typescript
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const { data, isLoading, error } = useQuery({
  queryKey: ['simulations'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('simcore_simulations')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
});
```

### 4. Use consistent terminology

| Always use    | Instead of                   |
| ------------- | ---------------------------- |
| Platform      | Dashboard, App               |
| Edge Function | Serverless function, Lambda  |
| Lovable Cloud | Supabase (in user docs)      |
| Design token  | CSS variable, Theme variable |

### 5. Include expected outcomes

````markdown
### Step 3: Verify the installation

Run the development server:

```bash
npm run dev
```
````

**Expected output:**

```
  VITE v5.4.2  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/
```

Navigate to http://localhost:5173 - you should see the landing page.

````

---

## Examples of Good Documentation

### Good API Documentation

```markdown
## Create Simulation

Creates a new simulation for the authenticated user.

### Endpoint

````

POST /functions/v1/simcore-api

````

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Simulation name (max 100 chars) |
| `simulation_type` | string | Yes | One of: `fluid`, `particle`, `thermal` |
| `config` | object | No | Simulation configuration |

### Example Request

```typescript
const { data, error } = await supabase.functions.invoke('simcore-api', {
  body: {
    action: 'create',
    data: {
      name: 'Fluid Dynamics Test',
      simulation_type: 'fluid',
      config: {
        particles: 1000,
        timestep: 0.01
      }
    }
  }
});
````

### Response

```json
{
  "simulation": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Fluid Dynamics Test",
    "simulation_type": "fluid",
    "status": "pending",
    "created_at": "2025-12-09T12:00:00Z"
  }
}
```

### Error Responses

| Status | Error           | Description                                         |
| ------ | --------------- | --------------------------------------------------- |
| 400    | `INVALID_TYPE`  | simulation_type must be fluid, particle, or thermal |
| 401    | `UNAUTHORIZED`  | Missing or invalid authentication                   |
| 422    | `NAME_TOO_LONG` | Name exceeds 100 characters                         |

````

### Good Tutorial Documentation

```markdown
## Adding Authentication to a Page

This tutorial shows how to protect a page with authentication.

**Time:** 5 minutes
**Prerequisites:** Basic React knowledge

### What you'll build

A protected page that:
- Redirects unauthenticated users to login
- Shows user-specific content after login
- Handles loading states

### Step 1: Create the protected page

```tsx
// src/pages/Dashboard.tsx
import { useAuthStore } from '@/stores/authStore';
import { Navigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/shared';

const Dashboard = () => {
  const { user, isLoading, isAuthenticated } = useAuthStore();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Welcome, {user?.email}
      </h1>
    </div>
  );
};

export default Dashboard;
````

### Step 2: Add the route

```tsx
// src/App.tsx
import Dashboard from '@/pages/Dashboard';

// Inside your Routes:
<Route path="/dashboard" element={<Dashboard />} />;
```

### Step 3: Test it

1. Navigate to `/dashboard` while logged out
2. You should be redirected to `/auth`
3. Log in with valid credentials
4. You should see "Welcome, your@email.com"

### Troubleshooting

**Problem:** Page shows loading forever

**Solution:** Check that `AuthProvider` wraps your app in `App.tsx`

**Problem:** User is always redirected to login

**Solution:** Verify that `isAuthenticated` is being set correctly in
`authStore`

````

---

## Common Mistakes to Avoid

### 1. Missing imports in code examples

❌ **Bad**:
```typescript
const { data } = useQuery({ queryKey: ['items'] });
````

✅ **Good**:

```typescript
import { useQuery } from '@tanstack/react-query';

const { data } = useQuery({ queryKey: ['items'] });
```

### 2. Outdated file paths

❌ **Bad**: "Edit `src/lib/supabase.ts`" ✅ **Good**: "Edit
`src/integrations/supabase/client.ts`"

### 3. Assuming knowledge

❌ **Bad**: "Configure RLS appropriately" ✅ **Good**: "Add Row Level Security
policies to restrict access..."

### 4. No error handling in examples

❌ **Bad**:

```typescript
const { data } = await supabase.from('items').select('*');
console.log(data);
```

✅ **Good**:

```typescript
const { data, error } = await supabase.from('items').select('*');
if (error) {
  console.error('Failed to fetch items:', error.message);
  return;
}
console.log(data);
```

### 5. Missing context for code snippets

❌ **Bad**:

```typescript
export default Dashboard;
```

✅ **Good**:

```typescript
// src/pages/Dashboard.tsx
// ... (component code shown above)
export default Dashboard;
```

---

## Review Checklist

Before submitting documentation changes:

### Structure

- [ ] Document has a clear title (H1)
- [ ] Freshness date present: `> Last verified: YYYY-MM-DD`
- [ ] Table of contents for docs with 4+ sections
- [ ] Sections separated with horizontal rules (`---`)

### Content

- [ ] Leads with user goals, not technical details
- [ ] All code examples are complete and runnable
- [ ] Imports included in code examples
- [ ] Error handling shown in examples
- [ ] Expected outcomes described

### Technical Accuracy

- [ ] File paths are correct and current
- [ ] API endpoints match actual implementation
- [ ] Code examples tested and working
- [ ] Links point to existing files

### Style

- [ ] Follows [Style Guide](./STYLE_GUIDE.md) conventions
- [ ] Uses correct terminology (see terminology table)
- [ ] No raw colors in code examples
- [ ] Path aliases used (`@/...`)

### Validation

- [ ] Ran `node scripts/validate-docs.js --verbose`
- [ ] All links verified working
- [ ] No orphaned files

---

## Getting Help

- **Questions about style:** See [STYLE_GUIDE.md](./STYLE_GUIDE.md)
- **Questions about structure:** See [STRUCTURE.md](./STRUCTURE.md)
- **Questions about code patterns:** See [DEVELOPMENT.md](./DEVELOPMENT.md)
