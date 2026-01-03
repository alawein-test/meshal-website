# State Management Guide

> React Query patterns, context usage, and local state best practices for the MA
> Platform.

## Table of Contents

- Overview
- State Categories
- React Query Patterns
- Context Usage
- Zustand Stores
- Local Component State
- State Synchronization
- Testing State

---

## Overview

The MA Platform uses a layered approach to state management, choosing the right
tool for each type of state:

| State Type      | Tool                | Use Case                            |
| --------------- | ------------------- | ----------------------------------- |
| Server State    | React Query         | API data, cached responses          |
| Global UI State | Zustand             | Theme, notifications, session       |
| Feature State   | React Context       | Auth, feature-specific shared state |
| Component State | useState/useReducer | Forms, toggles, local UI            |
| URL State       | React Router        | Navigation, filters, pagination     |

### Guiding Principles

1. **Server state is not client state** - Use React Query for API data
2. **Colocate state** - Keep state close to where it's used
3. **Derive when possible** - Calculate values instead of storing them
4. **Single source of truth** - Avoid duplicating state

---

## State Categories

### Server State (React Query)

Data that lives on the server and needs to be synchronized:

```typescript
// ✅ Good: Use React Query for server data
const { data: simulations, isLoading } = useQuery({
  queryKey: ['simulations', userId],
  queryFn: () => fetchSimulations(userId),
});

// ❌ Bad: Managing server data in local state
const [simulations, setSimulations] = useState([]);
useEffect(() => {
  fetchSimulations().then(setSimulations);
}, []);
```

### Global UI State (Zustand)

Application-wide UI state that persists across components:

```typescript
// stores/notificationStore.ts
import { create } from 'zustand';

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearAll: () => set({ notifications: [] }),
}));
```

### Feature State (Context)

State shared within a feature boundary:

```typescript
// context/SimulationContext.tsx
interface SimulationContextValue {
  selectedSimulation: Simulation | null;
  setSelectedSimulation: (sim: Simulation | null) => void;
  isRunning: boolean;
  startSimulation: () => void;
  stopSimulation: () => void;
}

const SimulationContext = createContext<SimulationContextValue | null>(null);

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within SimulationProvider');
  }
  return context;
};
```

### Component State (useState)

Local UI state that doesn't need to be shared:

```typescript
// ✅ Good: Local state for local concerns
const [isOpen, setIsOpen] = useState(false);
const [searchTerm, setSearchTerm] = useState('');

// Derived state instead of stored state
const filteredItems = useMemo(
  () => items.filter((item) => item.name.includes(searchTerm)),
  [items, searchTerm]
);
```

---

## React Query Patterns

### Basic Query Setup

```typescript
// hooks/useSimulations.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Query keys factory
export const simulationKeys = {
  all: ['simulations'] as const,
  lists: () => [...simulationKeys.all, 'list'] as const,
  list: (filters: SimulationFilters) =>
    [...simulationKeys.lists(), filters] as const,
  details: () => [...simulationKeys.all, 'detail'] as const,
  detail: (id: string) => [...simulationKeys.details(), id] as const,
};

// Query hook
export const useSimulations = (filters: SimulationFilters = {}) => {
  return useQuery({
    queryKey: simulationKeys.list(filters),
    queryFn: async () => {
      let query = supabase
        .from('simcore_simulations')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Single item query
export const useSimulation = (id: string) => {
  return useQuery({
    queryKey: simulationKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('simcore_simulations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};
```

### Mutations with Optimistic Updates

```typescript
// hooks/useCreateSimulation.ts
export const useCreateSimulation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newSimulation: CreateSimulationInput) => {
      const { data, error } = await supabase
        .from('simcore_simulations')
        .insert(newSimulation)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    // Optimistic update
    onMutate: async (newSimulation) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: simulationKeys.lists() });

      // Snapshot previous value
      const previousSimulations = queryClient.getQueryData(
        simulationKeys.lists()
      );

      // Optimistically add new simulation
      queryClient.setQueryData(
        simulationKeys.lists(),
        (old: Simulation[] = []) => [
          {
            ...newSimulation,
            id: 'temp-id',
            created_at: new Date().toISOString(),
          },
          ...old,
        ]
      );

      return { previousSimulations };
    },
    onError: (err, newSimulation, context) => {
      // Rollback on error
      queryClient.setQueryData(
        simulationKeys.lists(),
        context?.previousSimulations
      );
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: simulationKeys.lists() });
    },
  });
};
```

