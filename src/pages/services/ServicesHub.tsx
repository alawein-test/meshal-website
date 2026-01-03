/**
 * @file ServicesHub.tsx
 * @description Main services landing page showcasing UI/UX audit and consulting services
 */
import { motion } from 'framer-motion';
import {
  Search,
  Accessibility,
  Route,
  Palette,
  Gauge,
  Shield,
  ArrowRight,
  CheckCircle2,
  Star,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageLayout, HubHeader } from '@/components/shared';

const services = [
  {
    id: 'heuristic',
    title: 'Heuristic Evaluation',
    description: "Expert analysis using Nielsen's 10 usability heuristics to identify UX issues.",
    icon: Search,
    color: 'jules-cyan',
    features: ['Systematic UI review', 'Prioritized issue list', 'Quick wins identification'],
    href: '/services/heuristic',
  },
  {
    id: 'accessibility',
    title: 'Accessibility Audit',
    description: 'WCAG 2.1 AA/AAA compliance testing with automated and manual verification.',
    icon: Accessibility,
    color: 'jules-magenta',
    features: ['Screen reader testing', 'Color contrast analysis', 'Keyboard navigation'],
    href: '/services/accessibility',
  },
  {
    id: 'user-flow',
    title: 'User Flow Analysis',
    description: 'Map user journeys, identify drop-off points, and optimize conversion paths.',
    icon: Route,
    color: 'jules-yellow',
    features: ['Task completion mapping', 'Friction point detection', 'Conversion optimization'],
    href: '/services/user-flow',
  },
  {
    id: 'design-review',
    title: 'Design System Review',
    description: 'Audit component consistency, token usage, and documentation completeness.',
    icon: Palette,
    color: 'jules-purple',
    features: ['Component consistency', 'Token validation', 'Scalability assessment'],
    href: '/services/design-review',
  },
  {
    id: 'performance',
    title: 'Performance Testing',
    description: 'Core Web Vitals analysis, Lighthouse audits, and load testing.',
    icon: Gauge,
    color: 'jules-green',
    features: ['Core Web Vitals', 'Mobile performance', 'Load time optimization'],
    href: '/services/performance',
  },
  {
    id: 'security',
    title: 'Security Assessment',
    description: 'Frontend security audit covering XSS, CSRF, and data exposure risks.',
    icon: Shield,
    color: 'jules-cyan',
    features: ['Vulnerability scanning', 'Auth flow review', 'Data protection'],
    href: '/services/security',
  },
];

const testimonials = [
  {
    quote:
      'The comprehensive audit helped us reduce our bounce rate by 40% and improve accessibility scores.',
    author: 'Sarah Chen',
    role: 'Product Lead, TechStartup',
    rating: 5,
  },
  {
    quote: 'Detailed, actionable recommendations that our team could implement immediately.',
    author: 'Marcus Johnson',
    role: 'CTO, SaaS Platform',
    rating: 5,
  },
];

export default function ServicesHub() {
  return (
    <PageLayout
      title="UI/UX Audit & Consulting Services"
      description="Professional UI/UX critique, accessibility audits, and platform reviews. Get actionable insights to improve your digital products."
      keywords={[
        'UI audit',
        'UX review',
        'accessibility audit',
        'WCAG compliance',
        'design system review',
        'usability testing',
      ]}
      includeContainer={false}
    >
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-jules-purple/10 via-transparent to-transparent" />

          <div className="container mx-auto max-w-6xl relative z-10">
            <HubHeader
              title="Transform Your Digital Experience"
              description="Get actionable insights from comprehensive audits covering usability, accessibility, performance, and design systems. Elevate your product with data-driven recommendations."
              primaryColor="cyan"
              secondaryColor="magenta"
              align="center"
              size="large"
              badge={
                <>
                  <Sparkles className="h-4 w-4 text-jules-cyan" />
                  <span className="text-sm font-mono text-jules-cyan">Expert UI/UX Services</span>
                </>
              }
              className="mb-8"
            />

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pricing">
                <Button size="lg" className="bg-jules-cyan text-background hover:bg-jules-cyan/90">
                  View Pricing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/book">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-jules-magenta/50 text-jules-magenta hover:bg-jules-magenta/10"
                >
                  Book Consultation
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Comprehensive Service Offerings
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From quick usability reviews to full platform overhauls, we provide the expertise
                you need to create exceptional user experiences.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full bg-card/50 border-border/50 hover:border-primary/30 transition-all duration-300 group">
                    <CardHeader>
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-${service.color}/10 group-hover:bg-${service.color}/20 transition-colors`}
                        style={{
                          backgroundColor: `hsl(var(--${service.color}) / 0.1)`,
                        }}
                      >
                        <service.icon
                          className="h-6 w-6"
                          style={{ color: `hsl(var(--${service.color}))` }}
                        />
                      </div>
                      <CardTitle className="text-xl font-display">{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-4">
                        {service.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <CheckCircle2 className="h-4 w-4 text-jules-green" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      {service.href && (
                        <Link to={service.href}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full group-hover:text-primary"
                          >
                            Learn More
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-6 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-display font-bold mb-4">Client Success Stories</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.author}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-card/50 border-border/50">
                    <CardContent className="pt-6">
                      <div className="flex gap-1 mb-4">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-jules-yellow text-jules-yellow" />
                        ))}
                      </div>
                      <blockquote className="text-lg mb-4 italic">"{testimonial.quote}"</blockquote>
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center p-12 rounded-2xl border border-jules-cyan/20 bg-gradient-to-b from-jules-cyan/5 to-transparent"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Ready to Improve Your Product?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Schedule a free 15-minute consultation to discuss your needs and find the right
                service tier for your project.
              </p>
              <Link to="/pricing">
                <Button size="lg" className="bg-jules-cyan text-background hover:bg-jules-cyan/90">
                  Get Started Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}
