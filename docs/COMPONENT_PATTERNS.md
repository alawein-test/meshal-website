# Component Patterns

> Last verified: 2025-12-09

This guide covers reusable component patterns, compound components, and
composition strategies for the Alawein Platform.

---

## Table of Contents

- Component Design Principles
- Compound Components
- Render Props Pattern
- Higher-Order Components
- Custom Hooks Extraction
- Composition Patterns
- Polymorphic Components
- Controlled vs Uncontrolled

---

## Component Design Principles

### Single Responsibility

```typescript
// ❌ Bad: Component does too much
const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('name');

  // Fetching, filtering, sorting, rendering all in one
  // ...
};

// ✅ Good: Separated concerns
const UserDashboard = () => (
  <UserProvider>
    <UserFilters />
    <UserList />
    <UserPagination />
  </UserProvider>
);
```

### Props Interface Design

```typescript
// Clear, well-documented props
interface ButtonProps {
  /** Button visual style variant */
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';

  /** Button size */
  size?: 'default' | 'sm' | 'lg' | 'icon';

  /** Loading state - disables button and shows spinner */
  isLoading?: boolean;

  /** Icon to display before text */
  leftIcon?: React.ReactNode;

  /** Icon to display after text */
  rightIcon?: React.ReactNode;

  /** Button content */
  children: React.ReactNode;
}

// Use discriminated unions for exclusive props
type AlertProps =
  | { type: 'success'; onDismiss?: () => void }
  | { type: 'error'; onRetry?: () => void }
  | { type: 'warning'; onConfirm?: () => void };
```

### Component Composition

```typescript
// Prefer composition over configuration
// ❌ Bad: Too many boolean props
<Card
  hasHeader
  hasFooter
  hasShadow
  hasBorder
  isRounded
/>

// ✅ Good: Composable sub-components
<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
  </Card.Header>
  <Card.Content>Content</Card.Content>
  <Card.Footer>Footer</Card.Footer>
</Card>
```

---

## Compound Components

### Basic Compound Pattern

```typescript
// src/components/ui/tabs.tsx
import * as React from 'react';
import { createContext, useContext, useState } from 'react';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
};

// Root component
interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  onValueChange?: (value: string) => void;
}

const Tabs = ({ defaultValue, children, onValueChange }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleSetActiveTab = (tab: string) => {
    setActiveTab(tab);
    onValueChange?.(tab);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleSetActiveTab }}>
      <div className="w-full">{children}</div>
    </TabsContext.Provider>
  );
};

// Sub-components
const TabsList = ({ children }: { children: React.ReactNode }) => (
  <div className="flex border-b border-border" role="tablist">
    {children}
  </div>
);

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

const TabsTrigger = ({ value, children }: TabsTriggerProps) => {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={cn(
        'px-4 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'border-b-2 border-primary text-primary'
          : 'text-muted-foreground hover:text-foreground'
      )}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

const TabsContent = ({ value, children }: TabsContentProps) => {
  const { activeTab } = useTabs();

  if (activeTab !== value) return null;

  return (
    <div role="tabpanel" className="py-4">
      {children}
    </div>
  );
};

// Attach sub-components
Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;

export { Tabs };
```

### Usage

```tsx
<Tabs defaultValue="overview" onValueChange={console.log}>
  <Tabs.List>
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
    <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Content value="overview">
    <OverviewPanel />
  </Tabs.Content>
  <Tabs.Content value="analytics">
    <AnalyticsPanel />
  </Tabs.Content>
  <Tabs.Content value="settings">
    <SettingsPanel />
  </Tabs.Content>
</Tabs>
```

---

## Render Props Pattern

### Flexible Rendering

```typescript
// src/components/shared/DataList.tsx
interface DataListProps<T> {
  data: T[];
  isLoading: boolean;
  error?: Error | null;
  renderItem: (item: T, index: number) => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
  renderLoading?: () => React.ReactNode;
  renderError?: (error: Error) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function DataList<T>({
  data,
  isLoading,
  error,
  renderItem,
  renderEmpty = () => <EmptyState />,
  renderLoading = () => <LoadingSkeleton />,
  renderError = (e) => <ErrorMessage error={e} />,
  keyExtractor,
}: DataListProps<T>) {
  if (isLoading) return renderLoading();
  if (error) return renderError(error);
  if (data.length === 0) return renderEmpty();

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={keyExtractor(item)}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

// Usage
<DataList
  data={projects}
  isLoading={isLoading}
  error={error}
  keyExtractor={(p) => p.id}
  renderItem={(project) => (
    <ProjectCard project={project} onEdit={handleEdit} />
  )}
  renderEmpty={() => (
    <EmptyState
      title="No projects"
      action={<Button>Create Project</Button>}
    />
  )}
/>
```

