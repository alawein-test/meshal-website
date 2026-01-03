import { motion } from 'framer-motion';
import { Zap, Mail, MapPin, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SEO, CyberpunkLayout } from '@/components/shared';
import {
  InteractiveTimeline,
  SkillsVisualization,
  SkillsRadarChart,
  TestimonialsCarousel,
  ResumeExport,
} from '@/components/resume';

export default function Resume() {
  return (
    <CyberpunkLayout>
      <SEO
        title="Resume | Meshal Alawein"
        description="Computational physicist and engineer building at the intersection of physics, AI, and optimization."
      />

      <main className="pt-24 pb-16">
        <div className="container px-4 max-w-5xl mx-auto">
          {/* Hero Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Avatar placeholder */}
            <motion.div
              className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden"
              style={{
                background:
                  'linear-gradient(135deg, hsl(var(--jules-cyan)), hsl(var(--jules-magenta)))',
                boxShadow: '0 0 40px hsl(var(--jules-cyan) / 0.4)',
              }}
              animate={{
                boxShadow: [
                  '0 0 40px hsl(var(--jules-cyan) / 0.4)',
                  '0 0 60px hsl(var(--jules-magenta) / 0.4)',
                  '0 0 40px hsl(var(--jules-cyan) / 0.4)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white">
                MA
              </div>
            </motion.div>

            <h1
              className="text-4xl md:text-6xl font-bold mb-4"
              style={{
                background:
                  'linear-gradient(135deg, hsl(var(--jules-cyan)) 0%, hsl(var(--jules-magenta)) 50%, hsl(var(--jules-yellow)) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Meshal Alawein
            </h1>

            <p className="text-xl text-muted-foreground font-mono mb-4">
              <span className="text-jules-green">// </span>
              Computational Physicist • Engineer • Builder
            </p>

            {/* Contact info */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground mb-8">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-jules-cyan" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4 text-jules-magenta" />
                <span>meshal@berkeley.edu</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4 text-jules-yellow" />
                <span>alawein.dev</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <ResumeExport />
              <Button
                variant="outline"
                className="gap-2 border-jules-magenta/30 text-jules-magenta hover:bg-jules-magenta/10"
                style={{ boxShadow: '0 0 15px hsl(var(--jules-magenta) / 0.2)' }}
              >
                <Mail className="w-4 h-4" />
                Contact Me
              </Button>
            </div>
          </motion.div>

          {/* Summary */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div
              className="p-6 rounded-xl border border-jules-purple/20 bg-jules-surface/30 backdrop-blur-xl text-center"
              style={{ boxShadow: '0 0 30px hsl(var(--jules-purple) / 0.1)' }}
            >
              <p className="text-lg text-muted-foreground leading-relaxed">
                Physicist-turned-engineer obsessed with building tools that make complex problems
                tractable. I specialize in{' '}
                <span className="text-jules-cyan font-semibold">high-performance computing</span>,
                <span className="text-jules-magenta font-semibold"> machine learning</span>, and
                <span className="text-jules-yellow font-semibold"> optimization algorithms</span>.
                Currently building the next generation of scientific computing platforms.
              </p>
            </div>
          </motion.section>

          {/* Interactive Experience Timeline */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2
              className="text-2xl md:text-3xl font-bold mb-8 text-center font-mono"
              style={{
                background:
                  'linear-gradient(90deg, hsl(var(--jules-magenta)), hsl(var(--jules-cyan)))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {'// Experience & Education'}
            </h2>
            <InteractiveTimeline />
          </motion.section>

          {/* Skills Radar Chart */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2
              className="text-2xl md:text-3xl font-bold mb-8 text-center font-mono"
              style={{
                background:
                  'linear-gradient(90deg, hsl(var(--jules-yellow)), hsl(var(--jules-green)))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {'// Technical Skills'}
            </h2>
            <SkillsRadarChart />
          </motion.section>

          {/* Skills Grid */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2
              className="text-2xl md:text-3xl font-bold mb-8 text-center font-mono"
              style={{
                background:
                  'linear-gradient(90deg, hsl(var(--jules-cyan)), hsl(var(--jules-magenta)))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {'// Skill Details'}
            </h2>
            <SkillsVisualization />
          </motion.section>

          {/* Testimonials */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2
              className="text-2xl md:text-3xl font-bold mb-8 text-center font-mono"
              style={{
                background:
                  'linear-gradient(90deg, hsl(var(--jules-orange)), hsl(var(--jules-yellow)))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {'// What People Say'}
            </h2>
            <TestimonialsCarousel />
          </motion.section>

          {/* Fun Quote */}
          <motion.div
            className="text-center p-6 rounded-xl border border-jules-green/20 bg-jules-green/5 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ boxShadow: '0 0 25px hsl(var(--jules-green) / 0.15)' }}
          >
            <Zap className="w-6 h-6 text-jules-green mx-auto mb-2" />
            <p className="text-sm text-jules-green font-mono">
              "I debug physics simulations for fun. Yes, I know that's weird."
            </p>
          </motion.div>
        </div>
      </main>
    </CyberpunkLayout>
  );
}
