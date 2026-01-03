// Platforms Hub - Grouped by Company with Cyberpunk aesthetic
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PreloadLink } from '@/components/shared/PreloadLink';
import {
  ArrowRight,
  Zap,
  GitBranch,
  Filter,
  Box,
  Palette,
  Code2,
  Eye,
  Lock,
  Building2,
  Rocket,
  Heart,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageLayout, HubHeader } from '@/components/shared';

interface Platform {
  id: string;
  name: string;
  tagline: string;
  description: string;
  status: 'active' | 'beta' | 'development' | 'coming-soon';
  company: 'scientific' | 'repz' | 'liveit' | 'personal';
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  glowColor: string;
  route?: string;
}

const platforms: Platform[] = [
  // Scientific Computing & AI
  {
    id: 'simcore',
    name: 'SimCore',
    tagline: 'Scientific Computing Engine',
    description:
      'Real-time simulation platform for physics, chemistry, and engineering. Because spreadsheets are for accountants.',
    status: 'active',
    company: 'scientific',
    icon: Zap,
    gradient: 'from-jules-cyan to-jules-purple',
    glowColor: 'jules-cyan',
    route: '/projects/simcore',
  },
  {
    id: 'qmlab',
    name: 'QMLab',
    tagline: 'Quantum Mechanics Laboratory',
    description:
      'Wave function visualizations and quantum state experiments. Schrödinger approved (probably).',
    status: 'beta',
    company: 'scientific',
    icon: Box,
    gradient: 'from-jules-purple to-jules-magenta',
    glowColor: 'jules-purple',
    route: '/projects/qmlab',
  },
  {
    id: 'optilibria',
    name: 'OptiLibria',
    tagline: 'Optimization Algorithms',
    description:
      "Performance metrics and convergence visualizations. Finding the best solution so you don't have to.",
    status: 'active',
    company: 'scientific',
    icon: Filter,
    gradient: 'from-jules-green to-jules-cyan',
    glowColor: 'jules-green',
    route: '/projects/optilibria',
  },
  {
    id: 'talai',
    name: 'TalAI',
    tagline: 'AI Research Platform',
    description:
      'Model dashboards, neural network visualizers, and experiment tracking. Teaching machines to think (responsibly).',
    status: 'beta',
    company: 'scientific',
    icon: GitBranch,
    gradient: 'from-jules-cyan to-jules-purple',
    glowColor: 'jules-cyan',
    route: '/projects/talai',
  },
  // REPZ LLC
  {
    id: 'repz-core',
    name: 'REPZ Core',
    tagline: 'Fitness Intelligence',
    description: 'AI-powered workout tracking and performance analytics. Your gains, quantified.',
    status: 'coming-soon',
    company: 'repz',
    icon: Sparkles,
    gradient: 'from-jules-magenta to-jules-yellow',
    glowColor: 'jules-magenta',
  },
  // Live It Iconic LLC
  {
    id: 'iconic-hub',
    name: 'Iconic Hub',
    tagline: 'Lifestyle Platform',
    description:
      'Curated experiences and lifestyle management. Living iconically, one day at a time.',
    status: 'coming-soon',
    company: 'liveit',
    icon: Heart,
    gradient: 'from-jules-yellow to-jules-magenta',
    glowColor: 'jules-yellow',
  },
  // Personal/Other
  {
    id: 'mezan',
    name: 'MEZAN',
    tagline: 'Arabic Design System',
    description:
      'RTL layout with geometric patterns and calligraphic elegance. Where tradition meets technology.',
    status: 'development',
    company: 'personal',
    icon: Palette,
    gradient: 'from-jules-yellow to-jules-magenta',
    glowColor: 'jules-yellow',
    route: '/projects/mezan',
  },
  {
    id: 'llmworks',
    name: 'LLMWorks',
    tagline: 'Language Model Workspace',
    description: 'Prompt engineering and model comparison tools. Whispering to AI, professionally.',
    status: 'development',
    company: 'personal',
    icon: Code2,
    gradient: 'from-jules-purple to-jules-cyan',
    glowColor: 'jules-purple',
  },
];

const companies = {
  scientific: {
    name: 'Scientific Computing & AI',
    icon: Building2,
    color: 'jules-cyan',
    tagline: 'Research Tools & Simulation Platforms',
  },
  repz: {
    name: 'REPZ LLC',
    icon: Rocket,
    color: 'jules-magenta',
    tagline: 'Fitness Technology',
  },
  liveit: {
    name: 'Live It Iconic LLC',
    icon: Heart,
    color: 'jules-yellow',
    tagline: 'Lifestyle & Experiences',
  },
  personal: {
    name: 'Side Quests',
    icon: Sparkles,
    color: 'jules-purple',
    tagline: 'Passion Projects & Experiments',
  },
};

const statusConfig = {
  active: { label: 'Live', color: 'text-jules-green border-jules-green/30 bg-jules-green/10' },
  beta: { label: 'Beta', color: 'text-jules-cyan border-jules-cyan/30 bg-jules-cyan/10' },
  development: {
    label: 'In Dev',
    color: 'text-jules-yellow border-jules-yellow/30 bg-jules-yellow/10',
  },
  'coming-soon': { label: 'Soon™', color: 'text-muted-foreground border-border/30 bg-muted/10' },
};

