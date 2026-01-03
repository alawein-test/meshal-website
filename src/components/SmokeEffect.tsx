// Smoke puff effect on click
import { motion } from 'framer-motion';

interface SmokeEffectProps {
  id: number;
  x: number;
  y: number;
  onComplete: (id: number) => void;
}

export const SmokeEffect = ({ id, x, y, onComplete }: SmokeEffectProps) => {
  const particles = Array.from({ length: 8 }, (_, i) => ({
    angle: i * 45 * (Math.PI / 180),
    delay: Math.random() * 0.1,
    size: 20 + Math.random() * 30,
    distance: 30 + Math.random() * 50,
  }));

  return (
    <motion.div
      className="fixed pointer-events-none z-[60]"
      style={{ left: x, top: y }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      onAnimationComplete={() => onComplete(id)}
    >
      {/* Central flash */}
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(var(--jules-cyan) / 0.8) 0%, transparent 70%)',
          width: 60,
          height: 60,
        }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Smoke puffs */}
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            background: `radial-gradient(circle, hsl(var(--jules-purple) / 0.6) 0%, hsl(var(--jules-cyan) / 0.3) 50%, transparent 70%)`,
            filter: 'blur(4px)',
          }}
          initial={{
            x: 0,
            y: 0,
            scale: 0.5,
            opacity: 0.8,
          }}
          animate={{
            x: Math.cos(particle.angle) * particle.distance,
            y: Math.sin(particle.angle) * particle.distance,
            scale: 1.5,
            opacity: 0,
          }}
          transition={{
            duration: 0.6,
            delay: particle.delay,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Ninja symbol flash */}
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0, opacity: 1, rotate: 0 }}
        animate={{ scale: 1.5, opacity: 0, rotate: 180 }}
        transition={{ duration: 0.4 }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L14 10H22L12 14L14 22L12 18L10 22L12 14L2 10H10L12 2Z"
            stroke="hsl(var(--jules-magenta))"
            strokeWidth="1"
            fill="none"
            style={{ filter: 'drop-shadow(0 0 8px hsl(var(--jules-magenta)))' }}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default SmokeEffect;
