/**
 * @file rate-limiter.ts
 * @description Rate limiting utility for Supabase Edge Functions
 * Uses in-memory storage with sliding window algorithm
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Rate limit tiers based on subscription
export const RATE_LIMITS = {
  free: {
    requests_per_minute: 10,
    requests_per_hour: 100,
    requests_per_day: 500,
  },
  pro: {
    requests_per_minute: 60,
    requests_per_hour: 1000,
    requests_per_day: 10000,
  },
  team: {
    requests_per_minute: 120,
    requests_per_hour: 5000,
    requests_per_day: 50000,
  },
  enterprise: {
    requests_per_minute: 300,
    requests_per_hour: 20000,
    requests_per_day: 200000,
  },
} as const;

export type SubscriptionTier = keyof typeof RATE_LIMITS;

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset: number; // Unix timestamp
  limit: number;
  retryAfter?: number; // Seconds until retry
}

interface RateLimitHeaders {
  'X-RateLimit-Limit': string;
  'X-RateLimit-Remaining': string;
  'X-RateLimit-Reset': string;
  'Retry-After'?: string;
}

/**
 * Check rate limit using Supabase as storage
 * Uses a sliding window counter stored in a rate_limits table
 */
export async function checkRateLimit(
  supabaseUrl: string,
  supabaseServiceKey: string,
  userId: string,
  tier: SubscriptionTier = 'free',
  endpoint: string = 'default'
): Promise<RateLimitResult> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const limits = RATE_LIMITS[tier];
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const windowStart = now - windowMs;

  try {
    // Get recent requests count
    const { count, error } = await supabase
      .from('rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('endpoint', endpoint)
      .gte('created_at', new Date(windowStart).toISOString());

    if (error) {
      console.error('Rate limit check error:', error);
      // Fail open - allow request if rate limit check fails
      return {
        allowed: true,
        remaining: limits.requests_per_minute,
        reset: Math.floor((now + windowMs) / 1000),
        limit: limits.requests_per_minute,
      };
    }

    const requestCount = count || 0;
    const remaining = Math.max(0, limits.requests_per_minute - requestCount - 1);
    const allowed = requestCount < limits.requests_per_minute;

    // Log this request
    if (allowed) {
      await supabase.from('rate_limits').insert({
        user_id: userId,
        endpoint,
        created_at: new Date(now).toISOString(),
      });
    }

    // Clean up old entries (async, don't wait)
    supabase
      .from('rate_limits')
      .delete()
      .lt('created_at', new Date(windowStart - windowMs).toISOString())
      .then(() => {});

    return {
      allowed,
      remaining,
      reset: Math.floor((now + windowMs) / 1000),
      limit: limits.requests_per_minute,
      retryAfter: allowed ? undefined : Math.ceil(windowMs / 1000),
    };
  } catch (error) {
    console.error('Rate limit error:', error);
    // Fail open
    return {
      allowed: true,
      remaining: limits.requests_per_minute,
      reset: Math.floor((now + windowMs) / 1000),
      limit: limits.requests_per_minute,
    };
  }
}

/**
 * Generate rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): RateLimitHeaders {
  const headers: RateLimitHeaders = {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
  };

  if (result.retryAfter) {
    headers['Retry-After'] = result.retryAfter.toString();
  }

  return headers;
}

/**
 * Create rate limit exceeded response
 */
export function rateLimitExceededResponse(
  result: RateLimitResult,
  corsHeaders: Record<string, string>
): Response {
  return new Response(
    JSON.stringify({
      error: 'Rate limit exceeded',
      message: `Too many requests. Please try again in ${result.retryAfter} seconds.`,
      retryAfter: result.retryAfter,
    }),
    {
      status: 429,
      headers: {
        ...corsHeaders,
        ...getRateLimitHeaders(result),
        'Content-Type': 'application/json',
      },
    }
  );
}
