import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  Users,
  Database,
  TrendingUp,
  Shield,
  Calendar,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface TransparencyReport {
  quarter: string;
  date: string;
  totalUsersOptedIn: number;
  dataPointsCollected: number;
  modelsTrained: number;
  performanceImprovements: {
    talai: number;
    simcore: number;
    librex: number;
  };
  securityIncidents: number;
}

// Mock data - in production, this would come from the database
const reports: TransparencyReport[] = [
  {
    quarter: 'Q4 2024',
    date: '2024-12-01',
    totalUsersOptedIn: 1247,
    dataPointsCollected: 45230,
    modelsTrained: 8,
    performanceImprovements: {
      talai: 12,
      simcore: 8,
      librex: 15,
    },
    securityIncidents: 0,
  },
  {
    quarter: 'Q3 2024',
    date: '2024-09-01',
    totalUsersOptedIn: 892,
    dataPointsCollected: 31240,
    modelsTrained: 6,
    performanceImprovements: {
      talai: 10,
      simcore: 7,
      librex: 12,
    },
    securityIncidents: 0,
  },
];

const dataCollectionBreakdown = [
  {
    project: 'TalAI',
    dataTypes: ['User queries', 'Paper selections', 'Feedback'],
    anonymization: 'Hash user ID, remove context',
    retentionDays: 365,
    purpose: 'Improve query understanding and relevance ranking',
  },
  {
    project: 'SimCore',
    dataTypes: ['Simulation configs', 'Convergence patterns', 'Error logs'],
    anonymization: 'Strip metadata, aggregate only',
    retentionDays: 1095,
    purpose: 'Optimize simulation performance and predict outcomes',
  },
  {
    project: 'Librex',
    dataTypes: ['Problem definitions', 'Convergence patterns', 'Performance metrics'],
    anonymization: 'Strip metadata, aggregate only',
    retentionDays: 730,
    purpose: 'Optimize algorithm selection and improve performance',
  },
];

export default function TransparencyReport() {
  const latestReport = reports[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-blue-500/10" />
        <div className="container relative mx-auto px-4 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4">
              AI Training Transparency
            </Badge>
            <h1 className="mb-6 text-5xl font-bold tracking-tight">
              AI Training Transparency Report
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Quarterly reports on how we use data to improve our AI systems. Full transparency,
              full control.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Updated Quarterly</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{latestReport.securityIncidents} Security Incidents</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Report Summary */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Latest Report: {latestReport.quarter}</h2>
          <p className="text-muted-foreground">
            Published {new Date(latestReport.date).toLocaleDateString()}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Users Opted In
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {latestReport.totalUsersOptedIn.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Total users</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Data Points Collected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {latestReport.dataPointsCollected.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Anonymized data</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Models Trained
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{latestReport.modelsTrained}</div>
              <div className="text-xs text-muted-foreground mt-1">This quarter</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Security Incidents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">
                {latestReport.securityIncidents}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Zero incidents</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Performance Improvements */}
      <section className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-8">Performance Improvements</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {Object.entries(latestReport.performanceImprovements).map(([project, improvement]) => (
              <Card key={project}>
                <CardHeader>
                  <CardTitle className="text-lg capitalize">{project}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <div className="text-2xl font-bold text-primary">+{improvement}%</div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Performance improvement this quarter
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Data Collection Details */}
      <section className="container mx-auto px-4 py-12">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="data-collection">Data Collection</TabsTrigger>
            <TabsTrigger value="historical">Historical Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How We Use Your Data</CardTitle>
                <CardDescription>
                  We collect anonymized usage data to improve our AI systems while protecting your
                  privacy.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-semibold">Anonymized Collection</p>
                    <p className="text-sm text-muted-foreground">
                      All data is anonymized before being used for training. Personal identifiers
                      are removed or hashed.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-semibold">Opt-In Only</p>
                    <p className="text-sm text-muted-foreground">
                      AI training is opt-in only. You can change your preference anytime in
                      Settings.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-semibold">Full Control</p>
                    <p className="text-sm text-muted-foreground">
                      Export or delete your data at any time. No questions asked.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data-collection" className="space-y-6">
            <div className="space-y-4">
              {dataCollectionBreakdown.map((project) => (
                <Card key={project.project}>
                  <CardHeader>
                    <CardTitle>{project.project}</CardTitle>
                    <CardDescription>Data collection and usage details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-semibold text-sm mb-2">Data Types Collected:</p>
                      <div className="flex flex-wrap gap-2">
                        {project.dataTypes.map((type, i) => (
                          <Badge key={i} variant="outline">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1">Anonymization:</p>
                      <p className="text-sm text-muted-foreground">{project.anonymization}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1">Retention:</p>
                      <p className="text-sm text-muted-foreground">{project.retentionDays} days</p>
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1">Purpose:</p>
                      <p className="text-sm text-muted-foreground">{project.purpose}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="historical" className="space-y-6">
            <div className="space-y-4">
              {reports.map((report) => (
                <Card key={report.quarter}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{report.quarter} Report</CardTitle>
                      <Badge variant="outline">{new Date(report.date).toLocaleDateString()}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Users Opted In</p>
                        <p className="text-lg font-semibold">
                          {report.totalUsersOptedIn.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Data Points</p>
                        <p className="text-lg font-semibold">
                          {report.dataPointsCollected.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Models Trained</p>
                        <p className="text-lg font-semibold">{report.modelsTrained}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Security Incidents</p>
                        <p className="text-lg font-semibold text-green-500">
                          {report.securityIncidents}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
