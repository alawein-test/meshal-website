import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  GitBranch,
  Target,
  TrendingUp,
  Users,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PublicHeader, SEO } from '@/components/shared';
import Footer from '@/components/Footer';

const analysisAreas = [
  {
    icon: GitBranch,
    title: 'Task Flow Mapping',
    description:
      'Document every step users take to complete key tasks, identifying friction points and unnecessary complexity.',
  },
  {
    icon: Target,
    title: 'Drop-off Analysis',
    description:
      'Identify where users abandon flows and understand why conversions fail at critical moments.',
  },
  {
    icon: TrendingUp,
    title: 'Conversion Optimization',
    description:
      'Recommendations to streamline paths and increase completion rates for business-critical flows.',
  },
  {
    icon: Users,
    title: 'User Journey Mapping',
    description:
      'Understand the complete user experience across touchpoints, from awareness to advocacy.',
  },
];

const deliverables = [
  'User flow diagrams for key tasks',
  'Drop-off point identification',
  'Friction analysis report',
  'Conversion funnel visualization',
  'Prioritized optimization recommendations',
  'A/B testing suggestions',
  'Competitor flow comparison',
];

const UserFlowAnalysis = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="User Flow Analysis"
        description="Analyze user journeys and task flows to identify friction, drop-off points, and conversion optimization opportunities."
        keywords={[
          'user flow',
          'UX analysis',
          'conversion optimization',
          'user journey',
          'task analysis',
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">User Flow Analysis</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Map, analyze, and optimize the paths users take through your product to maximize
            conversions and satisfaction.
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">What We Analyze</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {analysisAreas.map((area, index) => {
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

          <section className="mb-12 p-6 bg-secondary/30 rounded-xl">
            <h2 className="text-xl font-bold mb-3">The Impact of Flow Optimization</h2>
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-1">23%</div>
                <div className="text-sm text-muted-foreground">Average conversion lift</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">40%</div>
                <div className="text-sm text-muted-foreground">Reduced task time</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">2x</div>
                <div className="text-sm text-muted-foreground">User satisfaction</div>
              </div>
            </div>
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

export default UserFlowAnalysis;
