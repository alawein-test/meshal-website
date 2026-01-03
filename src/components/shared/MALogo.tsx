// MALogo - Avatar-friendly brand identity with integrated ninja
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export type MALogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface MALogoProps {
  size?: MALogoSize | number;
  linkTo?: string | null;
  className?: string;
  showGlow?: boolean;
  animated?: boolean;
}

const SIZE_MAP: Record<MALogoSize, number> = {
  xs: 28,
  sm: 36,
  md: 44,
  lg: 56,
  xl: 72,
};

/**
 * MA Logo - Avatar-friendly brand mark
 * Elegant monogram with integrated ninja silhouette
 * Perfect for headers, avatars, and brand identity
 */
export function MALogo({
  size = 'md',
  linkTo = '/',
  className = '',
  showGlow = true,
  animated = true,
}: MALogoProps) {
  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size];
  const strokeWidth = Math.max(1.5, pixelSize / 25);

  const content = (
    <motion.div
      className={`relative group ${className}`}
      whileHover={animated ? { scale: 1.05 } : undefined}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Outer glow */}
      {showGlow && (
        <div
          className="absolute inset-[-4px] rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              'linear-gradient(135deg, hsl(var(--jules-cyan)), hsl(var(--jules-magenta)), hsl(var(--jules-yellow)))',
            filter: 'blur(8px)',
          }}
        />
      )}

      {/* Logo container with gradient border */}
      <div
        className="relative rounded-xl p-[2px] overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, hsl(var(--jules-cyan)), hsl(var(--jules-magenta)), hsl(var(--jules-yellow)))',
        }}
      >
        {/* Glass shine overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background:
              'linear-gradient(135deg, hsl(0 0% 100% / 0.25) 0%, transparent 35%, transparent 65%, hsl(0 0% 100% / 0.1) 100%)',
          }}
        />

        {/* Inner container */}
        <div
          className="relative rounded-[10px] bg-jules-dark flex items-center justify-center overflow-hidden"
          style={{ width: pixelSize, height: pixelSize }}
        >
          {/* Top reflection */}
          <div
            className="absolute top-0 left-0 right-0 h-1/3 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, hsl(0 0% 100% / 0.1) 0%, transparent 100%)',
            }}
          />

          {/* MA Monogram with Ninja */}
          <svg
            width={pixelSize * 0.8}
            height={pixelSize * 0.8}
            viewBox="0 0 64 64"
            fill="none"
            className="relative z-10"
          >
            {/* Glow filter */}
            <defs>
              <filter id="maGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="cyanMagenta" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--jules-cyan))" />
                <stop offset="100%" stopColor="hsl(var(--jules-magenta))" />
              </linearGradient>
              <linearGradient id="magentaYellow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--jules-magenta))" />
                <stop offset="100%" stopColor="hsl(var(--jules-yellow))" />
              </linearGradient>
            </defs>

            {/* M letter - left */}
            <path
              d="M 12 52 L 12 18 L 22 32 L 32 18 L 32 32"
              stroke="url(#cyanMagenta)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              filter="url(#maGlow)"
            />

            {/* A letter - right */}
            <path
              d="M 32 32 L 32 52 M 32 18 L 48 52 M 52 52 L 52 18 M 36 40 L 48 40"
              stroke="url(#magentaYellow)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              filter="url(#maGlow)"
            />

            {/* Ninja head silhouette - centered top */}
            <g filter="url(#maGlow)">
              {/* Headband */}
              <rect x="24" y="6" width="16" height="3" rx="1" fill="hsl(var(--jules-magenta))" />
              <path d="M 40 7.5 L 46 6 L 45 9 L 40 8.5" fill="hsl(var(--jules-magenta))" />

              {/* Head outline */}
              <rect x="26" y="4" width="12" height="10" rx="2" fill="hsl(var(--jules-cyan))" />

              {/* Eyes */}
              <rect x="28" y="8" width="3" height="2" rx="0.5" fill="hsl(var(--jules-dark))" />
              <rect x="33" y="8" width="3" height="2" rx="0.5" fill="hsl(var(--jules-dark))" />
              <circle cx="29" cy="9" r="0.5" fill="hsl(var(--foreground))" />
              <circle cx="34" cy="9" r="0.5" fill="hsl(var(--foreground))" />
            </g>
          </svg>
        </div>
      </div>
    </motion.div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="relative z-10 block" aria-label="Home">
        {content}
      </Link>
    );
  }

  return content;
}

export default MALogo;
