import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Eye, Ear, Hand, Brain, ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PublicHeader, SEO } from '@/components/shared';
import Footer from '@/components/Footer';

const wcagCategories = [
  {
    icon: Eye,
    title: 'Perceivable',
    items: [
      'Text alternatives for images',
      'Captions and transcripts',
      'Color contrast ratios',
      'Responsive text sizing',
    ],
  },
  {
    icon: Hand,
    title: 'Operable',
    items: ['Keyboard navigation', 'Focus management', 'Skip links', 'Touch target sizes'],
  },
  {
    icon: Brain,
    title: 'Understandable',
    items: ['Clear language', 'Predictable navigation', 'Input assistance', 'Error identification'],
  },
  {
    icon: Shield,
    title: 'Robust',
    items: [
      'Valid HTML markup',
      'ARIA implementation',
      'Screen reader compatibility',
      'Assistive tech support',
    ],
  },
];

const testingMethods = [
  'Automated WCAG 2.1 scanning',
  'Manual keyboard navigation testing',
  'Screen reader testing (NVDA, VoiceOver)',
  'Color contrast analysis',
  'Focus order verification',
  'Form accessibility review',
];

const AccessibilityAudit = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Accessibility Audit"
        description="Comprehensive WCAG 2.1 AA/AAA accessibility audit. Ensure your digital products are accessible to all users."
        keywords={['accessibility audit', 'WCAG', 'a11y', 'screen reader', 'ADA compliance']}
      />
      <PublicHeader />

      <main className="container px-4 pt-24 pb-16 max-w-4xl mx-auto">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Services
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Ear className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-mono text-primary">WCAG 2.1 Compliant</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">Accessibility Audit</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Ensure your digital products are accessible to everyone, including users with
            disabilities. We test against WCAG 2.1 AA and AAA standards.
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">WCAG 2.1 Categories</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {wcagCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    key={category.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    <Card className="h-full border-border/50 bg-card/50">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <h3 className="font-bold text-lg">{category.title}</h3>
                        </div>
                        <ul className="space-y-2">
                          {category.items.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Testing Methodology</h2>
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <ul className="grid md:grid-cols-2 gap-3">
                  {testingMethods.map((method) => (
                    <li key={method} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{method}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          <section className="mb-12 p-6 bg-secondary/30 rounded-xl">
            <h2 className="text-xl font-bold mb-3">Why Accessibility Matters</h2>
            <p className="text-muted-foreground mb-4">
              Over 1 billion people worldwide have disabilities. An accessible website not only
              serves this community but also improves SEO, mobile usability, and overall user
              experience for everyone.
            </p>
            <p className="text-sm text-muted-foreground">
              Many countries have legal requirements for digital accessibility, including the ADA
              (US), EAA (EU), and AODA (Canada).
            </p>
          </section>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg">
              <Link to="/pricing">
                View Pricing <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/book">Book Consultation</Link>
            </Button>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default AccessibilityAudit;
