// HeaderLogo - Now uses MALogo avatar component
import { MALogo } from './MALogo';

export type HeaderLogoVariant = 'full' | 'compact' | 'icon-only';

export interface HeaderLogoProps {
  size?: number;
  variant?: HeaderLogoVariant;
  linkTo?: string | null;
  className?: string;
  showText?: boolean;
}

/**
 * Header Logo - Uses MA Avatar with optional text
 * Simplified to use the reusable MALogo component
 */
export function HeaderLogo({ variant = 'full', linkTo = '/', className = '' }: HeaderLogoProps) {
  const isCompact = variant === 'compact';

  return (
    <MALogo
      size={isCompact ? 'sm' : 'md'}
      linkTo={linkTo}
      className={className}
      showGlow={true}
      animated={true}
    />
  );
}

export default HeaderLogo;
