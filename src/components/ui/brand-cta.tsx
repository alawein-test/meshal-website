import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface BrandCtaProps {
  id: string; // Unique ID for localStorage persistence
  title: string;
  description: string;
  buttonText?: string;
  buttonVariant?: ButtonVariant;
  onClick?: () => void;
  onDismiss?: () => void;
  className?: string;
  dismissible?: boolean;
}

const buttonStyles: Record<ButtonVariant, string> = {
  primary: 'bg-jules-magenta hover:bg-jules-magenta/80 text-white',
  secondary: 'bg-jules-cyan hover:bg-jules-cyan/80 text-jules-dark',
  outline: 'border-2 border-jules-cyan bg-transparent text-jules-cyan hover:bg-jules-cyan/10',
};

const STORAGE_KEY_PREFIX = 'brand-cta-dismissed-';

export function BrandCta({
  id,
  title,
  description,
  buttonText = 'Get Started',
  buttonVariant = 'primary',
  onClick,
  onDismiss,
  className,
  dismissible = true,
}: BrandCtaProps) {
  const [isDismissed, setIsDismissed] = useState(true); // Start hidden to prevent flash

  useEffect(() => {
    const dismissed = localStorage.getItem(`${STORAGE_KEY_PREFIX}${id}`);
    setIsDismissed(dismissed === 'true');
  }, [id]);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${id}`, 'true');
    onDismiss?.();
  };

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{
            duration: 0.4,
            ease: [0.23, 1, 0.32, 1],
          }}
          className={cn(
            // Base styles
            'p-4 lg:p-6 rounded-lg border border-jules-cyan/30 bg-jules-surface/80 backdrop-blur-md shadow-lg',
            // Mobile: fixed bottom banner
            'fixed bottom-4 left-4 right-4 z-40',
            'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4',
            // Desktop: positioned element (caller controls placement)
            'lg:relative lg:bottom-auto lg:left-auto lg:right-auto lg:flex-col lg:items-start lg:max-w-sm',
            className
          )}
        >
          {/* Dismiss button */}
          {dismissible && (
            <motion.button
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-1.5 rounded-full text-muted-foreground hover:text-jules-cyan hover:bg-jules-cyan/10 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}

          <div className="flex-1 pr-6">
            <h3 className="text-lg lg:text-xl font-display font-bold text-jules-cyan mb-1">
              {title}
            </h3>
            <p className="text-muted-foreground text-xs lg:text-sm">{description}</p>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="shrink-0 sm:w-auto w-full lg:mt-3 lg:w-full"
          >
            <Button onClick={onClick} className={cn('w-full', buttonStyles[buttonVariant])}>
              {buttonText}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Utility to reset dismissed state (useful for testing)
export function resetBrandCtaDismissed(id: string) {
  localStorage.removeItem(`${STORAGE_KEY_PREFIX}${id}`);
}
