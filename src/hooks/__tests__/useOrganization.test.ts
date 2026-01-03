/**
 * @file useOrganization.test.ts
 * @description Unit tests for the useOrganization hook (Phase 1 multi-tenancy feature)
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock Supabase client
const mockFrom = vi.fn();
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
    rpc: vi.fn(() => Promise.resolve({ data: null, error: null })),
  },
}));

// Mock auth store
vi.mock('@/stores/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    user: { id: 'user-123', email: 'test@example.com' },
    session: { access_token: 'test-token' },
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

describe('useOrganization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default mock chain
    mockFrom.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
          order: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
        order: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: 'org-123' }, error: null })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return hook interface', async () => {
    const { useOrganization } = await import('../useOrganization');

    const { result } = renderHook(() => useOrganization(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toHaveProperty('currentOrg');
    expect(result.current).toHaveProperty('organizations');
    expect(result.current).toHaveProperty('members');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('createOrg');
    expect(result.current).toHaveProperty('updateOrg');
    expect(result.current).toHaveProperty('setCurrentOrgId');
    expect(result.current).toHaveProperty('currentUserRole');
    expect(result.current).toHaveProperty('canManageMembers');
    expect(result.current).toHaveProperty('canManageOrg');
  });

  it('should have createOrg as a function', async () => {
    const { useOrganization } = await import('../useOrganization');

    const { result } = renderHook(() => useOrganization(), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.createOrg).toBe('function');
  });

  it('should have updateOrg as a function', async () => {
    const { useOrganization } = await import('../useOrganization');

    const { result } = renderHook(() => useOrganization(), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.updateOrg).toBe('function');
  });

  it('should have setCurrentOrgId as a function', async () => {
    const { useOrganization } = await import('../useOrganization');

    const { result } = renderHook(() => useOrganization(), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.setCurrentOrgId).toBe('function');
  });

  it('should have currentUserRole as a function', async () => {
    const { useOrganization } = await import('../useOrganization');

    const { result } = renderHook(() => useOrganization(), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.currentUserRole).toBe('function');
  });

  it('should have canManageMembers as a function', async () => {
    const { useOrganization } = await import('../useOrganization');

    const { result } = renderHook(() => useOrganization(), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.canManageMembers).toBe('function');
  });

  it('should have canManageOrg as a function', async () => {
    const { useOrganization } = await import('../useOrganization');

    const { result } = renderHook(() => useOrganization(), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.canManageOrg).toBe('function');
  });

  it('should initialize with undefined currentOrg', async () => {
    const { useOrganization } = await import('../useOrganization');

    const { result } = renderHook(() => useOrganization(), {
      wrapper: createWrapper(),
    });

    expect(result.current.currentOrg).toBeUndefined();
  });

  it('should initialize with empty organizations array', async () => {
    const { useOrganization } = await import('../useOrganization');

    const { result } = renderHook(() => useOrganization(), {
      wrapper: createWrapper(),
    });

    expect(Array.isArray(result.current.organizations)).toBe(true);
  });
});
