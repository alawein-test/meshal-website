/**
 * @file send-email/index.ts
 * @description Edge Function for sending transactional emails via Resend
 *
 * Environment Variables Required:
 * - RESEND_API_KEY: Your Resend API key (get from https://resend.com/api-keys)
 * - FROM_EMAIL: The verified sender email (e.g., notifications@alawein.dev)
 *
 * TODO: Configure in Supabase Dashboard → Edge Functions → Secrets:
 * - RESEND_API_KEY=re_PLACEHOLDER_API_KEY
 * - FROM_EMAIL=notifications@yourdomain.com
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { emailTemplates } from '../_shared/email-templates.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// TODO: Replace with actual Resend API key
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || 're_PLACEHOLDER_API_KEY';
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'Alawein Platform <notifications@alawein.dev>';

interface EmailRequest {
  to: string;
  template: 'welcome' | 'subscriptionConfirm' | 'usageLimitWarning' | 'passwordReset';
  data: Record<string, unknown>;
}

async function sendViaResend(to: string, subject: string, html: string): Promise<Response> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
    }),
  });

  return response;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify authorization (should be called from server-side only)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { to, template, data }: EmailRequest = await req.json();

    // Validate required fields
    if (!to || !template) {
      return new Response(JSON.stringify({ error: 'Missing required fields: to, template' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate email content based on template
    let emailContent: { subject: string; html: string };

    switch (template) {
      case 'welcome':
        emailContent = emailTemplates.welcome((data.userName as string) || 'User');
        break;

      case 'subscriptionConfirm':
        emailContent = emailTemplates.subscriptionConfirm(
          (data.userName as string) || 'User',
          (data.planName as string) || 'Pro',
          (data.amount as string) || '$49/month',
          (data.nextBillingDate as string) || 'Next month'
        );
        break;

      case 'usageLimitWarning':
        emailContent = emailTemplates.usageLimitWarning(
          (data.userName as string) || 'User',
          (data.resourceType as string) || 'simulations',
          (data.usedPercent as number) || 80,
          (data.limit as number) || 100
        );
        break;

      case 'passwordReset':
        emailContent = emailTemplates.passwordReset((data.resetLink as string) || '#');
        break;

      default:
        return new Response(JSON.stringify({ error: `Unknown template: ${template}` }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    // Check if using placeholder key (for development)
    if (RESEND_API_KEY.includes('PLACEHOLDER')) {
      console.log('[DEV MODE] Would send email:', { to, subject: emailContent.subject });
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Email logged (development mode - configure RESEND_API_KEY for production)',
          preview: { to, subject: emailContent.subject },
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send email via Resend
    const sendResponse = await sendViaResend(to, emailContent.subject, emailContent.html);
    const sendResult = await sendResponse.json();

    if (!sendResponse.ok) {
      console.error('Resend API error:', sendResult);
      return new Response(JSON.stringify({ error: 'Failed to send email', details: sendResult }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, id: sendResult.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Send email error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
