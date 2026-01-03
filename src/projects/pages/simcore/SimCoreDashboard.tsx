// SimCore - Scientific Computing Platform Dashboard
import { motion } from 'framer-motion';
import { useThemeColors } from '@/context/ThemeContext';
import {
  Activity,
  Cpu,
  Database,
  GitBranch,
  Play,
  Settings,
  TrendingUp,
  Layers,
  Loader2,
  Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ProjectLayout } from '@/projects/components';
import { getProject } from '@/projects/config';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { RealTimeChart, SimulationControls, ParameterPanel } from './components';
import { useSimulations, useRealtimeSimulations } from '@/hooks';
import { ExportMenu } from '@/components/shared/ExportMenu';
import { DashboardHeader, StatsGrid, EmptyState, LoadingState } from '@/components/dashboard';
import { SEO } from '@/components/shared/SEO';
import { JsonLd, schemas } from '@/components/shared/JsonLd';

const SimCoreDashboard = () => {
  const project = getProject('simcore')!;
  const colors = useThemeColors();
  const { simulations, isLoading, createSimulation, deleteSimulation } = useSimulations();

  // Enable real-time updates
  useRealtimeSimulations();

  const stats = [
    {
      label: 'Active Simulations',
      value: simulations.filter((s) => s.status === 'running').length.toString(),
      icon: Activity,
      color: 'text-green-400',
    },
    { label: 'Compute Nodes', value: '48', icon: Cpu, color: 'text-blue-400' },
    { label: 'Data Processed', value: '2.4 TB', icon: Database, color: 'text-purple-400' },
    {
      label: 'Total Simulations',
      value: simulations.length.toString(),
      icon: GitBranch,
      color: 'text-cyan-400',
    },
  ];

  const handleNewSimulation = () => {
    createSimulation.mutate({
      name: `Simulation ${Date.now()}`,
      simulation_type: 'Fluid Dynamics',
      config: { timestep: 0.01, iterations: 1000 },
    });
  };

  return (
    <ProjectLayout project={project}>
      <SEO
        title="SimCore Dashboard"
        description="High-performance scientific simulation engine for complex computational models and physics simulations."
        keywords={['simulation', 'scientific computing', 'physics', 'computational modeling']}
      />
      <JsonLd schema={schemas.simcore} />
      <div className="p-6 space-y-6">
        <DashboardHeader
          title="SimCore Dashboard"
          subtitle="Scientific computing and simulation control center"
          actions={
            <>
              <ExportMenu
                data={simulations as unknown as Record<string, unknown>[]}
                filename={`simcore-simulations-${new Date().toISOString().split('T')[0]}`}
                type="simulation"
              />
              <ThemeSwitcher />
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
              <Button
                onClick={handleNewSimulation}
                disabled={createSimulation.isPending}
                style={{
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.tertiary} 100%)`,
                  color: colors.text,
                }}
              >
                {createSimulation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                New Simulation
              </Button>
            </>
          }
        />

        <StatsGrid stats={stats} />

        {/* Real-Time Charts */}
        <RealTimeChart />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Simulations */}
          <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" style={{ color: colors.primary }} />
                Your Simulations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <LoadingState />
              ) : simulations.length === 0 ? (
                <EmptyState
                  icon={Cpu}
                  title="No simulations yet"
                  description="Create a new simulation to get started"
                />
              ) : (
                simulations.slice(0, 5).map((sim) => (
                  <motion.div
                    key={sim.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            sim.status === 'running'
                              ? 'bg-green-400 animate-pulse'
                              : sim.status === 'completed'
                                ? 'bg-blue-400'
                                : 'bg-yellow-400'
                          }`}
                        />
                        <span className="font-medium">{sim.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            sim.status === 'running'
                              ? 'default'
                              : sim.status === 'completed'
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {sim.status || 'pending'}
                        </Badge>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => deleteSimulation.mutate(sim.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span>{sim.progress || 0}%</span>
                      </div>
                      <Progress value={sim.progress || 0} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                      <span>{sim.simulation_type}</span>
                      <Button size="sm" variant="ghost" className="h-7 px-2">
                        View Details
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Simulation Controls */}
          <SimulationControls />
        </div>

        {/* Parameter Panel & System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ParameterPanel />

          {/* System Health */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" style={{ color: colors.success }} />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'CPU Usage', value: 78 },
                { label: 'Memory', value: 64 },
                { label: 'Storage', value: 45 },
                { label: 'Network I/O', value: 60 },
                { label: 'GPU Utilization', value: 89 },
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">{metric.label}</span>
                    <span>{metric.value}%</span>
                  </div>
                  <Progress value={metric.value} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProjectLayout>
  );
};

export default SimCoreDashboard;
