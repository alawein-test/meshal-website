// Project Detail Page - Interactive showcase with demos and code snippets
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Code,
  Play,
  Layers,
  Zap,
  Box,
  ChevronRight,
  Copy,
  Check,
  Terminal,
  BookOpen,
  Rocket,
} from 'lucide-react';
import { getProject } from '@/projects/config';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { SEO } from '@/components/shared';

// Code snippets for each project
const codeSnippets: Record<string, { language: string; title: string; code: string }[]> = {
  simcore: [
    {
      language: 'typescript',
      title: 'Create Simulation',
      code: `import { SimCore } from '@alawein/simcore';

const simulation = new SimCore.Simulation({
  name: 'Particle Dynamics',
  type: 'molecular-dynamics',
  config: {
    particles: 1000,
    timestep: 0.001,
    temperature: 300,
  }
});

await simulation.run();
console.log(simulation.results);`,
    },
    {
      language: 'python',
      title: 'Python API',
      code: `from simcore import Simulation, Visualizer

sim = Simulation.create(
    name="Heat Transfer",
    physics="thermal",
    mesh_resolution=100
)

results = sim.solve(max_iterations=1000)
Visualizer.plot_field(results.temperature)`,
    },
  ],
  qmlab: [
    {
      language: 'typescript',
      title: 'Wave Function',
      code: `import { QMLab, Operators } from '@alawein/qmlab';

// Create a quantum harmonic oscillator
const system = QMLab.createSystem({
  potential: Operators.harmonicOscillator(omega: 1.0),
  dimensions: 1,
  gridPoints: 256,
});

// Evolve the wave function
const psi = system.groundState();
const evolved = system.evolve(psi, { time: 10 });`,
    },
    {
      language: 'python',
      title: 'Measurement',
      code: `from qmlab import QuantumState, measure

# Prepare a superposition state
state = QuantumState.superposition([
    (0.707, "|0⟩"),
    (0.707, "|1⟩"),
])

# Measure in computational basis
result = measure(state, basis="Z")
print(f"Collapsed to: {result}")`,
    },
  ],
  optilibria: [
    {
      language: 'typescript',
      title: 'Optimize Function',
      code: `import { OptiLibria, algorithms } from '@alawein/optilibria';

const problem = OptiLibria.define({
  objective: (x) => x[0]**2 + x[1]**2,
  bounds: [[-10, 10], [-10, 10]],
  minimize: true,
});

const result = await algorithms.particleSwarm(problem, {
  swarmSize: 50,
  maxIterations: 100,
});

console.log(\`Optimal: \${result.best}\`);`,
    },
    {
      language: 'python',
      title: 'Benchmark Suite',
      code: `from optilibria import benchmark, compare

# Run benchmark on standard problems
results = benchmark.run([
    "rastrigin",
    "rosenbrock",
    "sphere",
], algorithms=["PSO", "DE", "CMA-ES"])

# Generate comparison report
compare.plot_convergence(results)
compare.generate_report(results, "benchmark.pdf")`,
    },
  ],
  talai: [
    {
      language: 'typescript',
      title: 'Train Model',
      code: `import { TalAI, models } from '@alawein/talai';

const experiment = TalAI.createExperiment({
  name: 'BERT Fine-tuning',
  model: models.transformers.BERT,
  dataset: 'custom-nlp-dataset',
});

await experiment.train({
  epochs: 10,
  learningRate: 2e-5,
  batchSize: 32,
});

experiment.log.metrics();`,
    },
    {
      language: 'python',
      title: 'Deploy Model',
      code: `from talai import Model, deploy

# Load trained model
model = Model.load("bert-finetuned-v3")

# Deploy to inference endpoint
endpoint = deploy.create_endpoint(
    model=model,
    instance_type="gpu.small",
    autoscale=True,
)

print(f"Endpoint: {endpoint.url}")`,
    },
  ],
  mezan: [
    {
      language: 'typescript',
      title: 'Create Workflow',
      code: `import { MEZAN, triggers, actions } from '@alawein/mezan';

const workflow = MEZAN.createWorkflow({
  name: 'Data Pipeline',
  trigger: triggers.schedule('0 9 * * *'),
  steps: [
    actions.fetchData({ source: 'api' }),
    actions.transform({ script: 'normalize.js' }),
    actions.store({ destination: 'warehouse' }),
    actions.notify({ channel: 'slack' }),
  ],
});

await workflow.deploy();`,
    },
    {
      language: 'yaml',
      title: 'Workflow YAML',
      code: `name: automated-report
trigger:
  type: schedule
  cron: "0 8 * * 1"

steps:
  - id: fetch-data
    action: database/query
    config:
      query: SELECT * FROM metrics

  - id: generate-report
    action: reporting/create
    input: \${{ steps.fetch-data.output }}

  - id: send-email
    action: notifications/email
    config:
      to: team@company.com`,
    },
  ],
};

