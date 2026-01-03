// Project Card Component for Project Hub - Enhanced Version
import { motion } from 'framer-motion';
import { ArrowRight, GitBranch, Zap, Star, Clock } from 'lucide-react';
import { Project } from '../types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState, useCallback } from 'react';
import { PreloadLink } from '@/components/shared/PreloadLink';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const statusColors = {
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  development: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  beta: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  deprecated: 'bg-red-500/20 text-red-400 border-red-500/30',
  archived: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const categoryIcons = {
  'scientific-computing': '🔬',
  'enterprise-automation': '⚙️',
  'ai-research': '🧠',
  optimization: '📈',
  'quantum-mechanics': '⚛️',
  portfolio: '💼',
};

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      (e.currentTarget.querySelector('a') as HTMLAnchorElement)?.click();
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background rounded-2xl"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      tabIndex={0}
      data-navigable
      onKeyDown={handleKeyDown}
      role="article"
      aria-label={`${project.name} - ${project.tagline}`}
    >
      <PreloadLink to={`/project/${project.id}`} tabIndex={-1}>
        <div
          className="relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl transition-all duration-500"
          style={{
            borderColor: isHovered ? project.theme.primary : undefined,
            boxShadow: isHovered ? `0 0 40px ${project.theme.primary}30` : undefined,
          }}
        >
          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `linear-gradient(135deg, ${project.theme.primary}10, ${project.theme.secondary}10)`,
            }}
          />

          {/* Top accent bar */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ background: project.theme.gradient }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Header */}
          <div className="relative p-6 pb-4">
            <div className="flex items-start justify-between mb-4">
              <motion.div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg"
                style={{ background: project.theme.gradient }}
                animate={{
                  rotate: isHovered ? [0, -5, 5, 0] : 0,
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {categoryIcons[project.category] || project.name.charAt(0)}
              </motion.div>
              <Badge className={cn('text-xs', statusColors[project.status])}>
                {project.status}
              </Badge>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
              {project.name}
            </h3>
            <p className="text-sm text-muted-foreground font-medium">{project.tagline}</p>
          </div>

          {/* Description */}
          <div className="relative px-6 pb-4">
            <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
          </div>

          {/* Features */}
          <div className="relative px-6 pb-4">
            <div className="flex flex-wrap gap-2">
              {project.features.slice(0, 3).map((feature, i) => (
                <motion.span
                  key={i}
                  className="px-2.5 py-1 text-xs rounded-full bg-muted/50 text-muted-foreground"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                >
                  {feature}
                </motion.span>
              ))}
              {project.features.length > 3 && (
                <span className="px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary">
                  +{project.features.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="relative px-6 pb-4">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                <span>{project.techStack.frontend.length} frontend</span>
              </div>
              <div className="flex items-center gap-1">
                <GitBranch className="h-3 w-3" />
                <span>{project.techStack.backend.length} backend</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500" />
                <span>{project.routes.length} routes</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="relative px-6 py-4 border-t border-border/50 bg-muted/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>v{project.version}</span>
              </div>
              <motion.div
                className="flex items-center gap-2 text-primary text-sm font-medium"
                animate={{ x: isHovered ? 5 : 0 }}
              >
                <span>Explore</span>
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </div>
          </div>

          {/* Hover glow effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${project.theme.primary}20, transparent 70%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </PreloadLink>
    </motion.div>
  );
};

export default ProjectCard;
