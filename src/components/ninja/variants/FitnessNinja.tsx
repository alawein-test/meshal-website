/**
 * 🏋️ FitnessNinja - Pre-configured ninja for REPZ/fitness apps
 *
 * A coral-themed ninja with fitness accessories and animations.
 *
 * @example
 * <FitnessNinja
 *   emotion="happy"
 *   animation="lifting"
 *   speechBubble="One more rep! 💪"
 * />
 */

import { Ninja } from '../Ninja';
import type { NinjaProps, NinjaEmotion, NinjaAnimation, NinjaAccessory } from '../types';

// Fitness-specific speech messages
export const FITNESS_TIPS = [
  'One more rep! 💪',
  'You got this! 🔥',
  'Form check! 📐',
  'Rest day = Gain day 😴',
  'Hydrate! 💧',
  'Progressive overload! 📈',
  'Mind-muscle connection! 🧠',
  'Protein synthesis activated! 🥩',
  'No pain, no gain! 💥',
  'Consistency is key! 🔑',
  'Trust the process! 🎯',
  'Gains incoming! 📦',
];

export const FITNESS_JOKES = [
  'Why did the dumbbell break up? Too much weight on the relationship! 😂',
  "I'm not lazy, I'm on energy-saving mode! 😴",
  'Leg day? More like leg SLAY! 🦵',
  'My warmup is your workout! 🔥',
  "I don't sweat, I sparkle! ✨",
];

interface FitnessNinjaProps extends Omit<NinjaProps, 'variant' | 'colorScheme'> {
  /** Show a random fitness tip */
  showRandomTip?: boolean;
  /** Show a random fitness joke */
  showRandomJoke?: boolean;
}

export function FitnessNinja({
  emotion = 'happy',
  animation = 'idle',
  accessories = ['dumbbells'],
  speechBubble,
  showRandomTip = false,
  showRandomJoke = false,
  size = 80,
  ...props
}: FitnessNinjaProps) {
  // Get random message if requested
  let finalBubble = speechBubble;
  if (!finalBubble && showRandomTip) {
    finalBubble = {
      text: FITNESS_TIPS[Math.floor(Math.random() * FITNESS_TIPS.length)],
      type: 'motivation',
      position: 'top',
    };
  } else if (!finalBubble && showRandomJoke) {
    finalBubble = {
      text: FITNESS_JOKES[Math.floor(Math.random() * FITNESS_JOKES.length)],
      type: 'joke',
      position: 'top',
    };
  }

  return (
    <Ninja
      variant="fitness"
      colorScheme="coral"
      emotion={emotion}
      animation={animation}
      accessories={accessories}
      speechBubble={finalBubble}
      size={size}
      {...props}
    />
  );
}

/**
 * 💪 FlexingNinja - Ninja showing off muscles
 */
export function FlexingNinja(props: Omit<FitnessNinjaProps, 'animation' | 'accessories'>) {
  return <FitnessNinja {...props} emotion="proud" animation="flexing" accessories={['muscles']} />;
}

/**
 * 🏋️ LiftingNinja - Ninja doing curls
 */
export function LiftingNinja(props: Omit<FitnessNinjaProps, 'animation' | 'accessories'>) {
  return (
    <FitnessNinja {...props} emotion="focused" animation="lifting" accessories={['dumbbells']} />
  );
}

/**
 * 😅 TiredNinja - Ninja after a hard workout
 */
export function TiredNinja(props: Omit<FitnessNinjaProps, 'emotion' | 'animation'>) {
  return (
    <FitnessNinja {...props} emotion="tired" animation="sweating" accessories={['protein-shake']} />
  );
}

/**
 * 🎉 CelebratingNinja - Ninja celebrating a PR
 */
export function CelebratingNinja(props: Omit<FitnessNinjaProps, 'emotion' | 'animation'>) {
  return <FitnessNinja {...props} emotion="excited" animation="celebrating" accessories={[]} />;
}

export default FitnessNinja;
