import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Sparkles, Palette, Layout, Zap, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  position: 'center' | 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to AlaweinOS',
    description:
      "Your quantum-powered design and development platform. Let's take a quick tour of the key features.",
    icon: <Sparkles className="w-8 h-8" />,
    position: 'center',
  },
  {
    id: 'projects',
    title: 'Project Hub',
    description:
      'Access all your projects in one place. Each project has its own dashboard with real-time data and controls.',
    icon: <Layout className="w-8 h-8" />,
    position: 'center',
  },
  {
    id: 'themes',
    title: 'Theme System',
    description:
      'Customize your experience with multiple themes. Press the theme switcher in the navigation to explore options.',
    icon: <Palette className="w-8 h-8" />,
    position: 'center',
  },
  {
    id: 'shortcuts',
    title: 'Keyboard Shortcuts',
    description:
      'Work faster with keyboard shortcuts. Press Ctrl+K to open the command palette, or ? to see all shortcuts.',
    icon: <Zap className="w-8 h-8" />,
    position: 'center',
  },
  {
    id: 'complete',
    title: "You're All Set!",
    description:
      'Explore the platform and build something amazing. You can restart this tour anytime from Settings.',
    icon: <Check className="w-8 h-8" />,
    position: 'center',
  },
];

export function OnboardingTour() {
  const [hasSeenTour, setHasSeenTour] = useLocalStorage('onboarding-complete', false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const location = useLocation();

  // Only show on main pages, not on preview, auth, or landing routes
  const shouldShowTour =
    !location.pathname.startsWith('/preview') &&
    !location.pathname.startsWith('/auth') &&
    location.pathname !== '/';

  useEffect(() => {
    if (!hasSeenTour && shouldShowTour) {
      // Delayed appearance for less intrusive experience
      const timer = setTimeout(() => setIsOpen(true), 3000);
      return () => clearTimeout(timer);
    } else {
      setIsOpen(false);
    }
  }, [hasSeenTour, shouldShowTour]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setHasSeenTour(true);
    setIsOpen(false);
    setCurrentStep(0);
  };

  const handleSkip = () => {
    setHasSeenTour(true);
    setIsOpen(false);
  };

  const step = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center"
      >
        {/* Backdrop - clicking closes the tour */}
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={handleSkip} />

        {/* Tour Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <Card className="relative w-[90vw] max-w-md p-6 border-primary/20 bg-card/95 backdrop-blur-xl shadow-2xl">
            {/* Close button */}
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted transition-colors"
              aria-label="Close tour"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-muted rounded-t-lg overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-primary/60"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Step indicator */}
            <div className="flex justify-center gap-1.5 mb-6 mt-2">
              {tourSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'bg-primary w-6'
                      : index < currentStep
                        ? 'bg-primary/60'
                        : 'bg-muted'
                  }`}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="text-center"
              >
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>

              <span className="text-xs text-muted-foreground">
                {currentStep + 1} of {tourSteps.length}
              </span>

              <Button size="sm" onClick={handleNext} className="gap-1">
                {currentStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}
                {currentStep < tourSteps.length - 1 && <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>

            {/* Don't show again option */}
            {currentStep < tourSteps.length - 1 && (
              <button
                onClick={handleSkip}
                className="block mx-auto mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-2 hover:underline"
              >
                Don't show this again
              </button>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function useOnboardingTour() {
  const [hasSeenTour, setHasSeenTour] = useLocalStorage('onboarding-complete', false);

  const restartTour = () => {
    setHasSeenTour(false);
    window.location.reload();
  };

  return { hasSeenTour, restartTour };
}
