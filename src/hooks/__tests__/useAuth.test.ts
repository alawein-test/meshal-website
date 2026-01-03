/**
 * @file useAuth.test.ts
 * @description Unit tests for the useAuth custom hook
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from '../useAuth';

// Mock dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
      signInWithPassword: vi.fn(() => Promise.resolve({ data: null, error: null })),
      signUp: vi.fn(() => Promise.resolve({ data: null, error: null })),
      signOut: vi.fn(() => Promise.resolve({ error: null })),
      resetPasswordForEmail: vi.fn(() => Promise.resolve({ error: null })),
      updateUser: vi.fn(() => Promise.resolve({ data: null, error: null })),
    },
  },
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({
    pathname: '/',
    search: '',
    hash: '',
    state: null,
    key: 'default',
  }),
}));

vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({
    user: null,
    session: null,
    isLoading: false,
    isAuthenticated: false,
    setUser: vi.fn(),
    setSession: vi.fn(),
    setLoading: vi.fn(),
    logout: vi.fn(),
  }),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return auth state properties', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('session');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('isAuthenticated');
  });

  it('should provide signIn function', () => {
    const { result } = renderHook(() => useAuth());
    expect(typeof result.current.signIn).toBe('function');
  });

  it('should provide signUp function', () => {
    const { result } = renderHook(() => useAuth());
    expect(typeof result.current.signUp).toBe('function');
  });

  it('should provide signOut function', () => {
    const { result } = renderHook(() => useAuth());
    expect(typeof result.current.signOut).toBe('function');
  });

  it('should provide resetPassword function', () => {
    const { result } = renderHook(() => useAuth());
    expect(typeof result.current.resetPassword).toBe('function');
  });

  it('should provide updatePassword function', () => {
    const { result } = renderHook(() => useAuth());
    expect(typeof result.current.updatePassword).toBe('function');
  });
});
