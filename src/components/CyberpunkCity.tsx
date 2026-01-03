import { motion } from 'framer-motion';

/**
 * Animated Cyberpunk City Background
 * Silhouette skyline with neon lights and flying vehicles
 */
const CyberpunkCity = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Dark gradient sky */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, hsl(var(--jules-dark)) 0%, hsl(250 30% 8%) 40%, hsl(280 40% 12%) 100%)',
        }}
      />

      {/* Distant stars */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-px rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              background: 'hsl(var(--foreground))',
              opacity: 0.3 + Math.random() * 0.4,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* City Skyline - Bottom */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full"
        viewBox="0 0 1440 400"
        preserveAspectRatio="xMidYMax slice"
        style={{ height: '50vh', minHeight: '300px' }}
      >
        {/* Background buildings layer */}
        <g fill="hsl(var(--jules-dark))" opacity="0.8">
          <rect x="50" y="280" width="60" height="120" />
          <rect x="130" y="240" width="45" height="160" />
          <rect x="200" y="200" width="80" height="200" />
          <rect x="300" y="260" width="55" height="140" />
          <rect x="380" y="180" width="70" height="220" />
          <rect x="480" y="220" width="50" height="180" />
          <rect x="560" y="160" width="90" height="240" />
          <rect x="680" y="200" width="60" height="200" />
          <rect x="770" y="140" width="100" height="260" />
          <rect x="900" y="220" width="55" height="180" />
          <rect x="980" y="180" width="75" height="220" />
          <rect x="1080" y="240" width="50" height="160" />
          <rect x="1150" y="200" width="85" height="200" />
          <rect x="1260" y="260" width="60" height="140" />
          <rect x="1340" y="220" width="70" height="180" />
        </g>

        {/* Foreground buildings with details */}
        <g fill="hsl(250 25% 6%)">
          <rect x="100" y="300" width="80" height="100" />
          <rect x="250" y="250" width="100" height="150" />
          <rect x="400" y="280" width="70" height="120" />
          <rect x="520" y="220" width="120" height="180" />
          <rect x="700" y="260" width="90" height="140" />
          <rect x="850" y="200" width="110" height="200" />
          <rect x="1020" y="270" width="80" height="130" />
          <rect x="1150" y="240" width="100" height="160" />
          <rect x="1300" y="290" width="80" height="110" />
        </g>

        {/* Neon window lights */}
        {[
          { x: 110, y: 310, color: 'jules-cyan' },
          { x: 130, y: 330, color: 'jules-magenta' },
          { x: 160, y: 320, color: 'jules-cyan' },
          { x: 270, y: 260, color: 'jules-yellow' },
          { x: 290, y: 290, color: 'jules-cyan' },
          { x: 320, y: 270, color: 'jules-magenta' },
          { x: 540, y: 240, color: 'jules-cyan' },
          { x: 580, y: 280, color: 'jules-yellow' },
          { x: 600, y: 260, color: 'jules-magenta' },
          { x: 560, y: 320, color: 'jules-cyan' },
          { x: 720, y: 280, color: 'jules-yellow' },
          { x: 750, y: 310, color: 'jules-cyan' },
          { x: 880, y: 220, color: 'jules-magenta' },
          { x: 910, y: 260, color: 'jules-cyan' },
          { x: 930, y: 300, color: 'jules-yellow' },
          { x: 890, y: 340, color: 'jules-cyan' },
          { x: 1170, y: 260, color: 'jules-magenta' },
          { x: 1200, y: 290, color: 'jules-cyan' },
          { x: 1220, y: 320, color: 'jules-yellow' },
        ].map((light, i) => (
          <motion.rect
            key={i}
            x={light.x}
            y={light.y}
            width="8"
            height="12"
            fill={`hsl(var(--${light.color}))`}
            opacity={0.8}
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              filter: `drop-shadow(0 0 8px hsl(var(--${light.color})))`,
            }}
          />
        ))}

        {/* Antenna lights */}
        <motion.circle
          cx="820"
          cy="130"
          r="3"
          fill="hsl(var(--destructive))"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <motion.circle
          cx="610"
          cy="150"
          r="2"
          fill="hsl(var(--destructive))"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        />
        <motion.circle
          cx="905"
          cy="190"
          r="2.5"
          fill="hsl(var(--destructive))"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
        />
      </svg>

      {/* Flying vehicles */}
      {[
        { startX: -50, y: '20%', duration: 12, delay: 0 },
        { startX: -30, y: '35%', duration: 18, delay: 5 },
        { startX: -40, y: '15%', duration: 15, delay: 8 },
      ].map((vehicle, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: vehicle.y }}
          initial={{ x: vehicle.startX }}
          animate={{ x: '100vw' }}
          transition={{
            duration: vehicle.duration,
            repeat: Infinity,
            delay: vehicle.delay,
            ease: 'linear',
          }}
        >
          {/* Vehicle body */}
          <div
            className="relative w-8 h-2 rounded-full"
            style={{
              background:
                'linear-gradient(90deg, hsl(var(--jules-cyan)) 0%, hsl(var(--jules-magenta)) 100%)',
              boxShadow:
                '0 0 20px hsl(var(--jules-cyan) / 0.6), 0 0 40px hsl(var(--jules-magenta) / 0.4)',
            }}
          >
            {/* Trail */}
            <div
              className="absolute right-full top-1/2 -translate-y-1/2 w-12 h-0.5"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, hsl(var(--jules-cyan) / 0.3) 100%)',
              }}
            />
          </div>
        </motion.div>
      ))}

      {/* Horizontal scan lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--jules-cyan)) 2px, hsl(var(--jules-cyan)) 3px)',
        }}
      />

      {/* Vignette overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, hsl(var(--jules-dark)) 100%)',
          opacity: 0.4,
        }}
      />
    </div>
  );
};

export default CyberpunkCity;
