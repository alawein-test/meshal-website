# API Design Guide

> Last verified: 2025-12-09

---

## Overview

This guide covers API design principles, versioning strategy, and error handling
patterns for the Alawein Platform.

---

## Design Principles

### RESTful Conventions

| Method | Purpose              | Idempotent | Safe |
| ------ | -------------------- | ---------- | ---- |
| GET    | Retrieve resource(s) | Yes        | Yes  |
| POST   | Create resource      | No         | No   |
| PUT    | Replace resource     | Yes        | No   |
| PATCH  | Update resource      | Yes        | No   |
| DELETE | Remove resource      | Yes        | No   |

### URL Structure

```
/api/v1/{resource}              # Collection
/api/v1/{resource}/{id}         # Individual resource
/api/v1/{resource}/{id}/{sub}   # Sub-resource
```

**Examples:**

```
GET    /api/v1/projects              # List all projects
POST   /api/v1/projects              # Create project
GET    /api/v1/projects/123          # Get project 123
PUT    /api/v1/projects/123          # Replace project 123
PATCH  /api/v1/projects/123          # Update project 123
DELETE /api/v1/projects/123          # Delete project 123
GET    /api/v1/projects/123/features # List features of project 123
```

### Naming Conventions

```
# ✅ Good
/api/v1/user-profiles          # Kebab-case
/api/v1/projects               # Plural nouns
/api/v1/projects/123/activate  # Verb for actions

# ❌ Bad
/api/v1/userProfiles           # camelCase
/api/v1/project                # Singular
/api/v1/getProjects            # Verb prefix
```

---

## Edge Function Patterns

### Standard Structure

```typescript
// supabase/functions/resource-api/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Route handling
    const url = new URL(req.url);
    const path = url.pathname.split('/').filter(Boolean);

    switch (req.method) {
      case 'GET':
        return handleGet(supabase, user, path, url.searchParams);
      case 'POST':
        return handlePost(supabase, user, await req.json());
      case 'PUT':
      case 'PATCH':
        return handleUpdate(supabase, user, path, await req.json());
      case 'DELETE':
        return handleDelete(supabase, user, path);
      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

### Input Validation

```typescript
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

// Define schemas
const CreateProjectSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  category: z.enum([
    'scientific-computing',
    'enterprise-automation',
    'ai-research',
  ]),
  is_public: z.boolean().default(false),
});

const UpdateProjectSchema = CreateProjectSchema.partial();

