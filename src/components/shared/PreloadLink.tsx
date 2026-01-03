import { Link, LinkProps } from 'react-router-dom';
import { useCallback } from 'react';

// Map of route paths to their lazy import functions
const routePreloaders: Record<string, () => Promise<unknown>> = {
  '/': () => import('@/pages/Landing'),
  '/portfolio': () => import('@/pages/Portfolio'),
  '/resume': () => import('@/pages/Resume'),
  '/interactive-resume': () => import('@/pages/InteractiveResume'),
  '/projects': () => import('@/projects/pages/ProjectsHub'),
  '/services': () => import('@/pages/services/ServicesHub'),
  '/studios': () => import('@/studios/StudioSelector'),
  '/studio/templates': () => import('@/studios/templates/TemplatesHub'),
  '/platforms': () => import('@/studios/platforms/PlatformsHub'),
  '/design-system': () => import('@/pages/DesignSystem'),
  '/brand': () => import('@/pages/BrandConsistency'),
  '/icons': () => import('@/pages/IconAssets'),
  '/stickers': () => import('@/pages/StickerPack'),
  '/settings': () => import('@/pages/Settings'),
  '/profile': () => import('@/pages/Profile'),
  '/auth': () => import('@/pages/Auth'),
  // Project detail pages
  '/project/simcore': () => import('@/projects/pages/simcore/SimCoreDashboard'),
  '/project/qmlab': () => import('@/projects/pages/qmlab/QMLabDashboard'),
  '/project/talai': () => import('@/projects/pages/talai/TalAIDashboard'),
  '/project/optilibria': () => import('@/projects/pages/optilibria/OptiLibriaDashboard'),
  '/project/mezan': () => import('@/projects/pages/mezan/MEZANDashboard'),
};

interface PreloadLinkProps extends LinkProps {
  children: React.ReactNode;
}

/**
 * A Link component that preloads the target route on hover.
 * This improves perceived navigation performance by loading the
 * route's code before the user clicks.
 */
export const PreloadLink = ({ to, children, ...props }: PreloadLinkProps) => {
  const handleMouseEnter = useCallback(() => {
    const path = typeof to === 'string' ? to : to.pathname;
    if (path && routePreloaders[path]) {
      routePreloaders[path]();
    }
  }, [to]);

  return (
    <Link to={to} onMouseEnter={handleMouseEnter} {...props}>
      {children}
    </Link>
  );
};

export default PreloadLink;
