// Cyberpunk-styled loading skeleton component
import { motion, Transition } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'avatar' | 'button' | 'chart';
  count?: number;
}

const shimmerTransition: Transition = {
  duration: 2,
  repeat: Infinity,
  ease: 'linear' as const,
};

export function LoadingSkeleton({ className, variant = 'text', count = 1 }: LoadingSkeletonProps) {
  const baseClasses = 'relative overflow-hidden bg-jules-surface/50 border border-jules-cyan/10';

  const variants = {
    text: 'h-4 rounded',
    card: 'h-48 rounded-xl',
    avatar: 'w-12 h-12 rounded-full',
    button: 'h-10 w-24 rounded-lg',
    chart: 'h-64 rounded-xl',
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={cn(baseClasses, variants[variant], className)}
          style={{
            background: `linear-gradient(
              90deg,
              hsl(var(--jules-surface) / 0.5) 0%,
              hsl(var(--jules-cyan) / 0.1) 50%,
              hsl(var(--jules-surface) / 0.5) 100%
            )`,
            backgroundSize: '200% 100%',
          }}
          animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
          transition={shimmerTransition}
        >
          {/* Scan line effect */}
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                'linear-gradient(180deg, transparent 0%, hsl(var(--jules-cyan) / 0.2) 50%, transparent 100%)',
              backgroundSize: '100% 20px',
            }}
            animate={{ backgroundPosition: ['0 -100%', '0 200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' as const }}
          />
        </motion.div>
      ))}
    </>
  );
}

// Page-level loading skeleton
export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-jules-dark">
      {/* Header skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-jules-dark/90 backdrop-blur-xl border-b border-jules-cyan/10">
        <div className="container px-4 h-full flex items-center justify-between">
          <LoadingSkeleton variant="button" className="w-32" />
          <div className="hidden md:flex gap-4">
            <LoadingSkeleton variant="button" className="w-20" />
            <LoadingSkeleton variant="button" className="w-20" />
            <LoadingSkeleton variant="button" className="w-20" />
          </div>
          <LoadingSkeleton variant="avatar" className="w-8 h-8" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="container px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Title */}
          <div className="space-y-4 text-center">
            <LoadingSkeleton variant="text" className="h-12 w-64 mx-auto" />
            <LoadingSkeleton variant="text" className="h-6 w-96 mx-auto" />
          </div>

          {/* Cards grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard loading skeleton
export function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            className="p-6 rounded-xl bg-jules-surface/30 border border-jules-cyan/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <LoadingSkeleton variant="text" className="h-4 w-20 mb-2" />
            <LoadingSkeleton variant="text" className="h-8 w-16" />
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div
        className="rounded-xl bg-jules-surface/30 border border-jules-cyan/10 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <LoadingSkeleton variant="text" className="h-6 w-40 mb-4" />
        <LoadingSkeleton variant="chart" />
      </motion.div>

      {/* Table */}
      <motion.div
        className="rounded-xl bg-jules-surface/30 border border-jules-cyan/10 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <LoadingSkeleton variant="text" className="h-6 w-32 mb-4" />
        <div className="space-y-3">
          <LoadingSkeleton variant="text" className="h-10" />
          <LoadingSkeleton variant="text" className="h-10" />
          <LoadingSkeleton variant="text" className="h-10" />
          <LoadingSkeleton variant="text" className="h-10" />
        </div>
      </motion.div>
    </div>
  );
}

export default LoadingSkeleton;
