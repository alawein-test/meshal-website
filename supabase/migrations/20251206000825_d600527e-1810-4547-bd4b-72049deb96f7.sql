-- AlaweinOS Projects Database Schema

-- Enum for project status
CREATE TYPE public.project_status AS ENUM ('active', 'development', 'beta', 'deprecated', 'archived');

-- Enum for project category
CREATE TYPE public.project_category AS ENUM (
  'scientific-computing',
  'enterprise-automation', 
  'ai-research',
  'optimization',
  'quantum-mechanics',
  'portfolio'
);

-- Projects table - core project metadata
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  tagline TEXT,
  version TEXT DEFAULT '1.0.0',
  status project_status DEFAULT 'development',
  category project_category NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Project features
CREATE TABLE public.project_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_enabled BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Project tech stack
CREATE TABLE public.project_tech_stack (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL, -- 'frontend', 'backend', 'infrastructure', 'database'
  technology TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User project preferences (per-user settings for each project)
CREATE TABLE public.user_project_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  theme_variant TEXT DEFAULT 'default',
  sidebar_collapsed BOOLEAN DEFAULT false,
  notifications_enabled BOOLEAN DEFAULT true,
  last_visited_at TIMESTAMPTZ,
  custom_settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, project_id)
);

-- Platform-specific data: SimCore simulations
CREATE TABLE public.simcore_simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  simulation_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  progress INTEGER DEFAULT 0,
  config JSONB DEFAULT '{}',
  results JSONB,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Platform-specific data: MEZAN workflows
CREATE TABLE public.mezan_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft',
  workflow_definition JSONB NOT NULL DEFAULT '{}',
  execution_count INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 0,
  last_executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Platform-specific data: TalAI experiments
CREATE TABLE public.talai_experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  model_type TEXT,
  status TEXT DEFAULT 'pending',
  progress INTEGER DEFAULT 0,
  hyperparameters JSONB DEFAULT '{}',
  metrics JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Platform-specific data: OptiLibria optimization runs
CREATE TABLE public.optilibria_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  problem_name TEXT NOT NULL,
  algorithm TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  best_score DECIMAL,
  iterations INTEGER DEFAULT 0,
  config JSONB DEFAULT '{}',
  results JSONB,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Platform-specific data: QMLab quantum experiments
CREATE TABLE public.qmlab_experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  quantum_system TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  particle_count INTEGER DEFAULT 0,
  wave_function_data JSONB,
  measurement_results JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tech_stack ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_project_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simcore_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mezan_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talai_experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.optilibria_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qmlab_experiments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects (public projects viewable by all, owned projects manageable)
CREATE POLICY "Public projects are viewable by everyone"
  ON public.projects FOR SELECT
  USING (is_public = true);

CREATE POLICY "Owners can manage their projects"
  ON public.projects FOR ALL
  USING (auth.uid() = owner_id);

-- RLS Policies for project features (readable if project is public or owned)
CREATE POLICY "Project features viewable with project access"
  ON public.project_features FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = project_id 
      AND (p.is_public = true OR p.owner_id = auth.uid())
    )
  );

CREATE POLICY "Owners can manage project features"
  ON public.project_features FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = project_id AND p.owner_id = auth.uid()
    )
  );

-- RLS Policies for tech stack
CREATE POLICY "Tech stack viewable with project access"
  ON public.project_tech_stack FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = project_id 
      AND (p.is_public = true OR p.owner_id = auth.uid())
    )
  );

CREATE POLICY "Owners can manage tech stack"
  ON public.project_tech_stack FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = project_id AND p.owner_id = auth.uid()
    )
  );

-- RLS Policies for user preferences (users can only access their own)
CREATE POLICY "Users can view own preferences"
  ON public.user_project_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON public.user_project_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON public.user_project_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences"
  ON public.user_project_preferences FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for SimCore simulations
CREATE POLICY "Users can view own simulations"
  ON public.simcore_simulations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own simulations"
  ON public.simcore_simulations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own simulations"
  ON public.simcore_simulations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own simulations"
  ON public.simcore_simulations FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for MEZAN workflows
CREATE POLICY "Users can view own workflows"
  ON public.mezan_workflows FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workflows"
  ON public.mezan_workflows FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workflows"
  ON public.mezan_workflows FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workflows"
  ON public.mezan_workflows FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for TalAI experiments
CREATE POLICY "Users can view own AI experiments"
  ON public.talai_experiments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI experiments"
  ON public.talai_experiments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own AI experiments"
  ON public.talai_experiments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own AI experiments"
  ON public.talai_experiments FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for OptiLibria runs
CREATE POLICY "Users can view own optimization runs"
  ON public.optilibria_runs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own optimization runs"
  ON public.optilibria_runs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own optimization runs"
  ON public.optilibria_runs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own optimization runs"
  ON public.optilibria_runs FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for QMLab experiments
CREATE POLICY "Users can view own quantum experiments"
  ON public.qmlab_experiments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quantum experiments"
  ON public.qmlab_experiments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quantum experiments"
  ON public.qmlab_experiments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own quantum experiments"
  ON public.qmlab_experiments FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at timestamps
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER set_timestamp_projects
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER set_timestamp_user_preferences
  BEFORE UPDATE ON public.user_project_preferences
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER set_timestamp_simcore
  BEFORE UPDATE ON public.simcore_simulations
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER set_timestamp_mezan
  BEFORE UPDATE ON public.mezan_workflows
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER set_timestamp_talai
  BEFORE UPDATE ON public.talai_experiments
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER set_timestamp_optilibria
  BEFORE UPDATE ON public.optilibria_runs
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER set_timestamp_qmlab
  BEFORE UPDATE ON public.qmlab_experiments
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

-- Create indexes for better performance
CREATE INDEX idx_projects_slug ON public.projects(slug);
CREATE INDEX idx_projects_category ON public.projects(category);
CREATE INDEX idx_projects_owner ON public.projects(owner_id);
CREATE INDEX idx_user_prefs_user ON public.user_project_preferences(user_id);
CREATE INDEX idx_simcore_user ON public.simcore_simulations(user_id);
CREATE INDEX idx_mezan_user ON public.mezan_workflows(user_id);
CREATE INDEX idx_talai_user ON public.talai_experiments(user_id);
CREATE INDEX idx_optilibria_user ON public.optilibria_runs(user_id);
CREATE INDEX idx_qmlab_user ON public.qmlab_experiments(user_id);