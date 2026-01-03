/**
 * Centralized timing constants for animations, intervals, and delays.
 * This eliminates magic numbers and provides semantic meaning to timing values.
 */

// Animation durations
export const ANIMATION = {
  /** Quick micro-interactions (150-200ms) */
  BLINK: 150,
  QUICK: 200,
  /** Standard transitions (300ms) */
  STANDARD: 300,
  /** Medium animations (500-800ms) */
  MEDIUM: 500,
  SMOKE_FADE: 600,
  GESTURE: 800,
  /** Longer animations (1000ms+) */
  EXPLOSION: 1000,
  WAVE: 1500,
  TOAST: 2000,
  SWORD_IGNITE: 2500,
  HACKING: 3000,
  DANCING: 4000,
} as const;

// Interval durations
export const INTERVAL = {
  /** UI update intervals */
  IDLE_CHECK: 1000,
  BLINK_CHECK: 2000,
  /** Feature intervals */
  TAGLINE_ROTATION: 5000,
  TESTIMONIAL_ROTATION: 5000,
  CAROUSEL_ROTATION: 4000,
  /** Ninja behavior intervals */
  NINJA_ROAM_MIN: 5000,
  NINJA_ROAM_MAX: 10000,
  SPEECH_MIN: 8000,
  SPEECH_MAX: 15000,
  SWORD_IGNITE_MIN: 12000,
  SWORD_IGNITE_MAX: 22000,
  ANGRY_ATTACK_MIN: 20000,
  ANGRY_ATTACK_MAX: 35000,
  LOVE_MODE_MIN: 25000,
  LOVE_MODE_MAX: 45000,
  /** Fight mode intervals */
  FIGHT_ROAM_MIN: 4000,
  FIGHT_ROAM_MAX: 6000,
  FIGHT_START: 4000,
  FIGHT_INTERVAL_MIN: 15000,
  FIGHT_INTERVAL_MAX: 23000,
} as const;

// Debounce/throttle timings
export const DEBOUNCE = {
  CLICK: 300,
  SEARCH: 300,
  RESIZE: 150,
} as const;

// Chart/data update intervals
export const DATA_INTERVAL = {
  REALTIME_CHART: 100,
  MATRIX_RAIN: 35,
  GLITCH_EFFECT: 100,
} as const;

/**
 * Generate a random interval between min and max values.
 * Useful for natural-feeling random behaviors.
 */
export const randomInterval = (min: number, max: number): number => {
  return min + Math.random() * (max - min);
};
