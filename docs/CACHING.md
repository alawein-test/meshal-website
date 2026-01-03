# Caching Guide

> Last verified: 2025-12-09

This guide covers browser caching, CDN configuration, and React Query cache
strategies for the Alawein Platform.

---

## Table of Contents

- Caching Overview
- Browser Caching
- CDN Configuration
- React Query Caching
- Service Worker Caching
- Cache Invalidation
- Best Practices

---

## Caching Overview

### Cache Layers

```
┌─────────────────────────────────────────────────────────────┐
│                      User's Browser                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Memory Cache│  │ Disk Cache  │  │ Service Worker Cache│  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         CDN Edge                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Edge Cache (Static Assets)              │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ React Query │  │ Zustand     │  │ LocalStorage        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Cache Strategy Selection

| Data Type        | Strategy               | TTL        | Example         |
| ---------------- | ---------------------- | ---------- | --------------- |
| Static assets    | Cache-first            | 1 year     | JS, CSS, images |
| API responses    | Stale-while-revalidate | 5 min      | User data       |
| Real-time data   | Network-only           | 0          | Live updates    |
| User preferences | Local storage          | Persistent | Theme, settings |

---

## Browser Caching

### HTTP Cache Headers

```typescript
// vite.config.ts - Configure build output for optimal caching
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // Content-hashed filenames for cache busting
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
```

### Cache-Control Headers

```typescript
// Edge function to set cache headers
Deno.serve(async (req) => {
  const url = new URL(req.url);

  // Static assets - long cache
  if (url.pathname.match(/\.(js|css|png|jpg|svg)$/)) {
    return new Response(body, {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }

  // API responses - short cache with revalidation
  if (url.pathname.startsWith('/api/')) {
    return new Response(body, {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    });
  }

  // HTML - no cache (for SPA routing)
  return new Response(body, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
});
```

### ETag and Conditional Requests

```typescript
// Generate ETag for content
const generateETag = (content: string): string => {
  const hash = crypto.subtle.digestSync(
    'SHA-256',
    new TextEncoder().encode(content)
  );
  return btoa(String.fromCharCode(...new Uint8Array(hash))).slice(0, 27);
};

// Handle conditional requests
Deno.serve(async (req) => {
  const content = await fetchContent();
  const etag = generateETag(content);

  // Check If-None-Match header
  if (req.headers.get('If-None-Match') === etag) {
    return new Response(null, { status: 304 });
  }

  return new Response(content, {
    headers: {
      ETag: etag,
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
});
```

---

## CDN Configuration

### Lovable/Vercel CDN Settings

```json
// vercel.json (if using Vercel)
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).html",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

### Asset Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    // Split vendor chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
          ],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-router': ['react-router-dom'],
        },
      },
    },
  },
});
```

### Image Optimization

```typescript
// Use responsive images with CDN transforms
const OptimizedImage = ({ src, alt, sizes }: ImageProps) => {
  const cdnUrl = (width: number) =>
    `${src}?w=${width}&q=80&format=webp`;

  return (
    <picture>
      <source
        type="image/webp"
        srcSet={`
          ${cdnUrl(400)} 400w,
          ${cdnUrl(800)} 800w,
          ${cdnUrl(1200)} 1200w
        `}
        sizes={sizes}
      />
      <img
        src={cdnUrl(800)}
        alt={alt}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
};
```

---

## React Query Caching

### Query Client Configuration

```typescript
// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000,

      // Cache retained for 30 minutes
      gcTime: 30 * 60 * 1000,

      // Retry failed requests
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch on window focus
      refetchOnWindowFocus: true,

      // Don't refetch on mount if data is fresh
      refetchOnMount: false,
    },
  },
});
```

### Query Key Patterns

```typescript
// Consistent query key factory
export const queryKeys = {
  // All projects
  projects: ['projects'] as const,

  // Single project by ID
  project: (id: string) => ['projects', id] as const,

  // Project features
  projectFeatures: (projectId: string) =>
    ['projects', projectId, 'features'] as const,

  // User-specific data
  userProjects: (userId: string) => ['projects', { userId }] as const,

  // Filtered/paginated
  projectsList: (filters: ProjectFilters) =>
    ['projects', 'list', filters] as const,
};
```

### Cache Strategies by Data Type

```typescript
// Frequently changing data - short cache
export const useSimulations = () => {
  return useQuery({
    queryKey: queryKeys.simulations,
    queryFn: fetchSimulations,
    staleTime: 10 * 1000, // 10 seconds
    refetchInterval: 30 * 1000, // Poll every 30s
  });
};