// Demo components for each project
const ProjectDemo = ({ projectId }: { projectId: string }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string[]>([]);

  const runDemo = () => {
    setIsRunning(true);
    setOutput([]);

    const messages = {
      simcore: [
        '> Initializing simulation engine...',
        '> Loading particle configuration (n=1000)',
        '> Computing initial forces...',
        '> Running MD simulation [████████░░] 80%',
        '> Running MD simulation [██████████] 100%',
        '> Simulation complete! Energy: -4521.3 kJ/mol',
      ],
      qmlab: [
        '> Constructing Hamiltonian matrix...',
        '> Diagonalizing (256x256)...',
        '> Ground state energy: -0.5 Hartree',
        '> Computing wave function...',
        '> Rendering probability density...',
        '> Visualization ready!',
      ],
      optilibria: [
        '> Initializing PSO swarm (n=50)...',
        '> Iteration 25: best = 0.0842',
        '> Iteration 50: best = 0.0031',
        '> Iteration 75: best = 0.0002',
        '> Converged at iteration 89',
        '> Optimal solution: [0.001, -0.002]',
      ],
      talai: [
        '> Loading BERT base model...',
        '> Tokenizing dataset (10,000 samples)...',
        '> Epoch 1/10: loss=2.341, acc=0.72',
        '> Epoch 5/10: loss=0.892, acc=0.89',
        '> Epoch 10/10: loss=0.234, acc=0.96',
        '> Model saved to: bert-finetuned-v3',
      ],
      mezan: [
        '> Validating workflow definition...',
        '> Connecting to data sources...',
        '> Executing step: fetch-data ✓',
        '> Executing step: transform ✓',
        '> Executing step: store ✓',
        '> Workflow completed successfully!',
      ],
    };

    const projectMessages = messages[projectId as keyof typeof messages] || messages.simcore;

    projectMessages.forEach((msg, i) => {
      setTimeout(
        () => {
          setOutput((prev) => [...prev, msg]);
          if (i === projectMessages.length - 1) {
            setIsRunning(false);
          }
        },
        (i + 1) * 500
      );
    });
  };

  return (
    <div className="rounded-xl border border-border/50 bg-black/50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-mono text-muted-foreground">Interactive Demo</span>
        </div>
        <Button size="sm" onClick={runDemo} disabled={isRunning} className="gap-2">
          <Play className="w-3 h-3" />
          {isRunning ? 'Running...' : 'Run Demo'}
        </Button>
      </div>
      <div className="p-4 font-mono text-sm min-h-[200px]">
        <AnimatePresence mode="popLayout">
          {output.length === 0 ? (
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Click "Run Demo" to see the project in action...
            </motion.p>
          ) : (
            output.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  'py-0.5',
                  line.includes('✓') ||
                    line.includes('complete') ||
                    line.includes('ready') ||
                    line.includes('saved')
                    ? 'text-green-400'
                    : line.includes('%')
                      ? 'text-yellow-400'
                      : 'text-foreground'
                )}
              >
                {line}
              </motion.div>
            ))
          )}
        </AnimatePresence>
        {isRunning && (
          <motion.span
            className="inline-block w-2 h-4 bg-primary ml-1"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
      </div>
    </div>
  );
};

