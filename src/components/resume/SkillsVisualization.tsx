import { motion } from 'framer-motion';
import { useState } from 'react';

interface Skill {
  name: string;
  level: number; // 0-100
  category: string;
}

const skills: Skill[] = [
  // Languages
  { name: 'Python', level: 95, category: 'Languages' },
  { name: 'TypeScript', level: 90, category: 'Languages' },
  { name: 'Rust', level: 75, category: 'Languages' },
  { name: 'Julia', level: 80, category: 'Languages' },
  { name: 'C++', level: 70, category: 'Languages' },
  // Frameworks
  { name: 'React', level: 92, category: 'Frameworks' },
  { name: 'PyTorch', level: 88, category: 'Frameworks' },
  { name: 'TensorFlow', level: 82, category: 'Frameworks' },
  { name: 'FastAPI', level: 90, category: 'Frameworks' },
  { name: 'Next.js', level: 85, category: 'Frameworks' },
  // Domains
  { name: 'Quantum Computing', level: 78, category: 'Domains' },
  { name: 'Optimization', level: 92, category: 'Domains' },
  { name: 'Machine Learning', level: 88, category: 'Domains' },
  { name: 'Simulation', level: 95, category: 'Domains' },
  // Tools
  { name: 'Docker', level: 85, category: 'Tools' },
  { name: 'Kubernetes', level: 72, category: 'Tools' },
  { name: 'AWS', level: 80, category: 'Tools' },
  { name: 'Supabase', level: 90, category: 'Tools' },
];

const categoryColors: Record<string, string> = {
  Languages: 'jules-cyan',
  Frameworks: 'jules-magenta',
  Domains: 'jules-yellow',
  Tools: 'jules-green',
};

const categories = ['All', 'Languages', 'Frameworks', 'Domains', 'Tools'];

export const SkillsVisualization = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const filteredSkills =
    activeCategory === 'All' ? skills : skills.filter((s) => s.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Category filters */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-jules-surface/50 text-muted-foreground hover:text-foreground'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              boxShadow: activeCategory === cat ? '0 0 20px hsl(var(--primary) / 0.4)' : undefined,
            }}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Skills grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredSkills.map((skill, index) => {
          const color = categoryColors[skill.category];
          const isHovered = hoveredSkill === skill.name;

          return (
            <motion.div
              key={skill.name}
              className="relative p-4 rounded-xl border bg-jules-surface/30 backdrop-blur-sm cursor-pointer"
              style={{
                borderColor: isHovered ? `hsl(var(--${color}))` : `hsl(var(--${color}) / 0.2)`,
                boxShadow: isHovered ? `0 0 30px hsl(var(--${color}) / 0.3)` : undefined,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onHoverStart={() => setHoveredSkill(skill.name)}
              onHoverEnd={() => setHoveredSkill(null)}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{skill.name}</span>
                <span className="text-xs font-mono" style={{ color: `hsl(var(--${color}))` }}>
                  {skill.level}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, hsl(var(--${color})), hsl(var(--${color}) / 0.6))`,
                    boxShadow: `0 0 10px hsl(var(--${color}) / 0.5)`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: index * 0.05 }}
                />
              </div>

              {/* Category badge */}
              <div
                className="mt-2 text-xs font-mono"
                style={{ color: `hsl(var(--${color}) / 0.6)` }}
              >
                {skill.category}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Radar/Stats summary */}
      <motion.div
        className="mt-8 p-6 rounded-xl border border-jules-purple/20 bg-jules-surface/30 backdrop-blur-xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h3 className="text-lg font-bold mb-4 text-center text-jules-purple">
          Expertise Distribution
        </h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          {Object.entries(categoryColors).map(([cat, color]) => {
            const catSkills = skills.filter((s) => s.category === cat);
            const avgLevel = Math.round(
              catSkills.reduce((acc, s) => acc + s.level, 0) / catSkills.length
            );

            return (
              <div key={cat}>
                <motion.div
                  className="text-3xl font-bold mb-1"
                  style={{
                    color: `hsl(var(--${color}))`,
                    textShadow: `0 0 20px hsl(var(--${color}) / 0.5)`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                >
                  {avgLevel}%
                </motion.div>
                <div className="text-xs text-muted-foreground">{cat}</div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default SkillsVisualization;
