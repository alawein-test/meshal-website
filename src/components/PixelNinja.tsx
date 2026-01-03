import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';
import Shuriken from './Shuriken';
import { ANIMATION, INTERVAL, randomInterval } from '@/utils/timing';

type Position = {
  edge: 'left' | 'right';
  offset: number;
  hidden: boolean;
};

type Footprint = {
  id: number;
  edge: Position['edge'];
  offset: number;
  timestamp: number;
};

type SmokePuff = {
  id: number;
  edge: Position['edge'];
  offset: number;
  type: 'disappear' | 'appear' | 'dramatic';
};

type FloatingHeart = {
  id: number;
  x: number;
  delay: number;
};

type Expression = 'cheerful' | 'fierce' | 'drowsy' | 'sleeping' | 'loving' | 'annoyed';

// Speech bubble messages for the "older ninja" commenting on the fighting ninjas
const SPEECH_MESSAGES = [
  'WTF is wrong with them?',
  'WEIRDOS...',
  'KIDS, STOP!',
  'Back in my day...',
  'Amateurs.',
  'I trained them better than this.',
  'This is embarrassing.',
  '∇²ψ = -k²ψ',
  'E = mc²... obviously.',
  "Neural nets? Child's play.",
  'Quantum supremacy achieved.',
  '*sigh* youngsters...',
];

// Dad jokes for when clicked
const DAD_JOKES = [
  'Why do ninjas make bad comedians? Their jokes always fall flat! 🥷',
  "I'm reading a book about anti-gravity... can't put it down!",
  'Why did the ninja go to therapy? Too many throwing stars issues! ⭐',
  'I used to hate math, but then I realized decimals have a point.',
  "What do you call a ninja who's good at math? A calcu-later! 🧮",
  'I told my wife she was drawing her eyebrows too high. She looked surprised.',
  "Why don't scientists trust atoms? They make up everything!",
  "I'm on a seafood diet. I see food and I eat it! 🍣",
  "What's a ninja's favorite type of shoes? Sneakers! 👟",
  "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them!",
];

// Love messages
const LOVE_MESSAGES = [
  '💕 Love you!',
  '❤️ Hugs!',
  '💖 XOXO',
  '💗 Kisses!',
  "💝 You're awesome!",
  '😘 Mwah!',
];

