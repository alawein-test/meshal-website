/**
 * @file ApiDocs.tsx
 * @description API Documentation page for developers
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Code, Key, Terminal, Copy, Check, Zap, Shield, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';

const baseUrl = 'https://your-project.supabase.co/functions/v1'; // TODO: Update with actual URL

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  auth: boolean;
  example: string;
}

const endpoints: Record<string, Endpoint[]> = {
  simcore: [
    {
      method: 'GET',
      path: '/simcore-api?action=list',
      description: 'List all simulations for the authenticated user',
      auth: true,
      example: `curl -X GET "${baseUrl}/simcore-api?action=list" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    },
    {
      method: 'POST',
      path: '/simcore-api?action=create',
      description: 'Create a new simulation',
      auth: true,
      example: `curl -X POST "${baseUrl}/simcore-api?action=create" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "My Simulation", "type": "molecular", "config": {}}'`,
    },
    {
      method: 'POST',
      path: '/simcore-api?action=start',
      description: 'Start a simulation',
      auth: true,
      example: `curl -X POST "${baseUrl}/simcore-api?action=start" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"id": "simulation-uuid"}'`,
    },
    {
      method: 'DELETE',
      path: '/simcore-api?action=delete',
      description: 'Delete a simulation',
      auth: true,
      example: `curl -X POST "${baseUrl}/simcore-api?action=delete" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"id": "simulation-uuid"}'`,
    },
  ],
  mezan: [
    {
      method: 'GET',
      path: '/mezan-api?action=list',
      description: 'List all workflows for the authenticated user',
      auth: true,
      example: `curl -X GET "${baseUrl}/mezan-api?action=list" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    },
    {
      method: 'POST',
      path: '/mezan-api?action=create',
      description: 'Create a new workflow',
      auth: true,
      example: `curl -X POST "${baseUrl}/mezan-api?action=create" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "My Workflow", "description": "Workflow description", "steps": []}'`,
    },
    {
      method: 'POST',
      path: '/mezan-api?action=execute',
      description: 'Execute a workflow',
      auth: true,
      example: `curl -X POST "${baseUrl}/mezan-api?action=execute" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"id": "workflow-uuid"}'`,
    },
  ],
  talai: [
    {
      method: 'GET',
      path: '/talai-api?action=list',
      description: 'List all AI experiments for the authenticated user',
      auth: true,
      example: `curl -X GET "${baseUrl}/talai-api?action=list" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    },
    {
      method: 'POST',
      path: '/talai-api?action=create',
      description: 'Create a new AI experiment',
      auth: true,
      example: `curl -X POST "${baseUrl}/talai-api?action=create" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "My Experiment", "model_type": "transformer", "hyperparameters": {}}'`,
    },
    {
      method: 'POST',
      path: '/talai-api?action=start',
      description: 'Start training an experiment',
      auth: true,
      example: `curl -X POST "${baseUrl}/talai-api?action=start" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"id": "experiment-uuid"}'`,
    },
    {
      method: 'POST',
      path: '/talai-api?action=stop',
      description: 'Stop a running experiment',
      auth: true,
      example: `curl -X POST "${baseUrl}/talai-api?action=stop" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"id": "experiment-uuid"}'`,
    },
  ],
  optilibria: [
    {
      method: 'GET',
      path: '/optilibria-api?action=list',
      description: 'List all optimization runs for the authenticated user',
      auth: true,
      example: `curl -X GET "${baseUrl}/optilibria-api?action=list" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    },
    {
      method: 'POST',
      path: '/optilibria-api?action=create',
      description: 'Create a new optimization run',
      auth: true,
      example: `curl -X POST "${baseUrl}/optilibria-api?action=create" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"problem_name": "TSP", "algorithm": "genetic", "config": {}}'`,
    },
    {
      method: 'POST',
      path: '/optilibria-api?action=start',
      description: 'Start an optimization run',
      auth: true,
      example: `curl -X POST "${baseUrl}/optilibria-api?action=start" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"id": "run-uuid"}'`,
    },
    {
      method: 'POST',
      path: '/optilibria-api?action=complete',
      description: 'Mark an optimization run as complete with results',
      auth: true,
      example: `curl -X POST "${baseUrl}/optilibria-api?action=complete" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"id": "run-uuid", "best_score": 0.95, "iterations": 1000, "results": {}}'`,
    },
  ],
  qmlab: [
    {
      method: 'GET',
      path: '/qmlab-api?action=list',
      description: 'List all quantum experiments for the authenticated user',
      auth: true,
      example: `curl -X GET "${baseUrl}/qmlab-api?action=list" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    },
    {
      method: 'POST',
      path: '/qmlab-api?action=create',
      description: 'Create a new quantum experiment',
      auth: true,
      example: `curl -X POST "${baseUrl}/qmlab-api?action=create" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Hydrogen Atom", "quantum_system": "hydrogen", "particle_count": 1}'`,
    },
    {
      method: 'POST',
      path: '/qmlab-api?action=run',
      description: 'Run a quantum simulation',
      auth: true,
      example: `curl -X POST "${baseUrl}/qmlab-api?action=run" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"id": "experiment-uuid"}'`,
    },
    {
      method: 'DELETE',
      path: '/qmlab-api?action=delete',
      description: 'Delete a quantum experiment',
      auth: true,
      example: `curl -X POST "${baseUrl}/qmlab-api?action=delete" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"id": "experiment-uuid"}'`,
    },
  ],
};

function CodeBlock({ code, language = 'bash' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-sm">
        <code className="text-foreground">{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}

const methodColors = {
  GET: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  POST: 'bg-green-500/10 text-green-400 border-green-500/30',
  PUT: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  DELETE: 'bg-red-500/10 text-red-400 border-red-500/30',
};

export default function ApiDocs() {
  return (
    <>
      <SEOHead
        title="API Documentation"
        description="Complete API reference for Alawein Platform. Learn how to integrate with SimCore, MEZAN, and other services."
        keywords={['API', 'documentation', 'developer', 'REST', 'integration']}
      />
      <div className="min-h-screen bg-background">
        <div className="container max-w-5xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-12">
            <Link to="/">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-4xl font-bold mb-4">API Documentation</h1>
            <p className="text-muted-foreground text-lg">
              Integrate Alawein Platform into your applications with our REST API.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardContent className="flex items-center gap-3 py-4">
                <Key className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-medium">Authentication</p>
                  <p className="text-sm text-muted-foreground">API keys & tokens</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardContent className="flex items-center gap-3 py-4">
                <Zap className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-medium">Rate Limits</p>
                  <p className="text-sm text-muted-foreground">60-1000 req/min by tier</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardContent className="flex items-center gap-3 py-4">
                <Shield className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-medium">Security</p>
                  <p className="text-sm text-muted-foreground">TLS 1.3, JWT auth</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Authentication Section */}
          <Card className="mb-8 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Authentication
              </CardTitle>
              <CardDescription>
                All API requests require authentication via API key or JWT token.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Include your API key in the Authorization header:
              </p>
              <CodeBlock code={`Authorization: Bearer alw_sk_your_api_key_here`} />
              <p className="text-sm text-muted-foreground">
                Generate API keys in your{' '}
                <Link to="/settings" className="text-primary hover:underline">
                  account settings
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          {/* Endpoints */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                Endpoints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="simcore">
                <TabsList className="mb-4 flex-wrap h-auto gap-1">
                  <TabsTrigger value="simcore">SimCore</TabsTrigger>
                  <TabsTrigger value="mezan">MEZAN</TabsTrigger>
                  <TabsTrigger value="talai">TalAI</TabsTrigger>
                  <TabsTrigger value="optilibria">OptiLibria</TabsTrigger>
                  <TabsTrigger value="qmlab">QMLab</TabsTrigger>
                </TabsList>
                {Object.entries(endpoints).map(([service, serviceEndpoints]) => (
                  <TabsContent key={service} value={service} className="space-y-6">
                    {serviceEndpoints.map((endpoint, i) => (
                      <motion.div
                        key={endpoint.path}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="border border-border/50 rounded-lg p-4"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="outline" className={methodColors[endpoint.method]}>
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm font-mono">{endpoint.path}</code>
                          {endpoint.auth && (
                            <Badge variant="secondary" className="text-xs">
                              <Key className="w-3 h-3 mr-1" />
                              Auth required
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{endpoint.description}</p>
                        <CodeBlock code={endpoint.example} />
                      </motion.div>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
