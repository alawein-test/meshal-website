/**
 * 🎒 NinjaAccessories - Renders accessories held/worn by ninja
 */

import type { NinjaAccessory, NinjaColors, NinjaAnimation } from '../types';
import { ACCESSORY_CONFIGS } from '../config/accessories';

interface NinjaAccessoriesProps {
  accessories: NinjaAccessory[];
  size: number;
  colors: NinjaColors;
  animation?: NinjaAnimation;
}

export function NinjaAccessories({
  accessories,
  size,
  colors,
  animation = 'idle',
}: NinjaAccessoriesProps) {
  const cellSize = size / 10;

  // Animation for lifting accessories
  const liftingVariants =
    animation === 'lifting'
      ? {
          animate: { y: [0, -size * 0.12, 0] },
          transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
        }
      : {};

  const renderAccessory = (accessory: NinjaAccessory, index: number) => {
    switch (accessory) {
      // ═══════════════════════════════════════════════════════════════════════
      // FITNESS ACCESSORIES
      // ═══════════════════════════════════════════════════════════════════════
      case 'dumbbells':
        return (
          <motion.g key={accessory} {...liftingVariants}>
            {/* Left dumbbell */}
            <g transform={`translate(${-cellSize * 0.5}, ${size * 0.5})`}>
              <rect
                x={0}
                y={0}
                width={cellSize * 1.2}
                height={cellSize * 2}
                fill={colors.accessoryPrimary}
                rx={cellSize * 0.2}
              />
              <rect
                x={cellSize * 0.3}
                y={cellSize * 0.8}
                width={cellSize * 0.6}
                height={cellSize * 0.4}
                fill={colors.accessorySecondary}
              />
            </g>
            {/* Right dumbbell */}
            <g transform={`translate(${size - cellSize * 0.7}, ${size * 0.5})`}>
              <rect
                x={0}
                y={0}
                width={cellSize * 1.2}
                height={cellSize * 2}
                fill={colors.accessoryPrimary}
                rx={cellSize * 0.2}
              />
              <rect
                x={cellSize * 0.3}
                y={cellSize * 0.8}
                width={cellSize * 0.6}
                height={cellSize * 0.4}
                fill={colors.accessorySecondary}
              />
            </g>
          </motion.g>
        );

      case 'barbell':
        return (
          <motion.g key={accessory} {...liftingVariants}>
            {/* Bar */}
            <rect
              x={-cellSize}
              y={size * 0.48}
              width={size + cellSize * 2}
              height={cellSize * 0.4}
              fill="#888888"
            />
            {/* Left weights */}
            <rect
              x={-cellSize * 1.5}
              y={size * 0.35}
              width={cellSize * 1.2}
              height={cellSize * 3}
              fill={colors.accessoryPrimary}
              rx={cellSize * 0.2}
            />
            {/* Right weights */}
            <rect
              x={size + cellSize * 0.3}
              y={size * 0.35}
              width={cellSize * 1.2}
              height={cellSize * 3}
              fill={colors.accessoryPrimary}
              rx={cellSize * 0.2}
            />
          </motion.g>
        );

      case 'kettlebell':
        return (
          <motion.g key={accessory} {...liftingVariants}>
            <g transform={`translate(${size * 0.7}, ${size * 0.55})`}>
              {/* Handle */}
              <path
                d={`M${cellSize * 0.2},0 Q${cellSize},${-cellSize * 0.8} ${cellSize * 1.8},0`}
                fill="none"
                stroke={colors.accessorySecondary}
                strokeWidth={cellSize * 0.3}
              />
              {/* Body */}
              <circle
                cx={cellSize}
                cy={cellSize * 0.8}
                r={cellSize}
                fill={colors.accessoryPrimary}
              />
            </g>
          </motion.g>
        );

      case 'protein-shake':
        return (
          <g key={accessory} transform={`translate(${size * 0.75}, ${size * 0.45})`}>
            {/* Cup */}
            <rect
              x={0}
              y={0}
              width={cellSize * 1.5}
              height={cellSize * 2.5}
              fill={colors.accessoryPrimary}
              rx={cellSize * 0.2}
            />
            {/* Lid */}
            <rect
              x={-cellSize * 0.1}
              y={-cellSize * 0.3}
              width={cellSize * 1.7}
              height={cellSize * 0.4}
              fill={colors.accessorySecondary}
              rx={cellSize * 0.1}
            />
            {/* Straw */}
            <rect
              x={cellSize * 0.6}
              y={-cellSize * 0.8}
              width={cellSize * 0.3}
              height={cellSize * 0.6}
              fill="#ffffff"
            />
          </g>
        );

      case 'muscles':
        return (
          <motion.g
            key={accessory}
            animate={animation === 'flexing' ? { scaleX: [1, 1.15, 1] } : undefined}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            {/* Left bicep bulge */}
            <ellipse
              cx={size * 0.15}
              cy={size * 0.55}
              rx={cellSize * 0.8}
              ry={cellSize * 1.2}
              fill={colors.accessoryPrimary}
              opacity={0.7}
            />
            {/* Right bicep bulge */}
            <ellipse
              cx={size * 0.85}
              cy={size * 0.55}
              rx={cellSize * 0.8}
              ry={cellSize * 1.2}
              fill={colors.accessoryPrimary}
              opacity={0.7}
            />
          </motion.g>
        );

      // ═══════════════════════════════════════════════════════════════════════
      // DEVELOPER ACCESSORIES
      // ═══════════════════════════════════════════════════════════════════════
      case 'laptop':
        return (
          <g key={accessory} transform={`translate(${size * 0.15}, ${size * 0.65})`}>
            {/* Screen */}
            <rect
              x={0}
              y={0}
              width={size * 0.7}
              height={size * 0.35}
              fill="#1a1a2e"
              stroke={colors.accessoryPrimary}
              strokeWidth={1}
              rx={2}
            />
            {/* Code lines */}
            <rect
              x={size * 0.05}
              y={size * 0.05}
              width={size * 0.3}
              height={2}
              fill={colors.accessoryPrimary}
            />
            <rect
              x={size * 0.05}
              y={size * 0.12}
              width={size * 0.4}
              height={2}
              fill={colors.accessorySecondary}
            />
            <rect
              x={size * 0.05}
              y={size * 0.19}
              width={size * 0.25}
              height={2}
              fill={colors.accessoryPrimary}
            />
            {/* Keyboard */}
            <rect
              x={0}
              y={size * 0.35}
              width={size * 0.7}
              height={size * 0.08}
              fill="#333"
              rx={1}
            />
          </g>
        );

      case 'coffee':
        return (
          <g key={accessory} transform={`translate(${size * 0.7}, ${size * 0.45})`}>
            {/* Mug */}
            <rect
              x={0}
              y={0}
              width={cellSize * 1.8}
              height={cellSize * 2}
              fill={colors.accessoryPrimary}
              rx={cellSize * 0.2}
            />
            {/* Handle */}
            <path
              d={`M${cellSize * 1.8},${cellSize * 0.3} Q${cellSize * 2.8},${cellSize} ${cellSize * 1.8},${cellSize * 1.7}`}
              fill="none"
              stroke={colors.accessoryPrimary}
              strokeWidth={cellSize * 0.3}
            />
            {/* Steam */}
            <motion.path
              d={`M${cellSize * 0.5},${-cellSize * 0.2} Q${cellSize * 0.3},${-cellSize * 0.8} ${cellSize * 0.6},${-cellSize}`}
              fill="none"
              stroke="#888"
              strokeWidth={2}
              opacity={0.5}
              animate={{ y: [0, -5, 0], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </g>
        );

      // ═══════════════════════════════════════════════════════════════════════
      // COMBAT ACCESSORIES
      // ═══════════════════════════════════════════════════════════════════════
      case 'katana':
        return (
          <g key={accessory} transform={`translate(${size * 0.85}, ${size * 0.2}) rotate(30)`}>
            {/* Blade */}
            <rect x={0} y={0} width={cellSize * 0.4} height={size * 0.7} fill="#c0c0c0" />
            {/* Handle */}
            <rect
              x={-cellSize * 0.1}
              y={size * 0.7}
              width={cellSize * 0.6}
              height={cellSize * 1.5}
              fill={colors.accessoryPrimary}
            />
            {/* Guard */}
            <rect
              x={-cellSize * 0.3}
              y={size * 0.68}
              width={cellSize}
              height={cellSize * 0.3}
              fill={colors.accessorySecondary}
            />
          </g>
        );

      case 'shuriken':
        return (
          <motion.g
            key={accessory}
            animate={
              animation === 'throwing'
                ? { x: [0, size], rotate: [0, 720], opacity: [1, 0] }
                : { rotate: [0, 360] }
            }
            transition={
              animation === 'throwing'
                ? { duration: 0.5 }
                : { duration: 3, repeat: Infinity, ease: 'linear' }
            }
          >
            <g transform={`translate(${size * 0.05}, ${size * 0.45})`}>
              <path
                d={`M${cellSize},0 L${cellSize * 1.3},${cellSize * 0.7} L${cellSize * 2},${cellSize} L${cellSize * 1.3},${cellSize * 1.3} L${cellSize},${cellSize * 2} L${cellSize * 0.7},${cellSize * 1.3} L0,${cellSize} L${cellSize * 0.7},${cellSize * 0.7} Z`}
                fill={colors.accessoryPrimary}
              />
            </g>
          </motion.g>
        );

      case 'headband':
        return (
          <g key={accessory}>
            {/* Already part of base ninja, but can add decorations */}
            <rect
              x={size * 0.15}
              y={size * 0.28}
              width={cellSize * 0.6}
              height={cellSize * 0.4}
              fill={colors.accessorySecondary}
            />
          </g>
        );

      case 'sunglasses':
        return (
          <g key={accessory} transform={`translate(${size * 0.2}, ${size * 0.38})`}>
            {/* Left lens */}
            <rect
              x={0}
              y={0}
              width={cellSize * 2}
              height={cellSize}
              fill="#111"
              rx={cellSize * 0.2}
            />
            {/* Right lens */}
            <rect
              x={cellSize * 2.5}
              y={0}
              width={cellSize * 2}
              height={cellSize}
              fill="#111"
              rx={cellSize * 0.2}
            />
            {/* Bridge */}
            <rect
              x={cellSize * 2}
              y={cellSize * 0.3}
              width={cellSize * 0.5}
              height={cellSize * 0.4}
              fill="#333"
            />
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    >
      {accessories.map((accessory, index) => renderAccessory(accessory, index))}
    </svg>
  );
}
