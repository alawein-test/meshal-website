import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Play,
  Lock,
  TrendingUp,
  Clock,
  Zap,
  AlertCircle,
  CheckCircle,
  BarChart3,
} from 'lucide-react';
import { useWaitlist } from '@/hooks/useWaitlist';
import { toast } from 'sonner';

// Demo algorithms (3 of 31 total)
const demoAlgorithms = [
  { id: 'genetic', name: 'Genetic Algorithm', description: 'Evolutionary optimization' },
  {
    id: 'simulated-annealing',
    name: 'Simulated Annealing',
    description: 'Probabilistic optimization',
  },
  { id: 'particle-swarm', name: 'Particle Swarm', description: 'Swarm intelligence' },
];

// Problem types
const problemTypes = [
  { id: 'tsp', name: 'Traveling Salesman Problem', maxSize: 10 },
  { id: 'knapsack', name: 'Knapsack Problem', maxSize: 20 },
  { id: 'vrp', name: 'Vehicle Routing Problem', maxSize: 5 },
];

interface OptimizationResult {
  algorithm: string;
  bestSolution: number;
  iterations: number;
  time: number;
  convergence: number[];
}

export default function LibrexPlayground() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('genetic');
  const [selectedProblem, setSelectedProblem] = useState('tsp');
  const [problemSize, setProblemSize] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<OptimizationResult | null>(null);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const { joinWaitlist } = useWaitlist();

  const maxSize = problemTypes.find((p) => p.id === selectedProblem)?.maxSize || 10;

  const handleRun = () => {
    if (problemSize > maxSize) {
      toast.error(`Demo limited to ${maxSize} items. Join waitlist for unlimited access!`);
      setShowWaitlist(true);
      return;
    }

    setIsRunning(true);
    setResults(null);

    // Simulate optimization (in production, this would call the actual solver)
    setTimeout(() => {
      const mockResult: OptimizationResult = {
        algorithm: selectedAlgorithm,
        bestSolution: Math.random() * 1000 + 500,
        iterations: Math.floor(Math.random() * 100) + 50,
        time: Math.random() * 2 + 0.5,
        convergence: Array.from({ length: 20 }, () => Math.random() * 1000 + 500),
      };
      setResults(mockResult);
      setIsRunning(false);
      toast.success('Optimization complete!');
    }, 2000);
  };

  const handleJoinWaitlist = async () => {
    const email = prompt('Enter your email to join the waitlist:');
    if (email) {
      await joinWaitlist({
        email,
        projectId: 'librex',
        metadata: {
          source: 'playground',
          problem_type: selectedProblem,
        },
      });
      setShowWaitlist(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-blue-500/10" />
        <div className="container relative mx-auto px-4 py-12">
          <div className="mx-auto max-w-4xl">
            <Badge variant="secondary" className="mb-4">
              Demo Mode • 3 of 31 Algorithms
            </Badge>
            <h1 className="mb-4 text-4xl font-bold tracking-tight">
              Librex Optimization Playground
            </h1>
            <p className="mb-6 text-lg text-muted-foreground">
              Interactive optimization playground. Try 3 algorithms free. Join waitlist for access
              to all 31 algorithms and unlimited problem sizes.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>28 algorithms hidden</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>Limited problem sizes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Limitations Banner */}
      <section className="border-b border-border bg-muted/50">
        <div className="container mx-auto px-4 py-4">
          <Card className="bg-yellow-500/10 border-yellow-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-semibold">Demo Mode Limitations</p>
                    <p className="text-sm text-muted-foreground">
                      Free tier: 3 algorithms, max {maxSize} items. Pro tier: All 31 algorithms,
                      unlimited sizes, API access.
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setShowWaitlist(true)}>
                  Join Waitlist
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>Set up your optimization problem</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Problem Type */}
                <div className="space-y-2">
                  <Label>Problem Type</Label>
                  <Select value={selectedProblem} onValueChange={setSelectedProblem}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {problemTypes.map((problem) => (
                        <SelectItem key={problem.id} value={problem.id}>
                          {problem.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Algorithm Selection */}
                <div className="space-y-2">
                  <Label>Algorithm (Demo: 3 of 31)</Label>
                  <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {demoAlgorithms.map((algo) => (
                        <SelectItem key={algo.id} value={algo.id}>
                          {algo.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {demoAlgorithms.find((a) => a.id === selectedAlgorithm)?.description}
                  </p>
                </div>

                {/* Problem Size */}
                <div className="space-y-2">
                  <Label>Problem Size (Max: {maxSize})</Label>
                  <Input
                    type="number"
                    min={2}
                    max={maxSize}
                    value={problemSize}
                    onChange={(e) =>
                      setProblemSize(Math.min(maxSize, parseInt(e.target.value) || 2))
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Demo limited to {maxSize} items. Pro: Unlimited
                  </p>
                </div>

                {/* Run Button */}
                <Button onClick={handleRun} disabled={isRunning} className="w-full" size="lg">
                  {isRunning ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Run Optimization
                    </>
                  )}
                </Button>

                {/* Waitlist CTA */}
                <Card className="bg-primary/10 border-primary/20">
                  <CardContent className="p-4">
                    <p className="text-sm font-semibold mb-2">Want More?</p>
                    <p className="text-xs text-muted-foreground mb-3">
                      Get access to all 31 algorithms, unlimited problem sizes, API access, and
                      custom constraints.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setShowWaitlist(true)}
                    >
                      Join Waitlist
                    </Button>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="results" className="space-y-4">
              <TabsList>
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="visualization">Visualization</TabsTrigger>
                <TabsTrigger value="comparison">Comparison</TabsTrigger>
              </TabsList>

              <TabsContent value="results" className="space-y-4">
                {results ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Optimization Results</CardTitle>
                      <CardDescription>
                        Algorithm: {demoAlgorithms.find((a) => a.id === results.algorithm)?.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-primary">
                            {results.bestSolution.toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground">Best Solution</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-primary">
                            {results.iterations}
                          </div>
                          <div className="text-sm text-muted-foreground">Iterations</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-primary">
                            {results.time.toFixed(2)}s
                          </div>
                          <div className="text-sm text-muted-foreground">Time</div>
                        </div>
                      </div>
                      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="flex items-center gap-2 text-green-600 mb-2">
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-semibold">Optimization Complete</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          This is a demo result. Join waitlist for full solver access with all 31
                          algorithms.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">
                        Configure your problem and click "Run Optimization" to see results
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="visualization">
                <Card>
                  <CardHeader>
                    <CardTitle>Convergence Visualization</CardTitle>
                    <CardDescription>Algorithm performance over iterations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {results ? (
                      <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                        <div className="text-center">
                          <TrendingUp className="h-12 w-12 mx-auto mb-2 text-primary opacity-50" />
                          <p className="text-sm text-muted-foreground">
                            Convergence chart would appear here
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Full visualization available in Pro version
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                        <p className="text-muted-foreground">
                          Run optimization to see visualization
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comparison">
                <Card>
                  <CardHeader>
                    <CardTitle>Algorithm Comparison</CardTitle>
                    <CardDescription>Compare all 3 demo algorithms</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {demoAlgorithms.map((algo) => (
                        <div
                          key={algo.id}
                          className="p-3 border rounded-lg flex items-center justify-between"
                        >
                          <div>
                            <div className="font-semibold">{algo.name}</div>
                            <div className="text-sm text-muted-foreground">{algo.description}</div>
                          </div>
                          <Badge variant="outline">Demo</Badge>
                        </div>
                      ))}
                      <div className="p-3 border border-dashed rounded-lg bg-muted/50 text-center">
                        <Lock className="h-4 w-4 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          28 additional algorithms available in Pro version
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Waitlist Modal */}
      {showWaitlist && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Join Librex Waitlist</CardTitle>
              <CardDescription>
                Get early access to all 31 algorithms, unlimited problem sizes, and API access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input type="email" placeholder="your@email.com" id="waitlist-email" />
              </div>
              <div className="space-y-2 rounded-lg bg-muted p-4">
                <h4 className="font-semibold text-sm mb-2">Early Access Benefits:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• All 31 optimization algorithms</li>
                  <li>• Unlimited problem sizes</li>
                  <li>• API access</li>
                  <li>• Custom constraints</li>
                  <li>• 50% discount for first 3 months</li>
                </ul>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleJoinWaitlist}>
                  Join Waitlist
                </Button>
                <Button variant="outline" onClick={() => setShowWaitlist(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