const PixelNinja = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [currentEasterEgg, setCurrentEasterEgg] = useState<string | null>(null);
  const [typedCommand, setTypedCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<{ cmd: string; output: string }[]>([]);
  const [shurikens, setShurikens] = useState<
    { id: number; x: number; y: number; angle?: number }[]
  >([]);
  const [isDancing, setIsDancing] = useState(false);
  const [isHacking, setIsHacking] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [position, setPosition] = useState<Position>({ edge: 'right', offset: 50, hidden: false });
  const [isPeeking, setIsPeeking] = useState(true);
  const [peekRotation, setPeekRotation] = useState(0);
  const [footprints, setFootprints] = useState<Footprint[]>([]);
  const [smokePuffs, setSmokePuffs] = useState<SmokePuff[]>([]);
  const [idleGesture, setIdleGesture] = useState<'none' | 'wave' | 'nod' | 'peek' | 'shrug'>(
    'none'
  );
  const [expression, setExpression] = useState<Expression>('cheerful');
  const [idleTime, setIdleTime] = useState(0);
  // New states for enhanced behaviors
  const [isSleeping, setIsSleeping] = useState(false);
  const [isLoveMode, setIsLoveMode] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [swordIgnited, setSwordIgnited] = useState(false);
  const [isAngryAttacking, setIsAngryAttacking] = useState(false);
  // Speech bubble state
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  // Dad joke / love mode on click
  const [clickMessage, setClickMessage] = useState<string | null>(null);
  const [showClickMessage, setShowClickMessage] = useState(false);

  const ninjaRef = useRef<HTMLDivElement>(null);
  const lastClickTime = useRef(0);
  const shurikenId = useRef(0);
  const footprintId = useRef(0);
  const smokePuffId = useRef(0);
  const heartId = useRef(0);
  const lastActivityTime = useRef(Date.now());

  // Roaming behavior - only left/right edges
  useEffect(() => {
    const moveNinja = () => {
      const edges: Position['edge'][] = ['left', 'right'];
      const newEdge = edges[Math.floor(Math.random() * edges.length)];
      const newOffset = 20 + Math.random() * 60;

      // Leave footprint at current position before moving
      setFootprints((prev) => [
        ...prev,
        {
          id: footprintId.current++,
          edge: position.edge,
          offset: position.offset,
          timestamp: Date.now(),
        },
      ]);

      // Add smoke puff at departure
      const departureSmoke: SmokePuff = {
        id: smokePuffId.current++,
        edge: position.edge,
        offset: position.offset,
        type: 'disappear',
      };
      setSmokePuffs((prev) => [...prev, departureSmoke]);

      // Hide first, then move, then peek
      setIsPeeking(false);
      setPosition((prev) => ({ ...prev, hidden: true }));

      setTimeout(() => {
        setPosition({ edge: newEdge, offset: newOffset, hidden: true });

        // Add smoke puff at arrival
        const arrivalSmoke: SmokePuff = {
          id: smokePuffId.current++,
          edge: newEdge,
          offset: newOffset,
          type: 'appear',
        };
        setSmokePuffs((prev) => [...prev, arrivalSmoke]);

        setTimeout(() => {
          setPosition((prev) => ({ ...prev, hidden: false }));
          setIsPeeking(true);
          // Random peek rotation (-25 to 25 degrees)
          setPeekRotation((Math.random() - 0.5) * 50);
        }, 300);
      }, 500);

      // Clean up smoke puffs after animation
      setTimeout(() => {
        setSmokePuffs((prev) => prev.filter((s) => s.id !== departureSmoke.id));
      }, 800);
    };

    const interval = setInterval(
      moveNinja,
      randomInterval(INTERVAL.NINJA_ROAM_MIN, INTERVAL.NINJA_ROAM_MAX)
    );
    return () => clearInterval(interval);
  }, [position.edge, position.offset]);

  // Idle gestures
  useEffect(() => {
    const doGesture = () => {
      if (!isPeeking || position.hidden) return;

      const gestures: ('wave' | 'nod' | 'peek' | 'shrug')[] = ['wave', 'nod', 'peek', 'shrug'];
      const gesture = gestures[Math.floor(Math.random() * gestures.length)];
      setIdleGesture(gesture);

      // Reset after animation
      setTimeout(
        () => setIdleGesture('none'),
        gesture === 'wave' ? ANIMATION.WAVE : ANIMATION.GESTURE
      );
    };

    const interval = setInterval(
      () => {
        if (Math.random() < 0.4) doGesture();
      },
      3000 + Math.random() * 2000
    );

    return () => clearInterval(interval);
  }, [isPeeking, position.hidden]);

  // Expression management based on activity - with sleep mode
  useEffect(() => {
    const checkIdleTime = () => {
      const now = Date.now();
      const timeSinceActivity = now - lastActivityTime.current;

      if (timeSinceActivity > 15000) {
        // Fall asleep after 15 seconds
        setExpression('sleeping');
        setIsSleeping(true);
        setIdleTime(timeSinceActivity);
      } else if (timeSinceActivity > 8000) {
        // Getting drowsy after 8 seconds
        setExpression('drowsy');
        setIsSleeping(false);
        setIdleTime(timeSinceActivity);
      } else {
        // Cheerful when active
        if (expression !== 'fierce' && expression !== 'loving') {
          setExpression('cheerful');
        }
        setIsSleeping(false);
        setIdleTime(0);
      }
    };

    const interval = setInterval(checkIdleTime, INTERVAL.IDLE_CHECK);
    return () => clearInterval(interval);
  }, [expression]);

  // Random angry attack mode
  useEffect(() => {
    const triggerAngryAttack = () => {
      if (isSleeping || isLoveMode || isDancing || position.hidden) return;
      if (Math.random() < 0.15) {
        // 15% chance every check
        setIsAngryAttacking(true);
        setExpression('fierce');

        // Throw 2-3 shurikens in random directions
        if (ninjaRef.current) {
          const rect = ninjaRef.current.getBoundingClientRect();
          const numShurikens = 2 + Math.floor(Math.random() * 2);

          for (let i = 0; i < numShurikens; i++) {
            setTimeout(() => {
              setShurikens((prev) => [
                ...prev,
                {
                  id: shurikenId.current++,
                  x: rect.left + rect.width / 2,
                  y: rect.top + rect.height / 2,
                  angle: -60 + Math.random() * 120, // Random angle spread
                },
              ]);
            }, i * 200);
          }
        }

        setTimeout(() => {
          setIsAngryAttacking(false);
          setExpression('cheerful');
        }, ANIMATION.WAVE);
      }
    };

    const interval = setInterval(
      triggerAngryAttack,
      randomInterval(INTERVAL.ANGRY_ATTACK_MIN, INTERVAL.ANGRY_ATTACK_MAX)
    );
    return () => clearInterval(interval);
  }, [isSleeping, isLoveMode, isDancing, position.hidden]);

  // Random love/heart mode
  useEffect(() => {
    const triggerLoveMode = () => {
      if (isSleeping || isAngryAttacking || position.hidden) return;
      if (Math.random() < 0.1) {
        // 10% chance
        setIsLoveMode(true);
        setExpression('loving');
        setIsDancing(true);

        // Spawn floating hearts
        const hearts: FloatingHeart[] = [];
        for (let i = 0; i < 8; i++) {
          hearts.push({
            id: heartId.current++,
            x: -20 + Math.random() * 40,
            delay: i * 0.15,
          });
        }
        setFloatingHearts(hearts);

        setTimeout(() => {
          setIsLoveMode(false);
          setIsDancing(false);
          setExpression('cheerful');
          setFloatingHearts([]);
        }, ANIMATION.HACKING);
      }
    };

    const interval = setInterval(
      triggerLoveMode,
      randomInterval(INTERVAL.LOVE_MODE_MIN, INTERVAL.LOVE_MODE_MAX)
    );
    return () => clearInterval(interval);
  }, [isSleeping, isAngryAttacking, position.hidden]);

  // Random sword ignite effect
  useEffect(() => {
    const triggerSwordIgnite = () => {
      if (isSleeping || position.hidden) return;
      if (Math.random() < 0.2) {
        // 20% chance
        setSwordIgnited(true);
        setTimeout(() => setSwordIgnited(false), ANIMATION.SWORD_IGNITE);
      }
    };

    const interval = setInterval(
      triggerSwordIgnite,
      randomInterval(INTERVAL.SWORD_IGNITE_MIN, INTERVAL.SWORD_IGNITE_MAX)
    );
    return () => clearInterval(interval);
  }, [isSleeping, position.hidden]);

  // Random speech bubble - older ninja commenting on the fighting ninjas
  useEffect(() => {
    const triggerSpeech = () => {
      if (isSleeping || position.hidden) return;
      if (Math.random() < 0.25) {
        // 25% chance
        const message = SPEECH_MESSAGES[Math.floor(Math.random() * SPEECH_MESSAGES.length)];
        setSpeechBubble(message);
        setShowSpeechBubble(true);
        setExpression('annoyed');

        setTimeout(() => {
          setShowSpeechBubble(false);
          setSpeechBubble(null);
          setExpression('cheerful');
        }, ANIMATION.DANCING);
      }
    };

    const interval = setInterval(
      triggerSpeech,
      randomInterval(INTERVAL.SPEECH_MIN, INTERVAL.SPEECH_MAX)
    );
    return () => clearInterval(interval);
  }, [isSleeping, position.hidden]);

  // Reset activity on any interaction
  const resetActivity = useCallback(() => {
    lastActivityTime.current = Date.now();
    if (isSleeping) {
      setIsSleeping(false);
    }
    if (expression === 'drowsy' || expression === 'sleeping') {
      setExpression('cheerful');
    }
  }, [isSleeping, expression]);

  // Escape on mouse hover
  const handleMouseEnter = () => {
    resetActivity();
    const edges: Position['edge'][] = ['left', 'right'];
    const newEdge =
      edges.filter((e) => e !== position.edge)[0] ||
      edges[Math.floor(Math.random() * edges.length)];
    const newOffset = 20 + Math.random() * 60;

    // Add smoke puff at departure
    const departureSmoke: SmokePuff = {
      id: smokePuffId.current++,
      edge: position.edge,
      offset: position.offset,
      type: 'disappear',
    };
    setSmokePuffs((prev) => [...prev, departureSmoke]);

    setIsPeeking(false);
    setPosition((prev) => ({ ...prev, hidden: true }));

    setTimeout(() => {
      setPosition({ edge: newEdge, offset: newOffset, hidden: true });

      const arrivalSmoke: SmokePuff = {
        id: smokePuffId.current++,
        edge: newEdge,
        offset: newOffset,
        type: 'appear',
      };
      setSmokePuffs((prev) => [...prev, arrivalSmoke]);

      setTimeout(() => {
        setPosition((prev) => ({ ...prev, hidden: false }));
        setIsPeeking(true);
        setPeekRotation((Math.random() - 0.5) * 50);
      }, 300);
    }, 200);

    setTimeout(() => {
      setSmokePuffs((prev) => prev.filter((s) => s.id !== departureSmoke.id));
    }, 600);
  };

  // Clean up arrival smoke puffs
  useEffect(() => {
    if (smokePuffs.length > 0) {
      const timer = setTimeout(() => {
        setSmokePuffs((prev) => prev.filter((s) => s.type !== 'appear'));
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [smokePuffs]);

  // Clean up old footprints
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setFootprints((prev) => prev.filter((fp) => now - fp.timestamp < 8000));
    }, 1000);
    return () => clearInterval(cleanup);
  }, []);

  // Get footprint position styles
  const getFootprintStyles = (fp: Footprint): React.CSSProperties => {
    switch (fp.edge) {
      case 'left':
        return { left: 8, top: `${fp.offset}%`, transform: 'translateY(-50%)' };
      case 'right':
        return { right: 8, top: `${fp.offset}%`, transform: 'translateY(-50%)' };
    }
  };

  // Get smoke puff position styles
  const getSmokePuffStyles = (smoke: SmokePuff): React.CSSProperties => {
    switch (smoke.edge) {
      case 'left':
        return { left: 16, top: `${smoke.offset}%`, transform: 'translateY(-50%)' };
      case 'right':
        return { right: 16, top: `${smoke.offset}%`, transform: 'translateY(-50%)' };
    }
  };

  // Get CSS position based on edge - sideways peeking only (moved slightly right)
  const getPositionStyles = (): React.CSSProperties => {
    const peekAmount = isPeeking ? 0 : 50;
    const hiddenAmount = position.hidden ? 80 : 0;
    const offset = peekAmount + hiddenAmount;
    const rotation = isPeeking ? peekRotation : 0;

    switch (position.edge) {
      case 'left':
        return {
          left: -offset + 30, // Moved 30px to the right
          top: `${position.offset}%`,
          transform: `translateY(-50%) scaleX(-1) rotate(${rotation}deg)`, // Face right
        };
      case 'right':
        return {
          right: -offset - 30, // Moved 30px to the right (further from edge)
          top: `${position.offset}%`,
          transform: `translateY(-50%) rotate(${rotation}deg)`, // Face left
        };
    }
  };

  const easterEggs = [
    { trigger: 5, message: '🥷 Ninja senses tingling...', effect: 'glow' },
    { trigger: 10, message: '🔓 SECRET TERMINAL UNLOCKED!', effect: 'unlock' },
  ];

  const secretCommands: Record<string, { output: string; action?: () => void }> = {
    help: { output: 'Commands: whoami, skills, hack, dance, explode, matrix, clear, exit' },
    whoami: { output: 'root@ninja ~ A shadowy developer from the void' },
    skills: { output: "['React', 'TypeScript', 'Stealth', 'Ninjutsu', 'Coffee']" },
    matrix: { output: 'Wake up, Neo... The Matrix has you...' },
    sudo: { output: "Nice try. Ninjas don't need sudo." },
    hack: {
      output: 'INITIATING HACK SEQUENCE...',
      action: () => {
        setIsHacking(true);
        setTimeout(() => setIsHacking(false), 3000);
      },
    },
    dance: {
      output: '💃 DANCE MODE ACTIVATED!',
      action: () => {
        setIsDancing(true);
        setTimeout(() => setIsDancing(false), 4000);
      },
    },
    explode: {
      output: '💥 BOOM!',
      action: () => {
        setIsExploding(true);
        setTimeout(() => setIsExploding(false), 1000);
      },
    },
    clear: { output: 'CLEAR' },
    exit: { output: 'EXIT' },
  };

  // Ninja pixel art with katana sword
  const ninjaPixels = [
    '0000011111100000',
    '0001111111111000',
    '0011111111111100',
    '0111100110011110',
    '0111100110011110',
    '0011111111111100',
    '0001111111111000',
    '0000111111110000',
    '0001111111111000',
    '0011111111111100',
    '0111111111111110',
    '1111011111101111',
    '1110011111100111',
    '0000111111110000',
    '0001110000111000',
    '0011100000011100',
  ];

  // Katana sword - proper blade shape
  const swordPixels = [
    // Handle/hilt (wrapped in red/brown)
    { x: 16, y: 9, color: 'hsl(0 60% 40%)' },
    { x: 17, y: 9, color: 'hsl(0 60% 40%)' },
    { x: 16, y: 10, color: 'hsl(0 60% 35%)' },
    { x: 17, y: 10, color: 'hsl(0 60% 35%)' },
    // Guard (tsuba)
    { x: 15, y: 8, color: 'hsl(var(--jules-yellow))' },
    { x: 16, y: 8, color: 'hsl(var(--jules-yellow))' },
    { x: 17, y: 8, color: 'hsl(var(--jules-yellow))' },
    { x: 18, y: 8, color: 'hsl(var(--jules-yellow))' },
    // Blade (silver/white, getting brighter toward tip)
    { x: 17, y: 7, color: 'hsl(0 0% 85%)' },
    { x: 17, y: 6, color: 'hsl(0 0% 88%)' },
    { x: 18, y: 5, color: 'hsl(0 0% 90%)' },
    { x: 18, y: 4, color: 'hsl(0 0% 92%)' },
    { x: 19, y: 3, color: 'hsl(0 0% 95%)' },
    { x: 19, y: 2, color: 'hsl(0 0% 97%)' },
    { x: 20, y: 1, color: 'hsl(0 0% 100%)' }, // tip
    // Edge highlight
    { x: 18, y: 7, color: 'hsl(180 50% 90%)' },
    { x: 18, y: 6, color: 'hsl(180 50% 92%)' },
    { x: 19, y: 5, color: 'hsl(180 60% 95%)' },
    { x: 19, y: 4, color: 'hsl(180 70% 97%)' },
    { x: 20, y: 3, color: 'hsl(var(--jules-cyan) / 0.7)' }, // energy glow near tip
    { x: 20, y: 2, color: 'hsl(var(--jules-cyan) / 0.8)' },
  ];

  // Expression-based eye shapes
  const getEyePixels = (): { x: number; y: number; glow?: boolean }[] => {
    switch (expression) {
      case 'fierce':
        // Angular, intense eyes - slanted inward (red glow)
        return [
          { x: 4, y: 3, glow: true },
          { x: 5, y: 4, glow: true },
          { x: 10, y: 4, glow: true },
          { x: 11, y: 3, glow: true },
        ];
      case 'annoyed':
        // Narrowed, unimpressed eyes - horizontal slits
        return [
          { x: 4, y: 4, glow: true },
          { x: 5, y: 4, glow: true },
          { x: 6, y: 4, glow: true },
          { x: 9, y: 4, glow: true },
          { x: 10, y: 4, glow: true },
          { x: 11, y: 4, glow: true },
        ];
      case 'drowsy':
        // Half-closed eyes - just bottom half
        return [
          { x: 5, y: 4, glow: true },
          { x: 10, y: 4, glow: true },
        ];
      case 'sleeping':
        // Closed eyes - horizontal lines
        return [
          { x: 4, y: 4 },
          { x: 5, y: 4 },
          { x: 6, y: 4 },
          { x: 9, y: 4 },
          { x: 10, y: 4 },
          { x: 11, y: 4 },
        ];
      case 'loving':
        // Heart-shaped happy eyes
        return [
          { x: 4, y: 3, glow: true },
          { x: 6, y: 3, glow: true },
          { x: 5, y: 4, glow: true },
          { x: 9, y: 3, glow: true },
          { x: 11, y: 3, glow: true },
          { x: 10, y: 4, glow: true },
        ];
      case 'cheerful':
      default:
        // Upturned happy eyes - curved upward
        return [
          { x: 4, y: 4, glow: true },
          { x: 5, y: 3, glow: true },
          { x: 6, y: 4 },
          { x: 9, y: 4 },
          { x: 10, y: 3, glow: true },
          { x: 11, y: 4, glow: true },
        ];
    }
  };

  const getPixelColor = (x: number, y: number) => {
    const eyePixels = getEyePixels();
    const eyePixel = eyePixels.find((e) => e.x === x && e.y === y);
    const isHeadband = y === 2 || y === 5;

    if (eyePixel) {
      if (expression === 'fierce') {
        return eyePixel.glow ? 'hsl(0 80% 50%)' : 'hsl(0 70% 40%)'; // Red for fierce
      }
      if (expression === 'loving') {
        return eyePixel.glow ? 'hsl(330 80% 60%)' : 'hsl(330 70% 50%)'; // Pink for love
      }
      if (expression === 'annoyed') {
        return eyePixel.glow ? 'hsl(45 100% 50%)' : 'hsl(45 90% 45%)'; // Yellow/orange for annoyed
      }
      if (expression === 'sleeping') {
        return 'hsl(var(--jules-purple) / 0.4)'; // Dim for sleeping
      }
      return eyePixel.glow ? 'hsl(var(--jules-purple))' : 'hsl(var(--jules-purple) / 0.6)';
    }
    if (isHeadband) return 'hsl(var(--jules-purple) / 0.8)';
    return 'hsl(var(--jules-cyan))';
  };

  const handleClick = () => {
    resetActivity();
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTime.current;
    lastClickTime.current = now;

    const newCount = clickCount + 1;
    setClickCount(newCount);

    // Rapid clicking throws shurikens - go fierce!
    if (timeSinceLastClick < 300 && ninjaRef.current) {
      setExpression('fierce');
      setTimeout(() => setExpression('cheerful'), 800);

      const rect = ninjaRef.current.getBoundingClientRect();
      setShurikens((prev) => [
        ...prev,
        {
          id: shurikenId.current++,
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        },
      ]);
    } else {
      // Single click - show dad joke or love message
      const showLove = Math.random() > 0.6; // 40% chance for love
      if (showLove) {
        const loveMsg = LOVE_MESSAGES[Math.floor(Math.random() * LOVE_MESSAGES.length)];
        setClickMessage(loveMsg);
        setExpression('loving');

        // Spawn hearts
        const hearts: FloatingHeart[] = [];
        for (let i = 0; i < 5; i++) {
          hearts.push({
            id: heartId.current++,
            x: -15 + Math.random() * 30,
            delay: i * 0.1,
          });
        }
        setFloatingHearts(hearts);
      } else {
        const joke = DAD_JOKES[Math.floor(Math.random() * DAD_JOKES.length)];
        setClickMessage(joke);
        setExpression('cheerful');
      }
      setShowClickMessage(true);

      setTimeout(() => {
        setShowClickMessage(false);
        setClickMessage(null);
        setExpression('cheerful');
        setFloatingHearts([]);
      }, 4000);
    }

    const egg = easterEggs.find((e) => e.trigger === newCount);
    if (egg) {
      setCurrentEasterEgg(egg.message);
      if (egg.effect === 'unlock') {
        setSecretUnlocked(true);
        setIsOpen(true);
      }
      setTimeout(() => setCurrentEasterEgg(null), 2000);
    }
  };

  const removeShuriken = (id: number) => {
    setShurikens((prev) => prev.filter((s) => s.id !== id));
  };

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && typedCommand.trim()) {
      const cmdKey = typedCommand.toLowerCase().trim();
      const cmd = secretCommands[cmdKey];

      if (cmd) {
        if (cmd.output === 'CLEAR') {
          setCommandHistory([]);
        } else if (cmd.output === 'EXIT') {
          setIsOpen(false);
        } else {
          setCommandHistory((prev) => [...prev, { cmd: cmdKey, output: cmd.output }]);
          cmd.action?.();
        }
      } else {
        setCommandHistory((prev) => [
          ...prev,
          { cmd: cmdKey, output: `Command not found: ${cmdKey}` },
        ]);
      }
      setTypedCommand('');
    }
  };

  const pixelSize = 4;

  return (
    <>
      {/* Footprints trail */}
      <AnimatePresence>
        {footprints.map((fp) => {
          const age = Date.now() - fp.timestamp;
          const opacity = Math.max(0, 1 - age / 8000);
          return (
            <motion.div
              key={fp.id}
              className="fixed z-40 pointer-events-none"
              style={getFootprintStyles(fp)}
              initial={{ opacity: 0.6, scale: 1 }}
              animate={{ opacity: opacity * 0.4, scale: 0.8 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.5 }}
            >
              {/* Pixel footprint */}
              <svg width="12" height="16" className="text-jules-cyan/30">
                <rect x="2" y="0" width="3" height="3" fill="currentColor" />
                <rect x="7" y="0" width="3" height="3" fill="currentColor" />
                <rect x="1" y="4" width="4" height="3" fill="currentColor" />
                <rect x="7" y="4" width="4" height="3" fill="currentColor" />
                <rect x="2" y="8" width="3" height="4" fill="currentColor" />
                <rect x="7" y="8" width="3" height="4" fill="currentColor" />
                <rect x="3" y="13" width="2" height="3" fill="currentColor" />
                <rect x="7" y="13" width="2" height="3" fill="currentColor" />
              </svg>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Smoke puffs */}
      {/* Enhanced Smoke puffs */}
      <AnimatePresence>
        {smokePuffs.map((smoke) => (
          <motion.div
            key={smoke.id}
            className="fixed z-45 pointer-events-none"
            style={getSmokePuffStyles(smoke)}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 0.9, scale: 1.2 }}
            exit={{ opacity: 0, scale: 2 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* More dramatic smoke particles */}
            <div className="relative">
              {[...Array(12)].map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                const distance = 15 + Math.random() * 20;
                return (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: 10 + Math.random() * 12,
                      height: 10 + Math.random() * 12,
                      background:
                        smoke.type === 'disappear'
                          ? `hsl(var(--jules-cyan) / ${0.3 + Math.random() * 0.3})`
                          : smoke.type === 'dramatic'
                            ? `hsl(var(--jules-yellow) / ${0.4 + Math.random() * 0.3})`
                            : `hsl(var(--jules-magenta) / ${0.3 + Math.random() * 0.3})`,
                      left: 0,
                      top: 0,
                    }}
                    initial={{ scale: 0, opacity: 0.9, x: 0, y: 0 }}
                    animate={{
                      scale: [0, 1.5, 1, 0.5],
                      opacity: [0.9, 0.7, 0.4, 0],
                      x: Math.cos(angle) * distance,
                      y: Math.sin(angle) * distance - (smoke.type === 'disappear' ? 25 : 0),
                    }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.03,
                      ease: 'easeOut',
                    }}
                  />
                );
              })}
              {/* Central flash */}
              <motion.div
                className="absolute w-8 h-8 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, hsl(var(--jules-yellow) / 0.8) 0%, transparent 70%)',
                  left: -16,
                  top: -16,
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: [0, 2, 0], opacity: [1, 0.5, 0] }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Floating Hearts for Love Mode */}
      <AnimatePresence>
        {floatingHearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="fixed z-55 pointer-events-none text-2xl"
            style={{
              ...getPositionStyles(),
              marginLeft: heart.x,
            }}
            initial={{ opacity: 0, y: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 1, 0], y: -80, scale: [0, 1.2, 1, 0.8] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, delay: heart.delay, ease: 'easeOut' }}
          >
            ❤️
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Sleep ZZZ bubbles */}
      <AnimatePresence>
        {isSleeping && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`zzz-${i}`}
                className="fixed z-55 pointer-events-none font-bold"
                style={{
                  ...getPositionStyles(),
                  marginTop: -30,
                  marginLeft: 20 + i * 8,
                  color: 'hsl(var(--jules-cyan))',
                  fontSize: 12 + i * 4,
                }}
                initial={{ opacity: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  y: [-5, -20 - i * 15],
                  x: [0, 5 + i * 3],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.5,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              >
                Z
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Speech Bubble - older ninja commenting */}
      <AnimatePresence>
        {showSpeechBubble && speechBubble && (
          <motion.div
            className="fixed z-[60] pointer-events-none"
            style={{
              ...getPositionStyles(),
              marginTop: -70,
              marginLeft: position.edge === 'right' ? -120 : 60,
            }}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div
              className="relative px-3 py-2 rounded-lg font-mono text-xs md:text-sm max-w-[140px] md:max-w-[180px]"
              style={{
                background:
                  'linear-gradient(135deg, hsl(var(--jules-dark)) 0%, hsl(var(--jules-surface)) 100%)',
                border: '2px solid hsl(var(--jules-yellow) / 0.8)',
                boxShadow:
                  '0 0 20px hsl(var(--jules-yellow) / 0.4), inset 0 0 10px hsl(var(--jules-yellow) / 0.1)',
                color: 'hsl(var(--jules-yellow))',
              }}
            >
              {/* Speech bubble tail */}
              <div
                className="absolute -bottom-2 w-0 h-0"
                style={{
                  left: position.edge === 'right' ? 'auto' : '20px',
                  right: position.edge === 'right' ? '20px' : 'auto',
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: '8px solid hsl(var(--jules-yellow) / 0.8)',
                }}
              />
              <span className="block text-center leading-tight">{speechBubble}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click message bubble - dad jokes or love */}
      <AnimatePresence>
        {showClickMessage && clickMessage && (
          <motion.div
            className="fixed z-[65] pointer-events-none"
            style={{
              ...getPositionStyles(),
              marginTop: -90,
              marginLeft: position.edge === 'right' ? -180 : 40,
            }}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div
              className="relative px-4 py-3 rounded-xl font-mono text-xs md:text-sm max-w-[200px] md:max-w-[280px]"
              style={{
                background:
                  'linear-gradient(135deg, hsl(var(--jules-dark)) 0%, hsl(var(--jules-surface)) 100%)',
                border: '2px solid hsl(var(--jules-cyan) / 0.8)',
                boxShadow:
                  '0 0 25px hsl(var(--jules-cyan) / 0.5), inset 0 0 15px hsl(var(--jules-cyan) / 0.1)',
                color: 'hsl(var(--jules-cyan))',
              }}
            >
              {/* Speech bubble tail */}
              <div
                className="absolute -bottom-2 w-0 h-0"
                style={{
                  left: position.edge === 'right' ? 'auto' : '30px',
                  right: position.edge === 'right' ? '30px' : 'auto',
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderTop: '10px solid hsl(var(--jules-cyan) / 0.8)',
                }}
              />
              <span className="block text-center leading-relaxed">{clickMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shurikens */}
      {shurikens.map((s) => (
        <Shuriken key={s.id} id={s.id} startX={s.x} startY={s.y} onComplete={removeShuriken} />
      ))}

      {/* Hacking overlay */}
      <AnimatePresence>
        {isHacking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] pointer-events-none overflow-hidden font-mono text-xs text-jules-green/40"
          >
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute whitespace-nowrap"
                initial={{ x: Math.random() * window.innerWidth, y: -100 }}
                animate={{ y: window.innerHeight + 100 }}
                transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 0.5 }}
              >
                {Array.from({ length: 50 })
                  .map(() => (Math.random() > 0.5 ? '1' : '0'))
                  .join('')}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        ref={ninjaRef}
        className="fixed z-50 cursor-pointer select-none"
        style={getPositionStyles()}
        initial={{ opacity: 0 }}
        animate={{
          opacity: position.hidden ? 0.3 : 1,
          scale: isExploding ? [1, 1.5, 0] : 1,
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
      >
        <motion.div
          animate={{
            y: isDancing
              ? [0, -15, 0, -10, 0]
              : idleGesture === 'wave'
                ? [0, -8, 0, -8, 0]
                : idleGesture === 'nod'
                  ? [0, 4, 0]
                  : idleGesture === 'peek'
                    ? [0, -12, -12, 0]
                    : [0, -6, 0],
            rotate: isDancing
              ? [0, -10, 10, -10, 10, 0]
              : idleGesture === 'wave'
                ? [0, -15, 15, -15, 15, 0]
                : idleGesture === 'shrug'
                  ? [0, 5, -5, 0]
                  : 0,
            scale:
              idleGesture === 'peek'
                ? [1, 1.1, 1.1, 1]
                : idleGesture === 'shrug'
                  ? [1, 1.05, 1]
                  : 1,
          }}
          transition={{
            duration: isDancing
              ? 0.5
              : idleGesture === 'wave'
                ? 1.5
                : idleGesture === 'none'
                  ? 3
                  : 0.8,
            repeat: idleGesture === 'none' && !isDancing ? Infinity : 0,
            ease: 'easeInOut',
          }}
          className="relative"
        >
          {/* Subtle glow */}
          <div
            className="absolute inset-0 blur-lg opacity-30"
            style={{
              background: 'radial-gradient(circle, hsl(var(--jules-cyan)) 0%, transparent 70%)',
              transform: 'scale(1.5)',
            }}
          />

          {/* Pixel art ninja with katana */}
          <svg
            width={24 * pixelSize}
            height={16 * pixelSize}
            className="relative z-10"
            style={{ imageRendering: 'pixelated' }}
          >
            {/* Ninja body */}
            {ninjaPixels.map((row, y) =>
              row.split('').map((pixel, x) => {
                if (pixel === '1') {
                  return (
                    <rect
                      key={`${x}-${y}`}
                      x={x * pixelSize}
                      y={y * pixelSize}
                      width={pixelSize}
                      height={pixelSize}
                      fill={getPixelColor(x, y)}
                    />
                  );
                }
                return null;
              })
            )}
            {/* Energy katana sword with lightsaber ignite effect */}
            {swordPixels.map((pixel, i) => (
              <motion.rect
                key={`sword-${i}`}
                x={pixel.x * pixelSize}
                y={pixel.y * pixelSize}
                width={pixelSize}
                height={pixelSize}
                fill={swordIgnited ? 'hsl(var(--jules-cyan))' : pixel.color}
                animate={{
                  opacity: swordIgnited ? [0.8, 1, 0.8] : [0.7, 1, 0.7],
                  filter: swordIgnited
                    ? ['brightness(1)', 'brightness(1.5)', 'brightness(1)']
                    : 'none',
                }}
                transition={{
                  duration: swordIgnited ? 0.2 : 0.5,
                  repeat: Infinity,
                  delay: i * 0.05,
                }}
              />
            ))}
            {/* Lightsaber ignite glow effect */}
            {swordIgnited && (
              <>
                {/* Main blade glow */}
                <motion.line
                  x1={17 * pixelSize}
                  y1={7 * pixelSize}
                  x2={20 * pixelSize}
                  y2={1 * pixelSize}
                  stroke="hsl(var(--jules-cyan))"
                  strokeWidth={8}
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 0.3, opacity: { duration: 0.15, repeat: Infinity } }}
                  style={{ filter: 'blur(4px)' }}
                />
                {/* Core glow */}
                <motion.line
                  x1={17 * pixelSize}
                  y1={7 * pixelSize}
                  x2={20 * pixelSize}
                  y2={1 * pixelSize}
                  stroke="white"
                  strokeWidth={3}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.2 }}
                />
                {/* Ambient glow */}
                <motion.ellipse
                  cx={18.5 * pixelSize}
                  cy={4 * pixelSize}
                  rx={12}
                  ry={20}
                  fill="hsl(var(--jules-cyan) / 0.2)"
                  animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                  style={{ filter: 'blur(8px)' }}
                />
              </>
            )}
            {/* Regular sword glow trail (when not ignited) */}
            {!swordIgnited && (
              <motion.line
                x1={19 * pixelSize}
                y1={5 * pixelSize}
                x2={23 * pixelSize}
                y2={1 * pixelSize}
                stroke="hsl(180 100% 70% / 0.4)"
                strokeWidth={3}
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </svg>
        </motion.div>

        {/* Easter egg popup */}
        <AnimatePresence>
          {currentEasterEgg && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -top-12 right-0 px-3 py-1.5 bg-jules-dark/95 border border-jules-cyan/30 rounded font-mono text-xs text-jules-cyan whitespace-nowrap"
            >
              {currentEasterEgg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hint */}
        <motion.div
          className="absolute -top-6 -left-12 font-mono text-[10px] text-jules-cyan/50 whitespace-nowrap pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: clickCount === 0 ? [0, 0.7, 0] : 0 }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
        >
          click me
        </motion.div>
      </motion.div>

      {/* Secret Terminal Modal */}
      <AnimatePresence>
        {isOpen && secretUnlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md mx-4 bg-jules-dark border border-jules-cyan/30 rounded-lg overflow-hidden font-mono"
            >
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-2 bg-jules-dark/50 border-b border-jules-cyan/20">
                <div className="w-2.5 h-2.5 rounded-full bg-jules-magenta/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-jules-yellow/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-jules-green/80" />
                <span className="ml-2 text-jules-cyan/50 text-xs">ninja@terminal</span>
              </div>

              {/* Terminal body */}
              <div className="p-4 h-72 overflow-y-auto text-sm space-y-2">
                <p className="text-jules-cyan/70 text-xs">Type 'help' for commands</p>

                {commandHistory.map((entry, i) => (
                  <div key={i}>
                    <p className="text-jules-magenta/80">$ {entry.cmd}</p>
                    <p className="text-jules-cyan/70 pl-2">{entry.output}</p>
                  </div>
                ))}

                {/* Command input */}
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-jules-magenta/80">$</span>
                  <input
                    type="text"
                    value={typedCommand}
                    onChange={(e) => setTypedCommand(e.target.value)}
                    onKeyDown={handleCommand}
                    className="flex-1 bg-transparent border-none outline-none text-jules-cyan text-sm"
                    placeholder=""
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PixelNinja;