### Children as Function

```typescript
// src/components/shared/Toggle.tsx
interface ToggleProps {
  initialValue?: boolean;
  children: (props: {
    isOn: boolean;
    toggle: () => void;
    setOn: () => void;
    setOff: () => void;
  }) => React.ReactNode;
}

const Toggle = ({ initialValue = false, children }: ToggleProps) => {
  const [isOn, setIsOn] = useState(initialValue);

  const toggle = () => setIsOn(prev => !prev);
  const setOn = () => setIsOn(true);
  const setOff = () => setIsOn(false);

  return <>{children({ isOn, toggle, setOn, setOff })}</>;
};

// Usage
<Toggle>
  {({ isOn, toggle }) => (
    <div>
      <Button onClick={toggle}>
        {isOn ? 'Hide' : 'Show'} Details
      </Button>
      {isOn && <DetailPanel />}
    </div>
  )}
</Toggle>
```

---

## Higher-Order Components

### withAuth HOC

```typescript
// src/components/shared/withAuth.tsx
interface WithAuthOptions {
  redirectTo?: string;
  fallback?: React.ReactNode;
}

function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const { redirectTo = '/auth', fallback = null } = options;

  const WithAuthComponent = (props: P) => {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!isLoading && !user) {
        navigate(redirectTo);
      }
    }, [user, isLoading, navigate]);

    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (!user) {
      return fallback;
    }

    return <WrappedComponent {...props} />;
  };

  WithAuthComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithAuthComponent;
}

// Usage
const ProtectedDashboard = withAuth(Dashboard);
const ProtectedSettings = withAuth(Settings, {
  redirectTo: '/login',
  fallback: <AccessDenied />
});
```

### withErrorBoundary HOC

```typescript
// src/components/shared/withErrorBoundary.tsx
interface WithErrorBoundaryOptions {
  fallback?: React.ReactNode;
  onError?: (error: Error, info: React.ErrorInfo) => void;
}

function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithErrorBoundaryOptions = {}
) {
  const WithErrorBoundaryComponent = (props: P) => (
    <ErrorBoundary
      fallback={options.fallback}
      onError={options.onError}
    >
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  return WithErrorBoundaryComponent;
}

// Usage
const SafeChart = withErrorBoundary(AnalyticsChart, {
  fallback: <ChartError />,
  onError: (error) => logError('Chart failed', error),
});
```

---

## Custom Hooks Extraction

### Extract Logic from Components

```typescript
// ❌ Before: Logic mixed with UI
const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState<'name' | 'date'>('name');

  useEffect(() => {
    setIsLoading(true);
    fetchUsers()
      .then(setUsers)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, []);

  const filteredUsers = users
    .filter(u => u.name.includes(filter))
    .sort((a, b) => /* ... */);

  // Render...
};

// ✅ After: Logic extracted to hook
// src/hooks/useUsers.ts
export const useUsers = (options?: UseUsersOptions) => {
  const [filter, setFilter] = useState(options?.initialFilter ?? '');
  const [sort, setSort] = useState<SortOption>(options?.initialSort ?? 'name');

  const query = useQuery({
    queryKey: ['users', filter, sort],
    queryFn: () => fetchUsers({ filter, sort }),
  });

  return {
    ...query,
    filter,
    setFilter,
    sort,
    setSort,
  };
};

// Component is now purely presentational
const UserList = () => {
  const { data: users, isLoading, error, filter, setFilter } = useUsers();

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <>
      <SearchInput value={filter} onChange={setFilter} />
      <UserGrid users={users} />
    </>
  );
};
```

### Composable Hooks

```typescript
// src/hooks/useToggle.ts
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return [value, { toggle, setTrue, setFalse }] as const;
};

// src/hooks/useDisclosure.ts
export const useDisclosure = (initialOpen = false) => {
  const [isOpen, { toggle, setTrue: open, setFalse: close }] = useToggle(initialOpen);

  return { isOpen, open, close, toggle };
};

// src/hooks/useModal.ts
export const useModal = <T = unknown>() => {
  const disclosure = useDisclosure();
  const [data, setData] = useState<T | null>(null);

  const openWith = useCallback((modalData: T) => {
    setData(modalData);
    disclosure.open();
  }, [disclosure]);

  const closeAndReset = useCallback(() => {
    disclosure.close();
    setData(null);
  }, [disclosure]);

  return {
    ...disclosure,
    data,
    openWith,
    closeAndReset,
  };
};

// Usage
const ProjectManager = () => {
  const deleteModal = useModal<Project>();

  return (
    <>
      <ProjectList onDelete={deleteModal.openWith} />

      <ConfirmDialog
        open={deleteModal.isOpen}
        onClose={deleteModal.closeAndReset}
        title={`Delete ${deleteModal.data?.name}?`}
        onConfirm={() => handleDelete(deleteModal.data!.id)}
      />
    </>
  );
};
```

