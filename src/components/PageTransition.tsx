import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ReactNode, useState, useEffect } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.98,
    filter: 'blur(8px)',
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    filter: 'blur(4px)',
    transition: {
      duration: 0.25,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// Cyberpunk scan line effect overlay
const ScanLineOverlay = () => (
  <motion.div
    className="fixed inset-0 pointer-events-none z-50"
    initial={{ opacity: 1 }}
    animate={{ opacity: 0 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    <motion.div
      className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-jules-cyan to-transparent"
      initial={{ top: 0 }}
      animate={{ top: '100%' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      style={{
        boxShadow: '0 0 15px hsl(var(--jules-cyan)), 0 0 30px hsl(var(--jules-cyan) / 0.4)',
      }}
    />
  </motion.div>
);

// Corner accents animation
const CornerAccents = () => (
  <motion.div
    className="fixed inset-0 pointer-events-none z-40"
    initial={{ opacity: 1 }}
    animate={{ opacity: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    {/* Top left */}
    <motion.div
      className="absolute top-0 left-0 w-16 h-16"
      initial={{ x: -100, y: -100, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute top-4 left-0 w-8 h-0.5 bg-jules-cyan" />
      <div className="absolute top-0 left-4 w-0.5 h-8 bg-jules-cyan" />
    </motion.div>

    {/* Top right */}
    <motion.div
      className="absolute top-0 right-0 w-16 h-16"
      initial={{ x: 100, y: -100, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.05 }}
    >
      <div className="absolute top-4 right-0 w-8 h-0.5 bg-jules-magenta" />
      <div className="absolute top-0 right-4 w-0.5 h-8 bg-jules-magenta" />
    </motion.div>

    {/* Bottom left */}
    <motion.div
      className="absolute bottom-0 left-0 w-16 h-16"
      initial={{ x: -100, y: 100, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="absolute bottom-4 left-0 w-8 h-0.5 bg-jules-yellow" />
      <div className="absolute bottom-0 left-4 w-0.5 h-8 bg-jules-yellow" />
    </motion.div>

    {/* Bottom right */}
    <motion.div
      className="absolute bottom-0 right-0 w-16 h-16"
      initial={{ x: 100, y: 100, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.15 }}
    >
      <div className="absolute bottom-4 right-0 w-8 h-0.5 bg-jules-green" />
      <div className="absolute bottom-0 right-4 w-0.5 h-8 bg-jules-green" />
    </motion.div>
  </motion.div>
);

// Glitch effect on transition
const GlitchOverlay = () => (
  <motion.div
    className="fixed inset-0 pointer-events-none z-40"
    initial={{ opacity: 0.2 }}
    animate={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <motion.div
      className="absolute inset-0 bg-jules-cyan/5"
      animate={{
        x: [0, -3, 3, -2, 0],
        opacity: [0.2, 0.3, 0.1, 0.25, 0],
      }}
      transition={{ duration: 0.2 }}
    />
    <motion.div
      className="absolute inset-0 bg-jules-magenta/5"
      animate={{
        x: [0, 3, -3, 2, 0],
        opacity: [0.1, 0.25, 0.2, 0.3, 0],
      }}
      transition={{ duration: 0.2, delay: 0.03 }}
    />
  </motion.div>
);

// Grid reveal effect
const GridReveal = () => (
  <motion.div
    className="fixed inset-0 pointer-events-none z-30"
    initial={{ opacity: 0.3 }}
    animate={{ opacity: 0 }}
    transition={{ duration: 0.8 }}
  >
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(hsl(var(--jules-cyan) / 0.03) 1px, transparent 1px),
          linear-gradient(90deg, hsl(var(--jules-cyan) / 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }}
    />
  </motion.div>
);

const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const [showEffects, setShowEffects] = useState(false);

  // Reduced motion variants - instant transitions
  const reducedMotionVariants: Variants = {
    initial: { opacity: 0 },
    enter: { opacity: 1, transition: { duration: 0.1 } },
    exit: { opacity: 0, transition: { duration: 0.1 } },
  };

  // Show effects on route change (only if motion is allowed)
  useEffect(() => {
    if (prefersReducedMotion) return;
    setShowEffects(true);
    const timer = setTimeout(() => setShowEffects(false), 600);
    return () => clearTimeout(timer);
  }, [location.pathname, prefersReducedMotion]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={prefersReducedMotion ? reducedMotionVariants : pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="min-h-screen"
      >
        {showEffects && !prefersReducedMotion && (
          <>
            <ScanLineOverlay />
            <CornerAccents />
            <GlitchOverlay />
            <GridReveal />
          </>
        )}
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
