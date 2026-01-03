import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/hooks/use-toast';
import type { Json } from '@/integrations/supabase/types';

/**
 * Workflow entity representing a MEZAN automation workflow.
 *
 * @interface Workflow
 */
export interface Workflow {
  /** Unique identifier */
  id: string;
  /** Display name for the workflow */
  name: string;
  /** Optional description */
  description: string | null;
  /** Current status: 'draft', 'active', 'paused', 'archived' */
  status: string | null;
  /** Workflow definition as JSON (nodes, edges, config) */
  workflow_definition: Json;
  /** Total number of executions */
  execution_count: number | null;
  /** Success rate as percentage (0-100) */
  success_rate: number | null;
  /** When the workflow was last executed */
  last_executed_at: string | null;
  /** Creation timestamp */
  created_at: string;
  /** Last update timestamp */
  updated_at: string;
  /** Owner's user ID */
  user_id: string;
}

/**
 * Input for creating a new workflow.
 */
export interface CreateWorkflowInput {
  /** Display name for the workflow */
  name: string;
  /** Optional description */
  description?: string;
  /** Optional workflow definition */
  workflow_definition?: Json;
}

/**
 * Input for updating an existing workflow.
 */
export interface UpdateWorkflowInput {
  /** Workflow ID to update */
  id: string;
  /** New name */
  name?: string;
  /** New status */
  status?: string;
  /** Updated workflow definition */
  workflow_definition?: Json;
}

/**
 * Custom hook for managing MEZAN workflows.
 *
 * Provides CRUD operations for Islamic finance automation workflows
 * with automatic cache invalidation and toast notifications.
 * Requires authentication.
 *
 * @example
 * ```tsx
 * function WorkflowBuilder() {
 *   const {
 *     workflows,
 *     isLoading,
 *     createWorkflow,
 *     updateWorkflow
 *   } = useWorkflows();
 *
 *   const handleSave = (nodes, edges) => {
 *     createWorkflow.mutate({
 *       name: 'Zakat Calculator',
 *       description: 'Automates annual zakat calculations',
 *       workflow_definition: { nodes, edges }
 *     });
 *   };
 *
 *   return <WorkflowCanvas workflows={workflows} onSave={handleSave} />;
 * }
 * ```
 *
 * @returns Workflows data and mutation functions
 */
export const useWorkflows = () => {
  const { session } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    data: workflows,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mezan_workflows')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Workflow[];
    },
    enabled: !!session,
  });

  /**
   * Create a new workflow.
   *
   * @example
   * ```tsx
   * createWorkflow.mutate({
   *   name: 'Payment Processor',
   *   description: 'Handles halal payment processing'
   * });
   * ```
   */
  const createWorkflow = useMutation({
    mutationFn: async (workflow: CreateWorkflowInput) => {
      const { data, error } = await supabase
        .from('mezan_workflows')
        .insert({
          name: workflow.name,
          description: workflow.description ?? null,
          workflow_definition: workflow.workflow_definition ?? {},
          user_id: session?.user?.id ?? '',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast({ title: 'Workflow created', description: 'Your workflow has been saved.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  /**
   * Update an existing workflow.
   *
   * @example
   * ```tsx
   * updateWorkflow.mutate({
   *   id: 'wf-123',
   *   status: 'active',
   *   workflow_definition: updatedNodes
   * });
   * ```
   */
  const updateWorkflow = useMutation({
    mutationFn: async ({ id, name, status, workflow_definition }: UpdateWorkflowInput) => {
      const { data, error } = await supabase
        .from('mezan_workflows')
        .update({ name, status, workflow_definition })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });

  /**
   * Delete a workflow by ID.
   *
   * @example
   * ```tsx
   * deleteWorkflow.mutate('wf-123');
   * ```
   */
  const deleteWorkflow = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('mezan_workflows').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast({ title: 'Workflow deleted' });
    },
  });

  return {
    /** Array of user's workflows, sorted by creation date (newest first) */
    workflows: workflows ?? [],
    /** Whether workflows are currently loading */
    isLoading,
    /** Error if query failed */
    error,
    /** Mutation for creating new workflows */
    createWorkflow,
    /** Mutation for updating existing workflows */
    updateWorkflow,
    /** Mutation for deleting workflows */
    deleteWorkflow,
  };
};
