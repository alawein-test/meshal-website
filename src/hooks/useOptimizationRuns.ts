import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/hooks/use-toast';
import type { Json } from '@/integrations/supabase/types';

/**
 * OptiLibria optimization run entity.
 *
 * Represents a single optimization algorithm run with configuration,
 * progress tracking, and results storage.
 *
 * @interface OptimizationRun
 */
export interface OptimizationRun {
  /** Unique identifier */
  id: string;
  /** Name of the optimization problem */
  problem_name: string;
  /** Algorithm used (e.g., 'genetic', 'gradient-descent', 'simulated-annealing') */
  algorithm: string;
  /** Current status: 'pending', 'running', 'completed', 'failed' */
  status: string | null;
  /** Number of iterations completed */
  iterations: number | null;
  /** Best objective score achieved */
  best_score: number | null;
  /** Algorithm configuration as JSON */
  config: Json | null;
  /** Optimization results as JSON (solution, history, etc.) */
  results: Json | null;
  /** When optimization started */
  started_at: string | null;
  /** When optimization completed */
  completed_at: string | null;
  /** Creation timestamp */
  created_at: string;
  /** Last update timestamp */
  updated_at: string;
  /** Owner's user ID */
  user_id: string;
}

/**
 * Input for creating a new optimization run.
 */
export interface CreateOptimizationInput {
  /** Name of the optimization problem */
  problem_name: string;
  /** Algorithm to use */
  algorithm: string;
  /** Optional configuration parameters */
  config?: Json;
}

/**
 * Input for updating an existing optimization run.
 */
export interface UpdateOptimizationInput {
  /** Run ID to update */
  id: string;
  /** New status */
  status?: string;
  /** Current iteration count */
  iterations?: number;
  /** Current best score */
  best_score?: number;
  /** Results data */
  results?: Json;
}

/**
 * Custom hook for managing OptiLibria optimization runs.
 *
 * Provides CRUD operations for mathematical optimization runs
 * with support for various algorithms including genetic algorithms,
 * gradient descent, and simulated annealing.
 * Requires authentication.
 *
 * @example
 * ```tsx
 * function OptimizationDashboard() {
 *   const { runs, createRun, isLoading } = useOptimizationRuns();
 *
 *   const startOptimization = () => {
 *     createRun.mutate({
 *       problem_name: 'Traveling Salesman',
 *       algorithm: 'genetic',
 *       config: {
 *         population_size: 100,
 *         mutation_rate: 0.01,
 *         generations: 500
 *       }
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={startOptimization}>Start Optimization</button>
 *       {runs.map(run => (
 *         <OptimizationCard
 *           key={run.id}
 *           run={run}
 *           onViewResults={() => showResults(run.results)}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns Optimization runs data and mutation functions
 */
export const useOptimizationRuns = () => {
  const { session } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    data: runs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['optimization-runs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('optilibria_runs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as OptimizationRun[];
    },
    enabled: !!session,
  });

  /**
   * Create a new optimization run.
   *
   * @example
   * ```tsx
   * createRun.mutate({
   *   problem_name: 'Function Minimization',
   *   algorithm: 'gradient-descent',
   *   config: { learning_rate: 0.01 }
   * });
   * ```
   */
  const createRun = useMutation({
    mutationFn: async (run: CreateOptimizationInput) => {
      const { data, error } = await supabase
        .from('optilibria_runs')
        .insert({
          problem_name: run.problem_name,
          algorithm: run.algorithm,
          config: run.config ?? {},
          user_id: session?.user?.id ?? '',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['optimization-runs'] });
      toast({
        title: 'Optimization started',
        description: 'Your optimization run has been queued.',
      });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  /**
   * Update an existing optimization run.
   *
   * @example
   * ```tsx
   * updateRun.mutate({
   *   id: 'run-123',
   *   status: 'completed',
   *   iterations: 500,
   *   best_score: 0.0012,
   *   results: { solution: [...], convergence: [...] }
   * });
   * ```
   */
  const updateRun = useMutation({
    mutationFn: async ({
      id,
      status,
      iterations,
      best_score,
      results,
    }: UpdateOptimizationInput) => {
      const { data, error } = await supabase
        .from('optilibria_runs')
        .update({ status, iterations, best_score, results })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['optimization-runs'] });
    },
  });

  /**
   * Delete an optimization run by ID.
   *
   * @example
   * ```tsx
   * deleteRun.mutate('run-123');
   * ```
   */
  const deleteRun = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('optilibria_runs').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['optimization-runs'] });
      toast({ title: 'Run deleted' });
    },
  });

  return {
    /** Array of user's optimization runs, sorted by creation date (newest first) */
    runs: runs ?? [],
    /** Whether runs are currently loading */
    isLoading,
    /** Error if query failed */
    error,
    /** Mutation for creating new optimization runs */
    createRun,
    /** Mutation for updating existing runs */
    updateRun,
    /** Mutation for deleting runs */
    deleteRun,
  };
};
