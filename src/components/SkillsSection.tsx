import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Code, Database, Wrench, Brain } from 'lucide-react';
import { SectionHeader } from './ui/section-header';
import { NeonCard } from './ui/neon-card';
import { SkillBadge } from './ui/skill-badge';

const skillCategories = [
  {
    id: 'languages',
    title: 'Languages',
    icon: Code,
    skills: ['Python', 'TypeScript', 'C++', 'Julia', 'Rust', 'CUDA'],
    color: 'cyan' as const,
  },
  {
    id: 'frameworks',
    title: 'Frameworks',
    icon: Database,
    skills: ['PyTorch', 'TensorFlow', 'React', 'Next.js', 'FastAPI', 'JAX'],
    color: 'magenta' as const,
  },
  {
    id: 'tools',
    title: 'Tools',
    icon: Wrench,
    skills: ['Docker', 'Kubernetes', 'Git', 'AWS', 'Linux', 'PostgreSQL'],
    color: 'yellow' as const,
  },
  {
    id: 'domains',
    title: 'Domains',
    icon: Brain,
    skills: [
      'Machine Learning',
      'Optimization',
      'Physics Simulation',
      'Data Analysis',
      'HPC',
      'Scientific Computing',
    ],
    color: 'green' as const,
  },
];

const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <section id="skills" className="py-32 relative" ref={ref}>
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-jules-magenta/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-jules-cyan/10 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 max-w-6xl mx-auto relative">
        <SectionHeader
          title="Skills & Expertise"
          subtitle="Technologies and domains I work with daily"
          color="magenta"
        />

        <div className="mt-16 grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, categoryIndex) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + categoryIndex * 0.1, duration: 0.6 }}
                onMouseEnter={() => setActiveCategory(category.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <NeonCard color={category.color} glow={isActive}>
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div
                      className="p-3 rounded-xl"
                      style={{
                        background: `hsl(var(--jules-${category.color}) / 0.15)`,
                      }}
                      animate={isActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                    >
                      <Icon
                        className="w-6 h-6"
                        style={{ color: `hsl(var(--jules-${category.color}))` }}
                      />
                    </motion.div>
                    <div>
                      <h3
                        className="text-lg font-bold"
                        style={{ color: `hsl(var(--jules-${category.color}))` }}
                      >
                        {category.title}
                      </h3>
                      <span className="text-xs font-mono text-muted-foreground">
                        {category.skills.length} technologies
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {category.skills.map((skill, skillIndex) => (
                      <SkillBadge
                        key={skill}
                        skill={skill}
                        color={category.color}
                        index={skillIndex}
                        isInView={isInView}
                      />
                    ))}
                  </div>
                </NeonCard>
              </motion.div>
            );
          })}
        </div>

        {/* Stats bar */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {[
            { value: '10+', label: 'Years Experience', color: 'cyan' },
            { value: '20+', label: 'Projects Completed', color: 'magenta' },
            { value: '50+', label: 'Publications', color: 'yellow' },
            { value: '∞', label: 'Learning', color: 'green' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center p-6 rounded-xl bg-jules-surface/30 border border-jules-border/50 backdrop-blur"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div
                className="text-3xl font-bold font-display mb-1"
                style={{
                  color: `hsl(var(--jules-${stat.color}))`,
                  textShadow: `0 0 20px hsl(var(--jules-${stat.color}) / 0.5)`,
                }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground font-mono">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
