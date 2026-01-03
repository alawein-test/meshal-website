# Infrastructure Guide

> Cloud architecture, scaling strategies, and cost optimization for the MA
> Platform.

## Table of Contents

- Overview
- Cloud Architecture
- Scaling Strategies
- Cost Optimization
- Infrastructure as Code
- Disaster Recovery
- Security Hardening

---

## Overview

This guide covers the infrastructure patterns and best practices for deploying
and managing the MA Platform at scale.

### Architecture Principles

1. **Serverless-First**: Minimize operational overhead
2. **Edge-Optimized**: Deploy close to users
3. **Auto-Scaling**: Handle traffic spikes gracefully
4. **Cost-Aware**: Optimize for efficiency
5. **Resilient**: Design for failure

---

## Cloud Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CDN Layer                                │
│                    (Lovable Edge Network)                        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend Hosting                            │
│                   (Static Assets + SPA)                          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway                                 │
│                   (Edge Functions)                               │
└─────────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│   Database    │     │    Storage    │     │   Realtime    │
│  (PostgreSQL) │     │    (S3/R2)    │     │  (WebSocket)  │
└───────────────┘     └───────────────┘     └───────────────┘
```

### Component Details

#### Frontend (Lovable Hosting)

```typescript
// vite.config.ts - Production optimizations
export default defineConfig({
  build: {
    // Code splitting for optimal loading
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
          ],
          'vendor-charts': ['recharts'],
          'vendor-3d': ['three', '@react-three/fiber', '@react-three/drei'],
        },
      },
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
    // Source maps for production debugging
    sourcemap: 'hidden',
  },
});
```

#### Edge Functions (Lovable Cloud)

```typescript
// supabase/functions/api-gateway/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

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

  const url = new URL(req.url);
  const path = url.pathname;

  // Route to appropriate handler
  switch (true) {
    case path.startsWith('/api/simcore'):
      return handleSimCore(req);
    case path.startsWith('/api/qmlab'):
      return handleQMLab(req);
    case path.startsWith('/api/optilibria'):
      return handleOptiLibria(req);
    default:
      return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
  }
});
```

#### Database Configuration

```sql
-- Connection pooling configuration
-- Managed by Lovable Cloud automatically

-- Recommended indexes for common queries
CREATE INDEX CONCURRENTLY idx_simulations_user_status
ON simcore_simulations(user_id, status);

CREATE INDEX CONCURRENTLY idx_simulations_created_at
ON simcore_simulations(created_at DESC);

CREATE INDEX CONCURRENTLY idx_experiments_user_status
ON qmlab_experiments(user_id, status);

-- Partial indexes for active records
CREATE INDEX CONCURRENTLY idx_active_simulations
ON simcore_simulations(user_id)
WHERE status IN ('running', 'pending');
```

---

## Scaling Strategies

### Horizontal Scaling

#### Database Read Replicas

```typescript
// hooks/useReadReplica.ts
import { createClient } from '@supabase/supabase-js';

// Primary for writes
export const primaryClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

// Read replica for heavy reads (when available)
export const useOptimizedQuery = (
  queryKey: string[],
  queryFn: () => Promise<any>
) => {
  return useQuery({
    queryKey,
    queryFn,
    // Stale-while-revalidate pattern
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes cache
  });
};
```

#### Edge Function Scaling

```typescript
// Edge functions auto-scale based on demand
// Configuration via environment

// Optimize cold starts
const cachedConnections = new Map();

function getConnection(key: string) {
  if (!cachedConnections.has(key)) {
    cachedConnections.set(key, createConnection(key));
  }
  return cachedConnections.get(key);
}
```

### Vertical Scaling

```typescript
// Instance sizing recommendations
const instanceSizing = {
  development: {
    database: 'micro',
    functions: 'shared',
    storage: '1GB',
  },
  staging: {
    database: 'small',
    functions: 'shared',
    storage: '10GB',
  },
  production: {
    database: 'medium', // Start here, scale as needed
    functions: 'dedicated',
    storage: '100GB',
  },
  enterprise: {
    database: 'large',
    functions: 'dedicated-high',
    storage: '1TB+',
  },
};
```

### Caching Strategy

```typescript
// lib/cache.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Network-first with cache fallback
      networkMode: 'offlineFirst',

      // Stale time based on data type
      staleTime: 1000 * 60 * 5, // 5 minutes default

      // Keep in cache for 30 minutes
      gcTime: 1000 * 60 * 30,

      // Retry configuration
      retry: (failureCount, error) => {
        if (error?.status === 404) return false;
        if (error?.status === 401) return false;
        return failureCount < 3;
      },

      // Refetch on window focus for fresh data
      refetchOnWindowFocus: true,
    },
  },
});

// Cache keys with versioning
export const cacheKeys = {
  simulations: (userId: string) => ['simulations', 'v1', userId],
  experiments: (userId: string) => ['experiments', 'v1', userId],
  workflows: (userId: string) => ['workflows', 'v1', userId],
};
```

### Load Balancing

```typescript
// Edge function load distribution
// Automatically handled by Lovable Cloud

