import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, Linkedin, Mail, ChevronDown, Sparkles } from 'lucide-react';
import { useRef } from 'react';
import TerminalTyping from './TerminalTyping';
import CyberpunkCity from './CyberpunkCity';

const socialLinks = [
  {
    icon: Github,
    href: 'https://github.com/meshal-alawein',
    label: 'GitHub',
    color: 'jules-cyan',
  },
  {
    icon: Linkedin,
    href: 'https://linkedin.com/in/meshal-alawein',
    label: 'LinkedIn',
    color: 'jules-magenta',
  },
  {
    icon: Mail,
    href: 'mailto:meshal@berkeley.edu',
    label: 'Email',
    color: 'jules-green',
  },
];

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Cyberpunk City Background */}
      <CyberpunkCity />

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              width: 200 + i * 100,
              height: 200 + i * 100,
              left: `${10 + i * 20}%`,
              top: `${20 + i * 10}%`,
              background:
                i % 3 === 0
                  ? 'radial-gradient(circle, hsl(var(--jules-cyan) / 0.15) 0%, transparent 70%)'
                  : i % 3 === 1
                    ? 'radial-gradient(circle, hsl(var(--jules-magenta) / 0.15) 0%, transparent 70%)'
                    : 'radial-gradient(circle, hsl(var(--jules-purple) / 0.15) 0%, transparent 70%)',
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <motion.div style={{ y, opacity }} className="container relative z-10 px-4">
        <motion.div
          className="text-center max-w-5xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-jules-green/10 border border-jules-green/30 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-jules-green opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-jules-green" />
            </span>
            <span className="text-sm font-mono text-jules-green">Available for opportunities</span>
          </motion.div>

          <div className="relative">
            {/* Decorative sparkles */}
            <motion.div
              className="absolute -top-8 left-1/4"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-6 h-6 text-jules-yellow opacity-60" />
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight font-display"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span
                className="glitch-text relative inline-block"
                data-text="MESHAL ALAWEIN"
                style={{
                  background:
                    'linear-gradient(135deg, hsl(var(--jules-cyan)) 0%, hsl(var(--jules-magenta)) 40%, hsl(var(--jules-yellow)) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '0.02em',
                }}
              >
                MESHAL ALAWEIN
              </span>
            </motion.h1>

            {/* Animated underline */}
            <motion.div
              className="h-1 mx-auto rounded-full mb-8"
              style={{
                background:
                  'linear-gradient(90deg, transparent, hsl(var(--jules-cyan)), hsl(var(--jules-magenta)), hsl(var(--jules-yellow)), transparent)',
              }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '60%', opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </div>

          {/* Title */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl md:text-2xl lg:text-3xl font-mono text-muted-foreground mb-6 tracking-wide">
              Computational Physicist
            </h2>
            <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
              Building the future at the intersection of{' '}
              <motion.span
                className="text-jules-magenta font-semibold cursor-default"
                whileHover={{ scale: 1.05 }}
                style={{ textShadow: '0 0 15px hsl(var(--jules-magenta))' }}
              >
                physics
              </motion.span>
              ,{' '}
              <motion.span
                className="text-jules-yellow font-semibold cursor-default"
                whileHover={{ scale: 1.05 }}
                style={{ textShadow: '0 0 15px hsl(var(--jules-yellow))' }}
              >
                AI
              </motion.span>
              , and{' '}
              <motion.span
                className="text-jules-cyan font-semibold cursor-default"
                whileHover={{ scale: 1.05 }}
                style={{ textShadow: '0 0 15px hsl(var(--jules-cyan))' }}
              >
                optimization
              </motion.span>
            </p>
          </motion.div>

          {/* Terminal typing animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <TerminalTyping />
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="flex items-center justify-center gap-4 mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-4 rounded-xl border transition-all duration-300"
                style={{
                  borderColor: `hsl(var(--${link.color}) / 0.3)`,
                  background: `hsl(var(--${link.color}) / 0.05)`,
                }}
                whileHover={{
                  scale: 1.1,
                  y: -4,
                  boxShadow: `0 0 30px hsl(var(--${link.color}) / 0.4)`,
                  borderColor: `hsl(var(--${link.color}) / 0.6)`,
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                aria-label={link.label}
              >
                <link.icon className="w-6 h-6" style={{ color: `hsl(var(--${link.color}))` }} />
                {/* Tooltip */}
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-muted-foreground">
                  {link.label}
                </span>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 text-muted-foreground"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs font-mono">Scroll to explore</span>
          <ChevronDown className="w-5 h-5 text-jules-cyan" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
