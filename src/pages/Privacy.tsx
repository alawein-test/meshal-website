/**
 * @file Privacy.tsx
 * @description Privacy Policy page for GDPR and data protection compliance
 */
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Mail, Clock, Database, Lock, Globe, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';

const lastUpdated = 'December 10, 2025';
const companyName = 'Alawein Platform';
const contactEmail = 'privacy@alawein.dev'; // TODO: Update with actual email

interface PolicySection {
  icon: React.ElementType;
  title: string;
  content: string[];
}

const policySections: PolicySection[] = [
  {
    icon: Database,
    title: '1. Information We Collect',
    content: [
      'Account Information: When you create an account, we collect your email address, name, and password (encrypted).',
      'Usage Data: We collect information about how you use our services, including simulations run, features accessed, and API calls made.',
      'Technical Data: Device information, IP address, browser type, and operating system for security and analytics.',
      'Payment Information: Billing details are processed securely through Stripe; we do not store credit card numbers.',
      'Communications: Any messages you send to our support team or through feedback forms.',
    ],
  },
  {
    icon: Lock,
    title: '2. How We Use Your Information',
    content: [
      'To provide and maintain our scientific computing services',
      'To process your transactions and manage your subscription',
      'To communicate with you about updates, security alerts, and support',
      'To improve our services through aggregated, anonymized analytics',
      'To detect and prevent fraud, abuse, and security incidents',
      'To comply with legal obligations and enforce our terms',
    ],
  },
  {
    icon: Users,
    title: '3. Information Sharing',
    content: [
      'We do not sell your personal information to third parties.',
      'Service Providers: We share data with trusted providers (Supabase, Stripe, Resend) who help operate our services.',
      'Legal Requirements: We may disclose information when required by law or to protect our rights.',
      'Business Transfers: In the event of a merger or acquisition, your data may be transferred to the new entity.',
      'With Your Consent: We may share information when you explicitly authorize us to do so.',
    ],
  },
  {
    icon: Shield,
    title: '4. Data Security',
    content: [
      'All data is encrypted in transit using TLS 1.3 and at rest using AES-256.',
      'We implement row-level security policies to ensure data isolation.',
      'Regular security audits and penetration testing are conducted.',
      'Access to user data is restricted to authorized personnel only.',
      'We use secure authentication with JWT tokens and rate limiting.',
    ],
  },
  {
    icon: Globe,
    title: '5. Your Rights (GDPR)',
    content: [
      'Access: Request a copy of your personal data we hold.',
      'Rectification: Request correction of inaccurate data.',
      'Erasure: Request deletion of your data ("right to be forgotten").',
      'Portability: Receive your data in a machine-readable format.',
      'Object: Object to processing based on legitimate interests.',
      'Restrict: Request restricted processing under certain conditions.',
      'To exercise these rights, contact us at privacy@alawein.dev.',
    ],
  },
  {
    icon: Clock,
    title: '6. Data Retention',
    content: [
      'Active accounts: Data is retained while your account is active.',
      'Deleted accounts: Personal data is deleted within 30 days of account deletion.',
      'Simulations: Simulation data is retained according to your subscription tier.',
      'Logs: Security and access logs are retained for 90 days.',
      'Legal requirements: Some data may be retained longer for legal compliance.',
    ],
  },
];

export default function Privacy() {
  return (
    <>
      <SEOHead
        title="Privacy Policy"
        description="Learn how Alawein Platform collects, uses, and protects your personal information."
        keywords={['privacy policy', 'data protection', 'GDPR', 'data security']}
      />
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-12">
            <Link to="/">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
            <p className="text-muted-foreground mt-4">
              At {companyName}, we are committed to protecting your privacy and ensuring the
              security of your personal information. This policy explains how we collect, use, and
              safeguard your data.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-6">
            {policySections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <Icon className="w-5 h-5 text-primary" />
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {section.content.map((item, i) => (
                          <li
                            key={i}
                            className="text-sm text-muted-foreground flex items-start gap-2"
                          >
                            <span className="text-primary mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Contact Section */}
          <Card className="mt-8 border-primary/20 bg-primary/5">
            <CardContent className="flex items-center gap-4 py-6">
              <Mail className="w-8 h-8 text-primary" />
              <div>
                <p className="font-medium">Questions about privacy?</p>
                <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">
                  {contactEmail}
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
