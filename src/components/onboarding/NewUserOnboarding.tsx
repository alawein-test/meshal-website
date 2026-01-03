/**
 * @file NewUserOnboarding.tsx
 * @description Multi-step onboarding flow for new users with platform selection
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  Cpu,
  Workflow,
  Brain,
  LineChart,
  Atom,
  User,
  Rocket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Platform {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const PLATFORMS: Platform[] = [
  {
    id: 'simcore',
    name: 'SimCore',
    description: 'Scientific computing & simulations',
    icon: Cpu,
    color: 'jules-cyan',
  },
  {
    id: 'mezan',
    name: 'MEZAN',
    description: 'Workflow automation',
    icon: Workflow,
    color: 'jules-magenta',
  },
  {
    id: 'talai',
    name: 'TalAI',
    description: 'AI research & experiments',
    icon: Brain,
    color: 'jules-yellow',
  },
  {
    id: 'optilibria',
    name: 'OptiLibria',
    description: 'Optimization algorithms',
    icon: LineChart,
    color: 'jules-green',
  },
  {
    id: 'qmlab',
    name: 'QMLab',
    description: 'Quantum mechanics lab',
    icon: Atom,
    color: 'jules-purple',
  },
];

type OnboardingStep = 'welcome' | 'profile' | 'platforms' | 'complete';

interface OnboardingData {
  fullName: string;
  organization: string;
  role: string;
  selectedPlatforms: string[];
}

export function NewUserOnboarding() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage(
    'new-user-onboarding-complete',
    false
  );
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [data, setData] = useState<OnboardingData>({
    fullName: '',
    organization: '',
    role: '',
    selectedPlatforms: [],
  });

  // Show onboarding for new authenticated users
  useEffect(() => {
    if (isAuthenticated && !hasCompletedOnboarding) {
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, hasCompletedOnboarding]);

  const steps: OnboardingStep[] = ['welcome', 'profile', 'platforms', 'complete'];
  const currentIndex = steps.indexOf(currentStep);
  const progress = ((currentIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const handlePrev = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      // Save profile data
      if (user?.id) {
        await supabase
          .from('profiles')
          .update({
            full_name: data.fullName,
            organization: data.organization,
            role: data.role,
            preferred_platforms: data.selectedPlatforms,
            onboarding_completed_at: new Date().toISOString(),
          })
          .eq('id', user.id);
      }

      setHasCompletedOnboarding(true);
      setIsOpen(false);
      toast.success('Welcome aboard! Your account is ready.');

      // Navigate to first selected platform or projects hub
      if (data.selectedPlatforms.length > 0) {
        navigate(`/projects/${data.selectedPlatforms[0]}`);
      } else {
        navigate('/projects');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      toast.error('Failed to save preferences. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    setHasCompletedOnboarding(true);
    setIsOpen(false);
  };

  const togglePlatform = (platformId: string) => {
    setData((prev) => ({
      ...prev,
      selectedPlatforms: prev.selectedPlatforms.includes(platformId)
        ? prev.selectedPlatforms.filter((id) => id !== platformId)
        : [...prev.selectedPlatforms, platformId],
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl"
        >
          <Card className="border-primary/20 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Progress bar */}
            <div className="h-1 bg-muted">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-primary/60"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Close button */}
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
              aria-label="Skip onboarding"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Step Content */}
            <div className="p-6 min-h-[400px]">
              <AnimatePresence mode="wait">
                {currentStep === 'welcome' && (
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-center space-y-6"
                  >
                    <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Welcome to Alawein Platform</h2>
                      <p className="text-muted-foreground">
                        Your unified workspace for scientific computing, AI research, and
                        optimization. Let's set up your account in just a few steps.
                      </p>
                    </div>
                    <div className="flex justify-center pt-4">
                      <Button onClick={handleNext} size="lg" className="gap-2">
                        Get Started <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <User className="w-10 h-10 text-primary mx-auto mb-2" />
                      <h2 className="text-xl font-bold">Tell us about yourself</h2>
                      <p className="text-sm text-muted-foreground">
                        This helps us personalize your experience
                      </p>
                    </div>
                    <div className="space-y-4 max-w-md mx-auto">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={data.fullName}
                          onChange={(e) =>
                            setData((prev) => ({ ...prev, fullName: e.target.value }))
                          }
                          placeholder="Dr. Jane Smith"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="organization">Organization (optional)</Label>
                        <Input
                          id="organization"
                          value={data.organization}
                          onChange={(e) =>
                            setData((prev) => ({ ...prev, organization: e.target.value }))
                          }
                          placeholder="MIT, Stanford, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role (optional)</Label>
                        <Input
                          id="role"
                          value={data.role}
                          onChange={(e) => setData((prev) => ({ ...prev, role: e.target.value }))}
                          placeholder="Researcher, Engineer, Student..."
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 'platforms' && (
                  <motion.div
                    key="platforms"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-4">
                      <Rocket className="w-10 h-10 text-primary mx-auto mb-2" />
                      <h2 className="text-xl font-bold">Choose your platforms</h2>
                      <p className="text-sm text-muted-foreground">
                        Select the tools you want to use (you can change this later)
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {PLATFORMS.map((platform) => {
                        const Icon = platform.icon;
                        const isSelected = data.selectedPlatforms.includes(platform.id);
                        return (
                          <button
                            key={platform.id}
                            onClick={() => togglePlatform(platform.id)}
                            className={`p-4 rounded-lg border-2 text-left transition-all ${
                              isSelected
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg bg-${platform.color}/10`}>
                                <Icon className={`w-5 h-5 text-${platform.color}`} />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{platform.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {platform.description}
                                </div>
                              </div>
                              {isSelected && <Check className="w-5 h-5 text-primary" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {currentStep === 'complete' && (
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-center space-y-6"
                  >
                    <div className="mx-auto w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Check className="w-10 h-10 text-green-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">You're all set!</h2>
                      <p className="text-muted-foreground">
                        Your workspace is ready. Start exploring your selected platforms and build
                        something amazing.
                      </p>
                    </div>
                    {data.selectedPlatforms.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-2">
                        {data.selectedPlatforms.map((id) => {
                          const platform = PLATFORMS.find((p) => p.id === id);
                          if (!platform) return null;
                          const Icon = platform.icon;
                          return (
                            <span
                              key={id}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-sm"
                            >
                              <Icon className="w-4 h-4" /> {platform.name}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation */}
            {currentStep !== 'welcome' && (
              <div className="flex items-center justify-between p-6 pt-0">
                <Button variant="ghost" onClick={handlePrev} disabled={currentStep === 'welcome'}>
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <span className="text-xs text-muted-foreground">
                  Step {currentIndex + 1} of {steps.length}
                </span>
                {currentStep === 'complete' ? (
                  <Button onClick={handleComplete} disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Launch Dashboard'}
                  </Button>
                ) : (
                  <Button onClick={handleNext}>
                    Continue <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default NewUserOnboarding;
