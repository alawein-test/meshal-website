import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { PreloadLink } from '@/components/shared/PreloadLink';
import { ArrowRight, Boxes } from 'lucide-react';
import { ProjectShowcase3D } from './portfolio/ProjectShowcase3D';
import { Button } from './ui/button';

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="projects" className="py-32 relative" ref={ref}>
      <div className="container px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-wrap items-end justify-between gap-4 mb-16">
            <div>
              <h2
                className="text-4xl md:text-5xl font-bold mb-4 text-jules-yellow glitch-text"
                data-text="// Featured Projects"
                style={{ textShadow: '0 0 20px hsl(var(--jules-yellow))' }}
              >
                {'// Featured Projects'}
              </h2>
              <p className="text-muted-foreground font-mono">
                {'// Case studies and technical deep-dives'}
              </p>
            </div>

            <PreloadLink to="/projects">
              <Button
                variant="outline"
                className="gap-2 border-jules-yellow/30 text-jules-yellow hover:bg-jules-yellow/10"
                style={{ boxShadow: '0 0 15px hsl(var(--jules-yellow) / 0.2)' }}
              >
                <Boxes className="w-4 h-4" />
                View All Projects
                <ArrowRight className="w-4 h-4" />
              </Button>
            </PreloadLink>
          </div>

          <ProjectShowcase3D />
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
