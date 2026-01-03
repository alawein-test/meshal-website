import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  color?: 'cyan' | 'magenta' | 'yellow' | 'green' | 'purple';
  align?: 'left' | 'center';
  className?: string;
}

const colorMap = {
  cyan: {
    text: 'text-jules-cyan',
    shadow: '0 0 30px hsl(var(--jules-cyan) / 0.5)',
    glow: 'hsl(var(--jules-cyan))',
  },
  magenta: {
    text: 'text-jules-magenta',
    shadow: '0 0 30px hsl(var(--jules-magenta) / 0.5)',
    glow: 'hsl(var(--jules-magenta))',
  },
  yellow: {
    text: 'text-jules-yellow',
    shadow: '0 0 30px hsl(var(--jules-yellow) / 0.5)',
    glow: 'hsl(var(--jules-yellow))',
  },
  green: {
    text: 'text-jules-green',
    shadow: '0 0 30px hsl(var(--jules-green) / 0.5)',
    glow: 'hsl(var(--jules-green))',
  },
  purple: {
    text: 'text-jules-purple',
    shadow: '0 0 30px hsl(var(--jules-purple) / 0.5)',
    glow: 'hsl(var(--jules-purple))',
  },
};

export function SectionHeader({
  title,
  subtitle,
  color = 'cyan',
  align = 'left',
  className,
}: SectionHeaderProps) {
  const colors = colorMap[color];

  return (
    <div className={cn(align === 'center' && 'text-center', className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-4"
      >
        {/* Terminal-style prefix */}
        <span className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground mb-3">
          <span className={colors.text}>$</span>
          <span>section</span>
          <span className="text-jules-green">--render</span>
        </span>

        <h2
          className={cn(
            'text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight',
            colors.text
          )}
          style={{
            textShadow: colors.shadow,
            filter: `drop-shadow(0 0 20px ${colors.glow})`,
          }}
        >
          {title}
        </h2>
      </motion.div>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={cn(
            'text-lg md:text-xl text-muted-foreground font-mono max-w-2xl',
            align === 'center' && 'mx-auto'
          )}
        >
          <span className="text-jules-green">// </span>
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

export default SectionHeader;