const PlatformsHub = () => {
  const navigate = useNavigate();

  const groupedPlatforms = Object.entries(companies)
    .map(([key, company]) => ({
      key,
      company,
      platforms: platforms.filter((p) => p.company === key),
    }))
    .filter((group) => group.platforms.length > 0);

  return (
    <PageLayout
      title="Platforms"
      description="Software platforms and tools developed across multiple ventures. Scientific computing, AI, fitness tech, and more."
      keywords={['platforms', 'software', 'scientific computing', 'AI', 'REPZ', 'Live It Iconic']}
    >
      {/* Header */}
      <HubHeader
        title="Platforms"
        description="// Software that solves real problems. Sometimes even the ones you didn't know you had."
        primaryColor="cyan"
        secondaryColor="magenta"
        className="mb-16"
      />

      {/* Platforms by Company */}
      {groupedPlatforms.map((group, groupIndex) => {
        const CompanyIcon = group.company.icon;

        return (
          <motion.div
            key={group.key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 * (groupIndex + 1), duration: 0.6 }}
            className="mb-16"
          >
            {/* Company Header */}
            <div className="flex items-center gap-4 mb-8">
              <div
                className={`p-3 rounded-xl bg-${group.company.color}/10 border border-${group.company.color}/30`}
                style={{ boxShadow: `0 0 20px hsl(var(--${group.company.color}) / 0.2)` }}
              >
                <CompanyIcon className={`w-6 h-6 text-${group.company.color}`} />
              </div>
              <div>
                <h2
                  className={`text-2xl font-bold font-mono text-${group.company.color}`}
                  style={{ textShadow: `0 0 20px hsl(var(--${group.company.color}) / 0.3)` }}
                >
                  {group.company.name}
                </h2>
                <p className="text-sm text-muted-foreground">{group.company.tagline}</p>
              </div>
            </div>

            {/* Platforms Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.platforms.map((platform, index) => {
                const Icon = platform.icon;
                const status = statusConfig[platform.status];

                return (
                  <motion.div
                    key={platform.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index, duration: 0.6 }}
                  >
                    <Card
                      className={`h-full flex flex-col relative overflow-hidden border-jules-border/50 bg-jules-surface/30 backdrop-blur-xl transition-all duration-500 group ${
                        platform.route ? 'hover:border-jules-cyan/50 cursor-pointer' : 'opacity-70'
                      }`}
                      onClick={() => platform.route && navigate(platform.route)}
                    >
                      {/* Cyberpunk grid overlay */}
                      <div
                        className="absolute inset-0 opacity-5 pointer-events-none"
                        style={{
                          backgroundImage: `
                            linear-gradient(hsl(var(--${platform.glowColor})) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(var(--${platform.glowColor})) 1px, transparent 1px)
                          `,
                          backgroundSize: '20px 20px',
                        }}
                      />

                      {/* Glow effect on hover */}
                      {platform.route && (
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                          style={{
                            background: `radial-gradient(circle at 50% 0%, hsl(var(--${platform.glowColor}) / 0.2) 0%, transparent 60%)`,
                          }}
                        />
                      )}

                      <CardHeader className="relative">
                        <div className="flex items-start justify-between mb-3">
                          <motion.div
                            className={`p-3 rounded-xl bg-gradient-to-br ${platform.gradient}`}
                            whileHover={platform.route ? { rotate: 5, scale: 1.05 } : {}}
                            style={{
                              boxShadow: `0 0 20px hsl(var(--${platform.glowColor}) / 0.4)`,
                            }}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </motion.div>
                          <Badge variant="outline" className={`font-mono text-xs ${status.color}`}>
                            {status.label}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl font-bold">{platform.name}</CardTitle>
                        <CardDescription
                          className={`text-xs font-mono text-${platform.glowColor}/70`}
                        >
                          {platform.tagline}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="flex-grow flex flex-col justify-between relative">
                        <p className="text-sm text-muted-foreground mb-4">{platform.description}</p>

                        <div className="flex items-center gap-3">
                          {platform.route ? (
                            <>
                              <div
                                className={`flex items-center gap-2 text-sm text-${platform.glowColor} group-hover:gap-3 transition-all font-mono`}
                              >
                                Launch <ArrowRight className="w-4 h-4" />
                              </div>
                              <PreloadLink
                                to={`/preview/${platform.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                Preview
                              </PreloadLink>
                            </>
                          ) : (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                              <Lock className="w-4 h-4" />
                              {platform.status === 'coming-soon'
                                ? 'Coming Soon™'
                                : 'In Development'}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );
      })}

      {/* Fun Footer Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="bg-jules-surface/30 border border-jules-cyan/20 rounded-xl p-8 text-center backdrop-blur-xl"
      >
        <p className="text-muted-foreground font-mono text-sm mb-2">
          {
            '// Fun fact: All these platforms were built while consuming dangerous amounts of coffee ☕'
          }
        </p>
        <p className="text-xs text-muted-foreground">
          Click on any available platform to explore. Locked ones are still being forged in the code
          mines.
        </p>
      </motion.div>
    </PageLayout>
  );
};

export default PlatformsHub;
