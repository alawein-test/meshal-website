import { motion } from 'framer-motion';
import { Palette, Type, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ColorSchemeGenerator } from '@/components/ColorSchemeGenerator';
import { TypographyPreview } from '@/components/TypographyPreview';
import { CyberpunkLayout, SEO } from '@/components/shared';

export default function DesignSystem() {
  return (
    <CyberpunkLayout showNinja={false}>
      <SEO
        title="Design System | Meshal Alawein"
        description="Colors, typography, and design tokens for the portfolio"
      />

      {/* Content */}
      <main className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Introduction */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-jules-cyan/30 bg-jules-cyan/5 mb-6"
              style={{ boxShadow: '0 0 20px hsl(var(--jules-cyan) / 0.2)' }}
            >
              <Sparkles className="w-4 h-4 text-jules-cyan" />
              <span className="text-sm font-mono text-jules-cyan">Design Tokens</span>
            </motion.div>
            <h1
              className="text-4xl font-bold mb-3"
              style={{
                background:
                  'linear-gradient(135deg, hsl(var(--jules-cyan)) 0%, hsl(var(--jules-magenta)) 50%, hsl(var(--jules-yellow)) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 40px hsl(var(--jules-magenta) / 0.3)',
              }}
            >
              Design System Tools
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto font-mono">
              <span className="text-jules-green">// </span>
              Generate color schemes, preview typography, and explore design tokens.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <a
              href="#colors"
              className="flex items-center gap-2 p-4 rounded-lg border border-jules-cyan/30 bg-jules-surface/30 backdrop-blur-xl hover:border-jules-cyan/50 hover:bg-jules-cyan/5 transition-all group"
              style={{ boxShadow: '0 0 15px hsl(var(--jules-cyan) / 0.1)' }}
            >
              <Palette className="w-5 h-5 text-jules-cyan" />
              <span className="font-medium font-mono text-jules-cyan group-hover:text-jules-cyan transition-colors">
                Color Generator
              </span>
            </a>
            <a
              href="#typography"
              className="flex items-center gap-2 p-4 rounded-lg border border-jules-magenta/30 bg-jules-surface/30 backdrop-blur-xl hover:border-jules-magenta/50 hover:bg-jules-magenta/5 transition-all group"
              style={{ boxShadow: '0 0 15px hsl(var(--jules-magenta) / 0.1)' }}
            >
              <Type className="w-5 h-5 text-jules-magenta" />
              <span className="font-medium font-mono text-jules-magenta group-hover:text-jules-magenta transition-colors">
                Typography
              </span>
            </a>
          </div>

          {/* Color Scheme Generator */}
          <section id="colors">
            <ColorSchemeGenerator />
          </section>

          {/* Typography Preview */}
          <section id="typography">
            <TypographyPreview />
          </section>

          {/* Current Theme Tokens */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-xl border border-jules-purple/30 bg-jules-surface/30 backdrop-blur-xl"
              style={{ boxShadow: '0 0 25px hsl(var(--jules-purple) / 0.15)' }}
            >
              <h3 className="font-semibold mb-4 flex items-center gap-2 font-mono text-jules-purple">
                <div className="w-3 h-3 rounded-full bg-jules-purple animate-pulse" />
                {'// Current Theme Tokens'}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { name: 'jules-cyan', class: 'bg-jules-cyan' },
                  { name: 'jules-magenta', class: 'bg-jules-magenta' },
                  { name: 'jules-purple', class: 'bg-jules-purple' },
                  { name: 'jules-yellow', class: 'bg-jules-yellow' },
                  { name: 'jules-green', class: 'bg-jules-green' },
                  { name: 'jules-dark', class: 'bg-jules-dark border border-jules-border' },
                  { name: 'jules-surface', class: 'bg-jules-surface border border-jules-border' },
                  { name: 'foreground', class: 'bg-foreground' },
                ].map((token) => (
                  <div key={token.name} className="text-center">
                    <div
                      className={`h-12 rounded-lg ${token.class} mb-2`}
                      style={{ boxShadow: `0 0 15px hsl(var(--${token.name}) / 0.3)` }}
                    />
                    <span className="text-xs text-muted-foreground font-mono">{token.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </section>
        </motion.div>
      </main>
    </CyberpunkLayout>
  );
}
