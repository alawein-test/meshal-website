/**
 * @file useApiKeys.ts
 * @description Hook for managing API keys for developer access
 */
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

export type ApiKeyScope = 'read' | 'write' | 'delete' | 'admin';

export interface ApiKey {
  id: string;
  user_id: string;
  organization_id: string | null;
  name: string;
  key_prefix: string;
  scopes: ApiKeyScope[];
  rate_limit_per_minute: number;
  rate_limit_per_day: number;
  last_used_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface ApiKeyUsageStats {
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  avg_response_time: number;
  requests_by_day: { date: string; count: number }[];
}

export interface CreateApiKeyParams {
  name: string;
  scopes?: ApiKeyScope[];
  expiresInDays?: number;
  organizationId?: string;
}

/**
 * Generate a secure API key
 * Format: alw_sk_<32 random chars>
 */
function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomPart = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((byte) => chars[byte % chars.length])
    .join('');
  return `alw_sk_${randomPart}`;
}

/**
 * Hash an API key using SHA-256
 */
async function hashApiKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function useApiKeys() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [newKey, setNewKey] = useState<string | null>(null);

  // Fetch all API keys for current user
  const {
    data: apiKeys = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['api-keys', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ApiKey[];
    },
    enabled: !!user?.id,
  });

  // Create new API key
  const createKey = useMutation({
    mutationFn: async (params: CreateApiKeyParams) => {
      if (!user?.id) throw new Error('Not authenticated');

      const fullKey = generateApiKey();
      const keyHash = await hashApiKey(fullKey);
      const keyPrefix = fullKey.substring(0, 8);

      const expiresAt = params.expiresInDays
        ? new Date(Date.now() + params.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
        : null;

      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          user_id: user.id,
          organization_id: params.organizationId || null,
          name: params.name,
          key_prefix: keyPrefix,
          key_hash: keyHash,
          scopes: params.scopes || ['read'],
          expires_at: expiresAt,
        })
        .select()
        .single();

      if (error) throw error;

      // Return both the record and the full key (only shown once)
      return { record: data, fullKey };
    },
    onSuccess: ({ record, fullKey }) => {
      setNewKey(fullKey);
      queryClient.invalidateQueries({ queryKey: ['api-keys', user?.id] });
      toast.success('API key created successfully');
    },
    onError: (error) => {
      console.error('Failed to create API key:', error);
      toast.error('Failed to create API key');
    },
  });

  // Revoke (deactivate) API key
  const revokeKey = useMutation({
    mutationFn: async (keyId: string) => {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: false })
        .eq('id', keyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys', user?.id] });
      toast.success('API key revoked');
    },
    onError: () => {
      toast.error('Failed to revoke API key');
    },
  });

  // Delete API key permanently
  const deleteKey = useMutation({
    mutationFn: async (keyId: string) => {
      const { error } = await supabase.from('api_keys').delete().eq('id', keyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys', user?.id] });
      toast.success('API key deleted');
    },
    onError: () => {
      toast.error('Failed to delete API key');
    },
  });

  // Clear the newly created key (after user has copied it)
  const clearNewKey = useCallback(() => {
    setNewKey(null);
  }, []);

  return {
    apiKeys,
    isLoading,
    error,
    newKey,
    createKey: createKey.mutate,
    revokeKey: revokeKey.mutate,
    deleteKey: deleteKey.mutate,
    clearNewKey,
    isCreating: createKey.isPending,
    isRevoking: revokeKey.isPending,
    isDeleting: deleteKey.isPending,
  };
}

export default useApiKeys;
