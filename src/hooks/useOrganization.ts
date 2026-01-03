/**
 * @file useOrganization.ts
 * @description Hook for managing organizations (tenants) in multi-tenant architecture
 */
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

export type OrgRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  subscription_tier: string;
  subscription_status: string | null;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: OrgRole;
  joined_at: string;
  user?: {
    email: string;
    full_name?: string;
  };
}

export interface CreateOrgParams {
  name: string;
  slug?: string;
}

export interface InviteMemberParams {
  email: string;
  role: OrgRole;
}

export const useOrganization = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(null);

  // Fetch user's organizations
  const { data: organizations = [], isLoading: orgsLoading } = useQuery({
    queryKey: ['organizations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('organizations')
        .select(
          `
          *,
          organization_members!inner(role)
        `
        )
        .eq('organization_members.user_id', user.id);

      if (error) throw error;
      return data as (Organization & { organization_members: { role: OrgRole }[] })[];
    },
    enabled: !!user?.id,
  });

  // Fetch current organization details
  const { data: currentOrg, isLoading: currentOrgLoading } = useQuery({
    queryKey: ['organization', currentOrgId],
    queryFn: async () => {
      if (!currentOrgId) return null;

      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', currentOrgId)
        .single();

      if (error) throw error;
      return data as Organization;
    },
    enabled: !!currentOrgId,
  });

  // Fetch organization members
  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: ['organization-members', currentOrgId],
    queryFn: async () => {
      if (!currentOrgId) return [];

      const { data, error } = await supabase
        .from('organization_members')
        .select(
          `
          *,
          profiles:user_id(email, full_name)
        `
        )
        .eq('organization_id', currentOrgId);

      if (error) throw error;
      return data as OrganizationMember[];
    },
    enabled: !!currentOrgId,
  });

  // Create organization mutation
  const createOrgMutation = useMutation({
    mutationFn: async ({ name, slug }: CreateOrgParams) => {
      if (!user?.id) throw new Error('Not authenticated');

      const orgSlug =
        slug ||
        name
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');

      const { data, error } = await supabase
        .from('organizations')
        .insert({
          name,
          slug: orgSlug,
          owner_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Add owner as member
      await supabase.from('organization_members').insert({
        organization_id: data.id,
        user_id: user.id,
        role: 'owner',
      });

      return data as Organization;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      setCurrentOrgId(data.id);
      toast.success('Organization created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create organization: ${error.message}`);
    },
  });

  // Update organization mutation
  const updateOrgMutation = useMutation({
    mutationFn: async (updates: Partial<Organization> & { id: string }) => {
      const { id, ...rest } = updates;
      const { data, error } = await supabase
        .from('organizations')
        .update(rest)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Organization;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization', currentOrgId] });
      toast.success('Organization updated');
    },
  });

  // Get user's role in current organization
  const currentUserRole = useCallback((): OrgRole | null => {
    if (!currentOrgId || !user?.id) return null;
    const membership = organizations.find((o) => o.id === currentOrgId);
    return membership?.organization_members[0]?.role || null;
  }, [currentOrgId, user?.id, organizations]);

  // Check permissions
  const canManageMembers = useCallback(() => {
    const role = currentUserRole();
    return role === 'owner' || role === 'admin';
  }, [currentUserRole]);

  const canManageOrg = useCallback(() => {
    return currentUserRole() === 'owner';
  }, [currentUserRole]);

  // Set current org on initial load
  useEffect(() => {
    if (organizations.length > 0 && !currentOrgId) {
      setCurrentOrgId(organizations[0].id);
    }
  }, [organizations, currentOrgId]);

  return {
    organizations,
    currentOrg,
    currentOrgId,
    setCurrentOrgId,
    members,
    isLoading: orgsLoading || currentOrgLoading,
    membersLoading,
    createOrg: createOrgMutation.mutate,
    updateOrg: updateOrgMutation.mutate,
    currentUserRole,
    canManageMembers,
    canManageOrg,
  };
};
