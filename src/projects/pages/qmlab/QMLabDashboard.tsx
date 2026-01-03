// QMLab - Quantum Mechanics Laboratory Dashboard
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeColors } from '@/context/ThemeContext';
import {
  Atom,
  Activity,
  Waves,
  Play,
  Settings,
  Sparkles,
  Zap,
  Eye,
  FlaskConical,
  Box,
  Loader2,
  Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProjectLayout } from '@/projects/components';
import { getProject } from '@/projects/config';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { ParticleVisualization, WaveFunctionDisplay } from './components';
import { useQMExperiments, useRealtimeExperiments } from '@/hooks';
import { ExportMenu } from '@/components/shared/ExportMenu';
import { DashboardHeader, EmptyState, LoadingState } from '@/components/dashboard';
import { SEO } from '@/components/shared/SEO';
import { JsonLd, schemas } from '@/components/shared/JsonLd';

const quantumSystems = [
  { id: 'harmonic', name: 'Harmonic Oscillator', type: 'Continuous', energy: 'ℏω(n+½)' },
  { id: 'infinite-well', name: 'Particle in Box', type: 'Infinite Well', energy: 'n²π²ℏ²/2mL²' },
  { id: 'hydrogen', name: 'Hydrogen Atom', type: 'Bound State', energy: '-13.6 eV' },
  { id: 'tunneling', name: 'Tunneling Barrier', type: 'Scattering', energy: 'E < V₀' },
];

