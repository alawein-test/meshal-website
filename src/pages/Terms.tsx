import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  Shield,
  CreditCard,
  Database,
  Code,
  AlertTriangle,
  Scale,
  RefreshCw,
} from 'lucide-react';
import { PageLayout } from '@/components/shared/PageLayout';

const LAST_UPDATED = '2025-12-10';
const EFFECTIVE_DATE = '2025-12-10';

interface TermSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const Terms = () => {
  const sections: TermSection[] = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      icon: <FileText className="h-5 w-5" />,
      content: (
        <div className="space-y-3 text-muted-foreground">
          <p>
            By accessing or using the Alawein Platform ("Platform"), including SimCore, MEZAN,
            TalAI, OptiLibria, and QMLab services, you agree to be bound by these Terms of Service
            ("Terms"). If you disagree with any part of these terms, you may not access the
            Platform.
          </p>
          <p>
            These Terms apply to all visitors, users, and others who access or use the Platform. By
            using our services, you represent that you are at least 18 years old or have parental
            consent.
          </p>
        </div>
      ),
    },
    {
      id: 'services',
      title: '2. Description of Services',
      icon: <Code className="h-5 w-5" />,
      content: (
        <div className="space-y-3 text-muted-foreground">
          <p>The Platform provides scientific computing and research tools including:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>
              <strong>SimCore:</strong> Scientific simulation management and execution
            </li>
            <li>
              <strong>MEZAN:</strong> Workflow automation and process orchestration
            </li>
            <li>
              <strong>TalAI:</strong> AI-powered research assistance and experiment tracking
            </li>
            <li>
              <strong>OptiLibria:</strong> Optimization algorithm playground and analysis
            </li>
            <li>
              <strong>QMLab:</strong> Quantum mechanics simulation and visualization
            </li>
          </ul>
          <p>
            We reserve the right to modify, suspend, or discontinue any aspect of the Platform at
            any time with reasonable notice to users.
          </p>
        </div>
      ),
    },
    {
      id: 'accounts',
      title: '3. User Accounts & Security',
      icon: <Shield className="h-5 w-5" />,
      content: (
        <div className="space-y-3 text-muted-foreground">
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and
            for all activities that occur under your account. You agree to:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Provide accurate and complete registration information</li>
            <li>Maintain and promptly update your account information</li>
            <li>Notify us immediately of any unauthorized access</li>
            <li>Not share your account credentials with third parties</li>
          </ul>
          <p>
            We reserve the right to suspend or terminate accounts that violate these Terms or engage
            in fraudulent, abusive, or illegal activity.
          </p>
        </div>
      ),
    },
    {
      id: 'data',
      title: '4. Data Ownership & Usage Rights',
      icon: <Database className="h-5 w-5" />,
      content: (
        <div className="space-y-3 text-muted-foreground">
          <p>
            <strong>Your Data:</strong> You retain all ownership rights to data you upload, create,
            or generate using the Platform ("User Data"). We do not claim ownership of your research
            data, simulations, or results.
          </p>
          <p>
            <strong>License Grant:</strong> You grant us a limited, non-exclusive license to
            process, store, and display your User Data solely for the purpose of providing and
            improving our services.
          </p>
          <p>
            <strong>AI Training:</strong> With your explicit consent, anonymized usage patterns may
            be used to improve our AI systems. You can opt out at any time via Settings. See our
            <a href="/transparency" className="text-primary hover:underline mx-1">
              Transparency Report
            </a>
            for details.
          </p>
        </div>
      ),
    },
    {
      id: 'api',
      title: '5. API Usage & Rate Limits',
      icon: <Code className="h-5 w-5" />,
      content: (
        <div className="space-y-3 text-muted-foreground">
          <p>Access to our APIs is subject to the following conditions:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>API access is provided "as-is" for legitimate Platform usage</li>
            <li>Rate limits apply based on your subscription tier</li>
            <li>Automated scraping or bulk data extraction is prohibited</li>
            <li>API keys must be kept confidential and not shared</li>
            <li>We reserve the right to revoke API access for abuse</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'payment',
      title: '6. Payments & Subscriptions',
      icon: <CreditCard className="h-5 w-5" />,
      content: (
        <div className="space-y-3 text-muted-foreground">
          <p>
            <strong>Billing:</strong> Paid subscriptions are billed in advance on a monthly or
            annual basis. All fees are non-refundable except as required by law or as explicitly
            stated in these Terms.
          </p>
          <p>
            <strong>Free Tier:</strong> Free accounts are subject to usage limits. Exceeding limits
            requires upgrading to a paid plan.
          </p>
          <p>
            <strong>Refund Policy:</strong> We offer a 14-day money-back guarantee for new
            subscriptions. Refund requests must be submitted via support within 14 days of initial
            purchase. Compute credits and one-time purchases are non-refundable once used.
          </p>
        </div>
      ),
    },
  ];

  return (
    <PageLayout
      title="Terms of Service"
      description="Terms of Service for the Alawein Platform - Scientific computing and research tools"
      keywords={['terms of service', 'legal', 'alawein', 'platform', 'scientific computing']}
    >
      {/* Hero Section */}
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-4">
          Legal
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
          Please read these terms carefully before using the Alawein Platform.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <span>Last Updated: {LAST_UPDATED}</span>
          <span>•</span>
          <span>Effective: {EFFECTIVE_DATE}</span>
        </div>
      </div>

      {/* Terms Sections */}
      <div className="space-y-6 mb-12">
        {sections.map((section) => (
          <Card key={section.id} id={section.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="text-primary">{section.icon}</span>
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>{section.content}</CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Sections */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-primary" />
            7. Limitation of Liability
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE PLATFORM AND ITS AFFILIATES SHALL NOT BE
            LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
            INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR RESEARCH RESULTS.
          </p>
          <p>
            Our total liability for any claims arising from your use of the Platform shall not
            exceed the amount you paid us in the twelve (12) months preceding the claim.
          </p>
          <p>
            The Platform is provided "AS IS" without warranties of any kind. We do not guarantee
            that simulations or computations will be error-free or produce scientifically accurate
            results. Users are responsible for validating outputs.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Scale className="h-5 w-5 text-primary" />
            8. Governing Law & Disputes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>
            These Terms shall be governed by and construed in accordance with applicable laws. Any
            disputes arising from these Terms or your use of the Platform shall be resolved through
            binding arbitration, except where prohibited by law.
          </p>
          <p>
            For EU users: Nothing in these Terms affects your statutory rights under applicable
            consumer protection laws.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <RefreshCw className="h-5 w-5 text-primary" />
            9. Changes to Terms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>
            We reserve the right to modify these Terms at any time. We will notify users of material
            changes via email or prominent notice on the Platform at least 30 days before changes
            take effect.
          </p>
          <p>
            Continued use of the Platform after changes become effective constitutes acceptance of
            the revised Terms. If you do not agree to the new Terms, you must stop using the
            Platform.
          </p>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* Contact Section */}
      <div className="text-center text-muted-foreground">
        <p className="mb-2">Questions about these Terms?</p>
        <p>
          Contact us at{' '}
          <a href="mailto:legal@alawein.com" className="text-primary hover:underline">
            legal@alawein.com
          </a>
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <a href="/privacy" className="text-primary hover:underline text-sm">
            Privacy Policy
          </a>
          <span>•</span>
          <a href="/transparency" className="text-primary hover:underline text-sm">
            Transparency Report
          </a>
        </div>
      </div>
    </PageLayout>
  );
};

export default Terms;
