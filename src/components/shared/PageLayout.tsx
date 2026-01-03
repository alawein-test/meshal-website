/**
 * @file PageLayout.tsx
 * @description Unified page layout component with QuantumBackground, PublicHeader, and Footer
 * Provides consistent structure across all hub/listing pages
 */
import { ReactNode } from 'react';
import { UnifiedHeader } from './UnifiedHeader';
import { UnifiedFooter } from './UnifiedFooter';
import { QuantumBackground } from './QuantumBackground';
import { SEO } from './SEO';

interface PageLayoutProps {
  children: ReactNode;
  /** Page title for SEO */
  title: string;
  /** Page description for SEO */
  description: string;
  /** SEO keywords */
  keywords?: string[];
  /** Background variant - defaults to 'default' */
  backgroundVariant?: 'default' | 'minimal' | 'intense';
  /** Additional container class names */
  containerClassName?: string;
  /** Whether to include the standard container padding */
  includeContainer?: boolean;
}

export function PageLayout({
  children,
  title,
  description,
  keywords,
  backgroundVariant = 'default',
  containerClassName = '',
  includeContainer = true,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen text-foreground">
      <SEO title={title} description={description} keywords={keywords} />
      <QuantumBackground variant={backgroundVariant} />
      <UnifiedHeader />

      {includeContainer ? (
        <div
          className={`relative z-10 container px-4 pt-24 pb-16 max-w-7xl mx-auto ${containerClassName}`}
        >
          {children}
        </div>
      ) : (
        <div className="relative z-10">{children}</div>
      )}

      <UnifiedFooter />
    </div>
  );
}

export default PageLayout;