const QMLabDashboard = () => {
  const project = getProject('qmlab')!;
  const colors = useThemeColors();
  const [activeVisualization, setActiveVisualization] = useState<
    'wave' | 'orbital' | 'interference'
  >('wave');
  const [selectedSystem, setSelectedSystem] = useState<string>('harmonic');
  const { experiments, isLoading, createExperiment, deleteExperiment } = useQMExperiments();

  // Enable real-time updates
  useRealtimeExperiments('qmlab_experiments');

  const stats = [
    { label: 'Quantum States', value: '∞', icon: Waves, color: 'from-cyan-500 to-blue-500' },
    {
      label: 'Simulations',
      value: experiments.length.toString(),
      icon: Activity,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Active Experiments',
      value: experiments.filter((e) => e.status === 'running').length.toString(),
      icon: FlaskConical,
      color: 'from-green-500 to-emerald-500',
    },
    { label: 'Visualizations', value: '156', icon: Eye, color: 'from-orange-500 to-yellow-500' },
  ];

  const handleNewExperiment = () => {
    createExperiment.mutate({
      name: `Experiment ${Date.now()}`,
      quantum_system: selectedSystem,
      particle_count: 100,
    });
  };

  return (
    <ProjectLayout project={project}>
      <div className="p-6 space-y-6">
        <DashboardHeader
          title="QMLab Laboratory"
          subtitle="Interactive quantum mechanics simulation environment"
          actions={
            <>
              <ExportMenu
                data={experiments as unknown as Record<string, unknown>[]}
                filename={`qmlab-experiments-${new Date().toISOString().split('T')[0]}`}
                type="qm-experiment"
              />
              <ThemeSwitcher />
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button
                onClick={handleNewExperiment}
                disabled={createExperiment.isPending}
                style={{
                  background: `linear-gradient(135deg, ${colors.tertiary} 0%, ${colors.primary} 100%)`,
                  color: colors.text,
                }}
              >
                {createExperiment.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                New Experiment
              </Button>
            </>
          }
        />

        {/* Stats Grid - Custom for gradient backgrounds */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-border/50 bg-card/50 backdrop-blur overflow-hidden">
                <CardContent className="p-6 relative">
                  <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${stat.color}`} />
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold font-mono mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quantum Systems */}
          <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Atom className="h-5 w-5 text-cyan-400" />
                Quantum Systems
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quantumSystems.map((system, i) => (
                  <motion.div
                    key={system.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setSelectedSystem(system.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedSystem === system.id
                        ? 'bg-cyan-500/10 border-cyan-500/30 hover:border-cyan-500/50'
                        : 'bg-muted/30 border-border/50 hover:border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            selectedSystem === system.id ? 'bg-cyan-500/20' : 'bg-muted/50'
                          }`}
                        >
                          <Atom
                            className={`h-5 w-5 ${selectedSystem === system.id ? 'text-cyan-400' : 'text-muted-foreground'}`}
                          />
                        </div>
                        <div>
                          <p className="font-medium">{system.name}</p>
                          <p className="text-xs text-muted-foreground">{system.type}</p>
                        </div>
                      </div>
                      {selectedSystem === system.id && (
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      )}
                    </div>
                    <div className="p-2 rounded-lg bg-background/50 font-mono text-sm text-center">
                      E = {system.energy}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Experiments */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-purple-400" />
                Your Experiments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <LoadingState />
              ) : experiments.length === 0 ? (
                <EmptyState
                  icon={Atom}
                  title="No experiments yet"
                  description="Create a new experiment to get started"
                />
              ) : (
                experiments.slice(0, 4).map((exp, i) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl bg-muted/30 border border-border/50 group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{exp.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            exp.status === 'running'
                              ? 'default'
                              : exp.status === 'completed'
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {exp.status || 'pending'}
                        </Badge>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteExperiment.mutate(exp.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 rounded bg-muted/50">
                        <span className="text-muted-foreground">System: </span>
                        <span className="font-mono">{exp.quantum_system}</span>
                      </div>
                      <div className="p-2 rounded bg-muted/50">
                        <span className="text-muted-foreground">Particles: </span>
                        <span className="font-mono">{exp.particle_count || 0}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
              <Button variant="outline" className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Run New Experiment
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Visualization Section */}
        <Card className="border-border/50 bg-card/50 backdrop-blur overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-400" />
                Quantum Visualization Lab
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setActiveVisualization('wave')}
                  className={activeVisualization === 'wave' ? 'bg-cyan-500/20 text-cyan-400' : ''}
                >
                  Wave
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setActiveVisualization('orbital')}
                  className={
                    activeVisualization === 'orbital' ? 'bg-purple-500/20 text-purple-400' : ''
                  }
                >
                  Orbital
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setActiveVisualization('interference')}
                  className={
                    activeVisualization === 'interference' ? 'bg-pink-500/20 text-pink-400' : ''
                  }
                >
                  Interference
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="h-64">
                <ParticleVisualization
                  type={activeVisualization}
                  particleCount={activeVisualization === 'interference' ? 30 : 50}
                />
              </div>
              <WaveFunctionDisplay
                systemType={selectedSystem as 'harmonic' | 'infinite-well' | 'hydrogen'}
                quantumNumber={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Experiment Controls */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-orange-400" />
              Experiment Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="systems" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="systems">Systems</TabsTrigger>
                <TabsTrigger value="parameters">Parameters</TabsTrigger>
                <TabsTrigger value="measurements">Measurements</TabsTrigger>
              </TabsList>
              <TabsContent value="systems" className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: 'harmonic', name: 'Harmonic Oscillator', icon: Waves },
                    { id: 'infinite-well', name: 'Infinite Well', icon: Box },
                    { id: 'hydrogen', name: 'Hydrogen Atom', icon: Atom },
                    { id: 'tunneling', name: 'Tunneling', icon: Zap },
                  ].map((sys) => (
                    <motion.button
                      key={sys.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedSystem(sys.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedSystem === sys.id
                          ? 'bg-cyan-500/20 border-cyan-500/50'
                          : 'bg-muted/30 border-border/50 hover:border-cyan-500/30'
                      }`}
                    >
                      <sys.icon
                        className={`h-5 w-5 mb-2 ${selectedSystem === sys.id ? 'text-cyan-400' : 'text-muted-foreground'}`}
                      />
                      <p className="text-sm font-medium">{sys.name}</p>
                    </motion.button>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="parameters" className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                    <p className="text-sm text-muted-foreground mb-2">Particle Mass</p>
                    <p className="text-2xl font-mono text-cyan-400">9.109 × 10⁻³¹ kg</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                    <p className="text-sm text-muted-foreground mb-2">Planck Constant</p>
                    <p className="text-2xl font-mono text-purple-400">6.626 × 10⁻³⁴ J·s</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="measurements" className="mt-4">
                <EmptyState
                  icon={Activity}
                  title="Select a system and run an experiment to see measurements"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ProjectLayout>
  );
};

export default QMLabDashboard;
