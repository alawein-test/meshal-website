import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WaitlistMetadata {
  [key: string]: string | number | boolean | null | undefined;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  project_id: string;
  product_id?: string;
  position: number;
  status: 'waiting' | 'invited' | 'converted' | 'declined';
  metadata?: WaitlistMetadata;
  referral_code?: string;
  referred_by?: string;
  created_at: string;
}

export interface WaitlistStats {
  total_waiting: number;
  total_invited: number;
  total_converted: number;
  next_position: number;
}

export interface JoinWaitlistParams {
  email: string;
  projectId: string;
  productId?: string;
  metadata?: WaitlistMetadata;
  referralCode?: string;
}

export function useWaitlist() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinWaitlist = async (params: JoinWaitlistParams): Promise<WaitlistEntry | null> => {
    setLoading(true);
    setError(null);

    try {
      // First, check if email already exists for this project/product
      const { data: existing } = await supabase
        .from('waitlist_entries')
        .select('id, position, status')
        .eq('email', params.email)
        .eq('project_id', params.projectId)
        .eq('product_id', params.productId || null)
        .single();

      if (existing) {
        toast.info(`You're already on the waitlist! Position: #${existing.position}`);
        return existing as WaitlistEntry;
      }

      // Calculate position
      const { data: positionData } = await supabase.rpc('calculate_waitlist_position', {
        p_project_id: params.projectId,
        p_product_id: params.productId || null,
      });

      const position = positionData || 1;

      // Insert new waitlist entry
      const { data, error: insertError } = await supabase
        .from('waitlist_entries')
        .insert({
          email: params.email,
          project_id: params.projectId,
          product_id: params.productId || null,
          position,
          metadata: params.metadata || {},
          referral_code: params.referralCode,
          status: 'waiting',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Update analytics
      await supabase.rpc('increment_waitlist_signups', {
        p_project_id: params.projectId,
        p_product_id: params.productId || null,
      });

      toast.success(`You're on the waitlist! Position: #${position}`);

      // In production, send welcome email
      // await sendWaitlistWelcome(params.email, position, params.projectId);

      return data as WaitlistEntry;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join waitlist';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getWaitlistStats = async (
    projectId: string,
    productId?: string
  ): Promise<WaitlistStats | null> => {
    try {
      const { data, error } = await supabase.rpc('get_waitlist_stats', {
        p_project_id: projectId,
        p_product_id: productId || null,
      });

      if (error) throw error;
      return data as WaitlistStats;
    } catch (err) {
      console.error('Failed to get waitlist stats:', err);
      return null;
    }
  };

  const checkPosition = async (
    email: string,
    projectId: string,
    productId?: string
  ): Promise<number | null> => {
    try {
      const { data, error } = await supabase
        .from('waitlist_entries')
        .select('position')
        .eq('email', email)
        .eq('project_id', projectId)
        .eq('product_id', productId || null)
        .single();

      if (error) throw error;
      return data?.position || null;
    } catch (err) {
      console.error('Failed to check position:', err);
      return null;
    }
  };

  return {
    joinWaitlist,
    getWaitlistStats,
    checkPosition,
    loading,
    error,
  };
}
