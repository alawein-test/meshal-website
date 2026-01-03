/**
 * @file useSimulations.test.ts
 * @description Unit tests for the useSimulations custom hook
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: null, error: null })),
          })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
      })),
    })),
  },
}));

vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({
    user: { id: 'test-user-id' },
  }),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Import after mocks
import { useSimulations } from '../useSimulations';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useSimulations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return simulations array', () => {
    const { result } = renderHook(() => useSimulations(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toHaveProperty('simulations');
    expect(Array.isArray(result.current.simulations)).toBe(true);
  });

  it('should return loading state', () => {
    const { result } = renderHook(() => useSimulations(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toHaveProperty('isLoading');
    expect(typeof result.current.isLoading).toBe('boolean');
  });

  it('should provide createSimulation mutation', () => {
    const { result } = renderHook(() => useSimulations(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toHaveProperty('createSimulation');
    expect(typeof result.current.createSimulation.mutate).toBe('function');
  });

  it('should provide updateSimulation mutation', () => {
    const { result } = renderHook(() => useSimulations(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toHaveProperty('updateSimulation');
    expect(typeof result.current.updateSimulation.mutate).toBe('function');
  });

  it('should provide deleteSimulation mutation', () => {
    const { result } = renderHook(() => useSimulations(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toHaveProperty('deleteSimulation');
    expect(typeof result.current.deleteSimulation.mutate).toBe('function');
  });
});
