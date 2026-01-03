import React from 'react';

export interface NinjaIconProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  variant?: 'default' | 'happy' | 'wink' | 'thinking' | 'coding' | 'celebrating';
  className?: string;
  showGlow?: boolean;
  weapon?: 'katana' | 'shuriken' | 'none';
  glowingBlade?: boolean; // Star Wars style glowing blade
  'aria-label'?: string;
  /** @deprecated Use weapon="katana" instead */
  showKatana?: boolean;
}

// Unified Jules Ninja Master Pattern (16x16 grid) - Single Source of Truth
// This is the FULL BODY ninja with mask eye holes - matches PixelNinja sword ninja
// Colors: 0=transparent, 1=cyan (body), 2=magenta (eyes/accents)
export const NINJA_PATTERN = [
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 1, 0], // eyes row
  [0, 1, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 1, 0], // eyes row continued
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1], // arms out
  [1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0], // legs
  [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
];

// Expression variants
export const NINJA_PATTERN_HAPPY = [
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
];

export const NINJA_PATTERN_WINK = [
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 2, 2, 1, 1, 1, 2, 2, 2, 1, 1, 0],
  [0, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
];

export const NINJA_PATTERN_THINKING = [
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
];

export const NINJA_PATTERN_CODING = [
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 1, 0],
  [0, 1, 1, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
];

export const NINJA_PATTERN_CELEBRATING = [
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
];

const PATTERN_MAP = {
  default: NINJA_PATTERN,
  happy: NINJA_PATTERN_HAPPY,
  wink: NINJA_PATTERN_WINK,
  thinking: NINJA_PATTERN_THINKING,
  coding: NINJA_PATTERN_CODING,
  celebrating: NINJA_PATTERN_CELEBRATING,
};

const SIZE_MAP = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 128,
};

// Shuriken path for weapon option
const SHURIKEN_PATH = 'M12 2L14 10H22L12 14L14 22L12 18L10 22L12 14L2 10H10L12 2Z';

