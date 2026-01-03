// Brand Consistency Test Page - Visual verification of all ninja branding
import { motion } from 'framer-motion';
import { NinjaIcon } from '@/components/icons/NinjaIcon';
import { HeaderLogo } from '@/components/shared/HeaderLogo';
import { NinjaMascot } from '@/components/NinjaMascot';
import { QuantumBackground, SEO, PublicHeader } from '@/components/shared';
import Footer from '@/components/Footer';

const BrandConsistency = () => {
  const variants = ['default', 'happy', 'wink', 'thinking', 'coding', 'celebrating'] as const;
  const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

  return (
    <div className="min-h-screen text-foreground">
      <SEO
        title="Brand Consistency"
        description="Visual verification of ninja branding consistency across all components."
      />
      <QuantumBackground variant="default" />
      <PublicHeader />

      <div className="relative z-10 container px-4 pt-24 pb-16 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="bg-gradient-to-r from-jules-cyan via-jules-magenta to-jules-yellow bg-clip-text text-transparent">
              Brand Consistency
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl font-mono">
            Visual verification of all ninja branding elements to ensure consistency across the
            application.
          </p>
        </motion.div>

        {/* Typography Section */}
        <Section title="Typography" delay={0.1}>
          <div className="grid gap-6">
            <div className="p-6 bg-jules-surface/30 rounded-xl border border-jules-cyan/20">
              <h3 className="text-sm font-mono text-jules-cyan mb-4">// Font Families</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted-foreground font-mono">
                    font-display (Headings)
                  </span>
                  <p className="text-3xl font-display font-bold text-foreground">
                    Meshal Alawein - MA
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground font-mono">
                    font-mono (Code/Labels)
                  </span>
                  <p className="text-xl font-mono text-foreground">
                    Scientific Computing • AI Research
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground font-mono">font-sans (Body)</span>
                  <p className="text-lg text-foreground">
                    Bridging complex computational challenges and elegant solutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Color Palette */}
        <Section title="Color Palette" delay={0.15}>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'jules-cyan', var: '--jules-cyan', desc: 'Primary brand' },
              { name: 'jules-magenta', var: '--jules-magenta', desc: 'Accent/Eyes' },
              { name: 'jules-purple', var: '--jules-purple', desc: 'Gradients' },
              { name: 'jules-yellow', var: '--jules-yellow', desc: 'Highlights' },
              { name: 'jules-green', var: '--jules-green', desc: 'Success' },
              { name: 'jules-dark', var: '--jules-dark', desc: 'Background' },
            ].map((color) => (
              <div key={color.name} className="text-center">
                <div
                  className="w-full aspect-square rounded-xl mb-2 border border-white/10"
                  style={{ backgroundColor: `hsl(var(${color.var}))` }}
                />
                <p className="text-xs font-mono text-jules-cyan">{color.name}</p>
                <p className="text-xs text-muted-foreground">{color.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* HeaderLogo Variants */}
        <Section title="HeaderLogo Variants" delay={0.2}>
          <div className="grid md:grid-cols-3 gap-6">
            {(['full', 'compact', 'icon-only'] as const).map((variant) => (
              <div
                key={variant}
                className="p-6 bg-jules-surface/30 rounded-xl border border-jules-cyan/20"
              >
                <h3 className="text-sm font-mono text-jules-cyan mb-4">// {variant}</h3>
                <div className="flex items-center justify-center py-4 bg-jules-dark/50 rounded-lg">
                  <HeaderLogo variant={variant} linkTo={null} />
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Weapon Options */}
        <Section title="Weapon Options" delay={0.25}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-jules-surface/30 rounded-xl border border-jules-cyan/20">
              <h3 className="text-sm font-mono text-jules-cyan mb-4">// Katana (Star Wars Glow)</h3>
              <div className="flex items-center justify-center py-8 bg-jules-dark/50 rounded-lg">
                <NinjaIcon size={96} showGlow weapon="katana" glowingBlade />
              </div>
            </div>
            <div className="p-6 bg-jules-surface/30 rounded-xl border border-jules-cyan/20">
              <h3 className="text-sm font-mono text-jules-cyan mb-4">// Shuriken</h3>
              <div className="flex items-center justify-center py-8 bg-jules-dark/50 rounded-lg">
                <NinjaIcon size={96} showGlow weapon="shuriken" />
              </div>
            </div>
          </div>
        </Section>

        {/* NinjaIcon Sizes */}
        <Section title="NinjaIcon Sizes" delay={0.3}>
          <div className="p-6 bg-jules-surface/30 rounded-xl border border-jules-cyan/20">
            <div className="flex flex-wrap items-end justify-center gap-8">
              {sizes.map((size) => (
                <div key={size} className="text-center">
                  <NinjaIcon size={size} showGlow weapon="katana" glowingBlade />
                  <p className="mt-2 text-xs font-mono text-muted-foreground">{size}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* NinjaIcon Expression Variants */}
        <Section title="Expression Variants" delay={0.35}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {variants.map((variant) => (
              <div
                key={variant}
                className="p-4 bg-jules-surface/30 rounded-xl border border-jules-cyan/20 text-center"
              >
                <div className="flex justify-center mb-2">
                  <NinjaIcon size="lg" variant={variant} showGlow weapon="katana" glowingBlade />
                </div>
                <p className="text-xs font-mono text-jules-cyan">{variant}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Live Components */}
        <Section title="Live Components" delay={0.4}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-jules-surface/30 rounded-xl border border-jules-cyan/20">
              <h3 className="text-sm font-mono text-jules-cyan mb-4">// PublicHeader (Top Left)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Uses <code className="text-jules-magenta">HeaderLogo</code> with katana weapon.
                Check the top-left corner of this page.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 text-xs font-mono rounded bg-jules-cyan/10 text-jules-cyan border border-jules-cyan/20">
                  NinjaIcon
                </span>
                <span className="px-2 py-1 text-xs font-mono rounded bg-jules-magenta/10 text-jules-magenta border border-jules-magenta/20">
                  + "MA" text
                </span>
                <span className="px-2 py-1 text-xs font-mono rounded bg-jules-yellow/10 text-jules-yellow border border-jules-yellow/20">
                  + Glowing Katana
                </span>
              </div>
            </div>
            <div className="p-6 bg-jules-surface/30 rounded-xl border border-jules-cyan/20">
              <h3 className="text-sm font-mono text-jules-cyan mb-4">
                // NinjaMascot (Bottom Right)
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Uses same <code className="text-jules-magenta">NINJA_PATTERN</code> with animations.
                Check the bottom-right corner of Landing page.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 text-xs font-mono rounded bg-jules-cyan/10 text-jules-cyan border border-jules-cyan/20">
                  Same Pattern
                </span>
                <span className="px-2 py-1 text-xs font-mono rounded bg-jules-magenta/10 text-jules-magenta border border-jules-magenta/20">
                  + Blinking Eyes
                </span>
                <span className="px-2 py-1 text-xs font-mono rounded bg-jules-yellow/10 text-jules-yellow border border-jules-yellow/20">
                  + Cursor Follow
                </span>
              </div>
            </div>
          </div>
        </Section>

        {/* Consistency Checklist */}
        <Section title="Consistency Checklist" delay={0.45}>
          <div className="p-6 bg-jules-surface/30 rounded-xl border border-jules-cyan/20">
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { item: 'All ninjas use NINJA_PATTERN from NinjaIcon.tsx', status: true },
                { item: 'Katana or Shuriken always present', status: true },
                { item: 'Star Wars glowing blade effect', status: true },
                { item: 'Cyan body color (jules-cyan)', status: true },
                { item: 'Magenta eyes/accents (jules-magenta)', status: true },
                { item: 'HeaderLogo used in all headers', status: true },
                { item: 'font-display for headings', status: true },
                { item: 'font-mono for labels/code', status: true },
              ].map((check, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      check.status
                        ? 'bg-jules-green/20 text-jules-green'
                        : 'bg-jules-magenta/20 text-jules-magenta'
                    }`}
                  >
                    {check.status ? '✓' : '✗'}
                  </div>
                  <span className="text-sm text-foreground">{check.item}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </div>

      <Footer />
    </div>
  );
};

// Section wrapper component
const Section = ({
  title,
  delay = 0,
  children,
}: {
  title: string;
  delay?: number;
  children: React.ReactNode;
}) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="mb-12"
  >
    <h2
      className="text-xl font-bold mb-6 font-mono text-jules-cyan"
      style={{ textShadow: '0 0 20px hsl(var(--jules-cyan) / 0.3)' }}
    >
      {'// '}
      {title}
    </h2>
    {children}
  </motion.section>
);

export default BrandConsistency;
