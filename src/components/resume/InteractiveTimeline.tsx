import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  Briefcase,
  GraduationCap,
  Award,
  Rocket,
  ChevronDown,
  ExternalLink,
  Calendar,
  MapPin,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimelineItem {
  id: string;
  type: 'work' | 'education' | 'award' | 'project';
  title: string;
  organization: string;
  location?: string;
  period: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  highlights?: string[];
  achievements?: string[];
  links?: { label: string; url: string }[];
  color: string;
}

const timelineData: TimelineItem[] = [
  {
    id: '1',
    type: 'work',
    title: 'Founder & Lead Engineer',
    organization: 'Alawein Technologies LLC',
    location: 'San Francisco, CA',
    period: '2023 - Present',
    startDate: new Date('2023-01-01'),
    description:
      'Building next-gen simulation and optimization platforms for scientific computing. Leading technical architecture and product development.',
    highlights: ['SimCore Engine', 'QMLab Framework', 'OptiLibria Suite', 'MEZAN Platform'],
    achievements: [
      'Launched 4 major products',
      '10x performance improvements',
      'Open-source contributions',
    ],
    links: [{ label: 'View Projects', url: '/projects' }],
    color: 'jules-magenta',
  },
  {
    id: '2',
    type: 'work',
    title: 'Co-Founder & CTO',
    organization: 'REPZ LLC',
    location: 'Remote',
    period: '2022 - Present',
    startDate: new Date('2022-06-01'),
    description:
      'AI-powered fitness platform with computer vision for real-time exercise tracking and form correction.',
    highlights: ['Computer Vision', 'Real-time Tracking', 'ML Models', 'Mobile App'],
    achievements: [
      'Built ML pipeline from scratch',
      '95% accuracy in pose detection',
      '50K+ users',
    ],
    color: 'jules-cyan',
  },
  {
    id: '3',
    type: 'work',
    title: 'Technical Advisor',
    organization: 'Live It Iconic LLC',
    location: 'Los Angeles, CA',
    period: '2023 - Present',
    startDate: new Date('2023-03-01'),
    description:
      'Technical strategy and AI integration for brand growth. Platform architecture consulting.',
    highlights: ['Platform Architecture', 'AI Integration', 'Growth Systems', 'Analytics'],
    achievements: ['3x engagement increase', 'Automated content pipeline', 'Data-driven strategy'],
    color: 'jules-yellow',
  },
  {
    id: '4',
    type: 'project',
    title: 'SimCore Research',
    organization: 'Open Source',
    period: '2023',
    startDate: new Date('2023-02-01'),
    endDate: new Date('2023-12-01'),
    description:
      'High-performance simulation engine for complex physical systems with real-time visualization.',
    highlights: ['Rust Core', 'WebGPU', 'React Frontend', 'Real-time Charts'],
    achievements: ['Featured on HN', '500+ GitHub stars', 'Academic citations'],
    links: [{ label: 'GitHub', url: '#' }],
    color: 'jules-purple',
  },
  {
    id: '5',
    type: 'education',
    title: 'B.S. Physics',
    organization: 'University of California, Berkeley',
    location: 'Berkeley, CA',
    period: '2019 - 2023',
    startDate: new Date('2019-08-01'),
    endDate: new Date('2023-05-01'),
    description:
      'Focus on computational physics, quantum mechanics, and optimization algorithms. Undergraduate research in condensed matter physics.',
    highlights: ["Dean's List", 'Research Assistant', 'Physics Society', 'Hackathon Winner'],
    achievements: ['3.8 GPA', 'Published research paper', 'Led study groups'],
    color: 'jules-green',
  },
  {
    id: '6',
    type: 'award',
    title: 'Physics Research Grant',
    organization: 'UC Berkeley Physics Department',
    period: '2022',
    startDate: new Date('2022-01-01'),
    endDate: new Date('2022-12-01'),
    description:
      'Awarded grant for undergraduate research in quantum computing simulation methods.',
    achievements: ['$10K research funding', 'Faculty mentorship', 'Conference presentation'],
    color: 'jules-orange',
  },
];