const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(['created_at', 'updated_at', 'name']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

// Usage
async function handlePost(supabase: any, user: any, body: unknown) {
  const result = CreateProjectSchema.safeParse(body);

  if (!result.success) {
    return new Response(
      JSON.stringify({
        error: 'Validation failed',
        details: result.error.flatten(),
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({ ...result.data, owner_id: user.id })
    .select()
    .single();

  if (error) throw error;

  return new Response(JSON.stringify({ data }), {
    status: 201,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
```

---

## Response Formats

### Success Responses

```typescript
// Single resource
{
  "data": {
    "id": "123",
    "name": "Project Name",
    "created_at": "2025-12-09T00:00:00Z"
  }
}

// Collection
{
  "data": [
    { "id": "1", "name": "Project 1" },
    { "id": "2", "name": "Project 2" }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}

// Action result
{
  "success": true,
  "message": "Operation completed successfully"
}
```

### Error Responses

```typescript
// Standard error
{
  "error": "Resource not found",
  "code": "NOT_FOUND",
  "status": 404
}

// Validation error
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "status": 400,
  "details": {
    "fieldErrors": {
      "name": ["Name is required"],
      "email": ["Invalid email format"]
    },
    "formErrors": []
  }
}

// Rate limit error
{
  "error": "Too many requests",
  "code": "RATE_LIMITED",
  "status": 429,
  "retryAfter": 60
}
```

---

## Error Handling

### Error Codes

| Code                  | HTTP Status | Description              |
| --------------------- | ----------- | ------------------------ |
| `BAD_REQUEST`         | 400         | Invalid request format   |
| `VALIDATION_ERROR`    | 400         | Input validation failed  |
| `UNAUTHORIZED`        | 401         | Missing/invalid auth     |
| `FORBIDDEN`           | 403         | Insufficient permissions |
| `NOT_FOUND`           | 404         | Resource doesn't exist   |
| `CONFLICT`            | 409         | Resource conflict        |
| `RATE_LIMITED`        | 429         | Too many requests        |
| `INTERNAL_ERROR`      | 500         | Server error             |
| `SERVICE_UNAVAILABLE` | 503         | Service temporarily down |

### Error Handler

```typescript
interface ApiError {
  error: string;
  code: string;
  status: number;
  details?: unknown;
}

function createError(
  message: string,
  code: string,
  status: number,
  details?: unknown
): Response {
  const body: ApiError = { error: message, code, status };
  if (details) body.details = details;

  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Usage
if (!resource) {
  return createError('Project not found', 'NOT_FOUND', 404);
}

if (!hasPermission) {
  return createError('Access denied', 'FORBIDDEN', 403);
}
```

---

## Versioning Strategy

### URL Versioning (Recommended)

```
/api/v1/projects
/api/v2/projects
```

### Version Lifecycle

| Stage      | Duration | Support Level  |
| ---------- | -------- | -------------- |
| Current    | Active   | Full support   |
| Deprecated | 6 months | Security fixes |
| Retired    | -        | No support     |

### Migration Process

```typescript
// Version routing
serve(async (req) => {
  const url = new URL(req.url);
  const version = url.pathname.match(/\/v(\d+)\//)?.[1];

  switch (version) {
    case '1':
      return handleV1(req);
    case '2':
      return handleV2(req);
    default:
      return handleV2(req); // Default to latest
  }
});

// Deprecation header
function handleV1(req: Request): Response {
  const response = processRequest(req);
  response.headers.set('Deprecation', 'true');
  response.headers.set('Sunset', '2026-06-01');
  response.headers.set('Link', '</api/v2/>; rel="successor-version"');
  return response;
}
```

---

## Pagination

### Offset Pagination

```typescript
// Request
GET /api/v1/projects?page=2&limit=20

// Implementation
async function handleGet(supabase: any, params: URLSearchParams) {
  const page = parseInt(params.get('page') || '1');
  const limit = parseInt(params.get('limit') || '20');
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabase
    .from('projects')
    .select('*', { count: 'exact' })
    .range(offset, offset + limit - 1);

  return {
    data,
    meta: {
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit),
    },
  };
}
```

### Cursor Pagination

```typescript
// Request
GET /api/v1/projects?cursor=abc123&limit=20

// Implementation
async function handleCursorPagination(supabase: any, params: URLSearchParams) {
  const cursor = params.get('cursor');
  const limit = parseInt(params.get('limit') || '20');

  let query = supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit + 1); // Fetch one extra to check for next page

  if (cursor) {
    const decoded = atob(cursor);
    query = query.lt('created_at', decoded);
  }

  const { data, error } = await query;

  const hasNext = data.length > limit;
  const items = hasNext ? data.slice(0, -1) : data;
  const nextCursor = hasNext
    ? btoa(items[items.length - 1].created_at)
    : null;

  return {
    data: items,
    meta: {
      nextCursor,
      hasNext,
    },
  };
}
```

---

## Filtering & Sorting

### Query Parameters

```
# Filter by field
GET /api/v1/projects?status=active

# Multiple filters
GET /api/v1/projects?status=active&category=ai-research

# Sorting
GET /api/v1/projects?sort=created_at&order=desc

# Search
GET /api/v1/projects?search=quantum
```

### Implementation

```typescript
async function handleGet(supabase: any, params: URLSearchParams) {
  let query = supabase.from('projects').select('*');

  // Filtering
  const status = params.get('status');
  if (status) {
    query = query.eq('status', status);
  }

  const category = params.get('category');
  if (category) {
    query = query.eq('category', category);
  }

  // Search
  const search = params.get('search');
  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  // Sorting
  const sort = params.get('sort') || 'created_at';
  const order = params.get('order') === 'asc';
  query = query.order(sort, { ascending: order });

  const { data, error } = await query;
  return { data };
}
```

---

## Rate Limiting

### Implementation

```typescript
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(
  userId: string,
  limit = 100,
  windowMs = 60000
): boolean {
  const now = Date.now();
  const key = userId;

  const current = rateLimits.get(key);

  if (!current || current.resetAt < now) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (current.count >= limit) {
    return false;
  }

  current.count++;
  return true;
}

// Usage
serve(async (req) => {
  const user = await authenticate(req);

  if (!checkRateLimit(user.id)) {
    return new Response(
      JSON.stringify({
        error: 'Too many requests',
        code: 'RATE_LIMITED',
        retryAfter: 60,
      }),
      {
        status: 429,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Retry-After': '60',
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Date.now() + 60000),
        },
      }
    );
  }

  // Process request...
});
```

---

## Authentication Patterns

### Bearer Token

```typescript
async function authenticate(req: Request, supabase: any) {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AuthError('Missing or invalid authorization header');
  }

  const token = authHeader.substring(7);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new AuthError('Invalid or expired token');
  }

  return user;
}
```

### API Key (for public endpoints)

```typescript
async function validateApiKey(req: Request, supabase: any) {
  const apiKey = req.headers.get('X-API-Key');

  if (!apiKey) {
    throw new AuthError('Missing API key');
  }

  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('key_hash', hashKey(apiKey))
    .eq('is_active', true)
    .single();

  if (error || !data) {
    throw new AuthError('Invalid API key');
  }

  // Update last used timestamp
  await supabase
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', data.id);

  return data;
}
```

---

## Caching

### Cache Headers

```typescript
function createCachedResponse(data: unknown, maxAge = 300): Response {
  return new Response(JSON.stringify({ data }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'Cache-Control': `public, max-age=${maxAge}`,
      ETag: generateETag(data),
    },
  });
}

// Conditional GET
serve(async (req) => {
  const ifNoneMatch = req.headers.get('If-None-Match');
  const data = await fetchData();
  const etag = generateETag(data);

  if (ifNoneMatch === etag) {
    return new Response(null, { status: 304 });
  }

  return createCachedResponse(data);
});
```

---

## Documentation

### OpenAPI/Swagger

```yaml
openapi: 3.0.3
info:
  title: Alawein Platform API
  version: 1.0.0
paths:
  /api/v1/projects:
    get:
      summary: List projects
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProjectList'
```

---

## Related Documentation

- [SECURITY.md](./SECURITY.md) - Security best practices
- [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md) - Security audit checklist
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
