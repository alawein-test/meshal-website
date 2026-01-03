# Error Handling Guide

> Error handling patterns, error boundaries, and user-friendly error messages
> for the MA Platform.

## Table of Contents

- Overview
- Error Handling Strategy
- React Error Boundaries
- API Error Handling
- Form Validation Errors
- Async Error Handling
- User-Friendly Messages
- Error Logging & Monitoring
- Recovery Patterns

---

## Overview

The MA Platform uses a layered error handling approach that ensures:

1. **Graceful degradation** - App continues working when possible
2. **Clear communication** - Users understand what went wrong
3. **Actionable feedback** - Users know how to recover
4. **Comprehensive logging** - Developers can debug issues

### Error Categories

| Category       | Example         | Handling                  |
| -------------- | --------------- | ------------------------- |
| Network        | API timeout     | Retry with backoff        |
| Validation     | Invalid email   | Inline field error        |
| Authentication | Session expired | Redirect to login         |
| Authorization  | Access denied   | Show permission error     |
| Server         | 500 error       | Error boundary + logging  |
| Client         | Rendering crash | Error boundary + fallback |

---

## Error Handling Strategy

### Error Types

```typescript
// types/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public isOperational: boolean = true,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public fields: Record<string, string>
  ) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 'AUTHORIZATION_ERROR', 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(
      id ? `${resource} with id ${id} not found` : `${resource} not found`,
      'NOT_FOUND',
      404
    );
    this.name = 'NotFoundError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network request failed') {
    super(message, 'NETWORK_ERROR', 0);
    this.name = 'NetworkError';
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfter?: number) {
    super('Too many requests', 'RATE_LIMIT', 429, true, { retryAfter });
    this.name = 'RateLimitError';
  }
}
```

### Error Factory

```typescript
// lib/errors.ts
import { AppError, NetworkError, AuthenticationError } from '@/types/errors';

export const createErrorFromResponse = async (
  response: Response
): Promise<AppError> => {
  let errorData: any;

  try {
    errorData = await response.json();
  } catch {
    errorData = { message: response.statusText };
  }

  const message = errorData.message || errorData.error || 'An error occurred';

  switch (response.status) {
    case 400:
      return new AppError(message, 'BAD_REQUEST', 400);
    case 401:
      return new AuthenticationError(message);
    case 403:
      return new AppError(message, 'FORBIDDEN', 403);
    case 404:
      return new AppError(message, 'NOT_FOUND', 404);
    case 429:
      return new AppError(message, 'RATE_LIMIT', 429, true, {
        retryAfter: response.headers.get('Retry-After'),
      });
    case 500:
    case 502:
    case 503:
    case 504:
      return new AppError(message, 'SERVER_ERROR', response.status, false);
    default:
      return new AppError(message, 'UNKNOWN_ERROR', response.status);
  }
};

export const isNetworkError = (error: unknown): error is NetworkError => {
  return (
    error instanceof NetworkError ||
    (error instanceof Error && error.message === 'Failed to fetch')
  );
};

export const isAuthError = (error: unknown): boolean => {
  return (
    error instanceof AuthenticationError ||
    (error instanceof AppError && error.statusCode === 401)
  );
};
```

---

## React Error Boundaries

### Global Error Boundary

```typescript
// components/shared/AppErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Log to monitoring service
    console.error('[ErrorBoundary]', error, errorInfo);

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    // Report to error tracking service
    this.reportError(error, errorInfo);
  }

  reportError = (error: Error, errorInfo: ErrorInfo) => {
    // Send to logging service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    console.log('[ERROR_REPORT]', JSON.stringify(errorReport));
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Something went wrong</h1>
              <p className="text-muted-foreground">
                We're sorry, but something unexpected happened. Our team has been notified.
              </p>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <details className="text-left text-sm bg-muted p-4 rounded-lg">
                <summary className="cursor-pointer font-medium">Error details</summary>
                <pre className="mt-2 overflow-auto text-xs">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={this.handleReset} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={this.handleGoHome}>
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Feature-Level Error Boundary

```typescript
// components/shared/FeatureErrorBoundary.tsx
import { Component, ReactNode, ErrorInfo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  featureName: string;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
}

export class FeatureErrorBoundary extends Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[${this.props.featureName}]`, error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              {this.props.featureName} Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This feature encountered an error and couldn't load properly.
            </p>
            <Button onClick={this.handleRetry} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Usage
<FeatureErrorBoundary featureName="Simulation Chart">
  <SimulationChart data={data} />
</FeatureErrorBoundary>
```

