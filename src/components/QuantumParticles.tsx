import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  type: 'qubit' | 'node';
}

interface Connection {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export const QuantumParticles = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const particles = useMemo<Particle[]>(() => {
    if (dimensions.width === 0) return [];
    const isMobile = dimensions.width < 768;
    const count = isMobile ? 12 : 25;

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 4 + 6,
      delay: Math.random() * 2,
      type: Math.random() > 0.5 ? 'qubit' : 'node',
    }));
  }, [dimensions.width]);

  const connections = useMemo<Connection[]>(() => {
    const conns: Connection[] = [];
    const maxDistance = 25;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance && Math.random() > 0.6) {
          conns.push({
            id: `${i}-${j}`,
            x1: particles[i].x,
            y1: particles[i].y,
            x2: particles[j].x,
            y2: particles[j].y,
          });
        }
      }
    }
    return conns;
  }, [particles]);

  if (dimensions.width === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map((conn) => (
          <motion.line
            key={conn.id}
            x1={`${conn.x1}%`}
            y1={`${conn.y1}%`}
            x2={`${conn.x2}%`}
            y2={`${conn.y2}%`}
            stroke="hsl(var(--jules-cyan))"
            strokeWidth="0.5"
            strokeOpacity="0.15"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: Math.random() }}
          />
        ))}
      </svg>

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
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.2, 0.6, 0.2],
            scale: [0.8, 1.2, 0.8],
            x: [0, Math.random() * 30 - 15, 0],
            y: [0, Math.random() * 30 - 15, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {particle.type === 'qubit' ? (
            <div
              className="w-full h-full rounded-full"
              style={{
                background:
                  'radial-gradient(circle, hsl(var(--jules-magenta)) 0%, hsl(var(--jules-cyan)) 100%)',
                boxShadow:
                  '0 0 10px hsl(var(--jules-cyan) / 0.5), 0 0 20px hsl(var(--jules-magenta) / 0.3)',
              }}
            />
          ) : (
            <div
              className="w-full h-full rounded-full"
              style={{
                background: 'hsl(var(--jules-cyan))',
                boxShadow: '0 0 8px hsl(var(--jules-cyan) / 0.6)',
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default QuantumParticles;
