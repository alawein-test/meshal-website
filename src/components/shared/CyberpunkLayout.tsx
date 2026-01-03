// Cyberpunk Layout wrapper - provides consistent cyberpunk theme for subpages
import JulesBackground from '@/components/JulesBackground';
import CRTOverlay from '@/components/CRTOverlay';
import ClickEffectsManager from '@/components/ClickEffectsManager';
import PixelNinja from '@/components/PixelNinja';
import { PublicHeader } from '@/components/shared/PublicHeader';
import Footer from '@/components/Footer';
import { ReactNode } from 'react';

interface CyberpunkLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showNinja?: boolean;
  className?: string;
}

export const CyberpunkLayout = ({
  children,
  showHeader = true,
  showFooter = true,
  showNinja = true,
  className = '',
}: CyberpunkLayoutProps) => {
  return (
    <div className={`min-h-screen bg-jules-dark text-foreground overflow-hidden ${className}`}>
      <JulesBackground />
      <CRTOverlay />
      <ClickEffectsManager />
      {showNinja && <PixelNinja />}
      {showHeader && <PublicHeader />}

      <div className="relative z-10">{children}</div>

      {showFooter && <Footer />}
    </div>
  );
};

export default CyberpunkLayout;
