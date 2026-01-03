// Public Platform Preview - Unauthenticated preview for platforms
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Zap,
  Atom,
  GitBranch,
  Filter,
  Palette,
  Play,
  Lock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getProject, getAllProjects } from '@/projects/config';
import { PublicHeader, SEO, QuantumBackground } from '@/components/shared';

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  simcore: Zap,
  qmlab: Atom,
  talai: GitBranch,
  optilibria: Filter,
  mezan: Palette,
};

const platformColors: Record<string, string> = {
  simcore: 'from-jules-cyan to-jules-purple',
  qmlab: 'from-jules-purple to-jules-magenta',
  talai: 'from-jules-cyan to-jules-purple',
  optilibria: 'from-jules-green to-jules-cyan',
  mezan: 'from-jules-yellow to-jules-magenta',
};

const PlatformPreview = () => {
  const { platformId } = useParams<{ platformId: string }>();
  const navigate = useNavigate();
  const project = platformId ? getProject(platformId) : null;
  const allProjects = getAllProjects();

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-jules-dark">
        <QuantumBackground variant="minimal" />
        <div className="text-center relative z-10">
          <h1 className="text-4xl font-bold mb-4">Platform Not Found</h1>
          <p className="text-muted-foreground mb-6">The requested platform doesn't exist.</p>
          <Button onClick={() => navigate('/studio/platforms')}>Back to Platforms</Button>
        </div>
      </div>
    );
  }

  const Icon = platformIcons[project.slug] || Zap;
  const colorGradient = platformColors[project.slug] || 'from-jules-cyan to-jules-purple';

  return (
    <div className="min-h-screen text-foreground">
      <SEO
        title={`${project.name} Preview`}
        description={project.description}
        keywords={[project.name, project.category, 'platform', 'preview']}
      />
      <QuantumBackground />
      <PublicHeader />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div
            className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${colorGradient} mb-6`}
            style={{ boxShadow: '0 0 40px hsl(var(--jules-cyan) / 0.3)' }}
          >
            <Icon className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className={`bg-gradient-to-r ${colorGradient} bg-clip-text text-transparent`}>
              {project.name}
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-2">{project.tagline}</p>
          <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto mb-8">
            {project.description}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className={`bg-gradient-to-r ${colorGradient} text-white border-0`}
            >
              <Play className="h-5 w-5 mr-2" />
              Get Started
            </Button>
            <Badge variant="secondary" className="px-4 py-2 font-mono">
              v{project.version} • {project.status}
            </Badge>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12 font-mono text-jules-cyan">
          {'// Key Features'}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {project.features.map((feature, i) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <Card className="h-full border-jules-border/50 bg-jules-surface/30 backdrop-blur hover:border-jules-cyan/50 transition-all">
                <CardContent className="p-6 flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 text-jules-green" />
                  <div>
                    <h3 className="font-semibold mb-1">{feature}</h3>
                    <p className="text-sm text-muted-foreground">
                      Powerful {feature.toLowerCase()} capabilities.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`max-w-3xl mx-auto text-center p-12 rounded-2xl bg-gradient-to-br ${colorGradient} relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10">
            <Sparkles className="h-10 w-10 mx-auto mb-4 text-white/90" />
            <h2 className="text-3xl font-bold text-white mb-4">Ready to explore {project.name}?</h2>
            <p className="text-white/80 mb-8">
              Sign in to access the full platform with all features.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/auth')}
                className="bg-white text-foreground hover:bg-white/90"
              >
                <Lock className="h-4 w-4 mr-2" />
                Sign In
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => navigate('/auth?mode=signup')}
                className="text-white hover:bg-white/10"
              >
                Create Account
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Other Platforms */}
      <section className="container mx-auto px-4 py-12 border-t border-jules-border/50">
        <h2 className="text-2xl font-bold text-center mb-8 font-mono">Explore Other Platforms</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {allProjects
            .filter((p) => p.slug !== project.slug)
            .slice(0, 4)
            .map((p) => {
              const PIcon = platformIcons[p.slug] || Zap;
              const pColor = platformColors[p.slug] || 'from-jules-cyan to-jules-purple';
              return (
                <Link key={p.slug} to={`/preview/${p.slug}`}>
                  <Card className="border-jules-border/50 bg-jules-surface/30 hover:border-jules-cyan/50 transition-all cursor-pointer group">
                    <CardContent className="p-4 text-center">
                      <div
                        className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${pColor} mb-2`}
                      >
                        <PIcon className="h-5 w-5 text-white" />
                      </div>
                      <p className="font-medium text-sm group-hover:text-jules-cyan transition-colors">
                        {p.name}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
        </div>
      </section>

      <footer className="border-t border-jules-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground font-mono">
          <p>
            &copy; {new Date().getFullYear()} {project.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PlatformPreview;
