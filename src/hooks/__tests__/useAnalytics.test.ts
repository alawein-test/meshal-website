/**
 * @file useAnalytics.test.ts
 * @description Unit tests for the useAnalytics hook (Phase 3 feature)
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAnalytics } from '../useAnalytics';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => Promise.resolve({ error: null })),
    })),
  },
}));

// Mock auth store
vi.mock('@/stores/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    user: { id: 'user-123' },
    session: { access_token: 'test-token' },
  })),
}));

describe('useAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.gtag
    (window as any).gtag = vi.fn();
    // Mock window.mixpanel
    (window as any).mixpanel = {
      track: vi.fn(),
      identify: vi.fn(),
      people: { set: vi.fn() },
    };
    // Mock window.posthog
    (window as any).posthog = {
      capture: vi.fn(),
      identify: vi.fn(),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete (window as any).gtag;
    delete (window as any).mixpanel;
    delete (window as any).posthog;
  });

  describe('hook interface', () => {
    it('should return analytics methods', () => {
      const { result } = renderHook(() => useAnalytics());

      expect(result.current).toHaveProperty('trackEvent');
      expect(result.current).toHaveProperty('trackPageView');
      expect(result.current).toHaveProperty('trackConversion');
      expect(result.current).toHaveProperty('trackSubscription');
      expect(result.current).toHaveProperty('trackSimulation');
      expect(result.current).toHaveProperty('trackError');
      expect(result.current).toHaveProperty('identify');
    });

    it('should have trackEvent as a function', () => {
      const { result } = renderHook(() => useAnalytics());
      expect(typeof result.current.trackEvent).toBe('function');
    });

    it('should have trackPageView as a function', () => {
      const { result } = renderHook(() => useAnalytics());
      expect(typeof result.current.trackPageView).toBe('function');
    });

    it('should have trackConversion as a function', () => {
      const { result } = renderHook(() => useAnalytics());
      expect(typeof result.current.trackConversion).toBe('function');
    });

    it('should have trackSubscription as a function', () => {
      const { result } = renderHook(() => useAnalytics());
      expect(typeof result.current.trackSubscription).toBe('function');
    });

    it('should have trackSimulation as a function', () => {
      const { result } = renderHook(() => useAnalytics());
      expect(typeof result.current.trackSimulation).toBe('function');
    });

    it('should have trackError as a function', () => {
      const { result } = renderHook(() => useAnalytics());
      expect(typeof result.current.trackError).toBe('function');
    });

    it('should have identify as a function', () => {
      const { result } = renderHook(() => useAnalytics());
      expect(typeof result.current.identify).toBe('function');
    });
  });

  describe('trackEvent', () => {
    it('should call GA4 gtag when available and enabled', () => {
      const { result } = renderHook(() =>
        useAnalytics({
          enabled: true,
          providers: { googleAnalytics: true, mixpanel: false, posthog: false, custom: false },
        })
      );

      act(() => {
        result.current.trackEvent({
          category: 'engagement',
          action: 'button_click',
          label: 'test_button',
        });
      });

      expect((window as any).gtag).toHaveBeenCalled();
    });

    it('should not call providers when disabled', () => {
      const { result } = renderHook(() =>
        useAnalytics({
          enabled: false,
        })
      );

      act(() => {
        result.current.trackEvent({
          category: 'engagement',
          action: 'button_click',
          label: 'test_button',
        });
      });

      expect((window as any).gtag).not.toHaveBeenCalled();
    });

    it('should be callable without errors', () => {
      const { result } = renderHook(() => useAnalytics());

      expect(() => {
        act(() => {
          result.current.trackEvent({
            category: 'engagement',
            action: 'button_click',
            label: 'test_button',
          });
        });
      }).not.toThrow();
    });
  });

  describe('trackPageView', () => {
    it('should track page view with path when enabled', () => {
      const { result } = renderHook(() =>
        useAnalytics({
          enabled: true,
          providers: { googleAnalytics: true, mixpanel: false, posthog: false, custom: false },
        })
      );

      act(() => {
        result.current.trackPageView('/test-page');
      });

      expect((window as any).gtag).toHaveBeenCalled();
    });
  });

  describe('trackConversion', () => {
    it('should track conversion event when enabled', () => {
      const { result } = renderHook(() =>
        useAnalytics({
          enabled: true,
          providers: { googleAnalytics: true, mixpanel: false, posthog: false, custom: false },
        })
      );

      act(() => {
        result.current.trackConversion('signup', 0, { currency: 'USD' });
      });

      expect((window as any).gtag).toHaveBeenCalled();
    });
  });
});
