import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Palette, Boxes, ArrowRight, Sparkles, Layout, Code, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageLayout, HubHeader } from '@/components/shared';
import { NeonCard } from '@/components/ui/neon-card';

const StudioSelector = () => {
  const navigate = useNavigate();

  const studios = [
    {
      id: 'templates',
      title: 'Templates Studio',
      description:
        'Generic, reusable design templates and components. Explore UI patterns, layouts, animations, and design systems.',
      icon: Palette,
      color: 'cyan' as const,
      route: '/studio/templates',
      stats: { count: 14, label: 'templates' },
      features: ['Dashboard', 'Landing', 'E-commerce', 'Blog', 'CRM'],
    },
    {
      id: 'platforms',
      title: 'Platforms Studio',
      description:
        'Concrete, functional projects and applications. Discover full-featured platforms with real capabilities.',
      icon: Boxes,
      color: 'magenta' as const,
      route: '/platforms',
      stats: { count: 5, label: 'platforms' },
      features: ['SimCore', 'QMLab', 'TalAI', 'MEZAN', 'OptiLibria'],
    },
  ];

  return (
    <PageLayout
      title="Studio Hub"
      description="Explore design templates and functional platforms. Build with reusable components and full-featured applications."
      keywords={['design studio', 'templates', 'platforms', 'UI components', 'React']}
      containerClassName="pt-28 pb-20 max-w-6xl"
    >
      <HubHeader
        title="Studio Hub"
        description="Choose your exploration path: dive into reusable templates or discover fully-featured platforms."
        primaryColor="cyan"
        secondaryColor="purple"
        align="center"
        size="large"
        badge={
          <>
            <Sparkles className="h-4 w-4 text-jules-cyan" />
            <span className="text-sm font-mono text-jules-cyan">Design & Build</span>
          </>
        }
        className="mb-20"
      />

      {/* Studios Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-20">
        {studios.map((studio, index) => {
          const Icon = studio.icon;
          return (
            <motion.div
              key={studio.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
            >
              <NeonCard color={studio.color} className="h-full cursor-pointer" glow>
                <div onClick={() => navigate(studio.route)} className="h-full">
                  <div className="flex items-start justify-between mb-6">
                    <motion.div
                      className="w-16 h-16 rounded-xl p-4 flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, hsl(var(--jules-${studio.color})) 0%, hsl(var(--jules-purple)) 100%)`,
                        boxShadow: `0 0 30px hsl(var(--jules-${studio.color}) / 0.4)`,
                      }}
                      whileHover={{ rotate: 5, scale: 1.05 }}
                    >
                      <Icon className="w-full h-full text-jules-dark" />
                    </motion.div>
                    <Badge
                      variant="outline"
                      className="font-mono text-xs"
                      style={{
                        borderColor: `hsl(var(--jules-${studio.color}) / 0.4)`,
                        color: `hsl(var(--jules-${studio.color}))`,
                      }}
                    >
                      {studio.stats.count} {studio.stats.label}
                    </Badge>
                  </div>

                  <h2 className="text-2xl font-bold mb-3">{studio.title}</h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{studio.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {studio.features.slice(0, 4).map((feature) => (
                      <Badge
                        key={feature}
                        variant="secondary"
                        className="text-xs font-mono bg-jules-surface/50 border border-jules-border/50"
                      >
                        {feature}
                      </Badge>
                    ))}
                    {studio.features.length > 4 && (
                      <Badge
                        variant="secondary"
                        className="text-xs font-mono bg-jules-surface/50 border border-jules-border/50"
                      >
                        +{studio.features.length - 4} more
                      </Badge>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    className="w-full justify-between font-mono hover:bg-transparent group"
                    style={{ color: `hsl(var(--jules-${studio.color}))` }}
                  >
                    Explore {studio.title.split(' ')[0]}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </div>
              </NeonCard>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { icon: Layout, value: '14', label: 'Templates', color: 'cyan' },
          { icon: Boxes, value: '5', label: 'Platforms', color: 'magenta' },
          { icon: Code, value: '100+', label: 'Components', color: 'yellow' },
          { icon: Cpu, value: '7', label: 'Themes', color: 'green' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.02, y: -4 }}
            className="text-center p-6 rounded-xl bg-jules-surface/30 border border-jules-border/50 backdrop-blur"
          >
            <stat.icon
              className="h-6 w-6 mx-auto mb-3"
              style={{
                color: `hsl(var(--jules-${stat.color}))`,
                filter: `drop-shadow(0 0 10px hsl(var(--jules-${stat.color})))`,
              }}
            />
            <div
              className="text-3xl font-bold font-display mb-1"
              style={{
                color: `hsl(var(--jules-${stat.color}))`,
                textShadow: `0 0 20px hsl(var(--jules-${stat.color}) / 0.5)`,
              }}
            >
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground font-mono">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="text-center mt-16"
      >
        <p className="text-sm font-mono text-muted-foreground">
          <span className="text-jules-green">// </span>
          All platforms and templates are locally hosted and fully interactive.
        </p>
      </motion.div>
    </PageLayout>
  );
};

export default StudioSelector;
