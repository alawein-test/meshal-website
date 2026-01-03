/**
 * 🥷 Ninja - Unified Ninja Component
 *
 * A flexible, customizable ninja mascot that can be used across all projects.
 *
 * @example
 * // REPZ - Fitness ninja with dumbbells
 * <Ninja
 *   variant="fitness"
 *   emotion="happy"
 *   accessories={["dumbbells"]}
 *   colorScheme="coral"
 *   animation="lifting"
 *   speechBubble="One more rep! 💪"
 * />
 *
 * // Main website - Dev ninja typing
 * <Ninja
 *   variant="developer"
 *   emotion="focused"
 *   accessories={["laptop", "coffee"]}
 *   colorScheme="purple-cyan"
 *   animation="typing"
 * />
 */

import { useState, useEffect, useCallback } from 'react';
import type { NinjaProps, NinjaColors } from './types';
import { NinjaBase } from './parts/NinjaBase';
import { NinjaAccessories } from './parts/NinjaAccessories';
import { SpeechBubble } from './effects/SpeechBubble';
import { SweatDrops, Sparkles, SmokeEffect } from './effects/SweatDrops';
import { ANIMATION_CONFIGS } from './config/animations';
import { EMOTION_PATTERNS } from './config/emotions';
import {
  CORAL_SCHEME,
  PURPLE_CYAN_SCHEME,
  STEALTH_SCHEME,
  GOLDEN_SCHEME,
  getColorScheme,
} from './config/colorSchemes';

// ═══════════════════════════════════════════════════════════════════════════
// VARIANT PRESETS
// ═══════════════════════════════════════════════════════════════════════════

const VARIANT_PRESETS: Record<string, Partial<NinjaProps>> = {
  default: {},
  fitness: {
    colorScheme: 'coral',
    accessories: ['dumbbells'],
    animation: 'idle',
  },
  developer: {
    colorScheme: 'purple-cyan',
    accessories: ['laptop'],
    animation: 'typing',
  },
  coach: {
    colorScheme: 'coral',
    emotion: 'happy',
    animation: 'idle',
  },
  sensei: {
    colorScheme: 'golden',
    emotion: 'proud',
    animation: 'idle',
  },
};

export function Ninja({
  variant = 'default',
  emotion = 'neutral',
  animation = 'idle',
  accessories = [],
  colorScheme = 'coral',
  customColors,
  speechBubble,
  size = 80,
  showEffects = true,
  interactive = false,
  onClick,
  onHover,
  className,
  style,
}: NinjaProps) {
  // Merge variant presets with explicit props
  const preset = VARIANT_PRESETS[variant] || {};
  const finalEmotion = emotion || preset.emotion || 'neutral';
  const finalAnimation = animation || preset.animation || 'idle';
  const finalAccessories = accessories.length > 0 ? accessories : preset.accessories || [];
  const finalColorScheme = colorScheme || preset.colorScheme || 'coral';

  // State
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showSmoke, setShowSmoke] = useState(false);
  const [showBubble, setShowBubble] = useState(!!speechBubble);

  // Get colors
  const colors: NinjaColors = customColors || getColorScheme(finalColorScheme);

  // Animation config
  const animConfig = ANIMATION_CONFIGS[finalAnimation] || {};
  const emotionPattern = EMOTION_PATTERNS[finalEmotion];

  // Blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7 && finalEmotion !== 'sleeping') {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 3000);

    return () => clearInterval(blinkInterval);
  }, [finalEmotion]);

  // Handle interactions
  const handleClick = useCallback(() => {
    if (interactive) {
      setShowSmoke(true);
      setTimeout(() => setShowSmoke(false), 600);
    }
    onClick?.();
  }, [interactive, onClick]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (speechBubble) setShowBubble(true);
    onHover?.(true);
  }, [speechBubble, onHover]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (speechBubble && typeof speechBubble !== 'string') {
      // Keep bubble visible if it's a persistent tip
    } else {
      setShowBubble(false);
    }
    onHover?.(false);
  }, [speechBubble, onHover]);

  return (
    <motion.div
      className={className}
      style={{
        position: 'relative',
        width: size,
        height: size,
        cursor: interactive ? 'pointer' : 'default',
        ...style,
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={interactive ? { scale: 1.05 } : undefined}
      whileTap={interactive ? { scale: 0.95 } : undefined}
    >
      {/* Main ninja body */}
      <motion.div animate={animConfig.body?.animate} transition={animConfig.transition}>
        <NinjaBase
          size={size}
          colors={colors}
          emotion={finalEmotion}
          isBlinking={isBlinking}
          bodyVariants={animConfig.body}
          transition={animConfig.transition}
        />
      </motion.div>

      {/* Accessories layer */}
      {finalAccessories.length > 0 && (
        <NinjaAccessories
          accessories={finalAccessories}
          size={size}
          colors={colors}
          animation={finalAnimation}
        />
      )}

      {/* Effects */}
      {showEffects && (
        <>
          {/* Sweat drops for tired/sweating */}
          {(finalEmotion === 'tired' || finalAnimation === 'sweating') && (
            <SweatDrops type="sweat" colors={colors} size={size} />
          )}

          {/* Sparkles for happy/excited */}
          {(finalEmotion === 'excited' ||
            finalEmotion === 'loving' ||
            finalAnimation === 'celebrating') && <Sparkles colors={colors} size={size} />}

          {/* Smoke effect */}
          <SmokeEffect colors={colors} size={size} visible={showSmoke} />
        </>
      )}

      {/* Speech bubble */}
      {speechBubble && (
        <SpeechBubble bubble={speechBubble} colors={colors} size={size} visible={showBubble} />
      )}

      {/* Hover glow effect */}
      {interactive && isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            inset: -size * 0.1,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.eyeGlow}40 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
      )}
    </motion.div>
  );
}

export default Ninja;
