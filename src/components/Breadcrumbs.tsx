import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const routeLabels: Record<string, string> = {
  '': 'Home',
  studio: 'Studio',
  templates: 'Templates',
  platforms: 'Platforms',
  projects: 'Projects',
  preview: 'Preview',
  simcore: 'SimCore',
  qmlab: 'QMLab',
  talai: 'TalAI',
  mezan: 'MEZAN',
  optilibria: 'OptiLibria',
  profile: 'Profile',
  settings: 'Settings',
  auth: 'Sign In',
  portfolio: 'Portfolio',
  resume: 'Resume',
  'design-system': 'Design System',
};

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    ...pathnames.map((value, index) => {
      const href = `/${pathnames.slice(0, index + 1).join('/')}`;
      const isLast = index === pathnames.length - 1;
      return {
        label: routeLabels[value] || value.charAt(0).toUpperCase() + value.slice(1),
        href: isLast ? undefined : href,
      };
    }),
  ];

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
      {breadcrumbs.map((crumb, index) => (
        <div key={index} className="flex items-center gap-1">
          {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground/50" />}
          {crumb.href ? (
            <Link
              to={crumb.href}
              className={cn(
                'flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors',
                index === 0 && 'text-muted-foreground'
              )}
            >
              {index === 0 && <Home className="h-3.5 w-3.5" />}
              <span>{crumb.label}</span>
            </Link>
          ) : (
            <span className="text-foreground font-medium">{crumb.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

export default Breadcrumbs;
