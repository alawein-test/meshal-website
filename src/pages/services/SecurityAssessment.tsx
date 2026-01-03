/**
 * @file SecurityAssessment.tsx
 * @description Frontend Security Assessment service detail page
 */
import { motion } from 'framer-motion';
import {
  Shield,
  ArrowRight,
  CheckCircle2,
  Lock,
  Eye,
  AlertTriangle,
  FileSearch,
  KeyRound,
  Bug,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PublicHeader } from '@/components/shared/PublicHeader';
import Footer from '@/components/Footer';
import { SEO } from '@/components/shared/SEO';

const securityAreas = [
  {
    icon: Bug,
    title: 'XSS Prevention',
    description: 'Cross-site scripting vulnerability detection and prevention strategies',
  },
  {
    icon: Lock,
    title: 'CSRF Protection',
    description: 'Cross-site request forgery analysis and token validation review',
  },
  {
    icon: Eye,
    title: 'Data Exposure',
    description: 'Sensitive data leakage detection in client-side code and network requests',
  },
  {
    icon: KeyRound,
    title: 'Authentication Flows',
    description: 'Login, session management, and token handling security review',
  },
  {
    icon: FileSearch,
    title: 'Dependency Audit',
    description: 'Third-party library vulnerability scanning and risk assessment',
  },
  {
    icon: AlertTriangle,
    title: 'Content Security Policy',
    description: 'CSP header analysis and security configuration recommendations',
  },
];

const methodology = [
  {
    phase: '01',
    title: 'Reconnaissance',
    description: 'Map attack surface, identify entry points, and catalog client-side assets',
  },
  {
    phase: '02',
    title: 'Automated Scanning',
    description:
      'Run security scanners for known vulnerabilities, outdated dependencies, and misconfigurations',
  },
  {
    phase: '03',
    title: 'Manual Testing',
    description: 'Hands-on testing for XSS, injection attacks, and authentication bypass attempts',
  },
  {
    phase: '04',
    title: 'Code Review',
    description:
      'Static analysis of authentication logic, data handling, and security-critical code paths',
  },
  {
    phase: '05',
    title: 'Risk Assessment',
    description: 'Categorize findings by severity, exploitability, and business impact',
  },
  {
    phase: '06',
    title: 'Remediation Guide',
    description: 'Detailed fix recommendations with code examples and implementation priority',
  },
];

const deliverables = [
  'Executive summary with risk overview',
  'Detailed vulnerability report with severity ratings',
  'Proof-of-concept demonstrations for critical issues',
  'Security header configuration recommendations',
  'Dependency upgrade roadmap',
  'Code-level fix recommendations',
  'Security best practices checklist',
  'Follow-up verification testing',
];

export default function SecurityAssessment() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Security Assessment - Frontend Security Audit"
        description="Comprehensive frontend security audit covering XSS, CSRF, data exposure, and authentication vulnerabilities. Protect your users and data."
        keywords={[
          'security audit',
          'XSS testing',
          'CSRF protection',
          'frontend security',
          'vulnerability assessment',
          'penetration testing',
        ]}
      />
      <PublicHeader />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-jules-cyan/10 via-transparent to-transparent" />

          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
              >
                ← Back to Services
              </Link>

              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'hsl(var(--jules-cyan) / 0.1)' }}
                >
                  <Shield className="h-8 w-8 text-jules-cyan" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-display font-bold">
                    Security Assessment
                  </h1>
                  <p className="text-xl text-muted-foreground mt-2">Frontend Security Audit</p>
                </div>
              </div>

              <p className="text-lg text-muted-foreground mb-8">
                Protect your users and data with a comprehensive frontend security audit. We
                identify XSS vulnerabilities, CSRF risks, data exposure issues, and authentication
                weaknesses before attackers do.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/pricing">
                  <Button
                    size="lg"
                    className="bg-jules-cyan text-background hover:bg-jules-cyan/90"
                  >
                    View Pricing
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/book">
                  <Button size="lg" variant="outline">
                    Book Consultation
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Security Areas */}
        <section className="py-20 px-6 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">What We Analyze</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Comprehensive coverage of frontend security vulnerabilities and risks
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {securityAreas.map((area, index) => (
                <motion.div
                  key={area.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full bg-card/50 border-border/50">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-jules-cyan/10 mb-4">
                        <area.icon className="h-6 w-6 text-jules-cyan" />
                      </div>
                      <CardTitle className="text-lg">{area.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{area.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Our Methodology</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A systematic approach to identifying and prioritizing security vulnerabilities
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {methodology.map((step, index) => (
                <motion.div
                  key={step.phase}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <Card className="h-full bg-card/50 border-border/50">
                    <CardHeader>
                      <span className="text-4xl font-display font-bold text-jules-cyan/20">
                        {step.phase}
                      </span>
                      <CardTitle className="text-lg mt-2">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{step.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Deliverables */}
        <section className="py-20 px-6 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-display font-bold mb-4">What You Receive</h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-card/50 border-border/50">
                <CardContent className="pt-6">
                  <ul className="grid md:grid-cols-2 gap-4">
                    {deliverables.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-jules-green shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
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
                Protect Your Application
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Don't wait for a security incident. Get a comprehensive assessment and fix
                vulnerabilities before they're exploited.
              </p>
              <Link to="/book">
                <Button size="lg" className="bg-jules-cyan text-background hover:bg-jules-cyan/90">
                  Schedule Security Audit
                  <ArrowRight className="ml-2 h-4 w-4" />
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
