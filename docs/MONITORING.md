# Monitoring & Observability Guide

> Comprehensive guide for application monitoring, logging, and alerting in the
> Alawein Platform.

---

## Table of Contents

1. Overview
2. Observability Pillars
3. Logging Standards
4. Metrics Collection
5. Distributed Tracing
6. Error Tracking
7. Performance Monitoring
8. Alerting Configuration
9. Dashboard Design
10. Incident Response

---

## Overview

### Monitoring Philosophy

```
┌─────────────────────────────────────────────────────────────┐
│                    Observability Stack                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐ │
│  │  Logs   │  │ Metrics │  │ Traces  │  │ Error Tracking  │ │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────────┬────────┘ │
│       │            │            │                 │          │
│       └────────────┴────────────┴─────────────────┘          │
│                            │                                  │
│                    ┌───────▼───────┐                         │
│                    │   Dashboards  │                         │
│                    │   & Alerts    │                         │
│                    └───────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

### Key Principles

1. **Proactive Monitoring**: Detect issues before users report them
2. **Contextual Logging**: Include enough context to debug without guessing
3. **Actionable Alerts**: Every alert should have a clear response action
4. **Performance Budgets**: Set and enforce performance thresholds

---

## Observability Pillars

### The Three Pillars

| Pillar      | Purpose                     | Tools                      |
| ----------- | --------------------------- | -------------------------- |
| **Logs**    | Event records for debugging | Console, Log aggregators   |
| **Metrics** | Quantitative measurements   | Custom metrics, Web Vitals |
| **Traces**  | Request flow tracking       | Distributed tracing        |

### Implementation Strategy

```typescript
// src/utils/observability.ts
export interface ObservabilityContext {
  requestId: string;
  userId?: string;
  sessionId: string;
  timestamp: number;
  environment: string;
}

export const createContext = (): ObservabilityContext => ({
  requestId: crypto.randomUUID(),
  sessionId: getSessionId(),
  timestamp: Date.now(),
  environment: import.meta.env.MODE,
});
```

---

## Logging Standards

### Log Levels

| Level   | Usage                                  | Example                    |
| ------- | -------------------------------------- | -------------------------- |
| `ERROR` | Errors requiring immediate attention   | Database connection failed |
| `WARN`  | Potential issues, degraded performance | API retry attempted        |
| `INFO`  | Significant business events            | User logged in             |
| `DEBUG` | Detailed debugging information         | Function parameters        |

### Structured Logging

```typescript
// src/utils/logger.ts
type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class Logger {
  private context: Record<string, unknown> = {};

  withContext(ctx: Record<string, unknown>): Logger {
    const logger = new Logger();
    logger.context = { ...this.context, ...ctx };
    return logger;
  }

  private log(
    level: LogLevel,
    message: string,
    data?: Record<string, unknown>
  ) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: { ...this.context, ...data },
    };

    // Development: Pretty print
    if (import.meta.env.DEV) {
      consolelevel}: ${message}`,
        entry.context
      );
      return;
    }

    // Production: Structured JSON
    consolelevel);
  }

  error(message: string, error?: Error, data?: Record<string, unknown>) {
    this.log('error', message, {
      ...data,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    });
  }

  warn(message: string, data?: Record<string, unknown>) {
    this.log('warn', message, data);
  }

  info(message: string, data?: Record<string, unknown>) {
    this.log('info', message, data);
  }

  debug(message: string, data?: Record<string, unknown>) {
    if (import.meta.env.DEV) {
      this.log('debug', message, data);
    }
  }
}

export const logger = new Logger();
```

### Logging Best Practices

```typescript
// ✅ Good: Structured with context
logger.info('User authentication successful', {
  userId: user.id,
  method: 'email',
  duration: authDuration,
});

// ❌ Bad: Unstructured string concatenation
console.log('User ' + userId + ' logged in using ' + method);

// ✅ Good: Error with full context
logger.error('Failed to fetch user data', error, {
  userId,
  endpoint: '/api/users',
  attempt: retryCount,
});

// ❌ Bad: Missing context
console.error('Error:', error.message);
```

