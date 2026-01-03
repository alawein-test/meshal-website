import { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Text,
  RoundedBox,
  Float,
  Environment,
  Stars,
  OrbitControls,
  Html,
} from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  tech: string[];
  color: string;
  link: string;
  github?: string;
  demo?: string;
}

const projects: Project[] = [
  {
    id: 'simcore',
    name: 'SimCore',
    tagline: 'Real-time Simulation Engine',
    description:
      'High-performance physics simulation engine with GPU acceleration and real-time visualization.',
    tech: ['Rust', 'WebGPU', 'React', 'TypeScript'],
    color: '#22d3ee',
    link: '/projects/simcore',
    github: 'https://github.com',
    demo: 'https://demo.com',
  },
  {
    id: 'optilibria',
    name: 'OptiLibria',
    tagline: 'Optimization Algorithm Library',
    description:
      'Comprehensive library of optimization algorithms for scientific computing and ML applications.',
    tech: ['Python', 'NumPy', 'Cython', 'CUDA'],
    color: '#a855f7',
    link: '/projects/optilibria',
    github: 'https://github.com',
  },
  {
    id: 'qmlab',
    name: 'QMLab',
    tagline: 'Quantum Mechanics Simulator',
    description:
      'Interactive quantum mechanics laboratory for education and research applications.',
    tech: ['Julia', 'React', 'Three.js', 'WebGL'],
    color: '#f97316',
    link: '/projects/qmlab',
    demo: 'https://demo.com',
  },
  {
    id: 'mezan',
    name: 'MEZAN',
    tagline: 'Enterprise Automation Platform',
    description:
      'Workflow automation platform with AI-driven decision making and multi-language support.',
    tech: ['TypeScript', 'Node.js', 'PostgreSQL', 'Redis'],
    color: '#10b981',
    link: '/projects/mezan',
    github: 'https://github.com',
  },
  {
    id: 'talai',
    name: 'TalAI',
    tagline: 'AI Research Framework',
    description: 'Experimental AI research framework focusing on novel training methodologies.',
    tech: ['Python', 'PyTorch', 'JAX', 'Transformers'],
    color: '#ec4899',
    link: '/projects/talai',
  },
];

// 3D Project Card Component
function ProjectCard({
  project,
  index,
  total,
  isActive,
  onClick,
}: {
  project: Project;
  index: number;
  total: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Calculate position in a circle
  const angle = (index / total) * Math.PI * 2;
  const radius = 4;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime + index) * 0.1;

      // Face center when active
      if (isActive) {
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, -angle, 0.1);
      } else {
        meshRef.current.rotation.y = THREE.MathUtils.lerp(
          meshRef.current.rotation.y,
          -angle + Math.PI * 0.1,
          0.05
        );
      }

      // Scale on hover
      const targetScale = hovered ? 1.1 : isActive ? 1.05 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  const color = new THREE.Color(project.color);

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group position={[x, 0, z]}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={onClick}
        >
          <RoundedBox args={[2.5, 1.8, 0.15]} radius={0.1} smoothness={4}>
            <meshStandardMaterial
              color={hovered || isActive ? color : color.clone().multiplyScalar(0.6)}
              metalness={0.3}
              roughness={0.4}
              emissive={color}
              emissiveIntensity={hovered || isActive ? 0.4 : 0.1}
              transparent
              opacity={0.9}
            />
          </RoundedBox>

          {/* Project Name */}
          <Text
            position={[0, 0.4, 0.1]}
            fontSize={0.2}
            color="white"
            anchorX="center"
            anchorY="middle"
            font="/fonts/SpaceGrotesk-Bold.ttf"
          >
            {project.name}
          </Text>

          {/* Tagline */}
          <Text
            position={[0, 0.05, 0.1]}
            fontSize={0.1}
            color="#a0a0a0"
            anchorX="center"
            anchorY="middle"
            maxWidth={2}
          >
            {project.tagline}
          </Text>

          {/* Tech badges */}
          {project.tech.slice(0, 3).map((tech, i) => (
            <Text
              key={tech}
              position={[-0.8 + i * 0.8, -0.4, 0.1]}
              fontSize={0.07}
              color={project.color}
              anchorX="center"
              anchorY="middle"
            >
              {tech}
            </Text>
          ))}

          {/* Glow effect */}
          <pointLight
            position={[0, 0, 0.5]}
            color={project.color}
            intensity={hovered || isActive ? 2 : 0.5}
            distance={3}
          />
        </mesh>
      </group>
    </Float>
  );
}

