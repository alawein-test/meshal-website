# Database Patterns

> Last verified: 2025-12-09

This guide covers PostgreSQL best practices, indexing strategies, and query
optimization for the Alawein Platform.

---

## Table of Contents

- Schema Design
- Indexing Strategies
- Query Optimization
- Connection Management
- Data Integrity
- Performance Monitoring

---

## Schema Design

### Naming Conventions

```sql
-- Tables: plural, snake_case
CREATE TABLE user_profiles (...);
CREATE TABLE project_features (...);

-- Columns: snake_case, descriptive
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes: idx_table_column(s)
CREATE INDEX idx_projects_owner_id ON projects(owner_id);

-- Foreign keys: fk_table_referenced
ALTER TABLE projects
  ADD CONSTRAINT fk_projects_owner
  FOREIGN KEY (owner_id) REFERENCES profiles(id);
```

### UUID vs Serial IDs

```sql
-- Prefer UUIDs for distributed systems
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Benefits: no sequence contention, merge-friendly
);

-- Use serial only for internal tables
CREATE TABLE internal_logs (
  id SERIAL PRIMARY KEY,
  -- Benefits: smaller, faster for sequential access
);
```

### Timestamp Standards

```sql
-- Always use TIMESTAMPTZ for consistency
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Auto-update trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### JSONB for Flexible Data

```sql
-- Use JSONB for semi-structured data
CREATE TABLE configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  settings JSONB NOT NULL DEFAULT '{}',
  metadata JSONB
);

-- Query JSONB fields
SELECT * FROM configurations
WHERE settings->>'theme' = 'dark';

-- Index JSONB for performance
CREATE INDEX idx_configurations_settings
  ON configurations USING GIN(settings);
```

---

## Indexing Strategies

### B-Tree Indexes (Default)

```sql
-- Single column index for equality/range queries
CREATE INDEX idx_users_email ON users(email);

-- Composite index for multi-column queries
CREATE INDEX idx_orders_user_date
  ON orders(user_id, created_at DESC);

-- Partial index for filtered queries
CREATE INDEX idx_active_subscriptions
  ON subscriptions(user_id)
  WHERE status = 'active';
```

### GIN Indexes for JSONB/Arrays

```sql
-- Full JSONB indexing
CREATE INDEX idx_settings_gin
  ON configurations USING GIN(settings);

-- Path-specific JSONB index
CREATE INDEX idx_settings_theme
  ON configurations USING BTREE((settings->>'theme'));

-- Array containment
CREATE INDEX idx_tags_gin
  ON posts USING GIN(tags);
```

### Index Selection Guidelines

```typescript
// When to create indexes:
const indexGuidelines = {
  // Always index
  foreignKeys: true, // JOIN performance
  frequentlyQueried: true, // WHERE clause columns
  orderByColumns: true, // Sorting columns

  // Consider carefully
  lowCardinality: false, // Boolean/enum columns often not worth it
  frequentlyUpdated: false, // Write overhead
  smallTables: false, // < 1000 rows often faster with seq scan
};
```

### Covering Indexes

```sql
-- Include columns to avoid table lookup
CREATE INDEX idx_orders_summary
  ON orders(user_id, created_at)
  INCLUDE (total_amount, status);

-- Query can be satisfied from index alone
SELECT total_amount, status
FROM orders
WHERE user_id = $1
ORDER BY created_at DESC;
```

---

## Query Optimization

### EXPLAIN ANALYZE

```sql
-- Always analyze slow queries
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT p.*, count(f.id) as feature_count
FROM projects p
LEFT JOIN project_features f ON f.project_id = p.id
WHERE p.owner_id = 'user-uuid'
GROUP BY p.id;

-- Key metrics to watch:
-- - Seq Scan on large tables (needs index)
-- - High buffer reads (I/O bound)
-- - Nested loops on large datasets
```

### Common Query Patterns

```sql
-- Pagination with cursor (preferred)
SELECT * FROM posts
WHERE created_at < $cursor
ORDER BY created_at DESC
LIMIT 20;

-- Pagination with offset (avoid for deep pages)
SELECT * FROM posts
ORDER BY created_at DESC
LIMIT 20 OFFSET 100;

-- Count optimization
SELECT count(*) FROM posts WHERE status = 'published';
-- Consider: estimated counts for large tables
SELECT reltuples::bigint FROM pg_class WHERE relname = 'posts';
```

### Avoiding N+1 Queries

```typescript
// ❌ Bad: N+1 queries
const projects = await supabase.from('projects').select('*');
for (const project of projects.data) {
  const features = await supabase
    .from('project_features')
    .select('*')
    .eq('project_id', project.id);
}

// ✅ Good: Single query with join
const { data } = await supabase.from('projects').select(`
    *,
    project_features (*)
  `);
