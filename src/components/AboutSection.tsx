import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, GraduationCap, Atom, Rocket } from 'lucide-react';
import { SectionHeader } from './ui/section-header';
import { NeonCard } from './ui/neon-card';

const highlights = [
  {
    icon: GraduationCap,
    title: 'UC Berkeley',
    description: 'PhD in Computational Physics',
    color: 'magenta' as const,
  },
  {
    icon: Atom,
    title: 'ATLAS @ CERN',
    description: 'Signal processing & ML',
    color: 'yellow' as const,
  },
  {
    icon: Rocket,
    title: 'Startups',
    description: 'Building dev tools',
    color: 'cyan' as const,
  },
];

const focusAreas = [
  { area: 'Research', desc: 'Quantum ML optimization', color: 'cyan' as const },
  { area: 'Building', desc: 'Developer productivity tools', color: 'magenta' as const },
  { area: 'Exploring', desc: 'GPU-accelerated simulations', color: 'yellow' as const },
];

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="py-32 relative" ref={ref}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-jules-cyan/5 to-transparent pointer-events-none" />

      <div className="container px-4 max-w-6xl mx-auto">
        <SectionHeader
          title="About Me"
          subtitle="Researcher, engineer, and builder at the edge of physics and AI"
          color="cyan"
        />

        <div className="mt-16 grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <NeonCard color="cyan" hover={false} glow>
                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    I'm a computational physicist and machine learning researcher pursuing my PhD at{' '}
                    <span
                      className="text-jules-magenta font-semibold"
                      style={{ textShadow: '0 0 10px hsl(var(--jules-magenta) / 0.5)' }}
                    >
                      UC Berkeley
                    </span>
                    . My work focuses on developing novel optimization algorithms and applying deep
                    learning techniques to solve complex problems in particle physics.
                  </p>

                  <p>
                    At the{' '}
                    <span
                      className="text-jules-yellow font-semibold"
                      style={{ textShadow: '0 0 10px hsl(var(--jules-yellow) / 0.5)' }}
                    >
                      ATLAS experiment
                    </span>{' '}
                    at CERN, I work on signal processing and event reconstruction, pushing the
                    boundaries of what's possible with modern ML architectures in high-energy
                    physics.
                  </p>

                  <p>
                    Beyond research, I'm passionate about building tools that make complex systems
                    more accessible. From optimization libraries to fitness tracking apps, I believe
                    in creating software that empowers people to achieve their goals.
                  </p>
                </div>

                {/* Location badge */}
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-jules-surface border border-jules-border">
                  <MapPin className="w-4 h-4 text-jules-cyan" />
                  <span className="text-sm font-mono text-muted-foreground">
                    Berkeley, California
                  </span>
                </div>
              </NeonCard>
            </motion.div>

            {/* Current Focus */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <NeonCard color="green">
                <h3 className="text-sm font-mono text-jules-green mb-6 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-jules-green animate-pulse" />
                  Current Focus
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {focusAreas.map((item, index) => (
                    <motion.div
                      key={item.area}
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <span
                        className={`text-xs font-mono text-jules-${item.color} uppercase tracking-wider`}
                      >
                        {item.area}
                      </span>
                      <p className="text-foreground font-medium">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </NeonCard>
            </motion.div>
          </div>

          {/* Highlights sidebar */}
          <div className="space-y-4">
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
              >
                <NeonCard color={item.color}>
                  <div className="flex items-start gap-4">
                    <div
                      className="p-3 rounded-lg"
                      style={{
                        background: `hsl(var(--jules-${item.color}) / 0.15)`,
                        boxShadow: `0 0 20px hsl(var(--jules-${item.color}) / 0.2)`,
                      }}
                    >
                      <item.icon
                        className="w-6 h-6"
                        style={{ color: `hsl(var(--jules-${item.color}))` }}
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </NeonCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
