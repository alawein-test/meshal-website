import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Award, Rocket } from 'lucide-react';

interface TimelineItem {
  id: string;
  type: 'work' | 'education' | 'award' | 'project';
  title: string;
  organization: string;
  period: string;
  description: string;
  highlights?: string[];
  color: string;
}

const timelineData: TimelineItem[] = [
  {
    id: '1',
    type: 'work',
    title: 'Founder & Lead Engineer',
    organization: 'Alawein Technologies LLC',
    period: '2023 - Present',
    description:
      'Building next-gen simulation and optimization platforms for scientific computing.',
    highlights: ['SimCore Engine', 'QMLab Framework', 'OptiLibria Suite'],
    color: 'jules-magenta',
  },
  {
    id: '2',
    type: 'work',
    title: 'Co-Founder',
    organization: 'REPZ LLC',
    period: '2022 - Present',
    description: 'AI-powered fitness platform with computer vision for real-time rep tracking.',
    highlights: ['Computer Vision', 'Real-time Tracking', 'ML Models'],
    color: 'jules-cyan',
  },
  {
    id: '3',
    type: 'work',
    title: 'Technical Advisor',
    organization: 'Live It Iconic LLC',
    period: '2023 - Present',
    description: 'Technical strategy and AI integration for brand growth.',
    highlights: ['Platform Architecture', 'AI Integration', 'Growth Systems'],
    color: 'jules-yellow',
  },
  {
    id: '4',
    type: 'education',
    title: 'B.S. Physics',
    organization: 'University of California, Berkeley',
    period: '2019 - 2023',
    description: 'Focus on computational physics, quantum mechanics, and optimization algorithms.',
    highlights: ["Dean's List", 'Research Assistant', 'Physics Society'],
    color: 'jules-green',
  },
];

const iconMap = {
  work: Briefcase,
  education: GraduationCap,
  award: Award,
  project: Rocket,
};

export const Timeline = () => {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div
        className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5"
        style={{
          background:
            'linear-gradient(to bottom, hsl(var(--jules-cyan)), hsl(var(--jules-magenta)), hsl(var(--jules-yellow)))',
          boxShadow: '0 0 15px hsl(var(--jules-cyan) / 0.3)',
        }}
      />

      <div className="space-y-8">
        {timelineData.map((item, index) => {
          const Icon = iconMap[item.type];
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={item.id}
              className={`relative flex items-center gap-8 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              initial={{ opacity: 0, x: isEven ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Icon */}
              <motion.div
                className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: `hsl(var(--${item.color}))`,
                  boxShadow: `0 0 25px hsl(var(--${item.color}) / 0.5)`,
                }}
                whileHover={{ scale: 1.2 }}
              >
                <Icon className="w-5 h-5 text-white" />
              </motion.div>

              {/* Content card */}
              <div
                className={`ml-20 md:ml-0 md:w-[45%] ${isEven ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}
              >
                <motion.div
                  className="p-6 rounded-xl border bg-jules-surface/30 backdrop-blur-xl"
                  style={{
                    borderColor: `hsl(var(--${item.color}) / 0.3)`,
                    boxShadow: `0 0 30px hsl(var(--${item.color}) / 0.1)`,
                  }}
                  whileHover={{
                    borderColor: `hsl(var(--${item.color}) / 0.6)`,
                    boxShadow: `0 0 40px hsl(var(--${item.color}) / 0.2)`,
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                    <span
                      className="text-xs font-mono px-2 py-1 rounded"
                      style={{
                        background: `hsl(var(--${item.color}) / 0.1)`,
                        color: `hsl(var(--${item.color}))`,
                      }}
                    >
                      {item.period}
                    </span>
                  </div>
                  <p className="font-medium mb-2" style={{ color: `hsl(var(--${item.color}))` }}>
                    {item.organization}
                  </p>
                  <p className="text-muted-foreground text-sm mb-3">{item.description}</p>
                  {item.highlights && (
                    <div className="flex flex-wrap gap-2">
                      {item.highlights.map((h) => (
                        <span
                          key={h}
                          className="px-2 py-1 text-xs font-mono rounded"
                          style={{
                            background: `hsl(var(--${item.color}) / 0.1)`,
                            color: `hsl(var(--${item.color}) / 0.8)`,
                            border: `1px solid hsl(var(--${item.color}) / 0.2)`,
                          }}
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
