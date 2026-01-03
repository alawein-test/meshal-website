/**
 * 🥷 NinjaBase - Core Pixel Art Ninja Body
 * The base ninja without accessories or effects
 */

import type { NinjaColors, NinjaEmotion } from '../types';
import { EMOTION_PATTERNS, type EyeShape } from '../config/emotions';

interface NinjaBaseProps {
  size: number;
  colors: NinjaColors;
  emotion?: NinjaEmotion;
  isBlinking?: boolean;
  bodyVariants?: Record<string, unknown>;
  transition?: Record<string, unknown>;
}

/**
 * Pixel pattern for the ninja body (10x10 grid)
 * 0 = transparent, 1 = outline, 2 = body, 3 = headband
 */
const NINJA_BODY_PATTERN = [
  [0, 0, 0, 1, 1, 1, 1, 0, 0, 0], // Row 0: Top of head
  [0, 0, 1, 2, 2, 2, 2, 1, 0, 0], // Row 1: Head top
  [0, 1, 2, 2, 2, 2, 2, 2, 1, 0], // Row 2: Head
  [0, 1, 3, 3, 3, 3, 3, 3, 1, 0], // Row 3: Headband
  [0, 1, 2, 0, 2, 2, 0, 2, 1, 0], // Row 4: Eyes row (0s are eye slots)
  [0, 0, 1, 2, 2, 2, 2, 1, 0, 0], // Row 5: Lower face
  [0, 0, 1, 2, 2, 2, 2, 1, 0, 0], // Row 6: Neck/shoulders
  [0, 1, 2, 2, 2, 2, 2, 2, 1, 0], // Row 7: Body
  [0, 1, 2, 2, 2, 2, 2, 2, 1, 0], // Row 8: Body
  [0, 0, 1, 1, 0, 0, 1, 1, 0, 0], // Row 9: Legs
];

export function NinjaBase({
  size,
  colors,
  emotion = 'neutral',
  isBlinking = false,
  bodyVariants,
  transition,
}: NinjaBaseProps) {
  const cellSize = size / 10;
  const emotionPattern = EMOTION_PATTERNS[emotion];

  // Get color for a cell value
  const getColor = (value: number): string => {
    switch (value) {
      case 0:
        return 'transparent';
      case 1:
        return colors.outline;
      case 2:
        return colors.body;
      case 3:
        return colors.headband;
      default:
        return 'transparent';
    }
  };

  // Render eye based on shape
  const renderEye = (shape: EyeShape, x: number, y: number, isLeft: boolean) => {
    const eyeY = y + (emotionPattern.yOffset || 0) * (cellSize / 4);
    const eyeColor = colors.eyes;

    // If blinking, always show closed eyes
    if (isBlinking) {
      return (
        <rect
          key={`eye-${isLeft ? 'left' : 'right'}`}
          x={x}
          y={eyeY + cellSize * 0.4}
          width={cellSize * 0.8}
          height={cellSize * 0.2}
          fill={eyeColor}
        />
      );
    }

    switch (shape) {
      case 'normal':
        return (
          <rect
            key={`eye-${isLeft ? 'left' : 'right'}`}
            x={x}
            y={eyeY}
            width={cellSize * 0.8}
            height={cellSize * 0.6}
            fill={eyeColor}
            style={{ filter: `drop-shadow(0 0 ${cellSize * 0.3}px ${colors.eyeGlow})` }}
          />
        );
      case 'closed':
        return (
          <rect
            key={`eye-${isLeft ? 'left' : 'right'}`}
            x={x}
            y={eyeY + cellSize * 0.3}
            width={cellSize * 0.8}
            height={cellSize * 0.15}
            fill={eyeColor}
          />
        );
      case 'wide':
        return (
          <rect
            key={`eye-${isLeft ? 'left' : 'right'}`}
            x={x - cellSize * 0.1}
            y={eyeY - cellSize * 0.1}
            width={cellSize}
            height={cellSize * 0.8}
            fill={eyeColor}
            style={{ filter: `drop-shadow(0 0 ${cellSize * 0.4}px ${colors.eyeGlow})` }}
          />
        );
      case 'squint':
        return (
          <rect
            key={`eye-${isLeft ? 'left' : 'right'}`}
            x={x}
            y={eyeY + cellSize * 0.2}
            width={cellSize * 0.8}
            height={cellSize * 0.25}
            fill={eyeColor}
          />
        );
      case 'heart':
        return (
          <text
            key={`eye-${isLeft ? 'left' : 'right'}`}
            x={x + cellSize * 0.4}
            y={eyeY + cellSize * 0.6}
            fontSize={cellSize * 0.8}
            textAnchor="middle"
            fill={eyeColor}
          >
            ♥
          </text>
        );
      case 'star':
        return (
          <text
            key={`eye-${isLeft ? 'left' : 'right'}`}
            x={x + cellSize * 0.4}
            y={eyeY + cellSize * 0.6}
            fontSize={cellSize * 0.8}
            textAnchor="middle"
            fill={eyeColor}
          >
            ★
          </text>
        );
      case 'wink':
        return isLeft ? (
          <rect
            key="eye-left"
            x={x}
            y={eyeY + cellSize * 0.3}
            width={cellSize * 0.8}
            height={cellSize * 0.15}
            fill={eyeColor}
          />
        ) : (
          <rect
            key="eye-right"
            x={x}
            y={eyeY}
            width={cellSize * 0.8}
            height={cellSize * 0.6}
            fill={eyeColor}
            style={{ filter: `drop-shadow(0 0 ${cellSize * 0.3}px ${colors.eyeGlow})` }}
          />
        );
      case 'dot':
        return (
          <circle
            key={`eye-${isLeft ? 'left' : 'right'}`}
            cx={x + cellSize * 0.4}
            cy={eyeY + cellSize * 0.3}
            r={cellSize * 0.15}
            fill={eyeColor}
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      variants={bodyVariants}
      transition={transition}
    >
      {/* Glow filter */}
      <defs>
        <filter id="ninjaGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={size * 0.02} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Render body pixels */}
      <g filter="url(#ninjaGlow)">
        {NINJA_BODY_PATTERN.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            // Skip eye slots (we'll render eyes separately)
            if (rowIndex === 4 && (colIndex === 3 || colIndex === 6)) {
              return null;
            }

            const color = getColor(cell);
            if (color === 'transparent') return null;

            return (
              <rect
                key={`${rowIndex}-${colIndex}`}
                x={colIndex * cellSize}
                y={rowIndex * cellSize}
                width={cellSize}
                height={cellSize}
                fill={color}
              />
            );
          })
        )}
      </g>

      {/* Render eyes */}
      <g>
        {renderEye(
          emotionPattern.left,
          3 * cellSize + cellSize * 0.1,
          4 * cellSize + cellSize * 0.2,
          true
        )}
        {renderEye(
          emotionPattern.right,
          6 * cellSize + cellSize * 0.1,
          4 * cellSize + cellSize * 0.2,
          false
        )}
      </g>

      {/* Sparkle effect for emotions that have it */}
      {emotionPattern.sparkle && !isBlinking && (
        <motion.g
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <circle cx={size * 0.25} cy={size * 0.15} r={cellSize * 0.15} fill={colors.eyeGlow} />
          <circle cx={size * 0.8} cy={size * 0.2} r={cellSize * 0.1} fill={colors.eyeGlow} />
        </motion.g>
      )}
    </motion.svg>
  );
}
