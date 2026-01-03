import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, Zap, Target, Award, TrendingUp, TestTube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LLMWorksShowcase() {
  const navigate = useNavigate();

  const features = [
    {
      icon: TestTube,
      title: 'Model Benchmarking',
      description: 'Comprehensive evaluation across multiple metrics and datasets',
    },
    {
      icon: Zap,
      title: 'Performance Testing',
      description: 'Measure latency, throughput, and resource consumption',
    },
    {
      icon: BarChart,
      title: 'Comparison Tools',
      description: 'Side-by-side comparison of different models and configurations',
    },
    {
      icon: Target,
      title: 'Custom Evaluations',
      description: 'Create custom test suites for your specific use cases',
    },
    {
      icon: Award,
      title: 'Leaderboards',
      description: 'Public and private leaderboards for model rankings',
    },
    {
      icon: TrendingUp,
      title: 'Performance Analytics',
      description: 'Deep insights into model behavior and optimization opportunities',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10" />
        <div className="container relative mx-auto px-4 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4">
              🟡 Maintenance • llmworks.dev
            </Badge>
            <h1 className="mb-6 text-5xl font-bold tracking-tight">LLMWorks</h1>
            <p className="mb-8 text-xl text-muted-foreground">
              LLM benchmarking and testing platform for comprehensive model evaluation and
              comparison.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" onClick={() => window.open('https://llmworks.dev', '_blank')}>
                Visit Site
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/projects')}>
                View All Projects
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-border bg-muted/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">1.0</div>
              <div className="text-sm text-muted-foreground">Platform Version</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">Maintenance</div>
              <div className="text-sm text-muted-foreground">Status</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">Open</div>
              <div className="text-sm text-muted-foreground">For Testing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Key Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive LLM evaluation and benchmarking tools for researchers and developers.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Card key={i} className="group hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Technology Stack</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Frontend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <Badge variant="outline">React 18</Badge>
                  <Badge variant="outline">TypeScript</Badge>
                  <Badge variant="outline">Recharts</Badge>
                  <Badge variant="outline">Plotly.js</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Backend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <Badge variant="outline">Supabase</Badge>
                  <Badge variant="outline">Python API</Badge>
                  <Badge variant="outline">Evaluation Engine</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Infrastructure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <Badge variant="outline">Vercel</Badge>
                  <Badge variant="outline">GPU Clusters</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Databases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <Badge variant="outline">PostgreSQL</Badge>
                  <Badge variant="outline">TimescaleDB</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <CardTitle className="text-2xl mb-2">Test. Measure. Improve.</CardTitle>
              <CardDescription>
                Join researchers and developers benchmarking LLMs with LLMWorks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                size="lg"
                onClick={() => window.open('https://llmworks.dev', '_blank')}
                className="w-full sm:w-auto"
              >
                Start Benchmarking
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