### Sensitive Data Handling

```typescript
// src/utils/logger-sanitizer.ts
const SENSITIVE_KEYS = [
  'password',
  'token',
  'secret',
  'apiKey',
  'authorization',
  'creditCard',
  'ssn',
];

export const sanitizeLogData = (
  data: Record<string, unknown>
): Record<string, unknown> => {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (SENSITIVE_KEYS.some((k) => key.toLowerCase().includes(k))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeLogData(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};
```

---

## Metrics Collection

### Core Web Vitals

```typescript
// src/utils/web-vitals.ts
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';

interface Metric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

const reportMetric = (metric: Metric) => {
  logger.info('Web Vital measured', {
    metric: metric.name,
    value: metric.value,
    rating: metric.rating,
    path: window.location.pathname,
  });

  // Send to analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', metric.name, {
      value: Math.round(
        metric.name === 'CLS' ? metric.value * 1000 : metric.value
      ),
      metric_rating: metric.rating,
    });
  }
};

export const initWebVitals = () => {
  onCLS(reportMetric);
  onINP(reportMetric);
  onLCP(reportMetric);
  onFCP(reportMetric);
  onTTFB(reportMetric);
};
```

### Custom Metrics

```typescript
// src/utils/metrics.ts
interface MetricDefinition {
  name: string;
  type: 'counter' | 'gauge' | 'histogram';
  description: string;
  labels?: string[];
}

class MetricsCollector {
  private counters = new Map<string, number>();
  private gauges = new Map<string, number>();
  private histograms = new Map<string, number[]>();

  increment(name: string, value = 1, labels?: Record<string, string>) {
    const key = this.getKey(name, labels);
    this.counters.set(key, (this.counters.get(key) || 0) + value);
  }

  gauge(name: string, value: number, labels?: Record<string, string>) {
    const key = this.getKey(name, labels);
    this.gauges.set(key, value);
  }

  histogram(name: string, value: number, labels?: Record<string, string>) {
    const key = this.getKey(name, labels);
    const values = this.histograms.get(key) || [];
    values.push(value);
    this.histograms.set(key, values);
  }

  timing(name: string, fn: () => void, labels?: Record<string, string>) {
    const start = performance.now();
    fn();
    const duration = performance.now() - start;
    this.histogram(name, duration, labels);
  }

  async timingAsync<T>(
    name: string,
    fn: () => Promise<T>,
    labels?: Record<string, string>
  ): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;
    this.histogram(name, duration, labels);
    return result;
  }

  private getKey(name: string, labels?: Record<string, string>): string {
    if (!labels) return name;
    const labelStr = Object.entries(labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}="${v}"`)
      .join(',');
    return `${name}{${labelStr}}`;
  }

  getMetrics() {
    return {
      counters: Object.fromEntries(this.counters),
      gauges: Object.fromEntries(this.gauges),
      histograms: Object.fromEntries(
        Array.from(this.histograms.entries()).map(([key, values]) => [
          key,
          {
            count: values.length,
            sum: values.reduce((a, b) => a + b, 0),
            avg: values.reduce((a, b) => a + b, 0) / values.length,
            min: Math.min(...values),
            max: Math.max(...values),
            p50: this.percentile(values, 50),
            p95: this.percentile(values, 95),
            p99: this.percentile(values, 99),
          },
        ])
      ),
    };
  }

  private percentile(values: number[], p: number): number {
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[index];
  }
}

export const metrics = new MetricsCollector();
```

### Application Metrics

```typescript
// Track API calls
metrics.increment('api_calls_total', 1, {
  endpoint: '/api/users',
  method: 'GET',
});

// Track response times
await metrics.timingAsync(
  'api_response_time',
  async () => {
    await fetchUsers();
  },
  { endpoint: '/api/users' }
);

// Track active sessions
metrics.gauge('active_sessions', getActiveSessionCount());

