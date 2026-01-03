import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Github, ExternalLink, ArrowRight, Eye } from 'lucide-react';
import { useState } from 'react';

interface CaseStudy {
  id: string;
  name: string;
  tagline: string;
  description: string;
  challenge: string;
  solution: string;
  results: string[];
  tech: string[];
  color: string;
  github?: string;
  demo?: string;
  image?: string;
  link: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: 'simcore',
    name: 'SimCore',
    tagline: 'Scientific Simulation Engine',
    description:
      'High-performance simulation platform for physics-based modeling and real-time visualization.',
    challenge:
      'Scientists needed a way to run complex physics simulations without writing low-level code, while maintaining performance comparable to hand-optimized solutions.',
    solution:
      'Built a domain-specific language that compiles to optimized CUDA kernels, with a React-based visualization layer for real-time monitoring.',
    results: [
      '10x faster iteration cycles',
      '95% reduction in boilerplate code',
      'Used by 3 research labs',
    ],
    tech: ['Python', 'CUDA', 'React', 'WebGL'],
    color: 'jules-cyan',
    link: '/project/simcore',
  },
  {
    id: 'qmlab',
    name: 'QMLab',
    tagline: 'Quantum Mechanics Laboratory',
    description:
      'Interactive quantum mechanics simulation and visualization platform for education and research.',
    challenge:
      'Quantum mechanics is notoriously hard to visualize. Students struggle to build intuition for wave functions and measurement.',
    solution:
      'Created real-time wave function visualizers with interactive controls, allowing students to "play" with quantum systems.',
    results: [
      'Adopted by 2 universities',
      '4.8/5 student satisfaction',
      'Featured in Physics Today',
    ],
    tech: ['Julia', 'Three.js', 'TypeScript', 'WebAssembly'],
    color: 'jules-magenta',
    link: '/project/qmlab',
  },
  {
    id: 'optilibria',
    name: 'OptiLibria',
    tagline: 'Optimization Algorithm Suite',
    description:
      'GPU-accelerated optimization library for large-scale convex and non-convex problems.',
    challenge:
      'Existing optimization libraries were either too slow for production or too complex for researchers to use effectively.',
    solution:
      'Designed a unified API that automatically selects and tunes algorithms based on problem structure.',
    results: [
      '50x speedup on benchmark problems',
      '1,200+ GitHub stars',
      'pip installs: 50k/month',
    ],
    tech: ['Python', 'JAX', 'C++', 'CUDA'],
    color: 'jules-yellow',
    link: '/project/optilibria',
  },
  {
    id: 'talai',
    name: 'TalAI',
    tagline: 'ML Experiment Platform',
    description:
      'End-to-end machine learning experiment tracking, hyperparameter optimization, and deployment.',
    challenge:
      'ML teams spend more time managing experiments than running them. Reproducibility is a constant struggle.',
    solution:
      'Built a platform that automatically tracks experiments, optimizes hyperparameters, and manages model versions.',
    results: [
      '40% faster model iteration',
      '100% experiment reproducibility',
      'Integrated with major ML frameworks',
    ],
    tech: ['PyTorch', 'FastAPI', 'React', 'PostgreSQL'],
    color: 'jules-green',
    link: '/project/talai',
  },
];

export const ProjectShowcase = () => {
  const [activeProject, setActiveProject] = useState<string | null>(null);

  return (
    <div className="space-y-12">
      {caseStudies.map((project, index) => (
        <motion.article
          key={project.id}
          className="group relative"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          onHoverStart={() => setActiveProject(project.id)}
          onHoverEnd={() => setActiveProject(null)}
        >
          <div
            className="relative overflow-hidden rounded-2xl border bg-jules-surface/30 backdrop-blur-xl transition-all duration-500"
            style={{
              borderColor:
                activeProject === project.id
                  ? `hsl(var(--${project.color}))`
                  : `hsl(var(--${project.color}) / 0.2)`,
              boxShadow:
                activeProject === project.id
                  ? `0 0 60px hsl(var(--${project.color}) / 0.2)`
                  : `0 0 20px hsl(var(--${project.color}) / 0.05)`,
            }}
          >
            {/* Gradient accent */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{
                background: `linear-gradient(90deg, transparent, hsl(var(--${project.color})), transparent)`,
              }}
            />

            <div className="p-8 md:p-10">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <motion.h3
                    className="text-2xl md:text-3xl font-bold mb-2"
                    style={{
                      color: `hsl(var(--${project.color}))`,
                      textShadow: `0 0 30px hsl(var(--${project.color}) / 0.3)`,
                    }}
                  >
                    {project.name}
                  </motion.h3>
                  <p className="text-muted-foreground font-mono text-sm">{project.tagline}</p>
                </div>

                <div className="flex gap-2">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg border transition-colors"
                      style={{
                        borderColor: `hsl(var(--${project.color}) / 0.3)`,
                        color: `hsl(var(--${project.color}))`,
                      }}
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg border transition-colors"
                      style={{
                        borderColor: `hsl(var(--${project.color}) / 0.3)`,
                        color: `hsl(var(--${project.color}))`,
                      }}
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-foreground mb-6">{project.description}</p>

              {/* Challenge & Solution */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div
                  className="p-4 rounded-lg border"
                  style={{
                    borderColor: `hsl(var(--${project.color}) / 0.2)`,
                    background: `hsl(var(--${project.color}) / 0.05)`,
                  }}
                >
                  <h4 className="font-semibold mb-2 text-sm uppercase tracking-wider text-muted-foreground">
                    The Challenge
                  </h4>
                  <p className="text-sm text-muted-foreground">{project.challenge}</p>
                </div>
                <div
                  className="p-4 rounded-lg border"
                  style={{
                    borderColor: `hsl(var(--${project.color}) / 0.2)`,
                    background: `hsl(var(--${project.color}) / 0.05)`,
                  }}
                >
                  <h4 className="font-semibold mb-2 text-sm uppercase tracking-wider text-muted-foreground">
                    The Solution
                  </h4>
                  <p className="text-sm text-muted-foreground">{project.solution}</p>
                </div>
              </div>

              {/* Results */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                  Key Results
                </h4>
                <div className="flex flex-wrap gap-3">
                  {project.results.map((result, i) => (
                    <motion.span
                      key={i}
                      className="px-3 py-1.5 rounded-full text-sm font-medium"
                      style={{
                        background: `hsl(var(--${project.color}) / 0.15)`,
                        color: `hsl(var(--${project.color}))`,
                        border: `1px solid hsl(var(--${project.color}) / 0.3)`,
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      ✓ {result}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-xs font-mono rounded-md border"
                      style={{
                        borderColor: `hsl(var(--${project.color}) / 0.2)`,
                        color: `hsl(var(--${project.color}) / 0.8)`,
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <Link
                  to={project.link}
                  className="flex items-center gap-2 text-sm font-medium transition-colors group/link"
                  style={{ color: `hsl(var(--${project.color}))` }}
                >
                  <Eye className="w-4 h-4" />
                  <span>View Project</span>
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
};

export default ProjectShowcase;
