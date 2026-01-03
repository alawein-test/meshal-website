import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  ArrowRight,
  CheckCircle,
  Zap,
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  Star,
  FileText,
  Search,
  Sparkles,
} from 'lucide-react';
import { useWaitlist } from '@/hooks/useWaitlist';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function LitReviewBot() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const { joinWaitlist, loading } = useWaitlist();

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    const entry = await joinWaitlist({
      email,
      projectId: 'talai',
      productId: 'litreview',
      metadata: {
        source: 'product_page',
        product: 'litreview',
      },
    });

    if (entry) {
      setEmail('');
      setWaitlistOpen(false);
    }
  };

  const features = [
    {
      icon: Search,
      title: 'Bulk Paper Analysis',
      description: 'Process hundreds of papers simultaneously with AI-powered extraction',
    },
    {
      icon: FileText,
      title: 'Auto-Synthesis',
      description: 'Automatically synthesize findings across multiple papers',
    },
    {
      icon: TrendingUp,
      title: 'Citation Mapping',
      description: 'Visualize citation networks and research relationships',
    },
    {
      icon: Sparkles,
      title: 'Gap Identification',
      description: 'Identify research gaps and opportunities automatically',
    },
  ];

  const useCases = [
    'Literature reviews for grant proposals',
    'Systematic reviews and meta-analyses',
    'Research proposal preparation',
    'Thesis and dissertation research',
    'Keeping up with latest publications',
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />
        <div className="container relative mx-auto px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <Button
              variant="ghost"
              onClick={() => navigate('/projects/talai/showcase')}
              className="mb-6"
            >
              ← Back to TalAI Products
            </Button>
            <Badge variant="secondary" className="mb-4">
              🔥 Most Popular • $89/mo
            </Badge>
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-5xl font-bold tracking-tight">LitReviewBot</h1>
            </div>
            <p className="mb-8 text-xl text-muted-foreground">
              Automated literature review and synthesis. Save weeks of research time with AI-powered
              paper analysis and synthesis.
            </p>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Button size="lg" onClick={() => setWaitlistOpen(true)}>
                Join Waitlist
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>1,247 researchers waiting</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span>4.8/5 rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Launching Q1 2025</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Banner */}
      <section className="border-b border-border bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <h3 className="text-lg font-semibold">Pricing</h3>
              <p className="text-sm text-muted-foreground">Simple, transparent pricing</p>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-3xl font-bold text-primary">
                $89<span className="text-lg text-muted-foreground">/mo</span>
              </p>
              <p className="text-sm text-muted-foreground">Billed monthly • Cancel anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Key Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to conduct comprehensive literature reviews in a fraction of the
            time.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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

      {/* Use Cases */}
      <section className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Perfect For</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
            {useCases.map((useCase, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-background border">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{useCase}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
              1
            </div>
            <div>
              <h3 className="font-semibold mb-2">Upload Papers</h3>
              <p className="text-sm text-muted-foreground">
                Upload PDFs or provide paper IDs. LitReviewBot supports bulk imports from major
                databases.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
              2
            </div>
            <div>
              <h3 className="font-semibold mb-2">AI Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Our AI extracts key findings, methodologies, and conclusions from each paper
                automatically.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
              3
            </div>
            <div>
              <h3 className="font-semibold mb-2">Synthesis & Report</h3>
              <p className="text-sm text-muted-foreground">
                Get a comprehensive synthesis report with citations, gap analysis, and
                recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <CardTitle className="text-2xl mb-2">Ready to Accelerate Your Research?</CardTitle>
              <CardDescription>
                Join 1,247+ researchers already on the waitlist for early access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleJoinWaitlist} className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                    required
                  />
                  <Button type="submit" size="lg" disabled={loading}>
                    {loading ? 'Joining...' : 'Join Waitlist'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Early access benefits: 50% discount, priority support, and shape product
                  development
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