// Track queue sizes
metrics.gauge('queue_size', pendingJobs.length, { queue: 'emails' });
```

---

## Distributed Tracing

### Trace Context

```typescript
// src/utils/tracing.ts
interface TraceContext {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
}

class Tracer {
  private currentTrace: TraceContext | null = null;

  startTrace(name: string): TraceContext {
    const context: TraceContext = {
      traceId: crypto.randomUUID(),
      spanId: crypto.randomUUID(),
    };

    this.currentTrace = context;

    logger.info(`Trace started: ${name}`, {
      traceId: context.traceId,
      spanId: context.spanId,
    });

    return context;
  }

  startSpan(name: string): TraceContext {
    if (!this.currentTrace) {
      return this.startTrace(name);
    }

    const context: TraceContext = {
      traceId: this.currentTrace.traceId,
      spanId: crypto.randomUUID(),
      parentSpanId: this.currentTrace.spanId,
    };

    logger.debug(`Span started: ${name}`, context);

    return context;
  }

  endSpan(
    context: TraceContext,
    name: string,
    metadata?: Record<string, unknown>
  ) {
    logger.debug(`Span ended: ${name}`, { ...context, ...metadata });
  }

  endTrace(
    context: TraceContext,
    name: string,
    metadata?: Record<string, unknown>
  ) {
    logger.info(`Trace ended: ${name}`, { ...context, ...metadata });
    this.currentTrace = null;
  }
}

export const tracer = new Tracer();
```

### HTTP Request Tracing

```typescript
// src/utils/traced-fetch.ts
export const tracedFetch = async (
  url: string,
  options?: RequestInit
): Promise<Response> => {
  const span = tracer.startSpan(`HTTP ${options?.method || 'GET'} ${url}`);
  const start = performance.now();

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        'X-Trace-Id': span.traceId,
        'X-Span-Id': span.spanId,
      },
    });

    tracer.endSpan(span, `HTTP ${options?.method || 'GET'} ${url}`, {
      status: response.status,
      duration: performance.now() - start,
    });

    return response;
  } catch (error) {
    tracer.endSpan(span, `HTTP ${options?.method || 'GET'} ${url}`, {
      error: true,
      duration: performance.now() - start,
    });
    throw error;
  }
};
```

---

## Error Tracking

### Error Boundary Integration

```typescript
// src/components/shared/MonitoredErrorBoundary.tsx
import { Component, ReactNode } from 'react';
import { logger } from '@/utils/logger';
import { metrics } from '@/utils/metrics';

interface Props {
  children: ReactNode;
  fallback: ReactNode;
  componentName: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class MonitoredErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    metrics.increment('react_errors_total', 1, {
      component: this.props.componentName,
    });

    logger.error('React component error', error, {
      component: this.props.componentName,
      componentStack: errorInfo.componentStack,
      path: window.location.pathname,
    });