### Suspense Error Boundary

```typescript
// components/shared/AsyncBoundary.tsx
import { Suspense, ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

interface Props {
  children: ReactNode;
  loadingFallback?: ReactNode;
  errorFallback?: ReactNode;
}

export const AsyncBoundary = ({
  children,
  loadingFallback = <LoadingSpinner />,
  errorFallback,
}: Props) => {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) =>
        errorFallback || (
          <div className="p-4 text-center">
            <p className="text-destructive mb-2">{error.message}</p>
            <Button onClick={resetErrorBoundary} variant="outline" size="sm">
              Try again
            </Button>
          </div>
        )
      }
    >
      <Suspense fallback={loadingFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
};
```

---

## API Error Handling

### React Query Error Handling

```typescript
// hooks/useApiError.ts
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { isAuthError, isNetworkError } from '@/lib/errors';
import { useNavigate } from 'react-router-dom';

export const useApiError = (error: unknown) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!error) return;

    if (isAuthError(error)) {
      toast({
        title: 'Session expired',
        description: 'Please sign in again to continue.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    if (isNetworkError(error)) {
      toast({
        title: 'Connection error',
        description: 'Please check your internet connection and try again.',
        variant: 'destructive',
      });
      return;
    }

    if (error instanceof Error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [error, toast, navigate]);
};

// Usage in component
const SimulationList = () => {
  const { data, error, isLoading } = useSimulations();
  useApiError(error);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorState message="Failed to load simulations" />;

  return <SimulationGrid items={data} />;
};
```

### Query Client Error Handler

```typescript
// lib/queryClient.ts
import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'sonner';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Only show error toast for queries that have failed after retries
      if (query.state.data !== undefined) {
        toast.error(`Something went wrong: ${error.message}`);
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      toast.error(`Operation failed: ${error.message}`);
    },
  }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && 'statusCode' in error) {
          const statusCode = (error as any).statusCode;
          if (statusCode >= 400 && statusCode < 500) {
            return false;
          }
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: false,
    },
  },
});
```

### Fetch Wrapper with Error Handling

```typescript
// lib/api.ts
import { createErrorFromResponse, NetworkError } from '@/lib/errors';

interface FetchOptions extends RequestInit {
  timeout?: number;
}

export const apiFetch = async <T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> => {
  const { timeout = 10000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw await createErrorFromResponse(response);
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new NetworkError('Request timeout');
      }
      if (error.message === 'Failed to fetch') {
        throw new NetworkError('Network request failed');
      }
    }

    throw error;
  }
};
```

---

## Form Validation Errors

### Zod Schema Validation

```typescript
// lib/validation.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export const simulationSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  type: z.enum(['monte_carlo', 'finite_element', 'agent_based'], {
    errorMap: () => ({ message: 'Please select a simulation type' }),
  }),
  iterations: z
    .number()
    .min(1, 'At least 1 iteration required')
    .max(10000, 'Maximum 10,000 iterations allowed'),
  parameters: z.record(z.number()).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SimulationInput = z.infer<typeof simulationSchema>;
```

### Form Error Display

```typescript
// components/forms/FormField.tsx
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  description?: string;
}

export const FormField = ({
  name,
  label,
  type = 'text',
  placeholder,
  description,
}: FormFieldProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className={cn(error && 'text-destructive')}>
        {label}
      </Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={cn(
          error && 'border-destructive focus-visible:ring-destructive'
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {description && !error && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && (
        <p
          id={`${name}-error`}
          className="text-sm text-destructive"
          role="alert"
        >
          {error.message as string}
        </p>
      )}
    </div>
  );
};
```

### Form with Error Handling

```typescript
// components/forms/LoginForm.tsx
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/lib/validation';
import { FormField } from './FormField';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const LoginForm = () => {
  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);

    try {
      await signIn(data.email, data.password);
    } catch (error) {
      if (error instanceof Error) {
        // Map server errors to user-friendly messages
        if (error.message.includes('Invalid login')) {
          setServerError('Invalid email or password. Please try again.');
        } else if (error.message.includes('rate limit')) {
          setServerError('Too many attempts. Please wait a few minutes.');
        } else {
          setServerError('Unable to sign in. Please try again later.');
        }
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        <FormField
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
        />

        <FormField
          name="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
        />

        <Button
          type="submit"
          className="w-full"
          disabled={methods.formState.isSubmitting}
        >
          {methods.formState.isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </FormProvider>
  );
};
```

