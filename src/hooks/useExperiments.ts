import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/hooks/use-toast';
import type { Json } from '@/integrations/supabase/types';

/**
 * QMLab experiment entity for quantum mechanics simulations.
 *
 * @interface QMExperiment
 */
export interface QMExperiment {
  /** Unique identifier */
  id: string;
  /** Display name for the experiment */
  name: string;
  /** Quantum system type (e.g., 'hydrogen', 'harmonic-oscillator') */
  quantum_system: string;
  /** Current status: 'pending', 'running', 'completed', 'failed' */
  status: string | null;
  /** Number of particles in the simulation */
  particle_count: number | null;
  /** Wave function data as JSON */
  wave_function_data: Json | null;
  /** Measurement results as JSON */
  measurement_results: Json | null;
  /** Creation timestamp */
  created_at: string;
  /** Last update timestamp */
  updated_at: string;
  /** Owner's user ID */
  user_id: string;
}

/**
 * TalAI experiment entity for machine learning experiments.
 *
 * @interface TalAIExperiment
 */
export interface TalAIExperiment {
  /** Unique identifier */
  id: string;
  /** Display name for the experiment */
  name: string;
  /** Model architecture type (e.g., 'transformer', 'cnn', 'rnn') */
  model_type: string | null;
  /** Current status: 'pending', 'training', 'completed', 'failed' */
  status: string | null;
  /** Training progress percentage (0-100) */
  progress: number | null;
  /** Hyperparameters as JSON */
  hyperparameters: Json | null;
  /** Training metrics as JSON (loss, accuracy, etc.) */
  metrics: Json | null;
  /** When training started */
  started_at: string | null;
  /** When training completed */
  completed_at: string | null;
  /** Creation timestamp */
  created_at: string;
  /** Last update timestamp */
  updated_at: string;
  /** Owner's user ID */
  user_id: string;
}

/**
 * Custom hook for managing QMLab quantum experiments.
 *
 * Provides CRUD operations for quantum mechanics experiments
 * with wave function visualization and measurement tracking.
 * Requires authentication.
 *
 * @example
 * ```tsx
 * function QuantumLab() {
 *   const { experiments, createExperiment, isLoading } = useQMExperiments();
 *
 *   const runHydrogenSim = () => {
 *     createExperiment.mutate({
 *       name: 'Hydrogen Atom Ground State',
 *       quantum_system: 'hydrogen',
 *       particle_count: 1
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={runHydrogenSim}>New Experiment</button>
 *       {experiments.map(exp => (
 *         <ExperimentCard key={exp.id} experiment={exp} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns QM experiments data and mutation functions
 */
export const useQMExperiments = () => {
  const { session } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    data: experiments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['qm-experiments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('qmlab_experiments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as QMExperiment[];
    },
    enabled: !!session,
  });

  /**
   * Create a new quantum experiment.
   */
  const createExperiment = useMutation({
    mutationFn: async (experiment: {
      name: string;
      quantum_system: string;
      particle_count?: number;
    }) => {
      const { data, error } = await supabase
        .from('qmlab_experiments')
        .insert({
          name: experiment.name,
          quantum_system: experiment.quantum_system,
          particle_count: experiment.particle_count ?? 0,
          user_id: session?.user?.id ?? '',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qm-experiments'] });
      toast({ title: 'Experiment created', description: 'Your quantum experiment is ready.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  /**
   * Delete a quantum experiment by ID.
   */
  const deleteExperiment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('qmlab_experiments').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qm-experiments'] });
      toast({ title: 'Experiment deleted' });
    },
  });

  return {
    /** Array of user's QM experiments */
    experiments: experiments ?? [],
    /** Whether experiments are loading */
    isLoading,
    /** Error if query failed */
    error,
    /** Mutation for creating experiments */
    createExperiment,
    /** Mutation for deleting experiments */
    deleteExperiment,
  };
};

/**
 * Custom hook for managing TalAI machine learning experiments.
 *
 * Provides CRUD operations for ML experiments with training
 * progress tracking and metrics visualization.
 * Requires authentication.
 *
 * @example
 * ```tsx
 * function MLDashboard() {
 *   const {
 *     experiments,
 *     createExperiment,
 *     updateExperiment
 *   } = useTalAIExperiments();
 *
 *   const startTraining = () => {
 *     createExperiment.mutate({
 *       name: 'GPT Fine-tune',
 *       model_type: 'transformer',
 *       hyperparameters: {
 *         learning_rate: 0.001,
 *         epochs: 10,
 *         batch_size: 32
 *       }
 *     });
 *   };
 *
 *   return <TrainingDashboard experiments={experiments} />;
 * }
 * ```
 *
 * @returns TalAI experiments data and mutation functions
 */
export const useTalAIExperiments = () => {
  const { session } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    data: experiments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['talai-experiments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('talai_experiments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TalAIExperiment[];
    },
    enabled: !!session,
  });

  /**
   * Create a new AI experiment.
   */
  const createExperiment = useMutation({
    mutationFn: async (experiment: {
      name: string;
      model_type?: string;
      hyperparameters?: Json;
    }) => {
      const { data, error } = await supabase
        .from('talai_experiments')
        .insert({
          name: experiment.name,
          model_type: experiment.model_type ?? null,
          hyperparameters: experiment.hyperparameters ?? {},
          user_id: session?.user?.id ?? '',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['talai-experiments'] });
      toast({ title: 'Experiment created', description: 'AI experiment has been queued.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  /**
   * Update an existing AI experiment.
   */
  const updateExperiment = useMutation({
    mutationFn: async ({
      id,
      status,
      progress,
      metrics,
    }: {
      id: string;
      status?: string;
      progress?: number;
      metrics?: Json;
    }) => {
      const { data, error } = await supabase
        .from('talai_experiments')
        .update({ status, progress, metrics })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['talai-experiments'] });
    },
  });

  /**
   * Delete an AI experiment by ID.
   */
  const deleteExperiment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('talai_experiments').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['talai-experiments'] });
      toast({ title: 'Experiment deleted' });
    },
  });

  return {
    /** Array of user's AI experiments */
    experiments: experiments ?? [],
    /** Whether experiments are loading */
    isLoading,
    /** Error if query failed */
    error,
    /** Mutation for creating experiments */
    createExperiment,
    /** Mutation for updating experiments */
    updateExperiment,
    /** Mutation for deleting experiments */
    deleteExperiment,
  };
};
