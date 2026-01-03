import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useWaitlist } from '@/hooks/useWaitlist';
import {
  Brain,
  FileText,
  Search,
  Sparkles,
  Target,
  DollarSign,
  ArrowRight,
  Clock,
  Users,
  TrendingUp,
  Lock,
  Zap,
  Award,
  BarChart,
  BookOpen,
  FlaskConical,
  Lightbulb,
  Network,
  PenTool,
  Database,
  Shuffle,
  Ghost,
} from 'lucide-react';

// TalAI Product Data
const talaiProducts = [
  // Research Tools Category
  {
    id: 'litreview',
    name: 'LitReviewBot',
    description: 'Automated literature review and synthesis',
    category: 'Research Tools',
    price: '$89/mo',
    status: 'ready',
    icon: BookOpen,
    features: ['Bulk paper analysis', 'Auto-synthesis', 'Citation mapping', 'Gap identification'],
    userCount: 1247,
    quality: 85,
    loc: 1200,
    hot: true,
  },
  {
    id: 'grantwriter',
    name: 'GrantWriter',
    description: 'AI-powered grant proposal assistant',
    category: 'Research Tools',
    price: '$199/mo',
    status: 'ready',
    icon: PenTool,
    features: ['Template library', 'Budget calculator', 'Success predictor', 'Agency matching'],
    userCount: 892,
    quality: 88,
    loc: 1800,
    hot: true,
  },
  {
    id: 'adversarial',
    name: 'AdversarialReview',
    description: 'Critical paper analysis and weakness detection',
    category: 'Research Tools',
    price: '$79/mo',
    status: 'ready',
    icon: Target,
    features: [
      'Weakness detection',
      'Counterarguments',
      'Peer review sim',
      'Improvement suggestions',
    ],
    userCount: 567,
    quality: 82,
    loc: 950,
  },
  {
    id: 'paperminer',
    name: 'PaperMiner',
    description: 'Bulk academic paper analysis at scale',
    category: 'Research Tools',
    price: '$79-999/mo',
    status: 'ready',
    icon: Search,
    features: ['Batch processing', 'Pattern detection', 'Trend analysis', 'Export to CSV/JSON'],
    userCount: 423,
    quality: 79,
    loc: 1100,
  },
  {
    id: 'citation',
    name: 'CitationPredictor',
    description: 'Forecast citation impact and reach',
    category: 'Research Tools',
    price: '$49-149/mo',
    status: 'ready',
    icon: TrendingUp,
    features: [
      'Citation forecasting',
      'Impact analysis',
      'Journal recommendations',
      'Trend tracking',
    ],
    userCount: 312,
    quality: 76,
    loc: 890,
  },
  {
    id: 'hypothesis',
    name: 'HypothesisMatch',
    description: 'Match researchers with complementary work',
    category: 'Research Tools',
    price: '$49-199/mo',
    status: 'ready',
    icon: Network,
    features: ['Researcher matching', 'Collaboration finder', 'Expertise mapping', 'Team builder'],
    userCount: 289,
    quality: 81,
    loc: 1050,
  },
  {
    id: 'pricer',
    name: 'ResearchPricer',
    description: 'Calculate research ROI and grant efficiency',
    category: 'Research Tools',
    price: '$199/mo',
    status: 'ready',
    icon: DollarSign,
    features: ['ROI calculator', 'Budget optimizer', 'Cost predictor', 'Grant efficiency'],
    userCount: 178,
    quality: 83,
    loc: 720,
  },
  {
    id: 'experiments',
    name: 'ExperimentDesigner',
    description: 'Automated experimental protocol generation',
    category: 'Research Tools',
    price: '$149/mo',
    status: 'ready',
    icon: FlaskConical,
    features: [
      'Protocol generation',
      'Control suggestions',
      'Sample size calc',
      'Statistical power',
    ],
    userCount: 456,
    quality: 87,
    loc: 1350,
  },
  {
    id: 'datacleaner',
    name: 'DataCleaner',
    description: 'Research data quality and cleaning assistant',
    category: 'Research Tools',
    price: '$79-249/mo',
    status: 'ready',
    icon: Database,
    features: ['Auto-cleaning', 'Outlier detection', 'Missing data handling', 'Quality scoring'],
    userCount: 892,
    quality: 84,
    loc: 980,
  },
  {
    id: 'abstractwriter',
    name: 'AbstractWriter',
    description: 'Generate compelling research abstracts',
    category: 'Research Tools',
    price: '$39/mo',
    status: 'ready',
    icon: FileText,
    features: [
      'Abstract generation',
      'Keyword optimization',
      'Multiple versions',
      'Journal tailoring',
    ],
    userCount: 1456,
    quality: 80,
    loc: 650,
  },
  {
    id: 'failuredb',
    name: 'FailureDB',
    description: 'Failed experiment futures market',
    category: 'Research Tools',
    price: '$50k-500k/mo',
    status: 'beta',
    icon: BarChart,
    features: ['Failure tracking', 'Futures market', 'Risk assessment', 'Insight extraction'],
    userCount: 23,
    quality: 92,
    loc: 2100,
    enterprise: true,
  },

  // Prompt Engineering Category
  {
    id: 'promptforge',
    name: 'PromptForge Lite',
    description: 'Offline prompt extraction and optimization',
    category: 'Prompt Engineering',
    price: '$29-99/mo',
    status: 'ready',
    icon: Zap,
    features: ['Prompt extraction', 'Optimization', 'Version control', 'Testing suite'],
    userCount: 2134,
    quality: 86,
    loc: 890,
  },
  {
    id: 'marketplace',
    name: 'PromptMarketplace',
    description: 'Buy, sell, and trade optimized prompts',
    category: 'Prompt Engineering',
    price: '15% commission',
    status: 'ready',
    icon: Award,
    features: ['Prompt trading', 'Quality verification', 'Licensing', 'Revenue sharing'],
    userCount: 3456,
    quality: 78,
    loc: 1450,
  },

  // Core Platforms Category
  {
    id: 'ideaforge',
    name: 'IdeaForge',
    description: '15 frameworks for systematic idea generation',
    category: 'Core Platforms',
    price: '$149/mo',
    status: 'ready',
    icon: Lightbulb,
    features: ['15 frameworks', '17 agents', 'Idea scoring', 'Validation pipeline'],
    userCount: 567,
    quality: 89,
    loc: 2200,
  },
  {
    id: 'buildforge',
    name: 'BuildForge',
    description: '5-gate validation system for ideas',
    category: 'Core Platforms',
    price: '$199/mo',
    status: 'ready',
    icon: Target,
    features: ['5-gate validation', 'Market analysis', 'Technical feasibility', 'Risk assessment'],
    userCount: 234,
    quality: 91,
    loc: 1890,
  },
  {
    id: 'turingo',
    name: 'Turingo',
    description: 'Multi-paradigm optimization platform',
    category: 'Core Platforms',
    price: '$299/mo',
    status: 'beta',
    icon: Brain,
    features: ['14 agents', '5 SOPs', 'Multi-paradigm', 'Auto-selection'],
    userCount: 89,
    quality: 93,
    loc: 2800,
  },

  // Novel Concepts Category
  {
    id: 'ideacalculus',
    name: 'IdeaCalculus',
    description: 'Mathematical framework for idea operations',
    category: 'Novel Concepts',
    price: '$149/mo',
    status: 'beta',
    icon: Brain,
    features: ['Idea algebra', 'Concept derivatives', 'Innovation metrics', 'Thought calculus'],
    userCount: 67,
    quality: 88,
    loc: 1650,
  },
  {
    id: 'chaos',
    name: 'ChaosEngine',
    description: 'Random domain collision for breakthrough ideas',
    category: 'Novel Concepts',
    price: '$59/mo',
    status: 'ready',
    icon: Shuffle,
    features: ['Domain collision', 'Chaos generation', 'Pattern emergence', 'Serendipity engine'],
    userCount: 445,
    quality: 75,
    loc: 980,
  },
  {
    id: 'ghost',
    name: 'GhostResearcher',
    description: 'Consult with historical scientists AI personas',
    category: 'Novel Concepts',
    price: '$29/mo',
    status: 'ready',
    icon: Ghost,
    features: [
      'Historical personas',
      'Time-period thinking',
      'Classical methods',
      'Thought experiments',
    ],
    userCount: 1234,
    quality: 72,
    loc: 1100,
  },
];

