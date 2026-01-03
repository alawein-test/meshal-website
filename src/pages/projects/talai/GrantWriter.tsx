import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  PenTool,
  ArrowRight,
  CheckCircle,
  DollarSign,
  Target,
  FileText,
  TrendingUp,
  Users,
  Clock,
  Star,
} from 'lucide-react';
import { useWaitlist } from '@/hooks/useWaitlist';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function GrantWriter() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const { joinWaitlist, loading } = useWaitlist();

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    await joinWaitlist({
      email,
      projectId: 'talai',
      productId: 'grantwriter',
      metadata: { source: 'product_page', product: 'grantwriter' },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />
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
              💼 Premium • $199/mo
            </Badge>
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <PenTool className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-5xl font-bold tracking-tight">GrantWriter</h1>
            </div>
            <p className="mb-8 text-xl text-muted-foreground">
              AI-powered grant proposal assistant. Increase your success rate with intelligent
              proposal writing and agency matching.
            </p>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Button
                size="lg"
                onClick={() =>
                  document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
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
                <span>892 researchers waiting</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span>4.9/5 rating</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>$199/mo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <h3 className="text-lg font-semibold">Pricing</h3>
              <p className="text-sm text-muted-foreground">Premium grant writing assistance</p>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-3xl font-bold text-primary">
                $199<span className="text-lg text-muted-foreground">/mo</span>
              </p>
              <p className="text-sm text-muted-foreground">Includes unlimited proposals</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Key Features</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: FileText,
              title: 'Template Library',
              desc: 'Pre-built templates for major agencies',
            },
            { icon: DollarSign, title: 'Budget Calculator', desc: 'Automated budget calculations' },
            {
              icon: TrendingUp,
              title: 'Success Predictor',
              desc: 'AI-powered success probability',
            },
            {
              icon: Target,
              title: 'Agency Matching',
              desc: 'Find the perfect funding opportunity',
            },
          ].map((feature, i) => {
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
                  <CardDescription>{feature.desc}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border" id="waitlist-form">
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <CardTitle className="text-2xl mb-2">Join the GrantWriter Waitlist</CardTitle>
              <CardDescription>
                Get early access and 50% discount for first 3 months
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
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
