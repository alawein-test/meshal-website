-- Waitlist System Migration
-- Creates tables for managing waitlists across all projects

-- Waitlist entries table
CREATE TABLE IF NOT EXISTS public.waitlist_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  project_id TEXT NOT NULL,
  product_id TEXT, -- Optional: for specific products (e.g., TalAI products)
  position INTEGER, -- Queue position (calculated)
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'invited', 'converted', 'declined')),
  metadata JSONB DEFAULT '{}', -- Additional info: research field, use case, etc.
  referral_code TEXT, -- For referral tracking
  referred_by UUID REFERENCES public.waitlist_entries(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  invited_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,
  
  -- Ensure unique email per project/product
  UNIQUE(email, project_id, product_id)
);

-- Waitlist analytics table
CREATE TABLE IF NOT EXISTS public.waitlist_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT NOT NULL,
  product_id TEXT,
  date DATE NOT NULL,
  signups INTEGER DEFAULT 0,
  invites_sent INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(project_id, product_id, date)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_waitlist_entries_project ON public.waitlist_entries(project_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_entries_product ON public.waitlist_entries(product_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_entries_status ON public.waitlist_entries(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_entries_position ON public.waitlist_entries(project_id, position);
CREATE INDEX IF NOT EXISTS idx_waitlist_analytics_project_date ON public.waitlist_analytics(project_id, date);

-- Function to calculate waitlist position
CREATE OR REPLACE FUNCTION calculate_waitlist_position(
  p_project_id TEXT,
  p_product_id TEXT DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
  v_position INTEGER;
BEGIN
  SELECT COALESCE(MAX(position), 0) + 1
  INTO v_position
  FROM public.waitlist_entries
  WHERE project_id = p_project_id
    AND (product_id = p_product_id OR (product_id IS NULL AND p_product_id IS NULL))
    AND status = 'waiting';
  
  RETURN v_position;
END;
$$ LANGUAGE plpgsql;

-- Function to update waitlist position when someone converts
CREATE OR REPLACE FUNCTION update_waitlist_positions()
RETURNS TRIGGER AS $$
BEGIN
  -- When someone converts, update positions for others in the same project/product
  IF NEW.status = 'converted' AND OLD.status != 'converted' THEN
    UPDATE public.waitlist_entries
    SET position = position - 1,
        updated_at = NOW()
    WHERE project_id = NEW.project_id
      AND (product_id = NEW.product_id OR (product_id IS NULL AND NEW.product_id IS NULL))
      AND position > NEW.position
      AND status = 'waiting';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update positions
CREATE TRIGGER update_waitlist_positions_trigger
  AFTER UPDATE OF status ON public.waitlist_entries
  FOR EACH ROW
  WHEN (NEW.status = 'converted')
  EXECUTE FUNCTION update_waitlist_positions();

-- Function to get waitlist stats
CREATE OR REPLACE FUNCTION get_waitlist_stats(
  p_project_id TEXT,
  p_product_id TEXT DEFAULT NULL
) RETURNS TABLE (
  total_waiting INTEGER,
  total_invited INTEGER,
  total_converted INTEGER,
  next_position INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) FILTER (WHERE status = 'waiting')::INTEGER as total_waiting,
    COUNT(*) FILTER (WHERE status = 'invited')::INTEGER as total_invited,
    COUNT(*) FILTER (WHERE status = 'converted')::INTEGER as total_converted,
    COALESCE(MAX(position) FILTER (WHERE status = 'waiting'), 0)::INTEGER + 1 as next_position
  FROM public.waitlist_entries
  WHERE project_id = p_project_id
    AND (product_id = p_product_id OR (product_id IS NULL AND p_product_id IS NULL));
END;
$$ LANGUAGE plpgsql;

-- Function to increment waitlist signups (for analytics)
CREATE OR REPLACE FUNCTION increment_waitlist_signups(
  p_project_id TEXT,
  p_product_id TEXT DEFAULT NULL
) RETURNS void AS $$
BEGIN
  INSERT INTO public.waitlist_analytics (project_id, product_id, date, signups)
  VALUES (p_project_id, p_product_id, CURRENT_DATE, 1)
  ON CONFLICT (project_id, product_id, date)
  DO UPDATE SET signups = waitlist_analytics.signups + 1;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security Policies
ALTER TABLE public.waitlist_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist_analytics ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (join waitlist)
CREATE POLICY "Anyone can join waitlist"
  ON public.waitlist_entries
  FOR INSERT
  WITH CHECK (true);

-- Policy: Users can view their own waitlist entries
CREATE POLICY "Users can view own waitlist entry"
  ON public.waitlist_entries
  FOR SELECT
  USING (true); -- Public read for position checking

-- Policy: Only authenticated admins can update
CREATE POLICY "Admins can update waitlist"
  ON public.waitlist_entries
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Policy: Analytics are readable by all (public stats)
CREATE POLICY "Analytics are public"
  ON public.waitlist_analytics
  FOR SELECT
  USING (true);

-- Policy: Only admins can insert analytics
CREATE POLICY "Admins can insert analytics"
  ON public.waitlist_analytics
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_waitlist_entries_updated_at
  BEFORE UPDATE ON public.waitlist_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
