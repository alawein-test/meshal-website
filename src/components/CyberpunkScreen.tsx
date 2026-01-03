import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Cyberpunk TV Screen with animated science/optimization/coding visuals
 * Features scan lines, glitch effects, particles, and hover interactions
 */
const CyberpunkScreen = () => {
  const [activeVisual, setActiveVisual] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Rotate through visuals
  useEffect(() => {
    if (isHovered) return; // Pause rotation on hover
    const interval = setInterval(() => {
      setActiveVisual((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered]);

  // Generate floating particles
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
    color: ['jules-cyan', 'jules-magenta', 'jules-yellow'][Math.floor(Math.random() * 3)],
  }));

  // Data stream lines
  const dataStreams = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: 10 + i * 12,
    delay: i * 0.15,
  }));

  return (
    <motion.div
      className="relative inline-block cursor-pointer"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer glow - intensifies on hover */}
      <motion.div
        className="absolute inset-[-8px] rounded-2xl"
        style={{
          background:
            'linear-gradient(135deg, hsl(var(--jules-cyan)) 0%, hsl(var(--jules-magenta)) 50%, hsl(var(--jules-yellow)) 100%)',
          filter: 'blur(20px)',
        }}
        animate={{ opacity: isHovered ? 0.9 : 0.6 }}
        transition={{ duration: 0.3 }}
      />

      {/* TV Frame */}
      <div
        className="relative rounded-2xl p-[3px]"
        style={{
          background:
            'linear-gradient(135deg, hsl(var(--jules-cyan)), hsl(var(--jules-magenta)), hsl(var(--jules-yellow)))',
        }}
      >
        {/* Inner bezel */}
        <div className="rounded-[13px] bg-jules-dark p-2">
          {/* Screen */}
          <div
            className="relative w-[280px] h-[180px] md:w-[360px] md:h-[220px] rounded-lg overflow-hidden"
            style={{
              background:
                'linear-gradient(180deg, hsl(var(--jules-surface)) 0%, hsl(var(--jules-dark)) 100%)',
            }}
          >
            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  className={`absolute rounded-full bg-${p.color}`}
                  style={{
                    width: p.size,
                    height: p.size,
                    left: `${p.x}%`,
                    boxShadow: `0 0 ${p.size * 2}px hsl(var(--${p.color}))`,
                  }}
                  animate={{
                    y: [p.y, p.y - 30, p.y],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: p.duration,
                    repeat: Infinity,
                    delay: p.delay,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>

            {/* Data streams - vertical lines */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-5">
              {dataStreams.map((stream) => (
                <motion.div
                  key={stream.id}
                  className="absolute w-[1px] h-8"
                  style={{
                    left: `${stream.x}%`,
                    background:
                      'linear-gradient(180deg, transparent, hsl(var(--jules-cyan) / 0.6), transparent)',
                  }}
                  animate={{ y: [-40, 260] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: stream.delay,
                    ease: 'linear',
                  }}
                />
              ))}
            </div>

            {/* Scan lines overlay */}
            <div
              className="absolute inset-0 pointer-events-none z-30 opacity-20"
              style={{
                background:
                  'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, hsl(var(--foreground) / 0.1) 2px, hsl(var(--foreground) / 0.1) 4px)',
              }}
            />

            {/* Moving scan line */}
            <motion.div
              className="absolute left-0 right-0 h-[2px] bg-jules-cyan/30 z-20"
              animate={{ y: [0, 220] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />

            {/* CRT curve effect */}
            <div
              className="absolute inset-0 pointer-events-none z-20 rounded-lg"
              style={{
                boxShadow: 'inset 0 0 60px hsl(var(--jules-dark) / 0.5)',
              }}
            />

            {/* Hover overlay */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className="absolute inset-0 z-50 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Backdrop blur */}
                  <div className="absolute inset-0 bg-jules-dark/70 backdrop-blur-sm" />

                  {/* CTA content */}
                  <motion.div
                    className="relative z-10 text-center"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Link to="/portfolio">
                      <motion.div
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm font-bold uppercase tracking-wider"
                        style={{
                          background:
                            'linear-gradient(135deg, hsl(var(--jules-cyan)) 0%, hsl(var(--jules-magenta)) 100%)',
                          color: 'hsl(var(--jules-dark))',
                          boxShadow: '0 0 30px hsl(var(--jules-cyan) / 0.5)',
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Explore My Work
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </Link>

                    <motion.p
                      className="mt-3 text-xs font-mono text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {activeVisual === 0
                        ? 'Physics Simulations'
                        : activeVisual === 1
                          ? 'Optimization Algorithms'
                          : 'Machine Learning'}
                    </motion.p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content area */}
            <div className="relative z-10 h-full p-4 flex flex-col">
              {/* Header bar */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-jules-cyan/20">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-jules-green"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="font-mono text-[10px] text-jules-cyan uppercase tracking-wider">
                    {activeVisual === 0
                      ? 'quantum_sim.py'
                      : activeVisual === 1
                        ? 'optimize.rs'
                        : 'neural_net.py'}
                  </span>
                </div>
                <span className="font-mono text-[9px] text-muted-foreground">meshal@lab</span>
              </div>

              {/* Dynamic content based on activeVisual */}
              <div className="flex-1 relative">
                {/* Physics/Quantum visualization */}
                {activeVisual === 0 && (
                  <motion.div
                    className="h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Wave function visualization */}
                    <svg className="w-full h-16 mb-2" viewBox="0 0 200 40">
                      <motion.path
                        d="M0,20 Q25,5 50,20 T100,20 T150,20 T200,20"
                        fill="none"
                        stroke="hsl(var(--jules-cyan))"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <motion.path
                        d="M0,20 Q25,35 50,20 T100,20 T150,20 T200,20"
                        fill="none"
                        stroke="hsl(var(--jules-magenta))"
                        strokeWidth="1.5"
                        opacity={0.6}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                      />
                    </svg>
                    <div className="font-mono text-[10px] space-y-1 text-jules-cyan/80">
                      <div>
                        <span className="text-jules-magenta">ψ</span>(x,t) = A·e^(ikx-iωt)
                      </div>
                      <div className="text-jules-yellow">{'>'} Simulating particle dynamics...</div>
                    </div>
                  </motion.div>
                )}

                {/* Optimization visualization */}
                {activeVisual === 1 && (
                  <motion.div
                    className="h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Convergence chart */}
                    <svg className="w-full h-16 mb-2" viewBox="0 0 200 40">
                      <motion.path
                        d="M10,35 L40,30 L70,25 L100,18 L130,12 L160,8 L190,6"
                        fill="none"
                        stroke="hsl(var(--jules-green))"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      {[10, 40, 70, 100, 130, 160, 190].map((x, i) => (
                        <motion.circle
                          key={i}
                          cx={x}
                          cy={35 - i * 4.5}
                          r="3"
                          fill="hsl(var(--jules-yellow))"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.2 }}
                        />
                      ))}
                    </svg>
                    <div className="font-mono text-[10px] space-y-1 text-jules-green/80">
                      <div>
                        iter: <span className="text-jules-yellow">2847</span> | loss:{' '}
                        <span className="text-jules-cyan">0.00023</span>
                      </div>
                      <div className="text-jules-magenta">{'>'} Convergence achieved ✓</div>
                    </div>
                  </motion.div>
                )}

                {/* Neural network / AI visualization */}
                {activeVisual === 2 && (
                  <motion.div
                    className="h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Neural network nodes */}
                    <svg className="w-full h-16 mb-2" viewBox="0 0 200 40">
                      {/* Layer 1 */}
                      {[8, 16, 24, 32].map((y, i) => (
                        <motion.circle
                          key={`l1-${i}`}
                          cx="30"
                          cy={y}
                          r="4"
                          fill="hsl(var(--jules-cyan))"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                        />
                      ))}
                      {/* Layer 2 */}
                      {[12, 20, 28].map((y, i) => (
                        <motion.circle
                          key={`l2-${i}`}
                          cx="100"
                          cy={y}
                          r="4"
                          fill="hsl(var(--jules-magenta))"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.3 + i * 0.1 }}
                        />
                      ))}
                      {/* Layer 3 */}
                      {[16, 24].map((y, i) => (
                        <motion.circle
                          key={`l3-${i}`}
                          cx="170"
                          cy={y}
                          r="4"
                          fill="hsl(var(--jules-yellow))"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.6 + i * 0.1 }}
                        />
                      ))}
                      {/* Connections */}
                      <motion.line
                        x1="34"
                        y1="20"
                        x2="96"
                        y2="20"
                        stroke="hsl(var(--jules-cyan))"
                        strokeWidth="1"
                        opacity={0.3}
                        animate={{ opacity: [0.1, 0.5, 0.1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                      <motion.line
                        x1="104"
                        y1="20"
                        x2="166"
                        y2="20"
                        stroke="hsl(var(--jules-magenta))"
                        strokeWidth="1"
                        opacity={0.3}
                        animate={{ opacity: [0.1, 0.5, 0.1] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                      />
                    </svg>
                    <div className="font-mono text-[10px] space-y-1 text-jules-magenta/80">
                      <div>
                        epochs: <span className="text-jules-cyan">150</span> | acc:{' '}
                        <span className="text-jules-green">98.7%</span>
                      </div>
                      <div className="text-jules-yellow">{'>'} Training transformer model...</div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Bottom status bar */}
              <div className="flex items-center justify-between pt-2 border-t border-jules-cyan/10 mt-auto">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${i === activeVisual ? 'bg-jules-cyan' : 'bg-jules-surface'}`}
                      animate={i === activeVisual ? { scale: [1, 1.3, 1] } : {}}
                      transition={{ duration: 0.5 }}
                    />
                  ))}
                </div>
                <span className="font-mono text-[8px] text-muted-foreground uppercase tracking-wider">
                  {activeVisual === 0 ? 'Physics' : activeVisual === 1 ? 'Optimization' : 'AI/ML'}
                </span>
              </div>
            </div>

            {/* Glitch effect overlay - occasional */}
            <motion.div
              className="absolute inset-0 z-40 pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, hsl(var(--jules-cyan) / 0.1) 50%, transparent 100%)',
              }}
              animate={{
                x: [-300, 400],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 0.15,
                repeat: Infinity,
                repeatDelay: 5,
              }}
            />
          </div>
        </div>
      </div>

      {/* Reflection/shine effect */}
      <div
        className="absolute top-2 left-2 right-2 h-1/3 rounded-t-xl pointer-events-none opacity-10"
        style={{
          background: 'linear-gradient(180deg, hsl(var(--foreground)) 0%, transparent 100%)',
        }}
      />

      {/* Power LED */}
      <motion.div
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-jules-green"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ boxShadow: '0 0 8px hsl(var(--jules-green))' }}
      />

      {/* Hover hint */}
      <motion.div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9px] text-muted-foreground uppercase tracking-wider"
        animate={{ opacity: isHovered ? 0 : [0.5, 0.8, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Hover to explore
      </motion.div>
    </motion.div>
  );
};

export default CyberpunkScreen;
