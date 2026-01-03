import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function AnimationDemosPreview() {
  return (
    <div className="p-6 space-y-6 bg-background min-h-[500px]">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold gradient-text mb-2">Animation Library</h2>
        <p className="text-sm text-muted-foreground">Framer Motion powered interactions</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Hover Effects */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Hover Effects</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-3">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center cursor-pointer"
            >
              <span className="text-xs">Scale</span>
            </motion.div>
            <motion.div
              whileHover={{ rotate: 10 }}
              className="w-16 h-16 rounded-lg bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center cursor-pointer"
            >
              <span className="text-xs">Rotate</span>
            </motion.div>
            <motion.div
              whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)' }}
              className="w-16 h-16 rounded-lg bg-pink-500/20 border border-pink-500/50 flex items-center justify-center cursor-pointer"
            >
              <span className="text-xs">Lift</span>
            </motion.div>
          </CardContent>
        </Card>

        {/* Stagger Animation */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Stagger List</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  variants={item}
                  className="h-6 bg-muted/50 rounded flex items-center px-3"
                >
                  <span className="text-xs text-muted-foreground">Item {i}</span>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>

        {/* Loading States */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Loading States</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4 items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
            />
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                  className="w-2 h-2 bg-primary rounded-full"
                />
              ))}
            </div>
            <motion.div
              animate={{ scaleX: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-1 w-16 bg-primary/50 rounded-full origin-left"
            />
          </CardContent>
        </Card>

        {/* Gesture */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Drag & Drop</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              drag
              dragConstraints={{ left: 0, right: 100, top: 0, bottom: 50 }}
              whileDrag={{ scale: 1.1 }}
              className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center cursor-grab active:cursor-grabbing"
            >
              <span className="text-xs text-white font-medium">Drag me</span>
            </motion.div>
          </CardContent>
        </Card>
      </div>

      {/* Pulse Animation */}
      <Card className="glass-card">
        <CardContent className="pt-4 flex items-center justify-center gap-6">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-full"
          >
            <span className="text-xs text-green-400">Live Pulse</span>
          </motion.div>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full"
          >
            <span className="text-xs text-blue-400">Fade Pulse</span>
          </motion.div>
          <motion.div
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(139, 92, 246, 0.4)',
                '0 0 0 10px rgba(139, 92, 246, 0)',
                '0 0 0 0 rgba(139, 92, 246, 0)',
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="px-4 py-2 bg-primary/20 border border-primary/50 rounded-full"
          >
            <span className="text-xs text-primary">Ring Pulse</span>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AnimationDemosPreview;