### Infinite Queries for Pagination

```typescript
// hooks/useInfiniteSimulations.ts
export const useInfiniteSimulations = () => {
  return useInfiniteQuery({
    queryKey: ['simulations', 'infinite'],
    queryFn: async ({ pageParam = 0 }) => {
      const limit = 20;
      const { data, error } = await supabase
        .from('simcore_simulations')
        .select('*')
        .order('created_at', { ascending: false })
        .range(pageParam, pageParam + limit - 1);

      if (error) throw error;
      return { data, nextPage: data.length === limit ? pageParam + limit : undefined };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
};

// Usage in component
const SimulationList = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteSimulations();

  const simulations = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div>
      {simulations.map((sim) => (
        <SimulationCard key={sim.id} simulation={sim} />
      ))}
      {hasNextPage && (
        <Button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </Button>
      )}
    </div>
  );
};
```

### Prefetching for Better UX

```typescript
// Prefetch on hover
const SimulationListItem = ({ simulation }: { simulation: Simulation }) => {
  const queryClient = useQueryClient();

  const prefetchDetails = () => {
    queryClient.prefetchQuery({
      queryKey: simulationKeys.detail(simulation.id),
      queryFn: () => fetchSimulationDetails(simulation.id),
      staleTime: 1000 * 60 * 5,
    });
  };

  return (
    <Link
      to={`/simulations/${simulation.id}`}
      onMouseEnter={prefetchDetails}
      onFocus={prefetchDetails}
    >
      {simulation.name}
    </Link>
  );
};
```

### Dependent Queries

```typescript
// Query that depends on another query's result
const useUserSimulations = () => {
  const { data: user } = useAuth();

  return useQuery({
    queryKey: ['simulations', 'user', user?.id],
    queryFn: () => fetchUserSimulations(user!.id),
    // Only run when user is available
    enabled: !!user?.id,
  });
};
```

---

## Context Usage

### When to Use Context

Use React Context for:

- Authentication state
- Theme preferences
- Feature-specific shared state
- Avoiding prop drilling (2-3+ levels)

### Context Pattern

```typescript
// context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### Compound Context Pattern

```typescript
// context/SimulationContext.tsx
interface SimulationState {
  selectedId: string | null;
  isRunning: boolean;
  parameters: SimulationParameters;
}

type SimulationAction =
  | { type: 'SELECT'; payload: string }
  | { type: 'DESELECT' }
  | { type: 'START' }
  | { type: 'STOP' }
  | { type: 'UPDATE_PARAMS'; payload: Partial<SimulationParameters> };

const simulationReducer = (state: SimulationState, action: SimulationAction): SimulationState => {
  switch (action.type) {
    case 'SELECT':
      return { ...state, selectedId: action.payload };
    case 'DESELECT':
      return { ...state, selectedId: null };
    case 'START':
      return { ...state, isRunning: true };
    case 'STOP':
      return { ...state, isRunning: false };
    case 'UPDATE_PARAMS':
      return { ...state, parameters: { ...state.parameters, ...action.payload } };
    default:
      return state;
  }
};

const SimulationStateContext = createContext<SimulationState | null>(null);
const SimulationDispatchContext = createContext<React.Dispatch<SimulationAction> | null>(null);

export const SimulationProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(simulationReducer, {
    selectedId: null,
    isRunning: false,
    parameters: defaultParameters,
  });

  return (
    <SimulationStateContext.Provider value={state}>
      <SimulationDispatchContext.Provider value={dispatch}>
        {children}
      </SimulationDispatchContext.Provider>
    </SimulationStateContext.Provider>
  );
};

// Separate hooks for state and dispatch
export const useSimulationState = () => {
  const context = useContext(SimulationStateContext);
  if (!context) throw new Error('useSimulationState must be used within SimulationProvider');
  return context;
};

export const useSimulationDispatch = () => {
  const context = useContext(SimulationDispatchContext);
  if (!context) throw new Error('useSimulationDispatch must be used within SimulationProvider');
  return context;
};
```

---

## Zustand Stores

### Store Structure

```typescript
// stores/sessionLogStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
  level: 'info' | 'warn' | 'error';
}

