import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface NeonCardProps {
  children: ReactNode;
  color?: 'cyan' | 'magenta' | 'yellow' | 'green' | 'purple';
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

const colorStyles = {
  cyan: {
    border: 'border-jules-cyan/30',
    bg: 'bg-jules-cyan/5',
    hoverBg: 'hover:bg-jules-cyan/10',
    hoverBorder: 'hover:border-jules-cyan/50',
    shadow: '0 0 30px hsl(var(--jules-cyan) / 0.2)',
    hoverShadow: '0 0 40px hsl(var(--jules-cyan) / 0.4)',
  },
  magenta: {
    border: 'border-jules-magenta/30',
    bg: 'bg-jules-magenta/5',
    hoverBg: 'hover:bg-jules-magenta/10',
    hoverBorder: 'hover:border-jules-magenta/50',
    shadow: '0 0 30px hsl(var(--jules-magenta) / 0.2)',
    hoverShadow: '0 0 40px hsl(var(--jules-magenta) / 0.4)',
  },
  yellow: {
    border: 'border-jules-yellow/30',
    bg: 'bg-jules-yellow/5',
    hoverBg: 'hover:bg-jules-yellow/10',
    hoverBorder: 'hover:border-jules-yellow/50',
    shadow: '0 0 30px hsl(var(--jules-yellow) / 0.2)',
    hoverShadow: '0 0 40px hsl(var(--jules-yellow) / 0.4)',
  },
  green: {
    border: 'border-jules-green/30',
    bg: 'bg-jules-green/5',
    hoverBg: 'hover:bg-jules-green/10',
    hoverBorder: 'hover:border-jules-green/50',
    shadow: '0 0 30px hsl(var(--jules-green) / 0.2)',
    hoverShadow: '0 0 40px hsl(var(--jules-green) / 0.4)',
  },
  purple: {
    border: 'border-jules-purple/30',
    bg: 'bg-jules-purple/5',
    hoverBg: 'hover:bg-jules-purple/10',
    hoverBorder: 'hover:border-jules-purple/50',
    shadow: '0 0 30px hsl(var(--jules-purple) / 0.2)',
    hoverShadow: '0 0 40px hsl(var(--jules-purple) / 0.4)',
  },
};

export function NeonCard({
  children,
  color = 'cyan',
  className,
  hover = true,
  glow = false,
}: NeonCardProps) {
  const styles = colorStyles[color];

  return (
    <motion.div
      className={cn(
        'relative p-6 rounded-xl border backdrop-blur-sm transition-all duration-500',
        styles.border,
        styles.bg,
        hover && styles.hoverBg,
        hover && styles.hoverBorder,
        className
      )}
      style={{
        boxShadow: glow ? styles.shadow : undefined,
      }}
      whileHover={
        hover
          ? {
              y: -4,
              boxShadow: styles.hoverShadow,
            }
          : undefined
      }
    >
      {/* Corner accents */}
      <div
        className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 rounded-tl-xl opacity-50"
        style={{ borderColor: `hsl(var(--jules-${color}))` }}
      />
      <div
        className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 rounded-tr-xl opacity-50"
        style={{ borderColor: `hsl(var(--jules-${color}))` }}
      />
      <div
        className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 rounded-bl-xl opacity-50"
        style={{ borderColor: `hsl(var(--jules-${color}))` }}
      />
      <div
        className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 rounded-br-xl opacity-50"
        style={{ borderColor: `hsl(var(--jules-${color}))` }}
      />

      {children}
    </motion.div>
  );
}

export default NeonCard;
