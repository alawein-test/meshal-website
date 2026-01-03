import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Shield, Globe } from 'lucide-react';

const LandingPreview = () => {
  const features = [
    { icon: Zap, title: 'Lightning Fast', description: 'Built for speed and performance' },
    { icon: Shield, title: 'Secure by Default', description: 'Enterprise-grade security built in' },
    { icon: Globe, title: 'Global Scale', description: 'Deploy anywhere in the world' },
  ];

  return (
    <div className="min-h-[600px] bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-border/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">Brand</span>
        </div>
        <div className="flex items-center gap-8">
          {['Features', 'Pricing', 'About', 'Contact'].map((item) => (
            <span
              key={item}
              className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {item}
            </span>
          ))}
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-8 py-20 text-center">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Introducing v2.0
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold mb-6 leading-tight"
          >
            Build Something
            <br />
            <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Extraordinary
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            The modern platform for building, deploying, and scaling your applications. Start free,
            scale infinitely.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-4"
          >
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors">
              Start Building
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-secondary/50 transition-colors">
              View Demo
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-8 py-12">
        <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="p-6 rounded-xl border border-border/50 bg-card/30 text-center"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPreview;
