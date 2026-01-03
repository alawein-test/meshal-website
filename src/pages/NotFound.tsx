import { useLocation, Link } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CyberpunkLayout } from '@/components/shared/CyberpunkLayout';
import { GlitchText } from '@/components/GlitchText';
import { MatrixRain } from '@/components/MatrixRain';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';
import { ANIMATION, INTERVAL, DATA_INTERVAL } from '@/utils/timing';

const ASCII_CHARS = [
  '@',
  '#',
  '$',
  '%',
  '&',
  '*',
  '!',
  '?',
  '/',
  '\\',
  '|',
  '-',
  '+',
  '=',
  '<',
  '>',
  '~',
  '^',
];
const NEON_COLORS = [
  'text-jules-cyan',
  'text-jules-magenta',
  'text-jules-purple',
  'text-jules-neon',
];

interface FloatingChar {
  id: number;
  char: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

const TerminalTyping = ({ lines }: { lines: string[] }) => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);

  useEffect(() => {
    if (currentLine >= lines.length) return;

    const line = lines[currentLine];
    if (currentChar < line.length) {
      const timeout = setTimeout(
        () => {
          setDisplayedLines((prev) => {
            const newLines = [...prev];
            newLines[currentLine] = line.slice(0, currentChar + 1);
            return newLines;
          });
          setCurrentChar((c) => c + 1);
        },
        30 + Math.random() * 20
      );
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [currentLine, currentChar, lines]);

  return (
    <div className="font-mono text-xs md:text-sm text-left bg-jules-dark/80 border border-jules-cyan/30 rounded-lg p-4 max-w-lg mx-auto backdrop-blur-sm">
      <div className="flex gap-2 mb-3 pb-2 border-b border-jules-cyan/20">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="text-muted-foreground/50 ml-2">terminal@ninja-hub</span>
      </div>
      {displayedLines.map((line, i) => (
        <div key={i} className="flex">
          <span className="text-jules-cyan mr-2">$</span>
          <span
            className={
              i === 0 ? 'text-red-400' : i === 1 ? 'text-jules-magenta' : 'text-muted-foreground'
            }
          >
            {line}
          </span>
          {i === currentLine && currentChar < lines[currentLine]?.length && (
            <motion.span
              className="inline-block w-2 h-4 bg-jules-cyan ml-0.5"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          )}
        </div>
      ))}
      {currentLine >= lines.length && (
        <div className="flex mt-1">
          <span className="text-jules-cyan mr-2">$</span>
          <motion.span
            className="inline-block w-2 h-4 bg-jules-cyan"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        </div>
      )}
    </div>
  );
};

const NotFound = () => {
  const location = useLocation();
  const [glitchCode, setGlitchCode] = useState('404');
  const [pageGlitch, setPageGlitch] = useState(false);

  const terminalLines = useMemo(
    () => [
      `ERROR: Route "${location.pathname}" not found`,
      `STATUS: 0x404 | SECTOR: UNKNOWN`,
      `Searching backup nodes...`,
      `Connection terminated.`,
      `Initiating recovery protocol...`,
    ],
    [location.pathname]
  );

  const floatingChars = useMemo<FloatingChar[]>(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        char: ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 12 + Math.random() * 24,
        duration: 8 + Math.random() * 12,
        delay: Math.random() * 5,
        color: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
      })),
    []
  );

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const chars = '!@#$%^&*()_+=-[]{}|;:,.<>?/~`0123456789';
      const glitched = '404'
        .split('')
        .map(() => {
          if (Math.random() > 0.7) {
            return chars[Math.floor(Math.random() * chars.length)];
          }
          return '4';
        })
        .join('');
      setGlitchCode(glitched);
      setTimeout(() => setGlitchCode('404'), DATA_INTERVAL.GLITCH_EFFECT);
    }, INTERVAL.BLINK_CHECK);

    return () => clearInterval(glitchInterval);
  }, []);

  // Full page glitch effect
  useEffect(() => {
    const pageGlitchInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        setPageGlitch(true);
        setTimeout(() => setPageGlitch(false), ANIMATION.BLINK + Math.random() * ANIMATION.QUICK);
      }
    }, ANIMATION.HACKING);

    return () => clearInterval(pageGlitchInterval);
  }, []);

  return (
    <CyberpunkLayout showHeader={true} showFooter={false} showNinja={true}>
      {/* Full page glitch overlay */}
      {pageGlitch && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {/* Horizontal slice displacement */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: 'inset(20% 0 60% 0)',
              transform: 'translateX(-8px)',
              background:
                'linear-gradient(90deg, transparent 0%, hsl(var(--jules-cyan) / 0.3) 50%, transparent 100%)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              clipPath: 'inset(45% 0 35% 0)',
              transform: 'translateX(12px)',
              background:
                'linear-gradient(90deg, transparent 0%, hsl(var(--jules-magenta) / 0.4) 50%, transparent 100%)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              clipPath: 'inset(70% 0 10% 0)',
              transform: 'translateX(-5px) skewX(-2deg)',
              background:
                'linear-gradient(90deg, transparent 0%, hsl(var(--jules-purple) / 0.3) 50%, transparent 100%)',
            }}
          />
          {/* Scanline burst */}
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background:
                'repeating-linear-gradient(0deg, transparent, transparent 1px, hsl(var(--jules-cyan) / 0.2) 1px, hsl(var(--jules-cyan) / 0.2) 2px)',
              animation: 'glitchScan 0.1s linear',
            }}
          />
          {/* Color aberration */}
          <div className="absolute inset-0 mix-blend-screen opacity-30 bg-gradient-to-r from-jules-cyan via-transparent to-jules-magenta" />
        </div>
      )}

      {/* Intense Matrix Rain Effect */}
      <div className="fixed inset-0 z-0" style={{ opacity: 0.35 }}>
        <MatrixRain />
      </div>

      {/* Floating ASCII Characters */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {floatingChars.map((char) => (
          <motion.span
            key={char.id}
            className={`absolute font-mono ${char.color} opacity-20`}
            style={{
              left: `${char.x}%`,
              top: `${char.y}%`,
              fontSize: char.size,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              rotate: [-15, 15, -15],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: char.duration,
              delay: char.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {char.char}
          </motion.span>
        ))}
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
        <div className="text-center relative">
          {/* Animated background grid */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-jules-cyan/5 via-transparent to-jules-magenta/5" />
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-px bg-gradient-to-r from-transparent via-jules-cyan/30 to-transparent"
                style={{ top: `${i * 5}%`, left: 0, right: 0 }}
                animate={{ opacity: [0.1, 0.5, 0.1], scaleX: [0.8, 1, 0.8] }}
                transition={{ duration: 3, delay: i * 0.1, repeat: Infinity }}
              />
            ))}
          </div>

          {/* Giant 404 with glitch effect */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="relative mb-6"
          >
            <h1 className="text-[10rem] md:text-[14rem] font-black leading-none select-none">
              <GlitchText
                text={glitchCode}
                className="text-transparent bg-clip-text bg-gradient-to-br from-jules-cyan via-jules-purple to-jules-magenta"
                glitchIntensity="high"
              />
            </h1>
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                background:
                  'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--jules-cyan) / 0.1) 2px, hsl(var(--jules-cyan) / 0.1) 4px)',
              }}
            />
            <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-br from-jules-cyan via-jules-purple to-jules-magenta -z-10" />
          </motion.div>

          {/* Error message */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-2 mb-8"
          >
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              <GlitchText text="SYSTEM BREACH DETECTED" glitchIntensity="low" />
            </h2>
          </motion.div>

          {/* Terminal typing animation */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-10"
          >
            <TerminalTyping lines={terminalLines} />
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-jules-cyan to-jules-purple hover:from-jules-cyan/80 hover:to-jules-purple/80 text-jules-dark font-bold gap-2 min-w-[180px]"
            >
              <Link to="/">
                <Home className="w-5 h-5" />
                Return Home
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-jules-cyan/50 text-jules-cyan hover:bg-jules-cyan/10 gap-2 min-w-[180px]"
            >
              <Link to="/projects">
                <Search className="w-5 h-5" />
                Explore Projects
              </Link>
            </Button>
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            className="absolute -top-20 -left-20 w-40 h-40 border border-jules-cyan/20 rotate-45"
            animate={{ rotate: [45, 50, 45], scale: [1, 1.05, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 -right-20 w-32 h-32 border border-jules-magenta/20 rotate-12"
            animate={{ rotate: [12, 17, 12], scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>
      </div>
    </CyberpunkLayout>
  );
};

export default NotFound;