```

### Batch Operations

```typescript
// ❌ Bad: Individual inserts
for (const item of items) {
  await supabase.from('items').insert(item);
}

// ✅ Good: Batch insert
await supabase.from('items').insert(items);

// ✅ Good: Upsert for idempotency
await supabase.from('items').upsert(items, { onConflict: 'external_id' });
```

---

## Connection Management

### Connection Pooling

```typescript
// Supabase handles connection pooling automatically
// For edge functions, connections are pooled per region

// Best practices:
// 1. Use single supabase client instance
import { supabase } from '@/integrations/supabase/client';

// 2. Don't create new clients per request
// ❌ Bad
const getClient = () => createClient(url, key);

// ✅ Good
export const supabase = createClient(url, key);
```

### Transaction Patterns

```sql
-- Use transactions for multi-step operations
BEGIN;

INSERT INTO orders (user_id, total) VALUES ($1, $2)
RETURNING id INTO order_id;

INSERT INTO order_items (order_id, product_id, quantity)
SELECT order_id, product_id, quantity
FROM unnest($3::uuid[], $4::int[]) AS t(product_id, quantity);

UPDATE inventory
SET quantity = quantity - t.quantity
FROM unnest($3::uuid[], $4::int[]) AS t(product_id, quantity)
WHERE inventory.product_id = t.product_id;

COMMIT;
```

### Edge Function Database Access

```typescript
// supabase/functions/process-order/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Use service role for admin operations
  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'processed' })
    .eq('id', orderId);

  return new Response(JSON.stringify({ success: !error }));
});
```

---

## Data Integrity

### Constraints

```sql
-- NOT NULL for required fields
ALTER TABLE users ALTER COLUMN email SET NOT NULL;

-- UNIQUE for business keys
ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);

-- CHECK for validation
ALTER TABLE products ADD CONSTRAINT positive_price
  CHECK (price > 0);

-- FOREIGN KEY for relationships
ALTER TABLE orders ADD CONSTRAINT fk_orders_user
  FOREIGN KEY (user_id) REFERENCES users(id)
  ON DELETE CASCADE;
```

### Validation Triggers (Instead of CHECK)

```sql
-- Use triggers for complex/time-based validation
CREATE OR REPLACE FUNCTION validate_subscription()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.expires_at <= now() THEN
    RAISE EXCEPTION 'Expiration date must be in the future';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_subscription_expiry
  BEFORE INSERT OR UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION validate_subscription();
```

### Soft Deletes

```sql
-- Add soft delete column
ALTER TABLE projects ADD COLUMN deleted_at TIMESTAMPTZ;

-- Create view for active records
CREATE VIEW active_projects AS
SELECT * FROM projects WHERE deleted_at IS NULL;

-- RLS policy respecting soft deletes
CREATE POLICY "Users see active projects"
  ON projects FOR SELECT
  USING (deleted_at IS NULL AND (is_public OR owner_id = auth.uid()));
```

---

## Performance Monitoring

### Query Statistics

```sql
-- Enable pg_stat_statements (if available)
-- Top slow queries
SELECT
  query,
  calls,
  mean_exec_time,
  total_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### Table Statistics

```sql
-- Table sizes
SELECT
  relname as table,
  pg_size_pretty(pg_total_relation_size(relid)) as total_size,
  pg_size_pretty(pg_table_size(relid)) as data_size,
  pg_size_pretty(pg_indexes_size(relid)) as index_size
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC;

-- Index usage
SELECT
  indexrelname as index,
  idx_scan as scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

### Monitoring Queries

```typescript
// Log slow queries in application
const queryWithTiming = async (query: string) => {
  const start = performance.now();
  const result = await supabase.rpc(query);
  const duration = performance.now() - start;

  if (duration > 1000) {
    console.warn(`Slow query (${duration}ms):`, query);
  }

  return result;
};
```

---

## Best Practices Summary

| Practice     | Recommendation                          |
| ------------ | --------------------------------------- |
| Primary Keys | Use UUIDs with `gen_random_uuid()`      |
| Timestamps   | Always use `TIMESTAMPTZ`                |
| Indexes      | Index FKs, query columns, order columns |
| JSONB        | Use GIN index for flexible queries      |
| Pagination   | Prefer cursor-based over offset         |
| Transactions | Use for multi-step operations           |
| Soft Deletes | Add `deleted_at` column pattern         |
| Validation   | Use triggers, not CHECK for time-based  |

---

## Related Documentation

- [API_DESIGN.md](./API_DESIGN.md) - API patterns using database
- [PERFORMANCE.md](./PERFORMANCE.md) - Performance optimization
- [SECURITY.md](./SECURITY.md) - Database security practices
- [MIGRATION.md](./MIGRATION.md) - Database migration strategies

---

_This guide is updated as database patterns evolve._
