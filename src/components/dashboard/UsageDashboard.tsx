/**
 * @file UsageDashboard.tsx
 * @description Dashboard component showing usage metrics, quota limits, and billing overview
 */
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Database,
  Cpu,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  CreditCard,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription, SUBSCRIPTION_PLANS } from '@/hooks/useSubscription';
import { useAuthStore } from '@/stores/authStore';

interface UsageMetric {
  label: string;
  used: number;
  limit: number | 'unlimited';
  unit: string;
  icon: React.ElementType;
  color: string;
}

export function UsageDashboard() {
  const { currentPlan, status, openCustomerPortal, isLoading } = useSubscription();
  const { user } = useAuthStore();

  // Mock usage data - in production, this would come from useSubscription or a dedicated hook
  const usageMetrics: UsageMetric[] = useMemo(
    () => [
      {
        label: 'Simulations',
        used: 3,
        limit: currentPlan?.limits.simulations || 5,
        unit: 'runs',
        icon: Cpu,
        color: 'jules-cyan',
      },
      {
        label: 'Storage',
        used: 45,
        limit: currentPlan?.limits.storage === 'unlimited' ? 'unlimited' : 100,
        unit: 'MB',
        icon: Database,
        color: 'jules-magenta',
      },
      {
        label: 'API Calls',
        used: 234,
        limit: currentPlan?.limits.apiCalls || 100,
        unit: 'calls',
        icon: Activity,
        color: 'jules-yellow',
      },
    ],
    [currentPlan]
  );

  const getUsagePercentage = (used: number, limit: number | 'unlimited'): number => {
    if (limit === 'unlimited') return 0;
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageStatus = (percentage: number): 'normal' | 'warning' | 'critical' => {
    if (percentage >= 90) return 'critical';
    if (percentage >= 75) return 'warning';
    return 'normal';
  };

  return (
    <div className="space-y-6">
      {/* Subscription Status Card */}
      <Card className="border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Subscription
            </CardTitle>
            <CardDescription>Your current plan and billing</CardDescription>
          </div>
          <Badge variant={status === 'active' ? 'default' : 'secondary'}>
            {currentPlan?.name || 'Free'} Plan
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {currentPlan?.id === 'free'
                  ? 'Upgrade to unlock more features'
                  : `$${currentPlan?.priceMonthly}/month`}
              </p>
              {status === 'active' && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  Active subscription
                </p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openCustomerPortal()}
              disabled={isLoading || currentPlan?.id === 'free'}
            >
              Manage Billing
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {usageMetrics.map((metric, index) => {
          const percentage = getUsagePercentage(metric.used, metric.limit);
          const usageStatus = getUsageStatus(percentage);
          const Icon = metric.icon;

          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={usageStatus === 'critical' ? 'border-destructive/50' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Icon className={`w-4 h-4 text-${metric.color}`} />
                      {metric.label}
                    </CardTitle>
                    {usageStatus === 'critical' && (
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metric.used}
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      / {metric.limit === 'unlimited' ? '∞' : metric.limit} {metric.unit}
                    </span>
                  </div>
                  {metric.limit !== 'unlimited' && (
                    <Progress value={percentage} className="mt-2 h-2" />
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {metric.limit === 'unlimited'
                      ? 'Unlimited usage'
                      : `${Math.round(percentage)}% used this billing period`}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Upgrade CTA for free users */}
      {currentPlan?.id === 'free' && (
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-primary" />
              <div>
                <p className="font-medium">Upgrade to Pro</p>
                <p className="text-sm text-muted-foreground">
                  Get unlimited simulations and 10GB storage
                </p>
              </div>
            </div>
            <Button>Upgrade Now</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default UsageDashboard;
