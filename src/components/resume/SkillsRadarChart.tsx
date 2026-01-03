import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface SkillData {
  name: string;
  level: number;
  category: string;
}

const allSkills: SkillData[] = [
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
  { name: 'HPC', level: 85, category: 'Domains' },
  // Tools
  { name: 'Docker', level: 85, category: 'Tools' },
  { name: 'Kubernetes', level: 72, category: 'Tools' },
  { name: 'AWS', level: 80, category: 'Tools' },
  { name: 'Git', level: 95, category: 'Tools' },
  { name: 'Linux', level: 90, category: 'Tools' },
];

const categoryConfig: Record<string, { color: string; hsl: string }> = {
  Languages: { color: 'hsl(180, 100%, 50%)', hsl: 'jules-cyan' },
  Frameworks: { color: 'hsl(300, 100%, 50%)', hsl: 'jules-magenta' },
  Domains: { color: 'hsl(60, 100%, 50%)', hsl: 'jules-yellow' },
  Tools: { color: 'hsl(150, 100%, 50%)', hsl: 'jules-green' },
};

const categories = ['All', 'Languages', 'Frameworks', 'Domains', 'Tools'];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: { name: string; level: number; category: string } }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const config = categoryConfig[data.category];

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-4 rounded-xl border backdrop-blur-xl"
        style={{
          background: 'hsl(240 30% 6% / 0.95)',
          borderColor: config?.color || 'hsl(280, 100%, 60%)',
          boxShadow: `0 0 20px ${config?.color || 'hsl(280, 100%, 60%)'}40`,
        }}
      >
        <p className="font-bold text-foreground mb-1">{data.name}</p>
        <p className="text-sm text-muted-foreground mb-2">{data.category}</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: config?.color }} />
          <span className="font-mono font-bold" style={{ color: config?.color }}>
            {data.level}%
          </span>
        </div>
      </motion.div>
    );
  }
  return null;
};

