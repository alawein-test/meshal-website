/**
 * @file useAnalytics.ts
 * @description Analytics hook for tracking user events and conversions.
 * Supports multiple analytics providers with a unified API.
 *
 * TODO: Configure analytics provider keys in environment variables:
 * - VITE_GA_MEASUREMENT_ID: Google Analytics 4 measurement ID (e.g., G-XXXXXXXXXX)
 * - VITE_MIXPANEL_TOKEN: Mixpanel project token
 * - VITE_POSTHOG_KEY: PostHog API key
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

// Analytics event types
export type AnalyticsEventCategory =
  | 'navigation'
  | 'engagement'
  | 'conversion'
  | 'subscription'
  | 'simulation'
  | 'export'
  | 'error'
  | 'feature';

export interface AnalyticsEvent {
  category: AnalyticsEventCategory;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, unknown>;
}

export interface AnalyticsConfig {
  enabled: boolean;
  debug: boolean;
  providers: {
    googleAnalytics: boolean;
    mixpanel: boolean;
    posthog: boolean;
    custom: boolean;
  };
}

// Window type extension for gtag
interface WindowWithGtag extends Window {
  gtag?: (command: string, action: string, params?: Record<string, unknown>) => void;
}

// Default configuration
const defaultConfig: AnalyticsConfig = {
  enabled: import.meta.env.PROD, // Only enable in production by default
  debug: import.meta.env.DEV,
  providers: {
    googleAnalytics: !!import.meta.env.VITE_GA_MEASUREMENT_ID,
    mixpanel: !!import.meta.env.VITE_MIXPANEL_TOKEN,
    posthog: !!import.meta.env.VITE_POSTHOG_KEY,
    custom: true, // Internal analytics to Supabase
  },
};

/**
 * Send event to Google Analytics 4
 */
function sendToGA4(event: AnalyticsEvent) {
  // TODO: Initialize GA4 with your measurement ID
  // gtag('event', event.action, {
  //   event_category: event.category,
  //   event_label: event.label,
  //   value: event.value,
  //   ...event.metadata,
  // });

  // Placeholder for GA4 integration
  if (typeof window !== 'undefined' && (window as WindowWithGtag).gtag) {
    (window as WindowWithGtag).gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.metadata,
    });
  }
}

/**
 * Send event to internal analytics (Supabase)
 */
async function sendToSupabase(event: AnalyticsEvent, userId?: string) {
  // This would write to a Supabase analytics table
  // For now, we'll just log it in development
  if (import.meta.env.DEV) {
    console.log('[Analytics]', { ...event, userId, timestamp: new Date().toISOString() });
  }

  // TODO: Implement Supabase analytics table insertion
  // await supabase.from('analytics_events').insert({
  //   user_id: userId,
  //   category: event.category,
  //   action: event.action,
  //   label: event.label,
  //   value: event.value,
  //   metadata: event.metadata,
  //   created_at: new Date().toISOString(),
  // });
}

export interface UseAnalyticsReturn {
  trackEvent: (event: AnalyticsEvent) => void;
  trackPageView: (path?: string) => void;
  trackConversion: (
    conversionId: string,
    value?: number,
    metadata?: Record<string, unknown>
  ) => void;
  trackSubscription: (
    action: 'view_plans' | 'start_checkout' | 'complete' | 'cancel',
    planId?: string
  ) => void;
  trackSimulation: (
    action: 'create' | 'run' | 'complete' | 'export',
    simulationType?: string
  ) => void;
  trackError: (errorType: string, errorMessage: string, metadata?: Record<string, unknown>) => void;
  identify: (userId: string, traits?: Record<string, unknown>) => void;
}

export function useAnalytics(config: Partial<AnalyticsConfig> = {}): UseAnalyticsReturn {
  const { user } = useAuthStore();
  const location = useLocation();

  // Memoize merged config to prevent dependency changes on every render
  const mergedConfig = useMemo(
    () => ({
      ...defaultConfig,
      ...config,
      providers: { ...defaultConfig.providers, ...config.providers },
    }),
    [config]
  );

  const trackEvent = useCallback(
    (event: AnalyticsEvent) => {
      if (!mergedConfig.enabled) return;

      if (mergedConfig.debug) {
        console.log('[Analytics Event]', event);
      }

      // Send to enabled providers
      if (mergedConfig.providers.googleAnalytics) {
        sendToGA4(event);
      }
      if (mergedConfig.providers.custom) {
        sendToSupabase(event, user?.id);
      }
    },
    [mergedConfig, user?.id]
  );

  const trackPageView = useCallback(
    (path?: string) => {
      trackEvent({
        category: 'navigation',
        action: 'page_view',
        label: path || window.location.pathname,
        metadata: { referrer: document.referrer },
      });
    },
    [trackEvent]
  );

  // Track page views automatically
  useEffect(() => {
    if (mergedConfig.enabled) {
      trackPageView(location.pathname);
    }
  }, [location.pathname, mergedConfig.enabled, trackPageView]);

  const trackConversion = useCallback(
    (conversionId: string, value?: number, metadata?: Record<string, unknown>) => {
      trackEvent({
        category: 'conversion',
        action: conversionId,
        value,
        metadata,
      });
    },
    [trackEvent]
  );

  const trackSubscription = useCallback(
    (action: 'view_plans' | 'start_checkout' | 'complete' | 'cancel', planId?: string) => {
      trackEvent({
        category: 'subscription',
        action,
        label: planId,
      });
    },
    [trackEvent]
  );

  const trackSimulation = useCallback(
    (action: 'create' | 'run' | 'complete' | 'export', simulationType?: string) => {
      trackEvent({
        category: 'simulation',
        action,
        label: simulationType,
      });
    },
    [trackEvent]
  );

  const trackError = useCallback(
    (errorType: string, errorMessage: string, metadata?: Record<string, unknown>) => {
      trackEvent({
        category: 'error',
        action: errorType,
        label: errorMessage,
        metadata,
      });
    },
    [trackEvent]
  );

  const identify = useCallback(
    (userId: string, traits?: Record<string, unknown>) => {
      if (!mergedConfig.enabled) return;

      if (mergedConfig.debug) {
        console.log('[Analytics Identify]', { userId, traits });
      }

      // TODO: Send identify to analytics providers
      // gtag('config', GA_MEASUREMENT_ID, { user_id: userId });
      // mixpanel.identify(userId);
      // posthog.identify(userId, traits);
    },
    [mergedConfig]
  );

  return {
    trackEvent,
    trackPageView,
    trackConversion,
    trackSubscription,
    trackSimulation,
    trackError,
    identify,
  };
}

export default useAnalytics;