    // Report to error tracking service
    this.reportError(error, errorInfo);
  }

  private reportError(error: Error, errorInfo: React.ErrorInfo) {
    // Integration with error tracking service
    // e.g., Sentry, Bugsnag, etc.
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

### Global Error Handler

```typescript
// src/utils/error-handler.ts
export const initGlobalErrorHandler = () => {
  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    metrics.increment('unhandled_rejections_total');

    logger.error('Unhandled promise rejection', undefined, {
      reason: event.reason?.message || String(event.reason),
      stack: event.reason?.stack,
    });
  });

  // JavaScript errors
  window.addEventListener('error', (event) => {
    metrics.increment('javascript_errors_total');

    logger.error('JavaScript error', undefined, {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  // Resource loading errors
  window.addEventListener(
    'error',
    (event) => {
      if (event.target !== window) {
        const target = event.target as HTMLElement;
        metrics.increment('resource_errors_total', 1, {
          tagName: target.tagName,
        });

        logger.warn('Resource loading error', {
          tagName: target.tagName,
          src:
            (target as HTMLImageElement).src ||
            (target as HTMLScriptElement).src,
        });
      }
    },
    true
  );
};
```

---

## Performance Monitoring

### Performance Observer

```typescript
// src/utils/performance-monitor.ts
export const initPerformanceMonitor = () => {
  // Long tasks (blocking > 50ms)
  if ('PerformanceObserver' in window) {
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          metrics.histogram('long_task_duration', entry.duration);

          logger.warn('Long task detected', {
            duration: entry.duration,
            startTime: entry.startTime,
          });
        }
      }
    });

    longTaskObserver.observe({ entryTypes: ['longtask'] });

    // Layout shifts
    const layoutShiftObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShift = entry as PerformanceEntry & {
          hadRecentInput: boolean;
          value: number;
        };
        if (!layoutShift.hadRecentInput) {
          metrics.histogram('layout_shift', layoutShift.value);
        }
      }
    });

    layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });

    // Resource timing
    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resource = entry as PerformanceResourceTiming;
        metrics.histogram('resource_load_time', resource.duration, {
          type: resource.initiatorType,
        });
      }
    });

    resourceObserver.observe({ entryTypes: ['resource'] });
  }
};
```

### Component Performance Tracking

```typescript
// src/hooks/usePerformanceTracker.ts
import { useEffect, useRef } from 'react';
import { metrics } from '@/utils/metrics';

export const usePerformanceTracker = (componentName: string) => {
  const mountTime = useRef(performance.now());
  const renderCount = useRef(0);

  useEffect(() => {
    const timeToMount = performance.now() - mountTime.current;
    metrics.histogram('component_mount_time', timeToMount, {
      component: componentName,
    });

    return () => {
      metrics.gauge('component_render_count', renderCount.current, {
        component: componentName,
      });
    };
  }, [componentName]);

  useEffect(() => {
    renderCount.current++;
  });

  return {
    trackEvent: (eventName: string, duration?: number) => {
      if (duration !== undefined) {
        metrics.histogram(`${componentName}_${eventName}`, duration);
      } else {
        metrics.increment(`${componentName}_${eventName}_count`);
      }
    },
  };
};
```

---

## Alerting Configuration

### Alert Definitions

```yaml
# alerting-rules.yaml
alerts:
  - name: high_error_rate
    condition: error_rate > 1%
    duration: 5m
    severity: critical
    channels: [slack, pagerduty]
    description: 'Error rate exceeds 1% for 5 minutes'
    runbook: docs/runbooks/high-error-rate.md

  - name: slow_api_response
    condition: api_p95_latency > 2000ms
    duration: 10m
    severity: warning
    channels: [slack]
    description: 'API p95 latency exceeds 2 seconds'
    runbook: docs/runbooks/slow-api.md

  - name: memory_pressure
    condition: heap_used > 80%
    duration: 15m
    severity: warning
    channels: [slack]
    description: 'Memory usage exceeds 80%'
    runbook: docs/runbooks/memory-pressure.md

  - name: failed_deployments
    condition: deployment_failures > 0
    duration: 0m
    severity: critical
    channels: [slack, pagerduty]
    description: 'Deployment failure detected'
    runbook: docs/runbooks/failed-deployment.md
```

### Alert Severity Levels

| Severity | Response Time     | Notification      | Examples                       |
| -------- | ----------------- | ----------------- | ------------------------------ |
| Critical | Immediate         | PagerDuty + Slack | Service down, data loss        |
| High     | < 1 hour          | Slack (urgent)    | High error rate, degraded perf |
| Warning  | < 4 hours         | Slack             | Elevated latency, disk space   |
| Info     | Next business day | Email digest      | Trends, recommendations        |

### Alert Best Practices

```typescript
// Alert configuration principles
const alertConfig = {
  // 1. Avoid alert fatigue
  deduplication: {
    enabled: true,
    window: '5m',
  },

  // 2. Include context
  context: {
    includeRecentLogs: true,
    includeMetricsSnapshot: true,
    includeRunbookLink: true,
  },

  // 3. Set appropriate thresholds
  thresholds: {
    // Based on historical data + SLO
    errorRate: 0.01, // 1%
    latencyP95: 2000, // 2s
    availabilityTarget: 0.999, // 99.9%
  },

  // 4. Escalation policy
  escalation: {
    afterMinutes: 15,
    escalateTo: 'engineering-lead',
  },
};
```

---

## Dashboard Design

### Key Dashboards

#### 1. Overview Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│                    System Health Overview                    │
├─────────────────────────────────────────────────────────────┤
│  Uptime: 99.95%  │  Error Rate: 0.12%  │  Avg Latency: 234ms│
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Request Rate Chart - 24h]          [Error Rate Chart]      │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Response Time Distribution]        [Active Users]          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 2. Performance Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│                   Performance Metrics                        │
├─────────────────────────────────────────────────────────────┤
│  LCP: 1.2s  │  FID: 45ms  │  CLS: 0.05  │  TTFB: 180ms     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Core Web Vitals Over Time]                                 │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  Top Slow Pages        │  Resource Loading Times             │
│  1. /dashboard (2.1s)  │  [Waterfall Chart]                 │
│  2. /reports (1.8s)    │                                    │
│  3. /settings (1.5s)   │                                    │
└─────────────────────────────────────────────────────────────┘
```

#### 3. Error Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│                    Error Tracking                            │
├─────────────────────────────────────────────────────────────┤
│  Total Errors: 127  │  Unique: 23  │  Affected Users: 45    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Error Trend Chart - 7 days]                               │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  Top Errors                                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ TypeError: Cannot read property 'id' of undefined (45) │ │
│  │ NetworkError: Failed to fetch (32)                     │ │
│  │ ChunkLoadError: Loading chunk 5 failed (18)           │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Incident Response

### Incident Workflow

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Detect  │───▶│  Triage  │───▶│ Respond  │───▶│  Review  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
     │               │               │               │
     ▼               ▼               ▼               ▼
  Automated      Severity       Mitigation      Post-mortem
  Alerting       Assessment     & Recovery      & Learnings
```

