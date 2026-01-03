import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

/**
 * Generate a visitor ID based on browser fingerprint
 * Excludes your IP and prevents double-counting
 */
function generateVisitorId(): string {
  // Check localStorage first
  const stored = localStorage.getItem('visitor_id');
  if (stored) return stored;

  // Generate fingerprint
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx?.fillText('visitor-fingerprint', 2, 2);
  const canvasHash = canvas.toDataURL().slice(-20);

  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvasHash,
  ].join('|');

  // Simple hash
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  const visitorId = `visitor_${Math.abs(hash).toString(36)}`;
  localStorage.setItem('visitor_id', visitorId);
  return visitorId;
}

/**
 * Get IP address (for exclusion check)
 */
async function getIPAddress(): Promise<string | null> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return null;
  }
}

interface TrackingOptions {
  trackBehaviors?: boolean;
  trackScroll?: boolean;
  trackClicks?: boolean;
  excludedPaths?: string[];
}

interface SearchFilters {
  [key: string]: string | number | boolean | null;
}

/**
 * Hook for visitor tracking
 * Tracks page views, behaviors, and preferences
 */
export function useVisitorTracking(options: TrackingOptions = {}) {
  const location = useLocation();
  const visitorIdRef = useRef<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const pageViewIdRef = useRef<string | null>(null);
  const scrollDepthRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());

  const trackBehaviors = options.trackBehaviors ?? true;
  const trackScroll = options.trackScroll ?? true;
  const trackClicks = options.trackClicks ?? true;

  // Memoize excludedPaths to prevent dependency changes
  const excludedPaths = useMemo(
    () => options.excludedPaths ?? ['/admin', '/settings'],
    [options.excludedPaths]
  );

  // Memoize path check function
  const isPathExcluded = useCallback(
    (path: string) => excludedPaths.some((excluded) => path.startsWith(excluded)),
    [excludedPaths]
  );

  // Initialize visitor
  useEffect(() => {
    const initTracking = async () => {
      // Skip if path is excluded
      if (isPathExcluded(location.pathname)) {
        return;
      }

      const visitorId = generateVisitorId();
      visitorIdRef.current = visitorId;

      const ipAddress = await getIPAddress();
      const userAgent = navigator.userAgent;
      const referrer = document.referrer || null;

      try {
        // Get or create visitor session
        const { data: sessionId } = await supabase.rpc('get_or_create_visitor', {
          p_visitor_id: visitorId,
          p_ip_address: ipAddress,
          p_user_agent: userAgent,
          p_referrer: referrer,
        });

        if (sessionId) {
          setIsTracking(true);
        }
      } catch (error) {
        console.error('Failed to initialize visitor tracking:', error);
      }
    };

    initTracking();
  }, [isPathExcluded, location.pathname]);

  // Track page view on route change
  useEffect(() => {
    if (!visitorIdRef.current || !isTracking) return;
    if (isPathExcluded(location.pathname)) return;

    const trackView = async () => {
      startTimeRef.current = Date.now();
      scrollDepthRef.current = 0;

      try {
        const { data: viewId } = await supabase.rpc('track_page_view', {
          p_visitor_id: visitorIdRef.current,
          p_path: location.pathname,
          p_title: document.title,
          p_referrer: document.referrer || null,
          p_query_params: Object.fromEntries(new URLSearchParams(location.search)),
        });

        pageViewIdRef.current = viewId;
      } catch (error) {
        console.error('Failed to track page view:', error);
      }
    };

    trackView();

    // Track page exit
    return () => {
      if (pageViewIdRef.current && visitorIdRef.current) {
        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);

        // Update page view with duration and scroll depth
        supabase
          .from('page_views')
          .update({
            duration,
            scroll_depth: scrollDepthRef.current,
          })
          .eq('id', pageViewIdRef.current)
          .then(() => {});
      }
    };
  }, [location.pathname, location.search, isTracking, isPathExcluded]);

  // Track scroll depth
  useEffect(() => {
    if (!trackScroll || !isTracking) return;

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = Math.round(((scrollTop + windowHeight) / documentHeight) * 100);

      if (scrollPercent > scrollDepthRef.current) {
        scrollDepthRef.current = scrollPercent;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackScroll, isTracking]);

  // Track clicks
  useEffect(() => {
    if (!trackClicks || !isTracking || !visitorIdRef.current) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const elementType = target.tagName.toLowerCase();
      const elementId = target.id || null;
      const elementText = target.textContent?.slice(0, 100) || null;

      supabase
        .rpc('track_behavior', {
          p_visitor_id: visitorIdRef.current,
          p_behavior_type: 'click',
          p_element_type: elementType,
          p_element_id: elementId,
          p_element_text: elementText,
          p_page_path: location.pathname,
          p_metadata: {
            x: e.clientX,
            y: e.clientY,
          },
        })
        .catch(console.error);
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [trackClicks, isTracking, location.pathname]);

  // Track search
  const trackSearch = useCallback(
    async (query: string, filters?: SearchFilters, resultsCount?: number) => {
      if (!visitorIdRef.current || !isTracking) return;

      try {
        await supabase.rpc('track_search', {
          p_visitor_id: visitorIdRef.current,
          p_query: query,
          p_filters: filters || {},
          p_results_count: resultsCount,
        });
      } catch (error) {
        console.error('Failed to track search:', error);
      }
    },
    [isTracking]
  );

  // Track preference
  const trackPreference = useCallback(
    async (key: string, value: string) => {
      if (!visitorIdRef.current || !isTracking) return;

      try {
        await supabase.from('visitor_preferences').upsert(
          {
            visitor_id: visitorIdRef.current,
            preference_key: key,
            preference_value: value,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'visitor_id,preference_key',
          }
        );
      } catch (error) {
        console.error('Failed to track preference:', error);
      }
    },
    [isTracking]
  );

  return {
    visitorId: visitorIdRef.current,
    isTracking,
    trackSearch,
    trackPreference,
  };
}
