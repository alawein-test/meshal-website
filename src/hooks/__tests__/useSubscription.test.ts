/**
 * @file useSubscription.test.ts
 * @description Unit tests for the useSubscription hook (Stripe billing integration)
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSubscription, SUBSCRIPTION_PLANS } from '../useSubscription';

// Mock Supabase client
const mockInvoke = vi.fn();
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: (...args: unknown[]) => mockInvoke(...args),
    },
  },
}));

// Mock auth store
const mockSession = {
  access_token: 'test-token',
  user: { id: 'user-123' },
};

vi.mock('@/stores/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    session: mockSession,
    user: { id: 'user-123', subscription_tier: 'free' },
  })),
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('useSubscription', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset window.location
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '' },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('SUBSCRIPTION_PLANS', () => {
    it('should have 4 subscription tiers', () => {
      expect(SUBSCRIPTION_PLANS).toHaveLength(4);
    });

    it('should have free, pro, team, and enterprise plans', () => {
      const planIds = SUBSCRIPTION_PLANS.map((p) => p.id);
      expect(planIds).toContain('free');
      expect(planIds).toContain('pro');
      expect(planIds).toContain('team');
      expect(planIds).toContain('enterprise');
    });

    it('should have correct pricing for pro plan', () => {
      const proPlan = SUBSCRIPTION_PLANS.find((p) => p.id === 'pro');
      expect(proPlan?.priceMonthly).toBe(49);
      expect(proPlan?.priceAnnual).toBe(470);
    });

    it('should mark pro plan as popular', () => {
      const proPlan = SUBSCRIPTION_PLANS.find((p) => p.id === 'pro');
      expect(proPlan?.popular).toBe(true);
    });

    it('should have limits defined for each plan', () => {
      SUBSCRIPTION_PLANS.forEach((plan) => {
        expect(plan.limits).toBeDefined();
        expect(plan.limits.simulations).toBeDefined();
        expect(plan.limits.storage).toBeDefined();
        expect(plan.limits.apiCalls).toBeDefined();
        expect(plan.limits.teamMembers).toBeDefined();
      });
    });
  });

  describe('useSubscription hook', () => {
    it('should return subscription state and methods', () => {
      const { result } = renderHook(() => useSubscription());

      expect(result.current).toHaveProperty('currentPlan');
      expect(result.current).toHaveProperty('status');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('createCheckout');
      expect(result.current).toHaveProperty('openCustomerPortal');
      expect(result.current).toHaveProperty('canAccess');
      expect(result.current).toHaveProperty('getRemainingUsage');
    });

    it('should default to free plan', () => {
      const { result } = renderHook(() => useSubscription());
      expect(result.current.currentPlan?.id).toBe('free');
    });

    it('should have createCheckout as a function', () => {
      const { result } = renderHook(() => useSubscription());
      expect(typeof result.current.createCheckout).toBe('function');
    });

    it('should have openCustomerPortal as a function', () => {
      const { result } = renderHook(() => useSubscription());
      expect(typeof result.current.openCustomerPortal).toBe('function');
    });

    it('should have canAccess as a function', () => {
      const { result } = renderHook(() => useSubscription());
      expect(typeof result.current.canAccess).toBe('function');
    });

    it('should have getRemainingUsage as a function', () => {
      const { result } = renderHook(() => useSubscription());
      expect(typeof result.current.getRemainingUsage).toBe('function');
    });
  });

  describe('createCheckout', () => {
    it('should call Supabase function with correct parameters', async () => {
      mockInvoke.mockResolvedValueOnce({
        data: { url: 'https://checkout.stripe.com/test' },
        error: null,
      });

      const { result } = renderHook(() => useSubscription());

      await act(async () => {
        await result.current.createCheckout('pro', 'monthly');
      });

      expect(mockInvoke).toHaveBeenCalledWith('create-checkout', {
        body: {
          action: 'create-checkout',
          planId: 'pro',
          billingPeriod: 'monthly',
          priceId: 'price_pro_monthly',
        },
      });
    });

    it('should redirect to checkout URL on success', async () => {
      const checkoutUrl = 'https://checkout.stripe.com/test-session';
      mockInvoke.mockResolvedValueOnce({ data: { url: checkoutUrl }, error: null });

      const { result } = renderHook(() => useSubscription());

      await act(async () => {
        await result.current.createCheckout('pro', 'monthly');
      });

      expect(window.location.href).toBe(checkoutUrl);
    });
  });
});
