# Performance Optimization Guide

> Last verified: 2025-12-09

---

## Overview

This guide covers performance optimization strategies, monitoring techniques,
and best practices for the Alawein Platform.

---

## Table of Contents

1. Performance Metrics
2. Bundle Optimization
3. Runtime Performance
4. React Optimization
5. Network Optimization
6. Image Optimization
7. Monitoring & Profiling
8. Performance Budgets
9. Common Issues

---

## Performance Metrics

### Core Web Vitals

| Metric                              | Target  | Description                            |
| ----------------------------------- | ------- | -------------------------------------- |
| **LCP** (Largest Contentful Paint)  | < 2.5s  | Time to render largest content element |
| **INP** (Interaction to Next Paint) | < 200ms | Responsiveness to user interactions    |
| **CLS** (Cumulative Layout Shift)   | < 0.1   | Visual stability during load           |

### Additional Metrics

| Metric                           | Target  | Description                   |
| -------------------------------- | ------- | ----------------------------- |
| **FCP** (First Contentful Paint) | < 1.8s  | Time to first visible content |
| **TTFB** (Time to First Byte)    | < 800ms | Server response time          |
| **TTI** (Time to Interactive)    | < 3.8s  | Time until fully interactive  |

### Measuring Performance

```bash
# Lighthouse CLI
npx lighthouse https://your-app.lovable.app --output html --view

# Bundle analysis
npm run build -- --report
npx vite-bundle-visualizer
```

---

## Bundle Optimization

### Code Splitting

```typescript
// ❌ Bad: Import everything upfront
import { HeavyComponent } from './HeavyComponent';

// ✅ Good: Lazy load heavy components
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Route-Based Splitting

```typescript
// src/App.tsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load route components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Suspense>
  );
}
```

### Tree Shaking

```typescript
// ❌ Bad: Import entire library
import _ from 'lodash';
const result = _.debounce(fn, 300);

// ✅ Good: Import only what you need
import debounce from 'lodash/debounce';
const result = debounce(fn, 300);

// ✅ Best: Use native or lighter alternatives
function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): T {
  let timeoutId: ReturnType<typeof setTimeout>;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  }) as T;
}
```

### Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  build: {
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs
        drop_debugger: true,
      },
    },
    // Chunk splitting strategy
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
          ],
          'vendor-charts': ['recharts'],
          'vendor-motion': ['framer-motion'],
        },
      },
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
  },
});
```

---

## Runtime Performance

### Avoiding Layout Thrashing

```typescript
// ❌ Bad: Causes layout thrashing
elements.forEach((el) => {
  const height = el.offsetHeight; // Read
  el.style.height = height + 10 + 'px'; // Write
});

// ✅ Good: Batch reads, then batch writes
const heights = elements.map((el) => el.offsetHeight); // All reads
elements.forEach((el, i) => {
  el.style.height = heights[i] + 10 + 'px'; // All writes
});
```

### RequestAnimationFrame

```typescript
// ❌ Bad: Animation without RAF
function animate() {
  element.style.transform = `translateX(${x}px)`;
  x += 1;
  setTimeout(animate, 16);
}

// ✅ Good: Use requestAnimationFrame
function animate() {
  element.style.transform = `translateX(${x}px)`;
  x += 1;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

### Debouncing & Throttling

```typescript
import { useCallback, useRef, useEffect } from 'react';

// Debounce hook
function useDebounce<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    }) as T,
    [callback, delay]
  );
}

// Usage
function SearchInput() {
  const debouncedSearch = useDebounce((query: string) => {
    fetchResults(query);
  }, 300);

  return <input onChange={(e) => debouncedSearch(e.target.value)} />;
}
```

### Web Workers

```typescript
// heavy-computation.worker.ts
self.onmessage = (e: MessageEvent<{ data: number[] }>) => {
  const result = e.data.data.reduce((sum, n) => sum + n * n, 0);
  self.postMessage({ result });
};

// Component usage
function DataProcessor() {
  const [result, setResult] = useState<number | null>(null);

  const processData = useCallback((data: number[]) => {
    const worker = new Worker(
      new URL('./heavy-computation.worker.ts', import.meta.url),
      { type: 'module' }
    );

    worker.onmessage = (e) => {
      setResult(e.data.result);
      worker.terminate();
    };

    worker.postMessage({ data });
  }, []);

  return <button onClick={() => processData(largeArray)}>Process</button>;
}
```

---

## React Optimization

### Memoization

```typescript
import { memo, useMemo, useCallback } from 'react';

// Memoize expensive computations
function DataTable({ items, filter }: Props) {
  const filteredItems = useMemo(() => {
    return items.filter(item => item.name.includes(filter));
  }, [items, filter]);

  return <Table data={filteredItems} />;
}

// Memoize callbacks
function ParentComponent() {
  const handleClick = useCallback((id: string) => {
    console.log('Clicked:', id);
  }, []);

  return <ChildComponent onClick={handleClick} />;
}

// Memoize components
const ExpensiveComponent = memo(function ExpensiveComponent({ data }: Props) {
  return <div>{/* Complex rendering */}</div>;
});
```

### Virtual Lists

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {items[virtualRow.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### State Management Optimization

```typescript
// ❌ Bad: Store everything in one state
const [state, setState] = useState({
  user: null,
  items: [],
  filters: {},
  ui: { modal: false, sidebar: true },
});

// ✅ Good: Split state by update frequency
const [user, setUser] = useState(null);
const [items, setItems] = useState([]);
const [filters, setFilters] = useState({});
const [ui, setUi] = useState({ modal: false, sidebar: true });

// ✅ Best: Use state management with selectors
import { create } from 'zustand';

const useStore = create((set) => ({
  items: [],
  setItems: (items) => set({ items }),
}));

