/**
 * @file useSubscription.ts
 * @description Hook for managing user subscriptions with Stripe integration
 */
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

export type SubscriptionTier = 'free' | 'pro' | 'team' | 'enterprise';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | null;

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  description: string;
  priceMonthly: number;
  priceAnnual: number;
  features: string[];
  limits: {
    simulations: number | 'unlimited';
    storage: string;
    apiCalls: number | 'unlimited';
    teamMembers: number | 'unlimited';
  };
  popular?: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Get started with basic features',
    priceMonthly: 0,
    priceAnnual: 0,
    features: [
      '5 simulations per month',
      '100MB storage',
      'Community support',
      'Basic exports (CSV, JSON)',
      'Single platform access',
    ],
    limits: {
      simulations: 5,
      storage: '100MB',
      apiCalls: 100,
      teamMembers: 1,
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For individual researchers',
    priceMonthly: 49,
    priceAnnual: 470,
    features: [
      'Unlimited simulations',
      '10GB storage',
      'Email support',
      'All export formats',
      'API access',
      'All 5 platforms',
      'Priority execution',
    ],
    limits: {
      simulations: 'unlimited',
      storage: '10GB',
      apiCalls: 10000,
      teamMembers: 1,
    },
    popular: true,
  },
  {
    id: 'team',
    name: 'Team',
    description: 'For research teams',
    priceMonthly: 199,
    priceAnnual: 1900,
    features: [
      'Everything in Pro',
      'Unlimited storage',
      'Priority support',
      'Team management (up to 10)',
      'SSO integration',
      'Shared workspaces',
      'Admin dashboard',
    ],
    limits: {
      simulations: 'unlimited',
      storage: 'unlimited',
      apiCalls: 100000,
      teamMembers: 10,
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For organizations',
    priceMonthly: -1, // Custom pricing
    priceAnnual: -1,
    features: [
      'Everything in Team',
      'Unlimited team members',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
      'On-premise option',
      'Training & onboarding',
    ],
    limits: {
      simulations: 'unlimited',
      storage: 'unlimited',
      apiCalls: 'unlimited',
      teamMembers: 'unlimited',
    },
  },
];

export interface UseSubscriptionReturn {
  currentPlan: SubscriptionPlan | null;
  status: SubscriptionStatus;
  isLoading: boolean;
  createCheckout: (planId: SubscriptionTier, billingPeriod: 'monthly' | 'annual') => Promise<void>;
  openCustomerPortal: () => Promise<void>;
  canAccess: (feature: string) => boolean;
  getRemainingUsage: () => { simulations: number; storage: number };
}

export const useSubscription = (): UseSubscriptionReturn => {
  const { user, session } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  // Get current subscription tier from user profile (default to free)
  // User type extended with subscription fields
  interface UserWithSubscription {
    subscription_tier?: SubscriptionTier;
    subscription_status?: SubscriptionStatus;
  }
  const userWithSub = user as UserWithSubscription | null;
  const currentTier: SubscriptionTier = userWithSub?.subscription_tier || 'free';
  const status: SubscriptionStatus = userWithSub?.subscription_status || null;
  const currentPlan = SUBSCRIPTION_PLANS.find((p) => p.id === currentTier) || SUBSCRIPTION_PLANS[0];

  const createCheckout = useCallback(
    async (planId: SubscriptionTier, billingPeriod: 'monthly' | 'annual') => {
      if (!session?.access_token) {
        toast.error('Please sign in to subscribe');
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('create-checkout', {
          body: {
            action: 'create-checkout',
            planId,
            billingPeriod,
            // These would be actual Stripe Price IDs from your dashboard
            priceId: `price_${planId}_${billingPeriod}`,
          },
        });

        if (error) throw error;
        if (data?.url) {
          window.location.href = data.url;
        }
      } catch (error) {
        console.error('Checkout error:', error);
        toast.error('Failed to start checkout. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [session]
  );

  const openCustomerPortal = useCallback(async () => {
    if (!session?.access_token) {
      toast.error('Please sign in to manage your subscription');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { action: 'create-portal' },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Portal error:', error);
      toast.error('Failed to open billing portal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const canAccess = useCallback(
    (feature: string): boolean => {
      // Implement feature-based access control
      const tierOrder = ['free', 'pro', 'team', 'enterprise'];
      const currentIndex = tierOrder.indexOf(currentTier);

      // Define minimum tier for features
      const featureMinTier: Record<string, SubscriptionTier> = {
        api_access: 'pro',
        team_management: 'team',
        sso: 'team',
        custom_integrations: 'enterprise',
        unlimited_simulations: 'pro',
      };

      const requiredTier = featureMinTier[feature] || 'free';
      const requiredIndex = tierOrder.indexOf(requiredTier);

      return currentIndex >= requiredIndex;
    },
    [currentTier]
  );

  const getRemainingUsage = useCallback(() => {
    // This would fetch from the database in production
    return {
      simulations: currentPlan?.limits.simulations === 'unlimited' ? -1 : 5,
      storage: 100, // MB remaining
    };
  }, [currentPlan]);

  return {
    currentPlan,
    status,
    isLoading,
    createCheckout,
    openCustomerPortal,
    canAccess,
    getRemainingUsage,
  };
};
