/**
 * @file SaaSPricingCards.tsx
 * @description SaaS subscription pricing cards with Stripe integration
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Star, Crown, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  useSubscription,
  SUBSCRIPTION_PLANS,
  type SubscriptionTier,
} from '@/hooks/useSubscription';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';

const tierIcons: Record<SubscriptionTier, React.ElementType> = {
  free: Zap,
  pro: Star,
  team: Crown,
  enterprise: Building2,
};

const tierColors: Record<SubscriptionTier, string> = {
  free: 'jules-cyan',
  pro: 'jules-magenta',
  team: 'jules-yellow',
  enterprise: 'jules-green',
};

interface SaaSPricingCardsProps {
  showToggle?: boolean;
  highlightPlan?: SubscriptionTier;
}

export const SaaSPricingCards: React.FC<SaaSPricingCardsProps> = ({
  showToggle = true,
  highlightPlan = 'pro',
}) => {
  const [isAnnual, setIsAnnual] = useState(true);
  const { currentPlan, createCheckout, isLoading } = useSubscription();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleSelectPlan = async (planId: SubscriptionTier) => {
    if (!isAuthenticated) {
      navigate('/auth?redirect=/pricing');
      return;
    }

    if (planId === 'enterprise') {
      navigate('/book');
      return;
    }

    if (planId === 'free') {
      // Already on free plan or downgrade
      return;
    }

    await createCheckout(planId, isAnnual ? 'annual' : 'monthly');
  };

  return (
    <div className="space-y-8">
      {/* Billing Toggle */}
      {showToggle && (
        <div className="flex items-center justify-center gap-4">
          <Label
            htmlFor="billing-toggle"
            className={!isAnnual ? 'text-foreground' : 'text-muted-foreground'}
          >
            Monthly
          </Label>
          <Switch id="billing-toggle" checked={isAnnual} onCheckedChange={setIsAnnual} />
          <Label
            htmlFor="billing-toggle"
            className={isAnnual ? 'text-foreground' : 'text-muted-foreground'}
          >
            Annual
            <Badge variant="secondary" className="ml-2 text-xs">
              Save 20%
            </Badge>
          </Label>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SUBSCRIPTION_PLANS.map((plan, index) => {
          const Icon = tierIcons[plan.id];
          const color = tierColors[plan.id];
          const isCurrentPlan = currentPlan?.id === plan.id;
          const isHighlighted = plan.id === highlightPlan;
          const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;
          const monthlyEquivalent = isAnnual
            ? Math.round(plan.priceAnnual / 12)
            : plan.priceMonthly;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {isHighlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <Badge className={`bg-${color} text-white px-4 py-1`}>Most Popular</Badge>
                </div>
              )}

              <Card
                className={`h-full flex flex-col ${
                  isHighlighted
                    ? `border-${color}/50 shadow-lg shadow-${color}/10`
                    : 'border-border/50'
                } ${isCurrentPlan ? 'ring-2 ring-primary' : ''}`}
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center bg-${color}/10`}
                  >
                    <Icon className={`h-7 w-7 text-${color}`} />
                  </div>
                  <CardTitle className="text-2xl font-display">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  <div className="text-center mb-6">
                    {price === -1 ? (
                      <div className="text-3xl font-bold font-display">Custom</div>
                    ) : price === 0 ? (
                      <div className="text-4xl font-bold font-display">$0</div>
                    ) : (
                      <>
                        <div className="text-4xl font-bold font-display">${monthlyEquivalent}</div>
                        <span className="text-sm text-muted-foreground">
                          /month {isAnnual && '(billed annually)'}
                        </span>
                      </>
                    )}
                  </div>

                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className={`h-4 w-4 text-${color} shrink-0 mt-0.5`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-6">
                  <Button
                    className="w-full"
                    variant={isHighlighted ? 'default' : 'outline'}
                    size="lg"
                    disabled={isLoading || isCurrentPlan}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {isCurrentPlan
                      ? 'Current Plan'
                      : plan.id === 'enterprise'
                        ? 'Contact Sales'
                        : 'Get Started'}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SaaSPricingCards;
