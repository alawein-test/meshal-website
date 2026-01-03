-- Unified Scanner & Research System Tables

-- Scan results table
CREATE TABLE IF NOT EXISTS public.scan_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('url', 'code', 'document', 'api')),
  source TEXT NOT NULL,
  findings JSONB NOT NULL DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'scanning', 'completed', 'error')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  INDEX idx_scan_results_type (type),
  INDEX idx_scan_results_created (created_at)
);

-- Research results table
CREATE TABLE IF NOT EXISTS public.research_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  sources TEXT[] DEFAULT '{}',
  summary TEXT,
  insights TEXT[] DEFAULT '{}',
  confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  INDEX idx_research_results_query (query),
  INDEX idx_research_results_created (created_at)
);

-- Unified analysis cache
CREATE TABLE IF NOT EXISTS public.unified_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_type TEXT NOT NULL, -- 'cross-platform', 'performance', 'security', etc.
  tools TEXT[] DEFAULT '{}',
  metrics JSONB DEFAULT '{}',
  insights TEXT[] DEFAULT '{}',
  cache_key TEXT UNIQUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_unified_analysis_type (analysis_type),
  INDEX idx_unified_analysis_cache (cache_key)
);

-- Row Level Security
ALTER TABLE public.scan_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unified_analysis ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own scans
CREATE POLICY "Users can create scans"
  ON public.scan_results
  FOR INSERT
  WITH CHECK (auth.uid() = created_by OR created_by IS NULL);

-- Policy: Users can view their own scans
CREATE POLICY "Users can view own scans"
  ON public.scan_results
  FOR SELECT
  USING (auth.uid() = created_by OR created_by IS NULL);

-- Policy: Users can create research
CREATE POLICY "Users can create research"
  ON public.research_results
  FOR INSERT
  WITH CHECK (auth.uid() = created_by OR created_by IS NULL);

-- Policy: Users can view their own research
CREATE POLICY "Users can view own research"
  ON public.research_results
  FOR SELECT
  USING (auth.uid() = created_by OR created_by IS NULL);

-- Policy: Analysis cache is readable by all authenticated users
CREATE POLICY "Authenticated users can read analysis"
  ON public.unified_analysis
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Policy: Only admins can insert analysis
CREATE POLICY "Admins can create analysis"
  ON public.unified_analysis
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );
