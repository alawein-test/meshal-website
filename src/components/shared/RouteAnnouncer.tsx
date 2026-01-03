import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const routeTitles: Record<string, string> = {
  '/': 'Home',
  '/portfolio': 'Portfolio',
  '/resume': 'Resume',
  '/interactive-resume': 'Interactive Resume',
  '/projects': 'Projects Hub',
  '/auth': 'Authentication',
  '/profile': 'Profile',
  '/settings': 'Settings',
  '/design-system': 'Design System',
  '/brand': 'Brand Consistency',
  '/icons': 'Icon Assets',
  '/stickers': 'Sticker Pack',
  '/platforms': 'Platforms',
  '/templates': 'Templates',
};

export const RouteAnnouncer = () => {
  const location = useLocation();
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const title = routeTitles[location.pathname] || 'Page';
    setAnnouncement(`Navigated to ${title}`);
  }, [location.pathname]);

  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {announcement}
    </div>
  );
};

export default RouteAnnouncer;
