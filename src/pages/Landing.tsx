import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Code, Sparkles, Zap, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import JulesBackground from '@/components/JulesBackground';
import CRTOverlay from '@/components/CRTOverlay';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import ClickEffectsManager from '@/components/ClickEffectsManager';
import { PublicHeader } from '@/components/shared/PublicHeader';
import CyberpunkScreen from '@/components/CyberpunkScreen';
import ContactSection from '@/components/ContactSection';
import { INTERVAL } from '@/utils/timing';
import { PreloadLink } from '@/components/shared/PreloadLink';
import { JsonLd, schemas } from '@/components/shared/JsonLd';
import { SEO } from '@/components/shared/SEO';

const wittyTaglines = [
  'Turning complex physics into elegant code.',
  'Where quantum mechanics meets software engineering.',
  "Solving problems you didn't know you had, in ways you don't understand.",
  'Making simulations run faster than reality.',
  'The intersection of curiosity and computation.',
];

const stats = [
  { value: '10+', label: 'Years Experience', icon: Zap },
  { value: '20+', label: 'Projects', icon: Code },
  { value: '5', label: 'Platforms', icon: Globe },
];

const Landing = () => {
  const [taglineIndex, setTaglineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % wittyTaglines.length);
    }, INTERVAL.TAGLINE_ROTATION);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-jules-dark text-foreground overflow-hidden">
      <SEO
        title="Scientific Computing & AI Research"
        description="Explore the portfolio of M. Alawein - Computational Physicist specializing in scientific computing, machine learning, quantum mechanics, and enterprise solutions."
        keywords={[
          'scientific computing',
          'AI research',
          'machine learning',
          'quantum mechanics',
          'computational physics',
          'full-stack development',
        ]}
      />
      <JsonLd schema={schemas.person} />
      <JsonLd schema={schemas.website} />
      <ClickEffectsManager />
      <JulesBackground />
      <CRTOverlay />
      <UnifiedHeader />

      <main
        id="main-content"
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6"
      >
        {/* Floating orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-3xl"
              style={{
                width: 150 + i * 80,
                height: 150 + i * 80,
                left: `${5 + i * 18}%`,
                top: `${15 + (i % 3) * 25}%`,
                background:
                  i % 3 === 0
                    ? 'radial-gradient(circle, hsl(var(--jules-cyan) / 0.12) 0%, transparent 70%)'
                    : i % 3 === 1
                      ? 'radial-gradient(circle, hsl(var(--jules-magenta) / 0.12) 0%, transparent 70%)'
                      : 'radial-gradient(circle, hsl(var(--jules-purple) / 0.12) 0%, transparent 70%)',
              }}
              animate={{
                y: [-30, 30, -30],
                x: [-15, 15, -15],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background:
              'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, hsl(var(--jules-cyan) / 0.02) 2px, hsl(var(--jules-cyan) / 0.02) 4px)',
          }}
        />

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center max-w-5xl relative"
        >
          {/* Cyberpunk TV Screen */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-8"
          >
            <CyberpunkScreen />
          </motion.div>

          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-jules-green/10 border border-jules-green/30 mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-jules-green opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-jules-green" />
            </span>
            <span className="text-sm font-mono text-jules-green">Open to opportunities</span>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-black tracking-wide uppercase mb-3"
            style={{
              background:
                'linear-gradient(135deg, hsl(var(--foreground)) 0%, hsl(var(--jules-cyan)) 40%, hsl(var(--jules-magenta)) 70%, hsl(var(--jules-yellow)) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            MESHAL ALAWEIN
          </motion.h1>

          {/* Title */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-mono text-lg md:text-xl tracking-[0.15em] uppercase mb-8"
            style={{
              background:
                'linear-gradient(90deg, hsl(var(--jules-cyan)) 0%, hsl(var(--jules-magenta)) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Computational Physicist
          </motion.p>

          {/* Professional tags */}
          <motion.div
            className="flex items-center justify-center gap-3 md:gap-4 mb-8 flex-wrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {[
              { label: 'Scientific Computing', color: 'cyan' },
              { label: 'AI Research', color: 'magenta' },
              { label: 'Enterprise Solutions', color: 'yellow' },
            ].map((tag) => (
              <motion.span
                key={tag.label}
                className={`text-jules-${tag.color} px-4 py-2 border rounded-lg bg-jules-${tag.color}/5 font-mono text-sm tracking-wider`}
                style={{
                  borderColor: `hsl(var(--jules-${tag.color}) / 0.4)`,
                  boxShadow: `0 0 20px hsl(var(--jules-${tag.color}) / 0.15)`,
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: `0 0 30px hsl(var(--jules-${tag.color}) / 0.3)`,
                }}
              >
                {tag.label}
              </motion.span>
            ))}
          </motion.div>

          {/* Rotating witty tagline */}
          <div className="h-16 flex items-center justify-center mb-10">
            <AnimatePresence mode="wait">
              <motion.p
                key={taglineIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-mono"
              >
                <span className="text-jules-green">// </span>
                {wittyTaglines[taglineIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <PreloadLink to="/portfolio">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  className="group relative overflow-hidden bg-jules-cyan text-jules-dark font-display text-lg tracking-wider uppercase px-8 py-6 border-0"
                  style={{ boxShadow: '0 0 30px hsl(var(--jules-cyan) / 0.4)' }}
                >
                  <span className="relative z-10 flex items-center gap-3 font-bold">
                    View Portfolio
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </motion.div>
            </PreloadLink>

            <PreloadLink to="/studios">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="group relative overflow-hidden border-2 border-jules-magenta/50 text-jules-magenta font-display text-lg tracking-wider uppercase px-8 py-6 bg-transparent hover:bg-jules-magenta/10"
                  style={{ boxShadow: '0 0 25px hsl(var(--jules-magenta) / 0.2)' }}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Explore Studios
                    <Sparkles className="w-5 h-5" />
                  </span>
                </Button>
              </motion.div>
            </PreloadLink>
          </motion.div>

          {/* Mini stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16 flex items-center justify-center gap-8 md:gap-12"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <stat.icon className="w-4 h-4 text-jules-cyan" />
                  <span className="text-2xl font-bold font-display text-foreground">
                    {stat.value}
                  </span>
                </div>
                <span className="text-xs font-mono text-muted-foreground">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      <ContactSection />

      <UnifiedFooter />
    </div>
  );
};

export default Landing;
