-- Visitor Tracking System
-- Tracks user behaviors, preferences, and search history
-- Excludes specific IPs and prevents double-counting

-- Visitor sessions table
CREATE TABLE IF NOT EXISTS public.visitor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL, -- Fingerprint-based ID
  ip_address TEXT, -- For exclusion, not stored long-term
  user_agent TEXT,
  referrer TEXT,
  first_seen TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  session_count INTEGER DEFAULT 1,
  total_duration INTEGER DEFAULT 0, -- seconds
  pages_visited INTEGER DEFAULT 1,
  
  -- Device info
  device_type TEXT, -- 'desktop', 'mobile', 'tablet'
  browser TEXT,
  os TEXT,
  screen_resolution TEXT,
  
  -- Preferences
  preferred_theme TEXT,
  preferred_language TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  UNIQUE(visitor_id)
);

-- Page views table
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL REFERENCES public.visitor_sessions(visitor_id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.visitor_sessions(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  query_params JSONB DEFAULT '{}',
  title TEXT,
  referrer TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  duration INTEGER, -- seconds spent on page
  scroll_depth INTEGER, -- percentage
  interactions JSONB DEFAULT '[]', -- clicks, form interactions, etc.
  
  INDEX idx_page_views_visitor (visitor_id),
  INDEX idx_page_views_path (path),
  INDEX idx_page_views_timestamp (timestamp)
);

-- Search history table
CREATE TABLE IF NOT EXISTS public.search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL REFERENCES public.visitor_sessions(visitor_id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  filters JSONB DEFAULT '{}',
  results_count INTEGER,
  clicked_results JSONB DEFAULT '[]',
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_search_visitor (visitor_id),
  INDEX idx_search_timestamp (timestamp)
);

-- User behaviors table
CREATE TABLE IF NOT EXISTS public.user_behaviors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL REFERENCES public.visitor_sessions(visitor_id) ON DELETE CASCADE,
  behavior_type TEXT NOT NULL, -- 'click', 'hover', 'scroll', 'form_submit', 'download', etc.
  element_type TEXT, -- 'button', 'link', 'form', etc.
  element_id TEXT,
  element_text TEXT,
  page_path TEXT,
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_behaviors_visitor (visitor_id),
  INDEX idx_behaviors_type (behavior_type),
  INDEX idx_behaviors_timestamp (timestamp)
);

-- Preferences table
CREATE TABLE IF NOT EXISTS public.visitor_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL REFERENCES public.visitor_sessions(visitor_id) ON DELETE CASCADE,
  preference_key TEXT NOT NULL,
  preference_value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(visitor_id, preference_key)
);

