import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Brain, Lock, TrendingUp, Check, X } from 'lucide-react';
import { useAIConsentStore, AIConsentLevel } from '@/stores/aiConsentStore';
import { Link } from 'react-router-dom';

interface ConsentBenefitProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function ConsentBenefit({ icon, title, description }: ConsentBenefitProps) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="rounded-full bg-primary/10 p-3">{icon}</div>
      <h4 className="font-semibold text-sm">{title}</h4>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export function AIConsentModal() {
  const { consentLevel, hasSeenPopup, setConsentLevel, setHasSeenPopup } = useAIConsentStore();

  // Don't show if user has already made a choice
  if (hasSeenPopup && consentLevel !== null) {
    return null;
  }

  const handleConsent = (level: AIConsentLevel) => {
    setConsentLevel(level);
    setHasSeenPopup(true);
  };

  return (
    <Dialog open={!hasSeenPopup || consentLevel === null}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Brain className="h-8 w-8 text-primary animate-pulse" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center">Help Us Build Smarter AI</DialogTitle>
          <DialogDescription className="text-center">
            Your interactions power our AI improvements and help us deliver better experiences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Benefits Grid */}
          <div className="grid grid-cols-3 gap-4">
            <ConsentBenefit
              icon={<TrendingUp className="h-5 w-5 text-primary" />}
              title="Better Features"
              description="AI learns from usage patterns"
            />
            <ConsentBenefit
              icon={<Lock className="h-5 w-5 text-primary" />}
              title="Privacy First"
              description="Anonymized data only"
            />
            <ConsentBenefit
              icon={<Shield className="h-5 w-5 text-primary" />}
              title="Full Control"
              description="Change anytime in settings"
            />
          </div>

          {/* What We Collect Table */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <h4 className="font-semibold mb-3">What We Collect</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Usage patterns:</span> Feature interactions,
                  navigation paths
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Problem definitions:</span> Optimization problems,
                  simulation configs (anonymized)
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Feedback:</span> Error reports, feature requests
                </div>
              </div>
              <div className="flex items-start gap-2 mt-3 pt-3 border-t">
                <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">We DON'T collect:</span> Personal data beyond email,
                  proprietary algorithms, commercial secrets
                </div>
              </div>
            </div>
          </div>

          {/* Consent Options */}
          <div className="space-y-3">
            <Button onClick={() => handleConsent('accept_all')} className="w-full" size="lg">
              Accept & Get Early Access
              <Badge variant="secondary" className="ml-2">
                +10% Speed Boost
              </Badge>
            </Button>

            <Button
              onClick={() => handleConsent('accept_anonymized')}
              variant="outline"
              className="w-full"
            >
              Accept Anonymized Only
            </Button>

            <Button
              onClick={() => handleConsent('decline')}
              variant="ghost"
              className="w-full text-xs"
            >
              Decline (some features limited)
            </Button>
          </div>

          {/* Legal Links */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-4 border-t">
            <Link to="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:underline">
              Terms of Service
            </Link>
            <span>•</span>
            <Link to="/transparency" className="hover:underline">
              AI Training Report
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
