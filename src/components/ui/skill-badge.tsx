import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkillBadgeProps {
  skill: string;
  color?: 'cyan' | 'magenta' | 'yellow' | 'green' | 'purple';
  index?: number;
  isInView?: boolean;
}

const colorStyles = {
  cyan: {
    border: 'border-jules-cyan/40',
    text: 'text-jules-cyan',
    bg: 'bg-jules-cyan/10',
    hoverBg: 'hover:bg-jules-cyan/20',
    shadow: '0 0 15px hsl(var(--jules-cyan) / 0.3)',
  },
  magenta: {
    border: 'border-jules-magenta/40',
    text: 'text-jules-magenta',
    bg: 'bg-jules-magenta/10',
    hoverBg: 'hover:bg-jules-magenta/20',
    shadow: '0 0 15px hsl(var(--jules-magenta) / 0.3)',
  },
  yellow: {
    border: 'border-jules-yellow/40',
    text: 'text-jules-yellow',
    bg: 'bg-jules-yellow/10',
    hoverBg: 'hover:bg-jules-yellow/20',
    shadow: '0 0 15px hsl(var(--jules-yellow) / 0.3)',
  },
  green: {
    border: 'border-jules-green/40',
    text: 'text-jules-green',
    bg: 'bg-jules-green/10',
    hoverBg: 'hover:bg-jules-green/20',
    shadow: '0 0 15px hsl(var(--jules-green) / 0.3)',
  },
  purple: {
    border: 'border-jules-purple/40',
    text: 'text-jules-purple',
    bg: 'bg-jules-purple/10',
    hoverBg: 'hover:bg-jules-purple/20',
    shadow: '0 0 15px hsl(var(--jules-purple) / 0.3)',
  },
};

export function SkillBadge({ skill, color = 'cyan', index = 0, isInView = true }: SkillBadgeProps) {
  const styles = colorStyles[color];

  return (
    <motion.span
      className={cn(
        'px-4 py-2 text-sm font-mono rounded-lg border cursor-default transition-all duration-300',
        styles.border,
        styles.text,
        styles.bg,
        styles.hoverBg
      )}
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{
        delay: index * 0.05,
        duration: 0.4,
        type: 'spring',
        stiffness: 200,
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: styles.shadow,
      }}
    >
      {skill}
    </motion.span>
  );
}

export default SkillBadge;
