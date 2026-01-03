/**
 * 💦 SweatDrops - Animated sweat/tears effect
 */

import type { NinjaColors } from '../types';

interface SweatDropsProps {
  type: 'sweat' | 'tears';
  colors: NinjaColors;
  size: number;
  count?: number;
}

export function SweatDrops({ type, colors, size, count = 3 }: SweatDropsProps) {
  const drops = Array.from({ length: count }, (_, i) => i);

  const dropColor = type === 'sweat' ? '#87CEEB' : '#6BB3D9';

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    >
      {drops.map((i) => {
        const delay = i * 0.3;
        const startX = size * (0.3 + i * 0.2);
        const startY = type === 'sweat' ? size * 0.3 : size * 0.45;

        return (
          <motion.ellipse
            key={i}
            cx={startX}
            cy={startY}
            rx={size * 0.03}
            ry={size * 0.05}
            fill={dropColor}
            initial={{ opacity: 0, y: 0 }}
            animate={{
              opacity: [0, 0.8, 0],
              y: [0, size * 0.4],
              scaleY: [1, 1.5, 0.5],
            }}
            transition={{
              duration: 1.5,
              delay,
              repeat: Infinity,
              ease: 'easeIn',
            }}
          />
        );
      })}
    </svg>
  );
}

/**
 * ✨ Sparkles - Celebration/happy sparkle effect
 */
interface SparklesProps {
  colors: NinjaColors;
  size: number;
  count?: number;
}

export function Sparkles({ colors, size, count = 5 }: SparklesProps) {
  const sparkles = Array.from({ length: count }, (_, i) => i);

  return (
    <svg
      width={size * 1.5}
      height={size * 1.5}
      viewBox={`0 0 ${size * 1.5} ${size * 1.5}`}
      style={{
        position: 'absolute',
        top: -size * 0.25,
        left: -size * 0.25,
        pointerEvents: 'none',
      }}
    >
      {sparkles.map((i) => {
        const angle = (i / count) * Math.PI * 2;
        const radius = size * 0.5 + Math.random() * size * 0.2;
        const x = size * 0.75 + Math.cos(angle) * radius;
        const y = size * 0.75 + Math.sin(angle) * radius;
        const sparkleSize = size * 0.04 + Math.random() * size * 0.03;

        return (
          <motion.g key={i}>
            {/* Star shape */}
            <motion.path
              d={`M${x},${y - sparkleSize} L${x + sparkleSize * 0.3},${y - sparkleSize * 0.3} L${x + sparkleSize},${y} L${x + sparkleSize * 0.3},${y + sparkleSize * 0.3} L${x},${y + sparkleSize} L${x - sparkleSize * 0.3},${y + sparkleSize * 0.3} L${x - sparkleSize},${y} L${x - sparkleSize * 0.3},${y - sparkleSize * 0.3} Z`}
              fill={colors.eyeGlow}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 1,
                delay: i * 0.15,
                repeat: Infinity,
                repeatDelay: 0.5,
              }}
            />
          </motion.g>
        );
      })}
    </svg>
  );
}

/**
 * 💨 SmokeEffect - Poof/disappear smoke
 */
interface SmokeEffectProps {
  colors: NinjaColors;
  size: number;
  visible: boolean;
}

export function SmokeEffect({ colors, size, visible }: SmokeEffectProps) {
  if (!visible) return null;

  const puffs = Array.from({ length: 8 }, (_, i) => i);

  return (
    <svg
      width={size * 2}
      height={size * 2}
      viewBox={`0 0 ${size * 2} ${size * 2}`}
      style={{
        position: 'absolute',
        top: -size * 0.5,
        left: -size * 0.5,
        pointerEvents: 'none',
      }}
    >
      {puffs.map((i) => {
        const angle = (i / puffs.length) * Math.PI * 2;
        const x = size + Math.cos(angle) * size * 0.2;
        const y = size + Math.sin(angle) * size * 0.2;

        return (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={size * 0.15}
            fill={colors.outline}
            opacity={0.6}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{
              scale: [0, 2, 3],
              opacity: [0.8, 0.4, 0],
              x: [0, Math.cos(angle) * size * 0.6],
              y: [0, Math.sin(angle) * size * 0.4 - size * 0.3],
            }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        );
      })}
    </svg>
  );
}
