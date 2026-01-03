/**
 * @file Book.tsx
 * @description Consultation booking page
 */
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, MessageSquare, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PublicHeader } from '@/components/shared/PublicHeader';
import Footer from '@/components/Footer';
import { SEO } from '@/components/shared/SEO';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const consultationTypes = [
  {
    id: 'discovery',
    title: 'Discovery Call',
    duration: '15 min',
    description: 'Free introductory call to discuss your project and needs',
    icon: MessageSquare,
    color: 'jules-green',
    free: true,
  },
  {
    id: 'strategy',
    title: 'Strategy Session',
    duration: '45 min',
    description: 'Deep-dive into your product challenges and potential solutions',
    icon: Video,
    color: 'jules-cyan',
    price: '$150',
  },
  {
    id: 'audit-review',
    title: 'Audit Review',
    duration: '60 min',
    description: 'Walkthrough of completed audit findings with Q&A',
    icon: Calendar,
    color: 'jules-magenta',
    included: 'Included with Comprehensive+ tiers',
  },
];

export default function Book() {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState('discovery');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    website: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: 'Request Received!',
      description: "We'll get back to you within 24 hours to confirm your consultation.",
    });

    setFormData({ name: '', email: '', company: '', website: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Book a Consultation"
        description="Schedule a free discovery call or strategy session to discuss your UI/UX needs."
        keywords={[
          'UX consultation',
          'UI review consultation',
          'design consultation',
          'book a call',
        ]}
      />
      <PublicHeader />

      <main className="pt-20">
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Book a Consultation
              </h1>
              <p className="text-lg text-muted-foreground">
                Let's discuss how we can improve your product's user experience. Choose a
                consultation type and submit your request.
              </p>
            </motion.div>

            {/*
              TODO: Cal.com / Calendly Integration
              =====================================
              1. Create a Cal.com or Calendly account
              2. Set up event types matching consultationTypes:
                 - Discovery Call (15 min, free)
                 - Strategy Session (45 min, $150)
                 - Audit Review (60 min, included with tier)
              3. Add calendar embed or use their API:

              Option A - Embed (simpler):
              <Cal calLink="your-username/discovery-call" />

              Option B - API Integration:
              - Add CALENDLY_API_KEY or CAL_API_KEY to secrets
              - Create edge function to fetch availability
              - Show available slots in the booking form

              4. Configure webhook for booking confirmations
              5. Optional: Add Stripe integration for paid sessions
            */}

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Consultation Types */}
              <div>
                <h2 className="text-xl font-display font-semibold mb-6">
                  Select Consultation Type
                </h2>
                <div className="space-y-4">
                  {consultationTypes.map((type, index) => (
                    <motion.div
                      key={type.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all ${
                          selectedType === type.id
                            ? 'border-primary shadow-lg'
                            : 'border-border/50 hover:border-border'
                        }`}
                        onClick={() => setSelectedType(type.id)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `hsl(var(--${type.color}) / 0.1)` }}
                              >
                                <type.icon
                                  className="h-5 w-5"
                                  style={{ color: `hsl(var(--${type.color}))` }}
                                />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{type.title}</CardTitle>
                                <div className="flex items-center gap-2 mt-1">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">
                                    {type.duration}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              {type.free && (
                                <span className="text-sm font-semibold text-jules-green">Free</span>
                              )}
                              {type.price && (
                                <span className="text-sm font-semibold">{type.price}</span>
                              )}
                              {type.included && (
                                <span className="text-xs text-muted-foreground">
                                  {type.included}
                                </span>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>{type.description}</CardDescription>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Calendar Embed Placeholder */}
                <div className="mt-8 p-6 rounded-lg bg-muted/20 border border-dashed border-border/50">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block w-2 h-2 rounded-full bg-jules-cyan animate-pulse" />
                    <span className="text-sm font-medium">Calendar Integration Coming Soon</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Real-time scheduling with Cal.com or Calendly will be available here.
                  </p>
                  {/* Placeholder for calendar embed: <CalEmbed calLink="username/event" /> */}
                </div>

                {/* Contact Info */}
                <div className="mt-4 p-6 rounded-lg bg-muted/30 border border-border/50">
                  <h3 className="font-semibold mb-4">Prefer email?</h3>
                  <a
                    href="mailto:hello@example.com"
                    className="flex items-center gap-2 text-jules-cyan hover:underline"
                  >
                    <Mail className="h-4 w-4" />
                    hello@example.com
                  </a>
                </div>
              </div>

              {/* Booking Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle>Request Your Consultation</CardTitle>
                    <CardDescription>
                      Fill out the form and we'll confirm your booking within 24 hours.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <Input
                            id="company"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            placeholder="Acme Inc."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website">Website/App URL</Label>
                          <Input
                            id="website"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            placeholder="https://example.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Tell us about your project *</Label>
                        <Textarea
                          id="message"
                          required
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Describe your product, current challenges, and what you hope to achieve..."
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-jules-cyan text-background hover:bg-jules-cyan/90"
                        disabled={isSubmitting}
                        size="lg"
                      >
                        {isSubmitting ? 'Submitting...' : 'Request Consultation'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
