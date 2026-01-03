// TalAI - AI Research Platform Dashboard
import { motion } from 'framer-motion';
import { useThemeColors } from '@/context/ThemeContext';
import {
  Brain,
  Activity,
  Database,
  Sparkles,
  Layers,
  Upload,
  Download,
  Cpu,
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
import { TrainingChart, HyperparameterControls } from './components';
import { useTalAIExperiments, useRealtimeExperiments } from '@/hooks';
import { ExportMenu } from '@/components/shared/ExportMenu';
import { DashboardHeader, EmptyState, LoadingState } from '@/components/dashboard';
import { SEO } from '@/components/shared/SEO';
import { JsonLd, schemas } from '@/components/shared/JsonLd';

const models = [
  { name: 'talai-vision-v2', version: '2.1.0', downloads: 12450, rating: 4.8 },
  { name: 'talai-nlp-base', version: '1.5.2', downloads: 8920, rating: 4.6 },
  { name: 'talai-classifier', version: '3.0.1', downloads: 5670, rating: 4.9 },
];

const TalAIDashboard = () => {
  const project = getProject('talai')!;
  const colors = useThemeColors();
  const { experiments, isLoading, createExperiment, deleteExperiment } = useTalAIExperiments();

  // Enable real-time updates
  useRealtimeExperiments('talai_experiments');

  const stats = [
    {
      label: 'Active Experiments',
      value: experiments.filter((e) => e.status === 'training').length.toString(),
      icon: Activity,
      color: 'from-purple-500 to-cyan-500',
    },
    { label: 'GPU Hours Used', value: '2,847', icon: Cpu, color: 'from-cyan-500 to-green-500' },
    { label: 'Models Deployed', value: '23', icon: Brain, color: 'from-purple-500 to-pink-500' },
    {
      label: 'Total Experiments',
      value: experiments.length.toString(),
      icon: Database,
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  const handleNewExperiment = () => {
    createExperiment.mutate({
      name: `Experiment ${Date.now()}`,
      model_type: 'transformer',
      hyperparameters: { learning_rate: 0.001, batch_size: 32, epochs: 100 },
    });
  };

  return (
    <ProjectLayout project={project}>
      <div className="p-6 space-y-6">
        <DashboardHeader
          title="TalAI Research Hub"
          subtitle="AI research platform for training and deployment"
          actions={
            <>
              <ExportMenu
                data={experiments as unknown as Record<string, unknown>[]}
                filename={`talai-experiments-${new Date().toISOString().split('T')[0]}`}
                type="ai-experiment"
              />
              <ThemeSwitcher />
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload Dataset
              </Button>
              <Button
                onClick={handleNewExperiment}
                disabled={createExperiment.isPending}
                style={{
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.tertiary} 100%)`,
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
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
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

        {/* Training Chart */}
        <TrainingChart />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Experiments */}
          <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-purple-400" />
                  Your Experiments
                </CardTitle>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <LoadingState />
              ) : experiments.length === 0 ? (
                <EmptyState
                  icon={Brain}
                  title="No experiments yet"
                  description="Create a new experiment to get started"
                />
              ) : (
                experiments.slice(0, 5).map((exp) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-purple-500/50 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            exp.status === 'training'
                              ? 'bg-purple-400 animate-pulse'
                              : exp.status === 'completed'
                                ? 'bg-green-400'
                                : 'bg-yellow-400'
                          }`}
                        />
                        <span className="font-medium">{exp.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            exp.status === 'training'
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
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteExperiment.mutate(exp.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {exp.status !== 'pending' && (
                      <>
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Training Progress</span>
                            <span>{exp.progress || 0}%</span>
                          </div>
                          <Progress value={exp.progress || 0} className="h-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="p-2 rounded-lg bg-muted/50">
                            <span className="text-muted-foreground">Model: </span>
                            <span className="font-mono text-cyan-400">
                              {exp.model_type || 'N/A'}
                            </span>
                          </div>
                          <div className="p-2 rounded-lg bg-muted/50">
                            <span className="text-muted-foreground">Status: </span>
                            <span className="font-mono text-green-400">{exp.status}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Hyperparameter Controls */}
          <HyperparameterControls />
        </div>

        {/* Model Registry & GPU Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Model Registry */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-cyan-400" />
                Model Registry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {models.map((model, i) => (
                <motion.div
                  key={model.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-cyan-500/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-mono text-sm font-medium">{model.name}</p>
                      <p className="text-xs text-muted-foreground">v{model.version}</p>
                    </div>
                    <Badge variant="outline" className="text-cyan-400 border-cyan-500/30">
                      ★ {model.rating}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Download className="h-3 w-3" />
                    <span>{model.downloads.toLocaleString()} downloads</span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-3">
                    Deploy Model
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* GPU Cluster Status */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-green-400" />
                GPU Cluster Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Array.from({ length: 8 }).map((_, i) => {
                  const usage = Math.floor(Math.random() * 100);
                  const status = usage > 80 ? 'high' : usage > 40 ? 'medium' : 'low';
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-4 rounded-xl bg-muted/30 border border-border/50 text-center"
                    >
                      <div
                        className={`w-8 h-8 mx-auto mb-2 rounded-lg flex items-center justify-center ${
                          status === 'high'
                            ? 'bg-red-500/20 text-red-400'
                            : status === 'medium'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-green-500/20 text-green-400'
                        }`}
                      >
                        <Cpu className="h-4 w-4" />
                      </div>
                      <p className="text-xs font-medium">GPU {i + 1}</p>
                      <p className="text-lg font-bold">{usage}%</p>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProjectLayout>
  );
};

export default TalAIDashboard;
