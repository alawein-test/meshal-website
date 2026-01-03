import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Terminal, Send, CheckCircle, Sparkles, Boxes } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import BrandLogo from '@/components/shared/BrandLogo';
import { PreloadLink } from '@/components/shared/PreloadLink';

const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email')
    .max(255, 'Email is too long'),
});

export function UnifiedFooter() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = newsletterSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSuccess(true);
    toast.success('Welcome to the network! Check your inbox for confirmation.');
    setEmail('');
    setIsSubmitting(false);

    setTimeout(() => setIsSuccess(false), 3000);
  };

  const socialLinks = [
    {
      href: 'https://github.com/meshal-alawein',
      icon: Github,
      label: 'GitHub',
      color: 'jules-cyan',
    },
    {
      href: 'https://linkedin.com/in/meshal-alawein',
      icon: Linkedin,
      label: 'LinkedIn',
      color: 'jules-magenta',
    },
    { href: 'mailto:meshal@berkeley.edu', icon: Mail, label: 'Email', color: 'jules-yellow' },
  ];

  const quickLinks = [
    { to: '/studios', label: 'Studios', icon: Sparkles },
    { to: '/platforms', label: 'Platforms', icon: Boxes },
    { to: '/projects', label: 'Projects' },
    { to: '/services', label: 'Services' },
    { to: '/resume', label: 'Resume' },
  ];

  const companyLinks = [
    { to: '/studios', label: 'Alawein Technologies LLC', hash: 'alawein' },
    { to: '/studios', label: 'REPZ LLC', hash: 'repz' },
    { to: '/studios', label: 'Live It Iconic LLC', hash: 'iconic' },
  ];

  return (
    <footer className="relative z-10 border-t border-jules-cyan/20 overflow-hidden">
      {/* Animated gradient background - Studio style */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, hsl(var(--jules-dark)) 20%, hsl(250 30% 5%) 100%)',
        }}
      />

      {/* Glowing top border - Studio style */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, hsl(var(--jules-cyan)) 20%, hsl(var(--jules-magenta)) 50%, hsl(var(--jules-purple)) 80%, transparent 100%)',
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      />

      {/* Floating particles - Studio aesthetic */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background:
                i % 3 === 0
                  ? 'hsl(var(--jules-cyan))'
                  : i % 3 === 1
                    ? 'hsl(var(--jules-magenta))'
                    : 'hsl(var(--jules-purple))',
              opacity: 0.3,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container relative px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand & Newsletter - Studio style */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <BrandLogo size="md" showTagline={false} />
              <Badge
                variant="outline"
                className="font-mono text-xs border-jules-cyan/30 text-jules-cyan"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Studio Hub
              </Badge>
            </div>

            <p className="text-muted-foreground font-mono text-sm max-w-md">
              <span className="text-jules-green">{'// '}</span>
              Building the future with quantum-inspired code and cyberpunk aesthetics. Explore
              studios, platforms, and unified tools.
            </p>

            {/* Newsletter - Studio style */}
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <label className="text-sm font-mono text-jules-cyan flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                <span>SUBSCRIBE TO UPDATES</span>
              </label>
              <div className="flex gap-2 max-w-md">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  className={`bg-black/50 border-jules-cyan/30 font-mono text-sm placeholder:text-muted-foreground/50 focus:border-jules-cyan focus:ring-jules-cyan/20 transition-shadow duration-300 focus:shadow-[0_0_15px_hsl(var(--jules-cyan)/0.5),0_0_30px_hsl(var(--jules-cyan)/0.3)] ${error ? 'border-destructive' : ''}`}
                  aria-label="Email address for newsletter"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting || isSuccess}
                  className="bg-jules-cyan hover:bg-jules-cyan/80 text-black font-mono px-6"
                  style={{ boxShadow: '0 0 15px hsl(var(--jules-cyan) / 0.3)' }}
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="text-sm"
                    >
                      🥷
                    </motion.div>
                  ) : isSuccess ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {error && <p className="text-sm text-destructive font-mono">{error}</p>}
            </form>
          </div>

          {/* Quick Links - Studio style */}
          <div className="space-y-4">
            <h3 className="font-mono text-sm font-bold text-jules-magenta uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Navigation
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <PreloadLink
                    to={link.to}
                    className="text-muted-foreground hover:text-jules-cyan transition-colors font-mono text-sm flex items-center gap-2 group relative"
                  >
                    {link.icon && (
                      <link.icon className="h-3 w-3 text-jules-cyan/50 group-hover:text-jules-cyan transition-colors" />
                    )}
                    <span className="relative">
                      {link.label}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-jules-cyan transition-all duration-300 group-hover:w-full shadow-[0_0_8px_hsl(var(--jules-cyan)),0_0_15px_hsl(var(--jules-cyan)/0.5)]" />
                    </span>
                  </PreloadLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Companies - Studio style */}
          <div className="space-y-4">
            <h3 className="font-mono text-sm font-bold text-jules-yellow uppercase tracking-wider flex items-center gap-2">
              <Boxes className="h-4 w-4" />
              Ventures
            </h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <PreloadLink
                    to={link.to}
                    className="text-muted-foreground hover:text-jules-yellow transition-colors font-mono text-sm flex items-center gap-2 group relative"
                  >
                    <span className="text-jules-yellow/50 group-hover:text-jules-yellow transition-colors">
                      {'>'}
                    </span>
                    <span className="relative">
                      {link.label}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-jules-yellow transition-all duration-300 group-hover:w-full shadow-[0_0_8px_hsl(var(--jules-yellow)),0_0_15px_hsl(var(--jules-yellow)/0.5)]" />
                    </span>
                  </PreloadLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Studio style */}
        <div className="mt-12 pt-8 border-t border-jules-cyan/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <p className="text-sm font-mono">
              <span className="text-jules-green">{'// '}</span>
              <span className="text-foreground/80">© {currentYear} </span>
              <motion.span
                className="font-bold inline-block cursor-default"
                style={{
                  background:
                    'linear-gradient(90deg, hsl(var(--jules-cyan)), hsl(var(--jules-magenta)), hsl(var(--jules-purple)))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  backgroundSize: '200% 100%',
                }}
                whileHover={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 1.5,
                  ease: 'easeInOut',
                }}
              >
                Meshal Alawein
              </motion.span>
              <span className="text-foreground/70">. Crafted with precision and curiosity.</span>
            </p>

            {/* Social Links - Studio style */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => {
                const color = social.color;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg border-2 bg-jules-surface/30 transition-all"
                    style={{
                      borderColor: `hsl(var(--${color}) / 0.4)`,
                      color: `hsl(var(--${color}))`,
                    }}
                    animate={{
                      boxShadow: [
                        `0 0 15px hsl(var(--${color}) / 0.2)`,
                        `0 0 25px hsl(var(--${color}) / 0.4)`,
                        `0 0 15px hsl(var(--${color}) / 0.2)`,
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: index * 0.3,
                    }}
                    whileHover={{
                      scale: 1.15,
                      y: -3,
                      boxShadow: `0 0 35px hsl(var(--${color}) / 0.6)`,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative grid pattern - Studio aesthetic */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--jules-cyan)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--jules-cyan)) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Bottom glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{
          background: 'linear-gradient(0deg, hsl(var(--jules-cyan) / 0.05) 0%, transparent 100%)',
        }}
      />
    </footer>
  );
}
