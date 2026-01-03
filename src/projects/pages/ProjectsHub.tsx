// Projects Hub - Central navigation for all platforms (Enhanced)
import { motion, AnimatePresence } from 'framer-motion';
import { PreloadLink } from '@/components/shared/PreloadLink';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Sparkles,
  GitBranch,
  Boxes,
  Zap,
  BarChart3,
  SlidersHorizontal,
  X,
  Eye,
  LayoutGrid,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { getAllProjects } from '../config';
import { ProjectCard } from '../components';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { AggregateStatsChart } from '@/components/charts/AggregateStatsChart';
import { useSimulations } from '@/hooks/useSimulations';
import { useQMExperiments, useTalAIExperiments } from '@/hooks/useExperiments';
import { useWorkflows } from '@/hooks/useWorkflows';
import { useOptimizationRuns } from '@/hooks/useOptimizationRuns';
import { PageLayout, HubHeader } from '@/components/shared';

const categories = [
  { id: 'all', label: 'All Projects', icon: Boxes, color: 'primary' },
  { id: 'scientific-computing', label: 'Scientific', icon: Sparkles, color: 'jules-cyan' },
  { id: 'enterprise-automation', label: 'Enterprise', icon: Zap, color: 'jules-magenta' },
  { id: 'ai-research', label: 'AI Research', icon: GitBranch, color: 'jules-yellow' },
  { id: 'optimization', label: 'Optimization', icon: Filter, color: 'jules-green' },
  { id: 'quantum-mechanics', label: 'Quantum', icon: Grid3X3, color: 'jules-purple' },
];

const statusFilters = ['all', 'active', 'development', 'beta'] as const;

const ProjectsHub = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStatus, setActiveStatus] = useState<(typeof statusFilters)[number]>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCharts, setShowCharts] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const allProjects = getAllProjects();

  // Fetch real data from database
  const { simulations } = useSimulations();
  const { experiments: qmExperiments } = useQMExperiments();
  const { experiments: talExperiments } = useTalAIExperiments();
  const { workflows } = useWorkflows();
  const { runs: optRuns } = useOptimizationRuns();

  const platformStats = useMemo(
    () => [
      {
        name: 'SimCore',
        simulations: simulations?.length || 0,
        experiments: 0,
        workflows: 0,
        runs: 0,
      },
      {
        name: 'QMLab',
        simulations: 0,
        experiments: qmExperiments?.length || 0,
        workflows: 0,
        runs: 0,
      },
      {
        name: 'TalAI',
        simulations: 0,
        experiments: talExperiments?.length || 0,
        workflows: 0,
        runs: 0,
      },
      { name: 'MEZAN', simulations: 0, experiments: 0, workflows: workflows?.length || 0, runs: 0 },
      {
        name: 'OptiLibria',
        simulations: 0,
        experiments: 0,
        workflows: 0,
        runs: optRuns?.length || 0,
      },
    ],
    [simulations, qmExperiments, talExperiments, workflows, optRuns]
  );

  const filteredProjects = allProjects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase()) ||
      project.features.some((f) => f.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = activeCategory === 'all' || project.category === activeCategory;
    const matchesStatus = activeStatus === 'all' || project.status === activeStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const activeFiltersCount = (activeCategory !== 'all' ? 1 : 0) + (activeStatus !== 'all' ? 1 : 0);

  return (
    <PageLayout
      title="Project Hub"
      description="Explore all platforms and projects. Scientific computing, AI research, enterprise automation, and more."
      keywords={['projects', 'platforms', 'scientific computing', 'AI', 'simulations']}
    >
      {/* Header */}
      <HubHeader
        title="Project Hub"
        description="Explore all platforms and projects across scientific computing, AI research, enterprise automation, and more."
        icon={LayoutGrid}
        primaryColor="cyan"
        secondaryColor="purple"
      />

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex items-center gap-6 mb-6 text-sm font-mono"
      >
        <div className="flex items-center gap-2 text-jules-green">
          <Eye className="w-4 h-4" />
          <span>{allProjects.filter((p) => p.status === 'active').length} Active</span>
        </div>
        <div className="flex items-center gap-2 text-jules-cyan">
          <Zap className="w-4 h-4" />
          <span>{allProjects.filter((p) => p.status === 'beta').length} Beta</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>{allProjects.filter((p) => p.status === 'development').length} In Development</span>
        </div>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex flex-wrap items-center justify-between gap-4 mb-6"
      >
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-jules-surface/30 border-jules-border/50"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'font-mono border-jules-border/50',
              showFilters && 'bg-jules-cyan/20 border-jules-cyan/50 text-jules-cyan'
            )}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-2 w-5 h-5 rounded-full bg-jules-cyan text-jules-dark text-xs flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className={cn(
              'font-mono border-jules-border/50',
              showCharts && 'bg-jules-cyan/20 border-jules-cyan/50 text-jules-cyan'
            )}
            onClick={() => setShowCharts(!showCharts)}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Charts
          </Button>

          <div className="flex border border-jules-border/50 rounded-lg bg-jules-surface/30">
            <Button
              variant="ghost"
              size="icon"
              className={cn(viewMode === 'grid' && 'bg-jules-cyan/20 text-jules-cyan')}
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(viewMode === 'list' && 'bg-jules-cyan/20 text-jules-cyan')}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Filters panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="p-4 rounded-xl bg-jules-surface/30 border border-jules-border/50 backdrop-blur-xl">
              {/* Category Filter */}
              <div className="mb-4">
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block font-mono">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <Button
                        key={cat.id}
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveCategory(cat.id)}
                        className={cn(
                          'font-mono transition-all',
                          activeCategory === cat.id
                            ? 'bg-jules-cyan/20 border-jules-cyan/50 text-jules-cyan'
                            : 'border-jules-border/50 text-muted-foreground hover:border-jules-cyan/30 hover:text-jules-cyan'
                        )}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {cat.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block font-mono">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {statusFilters.map((status) => (
                    <Button
                      key={status}
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveStatus(status)}
                      className={cn(
                        'font-mono capitalize transition-all',
                        activeStatus === status
                          ? 'bg-jules-cyan/20 border-jules-cyan/50 text-jules-cyan'
                          : 'border-jules-border/50 text-muted-foreground hover:border-jules-cyan/30 hover:text-jules-cyan'
                      )}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aggregate Stats Charts */}
      <AnimatePresence>
        {showCharts && (
          <motion.div
            className="mb-8"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <AggregateStatsChart stats={platformStats} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-jules-surface/50 flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
          <Button
            variant="outline"
            className="border-jules-cyan/50 text-jules-cyan hover:bg-jules-cyan/10"
            onClick={() => {
              setSearch('');
              setActiveCategory('all');
              setActiveStatus('all');
            }}
          >
            Clear all filters
          </Button>
        </motion.div>
      ) : (
        <motion.div
          className={cn(
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          )}
          layout
          role="list"
          aria-label="Projects list"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <ProjectCard project={project} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Stats Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { value: allProjects.length, label: 'Platforms', color: 'cyan' },
          {
            value: allProjects.reduce((acc, p) => acc + p.features.length, 0),
            label: 'Features',
            color: 'magenta',
          },
          {
            value: allProjects.reduce((acc, p) => acc + p.routes.length, 0),
            label: 'Routes',
            color: 'yellow',
          },
          {
            value: allProjects.filter((p) => p.status === 'active').length,
            label: 'Active',
            color: 'green',
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.02, y: -4 }}
            className="text-center p-6 rounded-xl bg-jules-surface/30 border border-jules-border/50 backdrop-blur"
          >
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
    </PageLayout>
  );
};

export default ProjectsHub;