interface SessionLogStore {
  logs: LogEntry[];
  isVisible: boolean;
  maxLogs: number;

  // Actions
  addLog: (message: string, level?: LogEntry['level']) => void;
  clearLogs: () => void;
  toggleVisibility: () => void;
  setMaxLogs: (max: number) => void;
}

export const useSessionLogStore = create<SessionLogStore>()(
  persist(
    (set, get) => ({
      logs: [],
      isVisible: false,
      maxLogs: 100,

      addLog: (message, level = 'info') => {
        const newLog: LogEntry = {
          id: crypto.randomUUID(),
          timestamp: new Date(),
          message,
          level,
        };

        set((state) => ({
          logs: [...state.logs, newLog].slice(-state.maxLogs),
        }));
      },

      clearLogs: () => set({ logs: [] }),

      toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),

      setMaxLogs: (max) => set({ maxLogs: max }),
    }),
    {
      name: 'session-log-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ logs: state.logs, maxLogs: state.maxLogs }),
    }
  )
);
```

### Selectors for Performance

```typescript
// stores/notificationStore.ts
import { create } from 'zustand';
import { shallow } from 'zustand/shallow';

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  // ... actions
}

const useNotificationStore = create<NotificationStore>()((set, get) => ({
  notifications: [],
  unreadCount: 0,
  // ... implementation
}));

// Selector hooks to prevent unnecessary re-renders
export const useNotifications = () =>
  useNotificationStore((state) => state.notifications);

export const useUnreadCount = () =>
  useNotificationStore((state) => state.unreadCount);

// Multiple values with shallow comparison
export const useNotificationSummary = () =>
  useNotificationStore(
    (state) => ({
      total: state.notifications.length,
      unread: state.unreadCount,
    }),
    shallow
  );
```

### Combining Stores

```typescript
// stores/index.ts
export { useAuthStore } from './authStore';
export { useNotificationStore } from './notificationStore';
export { useSessionLogStore } from './sessionLogStore';
export { useGuestStore } from './guestStore';

// Combined selectors for related data
export const useAppState = () => {
  const user = useAuthStore((state) => state.user);
  const notifications = useNotificationStore((state) => state.notifications);
  const isGuest = useGuestStore((state) => state.isGuest);

  return { user, notifications, isGuest };
};
```

---

## Local Component State

### useState for Simple State

```typescript
// Simple toggle
const [isOpen, setIsOpen] = useState(false);

// Form field
const [email, setEmail] = useState('');

// Counter
const [count, setCount] = useState(0);
```

### useReducer for Complex State

```typescript
// Complex form with multiple fields
interface FormState {
  name: string;
  email: string;
  message: string;
  errors: Record<string, string>;
  isSubmitting: boolean;
}

type FormAction =
  | { type: 'SET_FIELD'; field: string; value: string }
  | { type: 'SET_ERROR'; field: string; error: string }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_END' };

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error },
      };
    case 'CLEAR_ERRORS':
      return { ...state, errors: {} };
    case 'SUBMIT_START':
      return { ...state, isSubmitting: true };
    case 'SUBMIT_END':
      return { ...state, isSubmitting: false };
    default:
      return state;
  }
};

const ContactForm = () => {
  const [state, dispatch] = useReducer(formReducer, {
    name: '',
    email: '',
    message: '',
    errors: {},
    isSubmitting: false,
  });

  // ... form implementation
};
```

### Derived State

```typescript
// ✅ Good: Derive values from state
const [items, setItems] = useState<Item[]>([]);
const [filter, setFilter] = useState('');

// Derived - recalculated on render when dependencies change
const filteredItems = useMemo(
  () => items.filter((item) => item.name.includes(filter)),
  [items, filter]
);

const totalPrice = useMemo(
  () => items.reduce((sum, item) => sum + item.price, 0),
  [items]
);

// ❌ Bad: Storing derived values
const [filteredItems, setFilteredItems] = useState([]);
useEffect(() => {
  setFilteredItems(items.filter((item) => item.name.includes(filter)));
}, [items, filter]);
```

---

## State Synchronization

### URL State Synchronization

```typescript
// hooks/useURLState.ts
import { useSearchParams } from 'react-router-dom';
import { useMemo, useCallback } from 'react';

