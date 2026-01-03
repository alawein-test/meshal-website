/**
 * @file Changelog.tsx
 * @description Changelog page displaying product updates and release history
 */
import { motion } from 'framer-motion';
import { Calendar, Tag, ArrowLeft, Sparkles, Bug, Zap, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';

interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  changes: {
    type: 'feature' | 'improvement' | 'fix' | 'security';
    text: string;
  }[];
}

const changeTypeConfig = {
  feature: {
    icon: Sparkles,
    label: 'New',
    color: 'bg-green-500/10 text-green-400 border-green-500/30',
  },
  improvement: {
    icon: Zap,
    label: 'Improved',
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  },
  fix: {
    icon: Bug,
    label: 'Fixed',
    color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  },
  security: {
    icon: Shield,
    label: 'Security',
    color: 'bg-red-500/10 text-red-400 border-red-500/30',
  },
};

// TODO: In production, this could be fetched from a CMS or database
const changelogData: ChangelogEntry[] = [
  {
    version: '2.0.0',
    date: '2025-12-10',
    title: 'SaaS Platform Launch',
    description:
      'Major release introducing subscription tiers, multi-tenant architecture, and API access.',
    changes: [
      { type: 'feature', text: 'Subscription billing with Stripe integration' },
      { type: 'feature', text: 'Multi-tenant organization support' },
      { type: 'feature', text: 'API key management for developers' },
      { type: 'feature', text: 'In-app notification system with real-time updates' },
      { type: 'feature', text: 'Usage dashboard with quota tracking' },
      { type: 'improvement', text: 'Enhanced SEO with OpenGraph and structured data' },
      { type: 'security', text: 'Rate limiting on all API endpoints' },
      { type: 'security', text: 'Row-level security policies for all tables' },
    ],
  },
  {
    version: '1.5.0',
    date: '2025-11-15',
    title: 'New Dashboards & Features',
    description: 'Introducing QMLab and OptiLibria dashboards with enhanced visualization.',
    changes: [
      { type: 'feature', text: 'QMLab quantum mechanics simulation dashboard' },
      { type: 'feature', text: 'OptiLibria optimization algorithm runner' },
      { type: 'improvement', text: 'Dark mode improvements across all themes' },
      { type: 'fix', text: 'Fixed simulation export in Safari browsers' },
    ],
  },
  {
    version: '1.0.0',
    date: '2025-10-01',
    title: 'Initial Release',
    description:
      'First public release of Alawein Platform with core scientific computing features.',
    changes: [
      { type: 'feature', text: 'SimCore scientific simulation dashboard' },
      { type: 'feature', text: 'MEZAN workflow automation system' },
      { type: 'feature', text: 'TalAI AI research experiments' },
      { type: 'feature', text: 'Cyberpunk portfolio with animations' },
      { type: 'feature', text: '7 theme variants with design tokens' },
    ],
  },
];

export default function Changelog() {
  return (
    <>
      <SEOHead
        title="Changelog"
        description="Stay up to date with the latest features, improvements, and fixes on Alawein Platform."
        keywords={['changelog', 'updates', 'release notes', 'new features']}
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
            <h1 className="text-4xl font-bold mb-4">Changelog</h1>
            <p className="text-muted-foreground text-lg">
              All notable changes and updates to Alawein Platform.
            </p>
          </div>

          {/* Changelog Entries */}
          <div className="space-y-8">
            {changelogData.map((entry, index) => (
              <motion.div
                key={entry.version}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-border/50">
                  <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <CardTitle className="flex items-center gap-3">
                        <Badge variant="outline" className="text-primary border-primary">
                          <Tag className="w-3 h-3 mr-1" />v{entry.version}
                        </Badge>
                        {entry.title}
                      </CardTitle>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-2">{entry.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {entry.changes.map((change, i) => {
                        const config = changeTypeConfig[change.type];
                        const Icon = config.icon;
                        return (
                          <li key={i} className="flex items-start gap-3">
                            <Badge variant="outline" className={`${config.color} shrink-0`}>
                              <Icon className="w-3 h-3 mr-1" />
                              {config.label}
                            </Badge>
                            <span className="text-sm">{change.text}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* RSS Feed Link */}
          <div className="mt-12 text-center text-muted-foreground text-sm">
            <p>Subscribe to our changelog via RSS (coming soon)</p>
          </div>
        </div>
      </div>
    </>
  );
}
