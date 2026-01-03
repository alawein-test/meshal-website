-- Create role enum
CREATE TYPE public.soc_role AS ENUM ('viewer', 'analyst', 'admin', 'owner');

-- Create teams table
CREATE TABLE public.soc_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user roles table
CREATE TABLE public.soc_user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  team_id UUID REFERENCES public.soc_teams(id) ON DELETE CASCADE NOT NULL,
  role soc_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, team_id)
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.soc_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soc_user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents recursion)
CREATE OR REPLACE FUNCTION public.has_soc_role(_user_id UUID, _role soc_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.soc_user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to get user's team
CREATE OR REPLACE FUNCTION public.get_user_team_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT team_id FROM public.soc_user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS policies for teams (users can see their team)
CREATE POLICY "Users can view their team" ON public.soc_teams
  FOR SELECT USING (
    id IN (SELECT team_id FROM public.soc_user_roles WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can manage teams" ON public.soc_teams
  FOR ALL USING (public.has_soc_role(auth.uid(), 'admin') OR public.has_soc_role(auth.uid(), 'owner'));

-- RLS policies for user roles
CREATE POLICY "Users can view team members" ON public.soc_user_roles
  FOR SELECT USING (
    team_id IN (SELECT team_id FROM public.soc_user_roles WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can manage user roles" ON public.soc_user_roles
  FOR ALL USING (public.has_soc_role(auth.uid(), 'admin') OR public.has_soc_role(auth.uid(), 'owner'));

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.soc_teams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();