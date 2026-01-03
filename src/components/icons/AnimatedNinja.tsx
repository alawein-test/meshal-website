import React, { useState, useEffect } from 'react';
import { motion, Transition } from 'framer-motion';
import { NINJA_PATTERN, NINJA_PATTERN_WINK } from './NinjaIcon';

export interface AnimatedNinjaProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  animation?: 'idle' | 'wave' | 'bounce' | 'pulse' | 'none';
  enableBlink?: boolean;
  className?: string;
  onClick?: () => void;
  'aria-label'?: string;
}

const SIZE_MAP = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 128,
};

type AnimationType = 'idle' | 'wave' | 'bounce' | 'pulse' | 'none';

interface AnimateConfig {
  scale?: number[];
  rotate?: number[];
  y?: number[];
}

const getAnimationConfig = (
  animation: AnimationType
): { animate: AnimateConfig; transition: Transition } | null => {
  switch (animation) {
    case 'idle':
      return {
        animate: { scale: [1, 1.02, 1] },
        transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const },
      };
    case 'wave':
      return {
        animate: { rotate: [0, -10, 10, -10, 0] },
        transition: { duration: 0.5, repeat: Infinity, repeatDelay: 2 },
      };
    case 'bounce':
      return {
        animate: { y: [0, -4, 0] },
        transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' as const },
      };
    case 'pulse':
      return {
        animate: { scale: [1, 1.1, 1] },
        transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' as const },
      };
    default:
      return null;
  }
};

export const AnimatedNinja: React.FC<AnimatedNinjaProps> = ({
  size = 'md',
  animation = 'idle',
  enableBlink = true,
  className = '',
  onClick,
  'aria-label': ariaLabel = 'Animated ninja icon',
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size];
  const cellSize = pixelSize / 10;

  // Random blinking effect
  useEffect(() => {
    if (!enableBlink) return;

    const blink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.7) blink();
    }, 2000);

    return () => clearInterval(interval);
  }, [enableBlink]);

  const pattern = isBlinking ? NINJA_PATTERN_WINK : NINJA_PATTERN;

  const getColor = (value: number): string => {
    switch (value) {
      case 0:
        return 'transparent';
      case 1:
        return 'hsl(var(--jules-cyan))';
      case 2:
        return 'hsl(var(--jules-magenta))';
      case 3:
        return 'hsl(var(--jules-magenta))';
      default:
        return 'transparent';
    }
  };

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animConfig = prefersReducedMotion ? null : getAnimationConfig(animation);

  return (
    <motion.div
      className={`inline-flex items-center justify-center ${className}`}
      animate={animConfig?.animate}
      transition={animConfig?.transition}
      whileHover={onClick ? { scale: 1.1 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      data-testid="animated-ninja"
      role="img"
      aria-label={ariaLabel}
    >
      <svg width={pixelSize} height={pixelSize} viewBox={`0 0 ${pixelSize} ${pixelSize}`}>
        <title>{ariaLabel}</title>
        <defs>
          <filter id="animated-ninja-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g filter="url(#animated-ninja-glow)">
          {pattern.map((row, y) =>
            row.map((cell, x) =>
              cell !== 0 ? (
                <motion.rect
                  key={`${x}-${y}`}
                  x={x * cellSize}
                  y={y * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill={getColor(cell)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (x + y) * 0.02 }}
                />
              ) : null
            )
          )}
        </g>
      </svg>
    </motion.div>
  );
};

export default AnimatedNinja;
