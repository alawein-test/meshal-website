/**
 * 💻 DeveloperNinja - Pre-configured ninja for developer/tech sites
 *
 * A purple-cyan themed ninja with developer accessories and animations.
 *
 * @example
 * <DeveloperNinja
 *   emotion="focused"
 *   animation="typing"
 *   speechBubble="Compiling... ☕"
 * />
 */

import { Ninja } from '../Ninja';
import type { NinjaProps } from '../types';

// Developer-specific speech messages
export const DEV_TIPS = [
  "git commit -m 'fixed bug' 🐛",
  "console.log('here') 🔍",
  'It works on my machine! 🤷',
  'Have you tried turning it off and on? 🔄',
  '// TODO: fix this later 📝',
  'Stack Overflow is my sensei 🥋',
  'Debugging in production... 😰',
  'Ship it! 🚀',
];

export const DEV_JOKES = [
  'Why do programmers prefer dark mode? Because light attracts bugs! 🐛',
  'There are 10 types of people... those who understand binary! 🔢',
  "A SQL query walks into a bar, sees two tables and asks... 'Can I JOIN you?' 🍺",
  "!false - It's funny because it's true! 😂",
  'I would tell you a UDP joke, but you might not get it! 📡',
];

interface DeveloperNinjaProps extends Omit<NinjaProps, 'variant' | 'colorScheme'> {
  /** Show a random dev tip */
  showRandomTip?: boolean;
  /** Show a random dev joke */
  showRandomJoke?: boolean;
}

export function DeveloperNinja({
  emotion = 'focused',
  animation = 'typing',
  accessories = ['laptop', 'coffee'],
  speechBubble,
  showRandomTip = false,
  showRandomJoke = false,
  size = 80,
  ...props
}: DeveloperNinjaProps) {
  // Get random message if requested
  let finalBubble = speechBubble;
  if (!finalBubble && showRandomTip) {
    finalBubble = {
      text: DEV_TIPS[Math.floor(Math.random() * DEV_TIPS.length)],
      type: 'tip',
      position: 'top',
    };
  } else if (!finalBubble && showRandomJoke) {
    finalBubble = {
      text: DEV_JOKES[Math.floor(Math.random() * DEV_JOKES.length)],
      type: 'joke',
      position: 'top',
    };
  }

  return (
    <Ninja
      variant="developer"
      colorScheme="purple-cyan"
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
 * ⌨️ TypingNinja - Ninja coding away
 */
export function TypingNinja(props: Omit<DeveloperNinjaProps, 'animation' | 'accessories'>) {
  return (
    <DeveloperNinja {...props} emotion="focused" animation="typing" accessories={['laptop']} />
  );
}

/**
 * 🤔 ThinkingNinja - Ninja solving a problem
 */
export function ThinkingNinja(props: Omit<DeveloperNinjaProps, 'emotion' | 'animation'>) {
  return (
    <DeveloperNinja {...props} emotion="thinking" animation="thinking" accessories={['coffee']} />
  );
}

/**
 * 💡 EurekaNinja - Ninja having an aha moment
 */
export function EurekaNinja(props: Omit<DeveloperNinjaProps, 'emotion' | 'animation'>) {
  return <DeveloperNinja {...props} emotion="excited" animation="eureka" accessories={[]} />;
}

/**
 * 🐛 DebuggingNinja - Ninja hunting bugs
 */
export function DebuggingNinja(props: Omit<DeveloperNinjaProps, 'emotion' | 'animation'>) {
  return (
    <DeveloperNinja {...props} emotion="focused" animation="debugging" accessories={['laptop']} />
  );
}

export default DeveloperNinja;
