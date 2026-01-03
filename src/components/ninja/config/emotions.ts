/**
 * 😊 Ninja Emotion Configurations
 * Eye patterns and expressions for different moods
 */

import type { NinjaEmotion } from '../types';

// ═══════════════════════════════════════════════════════════════════════════
// EYE PATTERN TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface EyePattern {
  /** Left eye shape: 'normal' | 'closed' | 'wide' | 'squint' | 'heart' | 'star' */
  left: EyeShape;
  /** Right eye shape */
  right: EyeShape;
  /** Eye Y offset (for droopy/raised eyes) */
  yOffset?: number;
  /** Pupil dilation (0-1, 1 = normal) */
  pupilSize?: number;
  /** Sparkle/shine effect */
  sparkle?: boolean;
  /** Tears/sweat drops */
  drops?: 'tears' | 'sweat' | 'none';
}

export type EyeShape =
  | 'normal' // Standard rectangular eyes
  | 'closed' // Horizontal line (sleeping/happy)
  | 'wide' // Larger eyes (surprised)
  | 'squint' // Narrow eyes (angry/focused)
  | 'heart' // Heart-shaped (loving)
  | 'star' // Star-shaped (excited)
  | 'wink' // One eye closed
  | 'dot'; // Small dot (tired)

// ═══════════════════════════════════════════════════════════════════════════
// EMOTION CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════

export const EMOTION_PATTERNS: Record<NinjaEmotion, EyePattern> = {
  neutral: {
    left: 'normal',
    right: 'normal',
  },

  happy: {
    left: 'closed',
    right: 'closed',
    yOffset: -1,
    sparkle: true,
  },

  excited: {
    left: 'star',
    right: 'star',
    pupilSize: 1.2,
    sparkle: true,
  },

  focused: {
    left: 'squint',
    right: 'squint',
    pupilSize: 0.8,
  },

  thinking: {
    left: 'normal',
    right: 'squint',
    yOffset: -2,
  },

  tired: {
    left: 'dot',
    right: 'dot',
    yOffset: 2,
    drops: 'sweat',
  },

  sleeping: {
    left: 'closed',
    right: 'closed',
    yOffset: 2,
  },

  angry: {
    left: 'squint',
    right: 'squint',
    yOffset: -2,
    pupilSize: 0.6,
  },

  surprised: {
    left: 'wide',
    right: 'wide',
    pupilSize: 1.3,
    yOffset: -1,
  },

  winking: {
    left: 'wink',
    right: 'normal',
    sparkle: true,
  },

  loving: {
    left: 'heart',
    right: 'heart',
    sparkle: true,
  },

  proud: {
    left: 'closed',
    right: 'closed',
    yOffset: -2,
    sparkle: true,
  },

  confused: {
    left: 'normal',
    right: 'wide',
    yOffset: 1,
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// SPEECH MESSAGES BY EMOTION
// ═══════════════════════════════════════════════════════════════════════════

export const EMOTION_MESSAGES: Record<NinjaEmotion, string[]> = {
  neutral: ['...', 'Hmm.', 'Standing by.'],
  happy: ['Yay! 😊', 'Great job!', "Let's go!"],
  excited: ['AWESOME! 🎉', "LET'S GOOO!", 'SO PUMPED!'],
  focused: ['Stay focused.', 'Eyes on the goal.', 'Concentrate...'],
  thinking: ['Hmm... 🤔', 'Let me think...', 'Processing...'],
  tired: ['*yawn* 😴', 'Need... rest...', 'So... sleepy...'],
  sleeping: ['Zzz...', '💤', '...'],
  angry: ['GRRRR! 😤', 'NOT COOL!', 'Unacceptable!'],
  surprised: ['WHOA! 😲', 'No way!', 'Wait, what?!'],
  winking: ['You got this! 😉', 'Trust me.', 'Believe it!'],
  loving: ['Love it! 💕', "You're amazing!", '❤️'],
  proud: ['Crushed it! 💪', "That's how it's done!", 'Legendary!'],
  confused: ['Huh? 🤨', "I don't get it...", 'Say what?'],
};

/**
 * Get a random message for an emotion
 */
export function getEmotionMessage(emotion: NinjaEmotion): string {
  const messages = EMOTION_MESSAGES[emotion];
  return messages[Math.floor(Math.random() * messages.length)];
}
