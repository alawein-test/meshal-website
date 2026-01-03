// Glitch text effect component for cyberpunk styling
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ANIMATION, INTERVAL } from '@/utils/timing';

interface GlitchTextProps {
  text: string;
  className?: string;
  glitchIntensity?: 'low' | 'medium' | 'high';
}

export const GlitchText = ({
  text,
  className = '',
  glitchIntensity = 'medium',
}: GlitchTextProps) => {
  const [isGlitching, setIsGlitching] = useState(false);

  const intensityConfig = {
    low: { interval: INTERVAL.TAGLINE_ROTATION, duration: ANIMATION.BLINK },
    medium: { interval: ANIMATION.HACKING, duration: ANIMATION.QUICK },
    high: { interval: ANIMATION.WAVE, duration: ANIMATION.STANDARD },
  };

  const config = intensityConfig[glitchIntensity];

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), config.duration);
    }, config.interval);

    return () => clearInterval(glitchInterval);
  }, [config]);

  return (
    <span className={`relative inline-block ${className}`}>
      {/* Base text */}
      <span className="relative z-10">{text}</span>

      {/* Glitch layers */}
      <motion.span
        className="absolute top-0 left-0 z-20 text-jules-cyan opacity-80"
        style={{ clipPath: 'inset(10% 0 60% 0)' }}
        animate={
          isGlitching
            ? {
                x: [-2, 2, -1, 3, 0],
                opacity: [0.8, 0.6, 0.9, 0.5, 0],
              }
            : { x: 0, opacity: 0 }
        }
        transition={{ duration: 0.2, ease: 'linear' }}
      >
        {text}
      </motion.span>

      <motion.span
        className="absolute top-0 left-0 z-20 text-jules-magenta opacity-80"
        style={{ clipPath: 'inset(50% 0 20% 0)' }}
        animate={
          isGlitching
            ? {
                x: [2, -2, 1, -3, 0],
                opacity: [0.8, 0.5, 0.7, 0.6, 0],
              }
            : { x: 0, opacity: 0 }
        }
        transition={{ duration: 0.2, ease: 'linear' }}
      >
        {text}
      </motion.span>

      <motion.span
        className="absolute top-0 left-0 z-20 text-jules-purple opacity-60"
        style={{ clipPath: 'inset(70% 0 5% 0)' }}
        animate={
          isGlitching
            ? {
                x: [-1, 3, -2, 1, 0],
                y: [1, -1, 2, -1, 0],
                opacity: [0.6, 0.4, 0.8, 0.3, 0],
              }
            : { x: 0, y: 0, opacity: 0 }
        }
        transition={{ duration: 0.15, ease: 'linear' }}
      >
        {text}
      </motion.span>

      {/* Scanline effect during glitch */}
      {isGlitching && (
        <motion.span
          className="absolute inset-0 z-30 pointer-events-none"
          style={{
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--jules-cyan) / 0.03) 2px, hsl(var(--jules-cyan) / 0.03) 4px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 0.2 }}
        />
      )}
    </span>
  );
};

export default GlitchText;
