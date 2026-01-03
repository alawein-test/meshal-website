/**
 * 🥷 Unified Ninja Component Library - Type Definitions
 * Shared across all projects: meshal-website, REPZ, GitHub, etc.
 */

// ═══════════════════════════════════════════════════════════════════════════
// VARIANTS - Different ninja personalities/roles
// ═══════════════════════════════════════════════════════════════════════════
export type NinjaVariant = 'default' | 'fitness' | 'developer' | 'coach' | 'sensei';

// ═══════════════════════════════════════════════════════════════════════════
// EMOTIONS - Facial expressions and moods
// ═══════════════════════════════════════════════════════════════════════════
export type NinjaEmotion =
  | 'neutral'
  | 'happy'
  | 'excited'
  | 'focused'
  | 'thinking'
  | 'tired'
  | 'sleeping'
  | 'angry'
  | 'surprised'
  | 'winking'
  | 'loving'
  | 'proud'
  | 'confused';

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS - Movement types
// ═══════════════════════════════════════════════════════════════════════════
export type NinjaAnimation =
  | 'none'
  | 'idle'
  | 'breathing'
  | 'wave'
  | 'bounce'
  | 'pulse'
  // Fitness animations
  | 'lifting'
  | 'flexing'
  | 'sweating'
  | 'resting'
  | 'celebrating'
  // Developer animations
  | 'typing'
  | 'thinking'
  | 'eureka'
  | 'debugging'
  // Action animations
  | 'attacking'
  | 'throwing'
  | 'disappearing'
  | 'appearing';

// ═══════════════════════════════════════════════════════════════════════════
// ACCESSORIES - Props the ninja can hold/wear
// ═══════════════════════════════════════════════════════════════════════════
export type NinjaAccessory =
  // Fitness
  | 'dumbbells'
  | 'barbell'
  | 'kettlebell'
  | 'protein-shake'
  | 'towel'
  | 'muscles'
  | 'sweatband'
  // Developer
  | 'laptop'
  | 'keyboard'
  | 'coffee'
  | 'terminal'
  | 'code-editor'
  // Combat
  | 'katana'
  | 'shuriken'
  | 'nunchucks'
  // General
  | 'headband'
  | 'cape'
  | 'sunglasses';

// ═══════════════════════════════════════════════════════════════════════════
// COLOR SCHEMES - Project-specific palettes
// ═══════════════════════════════════════════════════════════════════════════
export type NinjaColorScheme = 'coral' | 'purple-cyan' | 'stealth' | 'custom';

export interface NinjaColors {
  body: string;
  outline: string;
  eyes: string;
  eyeGlow: string;
  headband: string;
  accessoryPrimary: string;
  accessorySecondary: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// SPEECH BUBBLE - What the ninja says
// ═══════════════════════════════════════════════════════════════════════════
export interface NinjaSpeechBubble {
  text: string;
  type?: 'tip' | 'joke' | 'motivation' | 'rant' | 'greeting';
  duration?: number; // ms, 0 = persistent
  position?: 'top' | 'right' | 'bottom' | 'left';
}

// ═══════════════════════════════════════════════════════════════════════════
// SIZE - Component sizing
// ═══════════════════════════════════════════════════════════════════════════
export type NinjaSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;

export const NINJA_SIZE_MAP: Record<Exclude<NinjaSize, number>, number> = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
  '2xl': 128,
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN NINJA PROPS
// ═══════════════════════════════════════════════════════════════════════════
export interface NinjaProps {
  /** Ninja personality/role variant */
  variant?: NinjaVariant;
  /** Current emotion/expression */
  emotion?: NinjaEmotion;
  /** Animation type */
  animation?: NinjaAnimation;
  /** Accessories to display */
  accessories?: NinjaAccessory[];
  /** Color scheme (project-specific) */
  colorScheme?: NinjaColorScheme;
  /** Custom colors (overrides colorScheme) */
  customColors?: Partial<NinjaColors>;
  /** Size of the ninja */
  size?: NinjaSize;
  /** Speech bubble content */
  speechBubble?: string | NinjaSpeechBubble;
  /** Enable random blinking */
  enableBlink?: boolean;
  /** Enable interactive hover effects */
  interactive?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Accessibility label */
  'aria-label'?: string;
}
