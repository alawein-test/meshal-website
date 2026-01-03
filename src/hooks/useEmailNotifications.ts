import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EmailTemplateData {
  [key: string]: string | number | boolean | null | undefined;
}

interface EmailNotificationParams {
  to: string;
  subject: string;
  template: 'waitlist-welcome' | 'waitlist-invite' | 'waitlist-update';
  data?: EmailTemplateData;
}

/**
 * Hook for sending email notifications
 * In production, this would integrate with SendGrid, Resend, or similar service
 */
export function useEmailNotifications() {
  const [loading, setLoading] = useState(false);

  const sendEmail = async (params: EmailNotificationParams): Promise<boolean> => {
    setLoading(true);
    try {
      // In production, this would call your email service API
      // For now, we'll use a Supabase Edge Function or external API

      // Example: Call Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: params.to,
          subject: params.subject,
          template: params.template,
          data: params.data || {},
        },
      });

      if (error) throw error;

      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to send email:', error);
      toast.error('Failed to send email: ' + message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const sendWaitlistWelcome = async (email: string, position: number, projectId: string) => {
    return sendEmail({
      to: email,
      subject: `Welcome to the ${projectId.toUpperCase()} Waitlist!`,
      template: 'waitlist-welcome',
      data: {
        email,
        position,
        projectId,
      },
    });
  };

  const sendWaitlistInvite = async (email: string, projectId: string, productId?: string) => {
    return sendEmail({
      to: email,
      subject: `You're Invited! Early Access to ${projectId.toUpperCase()}`,
      template: 'waitlist-invite',
      data: {
        email,
        projectId,
        productId,
      },
    });
  };

  const sendWaitlistUpdate = async (email: string, projectId: string, message: string) => {
    return sendEmail({
      to: email,
      subject: `Update: ${projectId.toUpperCase()} Waitlist`,
      template: 'waitlist-update',
      data: {
        email,
        projectId,
        message,
      },
    });
  };

  return {
    sendEmail,
    sendWaitlistWelcome,
    sendWaitlistInvite,
    sendWaitlistUpdate,
    loading,
  };
}
