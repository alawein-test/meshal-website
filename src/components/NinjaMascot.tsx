// Animated ninja mascot - interactive with smoke, sleep, sword, shuriken actions
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState, useCallback, useRef } from 'react';
import { NINJA_PATTERN } from '@/components/icons/NinjaIcon';
import { ANIMATION, INTERVAL } from '@/utils/timing';

interface NinjaMascotProps {
  className?: string;
  weapon?: 'katana' | 'shuriken';
}

type NinjaState = 'idle' | 'sleeping' | 'attacking' | 'throwing' | 'disappearing' | 'hidden';

// Smoke particles for poof effect
const SmokeParticle = ({ delay, x, y }: { delay: number; x: number; y: number }) => (
  <motion.div
    className="absolute rounded-full bg-jules-cyan/40"
    style={{ width: 20, height: 20, left: x, top: y }}
    initial={{ scale: 0, opacity: 0.8 }}
    animate={{
      scale: [0, 2, 3],
      opacity: [0.8, 0.4, 0],
      x: [0, (Math.random() - 0.5) * 60],
      y: [0, -40 - Math.random() * 40],
    }}
    transition={{ duration: 0.8, delay, ease: 'easeOut' }}
  />
);

// Flying shuriken
const FlyingShuriken = ({ onComplete }: { onComplete: () => void }) => {
  const SHURIKEN_PATH = 'M12 2L14 10H22L12 14L14 22L12 18L10 22L12 14L2 10H10L12 2Z';

  useEffect(() => {
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      className="fixed z-50"
      style={{ filter: 'drop-shadow(0 0 8px hsl(var(--jules-cyan)))' }}
      initial={{ x: 0, y: 0, rotate: 0, scale: 1 }}
      animate={{
        x: [0, window.innerWidth / 2],
        y: [0, -100],
        rotate: [0, 720],
        scale: [1, 0.5],
        opacity: [1, 0],
      }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <path d={SHURIKEN_PATH} fill="hsl(var(--jules-cyan))" />
    </motion.svg>
  );
};

export const NinjaMascot = ({ className = '', weapon = 'katana' }: NinjaMascotProps) => {
  const [state, setState] = useState<NinjaState>('idle');
  const [isBlinking, setIsBlinking] = useState(false);
  const [showShuriken, setShowShuriken] = useState(false);
  const [smokeParticles, setSmokeParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastInteractionRef = useRef(Date.now());

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const pixelSize = 64;
  const cellSize = pixelSize / 16;
  const weaponWidth = pixelSize * 0.5;
  const totalWidth = pixelSize + weaponWidth;

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseX.set((e.clientX - centerX) * 0.08);
      mouseY.set((e.clientY - centerY) * 0.08);

      // Wake up if sleeping
      if (state === 'sleeping') {
        lastInteractionRef.current = Date.now();
        setState('idle');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, state]);

  // Sleep after inactivity
  useEffect(() => {
    const checkIdle = () => {
      if (state === 'idle' && Date.now() - lastInteractionRef.current > 8000) {
        setState('sleeping');
      }
    };

    idleTimerRef.current = setInterval(checkIdle, INTERVAL.IDLE_CHECK);
    return () => {
      if (idleTimerRef.current) clearInterval(idleTimerRef.current);
    };
  }, [state]);

  // Random blinking (only when idle)
  useEffect(() => {
    if (state !== 'idle') return;

    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), ANIMATION.BLINK);
      }
    }, INTERVAL.BLINK_CHECK);

    return () => clearInterval(blinkInterval);
  }, [state]);

  // Smoke poof effect
  const createSmoke = useCallback(() => {
    const particles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 40 + 10,
      y: Math.random() * 40 + 10,
    }));
    setSmokeParticles(particles);
    setTimeout(() => setSmokeParticles([]), ANIMATION.EXPLOSION);
  }, []);

  // Handle click - cycles through actions
  const handleMascotClick = useCallback(() => {
    lastInteractionRef.current = Date.now();

    if (state === 'sleeping') {
      setState('idle');
      return;
    }

    if (state !== 'idle') return;

    // Random action
    const actions: NinjaState[] =
      weapon === 'katana' ? ['attacking', 'disappearing'] : ['throwing', 'disappearing'];

    const action = actions[Math.floor(Math.random() * actions.length)];

    if (action === 'disappearing') {
      createSmoke();
      setState('disappearing');
      setTimeout(() => setState('hidden'), ANIMATION.STANDARD);
      setTimeout(() => {
        createSmoke();
        setState('idle');
      }, ANIMATION.HACKING);
    } else if (action === 'attacking') {
      setState('attacking');
      setTimeout(() => setState('idle'), ANIMATION.SMOKE_FADE);
    } else if (action === 'throwing') {
      setState('throwing');
      setShowShuriken(true);
      setTimeout(() => setState('idle'), ANIMATION.SMOKE_FADE);
    }
  }, [state, weapon, createSmoke]);

  const getColor = (value: number, row: number): string => {
    const isEye = value === 2 && (row === 3 || row === 4);

    // Closed eyes when sleeping - purple glow dimmed
    if (isEye && state === 'sleeping') return 'hsl(var(--jules-purple) / 0.3)';
    if (isEye && isBlinking) return 'hsl(var(--jules-purple))';
    if (value === 2) return 'hsl(var(--jules-purple))'; // Purple luminescent eyes
    if (value === 1) return 'hsl(var(--jules-cyan))';
    return 'transparent';
  };

  // ZZZ animation for sleeping
  const SleepingZs = () => (
    <g>
      {[0, 1, 2].map((i) => (
        <motion.text
          key={i}
          x={pixelSize - 5 + i * 8}
          y={-5 - i * 10}
          fill="hsl(var(--jules-cyan))"
          fontSize={10 - i * 2}
          fontFamily="monospace"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: [0, 1, 0], y: [5, -5, -15] }}
          transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
        >
          z
        </motion.text>
      ))}
    </g>
  );

  if (state === 'hidden') return null;

  return (
    <>
      {/* Flying shuriken */}
      <AnimatePresence>
        {showShuriken && (
          <div className="fixed bottom-16 right-16 z-50">
            <FlyingShuriken onComplete={() => setShowShuriken(false)} />
          </div>
        )}
      </AnimatePresence>

      <motion.div
        className={`fixed bottom-8 right-8 z-40 cursor-pointer group ${className}`}
        style={{ x, y }}
        onClick={handleMascotClick}
        whileHover={{ scale: state === 'sleeping' ? 1.05 : 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={
          state === 'attacking'
            ? { rotate: [0, 15, -15, 0] }
            : state === 'throwing'
              ? { x: [0, -10, 0] }
              : state === 'sleeping'
                ? { y: [0, 2, 0] }
                : state === 'disappearing'
                  ? { scale: [1, 0], opacity: [1, 0] }
                  : {}
        }
        transition={{
          duration: state === 'sleeping' ? 2 : 0.3,
          repeat: state === 'sleeping' ? Infinity : 0,
        }}
      >
        {/* Smoke particles */}
        <AnimatePresence>
          {smokeParticles.map((p, i) => (
            <SmokeParticle key={p.id} delay={i * 0.05} x={p.x} y={p.y} />
          ))}
        </AnimatePresence>

        {/* Glow effect */}
        <motion.div
          className="absolute blur-xl rounded-full"
          style={{
            width: pixelSize,
            height: pixelSize,
            left: 0,
            top: 0,
            background:
              state === 'sleeping'
                ? 'radial-gradient(circle, hsl(var(--jules-cyan) / 0.2) 0%, transparent 70%)'
                : 'radial-gradient(circle, hsl(var(--jules-cyan) / 0.6) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: state === 'sleeping' ? [0.2, 0.3, 0.2] : [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        <svg
          width={totalWidth}
          height={pixelSize}
          viewBox={`0 0 ${totalWidth} ${pixelSize}`}
          className="relative z-10"
          role="img"
          aria-label="Ninja mascot"
          style={{ opacity: state === 'sleeping' ? 0.7 : 1 }}
        >
          <defs>
            <filter id="mascot-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="mascot-blade-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--jules-cyan))" stopOpacity="1" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="100%" stopColor="hsl(var(--jules-cyan))" stopOpacity="0.8" />
            </linearGradient>
            <filter id="mascot-blade-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="3" result="blur1" />
              <feGaussianBlur stdDeviation="1" result="blur2" />
              <feMerge>
                <feMergeNode in="blur1" />
                <feMergeNode in="blur2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g filter="url(#mascot-glow)">
            {NINJA_PATTERN.map((row, rowY) =>
              row.map((cell, colX) => {
                if (cell === 0) return null;
                return (
                  <motion.rect
                    key={`${colX}-${rowY}`}
                    x={colX * cellSize}
                    y={rowY * cellSize}
                    width={cellSize}
                    height={cellSize}
                    fill={getColor(cell, rowY)}
                  />
                );
              })
            )}

            {/* Sleeping ZZZs */}
            {state === 'sleeping' && <SleepingZs />}

            {/* Katana with swing animation */}
            {weapon === 'katana' && (
              <motion.g
                transform={`translate(${pixelSize - cellSize * 2}, ${pixelSize * 0.1})`}
                animate={state === 'attacking' ? { rotate: [0, -45, 0] } : {}}
                transition={{ duration: 0.3 }}
                style={{ transformOrigin: `${cellSize * 1.5}px ${cellSize * 12}px` }}
              >
                <rect
                  x={cellSize * 1}
                  y={cellSize * 10}
                  width={cellSize * 1.5}
                  height={cellSize * 4}
                  fill="hsl(var(--jules-magenta))"
                />
                <rect
                  x={cellSize * 0.5}
                  y={cellSize * 9}
                  width={cellSize * 2.5}
                  height={cellSize * 1.5}
                  fill="hsl(var(--jules-magenta))"
                  rx={cellSize * 0.3}
                />
                <g filter="url(#mascot-blade-glow)">
                  <polygon
                    points={`
                      ${cellSize * 1.75},${cellSize * 9}
                      ${cellSize * 2.5},${cellSize * 0}
                      ${cellSize * 1},${cellSize * 0}
                      ${cellSize * 1},${cellSize * 9}
                    `}
                    fill="url(#mascot-blade-gradient)"
                  />
                  <motion.line
                    x1={cellSize * 1.75}
                    y1={cellSize * 0.5}
                    x2={cellSize * 1.4}
                    y2={cellSize * 8.5}
                    stroke="white"
                    strokeWidth={cellSize * 0.4}
                    opacity={0.9}
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </g>
              </motion.g>
            )}
          </g>
        </svg>

        {/* Tooltip */}
        <motion.div
          className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none px-2 py-1 rounded bg-jules-dark/80 border border-jules-cyan/20"
          style={{ color: 'hsl(var(--jules-cyan))' }}
        >
          {state === 'sleeping' ? '💤 Shhh...' : 'Click me!'}
        </motion.div>
      </motion.div>
    </>
  );
};

export default NinjaMascot;
