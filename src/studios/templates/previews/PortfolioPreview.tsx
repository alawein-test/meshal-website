import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ExternalLink, Code2, Palette, Terminal } from 'lucide-react';

const PortfolioPreview = () => {
  const projects = [
    { title: 'E-Commerce Platform', category: 'Full Stack', color: 'from-blue-500 to-cyan-500' },
    { title: 'AI Dashboard', category: 'Machine Learning', color: 'from-purple-500 to-pink-500' },
    { title: 'Mobile App', category: 'React Native', color: 'from-orange-500 to-red-500' },
  ];

  const skills = [
    { icon: Code2, name: 'Frontend', items: ['React', 'TypeScript', 'Tailwind'] },
    { icon: Terminal, name: 'Backend', items: ['Node.js', 'Python', 'PostgreSQL'] },
    { icon: Palette, name: 'Design', items: ['Figma', 'UI/UX', 'Motion'] },
  ];

  return (
    <div className="min-h-[600px] bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-border/30">
        <span className="font-bold text-xl">Portfolio</span>
        <nav className="flex items-center gap-6">
          {['Work', 'About', 'Skills', 'Contact'].map((item) => (
            <span
              key={item}
              className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {item}
            </span>
          ))}
        </nav>
      </header>

      {/* Hero */}
      <section className="px-8 py-16 flex items-center gap-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1"
        >
          <p className="text-primary font-medium mb-2">Hello, I'm</p>
          <h1 className="text-4xl font-bold mb-4">John Developer</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Full-stack developer passionate about building
            <br />
            beautiful and functional web experiences.
          </p>
          <div className="flex items-center gap-4">
            <button className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
              View Projects
            </button>
            <div className="flex items-center gap-3">
              <Github className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer" />
              <Linkedin className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer" />
              <Mail className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-48 h-48 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary overflow-hidden border border-border/50"
        >
          <div className="w-full h-full flex items-center justify-center text-6xl">👨‍💻</div>
        </motion.div>
      </section>

      {/* Skills */}
      <section className="px-8 py-8">
        <div className="grid grid-cols-3 gap-4">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="p-4 rounded-lg border border-border/50 bg-card/30"
            >
              <div className="flex items-center gap-2 mb-3">
                <skill.icon className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">{skill.name}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skill.items.map((item) => (
                  <span key={item} className="px-2 py-1 bg-secondary/50 rounded text-xs">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="px-8 py-8">
        <h2 className="text-xl font-semibold mb-4">Featured Projects</h2>
        <div className="grid grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="group relative rounded-lg overflow-hidden border border-border/50"
            >
              <div className={`h-32 bg-gradient-to-br ${project.color} opacity-80`} />
              <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ExternalLink className="w-6 h-6 text-foreground" />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm">{project.title}</h3>
                <p className="text-xs text-muted-foreground">{project.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PortfolioPreview;
