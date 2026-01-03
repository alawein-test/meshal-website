/**
 * @file HubHeader.tsx
 * @description Reusable hub page header with icon, gradient title, and description
 * Used across all hub/listing pages for consistent styling
 */
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface HubHeaderProps {
  /** Main title text */
  title: string;
  /** Optional subtitle/description */
  description?: string;
  /** Lucide icon component */
  icon?: LucideIcon;
  /** Primary gradient color - used for icon background and title glow */
  primaryColor?: 'cyan' | 'magenta' | 'yellow' | 'purple' | 'green';
  /** Secondary gradient color - used for title gradient end */
  secondaryColor?: 'cyan' | 'magenta' | 'yellow' | 'purple' | 'green';
  /** Alignment of the header content */
  align?: 'left' | 'center';
  /** Optional badge/tag content */
  badge?: React.ReactNode;
  /** Size variant - 'default' for regular pages, 'large' for main hub pages */
  size?: 'default' | 'large';
  /** Additional class names */
  className?: string;
}

const colorMap = {
  cyan: 'jules-cyan',
  magenta: 'jules-magenta',
  yellow: 'jules-yellow',
  purple: 'jules-purple',
  green: 'jules-green',
};

export function HubHeader({
  title,
  description,
  icon: Icon,
  primaryColor = 'cyan',
  secondaryColor = 'purple',
  align = 'left',
  badge,
  size = 'default',
  className = '',
}: HubHeaderProps) {
  const primary = colorMap[primaryColor];
  const secondary = colorMap[secondaryColor];
  const isCenter = align === 'center';
  const isLarge = size === 'large';

  const titleClasses = isLarge
    ? 'text-5xl md:text-7xl lg:text-8xl font-bold font-display'
    : 'text-4xl md:text-5xl font-bold';

  const descriptionClasses = isLarge
    ? 'text-xl text-muted-foreground font-light leading-relaxed'
    : 'text-lg text-muted-foreground';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`mb-8 ${isCenter ? 'text-center' : ''} ${className}`}
    >
      {/* Optional Badge */}
      {badge && (
        <motion.div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-${primary}/10 border border-${primary}/30 mb-6`}
          whileHover={{ scale: 1.05 }}
          style={{
            backgroundColor: `hsl(var(--${primary}) / 0.1)`,
            borderColor: `hsl(var(--${primary}) / 0.3)`,
          }}
        >
          {badge}
        </motion.div>
      )}

      {/* Title Row with Icon */}
      <div
        className={`flex items-center gap-4 mb-4 ${isCenter ? 'justify-center' : ''} ${isLarge && isCenter ? 'flex-col' : ''}`}
      >
        {Icon && !isLarge && (
          <motion.div
            className="p-4 rounded-xl"
            style={{
              background: `linear-gradient(135deg, hsl(var(--${primary}) / 0.2) 0%, hsl(var(--${secondary}) / 0.2) 100%)`,
              border: `1px solid hsl(var(--${primary}) / 0.3)`,
            }}
            whileHover={{ rotate: 5, scale: 1.05 }}
          >
            <Icon className="w-8 h-8" style={{ color: `hsl(var(--${primary}))` }} />
          </motion.div>
        )}
        <h1 className={titleClasses}>
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(to right, hsl(var(--${primary})), hsl(var(--${secondary})), hsl(var(--jules-magenta)))`,
              filter: isLarge ? `drop-shadow(0 0 40px hsl(var(--${primary}) / 0.3))` : undefined,
              textShadow: !isLarge ? `0 0 60px hsl(var(--${primary}) / 0.3)` : undefined,
            }}
          >
            {title}
          </span>
        </h1>
      </div>

      {/* Description */}
      {description && (
        <p className={`${descriptionClasses} ${isCenter ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
}

export default HubHeader;
