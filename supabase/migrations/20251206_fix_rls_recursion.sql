-- Fix RLS Policy Infinite Recursion on user_roles table
-- Drop the problematic recursive policy and replace with a function-based approach

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view team members" ON public.soc_user_roles;

-- Create a security definer function to safely check team membership
CREATE OR REPLACE FUNCTION public.user_is_in_team(_user_id UUID, _team_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.soc_user_roles
    WHERE user_id = _user_id AND team_id = _team_id
  )
$$;

-- Create new policy using the function to prevent recursion
CREATE POLICY "Users can view team members"
  ON public.soc_user_roles FOR SELECT
  USING (
    public.user_is_in_team(auth.uid(), team_id)
  );

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.user_is_in_team(UUID, UUID) TO anon, authenticated;
