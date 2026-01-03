// MEZAN - Enterprise Automation Platform Dashboard with Arabic RTL Support
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeColors } from '@/context/ThemeContext';
import {
  Activity,
  Play,
  Pause,
  Settings,
  Workflow,
  Zap,
  CheckCircle,
  Clock,
  Plus,
  Network,
  Loader2,
  Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProjectLayout } from '@/projects/components';
import { getProject } from '@/projects/config';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { IslamicPattern, BilingualToggle } from './components';
import { useWorkflows, useRealtimeWorkflows } from '@/hooks';
import { ExportMenu } from '@/components/shared/ExportMenu';
import { DashboardHeader, EmptyState, LoadingState } from '@/components/dashboard';
import { SEO } from '@/components/shared/SEO';
import { JsonLd, schemas } from '@/components/shared/JsonLd';

// Bilingual content
const content = {
  ar: {
    title: 'لوحة تحكم ميزان',
    subtitle: 'مركز التحكم في أتمتة المؤسسات',
    settings: 'الإعدادات',
    newWorkflow: 'سير عمل جديد',
    activeWorkflows: 'سير العمل النشط',
    recentExecutions: 'التنفيذات الأخيرة',
    connectedIntegrations: 'التكاملات المتصلة',
    viewAll: 'عرض الكل',
    connected: 'متصل',
    executions: 'تنفيذات',
    success: 'نجاح',
    noWorkflows: 'لا توجد سير عمل بعد',
    createWorkflow: 'أنشئ سير عمل جديد للبدء',
    stats: {
      workflows: 'إجمالي سير العمل',
      executionsToday: 'تنفيذات اليوم',
      successRate: 'معدل النجاح',
      avgDuration: 'متوسط المدة',
    },
  },
  en: {
    title: 'MEZAN Dashboard',
    subtitle: 'Enterprise automation network control center',
    settings: 'Settings',
    newWorkflow: 'New Workflow',
    activeWorkflows: 'Active Workflows',
    recentExecutions: 'Recent Executions',
    connectedIntegrations: 'Connected Integrations',
    viewAll: 'View All',
    connected: 'Connected',
    executions: 'executions',
    success: 'success',
    noWorkflows: 'No workflows yet',
    createWorkflow: 'Create a new workflow to get started',
    stats: {
      workflows: 'Total Workflows',
      executionsToday: 'Executions Today',
      successRate: 'Success Rate',
      avgDuration: 'Avg Duration',
    },
  },
};

const MEZANDashboard = () => {
  const project = getProject('mezan')!;
  const colors = useThemeColors();
  const [language, setLanguage] = useState<'ar' | 'en'>('en');
  const { workflows, isLoading, createWorkflow, deleteWorkflow } = useWorkflows();

  // Enable real-time updates
  useRealtimeWorkflows();

  const t = content[language];
  const isRTL = language === 'ar';

  const stats = [
    { label: t.stats.workflows, value: workflows.length.toString(), icon: Workflow, trend: '+5' },
    {
      label: t.stats.executionsToday,
      value: workflows.reduce((acc, w) => acc + (w.execution_count || 0), 0).toString(),
      icon: Activity,
      trend: '+12%',
    },
    { label: t.stats.successRate, value: '99.1%', icon: CheckCircle, trend: '+0.3%' },
    { label: t.stats.avgDuration, value: '2.4s', icon: Clock, trend: '-0.2s' },
  ];

  const handleNewWorkflow = () => {
    createWorkflow.mutate({
      name: `Workflow ${Date.now()}`,
      description: 'New automation workflow',
      workflow_definition: { steps: [] },
    });
  };

  return (
    <ProjectLayout project={project}>
      <div
        className="relative p-6 space-y-6"
        dir={isRTL ? 'rtl' : 'ltr'}
        style={{ fontFamily: isRTL ? "'Noto Sans Arabic', sans-serif" : 'inherit' }}
      >
        {/* Islamic Pattern Background */}
        <IslamicPattern opacity={0.05} color="hsl(var(--primary))" />

        {/* Header */}
        <div className="relative">
          <DashboardHeader
            title={t.title}
            subtitle={t.subtitle}
            actions={
              <>
                <ExportMenu
                  data={workflows as unknown as Record<string, unknown>[]}
                  filename={`mezan-workflows-${new Date().toISOString().split('T')[0]}`}
                  type="workflow"
                />
                <BilingualToggle
                  language={language}
                  onToggle={() => setLanguage((l) => (l === 'ar' ? 'en' : 'ar'))}
                />
                <ThemeSwitcher />
                <Button variant="outline">
                  <Settings className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t.settings}
                </Button>
                <Button
                  onClick={handleNewWorkflow}
                  disabled={createWorkflow.isPending}
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                    color: colors.text,
                  }}
                >
                  {createWorkflow.isPending ? (
                    <Loader2 className={`h-4 w-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  ) : (
                    <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  )}
                  {t.newWorkflow}
                </Button>
              </>
            }
          />
        </div>

        {/* Stats Grid - Custom with trends */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-border/50 bg-card/50 backdrop-blur relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path d="M0,0 L100,0 L100,100 Q50,50 0,0" fill="currentColor" />
                  </svg>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
                      <p className="text-xs text-green-400 mt-1">{stat.trend}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workflows */}
          <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="h-5 w-5" style={{ color: colors.primary }} />
                  {t.activeWorkflows}
                </CardTitle>
                <Button variant="ghost" size="sm">
                  {t.viewAll}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <LoadingState />
              ) : workflows.length === 0 ? (
                <EmptyState icon={Workflow} title={t.noWorkflows} description={t.createWorkflow} />
              ) : (
                <div className="space-y-3">
                  {workflows.slice(0, 5).map((workflow, idx) => {
                    const isActive = workflow.status === 'active';

                    return (
                      <motion.div
                        key={workflow.id}
                        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/50 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              isActive ? 'bg-green-500/20' : 'bg-yellow-500/20'
                            }`}
                          >
                            {isActive ? (
                              <Play className="h-5 w-5 text-green-400" />
                            ) : (
                              <Pause className="h-5 w-5 text-yellow-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{workflow.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {workflow.execution_count || 0} {t.executions}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className={`text-${isRTL ? 'left' : 'right'}`}>
                            <p className="text-sm font-medium text-green-400">
                              {workflow.success_rate || 0}%
                            </p>
                            <p className="text-xs text-muted-foreground">{t.success}</p>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => deleteWorkflow.mutate(workflow.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Executions */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" style={{ color: colors.secondary }} />
                {t.recentExecutions}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {workflows.length === 0 ? (
                <EmptyState icon={Activity} title="No recent executions" />
              ) : (
                workflows.slice(0, 4).map((workflow) => (
                  <div
                    key={workflow.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border/30"
                  >
                    <div className="mt-0.5 text-green-400">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{workflow.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{workflow.last_executed_at ? 'Recently' : 'Never run'}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <Button variant="ghost" className="w-full mt-2">
                {t.viewAll}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Integration Status */}
        <Card className="relative border-border/50 bg-card/50 backdrop-blur overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-50" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" style={{ color: colors.primary }} />
              {t.connectedIntegrations}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {['Salesforce', 'Slack', 'PostgreSQL', 'AWS S3', 'Stripe', 'SendGrid'].map(
                (int, i) => (
                  <motion.div
                    key={int}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-green-500/50 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xl font-bold">
                      {int.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">{int}</span>
                    <Badge variant="outline" className="text-green-400 border-green-500/30">
                      {t.connected}
                    </Badge>
                  </motion.div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProjectLayout>
  );
};

export default MEZANDashboard;
