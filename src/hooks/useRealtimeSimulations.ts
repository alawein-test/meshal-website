import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';

export const useRealtimeSimulations = () => {
  const queryClient = useQueryClient();
  const { session } = useAuthStore();

  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel('simcore-simulations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'simcore_simulations',
          filter: `user_id=eq.${session.user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['simulations'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, queryClient]);
};

export const useRealtimeExperiments = (table: 'qmlab_experiments' | 'talai_experiments') => {
  const queryClient = useQueryClient();
  const { session } = useAuthStore();
  const queryKey = table === 'qmlab_experiments' ? 'qm-experiments' : 'talai-experiments';

  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          filter: `user_id=eq.${session.user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, queryClient, table, queryKey]);
};

export const useRealtimeWorkflows = () => {
  const queryClient = useQueryClient();
  const { session } = useAuthStore();

  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel('mezan-workflows-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mezan_workflows',
          filter: `user_id=eq.${session.user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['workflows'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, queryClient]);
};

export const useRealtimeOptimizationRuns = () => {
  const queryClient = useQueryClient();
  const { session } = useAuthStore();

  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel('optilibria-runs-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'optilibria_runs',
          filter: `user_id=eq.${session.user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['optimization-runs'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, queryClient]);
};
