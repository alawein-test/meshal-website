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
      'talai-api'
    );

    if (!rateLimitResult.allowed) {
      return rateLimitExceededResponse(rateLimitResult, corsHeaders);
    }

    const rateLimitHeaders = getRateLimitHeaders(rateLimitResult);
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    console.log(`TalAI API - Action: ${action}, User: ${user.id}`);

    switch (action) {
      case 'list': {
        const { data, error } = await supabase
          .from('talai_experiments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error listing experiments:', error);
          throw error;
        }

        return new Response(JSON.stringify({ experiments: data }), {
          headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'create': {
        const body = await req.json();
        const { name, model_type, hyperparameters } = body;

        // Check usage quota before creating
        const { data: usageResult } = await supabase.rpc('increment_usage', {
          p_user_id: user.id,
          p_platform: 'talai',
          p_resource_type: 'experiment',
        });

        if (usageResult && !usageResult[0]?.allowed) {
          return new Response(
            JSON.stringify({
              error: 'Usage limit exceeded',
              message: `You have reached your monthly experiment limit (${usageResult[0]?.limit_count}). Please upgrade your plan.`,
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
          .from('talai_experiments')
          .insert({
            user_id: user.id,
            name,
            model_type,
            hyperparameters: hyperparameters || {},
            metrics: {},
            status: 'pending',
            progress: 0,
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating experiment:', error);
          throw error;
        }

        console.log('Created experiment:', data.id);
        return new Response(JSON.stringify({ experiment: data }), {
          headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'start': {
        const body = await req.json();
        const { id } = body;

        const { data, error } = await supabase
          .from('talai_experiments')
          .update({
            status: 'training',
            started_at: new Date().toISOString(),
            progress: 0,
          })
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) {
          console.error('Error starting experiment:', error);
          throw error;
        }

        console.log('Started experiment:', id);
        return new Response(JSON.stringify({ experiment: data }), {
          headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'stop': {
        const body = await req.json();
        const { id } = body;

        const { data, error } = await supabase
          .from('talai_experiments')
          .update({
            status: 'stopped',
            completed_at: new Date().toISOString(),
          })
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) {
          console.error('Error stopping experiment:', error);
          throw error;
        }

        console.log('Stopped experiment:', id);
        return new Response(JSON.stringify({ experiment: data }), {
          headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'delete': {
        const body = await req.json();
        const { id } = body;

        const { error } = await supabase
          .from('talai_experiments')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error deleting experiment:', error);
          throw error;
        }

        console.log('Deleted experiment:', id);
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
    console.error('TalAI API error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
