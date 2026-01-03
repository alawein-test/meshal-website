/**
 * @file Pricing.tsx
 * @description Tiered pricing page for UI/UX audit services
 */
import { motion } from 'framer-motion';
import { Check, ArrowRight, Zap, Star, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PublicHeader } from '@/components/shared/PublicHeader';
import Footer from '@/components/Footer';
import { SEO } from '@/components/shared/SEO';

const tiers = [
  {
    id: 'basic',
    name: 'Basic Audit',
    price: '$499',
    description: 'Quick assessment for startups and small projects',
    timeline: '3-5 business days',
    icon: Zap,
    color: 'jules-cyan',
    popular: false,
    deliverables: [
      'Heuristic evaluation summary',
      'Top 10 critical issues identified',
      'Quick wins recommendations',
      'PDF report with screenshots',
      'Priority matrix',
    ],
    notIncluded: [
      'Accessibility testing',
      'Performance analysis',
      'Video walkthrough',
      'Follow-up consultation',
    ],
  },
  {
    id: 'comprehensive',
    name: 'Comprehensive Review',
    price: '$1,499',
    description: 'In-depth analysis for growing products',
    timeline: '7-10 business days',
    icon: Star,
    color: 'jules-magenta',
    popular: true,
    deliverables: [
      'Full heuristic evaluation',
      'Accessibility audit (WCAG 2.1 AA)',
      'User flow analysis',
      'Prioritized issue backlog',
      '30-minute video walkthrough',
      'Notion/Figma deliverables',
      'Implementation roadmap',
      '1x follow-up call',
    ],
    notIncluded: ['Design system audit', 'Security assessment', 'Performance benchmarks'],
  },
  {
    id: 'enterprise',
    name: 'Full Platform Overhaul',
    price: '$3,999',
    priceNote: 'Starting at',
    description: 'Complete transformation for enterprise products',
    timeline: '2-4 weeks',
    icon: Crown,
    color: 'jules-yellow',
    popular: false,
    deliverables: [
      'Everything in Comprehensive',
      'Design system audit & recommendations',
      'Performance benchmarks & optimization',
      'SEO & metadata review',
      'Security assessment',
      'Information architecture analysis',
      'Competitive UX analysis',
      'Custom implementation roadmap',
      '2x follow-up consultations',
      'Slack/Discord support channel',
    ],
    notIncluded: [],
  },
];

const faqs = [
  {
    question: 'What do I receive as deliverables?',
    answer:
      "Depending on your tier, you'll receive a comprehensive PDF report, prioritized issue backlog, video walkthroughs, and implementation roadmaps. Enterprise clients also get Notion/Figma workspaces.",
  },
  {
    question: 'How long does an audit take?',
    answer:
      'Basic audits take 3-5 business days, Comprehensive reviews take 7-10 days, and Full Platform Overhauls take 2-4 weeks depending on scope.',
  },
  {
    question: 'Can I upgrade my tier later?',
    answer:
      "Yes! If you start with a Basic Audit and want to expand, we'll credit your initial payment toward the higher tier.",
  },
  {
    question: 'Do you offer ongoing retainers?',
    answer:
      'Yes, we offer monthly retainer packages for ongoing UX consultation and periodic audits. Contact us for custom pricing.',
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Pricing - UI/UX Audit Services"
        description="Choose the right audit package for your project. From quick assessments to full platform overhauls, we have a solution for every need."
        keywords={[
          'UI audit pricing',
          'UX review cost',
          'accessibility audit pricing',
          'design system review',
        ]}
      />
      <PublicHeader />

      <main className="pt-20">
        {/* Header */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Simple, Transparent Pricing
              </h1>
              <p className="text-lg text-muted-foreground">
                Choose the audit package that fits your needs. Every tier includes actionable
                recommendations and clear implementation guidance.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="pb-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-3 gap-8">
              {tiers.map((tier, index) => (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="bg-jules-magenta text-white px-4 py-1">Most Popular</Badge>
                    </div>
                  )}

                  <Card
                    className={`h-full flex flex-col ${
                      tier.popular
                        ? 'border-jules-magenta/50 shadow-lg shadow-jules-magenta/10'
                        : 'border-border/50'
                    }`}
                  >
                    <CardHeader className="text-center pb-4">
                      <div
                        className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center"
                        style={{ backgroundColor: `hsl(var(--${tier.color}) / 0.1)` }}
                      >
                        <tier.icon
                          className="h-7 w-7"
                          style={{ color: `hsl(var(--${tier.color}))` }}
                        />
                      </div>
                      <CardTitle className="text-2xl font-display">{tier.name}</CardTitle>
                      <CardDescription>{tier.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1">
                      <div className="text-center mb-6">
                        {tier.priceNote && (
                          <span className="text-sm text-muted-foreground">{tier.priceNote}</span>
                        )}
                        <div className="text-4xl font-bold font-display">{tier.price}</div>
                        <span className="text-sm text-muted-foreground">{tier.timeline}</span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                            What's Included
                          </h4>
                          <ul className="space-y-2">
                            {tier.deliverables.map((item) => (
                              <li key={item} className="flex items-start gap-2 text-sm">
                                <Check className="h-4 w-4 text-jules-green shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {tier.notIncluded.length > 0 && (
                          <div className="pt-4 border-t border-border/50">
                            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                              Not Included
                            </h4>
                            <ul className="space-y-2">
                              {tier.notIncluded.map((item) => (
                                <li
                                  key={item}
                                  className="flex items-start gap-2 text-sm text-muted-foreground"
                                >
                                  <span className="text-muted-foreground/50">—</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="pt-6">
                      <Link to="/book" className="w-full">
                        <Button
                          className={`w-full ${
                            tier.popular ? 'bg-jules-magenta hover:bg-jules-magenta/90' : ''
                          }`}
                          variant={tier.popular ? 'default' : 'outline'}
                          size="lg"
                        >
                          Get Started
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-6 bg-muted/30">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-display font-bold mb-4">Frequently Asked Questions</h2>
            </motion.div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Payment Integration Placeholder */}
        {/*
          TODO: Stripe Payment Integration
          ================================
          1. Enable Stripe via Lovable's Stripe integration
          2. Create products/prices in Stripe Dashboard for each tier:
             - Basic Audit: $499 (one-time)
             - Comprehensive Review: $1,499 (one-time)
             - Full Platform Overhaul: $3,999+ (one-time)
          3. Add STRIPE_SECRET_KEY to project secrets
          4. Create checkout session edge function
          5. Replace "Get Started" buttons with Stripe checkout

          Example implementation:
          - Create edge function: supabase/functions/create-checkout/index.ts
          - Add Stripe webhook handler for payment confirmation
          - Update button to call checkout API with tier.id
        */}
        <section className="py-12 px-6 bg-muted/20 border-y border-dashed border-border/50">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span className="inline-block w-2 h-2 rounded-full bg-jules-yellow animate-pulse" />
              <span>Stripe payment integration coming soon — book a call to get started</span>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-display font-bold mb-4">Need a Custom Package?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Have specific requirements or need ongoing support? Let's discuss a tailored
                solution for your organization.
              </p>
              <Link to="/book">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-jules-cyan/50 text-jules-cyan hover:bg-jules-cyan/10"
                >
                  Schedule a Call
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
