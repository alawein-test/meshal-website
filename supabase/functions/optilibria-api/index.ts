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
      'optilibria-api'
    );

    if (!rateLimitResult.allowed) {
      return rateLimitExceededResponse(rateLimitResult, corsHeaders);
    }

    const rateLimitHeaders = getRateLimitHeaders(rateLimitResult);
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    console.log(`OptiLibria API - Action: ${action}, User: ${user.id}`);

    switch (action) {
      case 'list': {
        const { data, error } = await supabase
          .from('optilibria_runs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error listing optimization runs:', error);
          throw error;
        }

        return new Response(JSON.stringify({ runs: data }), {
          headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'create': {
        const body = await req.json();
        const { problem_name, algorithm, config } = body;

        // Check usage quota before creating
        const { data: usageResult } = await supabase.rpc('increment_usage', {
          p_user_id: user.id,
          p_platform: 'optilibria',
          p_resource_type: 'optimization_run',
        });

        if (usageResult && !usageResult[0]?.allowed) {
          return new Response(
            JSON.stringify({
              error: 'Usage limit exceeded',
              message: `You have reached your monthly optimization run limit (${usageResult[0]?.limit_count}). Please upgrade your plan.`,
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
          .from('optilibria_runs')
          .insert({
            user_id: user.id,
            problem_name,
            algorithm,
            config: config || {},
            status: 'pending',
            iterations: 0,
            best_score: null,
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating optimization run:', error);
          throw error;
        }

        console.log('Created optimization run:', data.id);
        return new Response(JSON.stringify({ run: data }), {
          headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'start': {
        const body = await req.json();
        const { id } = body;

        const { data, error } = await supabase
          .from('optilibria_runs')
          .update({
            status: 'running',
            started_at: new Date().toISOString(),
          })
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) {
          console.error('Error starting optimization run:', error);
          throw error;
        }

        console.log('Started optimization run:', id);
        return new Response(JSON.stringify({ run: data }), {
          headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'complete': {
        const body = await req.json();
        const { id, best_score, iterations, results } = body;

        const { data, error } = await supabase
          .from('optilibria_runs')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            best_score,
            iterations,
            results,
          })
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) {
          console.error('Error completing optimization run:', error);
          throw error;
        }

        console.log('Completed optimization run:', id);
        return new Response(JSON.stringify({ run: data }), {
          headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'delete': {
        const body = await req.json();
        const { id } = body;

        const { error } = await supabase
          .from('optilibria_runs')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error deleting optimization run:', error);
          throw error;
        }

        console.log('Deleted optimization run:', id);
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('OptiLibria API error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
