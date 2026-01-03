# Security Best Practices

> Last verified: 2025-12-09

Security guidelines for the Alawein Platform covering authentication, RLS
policies, input validation, and secure development patterns.

## Table of Contents

- Authentication
- Row-Level Security (RLS)
- Input Validation
- API Security
- Secrets Management
- Security Checklist

---

## Authentication

### Implementation Pattern

Always use the Supabase auth state listener pattern:

```typescript
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

const [user, setUser] = useState<User | null>(null);
const [session, setSession] = useState<Session | null>(null);

useEffect(() => {
  // Set up listener FIRST
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    setSession(session);
    setUser(session?.user ?? null);
  });

  // THEN check for existing session
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    setUser(session?.user ?? null);
  });

  return () => subscription.unsubscribe();
}, []);
```

### Critical Rules

1. **Store the complete session** - Not just the user object
2. **Set up listeners before checking** - Prevents missing auth events
3. **Always use emailRedirectTo** - Required for signup flows
4. **Never use anonymous signups** - Always require email/password

### Sign Up Configuration

```typescript
const signUp = async (email: string, password: string) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
    },
  });
  return { error };
};
```

### Auth State Deadlock Prevention

**CRITICAL:** Never use async functions directly in `onAuthStateChange`:

```typescript
// ❌ WRONG - Can cause deadlock
supabase.auth.onAuthStateChange(async (event, session) => {
  await fetchUserProfile(session?.user?.id); // DON'T DO THIS
});

// ✅ CORRECT - Defer with setTimeout
supabase.auth.onAuthStateChange((event, session) => {
  setSession(session);
  setUser(session?.user ?? null);

  if (session?.user) {
    setTimeout(() => {
      fetchUserProfile(session.user.id);
    }, 0);
  }
});
```

---

## Row-Level Security (RLS)

### Core Principles

1. **Always enable RLS** on tables with user data
2. **Never store roles on profiles table** - Use separate `user_roles` table
3. **Use security definer functions** to avoid infinite recursion
4. **Test policies with different user scenarios**

### Standard User Data Pattern

For tables where users own their own data:

```sql
-- Enable RLS
ALTER TABLE public.user_data ENABLE ROW LEVEL SECURITY;

-- Users can view their own data
CREATE POLICY "Users can view own data"
ON public.user_data
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "Users can insert own data"
ON public.user_data
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "Users can update own data"
ON public.user_data
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "Users can delete own data"
ON public.user_data
FOR DELETE
USING (auth.uid() = user_id);
```

### Role-Based Access Pattern

**CRITICAL:** Never check roles directly in policies - use security definer
functions.

#### 1. Create Role Enum and Table

```sql
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table (NEVER store on profiles!)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
```

#### 2. Create Security Definer Function

```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;
```

#### 3. Use Function in Policies

```sql
-- Admins can view all records
CREATE POLICY "Admins can view all"
ON public.some_table
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Users can only view their own
CREATE POLICY "Users view own"
ON public.some_table
FOR SELECT
USING (auth.uid() = user_id);
```

### Avoiding Infinite Recursion

**Problem:** Policies that query the same table cause infinite recursion.

```sql
-- ❌ WRONG - Causes infinite recursion
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- ✅ CORRECT - Use security definer function
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));
```

### Public vs Private Data

```sql
-- Public data (no auth required)
CREATE POLICY "Anyone can view public projects"
ON public.projects
FOR SELECT
USING (is_public = true);

-- Private data (requires ownership)
CREATE POLICY "Owners can manage projects"
ON public.projects
FOR ALL
USING (auth.uid() = owner_id);
```

---

## Input Validation

### Client-Side Validation with Zod

Always validate user input before sending to the server:

```typescript
import { z } from 'zod';

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  message: z
    .string()
    .trim()
    .min(1, 'Message is required')
    .max(1000, 'Message must be less than 1000 characters'),
});

// Usage
const result = contactSchema.safeParse(formData);
if (!result.success) {
  // Handle validation errors
  console.error(result.error.flatten());
}
```

### URL Parameter Encoding

Always encode user input in URLs:

```typescript
// ❌ WRONG - Injection risk
const url = `https://api.example.com/search?q=${userInput}`;

// ✅ CORRECT - Properly encoded
const url = `https://api.example.com/search?q=${encodeURIComponent(userInput)}`;
```

### HTML Content Sanitization

Never use `dangerouslySetInnerHTML` with user content:

```typescript
// ❌ WRONG - XSS vulnerability
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ CORRECT - Use DOMPurify if HTML is required
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />

// ✅ BEST - Avoid HTML rendering entirely
<div>{userContent}</div>
```

---

## API Security

### Edge Function Authentication

Always verify authentication in edge functions:

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: 'Missing authorization header' }),
      { status: 401 }
    );
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  // User is authenticated, proceed with request
});
```

### CORS Configuration

Configure CORS headers properly:

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Restrict in production
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