---

## Composition Patterns

### Slot Pattern

```typescript
// src/components/ui/Card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardSlots {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  media?: React.ReactNode;
}

const Card = ({ children, className }: CardProps) => (
  <div className={cn('rounded-lg border bg-card', className)}>
    {children}
  </div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-between p-6 pb-0">
    {children}
  </div>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="p-6">{children}</div>
);

const CardFooter = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center p-6 pt-0">{children}</div>
);

// Attach slots
Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

// Usage with slots
<Card>
  <Card.Header>
    <h3>Project Settings</h3>
    <IconButton icon={<Settings />} />
  </Card.Header>
  <Card.Content>
    <SettingsForm />
  </Card.Content>
  <Card.Footer>
    <Button variant="outline">Cancel</Button>
    <Button>Save</Button>
  </Card.Footer>
</Card>
```

### Provider Pattern

```typescript
// src/context/FormContext.tsx
interface FormContextValue<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setError: <K extends keyof T>(field: K, error: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const FormContext = createContext<FormContextValue<any> | null>(null);

export function FormProvider<T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validate,
  children,
}: FormProviderProps<T>) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate?.(values) ?? {};
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSubmit(values);
    }
  }, [values, validate, onSubmit]);

  return (
    <FormContext.Provider value={{ values, errors, touched, setValue, setError, handleSubmit }}>
      <form onSubmit={handleSubmit}>{children}</form>
    </FormContext.Provider>
  );
}

// Hook for consuming
export const useFormField = <T,>(name: keyof T) => {
  const context = useContext(FormContext);
  if (!context) throw new Error('useFormField must be used within FormProvider');

  return {
    value: context.values[name],
    error: context.errors[name],
    touched: context.touched[name],
    onChange: (value: T[typeof name]) => context.setValue(name, value),
  };
};
```

---

## Polymorphic Components

### The `as` Prop Pattern

```typescript
// src/components/ui/Box.tsx
type BoxProps<C extends React.ElementType> = {
  as?: C;
  children?: React.ReactNode;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<C>, 'as' | 'className' | 'children'>;

function Box<C extends React.ElementType = 'div'>({
  as,
  children,
  className,
  ...props
}: BoxProps<C>) {
  const Component = as || 'div';

  return (
    <Component className={cn('', className)} {...props}>
      {children}
    </Component>
  );
}

// Usage
<Box>Default div</Box>
<Box as="section">Section element</Box>
<Box as="a" href="/home">Link element</Box>
<Box as={Link} to="/dashboard">React Router Link</Box>
```

### Polymorphic Button

```typescript
// src/components/ui/Button.tsx
type ButtonProps<C extends React.ElementType = 'button'> = {
  as?: C;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<C>, 'as'>;

function Button<C extends React.ElementType = 'button'>({
  as,
  variant = 'default',
  size = 'md',
  isLoading,
  leftIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps<C>) {
  const Component = as || 'button';

  return (
    <Component
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Spinner /> : leftIcon}
      {children}
    </Component>
  );
}

// Usage
<Button>Click me</Button>
<Button as="a" href="/docs">Documentation</Button>
<Button as={Link} to="/dashboard">Go to Dashboard</Button>
```

---

## Controlled vs Uncontrolled

### Supporting Both Modes

```typescript
// src/components/ui/Input.tsx
interface InputProps {
  // Controlled mode
  value?: string;
  onChange?: (value: string) => void;

  // Uncontrolled mode
  defaultValue?: string;

  // Common props
  placeholder?: string;
  disabled?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  value: controlledValue,
  onChange,
  defaultValue,
  ...props
}, ref) => {
  // Track if component is controlled
  const isControlled = controlledValue !== undefined;

  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');

  // Use controlled or internal value
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (!isControlled) {
      setInternalValue(newValue);
    }

    onChange?.(newValue);
  };

  return (
    <input
      ref={ref}
      value={value}
      onChange={handleChange}
      {...props}
    />
  );
});

// Usage - Controlled
const [name, setName] = useState('');
<Input value={name} onChange={setName} />

// Usage - Uncontrolled
const inputRef = useRef<HTMLInputElement>(null);
<Input ref={inputRef} defaultValue="Initial" />
```

---

## Related Documentation

- [UI_COMPONENTS.md](./UI_COMPONENTS.md) - UI component reference
- [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) - State patterns
- [TESTING.md](./TESTING.md) - Component testing
- [ACCESSIBILITY.md](./ACCESSIBILITY.md) - Accessible components

---

_This guide is updated as component patterns evolve._