export const NinjaIcon: React.FC<NinjaIconProps> = ({
  size = 'md',
  variant = 'default',
  className = '',
  showGlow = false,
  weapon = 'katana',
  glowingBlade = true,
  showKatana, // deprecated
  'aria-label': ariaLabel = 'Ninja icon',
}) => {
  // Handle deprecated showKatana prop
  const effectiveWeapon = showKatana !== undefined ? (showKatana ? 'katana' : 'none') : weapon;

  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size];
  const cellSize = pixelSize / 16;
  const pattern = PATTERN_MAP[variant];

  // Calculate total width based on weapon
  const hasWeapon = effectiveWeapon !== 'none';
  const totalWidth = hasWeapon ? pixelSize * 1.5 : pixelSize;

  const getColor = (value: number): string => {
    switch (value) {
      case 0:
        return 'transparent';
      case 1:
        return 'hsl(var(--jules-cyan))'; // Body - cyan
      case 2:
        return 'hsl(var(--jules-purple))'; // Eyes - purple luminescent
      case 3:
        return '#ffffff';
      case 4:
        return 'hsl(var(--jules-cyan) / 0.6)';
      default:
        return 'transparent';
    }
  };

  // Generate unique ID for this instance
  const instanceId = React.useId();

  return (
    <svg
      width={totalWidth}
      height={pixelSize}
      viewBox={`0 0 ${totalWidth} ${pixelSize}`}
      className={className}
      role="img"
      aria-label={ariaLabel}
      data-testid="ninja-icon"
    >
      <title>{ariaLabel}</title>
      <defs>
        {showGlow && (
          <filter id={`ninja-glow-${instanceId}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
        {/* Star Wars style blade glow */}
        {effectiveWeapon === 'katana' && glowingBlade && (
          <>
            <linearGradient id={`blade-gradient-${instanceId}`} x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--jules-cyan))" stopOpacity="1" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="100%" stopColor="hsl(var(--jules-cyan))" stopOpacity="0.8" />
            </linearGradient>
            <filter id={`blade-glow-${instanceId}`} x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="3" result="blur1" />
              <feGaussianBlur stdDeviation="1" result="blur2" />
              <feMerge>
                <feMergeNode in="blur1" />
                <feMergeNode in="blur2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </>
        )}
        {/* Shuriken glow */}
        {effectiveWeapon === 'shuriken' && (
          <filter id={`shuriken-glow-${instanceId}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      <g filter={showGlow ? `url(#ninja-glow-${instanceId})` : undefined}>
        {pattern.map((row, y) =>
          row.map((cell, x) =>
            cell !== 0 ? (
              <rect
                key={`${x}-${y}`}
                x={x * cellSize}
                y={y * cellSize}
                width={cellSize}
                height={cellSize}
                fill={getColor(cell)}
              />
            ) : null
          )
        )}

        {/* Katana sword with Star Wars glow */}
        {effectiveWeapon === 'katana' && (
          <g transform={`translate(${pixelSize * 0.9}, ${pixelSize * 0.1})`}>
            {/* Handle (tsuka) */}
            <rect
              x={cellSize * 1}
              y={cellSize * 10}
              width={cellSize * 1.5}
              height={cellSize * 4}
              fill="hsl(var(--jules-magenta))"
            />
            {/* Guard (tsuba) */}
            <rect
              x={cellSize * 0.5}
              y={cellSize * 9}
              width={cellSize * 2.5}
              height={cellSize * 1.5}
              fill="hsl(var(--jules-magenta))"
              rx={cellSize * 0.3}
            />
            {/* Blade with glow */}
            <g filter={glowingBlade ? `url(#blade-glow-${instanceId})` : undefined}>
              <polygon
                points={`
                  ${cellSize * 1.75},${cellSize * 9}
                  ${cellSize * 2.5},${cellSize * 0}
                  ${cellSize * 1},${cellSize * 0}
                  ${cellSize * 1},${cellSize * 9}
                `}
                fill={glowingBlade ? `url(#blade-gradient-${instanceId})` : '#e0e7ff'}
              />
              {/* Inner glow core */}
              {glowingBlade && (
                <line
                  x1={cellSize * 1.75}
                  y1={cellSize * 0.5}
                  x2={cellSize * 1.4}
                  y2={cellSize * 8.5}
                  stroke="white"
                  strokeWidth={cellSize * 0.4}
                  opacity={0.9}
                />
              )}
            </g>
          </g>
        )}

        {/* Shuriken */}
        {effectiveWeapon === 'shuriken' && (
          <g
            transform={`translate(${pixelSize * 1.05}, ${pixelSize * 0.15}) scale(${pixelSize / 48})`}
            filter={`url(#shuriken-glow-${instanceId})`}
          >
            <path d={SHURIKEN_PATH} fill="hsl(var(--jules-cyan))" />
          </g>
        )}
      </g>
    </svg>
  );
};

// Generate SVG string for export/favicon
export const getNinjaSvgString = (
  size: number = 64,
  variant: keyof typeof PATTERN_MAP = 'default'
): string => {
  const cellSize = size / 16;
  const pattern = PATTERN_MAP[variant];

  const getColor = (value: number): string => {
    switch (value) {
      case 0:
        return 'transparent';
      case 1:
        return '#06b6d4';
      case 2:
        return '#ec4899';
      case 3:
        return '#ffffff';
      case 4:
        return 'rgba(6, 182, 212, 0.6)';
      default:
        return 'transparent';
    }
  };

  const rects = pattern
    .flatMap((row, y) =>
      row.map((cell, x) =>
        cell !== 0
          ? `<rect x="${x * cellSize}" y="${y * cellSize}" width="${cellSize}" height="${cellSize}" fill="${getColor(cell)}"/>`
          : ''
      )
    )
    .filter(Boolean)
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${rects}</svg>`;
};

export default NinjaIcon;
