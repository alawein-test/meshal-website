// Project Configuration Registry
import {
  Project,
  SimCoreProject,
  MEZANProject,
  TalAIProject,
  OptiLibriaProject,
  QMLabProject,
} from './types';

export const projectRegistry: Record<string, Project> = {
  simcore: {
    id: 'simcore',
    name: 'SimCore',
    slug: 'simcore',
    description: 'Production-ready scientific computing and simulation platform',
    tagline: 'Simulation at Scale',
    version: '1.0.0',
    status: 'active',
    category: 'scientific-computing',
    features: [
      'Multi-physics Simulation',
      'Real-time Visualization',
      'Distributed Computing',
      'Data Analytics',
      'Experiment Management',
    ],
    techStack: {
      frontend: ['React 18', 'TypeScript', 'Three.js', 'Recharts'],
      backend: ['Supabase Edge Functions', 'Python (API spec)'],
      infrastructure: ['Cloud Infrastructure', 'WebGL'],
      databases: ['PostgreSQL', 'TimescaleDB (spec)'],
    },
    theme: {
      primary: 'quantum-purple',
      secondary: 'electron-cyan',
      accent: 'plasma-pink',
      background: 'void-start',
      surface: 'surface-card',
      gradient: 'linear-gradient(135deg, hsl(var(--quantum-purple)), hsl(var(--electron-cyan)))',
    },
    routes: [
      { path: '/projects/simcore', name: 'Dashboard', description: 'Main control center' },
      {
        path: '/projects/simcore/simulations',
        name: 'Simulations',
        description: 'Run simulations',
      },
      { path: '/projects/simcore/analytics', name: 'Analytics', description: 'Data analysis' },
      {
        path: '/projects/simcore/experiments',
        name: 'Experiments',
        description: 'Manage experiments',
      },
      { path: '/projects/simcore/visualize', name: 'Visualize', description: '3D visualization' },
    ],
  } as SimCoreProject,
  mezan: {
    id: 'mezan',
    name: 'MEZAN',
    slug: 'mezan',
    description: 'Enterprise automation network for intelligent workflow orchestration',
    tagline: 'Automate Everything',
    version: '1.0.0',
    status: 'development',
    category: 'enterprise-automation',
    features: [
      'Workflow Automation',
      'Process Mining',
      'Integration Hub',
      'Analytics Dashboard',
      'Rule Engine',
    ],
    techStack: {
      frontend: ['React 18', 'TypeScript', 'React Flow', 'Tailwind CSS'],
      backend: ['Python FastAPI (spec)', 'Supabase Edge Functions'],
      infrastructure: ['Docker (spec)', 'Kubernetes (spec)'],
      databases: ['PostgreSQL', 'Redis (spec)'],
    },
    theme: {
      primary: '210 100% 50%', // Industrial blue
      secondary: '45 100% 50%', // Warning yellow
      accent: '140 70% 45%', // Success green
      background: '220 20% 10%',
      surface: '220 20% 14%',
      gradient: 'linear-gradient(135deg, hsl(210, 100%, 50%), hsl(45, 100%, 50%))',
    },
    routes: [
      { path: '/projects/mezan', name: 'Dashboard', description: 'Automation overview' },
      { path: '/projects/mezan/workflows', name: 'Workflows', description: 'Workflow builder' },
      {
        path: '/projects/mezan/integrations',
        name: 'Integrations',
        description: 'Connect services',
      },
      { path: '/projects/mezan/analytics', name: 'Analytics', description: 'Process analytics' },
      { path: '/projects/mezan/rules', name: 'Rules', description: 'Business rules engine' },
    ],
  } as MEZANProject,
  talai: {
    id: 'talai',
    name: 'TalAI',
    slug: 'talai',
    description: 'AI research platform for training, evaluation, and deployment',
    tagline: 'Research to Production',
    version: '0.9.0',
    status: 'beta',
    category: 'ai-research',
    features: [
      'Model Training',
      'Experiment Tracking',
      'Model Registry',
      'Inference API',
      'Dataset Management',
    ],
    techStack: {
      frontend: ['React 18', 'TypeScript', 'Plotly.js', 'TensorFlow.js'],
      backend: ['Python (spec)', 'Supabase Edge Functions', 'AI Gateway'],
      infrastructure: ['GPU Clusters (spec)', 'MLflow (spec)'],
      databases: ['PostgreSQL', 'Vector DB (spec)'],
    },
    theme: {
      primary: '280 85% 55%', // Neural purple
      secondary: '180 100% 50%', // Data cyan
      accent: '45 100% 60%', // Highlight gold
      background: '260 30% 8%',
      surface: '260 25% 12%',
      gradient: 'linear-gradient(135deg, hsl(280, 85%, 55%), hsl(180, 100%, 50%))',
    },
    routes: [
      { path: '/projects/talai', name: 'Dashboard', description: 'Research overview' },
      {
        path: '/projects/talai/experiments',
        name: 'Experiments',
        description: 'Track experiments',
      },
      { path: '/projects/talai/models', name: 'Models', description: 'Model registry' },
      { path: '/projects/talai/datasets', name: 'Datasets', description: 'Manage datasets' },
      { path: '/projects/talai/inference', name: 'Inference', description: 'Deploy models' },
    ],
  } as TalAIProject,
  optilibria: {
    id: 'optilibria',
    name: 'OptiLibria',
    slug: 'optilibria',
    description: 'Comprehensive optimization framework with 31+ algorithms',
    tagline: 'Optimize Anything',
    version: '1.2.0',
    status: 'active',
    category: 'optimization',
    features: [
      'Algorithm Library',
      'Problem Visualization',
      'Benchmark Suite',
      'Comparative Analysis',
      'API Integration',
    ],
    techStack: {
      frontend: ['React 18', 'TypeScript', 'D3.js', 'Recharts'],
      backend: ['Supabase Edge Functions', 'Optimization Engine'],
      infrastructure: ['WebWorkers', 'WASM (spec)'],
      databases: ['PostgreSQL'],
    },
    theme: {
      primary: '160 80% 45%', // Optimization green
      secondary: '200 100% 50%', // Data blue
      accent: '30 100% 55%', // Accent orange
      background: '170 25% 8%',
      surface: '170 20% 12%',
      gradient: 'linear-gradient(135deg, hsl(160, 80%, 45%), hsl(200, 100%, 50%))',
    },
    routes: [
      { path: '/projects/optilibria', name: 'Dashboard', description: 'Optimization hub' },
      {
        path: '/projects/optilibria/algorithms',
        name: 'Algorithms',
        description: 'Algorithm explorer',
      },
      { path: '/projects/optilibria/problems', name: 'Problems', description: 'Define problems' },
      { path: '/projects/optilibria/benchmark', name: 'Benchmark', description: 'Run benchmarks' },
      { path: '/projects/optilibria/compare', name: 'Compare', description: 'Compare results' },
    ],
  } as OptiLibriaProject,
  qmlab: {
    id: 'qmlab',
    name: 'QMLab',
    slug: 'qmlab',
    description: 'Interactive quantum mechanics laboratory and simulation environment',
    tagline: 'Quantum Made Visual',
    version: '0.8.0',
    status: 'beta',
    category: 'quantum-mechanics',
    features: [
      'Wave Function Visualization',
      'Quantum Systems',
      'Interactive Experiments',
      'Educational Modules',
      'Research Tools',
    ],
    techStack: {
      frontend: ['React 18', 'TypeScript', 'Three.js', 'WebGL'],
      backend: ['Supabase Edge Functions', 'Quantum Simulation Engine'],
      infrastructure: ['WebGPU (spec)', 'WASM'],
      databases: ['PostgreSQL'],
    },
    theme: {
      primary: '190 100% 50%', // Quantum cyan
      secondary: '270 90% 60%', // Probability purple
      accent: '320 90% 55%', // Entanglement pink
      background: '200 40% 6%',
      surface: '200 35% 10%',
      gradient: 'linear-gradient(135deg, hsl(190, 100%, 50%), hsl(270, 90%, 60%))',
    },
    routes: [
      { path: '/projects/qmlab', name: 'Laboratory', description: 'Main lab interface' },
      {
        path: '/projects/qmlab/wavefunctions',
        name: 'Wavefunctions',
        description: 'Visualize states',
      },
      { path: '/projects/qmlab/systems', name: 'Systems', description: 'Quantum systems' },
      { path: '/projects/qmlab/experiments', name: 'Experiments', description: 'Run experiments' },
      { path: '/projects/qmlab/learn', name: 'Learn', description: 'Educational content' },
    ],
  } as QMLabProject,
  repz: {
    id: 'repz',
    name: 'REPZ',
    slug: 'repz',
    description: 'AI-powered fitness tracking and performance analytics platform',
    tagline: 'Train Smarter, Not Harder',
    version: '2.0.0',
    status: 'active',
    category: 'portfolio',
    features: [
      'AI Workout Generation',
      'Progressive Overload Tracking',
      'Form Analysis',
      'Fatigue Detection',
      'Community Challenges',
    ],
    techStack: {
      frontend: ['React 18', 'TypeScript', 'Framer Motion', 'Capacitor'],
      backend: ['Supabase', 'FastAPI', 'ML Pipeline'],
      infrastructure: ['Vercel', 'Edge Functions'],
      databases: ['PostgreSQL', 'Redis'],
    },
    theme: {
      primary: '340 80% 50%', // Fitness red
      secondary: '200 100% 50%', // Energy blue
      accent: '45 100% 50%', // Strength gold
      background: '220 20% 10%',
      surface: '220 20% 14%',
      gradient: 'linear-gradient(135deg, hsl(340, 80%, 50%), hsl(200, 100%, 50%))',
    },
    routes: [{ path: '/projects/repz', name: 'Dashboard', description: 'Fitness overview' }],
  },
  liveiticonic: {
    id: 'liveiticonic',
    name: 'Live It Iconic',
    slug: 'liveiticonic',
    description: 'Luxury fashion e-commerce platform with AI style recommendations',
    tagline: 'Iconic Style, Delivered',
    version: '1.5.0',
    status: 'active',
    category: 'portfolio',
    features: [
      'AI Style Recommendations',
      'Virtual Try-On',
      'Luxury Curation',
      'Exclusive Drops',
      'Member Benefits',
    ],
    techStack: {
      frontend: ['React 18', 'TypeScript', 'Next.js', 'Three.js'],
      backend: ['Supabase', 'Stripe', 'AI Recommendations'],
      infrastructure: ['Vercel', 'CDN'],
      databases: ['PostgreSQL'],
    },
    theme: {
      primary: '280 60% 50%', // Luxury purple
      secondary: '30 100% 50%', // Gold accent
      accent: '0 0% 20%', // Elegant black
      background: '0 0% 98%',
      surface: '0 0% 100%',
      gradient: 'linear-gradient(135deg, hsl(280, 60%, 50%), hsl(30, 100%, 50%))',
    },
    routes: [
      { path: '/projects/liveiticonic', name: 'Showcase', description: 'Platform overview' },
    ],
  },
  attributa: {
    id: 'attributa',
    name: 'Attributa',
    slug: 'attributa',
    description: 'AI-powered content attribution and detection platform',
    tagline: 'Know Your Content',
    version: '1.0.0',
    status: 'active',
    category: 'portfolio',
    features: [
      'AI Content Detection',
      'Plagiarism Checking',
      'Attribution Analysis',
      'Source Tracking',
      'API Access',
    ],
    techStack: {
      frontend: ['React 18', 'TypeScript', 'Tailwind CSS'],
      backend: ['Supabase', 'ML Models', 'NLP Pipeline'],
      infrastructure: ['Vercel', 'Edge Functions'],
      databases: ['PostgreSQL', 'Vector DB'],
    },
    theme: {
      primary: '220 90% 50%', // Trust blue
      secondary: '160 70% 45%', // Verify green
      accent: '45 100% 50%', // Alert yellow
      background: '220 20% 10%',
      surface: '220 20% 14%',
      gradient: 'linear-gradient(135deg, hsl(220, 90%, 50%), hsl(160, 70%, 45%))',
    },
    routes: [{ path: '/projects/attributa', name: 'Dashboard', description: 'Content analysis' }],
  },
  llmworks: {
    id: 'llmworks',
    name: 'LLMWorks',
    slug: 'llmworks',
    description: 'LLM benchmarking and testing platform for model evaluation',
    tagline: 'Test. Measure. Improve.',
    version: '1.0.0',
    status: 'active',
    category: 'portfolio',
    features: [
      'Model Benchmarking',
      'Performance Testing',
      'Comparison Tools',
      'Custom Evaluations',
      'Leaderboards',
    ],
    techStack: {
      frontend: ['React 18', 'TypeScript', 'Recharts', 'Plotly.js'],
      backend: ['Supabase', 'Python API', 'Evaluation Engine'],
      infrastructure: ['Vercel', 'GPU Clusters'],
      databases: ['PostgreSQL', 'TimescaleDB'],
    },
    theme: {
      primary: '260 80% 55%', // AI purple
      secondary: '180 100% 50%', // Data cyan
      accent: '45 100% 60%', // Performance gold
      background: '260 30% 8%',
      surface: '260 25% 12%',
      gradient: 'linear-gradient(135deg, hsl(260, 80%, 55%), hsl(180, 100%, 50%))',
    },
    routes: [{ path: '/projects/llmworks', name: 'Dashboard', description: 'Benchmarking hub' }],
  },
};

export const getProject = (slug: string): Project | undefined => {
  return projectRegistry[slug];
};

export const getAllProjects = (): Project[] => {
  return Object.values(projectRegistry);
};

export const getProjectsByCategory = (category: string): Project[] => {
  return getAllProjects().filter((p) => p.category === category);
};
