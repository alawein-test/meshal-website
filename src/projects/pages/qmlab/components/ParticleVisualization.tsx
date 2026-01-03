import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

interface ParticleVisualizationProps {
  particleCount?: number;
  type?: 'wave' | 'orbital' | 'interference';
}

const ParticleVisualization = ({
  particleCount = 50,
  type = 'wave',
}: ParticleVisualizationProps) => {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 2,
      duration: Math.random() * 3 + 2,
    }));
  }, [particleCount]);

  const wavePoints = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => ({
      x: i,
      y: Math.sin(i * 0.1) * 30 + 50,
    }));
  }, []);

  return (
    <div className="relative w-full h-full min-h-[200px] overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="cyan"
                strokeWidth="0.5"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Wave Function Line */}
      {type === 'wave' && (
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            d={`M ${wavePoints.map((p) => `${p.x} ${p.y}`).join(' L ')}`}
            fill="none"
            stroke="url(#waveGradient)"
            strokeWidth="2"
            className="drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]"
          />
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {/* Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background:
              type === 'orbital'
                ? 'radial-gradient(circle, #8b5cf6, transparent)'
                : type === 'interference'
                  ? 'radial-gradient(circle, #ec4899, transparent)'
                  : 'radial-gradient(circle, #06b6d4, transparent)',
            boxShadow: `0 0 ${particle.size * 2}px ${
              type === 'orbital' ? '#8b5cf6' : type === 'interference' ? '#ec4899' : '#06b6d4'
            }`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
            x:
              type === 'orbital'
                ? [0, Math.cos(particle.delay * Math.PI) * 30, 0]
                : [0, Math.random() * 20 - 10, 0],
            y:
              type === 'orbital'
                ? [0, Math.sin(particle.delay * Math.PI) * 30, 0]
                : [0, Math.random() * 20 - 10, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Central Nucleus for Orbital */}
      {type === 'orbital' && (
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"
          animate={{
            scale: [1, 1.1, 1],
            boxShadow: [
              '0 0 20px rgba(139, 92, 246, 0.5)',
              '0 0 40px rgba(139, 92, 246, 0.7)',
              '0 0 20px rgba(139, 92, 246, 0.5)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Interference Pattern */}
      {type === 'interference' && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-500/30"
              style={{
                width: `${(i + 1) * 40}px`,
                height: `${(i + 1) * 40}px`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3,
                delay: i * 0.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </>
      )}

      {/* Labels */}
      <div className="absolute bottom-2 left-2 text-xs text-cyan-400/70 font-mono">
        {type === 'wave' && 'Ψ(x,t) = Ae^(ikx-iωt)'}
        {type === 'orbital' && 'n=2, l=1, m=0'}
        {type === 'interference' && 'Δφ = 2πd sin(θ)/λ'}
      </div>
    </div>
  );
};

export default ParticleVisualization;