### Incident Severity Classification

| Severity | Impact               | Response             | Example               |
| -------- | -------------------- | -------------------- | --------------------- |
| **SEV1** | Complete outage      | Immediate, all hands | Service unreachable   |
| **SEV2** | Major feature broken | < 1 hour             | Auth failing          |
| **SEV3** | Minor feature broken | < 4 hours            | Report export failing |
| **SEV4** | Cosmetic issue       | Next sprint          | Styling bug           |

### Incident Communication Template

```markdown
## Incident: [TITLE]

**Status**: Investigating | Identified | Monitoring | Resolved **Severity**:
SEV1 | SEV2 | SEV3 | SEV4 **Started**: YYYY-MM-DD HH:MM UTC **Duration**: X
hours Y minutes

### Impact

[Description of user-facing impact]

### Timeline

- HH:MM - Incident detected via [alert/user report]
- HH:MM - Team engaged, investigation started
- HH:MM - Root cause identified
- HH:MM - Fix deployed
- HH:MM - Confirmed resolved

### Root Cause

[Technical explanation]

### Resolution

[What was done to fix it]

### Action Items

- [ ] [Preventive measure 1]
- [ ] [Preventive measure 2]
- [ ] [Monitoring improvement]
```

---

## Monitoring Checklist

### Pre-Launch

- [ ] Structured logging implemented
- [ ] Core Web Vitals tracking enabled
- [ ] Error boundary with reporting
- [ ] Global error handlers configured
- [ ] Performance observers active
- [ ] Key metrics defined

### Post-Launch

- [ ] Alert thresholds tuned based on baseline
- [ ] Dashboards created for key metrics
- [ ] Runbooks written for common issues
- [ ] On-call rotation established
- [ ] Incident response process documented

---

## Related Documentation

- [PERFORMANCE.md](./PERFORMANCE.md) - Performance optimization
- [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) - Testing patterns
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment procedures
- [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md) - Security considerations

---

_Last updated: December 2024_
