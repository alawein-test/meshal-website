import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Briefcase,
  Code,
  Palette,
  Zap,
  Shield,
  BarChart3,
  DollarSign,
  Clock,
  CheckCircle,
  ArrowRight,
  Calendar,
  Mail,
  Phone,
} from 'lucide-react';
import { toast } from 'sonner';

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  duration: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
}

const services: Service[] = [
  {
    id: 'strategy-call',
    name: '1-Hour Strategy Call',
    description: 'High-level consultation on architecture, tech stack, and project planning',
    category: 'Consultation',
    price: '$500',
    duration: '1 hour',
    icon: Briefcase,
    features: [
      'Architecture review',
      'Tech stack recommendations',
      'Project roadmap',
      'Best practices guidance',
    ],
  },
  {
    id: 'architecture-review',
    name: 'Architecture Review',
    description: 'Comprehensive review of your system architecture and design patterns',
    category: 'Consultation',
    price: '$2,500',
    duration: '1-2 days',
    icon: Code,
    features: [
      'Full architecture audit',
      'Scalability assessment',
      'Performance optimization',
      'Security review',
      'Detailed report',
    ],
  },
  {
    id: 'full-audit',
    name: 'Full Audit Package',
    description: 'Complete system audit including code, architecture, security, and performance',
    category: 'Consultation',
    price: '$10,000',
    duration: '1 week',
    icon: Shield,
    features: [
      'Code quality audit',
      'Architecture review',
      'Security assessment',
      'Performance testing',
      'Accessibility audit',
      'Comprehensive report',
      'Implementation roadmap',
    ],
  },
  {
    id: 'component-dev',
    name: 'Component Development',
    description: 'Custom React component development with TypeScript and Tailwind',
    category: 'Development',
    price: 'From $5,000',
    duration: '1-2 weeks',
    icon: Palette,
    features: [
      'Custom components',
      'Design system integration',
      'TypeScript',
      'Responsive design',
      'Documentation',
    ],
  },
  {
    id: 'dashboard-build',
    name: 'Dashboard Build',
    description: 'Complete dashboard application with data visualization and analytics',
    category: 'Development',
    price: 'From $15,000',
    duration: '2-4 weeks',
    icon: BarChart3,
    features: [
      'Full dashboard UI',
      'Data visualization',
      'Real-time updates',
      'User authentication',
      'API integration',
    ],
  },
  {
    id: 'full-platform',
    name: 'Full Platform',
    description: 'End-to-end platform development from design to deployment',
    category: 'Development',
    price: 'From $50,000',
    duration: '2-3 months',
    icon: Zap,
    features: [
      'Complete platform',
      'Frontend & backend',
      'Database design',
      'DevOps setup',
      'Documentation',
      'Training & support',
    ],
  },
];

const workshops = [
  {
    id: 'design-system',
    name: 'Design System Workshop',
    price: '$2,500',
    duration: '1 day',
    description: 'Learn to build and maintain a scalable design system',
  },
  {
    id: 'react-performance',
    name: 'React Performance Workshop',
    price: '$3,500',
    duration: '2 days',
    description: 'Optimize React applications for maximum performance',
  },
  {
    id: 'fullstack-bootcamp',
    name: 'Full-Stack Bootcamp',
    price: '$10,000',
    duration: '1 week',
    description: 'Comprehensive full-stack development training',
  },
];

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would integrate with Calendly or booking system
    toast.success("Booking request submitted! We'll contact you within 24 hours.");
    setFormData({ name: '', email: '', phone: '', service: '', message: '' });
    setSelectedService(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="container relative mx-auto px-4 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4">
              Professional Services
            </Badge>
            <h1 className="mb-6 text-5xl font-bold tracking-tight">Services & Consultation</h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Expert consultation, custom development, and training services for your projects.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Consultation Services</h2>
          <p className="text-muted-foreground">
            Get expert advice on architecture, development, and strategy
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card
                key={service.id}
                className="group hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setSelectedService(service.id)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                  </div>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-primary">{service.price}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {service.duration}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {service.features.slice(0, 3).map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedService(service.id);
                        setFormData({ ...formData, service: service.id });
                      }}
                    >
                      Book Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Workshops Section */}
      <section className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Training & Workshops</h2>
            <p className="text-muted-foreground">Learn from industry experts</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {workshops.map((workshop) => (
              <Card key={workshop.id} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>{workshop.name}</CardTitle>
                  <CardDescription>{workshop.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-primary">{workshop.price}</div>
                    <Badge variant="outline">{workshop.duration}</Badge>
                  </div>
                  <Button className="w-full" variant="outline">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Book Consultation</CardTitle>
              <CardDescription>
                {services.find((s) => s.id === selectedService)?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service">Service</Label>
                  <Select
                    value={formData.service}
                    onValueChange={(value) => setFormData({ ...formData, service: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - {service.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your project needs..."
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Submit Request
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSelectedService(null);
                      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
