/**
 * 🎬 Ninja Animation Configurations
 * Framer Motion animation presets for different ninja states
 */

import type { Transition, Variants } from 'framer-motion';
import type { NinjaAnimation, NinjaEmotion } from '../types';

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════

export interface AnimationConfig {
  body?: Variants;
  arms?: Variants;
  eyes?: Variants;
  accessories?: Variants;
  transition?: Transition;
}

export const ANIMATION_CONFIGS: Record<NinjaAnimation, AnimationConfig> = {
  none: {},

  idle: {
    body: {
      animate: { scale: [1, 1.02, 1] },
    },
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },

  breathing: {
    body: {
      animate: { scaleY: [1, 1.03, 1] },
    },
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },

  wave: {
    arms: {
      animate: { rotate: [0, -20, 20, -20, 0] },
    },
    transition: { duration: 0.8, repeat: Infinity, repeatDelay: 2 },
  },

  bounce: {
    body: {
      animate: { y: [0, -8, 0] },
    },
    transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' },
  },

  pulse: {
    body: {
      animate: { scale: [1, 1.1, 1] },
    },
    transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FITNESS ANIMATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  lifting: {
    arms: {
      animate: { y: [0, -12, 0] },
    },
    accessories: {
      animate: { y: [0, -12, 0] },
    },
    transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
  },

  flexing: {
    arms: {
      animate: { scaleX: [1, 1.2, 1], rotate: [0, -10, 0] },
    },
    body: {
      animate: { scaleX: [1, 1.05, 1] },
    },
    transition: { duration: 1, repeat: Infinity, repeatDelay: 1 },
  },

  sweating: {
    body: {
      animate: { y: [0, 1, 0] },
    },
    transition: { duration: 0.5, repeat: Infinity },
  },

  resting: {
    body: {
      animate: { scaleY: [1, 0.98, 1], y: [0, 2, 0] },
    },
    eyes: {
      animate: { scaleY: [1, 0.3, 1] },
    },
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },

  celebrating: {
    body: {
      animate: { y: [0, -15, 0], rotate: [0, 5, -5, 0] },
    },
    arms: {
      animate: { y: [0, -20, 0], rotate: [0, 15, -15, 0] },
    },
    transition: { duration: 0.8, repeat: Infinity, repeatDelay: 0.5 },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DEVELOPER ANIMATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  typing: {
    arms: {
      animate: { y: [0, -2, 0, -2, 0] },
    },
    transition: { duration: 0.3, repeat: Infinity },
  },

  thinking: {
    body: {
      animate: { rotate: [-2, 2, -2] },
    },
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },

  eureka: {
    body: {
      animate: { y: [0, -10, 0], scale: [1, 1.1, 1] },
    },
    transition: { duration: 0.5, repeat: 2 },
  },

  debugging: {
    eyes: {
      animate: { scaleX: [1, 0.8, 1] },
    },
    body: {
      animate: { x: [-2, 2, -2] },
    },
    transition: { duration: 0.8, repeat: Infinity },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ACTION ANIMATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  attacking: {
    arms: {
      animate: { x: [0, 20, 0], rotate: [0, -30, 0] },
    },
    transition: { duration: 0.3 },
  },

  throwing: {
    arms: {
      animate: { rotate: [0, -45, 90], x: [0, -10, 30] },
    },
    transition: { duration: 0.4 },
  },

  disappearing: {
    body: {
      animate: { opacity: [1, 0], scale: [1, 0.5] },
    },
    transition: { duration: 0.3 },
  },

  appearing: {
    body: {
      initial: { opacity: 0, scale: 0.5 },
      animate: { opacity: 1, scale: 1 },
    },
    transition: { duration: 0.3 },
  },
};