---

## Async Error Handling

### Try-Catch Patterns

```typescript
// ✅ Good: Proper async error handling
const handleSubmit = async () => {
  setLoading(true);
  setError(null);

  try {
    const result = await createSimulation(data);
    toast.success('Simulation created successfully');
    navigate(`/simulations/${result.id}`);
  } catch (error) {
    if (error instanceof ValidationError) {
      // Handle validation errors specifically
      setFieldErrors(error.fields);
    } else if (error instanceof AuthenticationError) {
      // Redirect to login
      navigate('/auth');
    } else {
      // Generic error handling
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  } finally {
    setLoading(false);
  }
};

// ❌ Bad: Swallowing errors
const handleSubmit = async () => {
  try {
    await createSimulation(data);
  } catch {
    // Error is swallowed, user has no feedback
  }
};
```

### Promise.allSettled for Multiple Operations

```typescript
const processMultipleItems = async (items: Item[]) => {
  const results = await Promise.allSettled(
    items.map((item) => processItem(item))
  );

  const successful = results.filter(
    (r): r is PromiseFulfilledResult<Item> => r.status === 'fulfilled'
  );

  const failed = results.filter(
    (r): r is PromiseRejectedResult => r.status === 'rejected'
  );

  if (failed.length > 0) {
    toast.error(`${failed.length} of ${items.length} items failed to process`);

    // Log failures for debugging
    failed.forEach((f) => console.error('Failed item:', f.reason));
  }

  if (successful.length > 0) {
    toast.success(`${successful.length} items processed successfully`);
  }

  return successful.map((r) => r.value);
};
```

---

## User-Friendly Messages

### Error Message Mapping

```typescript
// lib/errorMessages.ts
const errorMessages: Record<string, string> = {
  // Authentication
  'Invalid login credentials':
    'The email or password you entered is incorrect.',
  'User already registered': 'An account with this email already exists.',
  'Email not confirmed': 'Please verify your email address before signing in.',
  'Password is too weak':
    'Please choose a stronger password with at least 8 characters.',

  // Network
  'Failed to fetch':
    'Unable to connect. Please check your internet connection.',
  'Request timeout': 'The request took too long. Please try again.',
  'Network request failed': 'Connection error. Please try again.',

  // Rate limiting
  'Too many requests': "You're doing that too often. Please wait a moment.",
  'Rate limit exceeded': 'Please slow down and try again in a few minutes.',

  // Authorization
  'Access denied': "You don't have permission to perform this action.",
  Forbidden: 'This action is not allowed.',

  // Generic
  'Internal server error':
    'Something went wrong on our end. Please try again later.',
  'Service unavailable':
    'The service is temporarily unavailable. Please try again later.',
};

export const getUserFriendlyMessage = (error: unknown): string => {
  if (error instanceof Error) {
    // Check for exact matches
    if (errorMessages[error.message]) {
      return errorMessages[error.message];
    }

    // Check for partial matches
    for (const [key, message] of Object.entries(errorMessages)) {
      if (error.message.toLowerCase().includes(key.toLowerCase())) {
        return message;
      }
    }

    // Return original message if no mapping found
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
};
```

### Contextual Error Messages

```typescript
// components/ErrorMessage.tsx
import { AlertCircle, WifiOff, Lock, Clock, ServerCrash } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorMessageProps {
  error: Error;
  context?: 'form' | 'page' | 'action';
}

const getErrorIcon = (error: Error) => {
  if (error.message.includes('network') || error.message.includes('fetch')) {
    return WifiOff;
  }
  if (error.message.includes('auth') || error.message.includes('permission')) {
    return Lock;
  }
  if (error.message.includes('timeout')) {
    return Clock;
  }
  if (error.message.includes('server')) {
    return ServerCrash;
  }
  return AlertCircle;
};

export const ErrorMessage = ({ error, context = 'page' }: ErrorMessageProps) => {
  const Icon = getErrorIcon(error);
  const message = getUserFriendlyMessage(error);

  if (context === 'form') {
    return (
      <p className="text-sm text-destructive flex items-center gap-1">
        <AlertCircle className="h-4 w-4" />
        {message}
      </p>
    );
  }

  return (
    <Alert variant="destructive">
      <Icon className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};
```

---

## Error Logging & Monitoring

### Structured Error Logging

