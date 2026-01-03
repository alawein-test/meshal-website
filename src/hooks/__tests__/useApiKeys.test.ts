/**
 * @file useApiKeys.test.ts
 * @description Unit tests for the useApiKeys hook (Phase 3 feature)
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: 'key-123' }, error: null })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  },
}));

// Mock auth store
vi.mock('@/stores/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    user: { id: 'user-123' },
  })),
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Create wrapper with QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useApiKeys', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return hook interface', async () => {
    // Import dynamically to ensure mocks are applied
    const { useApiKeys } = await import('../useApiKeys');

    const { result } = renderHook(() => useApiKeys(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toHaveProperty('apiKeys');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('newKey');
    expect(result.current).toHaveProperty('createKey');
    expect(result.current).toHaveProperty('revokeKey');
    expect(result.current).toHaveProperty('deleteKey');
    expect(result.current).toHaveProperty('clearNewKey');
    expect(result.current).toHaveProperty('isCreating');
    expect(result.current).toHaveProperty('isRevoking');
    expect(result.current).toHaveProperty('isDeleting');
  });

  it('should have createKey as a function', async () => {
    const { useApiKeys } = await import('../useApiKeys');

    const { result } = renderHook(() => useApiKeys(), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.createKey).toBe('function');
  });

  it('should have revokeKey as a function', async () => {
    const { useApiKeys } = await import('../useApiKeys');

    const { result } = renderHook(() => useApiKeys(), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.revokeKey).toBe('function');
  });

  it('should have deleteKey as a function', async () => {
    const { useApiKeys } = await import('../useApiKeys');

    const { result } = renderHook(() => useApiKeys(), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.deleteKey).toBe('function');
  });

  it('should have clearNewKey as a function', async () => {
    const { useApiKeys } = await import('../useApiKeys');

    const { result } = renderHook(() => useApiKeys(), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.clearNewKey).toBe('function');
  });

  it('should initialize with empty apiKeys array', async () => {
    const { useApiKeys } = await import('../useApiKeys');

    const { result } = renderHook(() => useApiKeys(), {
      wrapper: createWrapper(),
    });

    // Initially empty before query resolves
    expect(Array.isArray(result.current.apiKeys)).toBe(true);
  });

  it('should initialize with null newKey', async () => {
    const { useApiKeys } = await import('../useApiKeys');

    const { result } = renderHook(() => useApiKeys(), {
      wrapper: createWrapper(),
    });

    expect(result.current.newKey).toBeNull();
  });

  it('should initialize with false for mutation states', async () => {
    const { useApiKeys } = await import('../useApiKeys');

    const { result } = renderHook(() => useApiKeys(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isCreating).toBe(false);
    expect(result.current.isRevoking).toBe(false);
    expect(result.current.isDeleting).toBe(false);
  });
});