// Code snippet component with copy functionality
const CodeSnippet = ({
  language,
  title,
  code,
}: {
  language: string;
  title: string;
  code: string;
}) => {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">{title}</span>
          <Badge variant="outline" className="text-xs">
            {language}
          </Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={copyCode} className="gap-2">
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto bg-black/30">
        <code className="text-sm font-mono text-foreground/90">{code}</code>
      </pre>
    </div>
  );
};

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const project = projectId ? getProject(projectId) : undefined;

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project not found</h1>
          <Button onClick={() => navigate('/projects')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const snippets = codeSnippets[projectId || ''] || [];

  const statusColors: Record<string, string> = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    development: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    beta: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    deprecated: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title={`${project.name} | AlaweinOS`} description={project.description} />

      {/* Hero Header */}
      <header
        className="relative border-b border-border/50 overflow-hidden"
        style={{ background: project.theme.gradient }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/projects">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/projects" className="hover:text-foreground">
                Projects
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">{project.name}</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-xl"
                  style={{ background: project.theme.gradient }}
                  animate={{ rotate: [0, -3, 3, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {project.name.charAt(0)}
                </motion.div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">{project.name}</h1>
                  <p className="text-muted-foreground font-mono">{project.tagline}</p>
                </div>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl">{project.description}</p>
            </div>

            <div className="flex items-center gap-3">
              <Badge className={cn('text-sm', statusColors[project.status])}>
                {project.status}
              </Badge>
              <span className="text-sm text-muted-foreground font-mono">v{project.version}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Actions */}
      <div className="border-b border-border/50 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-3 overflow-x-auto">
            <Link to={project.routes[0]?.path || '#'}>
              <Button size="sm" className="gap-2">
                <Rocket className="w-4 h-4" />
                Launch App
              </Button>
            </Link>
            <Button variant="outline" size="sm" className="gap-2">
              <Github className="w-4 h-4" />
              View Source
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Documentation
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              Live Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="overview" className="gap-2">
              <Layers className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="demo" className="gap-2">
              <Play className="w-4 h-4" />
              Live Demo
            </TabsTrigger>
            <TabsTrigger value="code" className="gap-2">
              <Code className="w-4 h-4" />
              Code Examples
            </TabsTrigger>
            <TabsTrigger value="tech" className="gap-2">
              <Box className="w-4 h-4" />
              Tech Stack
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Features */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Key Features
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.features.map((feature, i) => (
                  <motion.div
                    key={feature}
                    className="p-4 rounded-xl border border-border/50 bg-card/50 hover:border-primary/50 transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ background: project.theme.gradient }}
                      >
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium">{feature}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Routes / Pages */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                Available Pages
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {project.routes.map((route, i) => (
                  <Link key={route.path} to={route.path}>
                    <motion.div
                      className="p-4 rounded-xl border border-border/50 bg-card/50 hover:border-primary/50 transition-all group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium group-hover:text-primary transition-colors">
                            {route.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{route.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.section>
          </TabsContent>

          {/* Demo Tab */}
          <TabsContent value="demo" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-xl font-bold mb-4">Interactive Demo</h2>
              <p className="text-muted-foreground mb-6">
                Experience {project.name} in action. Click the button below to run a simulated demo.
              </p>
              <ProjectDemo projectId={projectId || ''} />
            </motion.div>
          </TabsContent>

          {/* Code Tab */}
          <TabsContent value="code" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-xl font-bold mb-4">Code Examples</h2>
              <p className="text-muted-foreground mb-6">
                Get started with {project.name} using these code snippets.
              </p>
              <div className="space-y-6">
                {snippets.map((snippet, i) => (
                  <motion.div
                    key={snippet.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <CodeSnippet {...snippet} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Tech Stack Tab */}
          <TabsContent value="tech" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {Object.entries(project.techStack).map(([category, techs], i) => (
                <motion.div
                  key={category}
                  className="p-6 rounded-xl border border-border/50 bg-card/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <h3 className="text-lg font-bold capitalize mb-4">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {(techs as string[]).map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