```typescript
// lib/logger.ts
interface LogContext {
  userId?: string;
  route?: string;
  action?: string;
  component?: string;
  [key: string]: any;
}

class Logger {
  private context: LogContext = {};

  setContext(ctx: LogContext) {
    this.context = { ...this.context, ...ctx };
  }

  error(error: Error, additionalContext?: LogContext) {
    const logEntry = {
      level: 'error',
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      name: error.name,
      ...this.context,
      ...additionalContext,
    };

    console.error('[ERROR]', JSON.stringify(logEntry));

    // Send to monitoring service
    this.sendToMonitoring(logEntry);
  }

  warn(message: string, context?: LogContext) {
    const logEntry = {
      level: 'warn',
      timestamp: new Date().toISOString(),
      message,
      ...this.context,
      ...context,
    };

    console.warn('[WARN]', JSON.stringify(logEntry));
  }

  private sendToMonitoring(logEntry: any) {
    // In production, send to your monitoring service
    if (import.meta.env.PROD) {
      // Example: Send to logging endpoint
      fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry),
      }).catch(() => {
        // Silently fail if logging fails
      });
    }
  }
}

export const logger = new Logger();
```

### Error Tracking Hook

```typescript
// hooks/useErrorTracking.ts
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logger } from '@/lib/logger';
import { useAuth } from '@/hooks/useAuth';

export const useErrorTracking = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Set context for all logs
    logger.setContext({
      route: location.pathname,
      userId: user?.id,
    });

    // Global error handler for uncaught errors
    const handleError = (event: ErrorEvent) => {
      logger.error(event.error || new Error(event.message), {
        type: 'uncaught',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    };

    // Global handler for unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      const error =
        event.reason instanceof Error
          ? event.reason
          : new Error(String(event.reason));

      logger.error(error, { type: 'unhandledRejection' });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, [location, user]);
};
```

---

## Recovery Patterns

### Retry with Exponential Backoff

```typescript
// lib/retry.ts
interface RetryOptions {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
  shouldRetry?: (error: Error, attempt: number) => boolean;
}

export const withRetry = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    shouldRetry = () => true,
  } = options;

  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxAttempts || !shouldRetry(lastError, attempt)) {
        throw lastError;
      }

      const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
};

// Usage
const fetchWithRetry = () =>
  withRetry(() => fetchSimulations(), {
    maxAttempts: 3,
    shouldRetry: (error) => {
      // Only retry on network errors
      return isNetworkError(error);
    },
  });
```

### Graceful Degradation

```typescript
// components/SimulationChart.tsx
const SimulationChart = ({ id }: { id: string }) => {
  const { data, error, isLoading } = useSimulationResults(id);
  const [fallbackData, setFallbackData] = useState<CachedData | null>(null);

  useEffect(() => {
    // Try to load cached data as fallback
    const cached = localStorage.getItem(`simulation-${id}`);
    if (cached) {
      setFallbackData(JSON.parse(cached));
    }
  }, [id]);

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (error) {
    if (fallbackData) {
      return (
        <>
          <Alert variant="warning" className="mb-4">
            <AlertDescription>
              Showing cached data. Live data unavailable.
            </AlertDescription>
          </Alert>
          <Chart data={fallbackData.results} />
        </>
      );
    }

    return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  return <Chart data={data.results} />;
};
```

### Offline Support

```typescript
// hooks/useOfflineSupport.ts
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const useOfflineSupport = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Back online');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('You are offline. Some features may be unavailable.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline };
};
```

---

## Best Practices Summary

### Do's

- ✅ Always provide user-friendly error messages
- ✅ Log errors with context for debugging
- ✅ Use error boundaries to prevent crashes
- ✅ Implement retry logic for transient failures
- ✅ Show loading states during async operations
- ✅ Provide clear recovery actions
- ✅ Handle different error types appropriately

### Don'ts

- ❌ Don't show raw error messages to users
- ❌ Don't swallow errors silently
- ❌ Don't retry infinitely
- ❌ Don't expose stack traces in production
- ❌ Don't ignore validation errors
- ❌ Don't use alerts for error messages

---

## Related Documentation

- [API Design](./API_DESIGN.md) - API error responses
- [Monitoring Guide](./MONITORING.md) - Error tracking setup
- [Testing Strategy](./TESTING_STRATEGY.md) - Testing error scenarios
- [State Management](./STATE_MANAGEMENT.md) - Handling async state errors
