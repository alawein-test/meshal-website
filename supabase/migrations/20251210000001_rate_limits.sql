-- Rate Limiting Table Migration
-- Stores request counts for API rate limiting

CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL DEFAULT 'default',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_endpoint_time 
  ON public.rate_limits(user_id, endpoint, created_at DESC);

-- Index for cleanup queries
CREATE INDEX IF NOT EXISTS idx_rate_limits_created_at 
  ON public.rate_limits(created_at);

-- RLS - Only service role can access (Edge Functions use service role)
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- No public access - only service role
CREATE POLICY "Service role only" ON public.rate_limits
  FOR ALL USING (false);

-- Function to clean up old rate limit entries (run periodically)
CREATE OR REPLACE FUNCTION cleanup_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM public.rate_limits
  WHERE created_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Usage tracking table for quota enforcement
CREATE TABLE IF NOT EXISTS public.usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- simcore, mezan, talai, optilibria, qmlab
  resource_type TEXT NOT NULL, -- simulation, workflow, experiment, run
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  count INTEGER DEFAULT 0,
  limit_count INTEGER, -- NULL means unlimited
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, platform, resource_type, period_start)
);

-- Index for usage lookups
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_period 
  ON public.usage_tracking(user_id, period_start, period_end);

CREATE INDEX IF NOT EXISTS idx_usage_tracking_org_period 
  ON public.usage_tracking(organization_id, period_start, period_end);

-- RLS for usage tracking
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- Users can view their own usage
CREATE POLICY "Users can view own usage" ON public.usage_tracking
  FOR SELECT USING (auth.uid() = user_id);

-- Function to increment usage count
CREATE OR REPLACE FUNCTION increment_usage(
  p_user_id UUID,
  p_platform TEXT,
  p_resource_type TEXT,
  p_org_id UUID DEFAULT NULL
)
RETURNS TABLE(current_count INTEGER, limit_count INTEGER, allowed BOOLEAN) AS $$
DECLARE
  v_period_start DATE;
  v_period_end DATE;
  v_current_count INTEGER;
  v_limit INTEGER;
  v_tier TEXT;
BEGIN
  -- Get current billing period (monthly)
  v_period_start := DATE_TRUNC('month', CURRENT_DATE)::DATE;
  v_period_end := (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
  
  -- Get user's subscription tier
  SELECT COALESCE(subscription_tier, 'free') INTO v_tier
  FROM public.profiles WHERE id = p_user_id;
  
  -- Set limits based on tier
  v_limit := CASE v_tier
    WHEN 'free' THEN 5
    WHEN 'pro' THEN NULL -- unlimited
    WHEN 'team' THEN NULL -- unlimited
    WHEN 'enterprise' THEN NULL -- unlimited
    ELSE 5
  END;
  
  -- Upsert usage record
  INSERT INTO public.usage_tracking (
    user_id, organization_id, platform, resource_type, 
    period_start, period_end, count, limit_count
  )
  VALUES (
    p_user_id, p_org_id, p_platform, p_resource_type,
    v_period_start, v_period_end, 1, v_limit
  )
  ON CONFLICT (user_id, platform, resource_type, period_start)
  DO UPDATE SET 
    count = usage_tracking.count + 1,
    updated_at = NOW()
  RETURNING usage_tracking.count, usage_tracking.limit_count
  INTO v_current_count, v_limit;
  
  RETURN QUERY SELECT 
    v_current_count,
    v_limit,
    (v_limit IS NULL OR v_current_count <= v_limit) AS allowed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current usage
CREATE OR REPLACE FUNCTION get_current_usage(p_user_id UUID)
RETURNS TABLE(
  platform TEXT,
  resource_type TEXT,
  current_count INTEGER,
  limit_count INTEGER,
  period_start DATE,
  period_end DATE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ut.platform,
    ut.resource_type,
    ut.count,
    ut.limit_count,
    ut.period_start,
    ut.period_end
  FROM public.usage_tracking ut
  WHERE ut.user_id = p_user_id
    AND ut.period_start <= CURRENT_DATE
    AND ut.period_end >= CURRENT_DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

