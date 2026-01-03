import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// SaaS Subscription Plans
const PLANS = {
  free: {
    name: 'Free',
    priceMonthly: 0,
    priceAnnual: 0,
    features: ['5 simulations/month', '100MB storage', 'Community support', 'Basic exports'],
  },
  pro: {
    name: 'Pro',
    priceMonthly: 4900, // $49.00 in cents
    priceAnnual: 47000, // $470.00 (20% discount)
    features: [
      'Unlimited simulations',
      '10GB storage',
      'Email support',
      'All exports',
      'API access',
    ],
  },
  team: {
    name: 'Team',
    priceMonthly: 19900, // $199.00 in cents
    priceAnnual: 190000, // $1,900.00 (20% discount)
    features: [
      'Everything in Pro',
      'Unlimited storage',
      'Priority support',
      'Team management',
      'SSO',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    priceMonthly: null, // Custom pricing
    priceAnnual: null,
    features: [
      'Everything in Team',
      'Dedicated support',
      'Custom integrations',
      'SLA',
      'On-premise option',
    ],
  },
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('Stripe secret key not configured');
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
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
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, planId, billingPeriod, priceId, successUrl, cancelUrl } = await req.json();

    switch (action) {
      case 'create-checkout': {
        // Get or create Stripe customer
        const { data: profile } = await supabase
          .from('profiles')
          .select('stripe_customer_id')
          .eq('id', user.id)
          .single();

        let customerId = profile?.stripe_customer_id;

        if (!customerId) {
          const customer = await stripe.customers.create({
            email: user.email,
            metadata: { supabase_user_id: user.id },
          });
          customerId = customer.id;

          // Save customer ID to profile
          await supabase
            .from('profiles')
            .update({ stripe_customer_id: customerId })
            .eq('id', user.id);
        }

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
          customer: customerId,
          payment_method_types: ['card'],
          mode: 'subscription',
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          success_url: successUrl || `${req.headers.get('origin')}/settings?checkout=success`,
          cancel_url: cancelUrl || `${req.headers.get('origin')}/pricing?checkout=cancelled`,
          metadata: {
            user_id: user.id,
            plan_id: planId,
          },
        });

        return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'create-portal': {
        // Create customer portal session
        const { data: profile } = await supabase
          .from('profiles')
          .select('stripe_customer_id')
          .eq('id', user.id)
          .single();

        if (!profile?.stripe_customer_id) {
          return new Response(JSON.stringify({ error: 'No subscription found' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const portalSession = await stripe.billingPortal.sessions.create({
          customer: profile.stripe_customer_id,
          return_url: `${req.headers.get('origin')}/settings`,
        });

        return new Response(JSON.stringify({ url: portalSession.url }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'get-plans': {
        return new Response(JSON.stringify({ plans: PLANS }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Checkout error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