// Rarely changing data - long cache
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// User-specific data - medium cache
export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => fetchProfile(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!userId,
  });
};
```

### Optimistic Updates

```typescript
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProject,

    // Optimistic update
    onMutate: async (newProject) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.project(newProject.id),
      });

      // Snapshot previous value
      const previousProject = queryClient.getQueryData(
        queryKeys.project(newProject.id)
      );

      // Optimistically update
      queryClient.setQueryData(queryKeys.project(newProject.id), newProject);

      return { previousProject };
    },

    // Rollback on error
    onError: (err, newProject, context) => {
      queryClient.setQueryData(
        queryKeys.project(newProject.id),
        context?.previousProject
      );
    },

    // Refetch after success
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.project(variables.id),
      });
    },
  });
};
```

### Prefetching

```typescript
// Prefetch on hover
const ProjectLink = ({ projectId }: { projectId: string }) => {
  const queryClient = useQueryClient();

  const prefetchProject = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.project(projectId),
      queryFn: () => fetchProject(projectId),
      staleTime: 5 * 60 * 1000,
    });
  };

  return (
    <Link
      to={`/projects/${projectId}`}
      onMouseEnter={prefetchProject}
      onFocus={prefetchProject}
    >
      View Project
    </Link>
  );
};

// Prefetch next page
const usePaginatedProjects = (page: number) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.projectsList({ page }),
    queryFn: () => fetchProjects({ page }),
  });

  // Prefetch next page
  useEffect(() => {
    if (query.data?.hasNextPage) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.projectsList({ page: page + 1 }),
        queryFn: () => fetchProjects({ page: page + 1 }),
      });
    }
  }, [query.data, page, queryClient]);

  return query;
};
```

---

## Service Worker Caching

### PWA Configuration

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // Cache strategies
        runtimeCaching: [
          {
            // Static assets - cache first
            urlPattern: /\.(?:js|css|woff2?)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-assets',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            // Images - cache first with fallback
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            // API calls - network first
            urlPattern: /\/api\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5, // 5 minutes
              },
              networkTimeoutSeconds: 10,
            },
          },
        ],
      },
    }),
  ],
});
```

### Offline Support

```typescript
// src/hooks/useOfflineSync.ts
export const useOfflineSync = () => {
  const queryClient = useQueryClient();
  const [pendingMutations, setPendingMutations] = useState<Mutation[]>([]);

  useEffect(() => {
    const handleOnline = async () => {
      // Retry pending mutations when back online
      for (const mutation of pendingMutations) {
        try {
          await mutation.execute();
          setPendingMutations((prev) =>
            prev.filter((m) => m.id !== mutation.id)
          );
        } catch (error) {
          console.error('Failed to sync mutation:', error);
        }
      }

      // Refetch stale queries
      queryClient.invalidateQueries();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [pendingMutations, queryClient]);

  return {
    isOffline: !navigator.onLine,
    pendingCount: pendingMutations.length,
  };
};
```

---

## Cache Invalidation

### Invalidation Strategies

```typescript
// Invalidate specific query
queryClient.invalidateQueries({ queryKey: queryKeys.project(projectId) });

// Invalidate all projects
queryClient.invalidateQueries({ queryKey: queryKeys.projects });

// Invalidate with predicate
queryClient.invalidateQueries({
  predicate: (query) =>
    query.queryKey[0] === 'projects' &&
    query.state.dataUpdatedAt < Date.now() - 60000,
});

// Remove from cache entirely
queryClient.removeQueries({ queryKey: queryKeys.project(projectId) });
```

### Real-time Cache Updates

```typescript
// Subscribe to real-time updates
export const useRealtimeProjects = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            queryClient.setQueryData(
              queryKeys.projects,
              (old: Project[] = []) => [...old, payload.new as Project]
            );
          } else if (payload.eventType === 'UPDATE') {
            queryClient.setQueryData(
              queryKeys.project(payload.new.id),
              payload.new
            );
          } else if (payload.eventType === 'DELETE') {
            queryClient.setQueryData(
              queryKeys.projects,
              (old: Project[] = []) =>
                old.filter((p) => p.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};
```

---

## Best Practices

### Cache Strategy Decision Tree

```
Is the data user-specific?
├── Yes → Use React Query with auth-based keys
│   └── Does it change frequently?
│       ├── Yes → staleTime: 10-60s
│       └── No → staleTime: 5-30min
└── No → Is it static?
    ├── Yes → Use HTTP caching (1 year)
    └── No → Use React Query
        └── staleTime: based on update frequency
```

### Performance Checklist

- [ ] Static assets have content hashes in filenames
- [ ] Cache-Control headers set appropriately
- [ ] React Query staleTime configured per query type
- [ ] Optimistic updates for mutations
- [ ] Prefetching for navigation
- [ ] Service worker for offline support
- [ ] Real-time subscriptions update cache

### Common Mistakes to Avoid

```typescript
// ❌ Don't cache user-specific data globally
const { data } = useQuery({
  queryKey: ['user-data'], // Missing user ID
  queryFn: fetchUserData,
});

// ✅ Include user ID in query key
const { data } = useQuery({
  queryKey: ['user-data', userId],
  queryFn: () => fetchUserData(userId),
});

// ❌ Don't set staleTime to 0 for all queries
staleTime: 0, // Causes unnecessary refetches

// ✅ Set appropriate staleTime
staleTime: 5 * 60 * 1000, // 5 minutes for most data
```

---

## Related Documentation

- [PERFORMANCE.md](./PERFORMANCE.md) - Performance optimization
- [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) - State management patterns
- [INFRASTRUCTURE.md](./INFRASTRUCTURE.md) - Infrastructure configuration

---

_This guide is updated as caching strategies evolve._