-- Function to get or create visitor session
CREATE OR REPLACE FUNCTION get_or_create_visitor(
  p_visitor_id TEXT,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_referrer TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_session_id UUID;
  v_excluded_ips TEXT[] := ARRAY[
    -- Add your IP addresses here to exclude
    '127.0.0.1',
    '::1',
    -- Add your actual IP addresses here
    -- Example: '192.168.1.1', 'your.actual.ip.address'
  ];
BEGIN
  -- Skip if IP is in exclusion list
  IF p_ip_address = ANY(v_excluded_ips) THEN
    RETURN NULL;
  END IF;

  -- Get or create visitor session
  INSERT INTO public.visitor_sessions (
    visitor_id,
    ip_address,
    user_agent,
    referrer,
    first_seen,
    last_seen
  )
  VALUES (
    p_visitor_id,
    p_ip_address,
    p_user_agent,
    p_referrer,
    NOW(),
    NOW()
  )
  ON CONFLICT (visitor_id) DO UPDATE SET
    last_seen = NOW(),
    session_count = visitor_sessions.session_count + 1,
    pages_visited = visitor_sessions.pages_visited + 1
  RETURNING id INTO v_session_id;

  RETURN v_session_id;
END;
$$ LANGUAGE plpgsql;

-- Function to track page view
CREATE OR REPLACE FUNCTION track_page_view(
  p_visitor_id TEXT,
  p_path TEXT,
  p_title TEXT DEFAULT NULL,
  p_referrer TEXT DEFAULT NULL,
  p_query_params JSONB DEFAULT '{}'::jsonb
) RETURNS UUID AS $$
DECLARE
  v_session_id UUID;
  v_view_id UUID;
BEGIN
  -- Get or create session
  SELECT id INTO v_session_id
  FROM public.visitor_sessions
  WHERE visitor_id = p_visitor_id
  ORDER BY last_seen DESC
  LIMIT 1;

  IF v_session_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Insert page view
  INSERT INTO public.page_views (
    visitor_id,
    session_id,
    path,
    title,
    referrer,
    query_params,
    timestamp
  )
  VALUES (
    p_visitor_id,
    v_session_id,
    p_path,
    p_title,
    p_referrer,
    p_query_params,
    NOW()
  )
  RETURNING id INTO v_view_id;

  -- Update session last_seen
  UPDATE public.visitor_sessions
  SET last_seen = NOW()
  WHERE id = v_session_id;

  RETURN v_view_id;
END;
$$ LANGUAGE plpgsql;

-- Function to track search
CREATE OR REPLACE FUNCTION track_search(
  p_visitor_id TEXT,
  p_query TEXT,
  p_filters JSONB DEFAULT '{}'::jsonb,
  p_results_count INTEGER DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_search_id UUID;
BEGIN
  INSERT INTO public.search_history (
    visitor_id,
    query,
    filters,
    results_count,
    timestamp
  )
  VALUES (
    p_visitor_id,
    p_query,
    p_filters,
    p_results_count,
    NOW()
  )
  RETURNING id INTO v_search_id;

  RETURN v_search_id;
END;
$$ LANGUAGE plpgsql;

-- Function to track behavior
CREATE OR REPLACE FUNCTION track_behavior(
  p_visitor_id TEXT,
  p_behavior_type TEXT,
  p_element_type TEXT DEFAULT NULL,
  p_element_id TEXT DEFAULT NULL,
  p_element_text TEXT DEFAULT NULL,
  p_page_path TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
) RETURNS UUID AS $$
DECLARE
  v_behavior_id UUID;
BEGIN
  INSERT INTO public.user_behaviors (
    visitor_id,
    behavior_type,
    element_type,
    element_id,
    element_text,
    page_path,
    metadata,
    timestamp
  )
  VALUES (
    p_visitor_id,
    p_behavior_type,
    p_element_type,
    p_element_id,
    p_element_text,
    p_page_path,
    p_metadata,
    NOW()
  )
  RETURNING id INTO v_behavior_id;

  RETURN v_behavior_id;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security
ALTER TABLE public.visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_behaviors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_preferences ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (tracking)
CREATE POLICY "Anyone can track visits"
  ON public.visitor_sessions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can track page views"
  ON public.page_views
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can track searches"
  ON public.search_history
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can track behaviors"
  ON public.user_behaviors
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can track preferences"
  ON public.visitor_preferences
  FOR INSERT
  WITH CHECK (true);

-- Policy: Only admins can read
CREATE POLICY "Admins can view visitor data"
  ON public.visitor_sessions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can view page views"
  ON public.page_views
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can view search history"
  ON public.search_history
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can view behaviors"
  ON public.user_behaviors
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Auto-cleanup old data (optional, can be run via cron)
CREATE OR REPLACE FUNCTION cleanup_old_visitor_data()
RETURNS void AS $$
BEGIN
  -- Delete sessions older than 1 year
  DELETE FROM public.visitor_sessions
  WHERE last_seen < NOW() - INTERVAL '1 year';
  
  -- Delete page views older than 6 months
  DELETE FROM public.page_views
  WHERE timestamp < NOW() - INTERVAL '6 months';
  
  -- Delete behaviors older than 6 months
  DELETE FROM public.user_behaviors
  WHERE timestamp < NOW() - INTERVAL '6 months';
END;
$$ LANGUAGE plpgsql;
