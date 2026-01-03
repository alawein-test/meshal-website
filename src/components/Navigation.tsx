import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HeaderLogo } from '@/components/shared/HeaderLogo';
import { PreloadLink } from '@/components/shared/PreloadLink';
import { Briefcase, Layers, FileText, Search } from 'lucide-react';

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [0, 1]);
  const navigate = useNavigate();
  const location = useLocation();
  const isPortfolio = location.pathname === '/portfolio';

  // Nav links - context aware, renamed "Platforms" to "Studios"
  const navLinks = isPortfolio
    ? [
        { href: '#about', label: 'About', isHash: true, color: 'jules-cyan' },
        { href: '#skills', label: 'Skills', isHash: true, color: 'jules-magenta' },
        { href: '#projects', label: 'Projects', isHash: true, color: 'jules-yellow' },
        { href: '#contact', label: 'Contact', isHash: true, color: 'jules-green' },
      ]
    : [
        {
          href: '/portfolio',
          label: 'Portfolio',
          isHash: false,
          color: 'jules-magenta',
          icon: Briefcase,
        },
        { href: '/studios', label: 'Studios', isHash: false, color: 'jules-purple', icon: Layers },
      ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    isHash: boolean
  ) => {
    e.preventDefault();
    if (isHash) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(href);
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-4'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="absolute inset-0 bg-jules-dark/80 backdrop-blur-md border-b border-jules-cyan/10"
        style={{ opacity }}
      />

      {/* Glow line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-jules-cyan/50 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />

      <nav className="container relative px-4 flex items-center justify-between">
        {/* Logo */}
        <HeaderLogo showText linkTo="/" />

        {/* Center: Nav links + CTAs */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavigation(e, link.href, link.isHash)}
              className={`px-4 py-2 text-sm font-mono text-muted-foreground hover:text-${link.color} transition-colors relative group flex items-center gap-2`}
            >
              {link.label}
              <span
                className={`absolute -bottom-1 left-4 right-4 h-px bg-${link.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                style={{ boxShadow: `0 0 8px hsl(var(--${link.color}))` }}
              />
            </a>
          ))}
        </div>

        {/* Right side: Search icon + Resume CTA */}
        <div className="flex items-center gap-3">
          {/* Search icon */}
          <motion.button
            className="p-2 text-muted-foreground hover:text-jules-cyan transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </motion.button>

          {/* Resume CTA - more prominent */}
          <PreloadLink to="/resume">
            <motion.div
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-mono font-bold rounded-full text-jules-dark"
              style={{
                background:
                  'linear-gradient(135deg, hsl(var(--jules-cyan)) 0%, hsl(var(--jules-magenta)) 100%)',
                boxShadow:
                  '0 0 25px hsl(var(--jules-cyan) / 0.4), 0 0 50px hsl(var(--jules-magenta) / 0.2)',
              }}
              whileHover={{
                scale: 1.05,
                boxShadow:
                  '0 0 35px hsl(var(--jules-cyan) / 0.6), 0 0 60px hsl(var(--jules-magenta) / 0.3)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <FileText className="w-4 h-4" />
              Resume
            </motion.div>
          </PreloadLink>
        </div>
      </nav>
    </motion.header>
  );
};

export default Navigation;