// Only re-render when items change
const items = useStore((state) => state.items);
```

### Avoiding Re-renders

```typescript
// ❌ Bad: Creates new object on every render
function Component() {
  return <Child style={{ color: 'red' }} />;
}

// ✅ Good: Define outside or memoize
const style = { color: 'red' };
function Component() {
  return <Child style={style} />;
}

// ❌ Bad: Inline function creates new reference
function Component() {
  return <Child onClick={() => handleClick(id)} />;
}

// ✅ Good: Use useCallback
function Component() {
  const handleItemClick = useCallback(() => handleClick(id), [id]);
  return <Child onClick={handleItemClick} />;
}
```

---

## Network Optimization

### Data Fetching with React Query

```typescript
import { useQuery, useQueryClient } from '@tanstack/react-query';

function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (previously cacheTime)
  });

  if (isLoading) return <Skeleton />;
  return <Profile user={data} />;
}

// Prefetching
function UserList() {
  const queryClient = useQueryClient();

  const prefetchUser = (userId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
    });
  };

  return (
    <ul>
      {users.map(user => (
        <li
          key={user.id}
          onMouseEnter={() => prefetchUser(user.id)}
        >
          {user.name}
        </li>
      ))}
    </ul>
  );
}
```

### API Response Optimization

```typescript
// Request only needed fields
const { data } = await supabase
  .from('projects')
  .select('id, name, status') // Don't select *
  .limit(20)
  .order('created_at', { ascending: false });

// Pagination
const { data, count } = await supabase
  .from('items')
  .select('*', { count: 'exact' })
  .range(0, 19); // First 20 items
```

### Caching Strategies

```typescript
// Service Worker caching
// vite-plugin-pwa configuration
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.example\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 1 day
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
    }),
  ],
});
```

---

## Image Optimization

### Responsive Images

```typescript
function ResponsiveImage({ src, alt }: { src: string; alt: string }) {
  return (
    <picture>
      <source
        media="(min-width: 1024px)"
        srcSet={`${src}?w=1200 1x, ${src}?w=2400 2x`}
      />
      <source
        media="(min-width: 768px)"
        srcSet={`${src}?w=800 1x, ${src}?w=1600 2x`}
      />
      <img
        src={`${src}?w=400`}
        srcSet={`${src}?w=400 1x, ${src}?w=800 2x`}
        alt={alt}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}
```

### Lazy Loading

```typescript
import { useState, useRef, useEffect } from 'react';

function LazyImage({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`transition-opacity ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          {...props}
        />
      )}
    </div>
  );
}
```

### Image Formats

| Format | Best For            | Browser Support |
| ------ | ------------------- | --------------- |
| WebP   | General use, photos | 97%+            |
| AVIF   | Best compression    | 85%+            |
| SVG    | Icons, logos        | 100%            |
| PNG    | Transparency needed | 100%            |
| JPEG   | Photos (fallback)   | 100%            |

---

## Monitoring & Profiling

### React DevTools Profiler

```typescript
// Enable profiling in development
import { Profiler } from 'react';

function onRenderCallback(
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) {
  console.log(`${id} ${phase}: ${actualDuration.toFixed(2)}ms`);
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <MainContent />
    </Profiler>
  );
}
```

### Performance Observer

```typescript
// Track Core Web Vitals
function trackWebVitals() {
  if ('PerformanceObserver' in window) {
    // LCP
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    // FID / INP
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('Interaction:', entry.duration);
      }
    }).observe({ type: 'first-input', buffered: true });

    // CLS
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as LayoutShiftEntry[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      console.log('CLS:', clsValue);
    }).observe({ type: 'layout-shift', buffered: true });
  }
}
```

### Custom Performance Marks

```typescript
// Mark important events
performance.mark('app-start');

// After initialization
performance.mark('app-ready');
performance.measure('app-init', 'app-start', 'app-ready');

const measures = performance.getEntriesByType('measure');
console.log('App initialization:', measures[0].duration, 'ms');
```

---

## Performance Budgets

### Bundle Size Budgets

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // Warn if chunk exceeds 500KB
        chunkSizeWarningLimit: 500,
      },
    },
  },
});
```

### Performance Budget Configuration

```json
// .performance-budget.json
{
  "budgets": [
    {
      "resourceType": "script",
      "budget": 300
    },
    {
      "resourceType": "stylesheet",
      "budget": 100
    },
    {
      "resourceType": "image",
      "budget": 500
    },
    {
      "resourceType": "total",
      "budget": 1000
    }
  ],
  "timings": {
    "first-contentful-paint": 1800,
    "largest-contentful-paint": 2500,
    "cumulative-layout-shift": 0.1,
    "total-blocking-time": 300
  }
}
```

---

## Common Issues

### Memory Leaks

```typescript
// ❌ Bad: Memory leak with uncleared interval
useEffect(() => {
  const interval = setInterval(() => {
    setCount((c) => c + 1);
  }, 1000);
  // Missing cleanup!
}, []);

// ✅ Good: Proper cleanup
useEffect(() => {
  const interval = setInterval(() => {
    setCount((c) => c + 1);
  }, 1000);

  return () => clearInterval(interval);
}, []);
```

### Excessive Re-renders

```typescript
// Use React DevTools Profiler to identify
// Components that re-render unnecessarily

// Solutions:
// 1. Memoize with React.memo
// 2. Use useMemo for computed values
// 3. Use useCallback for callbacks
// 4. Split state to reduce update scope
```

### Slow Initial Load

```bash
# Analyze bundle
npx vite-bundle-visualizer

# Common fixes:
# 1. Code split routes
# 2. Lazy load heavy components
# 3. Remove unused dependencies
# 4. Use production builds
```

---

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
- [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) - Testing patterns
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues
