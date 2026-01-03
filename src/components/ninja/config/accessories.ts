/**
 * 🎒 Ninja Accessories Configuration
 * Props and items ninjas can hold or wear
 */

import type { NinjaAccessory } from '../types';

// ═══════════════════════════════════════════════════════════════════════════
// ACCESSORY METADATA
// ═══════════════════════════════════════════════════════════════════════════

export interface AccessoryConfig {
  /** Position relative to ninja body */
  position: 'left-hand' | 'right-hand' | 'both-hands' | 'head' | 'back' | 'body';
  /** Z-index layer */
  layer: 'behind' | 'front';
  /** Can be animated */
  animatable: boolean;
  /** Category for filtering */
  category: 'fitness' | 'developer' | 'combat' | 'general';
  /** Emoji representation */
  emoji: string;
}

export const ACCESSORY_CONFIGS: Record<NinjaAccessory, AccessoryConfig> = {
  // ═══════════════════════════════════════════════════════════════════════════
  // FITNESS ACCESSORIES
  // ═══════════════════════════════════════════════════════════════════════════

  dumbbells: {
    position: 'both-hands',
    layer: 'front',
    animatable: true,
    category: 'fitness',
    emoji: '🏋️',
  },

  barbell: {
    position: 'both-hands',
    layer: 'front',
    animatable: true,
    category: 'fitness',
    emoji: '🏋️‍♂️',
  },

  kettlebell: {
    position: 'right-hand',
    layer: 'front',
    animatable: true,
    category: 'fitness',
    emoji: '🔔',
  },

  'protein-shake': {
    position: 'right-hand',
    layer: 'front',
    animatable: false,
    category: 'fitness',
    emoji: '🥤',
  },

  towel: {
    position: 'head',
    layer: 'front',
    animatable: false,
    category: 'fitness',
    emoji: '🧺',
  },

  muscles: {
    position: 'body',
    layer: 'front',
    animatable: true,
    category: 'fitness',
    emoji: '💪',
  },

  sweatband: {
    position: 'head',
    layer: 'front',
    animatable: false,
    category: 'fitness',
    emoji: '🎽',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DEVELOPER ACCESSORIES
  // ═══════════════════════════════════════════════════════════════════════════

  laptop: {
    position: 'both-hands',
    layer: 'front',
    animatable: true,
    category: 'developer',
    emoji: '💻',
  },

  keyboard: {
    position: 'both-hands',
    layer: 'front',
    animatable: true,
    category: 'developer',
    emoji: '⌨️',
  },

  coffee: {
    position: 'right-hand',
    layer: 'front',
    animatable: false,
    category: 'developer',
    emoji: '☕',
  },

  terminal: {
    position: 'both-hands',
    layer: 'front',
    animatable: true,
    category: 'developer',
    emoji: '🖥️',
  },

  'code-editor': {
    position: 'both-hands',
    layer: 'front',
    animatable: true,
    category: 'developer',
    emoji: '📝',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // COMBAT ACCESSORIES
  // ═══════════════════════════════════════════════════════════════════════════

  katana: {
    position: 'right-hand',
    layer: 'front',
    animatable: true,
    category: 'combat',
    emoji: '⚔️',
  },

  shuriken: {
    position: 'left-hand',
    layer: 'front',
    animatable: true,
    category: 'combat',
    emoji: '⭐',
  },

  nunchucks: {
    position: 'both-hands',
    layer: 'front',
    animatable: true,
    category: 'combat',
    emoji: '🥋',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GENERAL ACCESSORIES
  // ═══════════════════════════════════════════════════════════════════════════

  headband: {
    position: 'head',
    layer: 'front',
    animatable: false,
    category: 'general',
    emoji: '🎀',
  },

  cape: {
    position: 'back',
    layer: 'behind',
    animatable: true,
    category: 'general',
    emoji: '🦸',
  },

  sunglasses: {
    position: 'head',
    layer: 'front',
    animatable: false,
    category: 'general',
    emoji: '😎',
  },
};

/**
 * Get accessories by category
 */
export function getAccessoriesByCategory(category: AccessoryConfig['category']): NinjaAccessory[] {
  return (Object.entries(ACCESSORY_CONFIGS) as [NinjaAccessory, AccessoryConfig][])
    .filter(([, config]) => config.category === category)
    .map(([accessory]) => accessory);
}
