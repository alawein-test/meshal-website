import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  checkRateLimit,
  getRateLimitHeaders,
  rateLimitExceededResponse,
  type SubscriptionTier,
} from '../_shared/rate-limiter.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.log('No authorization header provided');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.log('Auth error:', authError?.message);
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user's subscription tier for rate limiting
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    const tier = (profile?.subscription_tier || 'free') as SubscriptionTier;

    // Check rate limit
    const rateLimitResult = await checkRateLimit(
      supabaseUrl,
      supabaseKey,
      user.id,
      tier,
      'mezan-api'
    );

    if (!rateLimitResult.allowed) {
      return rateLimitExceededResponse(rateLimitResult, corsHeaders);
    }

    const rateLimitHeaders = getRateLimitHeaders(rateLimitResult);
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    console.log(`MEZAN API - Action: ${action}, User: ${user.id}`);

    switch (action) {
      case 'list': {
        const { data, error } = await supabase
          .from('mezan_workflows')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error listing workflows:', error);
          throw error;
        }

        return new Response(JSON.stringify({ workflows: data }), {
          headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'create': {
        const body = await req.json();
        const { name, description, workflow_definition } = body;

        // Check usage quota before creating
        const { data: usageResult } = await supabase.rpc('increment_usage', {
          p_user_id: user.id,
          p_platform: 'mezan',
          p_resource_type: 'workflow',
        });

        if (usageResult && !usageResult[0]?.allowed) {
          return new Response(
            JSON.stringify({
              error: 'Usage limit exceeded',
              message: `You have reached your monthly workflow limit (${usageResult[0]?.limit_count}). Please upgrade your plan.`,
              current: usageResult[0]?.current_count,
              limit: usageResult[0]?.limit_count,
            }),
            {
              status: 403,
              headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        const { data, error } = await supabase
          .from('mezan_workflows')
          .insert({
            user_id: user.id,
            name,
            description,
            workflow_definition: workflow_definition || {},
            status: 'draft',
            execution_count: 0,
            success_rate: 0,
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating workflow:', error);
          throw error;
        }

        console.log('Created workflow:', data.id);
        return new Response(JSON.stringify({ workflow: data }), {
          headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'update': {
        const body = await req.json();
        const { id, name, description, workflow_definition, status } = body;

        const updateData: Record<string, unknown> = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (workflow_definition !== undefined) updateData.workflow_definition = workflow_definition;
        if (status !== undefined) updateData.status = status;

        const { data, error } = await supabase
          .from('mezan_workflows')
          .update(updateData)
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating workflow:', error);
          throw error;
        }

        console.log('Updated workflow:', id);
        return new Response(JSON.stringify({ workflow: data }), {
          headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'execute': {
        const body = await req.json();
        const { id } = body;

        // Simulate workflow execution
        const { data: workflow, error: fetchError } = await supabase
          .from('mezan_workflows')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (fetchError) {
          console.error('Error fetching workflow:', fetchError);
          throw fetchError;
        }

        // Update execution stats
        const newExecutionCount = (workflow.execution_count || 0) + 1;
        const success = Math.random() > 0.1; // 90% success rate simulation
        const newSuccessRate =
          ((workflow.success_rate || 0) * (newExecutionCount - 1) + (success ? 100 : 0)) /
          newExecutionCount;

        const { data, error } = await supabase
          .from('mezan_workflows')
          .update({
            execution_count: newExecutionCount,
            success_rate: newSuccessRate,
            last_executed_at: new Date().toISOString(),
          })
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) {
          console.error('Error executing workflow:', error);
          throw error;
        }

        console.log('Executed workflow:', id, 'Success:', success);
        return new Response(JSON.stringify({ workflow: data, success }), {
          headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'delete': {
        const body = await req.json();
        const { id } = body;

        const { error } = await supabase
          .from('mezan_workflows')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error deleting workflow:', error);
          throw error;
        }

        console.log('Deleted workflow:', id);
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('MEZAN API error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
