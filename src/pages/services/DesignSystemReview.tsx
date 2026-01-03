import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Palette, Layers, Code, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PublicHeader, SEO } from '@/components/shared';
import Footer from '@/components/Footer';

const reviewAreas = [
  {
    icon: Palette,
    title: 'Visual Consistency',
    items: [
      'Color palette adherence',
      'Typography scale usage',
      'Spacing and grid consistency',
      'Icon style uniformity',
    ],
  },
  {
    icon: Layers,
    title: 'Component Architecture',
    items: [
      'Component composition patterns',
      'Variant coverage',
      'Props API design',
      'Reusability assessment',
    ],
  },
  {
    icon: Code,
    title: 'Implementation Quality',
    items: [
      'Token usage in code',
      'CSS/Tailwind consistency',
      'Naming conventions',
      'Technical debt analysis',
    ],
  },
  {
    icon: FileText,
    title: 'Documentation',
    items: [
      'Component documentation',
      'Usage guidelines',
      'Pattern libraries',
      'Contribution guides',
    ],
  },
];

const deliverables = [
  'Design system health scorecard',
  'Component inventory audit',
  'Inconsistency catalog with screenshots',
  'Token optimization recommendations',
  'Documentation gap analysis',
  'Scalability assessment',
  'Migration roadmap (if applicable)',
];

const DesignSystemReview = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Design System Review"
        description="Comprehensive audit of your design system for consistency, scalability, and implementation quality."
        keywords={[
          'design system',
          'component library',
          'UI consistency',
          'design tokens',
          'style guide',
        ]}
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Design System Review</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Evaluate your design system's health, consistency, and scalability to ensure it supports
            your product's growth.
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Review Areas</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {reviewAreas.map((area, index) => {
                const Icon = area.icon;
                return (
                  <motion.div
                    key={area.title}
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
                          <h3 className="font-bold text-lg">{area.title}</h3>
                        </div>
                        <ul className="space-y-2">
                          {area.items.map((item) => (
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
            <h2 className="text-2xl font-bold mb-6">Deliverables</h2>
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <ul className="grid md:grid-cols-2 gap-3">
                  {deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          <section className="mb-12 p-6 bg-secondary/30 rounded-xl">
            <h2 className="text-xl font-bold mb-3">Why Design Systems Matter</h2>
            <p className="text-muted-foreground">
              A well-maintained design system reduces design and development time by up to 50%,
              ensures brand consistency across products, and significantly improves collaboration
              between design and engineering teams.
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

export default DesignSystemReview;
