import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, FileText, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PublicHeader, SEO } from '@/components/shared';
import Footer from '@/components/Footer';

const heuristics = [
  {
    name: 'Visibility of System Status',
    description: 'Users should always know what is happening through appropriate feedback.',
  },
  {
    name: 'Match Between System and Real World',
    description: 'Use familiar language, concepts, and conventions that users understand.',
  },
  {
    name: 'User Control and Freedom',
    description: 'Provide clear exits and undo/redo functionality for user mistakes.',
  },
  {
    name: 'Consistency and Standards',
    description: 'Follow platform conventions and maintain internal consistency.',
  },
  { name: 'Error Prevention', description: 'Design to prevent problems before they occur.' },
  {
    name: 'Recognition Rather Than Recall',
    description: 'Minimize memory load by making options visible and accessible.',
  },
  {
    name: 'Flexibility and Efficiency',
    description: 'Accommodate both novice and expert users with shortcuts.',
  },
  {
    name: 'Aesthetic and Minimalist Design',
    description: 'Remove irrelevant information that competes with essential content.',
  },
  {
    name: 'Error Recovery',
    description: 'Help users recognize, diagnose, and recover from errors.',
  },
  {
    name: 'Help and Documentation',
    description: 'Provide accessible help that is easy to search and task-focused.',
  },
];

const deliverables = [
  'Comprehensive heuristic analysis report',
  'Severity-rated issue catalog',
  'Annotated screenshots with findings',
  'Prioritized recommendations matrix',
  'Quick wins vs long-term improvements',
  'Video walkthrough of key issues',
];

const HeuristicEvaluation = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Heuristic Evaluation"
        description="Expert UI/UX heuristic evaluation based on Nielsen's 10 usability heuristics. Identify usability issues and improve user experience."
        keywords={[
          'heuristic evaluation',
          'usability',
          'Nielsen heuristics',
          'UX audit',
          'user experience',
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Heuristic Evaluation</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Systematic inspection of your interface against Nielsen's 10 usability heuristics to
            uncover usability issues.
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <div className="flex items-center gap-2 text-sm bg-secondary/50 px-4 py-2 rounded-full">
              <Clock className="w-4 h-4" />
              3-5 business days
            </div>
            <div className="flex items-center gap-2 text-sm bg-secondary/50 px-4 py-2 rounded-full">
              <FileText className="w-4 h-4" />
              Detailed PDF report
            </div>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">The 10 Heuristics We Evaluate</h2>
            <div className="grid gap-4">
              {heuristics.map((heuristic, index) => (
                <motion.div
                  key={heuristic.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                >
                  <Card className="border-border/50 bg-card/50">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <span className="text-primary font-mono font-bold">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <h3 className="font-semibold mb-1">{heuristic.name}</h3>
                          <p className="text-sm text-muted-foreground">{heuristic.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">What You'll Receive</h2>
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <ul className="space-y-3">
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

export default HeuristicEvaluation;
