/**
 * 🎨 Ninja Color Schemes
 * Project-specific color palettes for ninja mascots
 */

import type { NinjaColorScheme, NinjaColors } from '../types';

// ═══════════════════════════════════════════════════════════════════════════
// COLOR SCHEME DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 🔥 CORAL - REPZ Fitness Theme
 * Coral/orange palette for the fitness app
 */
export const CORAL_SCHEME: NinjaColors = {
  body: '#141414', // Dark ninja body
  outline: '#E57373', // Coral outline
  eyes: '#E57373', // Coral eyes
  eyeGlow: '#EF5350', // Brighter coral glow
  headband: '#FF8A65', // Orange headband
  accessoryPrimary: '#E57373', // Coral for main accessories
  accessorySecondary: '#FF8A65', // Orange for secondary
};

/**
 * 💜 PURPLE-CYAN - Main Website Theme
 * Electric neon palette for the developer portfolio
 */
export const PURPLE_CYAN_SCHEME: NinjaColors = {
  body: '#0f0f1a', // Deep dark body
  outline: '#22D3EE', // Cyan outline
  eyes: '#F0ABFC', // Magenta/pink eyes
  eyeGlow: '#A855F7', // Purple glow
  headband: '#A855F7', // Purple headband
  accessoryPrimary: '#22D3EE', // Cyan accessories
  accessorySecondary: '#F0ABFC', // Magenta secondary
};

/**
 * 🖤 STEALTH - Minimal dark theme
 * Monochrome shadow ninja
 */
export const STEALTH_SCHEME: NinjaColors = {
  body: '#0a0a0a', // Near black
  outline: '#404040', // Dark gray outline
  eyes: '#888888', // Gray eyes
  eyeGlow: '#666666', // Subtle glow
  headband: '#333333', // Dark headband
  accessoryPrimary: '#555555', // Gray accessories
  accessorySecondary: '#444444', // Darker secondary
};

/**
 * 🌟 GOLDEN - Premium/Longevity tier
 * Gold and amber tones
 */
export const GOLDEN_SCHEME: NinjaColors = {
  body: '#1a1408', // Dark gold-brown
  outline: '#D97706', // Amber outline
  eyes: '#FBBF24', // Golden eyes
  eyeGlow: '#F59E0B', // Amber glow
  headband: '#D97706', // Amber headband
  accessoryPrimary: '#FBBF24', // Gold accessories
  accessorySecondary: '#D97706', // Amber secondary
};

// ═══════════════════════════════════════════════════════════════════════════
// SCHEME MAP
// ═══════════════════════════════════════════════════════════════════════════

export const COLOR_SCHEMES: Record<NinjaColorScheme, NinjaColors> = {
  coral: CORAL_SCHEME,
  'purple-cyan': PURPLE_CYAN_SCHEME,
  stealth: STEALTH_SCHEME,
  custom: CORAL_SCHEME, // Default fallback for custom (will be overridden)
};

/**
 * Get colors for a ninja based on scheme and optional custom overrides
 */
export function getNinjaColors(
  scheme: NinjaColorScheme = 'coral',
  customColors?: Partial<NinjaColors>
): NinjaColors {
  const baseColors = COLOR_SCHEMES[scheme] || CORAL_SCHEME;

  if (customColors) {
    return { ...baseColors, ...customColors };
  }

  return baseColors;
}

// ═══════════════════════════════════════════════════════════════════════════
// CSS VARIABLE HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Convert hex to HSL CSS variable format
 */
export function hexToHSL(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');

  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/**
 * Get CSS variables style object for a color scheme
 */
export function getSchemeStyles(colors: NinjaColors): React.CSSProperties {
  return {
    '--ninja-body': colors.body,
    '--ninja-outline': colors.outline,
    '--ninja-eyes': colors.eyes,
    '--ninja-eye-glow': colors.eyeGlow,
    '--ninja-headband': colors.headband,
    '--ninja-accessory-1': colors.accessoryPrimary,
    '--ninja-accessory-2': colors.accessorySecondary,
  } as React.CSSProperties;
}
