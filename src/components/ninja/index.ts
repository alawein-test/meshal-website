/**
 * 🥷 Unified Ninja Component Library
 *
 * A flexible, customizable ninja mascot system that can be used across all projects.
 *
 * @example
 * // Basic usage
 * import { Ninja } from '@/components/ninja';
 * <Ninja variant="fitness" emotion="happy" />
 *
 * // Pre-configured variants
 * import { FitnessNinja, DeveloperNinja } from '@/components/ninja';
 * <FitnessNinja animation="lifting" speechBubble="One more rep! 💪" />
 * <DeveloperNinja animation="typing" showRandomJoke />
 *
 * // Specific shortcuts
 * import { FlexingNinja, TypingNinja } from '@/components/ninja';
 * <FlexingNinja size={100} />
 * <TypingNinja interactive />
 */

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export { Ninja, default } from './Ninja';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type {
  NinjaProps,
  NinjaVariant,
  NinjaEmotion,
  NinjaAnimation,
  NinjaAccessory,
  NinjaColorScheme,
  NinjaColors,
  NinjaSpeechBubble,
} from './types';

// ═══════════════════════════════════════════════════════════════════════════
// PRE-CONFIGURED VARIANTS
// ═══════════════════════════════════════════════════════════════════════════

// Fitness variants (for REPZ)
export {
  FitnessNinja,
  FlexingNinja,
  LiftingNinja,
  TiredNinja,
  CelebratingNinja,
  FITNESS_TIPS,
  FITNESS_JOKES,
} from './variants/FitnessNinja';

// Developer variants (for meshal-website)
export {
  DeveloperNinja,
  TypingNinja,
  ThinkingNinja,
  EurekaNinja,
  DebuggingNinja,
  DEV_TIPS,
  DEV_JOKES,
} from './variants/DeveloperNinja';

// ═══════════════════════════════════════════════════════════════════════════
// PARTS (for advanced customization)
// ═══════════════════════════════════════════════════════════════════════════

export { NinjaBase } from './parts/NinjaBase';
export { NinjaAccessories } from './parts/NinjaAccessories';

// ═══════════════════════════════════════════════════════════════════════════
// EFFECTS
// ═══════════════════════════════════════════════════════════════════════════

export { SpeechBubble } from './effects/SpeechBubble';
export { SweatDrops, Sparkles, SmokeEffect } from './effects/SweatDrops';

// ═══════════════════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════════════════

export {
  CORAL_SCHEME,
  PURPLE_CYAN_SCHEME,
  STEALTH_SCHEME,
  GOLDEN_SCHEME,
  getColorScheme,
} from './config/colorSchemes';

export { ANIMATION_CONFIGS } from './config/animations';
export { EMOTION_PATTERNS, EMOTION_MESSAGES, getEmotionMessage } from './config/emotions';
export { ACCESSORY_CONFIGS, getAccessoriesByCategory } from './config/accessories';
