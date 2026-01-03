import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { NinjaIcon } from '@/components/icons';
interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
  animated?: boolean;
}

/**
 * Unified Brand Logo Component
 * Uses NinjaIcon for consistent branding across the app
 */
export const BrandLogo = ({
  size = 'md',
  showTagline = true,
  className = '',
  animated = true,
}: BrandLogoProps) => {
  const sizeConfig = {
    sm: {
      icon: 32 as const,
      text: 'text-sm',
      tagline: 'text-[8px]',
    },
    md: {
      icon: 48 as const,
      text: 'text-xl',
      tagline: 'text-[10px]',
    },
    lg: {
      icon: 64 as const,
      text: 'text-2xl',
      tagline: 'text-xs',
    },
  };
  const config = sizeConfig[size];
  return (
    <Link to="/" className={`inline-flex items-center gap-4 group ${className}`}>
      <motion.div
        className="relative flex items-center justify-center"
        whileHover={
          animated
            ? {
                scale: 1.1,
              }
            : undefined
        }
        transition={{
          duration: 0.3,
        }}
      >
        {/* Smoke wisps effect */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute -top-2 left-1/2 w-3 h-3 bg-jules-cyan/20 rounded-full blur-sm animate-pulse" />
          <div
            className="absolute -top-1 right-1/4 w-2 h-2 bg-jules-purple/20 rounded-full blur-sm animate-pulse"
            style={{
              animationDelay: '0.3s',
            }}
          />
        </div>

        {/* Glow effect - properly centered */}
        <div className="absolute inset-[-4px] rounded-xl bg-gradient-to-br from-jules-cyan via-jules-magenta to-jules-yellow opacity-40 blur-lg group-hover:opacity-80 transition-opacity duration-300" />

        {/* Logo container - ninja perfectly centered */}
        <div className="relative rounded-xl bg-gradient-to-br from-jules-cyan via-jules-magenta to-jules-yellow p-[2px]">
          <div
            className="rounded-[10px] bg-jules-dark flex items-center justify-center overflow-visible"
            style={{
              width: config.icon * 1.6,
              height: config.icon * 1.25,
              paddingLeft: config.icon * 0.2,
            }}
          >
            <NinjaIcon
              size={config.icon}
              showGlow={animated}
              weapon="katana"
              glowingBlade
              className="py-0 px-[5px] pl-0 mx-[4px] pb-px pr-0 mr-0 ml-[5px]"
            />
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col">
        <span
          className={`font-mono ${config.text} font-bold tracking-wide`}
          style={{
            background:
              'linear-gradient(135deg, hsl(var(--jules-cyan)) 0%, hsl(var(--jules-magenta)) 50%, hsl(var(--jules-yellow)) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          MESHAL ALAWEIN
        </span>

        {showTagline && (
          <span
            className={`${config.tagline} font-mono tracking-[0.15em] uppercase`}
            style={{
              background:
                'linear-gradient(90deg, hsl(var(--jules-cyan)) 0%, hsl(var(--jules-magenta)) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Computational Physicist
          </span>
        )}
      </div>
    </Link>
  );
};
export default BrandLogo;