// Client-side request distribution for heavy operations
const distributedFetch = async (urls: string[], payload: any) => {
  // Round-robin across available endpoints
  const endpoint = urls[Math.floor(Math.random() * urls.length)];
  return fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
```

---

## Cost Optimization

### Database Optimization

```sql
-- Identify slow queries
SELECT
  query,
  calls,
  mean_exec_time,
  total_exec_time
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 20;

-- Clean up old data
CREATE OR REPLACE FUNCTION cleanup_old_simulations()
RETURNS void AS $$
BEGIN
  -- Archive completed simulations older than 90 days
  INSERT INTO simulations_archive
  SELECT * FROM simcore_simulations
  WHERE status = 'completed'
    AND completed_at < NOW() - INTERVAL '90 days';

  -- Delete archived records
  DELETE FROM simcore_simulations
  WHERE status = 'completed'
    AND completed_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup (via pg_cron if available)
-- SELECT cron.schedule('cleanup-simulations', '0 3 * * 0', 'SELECT cleanup_old_simulations()');
```

### Storage Optimization

```typescript
// Implement tiered storage
const storageConfig = {
  hot: {
    maxAge: 7, // days
    location: 'primary',
  },
  warm: {
    maxAge: 30,
    location: 'archive',
    compression: true,
  },
  cold: {
    maxAge: 365,
    location: 'glacier',
    compression: true,
  },
};

// Compress large payloads
import { compress, decompress } from 'lz-string';

export const storeCompressed = async (key: string, data: any) => {
  const compressed = compress(JSON.stringify(data));
  await storage.upload(key, compressed, {
    contentType: 'application/octet-stream',
    metadata: { compressed: 'true' },
  });
};
```

### Edge Function Optimization

```typescript
// Minimize cold starts
// 1. Keep functions small and focused
// 2. Lazy load heavy dependencies

// Bad: Import everything upfront
// import { heavyLibrary } from 'heavy-library';

// Good: Dynamic imports
const getHeavyLibrary = async () => {
  const { heavyLibrary } = await import('heavy-library');
  return heavyLibrary;
};

// Connection pooling
const pool = {
  maxConnections: 10,
  idleTimeout: 30000,
  connectionTimeout: 5000,
};
```

### Cost Monitoring

```typescript
// Track usage metrics
interface UsageMetrics {
  databaseQueries: number;
  storageBytes: number;
  functionInvocations: number;
  bandwidthBytes: number;
}

const trackUsage = (metrics: UsageMetrics) => {
  // Send to monitoring service
  console.log('[USAGE]', JSON.stringify(metrics));
};

// Budget alerts
const budgetThresholds = {
  warning: 0.75, // 75% of budget
  critical: 0.9, // 90% of budget
  maximum: 1.0, // 100% - hard limit
};
```

---

## Infrastructure as Code

### Environment Configuration

```typescript
// config/environments.ts
interface EnvironmentConfig {
  name: string;
  apiUrl: string;
  features: {
    realtime: boolean;
    analytics: boolean;
    ai: boolean;
  };
  limits: {
    maxSimulations: number;
    maxStorageGB: number;
    maxUsersPerWorkspace: number;
  };
}

export const environments: Record<string, EnvironmentConfig> = {
  development: {
    name: 'development',
    apiUrl: 'http://localhost:54321',
    features: {
      realtime: true,
      analytics: false,
      ai: true,
    },
    limits: {
      maxSimulations: 10,
      maxStorageGB: 1,
      maxUsersPerWorkspace: 5,
    },
  },
  staging: {
    name: 'staging',
    apiUrl: import.meta.env.VITE_SUPABASE_URL,
    features: {
      realtime: true,
      analytics: true,
      ai: true,
    },
    limits: {
      maxSimulations: 100,
      maxStorageGB: 10,
      maxUsersPerWorkspace: 25,
    },
  },
  production: {
    name: 'production',
    apiUrl: import.meta.env.VITE_SUPABASE_URL,
    features: {
      realtime: true,
      analytics: true,
      ai: true,
    },
    limits: {
      maxSimulations: 1000,
      maxStorageGB: 100,
      maxUsersPerWorkspace: 100,
    },
  },
};
```

### Deployment Pipeline

```yaml
# .github/workflows/infrastructure.yml
name: Infrastructure Validation

on:
  pull_request:
    paths:
      - 'supabase/**'
      - 'vite.config.ts'
      - 'tailwind.config.ts'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate Edge Functions
        run: |
          for file in supabase/functions/*/index.ts; do
            deno check "$file"
          done

      - name: Check Build Size
        run: |
          npm run build
          du -sh dist/
          # Fail if bundle too large
          MAX_SIZE=5000 # KB
          SIZE=$(du -s dist | cut -f1)
          if [ "$SIZE" -gt "$MAX_SIZE" ]; then
            echo "Bundle too large: ${SIZE}KB > ${MAX_SIZE}KB"
            exit 1
          fi
```

---

## Disaster Recovery

### Backup Strategy

```typescript
// Automated backups (managed by Lovable Cloud)
// Manual backup triggers for critical operations

const createBackup = async (reason: string) => {
  const timestamp = new Date().toISOString();

  // Export critical data
  const data = {
    simulations: await exportSimulations(),
    experiments: await exportExperiments(),
    workflows: await exportWorkflows(),
    timestamp,
    reason,
  };

  // Store backup
  await storage.upload(
    `backups/${timestamp}/full-backup.json`,
    JSON.stringify(data),
    { contentType: 'application/json' }
  );

  return { timestamp, size: JSON.stringify(data).length };
};
```

### Recovery Procedures

```typescript
// Recovery runbook
const recoveryProcedures = {
  databaseCorruption: [
    '1. Pause all write operations',
    '2. Identify last known good backup',
    '3. Restore from backup',
    '4. Replay WAL logs if available',
    '5. Validate data integrity',
    '6. Resume operations',
  ],

  serviceOutage: [
    '1. Check status page for provider issues',
    '2. Verify edge function health',
    '3. Check database connectivity',
    '4. Review recent deployments',
    '5. Rollback if necessary',
    '6. Notify stakeholders',
  ],

  dataLoss: [
    '1. Stop affected processes',
    '2. Assess scope of data loss',
    '3. Restore from most recent backup',
    '4. Identify recovery point objective (RPO)',
    '5. Document incident',
    '6. Implement preventive measures',
  ],
};
```

### Health Checks

```typescript
// components/HealthCheck.tsx
const healthEndpoints = [
  { name: 'API', url: '/api/health' },
  { name: 'Database', url: '/api/health/db' },
  { name: 'Auth', url: '/api/health/auth' },
];

export const checkHealth = async () => {
  const results = await Promise.allSettled(
    healthEndpoints.map(async (endpoint) => {
      const start = performance.now();
      const response = await fetch(endpoint.url);
      const latency = performance.now() - start;

      return {
        name: endpoint.name,
        status: response.ok ? 'healthy' : 'unhealthy',
        latency: Math.round(latency),
        statusCode: response.status,
      };
    })
  );

  return results.map((result, index) => ({
    endpoint: healthEndpoints[index].name,
    ...(result.status === 'fulfilled'
      ? result.value
      : { status: 'error', error: result.reason }),
  }));
};
```

---

## Security Hardening

### Network Security

```typescript
// CORS configuration
const corsConfig = {
  allowedOrigins: [
    'https://your-domain.lovable.app',
    'https://your-custom-domain.com',
  ],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Client-Info'],
  maxAge: 86400, // 24 hours
};

// Rate limiting
const rateLimits = {
  anonymous: {
    requests: 60,
    window: '1m',
  },
  authenticated: {
    requests: 1000,
    window: '1m',
  },
  api: {
    requests: 100,
    window: '1m',
  },
};
```

### Secret Management

```typescript
// Never hardcode secrets
// Use environment variables via Lovable Cloud

const getSecret = (key: string): string => {
  const value = Deno.env.get(key);
  if (!value) {
    throw new Error(`Missing required secret: ${key}`);
  }
  return value;
};

// Rotate secrets regularly
const secretRotation = {
  API_KEY: '90 days',
  JWT_SECRET: '180 days',
  ENCRYPTION_KEY: '365 days',
};
```

### Audit Logging

```typescript
// Log security-relevant events
const auditLog = async (event: {
  action: string;
  userId?: string;
  resource: string;
  details: Record<string, any>;
  ip?: string;
}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ...event,
    environment: import.meta.env.MODE,
  };

  // Store in audit log table
  await supabase.from('audit_logs').insert(logEntry);

  // Also log to console for immediate visibility
  console.log('[AUDIT]', JSON.stringify(logEntry));
};
```

---

## Related Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Production deployment steps
- [Monitoring Guide](./MONITORING.md) - Observability patterns
- [Security Checklist](./SECURITY_CHECKLIST.md) - Security audit checklist
- [Performance Guide](./PERFORMANCE.md) - Performance optimization
- [API Design](./API_DESIGN.md) - API patterns and best practices

---

## Quick Reference

### Instance Sizing

| Tier       | Database | Functions | Storage | Monthly Cost\* |
| ---------- | -------- | --------- | ------- | -------------- |
| Starter    | Micro    | Shared    | 1GB     | Free           |
| Growth     | Small    | Shared    | 10GB    | $25            |
| Pro        | Medium   | Dedicated | 100GB   | $100           |
| Enterprise | Large+   | Dedicated | 1TB+    | Custom         |

\*Estimated costs, actual pricing varies

### Scaling Triggers

| Metric      | Threshold       | Action                  |
| ----------- | --------------- | ----------------------- |
| CPU         | > 80% sustained | Scale up instance       |
| Memory      | > 85% sustained | Scale up or optimize    |
| Connections | > 80% pool      | Add read replicas       |
| Latency     | > 500ms p95     | Review queries/caching  |
| Error Rate  | > 1%            | Investigate immediately |

### Emergency Contacts

| Issue             | Contact         | SLA      |
| ----------------- | --------------- | -------- |
| Platform Outage   | Lovable Support | < 1 hour |
| Security Incident | Security Team   | < 30 min |
| Data Loss         | Database Admin  | < 1 hour |
