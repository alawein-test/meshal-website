import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  User,
  Search,
  Home,
  Layers,
  Settings,
  LogIn,
  LogOut,
  Briefcase,
  Sparkles,
  Boxes,
  Palette,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { HeaderLogo } from '@/components/shared/HeaderLogo';
import { PreloadLink } from '@/components/shared/PreloadLink';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';

interface NavLink {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const mainLinks: NavLink[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/studios', label: 'Studios', icon: Palette, badge: 'New' },
  { href: '/platforms', label: 'Platforms', icon: Boxes },
  { href: '/projects', label: 'Projects', icon: Layers },
  { href: '/services', label: 'Services', icon: Briefcase },
];

export function UnifiedHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const isMac = useMemo(() => {
    if (typeof navigator !== 'undefined') {
      return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    }
    return false;
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const openSearch = () => {
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: isMac,
      ctrlKey: !isMac,
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled ? 'py-2' : 'py-3'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated gradient top border - Studio style */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, hsl(var(--jules-cyan)), hsl(var(--jules-magenta)), hsl(var(--jules-purple)), hsl(var(--jules-cyan)))',
              backgroundSize: '200% 100%',
            }}
            animate={{ backgroundPosition: ['0% 0%', '200% 0%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          <div
            className="absolute inset-0"
            style={{
              boxShadow:
                '0 0 20px hsl(var(--jules-cyan) / 0.6), 0 0 40px hsl(var(--jules-magenta) / 0.4)',
            }}
          />
        </motion.div>

        {/* Studio-style backdrop */}
        <motion.div
          className={cn(
            'absolute inset-0 backdrop-blur-xl border-b transition-all overflow-hidden',
            'bg-jules-dark/95 border-jules-cyan/20'
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: scrolled ? 1 : 0.95 }}
          transition={{ duration: 0.3 }}
        >
          {/* Subtle grid pattern - Studio aesthetic */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(hsl(var(--jules-cyan)) 1px, transparent 1px),
                linear-gradient(90deg, hsl(var(--jules-cyan)) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          />

          {/* Horizontal scan line */}
          <motion.div
            className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-jules-cyan/20 to-transparent"
            animate={{ y: [0, 60, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Bottom glow line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, hsl(var(--jules-cyan)) 30%, hsl(var(--jules-magenta)) 50%, hsl(var(--jules-cyan)) 70%, transparent 100%)',
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: [0.5, 1, 0.5] }}
          transition={{
            scaleX: { duration: 0.8, delay: 0.2 },
            opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          }}
        />

        <nav className="container relative px-4 flex items-center justify-between">
          {/* Logo */}
          <HeaderLogo showText linkTo="/" />

          {/* Desktop Navigation - Studio style */}
          <div className="hidden md:flex items-center gap-1">
            {mainLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <PreloadLink
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'relative px-4 py-2 text-sm font-mono rounded-lg transition-all duration-300 group',
                    active ? 'text-jules-cyan' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4" />}
                    {link.label}
                    {link.badge && (
                      <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0">
                        {link.badge}
                      </Badge>
                    )}
                  </span>

                  {active && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-jules-cyan/10 rounded-lg border border-jules-cyan/20"
                      style={{ boxShadow: '0 0 20px hsl(var(--jules-cyan) / 0.2)' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}

                  <span
                    className="absolute bottom-1 left-4 right-4 h-px bg-jules-cyan scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                    style={{ boxShadow: '0 0 8px hsl(var(--jules-cyan))' }}
                  />
                </PreloadLink>
              );
            })}
          </div>

          {/* Right side - Search + Auth */}
          <div className="flex items-center gap-3">
            {/* Search button - Studio style */}
            <motion.button
              onClick={openSearch}
              className="p-2.5 rounded-lg border border-jules-cyan/30 bg-jules-surface/30 text-muted-foreground hover:text-jules-cyan hover:border-jules-cyan/50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </motion.button>

            {/* Auth buttons */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <PreloadLink to="/profile">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-jules-cyan font-mono"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </PreloadLink>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-destructive font-mono"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <PreloadLink to="/auth" className="hidden md:block">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-jules-cyan font-mono"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </PreloadLink>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-jules-cyan border border-jules-cyan/20"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileMenuOpen ? 'close' : 'menu'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.div>
              </AnimatePresence>
            </Button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu - Studio style */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] z-50 md:hidden"
            >
              <div className="h-full bg-jules-dark/95 backdrop-blur-xl border-l border-jules-cyan/20 flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-jules-cyan/10">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-jules-cyan" />
                    <span className="font-mono text-jules-cyan text-sm">{'// Navigation'}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-jules-cyan"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                  {mainLinks.map((link, index) => {
                    const Icon = link.icon;
                    const active = isActive(link.href);
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <PreloadLink
                          to={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            'flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-mono text-sm',
                            active
                              ? 'bg-jules-cyan/10 text-jules-cyan border border-jules-cyan/20'
                              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                          )}
                        >
                          {Icon && <Icon className="w-4 h-4" />}
                          {link.label}
                          {link.badge && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                              {link.badge}
                            </Badge>
                          )}
                        </PreloadLink>
                      </motion.div>
                    );
                  })}

                  {/* Auth links in mobile */}
                  {isAuthenticated ? (
                    <>
                      <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: mainLinks.length * 0.05 }}
                      >
                        <PreloadLink
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-mono text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </PreloadLink>
                      </motion.div>
                      <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: (mainLinks.length + 1) * 0.05 }}
                      >
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-mono text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </motion.div>
                    </>
                  ) : (
                    <motion.div
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: mainLinks.length * 0.05 }}
                    >
                      <PreloadLink
                        to="/auth"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-mono text-sm text-muted-foreground hover:bg-muted/50 hover:text-jules-cyan"
                      >
                        <LogIn className="w-4 h-4" />
                        Login
                      </PreloadLink>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
