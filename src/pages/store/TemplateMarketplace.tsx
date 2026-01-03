import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ShoppingBag,
  Search,
  Filter,
  Star,
  Download,
  Eye,
  Package,
  Sparkles,
  DollarSign,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  downloads: number;
  tags: string[];
  featured?: boolean;
  new?: boolean;
}

// Template data - in production, this would come from a database
const templates: Template[] = [
  {
    id: 'saas-dashboard',
    name: 'SaaS Dashboard Template',
    description: 'Complete SaaS dashboard with analytics, user management, and billing integration',
    category: 'Dashboard',
    price: 199,
    originalPrice: 299,
    rating: 4.8,
    reviews: 124,
    downloads: 2340,
    tags: ['React', 'TypeScript', 'Tailwind', 'Shadcn'],
    featured: true,
  },
  {
    id: 'scientific-computing',
    name: 'Scientific Computing UI',
    description: 'Specialized UI for scientific computing platforms with data visualization',
    category: 'Scientific',
    price: 299,
    rating: 4.9,
    reviews: 67,
    downloads: 890,
    tags: ['React', 'Three.js', 'D3.js', 'Scientific'],
    featured: true,
  },
  {
    id: 'ai-research',
    name: 'AI Research Platform',
    description: 'Complete AI research platform with experiment tracking and model management',
    category: 'AI/ML',
    price: 399,
    originalPrice: 499,
    rating: 4.7,
    reviews: 45,
    downloads: 567,
    tags: ['React', 'ML', 'TensorFlow.js', 'Research'],
    featured: true,
  },
  {
    id: 'optimization-playground',
    name: 'Optimization Playground',
    description: 'Interactive optimization algorithm playground with visualization',
    category: 'Tools',
    price: 249,
    rating: 4.6,
    reviews: 89,
    downloads: 1234,
    tags: ['React', 'D3.js', 'Algorithms', 'Visualization'],
  },
  {
    id: 'quantum-simulator',
    name: 'Quantum Simulator UI',
    description: 'Quantum mechanics simulation interface with WebGL visualization',
    category: 'Scientific',
    price: 349,
    rating: 4.9,
    reviews: 34,
    downloads: 456,
    tags: ['React', 'WebGL', 'Quantum', 'Physics'],
  },
  {
    id: 'workflow-automation',
    name: 'Workflow Automation Dashboard',
    description: 'Enterprise workflow automation platform with drag-and-drop builder',
    category: 'Enterprise',
    price: 449,
    originalPrice: 599,
    rating: 4.8,
    reviews: 56,
    downloads: 789,
    tags: ['React', 'React Flow', 'Automation', 'Enterprise'],
  },
];

const categories = ['All', 'Dashboard', 'Scientific', 'AI/ML', 'Tools', 'Enterprise'];

export default function TemplateMarketplace() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handlePurchase = (template: Template) => {
    // In production, this would integrate with Stripe
    toast.success(`Added ${template.name} to cart!`, {
      description: `Price: $${template.price}`,
    });
  };

  const handlePreview = (template: Template) => {
    navigate(`/studio/templates?preview=${template.id}`);
  };

  const featuredTemplates = templates.filter((t) => t.featured);
  const totalValue = templates.reduce((sum, t) => sum + (t.originalPrice || t.price), 0);
  const bundlePrice = 1999;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="container relative mx-auto px-4 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4">
              54 Templates Available
            </Badge>
            <h1 className="mb-6 text-5xl font-bold tracking-tight">Template Marketplace</h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Production-ready React templates for scientific computing, AI research, and enterprise
              applications.
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{templates.length}+</div>
                <div className="text-sm text-muted-foreground">Templates</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">10k+</div>
                <div className="text-sm text-muted-foreground">Downloads</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">4.8</div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bundle Deal */}
      <section className="border-b border-border bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-bold">Complete Starter Pack</h3>
                    <Badge variant="secondary">Save 60%</Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Get all 54 templates for just ${bundlePrice} (worth $
                    {totalValue.toLocaleString()})
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={() =>
                    handlePurchase({
                      id: 'bundle',
                      name: 'Complete Starter Pack',
                      description: '',
                      category: '',
                      price: bundlePrice,
                      rating: 0,
                      reviews: 0,
                      downloads: 0,
                      tags: [],
                    })
                  }
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Buy Bundle
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList>
                {categories.map((cat) => (
                  <TabsTrigger key={cat} value={cat}>
                    {cat}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Featured Templates */}
      {selectedCategory === 'All' && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Featured Templates
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {featuredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onPurchase={handlePurchase}
                onPreview={handlePreview}
              />
            ))}
          </div>
        </section>
      )}

      {/* All Templates */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">
          {selectedCategory === 'All' ? 'All Templates' : `${selectedCategory} Templates`}
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onPurchase={handlePurchase}
              onPreview={handlePreview}
            />
          ))}
        </div>
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No templates found matching your criteria.</p>
          </div>
        )}
      </section>
    </div>
  );
}

interface TemplateCardProps {
  template: Template;
  onPurchase: (template: Template) => void;
  onPreview: (template: Template) => void;
}

function TemplateCard({ template, onPurchase, onPreview }: TemplateCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all">
      {template.featured && (
        <Badge className="absolute -right-2 -top-2 z-10 bg-primary">Featured</Badge>
      )}
      {template.new && <Badge className="absolute -right-2 -top-2 z-10 bg-green-500">New</Badge>}
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-lg">{template.name}</CardTitle>
        </div>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {template.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              {template.rating}
            </div>
            <div>({template.reviews} reviews)</div>
            <div className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              {template.downloads.toLocaleString()}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <div className="text-2xl font-bold text-primary">${template.price}</div>
              {template.originalPrice && (
                <div className="text-sm text-muted-foreground line-through">
                  ${template.originalPrice}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onPreview(template)}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={() => onPurchase(template)}>
                <ShoppingBag className="h-4 w-4 mr-2" />
                Buy
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