// Handle preflight requests
if (req.method === 'OPTIONS') {
  return new Response(null, { headers: corsHeaders });
}
```

### Rate Limiting

Implement rate limiting for public endpoints:

```typescript
// Simple in-memory rate limiter (use Redis in production)
const rateLimits = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, limit: number = 100): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute

  const current = rateLimits.get(ip);

  if (!current || now > current.resetTime) {
    rateLimits.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (current.count >= limit) {
    return false;
  }

  current.count++;
  return true;
}
```

---

## Secrets Management

### Environment Variables

- **Never** commit secrets to the repository
- Use Lovable Cloud secrets for API keys
- Access secrets in edge functions via `Deno.env.get()`

### Available Secrets

The platform has these pre-configured secrets:

| Secret                      | Purpose          |
| --------------------------- | ---------------- |
| `SUPABASE_URL`              | Database URL     |
| `SUPABASE_ANON_KEY`         | Public API key   |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin operations |
| `LOVABLE_API_KEY`           | AI integrations  |

### Using Secrets in Edge Functions

```typescript
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// For admin operations (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl!, supabaseKey!);
```

---

## Security Checklist

### Before Deploying

- [ ] All tables have RLS enabled
- [ ] RLS policies tested with different user roles
- [ ] No hardcoded secrets in code
- [ ] Input validation on all forms
- [ ] Authentication required for sensitive routes
- [ ] Edge functions verify authorization
- [ ] No `console.log` of sensitive data
- [ ] CORS configured appropriately

### Database Security

- [ ] `user_id` columns are NOT nullable
- [ ] Foreign keys properly configured
- [ ] Roles stored in separate table (not profiles)
- [ ] Security definer functions for role checks
- [ ] No infinite recursion in policies

### Client Security

- [ ] Using semantic tokens (no hardcoded colors)
- [ ] No localStorage for auth state
- [ ] Protected routes check authentication
- [ ] Error messages don't leak sensitive info
- [ ] Form validation with zod

### Common Vulnerabilities to Avoid

| Vulnerability        | Prevention                                          |
| -------------------- | --------------------------------------------------- |
| SQL Injection        | Use parameterized queries (Supabase does this)      |
| XSS                  | Avoid `dangerouslySetInnerHTML`, sanitize if needed |
| CSRF                 | Supabase handles tokens automatically               |
| Privilege Escalation | Never store roles on user-editable tables           |
| Session Hijacking    | Use secure, httpOnly cookies (default)              |

---

## Reporting Security Issues

### Vulnerability Disclosure Policy

If you discover a security vulnerability in the Alawein Platform:

1. **Do not** open a public GitHub issue
2. **Do not** disclose the vulnerability publicly until it has been addressed
3. Document the vulnerability with detailed reproduction steps
4. Contact the maintainers directly via email

### What to Include in Your Report

```markdown
## Vulnerability Report

**Type:** [XSS | CSRF | SQL Injection | Auth Bypass | RLS Policy | Other]

**Severity:** [Critical | High | Medium | Low]

**Affected Component:**

- File(s):
- Route(s):
- Edge Function(s):

**Description:** [Clear description of the vulnerability]

**Steps to Reproduce:**

1.
2.
3.

**Expected Behavior:** [What should happen]

**Actual Behavior:** [What actually happens - the security issue]

**Proof of Concept:** [Code snippet, screenshot, or video demonstrating the
issue]

**Suggested Fix:** [If you have ideas for remediation]

**Environment:**

- Browser:
- Node version:
- Date discovered:
```

### Response Timeline

| Stage              | Timeline              |
| ------------------ | --------------------- |
| Acknowledgment     | Within 48 hours       |
| Initial Assessment | Within 1 week         |
| Fix Development    | Varies by severity    |
| Public Disclosure  | After fix is deployed |

### Severity Levels

| Level        | Description                           | Examples                                |
| ------------ | ------------------------------------- | --------------------------------------- |
| **Critical** | Immediate exploitation possible       | Auth bypass, data leak, RCE             |
| **High**     | Significant impact with some effort   | RLS policy bypass, privilege escalation |
| **Medium**   | Limited impact or requires conditions | XSS in authenticated context, CSRF      |
| **Low**      | Minimal impact                        | Information disclosure, DoS             |

### Recognition

We appreciate responsible disclosure. Contributors who report valid security
issues will be:

- Credited in the security advisory (if desired)
- Mentioned in the changelog
- Thanked publicly (with permission)

---

## Security Audit Checklist

Use this checklist before deploying changes:

### Authentication

- [ ] All protected routes use `ProtectedRoute` wrapper
- [ ] Session expiry handled gracefully
- [ ] No sensitive data in localStorage
- [ ] Auth state synced with server

### Database Security

- [ ] RLS enabled on all user data tables
- [ ] Policies cover SELECT, INSERT, UPDATE, DELETE
- [ ] No overly permissive policies (`USING (true)`)
- [ ] Sensitive columns not exposed in public views

### API Security

- [ ] All Edge Functions validate input
- [ ] Authentication required where appropriate
- [ ] Error messages don't leak sensitive info
- [ ] Rate limiting considered for public endpoints

### Frontend Security

- [ ] No `dangerouslySetInnerHTML` without sanitization
- [ ] User input validated with Zod before submission
- [ ] Sensitive data not logged to console
- [ ] No API keys in client-side code

---

## Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [OWASP Security Guidelines](https://owasp.org/www-project-web-security-testing-guide/)
- [Zod Validation Library](https://zod.dev/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
