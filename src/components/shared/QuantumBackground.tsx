// Quantum/Cyberpunk Background - Reusable across public pages
import { motion } from 'framer-motion';

interface QuantumBackgroundProps {
  variant?: 'default' | 'minimal' | 'intense';
  showGrid?: boolean;
  showParticles?: boolean;
}

export function QuantumBackground({
  variant = 'default',
  showGrid = true,
  showParticles = true,
}: QuantumBackgroundProps) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-jules-dark">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-jules-dark via-[hsl(240,30%,8%)] to-[hsl(260,40%,10%)]" />

      {/* Animated orbs */}
      {variant !== 'minimal' && (
        <>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 -right-32 w-96 h-96 rounded-full"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--jules-cyan) / 0.15) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.15, 0.1, 0.15],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--jules-magenta) / 0.12) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.08, 0.15, 0.08],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--jules-purple) / 0.1) 0%, transparent 70%)',
              filter: 'blur(100px)',
            }}
          />
        </>
      )}

      {/* Grid pattern */}
      {showGrid && (
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--jules-cyan)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--jules-cyan)) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      )}

      {/* Floating particles */}
      {showParticles && variant === 'intense' && (
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-jules-cyan/40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--jules-cyan) / 0.1) 2px, hsl(var(--jules-cyan) / 0.1) 4px)',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, hsl(var(--jules-dark)) 100%)',
          opacity: 0.5,
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

export default QuantumBackground;
