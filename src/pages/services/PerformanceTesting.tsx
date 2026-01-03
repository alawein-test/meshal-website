import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  Gauge,
  Smartphone,
  Zap,
  BarChart3,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PublicHeader, SEO } from '@/components/shared';
import Footer from '@/components/Footer';

const metrics = [
  {
    name: 'Largest Contentful Paint (LCP)',
    target: '< 2.5s',
    description: 'Measures loading performance - when the main content becomes visible.',
  },
  {
    name: 'First Input Delay (FID)',
    target: '< 100ms',
    description: 'Measures interactivity - time until the page responds to user input.',
  },
  {
    name: 'Cumulative Layout Shift (CLS)',
    target: '< 0.1',
    description: 'Measures visual stability - how much the page layout shifts unexpectedly.',
  },
  {
    name: 'Time to First Byte (TTFB)',
    target: '< 800ms',
    description: 'Measures server response time - how quickly the server starts sending data.',
  },
];

const testingAreas = [
  {
    icon: Gauge,
    title: 'Core Web Vitals',
    description: "Google's essential metrics for page experience and SEO ranking.",
  },
  {
    icon: Smartphone,
    title: 'Mobile Performance',
    description: 'Testing on real devices and throttled connections.',
  },
  {
    icon: Zap,
    title: 'Load Time Analysis',
    description: 'Bundle size, resource loading, and critical path optimization.',
  },
  {
    icon: BarChart3,
    title: 'Benchmarking',
    description: 'Compare against industry standards and competitors.',
  },
];

const deliverables = [
  'Lighthouse audit reports (mobile & desktop)',
  'Core Web Vitals analysis',
  'Bundle size breakdown',
  'Network waterfall analysis',
  'Image optimization recommendations',
  'Caching strategy review',
  'Third-party script impact assessment',
  'Performance budget recommendations',
];

const PerformanceTesting = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Performance Testing"
        description="Comprehensive web performance testing including Core Web Vitals, Lighthouse audits, and load time optimization."
        keywords={[
          'performance testing',
          'Core Web Vitals',
          'page speed',
          'Lighthouse',
          'web performance',
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Performance Testing</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Analyze and optimize your application's speed, responsiveness, and overall performance
            for better user experience and SEO.
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Core Web Vitals</h2>
            <div className="grid gap-4">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <Card className="border-border/50 bg-card/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold mb-1">{metric.name}</h3>
                          <p className="text-sm text-muted-foreground">{metric.description}</p>
                        </div>
                        <span className="text-primary font-mono font-bold whitespace-nowrap">
                          {metric.target}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Testing Areas</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {testingAreas.map((area, index) => {
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
                        <div className="p-2 bg-primary/10 rounded-lg w-fit mb-4">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">{area.title}</h3>
                        <p className="text-sm text-muted-foreground">{area.description}</p>
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

export default PerformanceTesting;