export const SkillsRadarChart = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isAnimating, setIsAnimating] = useState(true);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const filteredSkills = useMemo(() => {
    if (activeCategory === 'All') {
      // For "All", show top skills from each category
      const topPerCategory: SkillData[] = [];
      Object.keys(categoryConfig).forEach((cat) => {
        const catSkills = allSkills
          .filter((s) => s.category === cat)
          .sort((a, b) => b.level - a.level)
          .slice(0, 2);
        topPerCategory.push(...catSkills);
      });
      return topPerCategory;
    }
    return allSkills.filter((s) => s.category === activeCategory);
  }, [activeCategory]);

  const radarData = filteredSkills.map((skill) => ({
    ...skill,
    fullMark: 100,
  }));

  const activeColor =
    activeCategory === 'All'
      ? 'hsl(280, 100%, 60%)'
      : categoryConfig[activeCategory]?.color || 'hsl(280, 100%, 60%)';

  return (
    <div className="space-y-8">
      {/* Category filters */}
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          const config = cat === 'All' ? null : categoryConfig[cat];

          return (
            <motion.button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setIsAnimating(true);
                setTimeout(() => setIsAnimating(false), 1500);
              }}
              className="relative px-5 py-2.5 rounded-full text-sm font-medium transition-all overflow-hidden"
              style={{
                background: isActive
                  ? `linear-gradient(135deg, ${config?.color || 'hsl(280, 100%, 60%)'}, ${config?.color || 'hsl(280, 100%, 60%)'}80)`
                  : 'hsl(240 25% 10% / 0.5)',
                color: isActive ? 'hsl(0, 0%, 100%)' : 'hsl(240, 20%, 75%)',
                border: `1px solid ${isActive ? config?.color || 'hsl(280, 100%, 60%)' : 'hsl(0 0% 100% / 0.1)'}`,
                boxShadow: isActive
                  ? `0 0 25px ${config?.color || 'hsl(280, 100%, 60%)'}50`
                  : undefined,
              }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: `radial-gradient(circle at center, ${config?.color || 'hsl(280, 100%, 60%)'}, transparent)`,
                  }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Main Radar Chart */}
      <motion.div
        className="relative p-6 rounded-2xl border backdrop-blur-xl overflow-hidden"
        style={{
          background: 'hsl(240 25% 10% / 0.3)',
          borderColor: `${activeColor}30`,
          boxShadow: `0 0 40px ${activeColor}15`,
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated background rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className="absolute rounded-full border"
              style={{
                width: `${ring * 30}%`,
                height: `${ring * 30}%`,
                borderColor: `${activeColor}${15 - ring * 3}`,
              }}
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                delay: ring * 0.5,
                repeat: Infinity,
              }}
            />
          ))}
        </div>

        {/* Corner accents */}
        <div
          className="absolute top-0 left-0 w-20 h-20"
          style={{
            background: `linear-gradient(135deg, ${activeColor}20, transparent)`,
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-20 h-20"
          style={{
            background: `linear-gradient(-45deg, ${activeColor}20, transparent)`,
          }}
        />

        <div className="relative h-[400px] md:h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke={`${activeColor}40`} strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey="name"
                tick={({ x, y, payload }) => {
                  const skill = radarData.find((s) => s.name === payload.value);
                  const isHovered = hoveredSkill === payload.value;

                  return (
                    <g
                      transform={`translate(${x},${y})`}
                      onMouseEnter={() => setHoveredSkill(payload.value)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <text
                        x={0}
                        y={0}
                        dy={5}
                        textAnchor="middle"
                        fill={isHovered ? activeColor : 'hsl(240, 20%, 75%)'}
                        fontSize={12}
                        fontWeight={isHovered ? 600 : 400}
                        fontFamily="JetBrains Mono, monospace"
                        style={{
                          transition: 'all 0.2s ease',
                          filter: isHovered ? `drop-shadow(0 0 8px ${activeColor})` : undefined,
                        }}
                      >
                        {payload.value.length > 12
                          ? payload.value.slice(0, 10) + '...'
                          : payload.value}
                      </text>
                      {isHovered && skill && (
                        <text
                          x={0}
                          y={16}
                          textAnchor="middle"
                          fill={activeColor}
                          fontSize={10}
                          fontFamily="JetBrains Mono, monospace"
                        >
                          {skill.level}%
                        </text>
                      )}
                    </g>
                  );
                }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: 'hsl(240, 20%, 55%)', fontSize: 10 }}
                tickCount={5}
              />
              <Tooltip content={<CustomTooltip />} />
              <Radar
                name="Skills"
                dataKey="level"
                stroke={activeColor}
                fill={activeColor}
                fillOpacity={0.25}
                strokeWidth={2}
                dot={({ cx, cy, payload }) => {
                  const isHovered = hoveredSkill === payload.name;
                  return (
                    <motion.circle
                      key={payload.name}
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 8 : 5}
                      fill={activeColor}
                      stroke="hsl(240, 30%, 6%)"
                      strokeWidth={2}
                      style={{
                        filter: `drop-shadow(0 0 ${isHovered ? 12 : 6}px ${activeColor})`,
                        cursor: 'pointer',
                      }}
                      initial={isAnimating ? { scale: 0 } : { scale: 1 }}
                      animate={{ scale: 1 }}
                      transition={{
                        duration: 0.5,
                        delay: radarData.findIndex((s) => s.name === payload.name) * 0.1,
                      }}
                    />
                  );
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {activeCategory === 'All' ? (
            Object.entries(categoryConfig).map(([cat, config]) => (
              <motion.div
                key={cat}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono"
                style={{
                  background: `${config.color}15`,
                  border: `1px solid ${config.color}30`,
                }}
                whileHover={{ scale: 1.05 }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: config.color, boxShadow: `0 0 8px ${config.color}` }}
                />
                <span style={{ color: config.color }}>{cat}</span>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-mono"
              style={{
                background: `${activeColor}15`,
                border: `1px solid ${activeColor}30`,
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: activeColor, boxShadow: `0 0 10px ${activeColor}` }}
              />
              <span style={{ color: activeColor }}>{activeCategory}</span>
              <span className="text-muted-foreground">• {filteredSkills.length} skills</span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Skills breakdown grid */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {Object.entries(categoryConfig).map(([cat, config], index) => {
          const catSkills = allSkills.filter((s) => s.category === cat);
          const avgLevel = Math.round(
            catSkills.reduce((acc, s) => acc + s.level, 0) / catSkills.length
          );
          const topSkill = catSkills.sort((a, b) => b.level - a.level)[0];

          return (
            <motion.div
              key={cat}
              className="relative p-4 rounded-xl border backdrop-blur-sm overflow-hidden cursor-pointer"
              style={{
                background: 'hsl(240 25% 10% / 0.3)',
                borderColor: activeCategory === cat ? config.color : `${config.color}30`,
                boxShadow: activeCategory === cat ? `0 0 25px ${config.color}30` : undefined,
              }}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ y: -4, scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Glow effect */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${config.color}, transparent 70%)`,
                }}
              />

              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-sm" style={{ color: config.color }}>
                    {cat}
                  </h4>
                  <motion.span
                    className="text-2xl font-mono font-bold"
                    style={{
                      color: config.color,
                      textShadow: `0 0 15px ${config.color}50`,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
                  >
                    {avgLevel}%
                  </motion.span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 rounded-full bg-muted/30 mb-3 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${config.color}, ${config.color}80)`,
                      boxShadow: `0 0 10px ${config.color}50`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${avgLevel}%` }}
                    transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                  />
                </div>

                <div className="text-xs text-muted-foreground">
                  <span className="opacity-70">Top: </span>
                  <span style={{ color: config.color }}>{topSkill.name}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default SkillsRadarChart;
