-- Multi-Tenant Architecture & Subscription System Migration
-- Adds organization/team support and subscription management

-- ============================================
-- ORGANIZATIONS (Tenants)
-- ============================================

CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Subscription fields
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'team', 'enterprise')),
  subscription_status TEXT DEFAULT NULL CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing', NULL)),
  subscription_id TEXT, -- Stripe subscription ID
  stripe_customer_id TEXT,
  subscription_period_end TIMESTAMPTZ,
  
  -- Settings
  settings JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORGANIZATION MEMBERS
-- ============================================

CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(organization_id, user_id)
);

-- ============================================
-- ADD SUBSCRIPTION FIELDS TO PROFILES
-- ============================================

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_status TEXT,
  ADD COLUMN IF NOT EXISTS subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS subscription_period_end TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS current_organization_id UUID REFERENCES public.organizations(id);

-- ============================================
-- ADD ORGANIZATION_ID TO PLATFORM TABLES
-- ============================================

-- SimCore Simulations
ALTER TABLE public.simcore_simulations 
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);

-- MEZAN Workflows  
ALTER TABLE public.mezan_workflows
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);

-- TalAI Experiments
ALTER TABLE public.talai_experiments
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);

-- OptiLibria Runs
ALTER TABLE public.optilibria_runs
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);

-- QMLab Experiments
ALTER TABLE public.qmlab_experiments
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_organizations_owner ON public.organizations(owner_id);
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON public.organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organization_members_org ON public.organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_user ON public.organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON public.profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_current_org ON public.profiles(current_organization_id);

-- Platform table indexes for organization queries
CREATE INDEX IF NOT EXISTS idx_simcore_org ON public.simcore_simulations(organization_id);
CREATE INDEX IF NOT EXISTS idx_mezan_org ON public.mezan_workflows(organization_id);
CREATE INDEX IF NOT EXISTS idx_talai_org ON public.talai_experiments(organization_id);
CREATE INDEX IF NOT EXISTS idx_optilibria_org ON public.optilibria_runs(organization_id);
CREATE INDEX IF NOT EXISTS idx_qmlab_org ON public.qmlab_experiments(organization_id);

-- ============================================
-- RLS POLICIES FOR ORGANIZATIONS
-- ============================================

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- Organizations: Users can see orgs they're members of
CREATE POLICY "Users can view their organizations" ON public.organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    )
    OR owner_id = auth.uid()
  );

-- Organizations: Only owners can update
CREATE POLICY "Owners can update organizations" ON public.organizations
  FOR UPDATE USING (owner_id = auth.uid());

-- Organizations: Any authenticated user can create
CREATE POLICY "Authenticated users can create organizations" ON public.organizations
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Organization Members: Members can see their org's members
CREATE POLICY "Members can view organization members" ON public.organization_members
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    )
  );

-- Organization Members: Admins and owners can manage members
CREATE POLICY "Admins can manage organization members" ON public.organization_members
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Get user's organizations
CREATE OR REPLACE FUNCTION get_user_organizations(p_user_id UUID)
RETURNS TABLE(organization_id UUID, role TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT om.organization_id, om.role
  FROM public.organization_members om
  WHERE om.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user has access to organization
CREATE OR REPLACE FUNCTION user_has_org_access(p_user_id UUID, p_org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE user_id = p_user_id AND organization_id = p_org_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