// Rotating platform
function Platform() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[3, 5, 64]} />
      <meshStandardMaterial
        color="#1a1a2e"
        metalness={0.8}
        roughness={0.2}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

// Particle system
function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 500;

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

    const color = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.8, 0.5);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} vertexColors transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

// Camera controller
function CameraController({ activeIndex }: { activeIndex: number }) {
  const { camera } = useThree();
  const total = projects.length;

  useFrame(() => {
    const angle = (activeIndex / total) * Math.PI * 2 + Math.PI;
    const targetX = Math.sin(angle) * 6;
    const targetZ = Math.cos(angle) * 6;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.02);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 2, 0.02);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Main component
export function ProjectShowcase3D() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const activeProject = projects[activeIndex];

  const nextProject = () => {
    setActiveIndex((prev) => (prev + 1) % projects.length);
    setShowDetails(false);
  };

  const prevProject = () => {
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
    setShowDetails(false);
  };

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-border/30">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 2, 8], fov: 50 }}
        dpr={[1, 2]}
        style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 100%)' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.5} castShadow />

          <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
          <Particles />
          <Platform />

          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              total={projects.length}
              isActive={index === activeIndex}
              onClick={() => {
                setActiveIndex(index);
                setShowDetails(true);
              }}
            />
          ))}

          <CameraController activeIndex={activeIndex} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 4}
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>

      {/* Navigation Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={prevProject}
          className="rounded-full bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/80"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex gap-2">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === activeIndex
                  ? 'bg-primary w-6'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={nextProject}
          className="rounded-full bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/80"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Project Details Panel */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: 'spring', damping: 20 }}
            className="absolute top-4 right-4 w-80 p-6 rounded-xl bg-background/80 backdrop-blur-xl border border-border/50"
            style={{
              boxShadow: `0 0 40px ${activeProject.color}20`,
            }}
          >
            <button
              onClick={() => setShowDetails(false)}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>

            <div
              className="inline-block px-3 py-1 rounded-full text-xs font-mono mb-3"
              style={{
                backgroundColor: `${activeProject.color}20`,
                color: activeProject.color,
              }}
            >
              {activeProject.id.toUpperCase()}
            </div>

            <h3 className="text-xl font-bold mb-1">{activeProject.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{activeProject.tagline}</p>

            <p className="text-sm leading-relaxed mb-4">{activeProject.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {activeProject.tech.map((tech) => (
                <span key={tech} className="px-2 py-1 rounded text-xs font-mono bg-muted">
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              {activeProject.github && (
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <a href={activeProject.github} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                </Button>
              )}
              {activeProject.demo && (
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <a href={activeProject.demo} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Demo
                  </a>
                </Button>
              )}
              <Button
                size="sm"
                className="gap-2 ml-auto"
                style={{ backgroundColor: activeProject.color }}
                asChild
              >
                <a href={activeProject.link}>View Project</a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Title Overlay */}
      <div className="absolute top-4 left-4">
        <motion.div
          key={activeProject.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: activeProject.color }}
          />
          <span className="text-lg font-bold">{activeProject.name}</span>
          <span className="text-sm text-muted-foreground">— {activeProject.tagline}</span>
        </motion.div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/50 font-mono">
        Click on cards to view details • Drag to rotate
      </div>
    </div>
  );
}
