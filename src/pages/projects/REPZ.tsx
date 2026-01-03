import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, TrendingUp, Users, Award, Activity, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function REPZShowcase() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: 'AI Workout Generation',
      description: 'Personalized workout plans powered by machine learning',
    },
    {
      icon: TrendingUp,
      title: 'Progressive Overload Tracking',
      description: 'Automatically adjust intensity based on your progress',
    },
    {
      icon: Activity,
      title: 'Form Analysis',
      description: 'Real-time feedback on exercise form and technique',
    },
    {
      icon: Target,
      title: 'Fatigue Detection',
      description: 'Smart recovery recommendations based on performance data',
    },
    {
      icon: Users,
      title: 'Community Challenges',
      description: 'Compete and collaborate with other athletes',
    },
    {
      icon: Award,
      title: 'Performance Analytics',
      description: 'Deep insights into your training patterns and improvements',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-blue-500/10" />
        <div className="container relative mx-auto px-4 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4">
              🟢 Live Production • getrepz.app
            </Badge>
            <h1 className="mb-6 text-5xl font-bold tracking-tight">REPZ</h1>
            <p className="mb-8 text-xl text-muted-foreground">
              AI-powered fitness tracking and performance analytics. Train smarter, not harder.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" onClick={() => window.open('https://getrepz.app', '_blank')}>
                Visit Live Site
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
              <div className="text-4xl font-bold text-primary mb-2">2.0</div>
              <div className="text-sm text-muted-foreground">Platform Version</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">Production</div>
              <div className="text-sm text-muted-foreground">Status</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">Revenue</div>
              <div className="text-sm text-muted-foreground">Generating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Key Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            REPZ combines cutting-edge AI with fitness science to deliver personalized training
            experiences.
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
                  <Badge variant="outline">Framer Motion</Badge>
                  <Badge variant="outline">Capacitor</Badge>
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
                  <Badge variant="outline">FastAPI</Badge>
                  <Badge variant="outline">ML Pipeline</Badge>
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
                  <Badge variant="outline">Edge Functions</Badge>
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
                  <Badge variant="outline">Redis</Badge>
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
              <CardTitle className="text-2xl mb-2">Ready to Transform Your Training?</CardTitle>
              <CardDescription>
                Join thousands of athletes using REPZ to optimize their performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                size="lg"
                onClick={() => window.open('https://getrepz.app', '_blank')}
                className="w-full sm:w-auto"
              >
                Get Started on REPZ
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
