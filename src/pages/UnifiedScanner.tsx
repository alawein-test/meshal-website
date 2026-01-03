import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  Scan,
  Database,
  Globe,
  FileText,
  Code,
  Zap,
  TrendingUp,
  Filter,
  Download,
  Play,
  Pause,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Network,
  Layers,
  X,
} from 'lucide-react';
import { PageLayout, HubHeader } from '@/components/shared';
import { useUnifiedScanner } from '@/hooks/useUnifiedScanner';
import { toast } from 'sonner';

interface ScanResult {
  id: string;
  type: 'url' | 'code' | 'document' | 'api';
  source: string;
  status: 'pending' | 'scanning' | 'completed' | 'error';
  findings: {
    total: number;
    critical: number;
    warnings: number;
    info: number;
  };
  metadata: Record<string, string | number | boolean | null>;
  timestamp: string;
}

interface ResearchResult {
  id: string;
  query: string;
  sources: string[];
  summary: string;
  insights: string[];
  confidence: number;
  timestamp: string;
}

export default function UnifiedScanner() {
  const [activeTab, setActiveTab] = useState('scan');
  const [scanQuery, setScanQuery] = useState('');
  const [researchQuery, setResearchQuery] = useState('');
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [researchResults, setResearchResults] = useState<ResearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<ScanResult | ResearchResult | null>(null);

  const { scan, research, loading: scannerLoading } = useUnifiedScanner();

  const handleScan = async () => {
    if (!scanQuery.trim()) {
      toast.error('Please enter a URL, code snippet, or document to scan');
      return;
    }

    const result = await scan({
      type: scanQuery.startsWith('http') ? 'url' : 'code',
      source: scanQuery,
      depth: 'deep',
    });

    if (result?.result) {
      const scanResult: ScanResult = {
        id: result.result.id,
        type: result.result.type,
        source: result.result.source,
        status: result.result.status || 'completed',
        findings: result.result.findings || {
          total: 0,
          critical: 0,
          warnings: 0,
          info: 0,
        },
        metadata: result.result.metadata || {},
        timestamp: result.result.created_at || new Date().toISOString(),
      };

      setScanResults([scanResult, ...scanResults]);
      setSelectedResult(scanResult);
    }
  };

  const handleResearch = async () => {
    if (!researchQuery.trim()) {
      toast.error('Please enter a research query');
      return;
    }

    const result = await research({
      query: researchQuery,
      depth: 'deep',
    });

    if (result?.result) {
      const researchResult: ResearchResult = {
        id: result.result.id,
        query: result.result.query,
        sources: result.result.sources || [],
        summary: result.result.summary || '',
        insights: result.result.insights || [],
        confidence: result.result.confidence || 0,
        timestamp: result.result.created_at || new Date().toISOString(),
      };

      setResearchResults([researchResult, ...researchResults]);
      setSelectedResult(researchResult);
    }
  };

  return (
    <PageLayout
      title="Unified Scanner & Research"
      description="Deep scanning and research system for unified tool analysis"
      containerClassName="pt-28 pb-20"
    >
      <HubHeader
        title="Unified Scanner & Research"
        description="Deep scanning, analysis, and research across all tools and platforms"
        primaryColor="cyan"
        secondaryColor="purple"
        badge={
          <>
            <Scan className="h-4 w-4 text-jules-cyan" />
            <span className="text-sm font-mono text-jules-cyan">Deep Analysis</span>
          </>
        }
        size="large"
        align="center"
        className="mb-12"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scan" className="font-mono">
            <Scan className="h-4 w-4 mr-2" />
            Deep Scan
          </TabsTrigger>
          <TabsTrigger value="research" className="font-mono">
            <Search className="h-4 w-4 mr-2" />
            Research
          </TabsTrigger>
        </TabsList>

        {/* Deep Scan Tab */}
        <TabsContent value="scan" className="space-y-6">
          <Card className="border-jules-cyan/20 bg-jules-surface/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="h-5 w-5 text-jules-cyan" />
                Deep Scanning Engine
              </CardTitle>
              <CardDescription>
                Scan URLs, code repositories, documents, and APIs for comprehensive analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Scan Target</Label>
                <Textarea
                  placeholder="Enter URL, code snippet, document path, or API endpoint..."
                  value={scanQuery}
                  onChange={(e) => setScanQuery(e.target.value)}
                  rows={4}
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleScan}
                  disabled={scannerLoading}
                  className="bg-jules-cyan hover:bg-jules-cyan/80 text-black font-mono"
                >
                  {scannerLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Scan
                    </>
                  )}
                </Button>
                <Button variant="outline" className="font-mono">
                  <Filter className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Scan Results */}
          {scanResults.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold font-mono">Scan Results</h3>
                <Badge variant="secondary" className="font-mono">
                  {scanResults.length} scans
                </Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {scanResults.map((result) => (
                  <Card
                    key={result.id}
                    className="cursor-pointer hover:border-jules-cyan/50 transition-all"
                    onClick={() => setSelectedResult(result)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-mono">
                          {result.type.toUpperCase()}
                        </CardTitle>
                        <Badge variant={result.status === 'completed' ? 'default' : 'secondary'}>
                          {result.status}
                        </Badge>
                      </div>
                      <CardDescription className="font-mono text-xs truncate">
                        {result.source.slice(0, 50)}...
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Total Findings</span>
                          <span className="font-bold">{result.findings.total}</span>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="destructive" className="text-xs">
                            {result.findings.critical} Critical
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {result.findings.warnings} Warnings
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Research Tab */}
        <TabsContent value="research" className="space-y-6">
          <Card className="border-jules-magenta/20 bg-jules-surface/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-jules-magenta" />
                Deep Research Engine
              </CardTitle>
              <CardDescription>
                Conduct comprehensive research across multiple sources and platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Research Query</Label>
                <Textarea
                  placeholder="Enter your research question or topic..."
                  value={researchQuery}
                  onChange={(e) => setResearchQuery(e.target.value)}
                  rows={4}
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleResearch}
                  disabled={scannerLoading}
                  className="bg-jules-magenta hover:bg-jules-magenta/80 text-black font-mono"
                >
                  {scannerLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Researching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Start Research
                    </>
                  )}
                </Button>
                <Button variant="outline" className="font-mono">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Research Results */}
          {researchResults.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold font-mono">Research Results</h3>
                <Badge variant="secondary" className="font-mono">
                  {researchResults.length} queries
                </Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {researchResults.map((result) => (
                  <Card
                    key={result.id}
                    className="cursor-pointer hover:border-jules-magenta/50 transition-all"
                    onClick={() => setSelectedResult(result)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-mono">Research</CardTitle>
                        <Badge variant="secondary">{result.confidence}% confidence</Badge>
                      </div>
                      <CardDescription className="font-mono text-xs">
                        {result.query}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {result.summary}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Globe className="h-3 w-3" />
                          {result.sources.length} sources
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Result Detail Modal */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {'type' in selectedResult ? 'Scan Result' : 'Research Result'}
                </CardTitle>
                <Button variant="ghost" onClick={() => setSelectedResult(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {'type' in selectedResult ? (
                <div className="space-y-4">
                  <div>
                    <Label>Source</Label>
                    <p className="font-mono text-sm">{selectedResult.source}</p>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{selectedResult.findings.total}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    <div className="text-center p-4 bg-destructive/10 rounded-lg">
                      <div className="text-2xl font-bold text-destructive">
                        {selectedResult.findings.critical}
                      </div>
                      <div className="text-xs text-muted-foreground">Critical</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {selectedResult.findings.warnings}
                      </div>
                      <div className="text-xs text-muted-foreground">Warnings</div>
                    </div>
                    <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedResult.findings.info}
                      </div>
                      <div className="text-xs text-muted-foreground">Info</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label>Query</Label>
                    <p className="font-mono text-sm">{selectedResult.query}</p>
                  </div>
                  <div>
                    <Label>Summary</Label>
                    <p className="text-sm">{selectedResult.summary}</p>
                  </div>
                  <div>
                    <Label>Insights</Label>
                    <ul className="space-y-2 mt-2">
                      {selectedResult.insights.map((insight, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <Label>Sources</Label>
                    <ul className="space-y-1 mt-2">
                      {selectedResult.sources.map((source, i) => (
                        <li key={i} className="text-sm font-mono text-muted-foreground">
                          {source}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </PageLayout>
  );
}
