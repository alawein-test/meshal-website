// OptiLibria - Optimization Framework Dashboard
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeColors } from '@/context/ThemeContext';
import {
  Activity,
  GitBranch,
  TrendingUp,
  Zap,
  Target,
  BarChart3,
  Layers,
  ArrowRight,
  Plus,
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
import { ConvergenceChart, ParameterControls } from './components';
import { useOptimizationRuns, useRealtimeOptimizationRuns } from '@/hooks';
import { ExportMenu } from '@/components/shared/ExportMenu';
import { DashboardHeader, StatsGrid, EmptyState, LoadingState } from '@/components/dashboard';
import { SEO } from '@/components/shared/SEO';
import { JsonLd, schemas } from '@/components/shared/JsonLd';

const algorithms = [
  { name: 'Genetic Algorithm', category: 'Evolutionary', id: 'genetic' },
  { name: 'Simulated Annealing', category: 'Metaheuristic', id: 'annealing' },
  { name: 'Particle Swarm', category: 'Swarm', id: 'pso' },
  { name: 'Gradient Descent', category: 'Classical', id: 'gradient' },
];

const benchmarks = [
  { name: 'Rosenbrock Function', best: 'Adam', score: 99.8, runs: 1000 },
  { name: 'Rastrigin Function', best: 'PSO', score: 97.2, runs: 850 },
  { name: 'Ackley Function', best: 'GA', score: 95.5, runs: 1200 },
  { name: 'Schwefel Function', best: 'SA', score: 94.1, runs: 780 },
];

const OptiLibriaDashboard = () => {
  const project = getProject('optilibria')!;
  const colors = useThemeColors();
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('genetic');
  const { runs, isLoading, createRun, deleteRun } = useOptimizationRuns();

  // Enable real-time updates
  useRealtimeOptimizationRuns();

  const stats = [
    { label: 'Algorithms', value: '31', icon: GitBranch, color: 'text-green-400' },
    {
      label: 'Problems Solved',
      value: runs.length > 0 ? runs.length.toString() : '0',
      icon: Target,
      color: 'text-blue-400',
    },
    {
      label: 'Benchmark Runs',
      value: runs.filter((r) => r.status === 'completed').length.toString(),
      icon: Activity,
      color: 'text-purple-400',
    },
    { label: 'Avg Performance', value: '94.7%', icon: TrendingUp, color: 'text-cyan-400' },
  ];

  const handleNewRun = () => {
    createRun.mutate({
      problem_name: 'Rosenbrock Function',
      algorithm: selectedAlgorithm,
      config: { iterations: 100 },
    });
  };

  return (
    <ProjectLayout project={project}>
      <div className="p-6 space-y-6">
        <DashboardHeader
          title="OptiLibria Dashboard"
          subtitle="Optimization framework with 31+ algorithms"
          actions={
            <>
              <ExportMenu
                data={runs as unknown as Record<string, unknown>[]}
                filename={`optilibria-runs-${new Date().toISOString().split('T')[0]}`}
                type="optimization-run"
              />
              <ThemeSwitcher />
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Benchmarks
              </Button>
              <Button
                onClick={handleNewRun}
                disabled={createRun.isPending}
                style={{
                  background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.primary} 100%)`,
                  color: colors.text,
                }}
              >
                {createRun.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                New Problem
              </Button>
            </>
          }
        />

        <StatsGrid stats={stats} />

        {/* Convergence Chart */}
        <ConvergenceChart algorithm={selectedAlgorithm} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Algorithm Library */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-green-400" />
                  Algorithm Library
                </CardTitle>
                <Button variant="ghost" size="sm">
                  View All 31
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {algorithms.map((algo, i) => (
                  <motion.div
                    key={algo.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedAlgorithm(algo.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all group cursor-pointer ${
                      selectedAlgorithm === algo.id
                        ? 'bg-green-500/20 border-green-500/50'
                        : 'bg-muted/30 border-border/50 hover:border-green-500/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <Zap className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{algo.name}</p>
                        <p className="text-xs text-muted-foreground">{algo.category}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Parameter Controls */}
          <ParameterControls algorithm={selectedAlgorithm} />
        </div>

        {/* Benchmark Results & Recent Runs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Benchmark Results */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  Benchmark Results
                </CardTitle>
                <Button variant="ghost" size="sm">
                  Run Suite
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {benchmarks.map((bench, i) => (
                  <motion.div
                    key={bench.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl bg-muted/30 border border-border/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium">{bench.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {bench.runs.toLocaleString()} runs
                        </p>
                      </div>
                      <Badge variant="outline" className="text-green-400 border-green-500/30">
                        Best: {bench.best}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Performance</span>
                        <span className="font-mono">{bench.score}%</span>
                      </div>
                      <Progress value={bench.score} className="h-2" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Optimization Runs */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-400" />
                Your Optimization Runs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <LoadingState />
              ) : runs.length === 0 ? (
                <EmptyState
                  icon={Target}
                  title="No optimization runs yet"
                  description="Start a new problem to see results here"
                />
              ) : (
                <div className="space-y-3">
                  {runs.slice(0, 5).map((run, i) => (
                    <motion.div
                      key={run.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-3 rounded-xl bg-muted/30 border border-border/50 group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{run.problem_name}</p>
                          <p className="text-xs text-muted-foreground">{run.algorithm}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <Badge variant={run.status === 'completed' ? 'secondary' : 'outline'}>
                              {run.status || 'pending'}
                            </Badge>
                            {run.best_score && (
                              <p className="text-xs text-green-400 mt-1">Score: {run.best_score}</p>
                            )}
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => deleteRun.mutate(run.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProjectLayout>
  );
};

export default OptiLibriaDashboard;