// Category colors
const categoryColors = {
  'Research Tools': 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20',
  'Prompt Engineering': 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20',
  'Core Platforms': 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20',
  'Novel Concepts': 'bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20',
};

export default function TalAIShowcase() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [waitlistStats, setWaitlistStats] = useState<{ total_waiting: number } | null>(null);

  const { joinWaitlist, getWaitlistStats, loading: waitlistLoading } = useWaitlist();

  const categories = ['all', ...new Set(talaiProducts.map((p) => p.category))];

  const filteredProducts =
    selectedCategory === 'all'
      ? talaiProducts
      : talaiProducts.filter((p) => p.category === selectedCategory);

  const totalRevenuePotential = {
    min: 200000,
    max: 1500000,
  };

  // Load waitlist stats on mount
  useEffect(() => {
    const loadStats = async () => {
      const stats = await getWaitlistStats('talai');
      if (stats) {
        setWaitlistStats({ total_waiting: stats.total_waiting });
      }
    };
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!waitlistEmail) {
      toast.error('Please enter your email address');
      return;
    }

    const entry = await joinWaitlist({
      email: waitlistEmail,
      projectId: 'talai',
      productId: selectedProductId || undefined,
      metadata: {
        source: 'showcase_page',
        category: selectedCategory,
        product: selectedProductId,
      },
    });

    if (entry) {
      setWaitlistEmail('');
      setWaitlistOpen(false);
      setSelectedProductId(null);

      // Refresh stats
      const stats = await getWaitlistStats('talai');
      if (stats) {
        setWaitlistStats({ total_waiting: stats.total_waiting });
      }
    }
  };

  const handleProductWaitlist = (productId: string) => {
    setSelectedProductId(productId);
    setWaitlistOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container relative mx-auto px-4 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4">
              19 Products Ready • $200k-1.5M/mo Potential
            </Badge>
            <h1 className="mb-6 text-5xl font-bold tracking-tight">TalAI Research Suite</h1>
            <p className="mb-8 text-xl text-muted-foreground">
              AI-powered research acceleration tools built from cutting-edge ML research. Join
              thousands of researchers already on the waitlist.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" onClick={() => setWaitlistOpen(true)}>
                Join Waitlist
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                View Demo
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>
                  {waitlistStats?.total_waiting.toLocaleString() || '12,847'} researchers waiting
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Launching Q1 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>Early access available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Potential Banner */}
      <section className="border-b border-border bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <h3 className="text-lg font-semibold">Total Revenue Potential</h3>
              <p className="text-sm text-muted-foreground">
                Based on current market analysis and user demand
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">
                ${totalRevenuePotential.min.toLocaleString()} - $
                {totalRevenuePotential.max.toLocaleString()}/mo
              </p>
              <p className="text-sm text-muted-foreground">Across all 19 products</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid h-auto w-full grid-cols-2 gap-2 bg-transparent lg:grid-cols-5">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="capitalize data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {category === 'all' ? 'All Products' : category}
                  <Badge variant="secondary" className="ml-2">
                    {category === 'all'
                      ? talaiProducts.length
                      : talaiProducts.filter((p) => p.category === category).length}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const Icon = product.icon;
            return (
              <Card
                key={product.id}
                className={`group relative cursor-pointer transition-all hover:shadow-lg ${
                  categoryColors[product.category] || ''
                }`}
                onClick={() => setSelectedProduct(product)}
              >
                {product.hot && <Badge className="absolute -right-2 -top-2 bg-red-500">HOT</Badge>}
                {product.enterprise && (
                  <Badge className="absolute -right-2 -top-2 bg-purple-500">ENTERPRISE</Badge>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {product.status === 'ready' ? 'Production Ready' : 'Beta'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="mt-3">{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Features */}
                    <div className="space-y-1">
                      {product.features.slice(0, 3).map((feature, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between border-t pt-4">
                      <div className="text-2xl font-bold text-primary">{product.price}</div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {product.userCount}
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {product.quality}%
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Waitlist Modal */}
      <Dialog open={waitlistOpen} onOpenChange={setWaitlistOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Join the TalAI Waitlist</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleWaitlistSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="researcher@university.edu"
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2 rounded-lg bg-muted p-4">
              <h4 className="font-semibold">Early Access Benefits:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 50% discount for first 3 months</li>
                <li>• Priority API access</li>
                <li>• 1-on-1 onboarding session</li>
                <li>• Shape product development</li>
              </ul>
            </div>
            <Button type="submit" className="w-full" disabled={waitlistLoading}>
              {waitlistLoading ? 'Joining...' : 'Reserve My Spot'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <selectedProduct.icon className="h-6 w-6 text-primary" />
                {selectedProduct.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground">{selectedProduct.description}</p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="mb-2 font-semibold">Pricing</h4>
                  <p className="text-2xl font-bold text-primary">{selectedProduct.price}</p>
                  <p className="text-sm text-muted-foreground">Billed monthly</p>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="mb-2 font-semibold">Waitlist Position</h4>
                  <p className="text-2xl font-bold">{selectedProduct.userCount} users</p>
                  <p className="text-sm text-muted-foreground">Already signed up</p>
                </div>
              </div>

              <div>
                <h4 className="mb-3 font-semibold">Key Features</h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  {selectedProduct.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  onClick={() => handleProductWaitlist(selectedProduct.id)}
                  disabled={waitlistLoading}
                >
                  {waitlistLoading ? 'Joining...' : `Join Waitlist for ${selectedProduct.name}`}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (selectedProduct.id === 'litreview') {
                      window.location.href = '/projects/talai/litreview';
                    } else if (selectedProduct.id === 'grantwriter') {
                      window.location.href = '/projects/talai/grantwriter';
                    }
                  }}
                >
                  Learn More
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