export const useURLState = <T extends Record<string, string>>(
  defaultValues: T
) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const state = useMemo(() => {
    const result = { ...defaultValues };
    for (const key in defaultValues) {
      const value = searchParams.get(key);
      if (value !== null) {
        result[key] = value as T[typeof key];
      }
    }
    return result;
  }, [searchParams, defaultValues]);

  const setState = useCallback(
    (updates: Partial<T>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(updates)) {
          if (value === defaultValues[key] || value === '') {
            next.delete(key);
          } else {
            next.set(key, value as string);
          }
        }
        return next;
      });
    },
    [setSearchParams, defaultValues]
  );

  return [state, setState] as const;
};

// Usage
const SimulationList = () => {
  const [filters, setFilters] = useURLState({
    status: '',
    sort: 'created_at',
    order: 'desc',
  });

  // URL automatically updates when filters change
  return (
    <div>
      <Select
        value={filters.status}
        onValueChange={(status) => setFilters({ status })}
      >
        {/* options */}
      </Select>
    </div>
  );
};
```

### Realtime State Synchronization

```typescript
// hooks/useRealtimeSimulations.ts
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimeSimulations = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('simulations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'simcore_simulations',
        },
        (payload) => {
          // Invalidate queries to refetch
          queryClient.invalidateQueries({ queryKey: ['simulations'] });

          // Or update cache directly for better UX
          if (payload.eventType === 'INSERT') {
            queryClient.setQueryData(
              ['simulations'],
              (old: Simulation[] = []) => [payload.new as Simulation, ...old]
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

## Testing State

### Testing React Query

```typescript
// __tests__/useSimulations.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSimulations } from '../hooks/useSimulations';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useSimulations', () => {
  it('fetches simulations successfully', async () => {
    const { result } = renderHook(() => useSimulations(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(Array.isArray(result.current.data)).toBe(true);
  });
});
```

### Testing Zustand Stores

```typescript
// __tests__/notificationStore.test.ts
import { useNotificationStore } from '../stores/notificationStore';

describe('notificationStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useNotificationStore.setState({ notifications: [], unreadCount: 0 });
  });

  it('adds notification', () => {
    const { addNotification } = useNotificationStore.getState();

    addNotification({
      id: '1',
      title: 'Test',
      message: 'Test message',
      type: 'info',
    });

    const { notifications } = useNotificationStore.getState();
    expect(notifications).toHaveLength(1);
    expect(notifications[0].title).toBe('Test');
  });

  it('removes notification', () => {
    useNotificationStore.setState({
      notifications: [
        { id: '1', title: 'Test', message: 'Test', type: 'info' },
      ],
    });

    const { removeNotification } = useNotificationStore.getState();
    removeNotification('1');

    const { notifications } = useNotificationStore.getState();
    expect(notifications).toHaveLength(0);
  });
});
```

### Testing Context

```typescript
// __tests__/AuthContext.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../context/AuthContext';

const TestComponent = () => {
  const { user, signIn, signOut } = useAuth();

  return (
    <div>
      {user ? (
        <>
          <span>Logged in as {user.email}</span>
          <button onClick={signOut}>Sign Out</button>
        </>
      ) : (
        <button onClick={() => signIn('test@example.com', 'password')}>
          Sign In
        </button>
      )}
    </div>
  );
};

describe('AuthContext', () => {
  it('provides auth state to children', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });
});
```

---

## Best Practices Summary

### Do's

- ✅ Use React Query for all server state
- ✅ Use Zustand for global UI state that persists
- ✅ Use Context for feature-scoped shared state
- ✅ Derive values instead of storing computed state
- ✅ Colocate state close to where it's used
- ✅ Use selectors to prevent unnecessary re-renders
- ✅ Implement optimistic updates for better UX
- ✅ Sync important state with URL for shareability

### Don'ts

- ❌ Don't duplicate server state in local state
- ❌ Don't use Context for frequently changing values
- ❌ Don't put everything in global state
- ❌ Don't forget to handle loading and error states
- ❌ Don't mutate state directly
- ❌ Don't create deeply nested state structures

---

## Related Documentation

- [API Design](./API_DESIGN.md) - API patterns for data fetching
- [Testing Strategy](./TESTING_STRATEGY.md) - Testing patterns
- [Performance Guide](./PERFORMANCE.md) - Performance optimization
- [Error Handling](./ERROR_HANDLING.md) - Error handling patterns