const iconMap = {
  work: Briefcase,
  education: GraduationCap,
  award: Award,
  project: Rocket,
};

const typeLabels = {
  work: 'Work Experience',
  education: 'Education',
  award: 'Award',
  project: 'Project',
};

type FilterType = 'all' | 'work' | 'education' | 'project' | 'award';

export const InteractiveTimeline = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filteredData =
    filter === 'all' ? timelineData : timelineData.filter((item) => item.type === filter);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Calculate timeline progress
  const getYearProgress = (item: TimelineItem) => {
    const now = new Date();
    const start = item.startDate;
    const end = item.endDate || now;
    const duration = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    return Math.min(100, Math.max(0, (elapsed / duration) * 100));
  };

  return (
    <div className="space-y-8">
      {/* Filter Tabs */}
      <motion.div
        className="flex flex-wrap justify-center gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {(['all', 'work', 'education', 'project', 'award'] as FilterType[]).map((type) => {
          const count =
            type === 'all'
              ? timelineData.length
              : timelineData.filter((i) => i.type === type).length;
          const Icon = type !== 'all' ? iconMap[type] : null;

          return (
            <Button
              key={type}
              variant={filter === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(type)}
              className={`gap-2 transition-all duration-300 ${
                filter === type
                  ? 'bg-jules-cyan text-white shadow-[0_0_20px_hsl(var(--jules-cyan)/0.4)]'
                  : 'border-border/50 hover:border-jules-cyan/50'
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              <span className="capitalize">{type}</span>
              <span className="text-xs opacity-60">({count})</span>
            </Button>
          );
        })}
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Animated vertical line */}
        <motion.div
          className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2"
          style={{
            background:
              'linear-gradient(to bottom, hsl(var(--jules-cyan)), hsl(var(--jules-magenta)), hsl(var(--jules-yellow)), hsl(var(--jules-green)))',
          }}
          initial={{ height: 0 }}
          animate={{ height: '100%' }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          {/* Pulse effect */}
          <motion.div
            className="absolute inset-0 w-full"
            style={{
              background:
                'linear-gradient(to bottom, hsl(var(--jules-cyan)), hsl(var(--jules-magenta)))',
              filter: 'blur(4px)',
            }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        <AnimatePresence mode="popLayout">
          <div className="space-y-6">
            {filteredData.map((item, index) => {
              const Icon = iconMap[item.type];
              const isEven = index % 2 === 0;
              const isExpanded = expandedId === item.id;
              const isHovered = hoveredId === item.id;

              return (
                <motion.div
                  key={item.id}
                  layout
                  className={`relative flex items-start gap-6 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Timeline node */}
                  <motion.div
                    className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10"
                    animate={{ scale: isHovered ? 1.2 : 1 }}
                  >
                    <motion.div
                      className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer relative"
                      style={{
                        background: `hsl(var(--${item.color}))`,
                        boxShadow: isHovered
                          ? `0 0 30px hsl(var(--${item.color}) / 0.7)`
                          : `0 0 15px hsl(var(--${item.color}) / 0.4)`,
                      }}
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleExpand(item.id)}
                    >
                      <Icon className="w-5 h-5 text-white" />

                      {/* Ring animation on hover */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{ border: `2px solid hsl(var(--${item.color}))` }}
                            initial={{ scale: 1, opacity: 1 }}
                            animate={{ scale: 1.8, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, repeat: Infinity }}
                          />
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>

                  {/* Content card */}
                  <div
                    className={`ml-20 md:ml-0 md:w-[45%] ${isEven ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}
                  >
                    <motion.div
                      className="rounded-xl border overflow-hidden cursor-pointer"
                      style={{
                        background: 'hsl(var(--jules-surface) / 0.5)',
                        borderColor:
                          isHovered || isExpanded
                            ? `hsl(var(--${item.color}) / 0.5)`
                            : `hsl(var(--${item.color}) / 0.2)`,
                        boxShadow:
                          isHovered || isExpanded
                            ? `0 0 40px hsl(var(--${item.color}) / 0.2), inset 0 1px 0 hsl(var(--${item.color}) / 0.1)`
                            : `0 0 20px hsl(var(--${item.color}) / 0.05)`,
                      }}
                      onClick={() => toggleExpand(item.id)}
                      layout
                    >
                      {/* Header */}
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className="text-xs font-mono px-2 py-0.5 rounded"
                                style={{
                                  background: `hsl(var(--${item.color}) / 0.15)`,
                                  color: `hsl(var(--${item.color}))`,
                                }}
                              >
                                {typeLabels[item.type]}
                              </span>
                            </div>
                            <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                          </div>
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            className="text-muted-foreground"
                          >
                            <ChevronDown className="w-5 h-5" />
                          </motion.div>
                        </div>

                        <p
                          style={{ color: `hsl(var(--${item.color}))` }}
                          className="font-medium mb-1"
                        >
                          {item.organization}
                        </p>

                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {item.period}
                          </span>
                          {item.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {item.location}
                            </span>
                          )}
                        </div>

                        {/* Progress bar for ongoing items */}
                        {!item.endDate && (
                          <div className="mt-3">
                            <div className="h-1 bg-background/50 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ background: `hsl(var(--${item.color}))` }}
                                initial={{ width: 0 }}
                                animate={{ width: `${getYearProgress(item)}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                              />
                            </div>
                            <span className="text-[10px] text-muted-foreground mt-1 block">
                              Ongoing •{' '}
                              {Math.floor(
                                (Date.now() - item.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
                              )}{' '}
                              months
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Expandable content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t"
                            style={{ borderColor: `hsl(var(--${item.color}) / 0.2)` }}
                          >
                            <div className="p-5 space-y-4">
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {item.description}
                              </p>

                              {item.highlights && (
                                <div>
                                  <h4 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">
                                    Technologies & Focus Areas
                                  </h4>
                                  <div className="flex flex-wrap gap-1.5">
                                    {item.highlights.map((h) => (
                                      <span
                                        key={h}
                                        className="px-2 py-1 text-xs font-mono rounded-md"
                                        style={{
                                          background: `hsl(var(--${item.color}) / 0.1)`,
                                          color: `hsl(var(--${item.color}) / 0.9)`,
                                          border: `1px solid hsl(var(--${item.color}) / 0.2)`,
                                        }}
                                      >
                                        {h}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {item.achievements && (
                                <div>
                                  <h4 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider flex items-center gap-1">
                                    <Star className="w-3 h-3 text-jules-yellow" />
                                    Key Achievements
                                  </h4>
                                  <ul className="space-y-1">
                                    {item.achievements.map((a) => (
                                      <li
                                        key={a}
                                        className="text-sm text-muted-foreground flex items-start gap-2"
                                      >
                                        <span
                                          className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                                          style={{ background: `hsl(var(--${item.color}))` }}
                                        />
                                        {a}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {item.links && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                  {item.links.map((link) => (
                                    <Button
                                      key={link.label}
                                      variant="outline"
                                      size="sm"
                                      className="gap-1.5 h-8 text-xs"
                                      style={{
                                        borderColor: `hsl(var(--${item.color}) / 0.3)`,
                                        color: `hsl(var(--${item.color}))`,
                                      }}
                                      asChild
                                    >
                                      <a href={link.url}>
                                        <ExternalLink className="w-3 h-3" />
                                        {link.label}
                                      </a>
                                    </Button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      </div>

      {/* Timeline Stats */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {[
          { label: 'Years Experience', value: '5+', color: 'jules-cyan' },
          { label: 'Projects Shipped', value: '12+', color: 'jules-magenta' },
          { label: 'Companies Founded', value: '2', color: 'jules-yellow' },
          { label: 'Research Papers', value: '3', color: 'jules-green' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            className="text-center p-4 rounded-xl border"
            style={{
              borderColor: `hsl(var(--${stat.color}) / 0.2)`,
              background: `hsl(var(--${stat.color}) / 0.05)`,
            }}
            whileHover={{
              scale: 1.02,
              borderColor: `hsl(var(--${stat.color}) / 0.4)`,
            }}
          >
            <div
              className="text-2xl md:text-3xl font-bold mb-1"
              style={{ color: `hsl(var(--${stat.color}))` }}
            >
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default InteractiveTimeline;
