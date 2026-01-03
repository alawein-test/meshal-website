import { motion } from 'framer-motion';

interface IslamicPatternProps {
  className?: string;
  opacity?: number;
  color?: string;
}

const IslamicPattern = ({
  className = '',
  opacity = 0.1,
  color = 'currentColor',
}: IslamicPatternProps) => {
  // Generate geometric star pattern
  const generateStarPath = (
    cx: number,
    cy: number,
    outerRadius: number,
    innerRadius: number,
    points: number
  ) => {
    const step = Math.PI / points;
    let path = '';

    for (let i = 0; i < 2 * points; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = cx + radius * Math.cos(i * step - Math.PI / 2);
      const y = cy + radius * Math.sin(i * step - Math.PI / 2);
      path += (i === 0 ? 'M' : 'L') + x + ',' + y;
    }

    return path + 'Z';
  };

  const gridSize = 100;
  const stars = [];

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const x = col * gridSize + 50;
      const y = row * gridSize + 50;
      stars.push({ x, y, delay: (row + col) * 0.1 });
    }
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg className="w-full h-full" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern
            id="islamicGrid"
            x="0"
            y="0"
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
          >
            {/* 8-pointed star */}
            <motion.path
              d={generateStarPath(50, 50, 40, 20, 8)}
              fill="none"
              stroke={color}
              strokeWidth="1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: opacity, scale: 1 }}
              transition={{ duration: 1 }}
            />
            {/* Inner octagon */}
            <motion.path
              d={generateStarPath(50, 50, 20, 15, 8)}
              fill="none"
              stroke={color}
              strokeWidth="0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: opacity * 0.7 }}
              transition={{ duration: 1, delay: 0.3 }}
            />
            {/* Connecting lines */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={color}
              strokeWidth="0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: opacity * 0.5 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </pattern>

          {/* Gradient overlay */}
          <radialGradient id="patternFade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#islamicGrid)" mask="url(#fadeMask)" />

        {/* Decorative corner elements */}
        {[
          { x: 0, y: 0, rotate: 0 },
          { x: 500, y: 0, rotate: 90 },
          { x: 500, y: 500, rotate: 180 },
          { x: 0, y: 500, rotate: 270 },
        ].map((corner, i) => (
          <motion.g
            key={i}
            transform={`translate(${corner.x}, ${corner.y}) rotate(${corner.rotate})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: opacity }}
            transition={{ duration: 1, delay: i * 0.2 }}
          >
            <path d="M0,0 Q40,20 60,60 Q20,40 0,0" fill="none" stroke={color} strokeWidth="1" />
            <path d="M0,0 Q30,10 40,40 Q10,30 0,0" fill="none" stroke={color} strokeWidth="0.5" />
          </motion.g>
        ))}
      </svg>
    </div>
  );
};

export default IslamicPattern;
