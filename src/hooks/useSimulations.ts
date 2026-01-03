import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/hooks/use-toast';
import type { Json } from '@/integrations/supabase/types';

/**
 * Simulation entity representing a SimCore simulation run.
 *
 * @interface Simulation
 */
export interface Simulation {
  /** Unique identifier */
  id: string;
  /** Display name for the simulation */
  name: string;
  /** Type of simulation (e.g., 'particle', 'fluid', 'orbital') */
  simulation_type: string;
  /** Current status: 'pending', 'running', 'completed', 'failed' */
  status: string | null;
  /** Progress percentage (0-100) */
  progress: number | null;
  /** Configuration parameters as JSON */
  config: Json | null;
  /** Results data as JSON */
  results: Json | null;
  /** When the simulation started */
  started_at: string | null;
  /** When the simulation completed */
  completed_at: string | null;
  /** Creation timestamp */
  created_at: string;
  /** Last update timestamp */
  updated_at: string;
  /** Owner's user ID */
  user_id: string;
}

/**
 * Input for creating a new simulation.
 */
export interface CreateSimulationInput {
  /** Display name for the simulation */
  name: string;
  /** Type of simulation */
  simulation_type: string;
  /** Optional configuration parameters */
  config?: Json;
}

/**
 * Input for updating an existing simulation.
 */
export interface UpdateSimulationInput {
  /** Simulation ID to update */
  id: string;
  /** New status */
  status?: string;
  /** New progress value */
  progress?: number;
  /** Results data */
  results?: Json;
}

/**
 * Custom hook for managing SimCore simulations.
 *
 * Provides CRUD operations for physics simulations with automatic
 * cache invalidation and toast notifications. Requires authentication.
 *
 * @example
 * ```tsx
 * function SimulationDashboard() {
 *   const {
 *     simulations,
 *     isLoading,
 *     createSimulation,
 *     deleteSimulation
 *   } = useSimulations();
 *
 *   const handleCreate = () => {
 *     createSimulation.mutate({
 *       name: 'Particle Physics Sim',
 *       simulation_type: 'particle',
 *       config: { particles: 1000, gravity: 9.8 }
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       {simulations.map(sim => (
 *         <SimulationCard
 *           key={sim.id}
 *           simulation={sim}
 *           onDelete={() => deleteSimulation.mutate(sim.id)}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns Simulations data and mutation functions
 */
export const useSimulations = () => {
  const { session } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    data: simulations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['simulations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('simcore_simulations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Simulation[];
    },
    enabled: !!session,
  });

  /**
   * Create a new simulation.
   *
   * @example
   * ```tsx
   * createSimulation.mutate({
   *   name: 'My Simulation',
   *   simulation_type: 'particle'
   * });
   * ```
   */
  const createSimulation = useMutation({
    mutationFn: async (simulation: CreateSimulationInput) => {
      const { data, error } = await supabase
        .from('simcore_simulations')
        .insert({
          name: simulation.name,
          simulation_type: simulation.simulation_type,
          config: simulation.config ?? {},
          user_id: session?.user?.id ?? '',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulations'] });
      toast({ title: 'Simulation created', description: 'Your simulation has been queued.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  /**
   * Update an existing simulation.
   *
   * @example
   * ```tsx
   * updateSimulation.mutate({
   *   id: 'sim-123',
   *   status: 'completed',
   *   progress: 100,
   *   results: { data: [...] }
   * });
   * ```
   */
  const updateSimulation = useMutation({
    mutationFn: async ({ id, status, progress, results }: UpdateSimulationInput) => {
      const { data, error } = await supabase
        .from('simcore_simulations')
        .update({ status, progress, results })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulations'] });
    },
  });

  /**
   * Delete a simulation by ID.
   *
   * @example
   * ```tsx
   * deleteSimulation.mutate('sim-123');
   * ```
   */
  const deleteSimulation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('simcore_simulations').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulations'] });
      toast({ title: 'Simulation deleted' });
    },
  });

  return {
    /** Array of user's simulations, sorted by creation date (newest first) */
    simulations: simulations ?? [],
    /** Whether simulations are currently loading */
    isLoading,
    /** Error if query failed */
    error,
    /** Mutation for creating new simulations */
    createSimulation,
    /** Mutation for updating existing simulations */
    updateSimulation,
    /** Mutation for deleting simulations */
    deleteSimulation,
  };
};
