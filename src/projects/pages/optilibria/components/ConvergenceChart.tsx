import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingDown, Play, Pause, RotateCcw } from 'lucide-react';

interface ConvergenceChartProps {
  algorithm?: string;
  isRunning?: boolean;
}

const generateConvergenceData = (iteration: number, algorithm: string) => {
  const data = [];
  for (let i = 0; i <= iteration; i++) {
    let value: number;

    switch (algorithm) {
      case 'genetic':
        value = 100 * Math.exp(-0.03 * i) + 5 * Math.sin(i * 0.5) + 10 + Math.random() * 3;
        break;
      case 'pso':
        value = 80 * Math.exp(-0.05 * i) + 8 * Math.cos(i * 0.3) + 8 + Math.random() * 2;
        break;
      case 'annealing':
        value = 120 * Math.exp(-0.025 * i * (1 + Math.random() * 0.1)) + 5 + Math.random() * 4;
        break;
      case 'gradient':
        value = 90 * Math.exp(-0.08 * i) + 3 + Math.random() * 1;
        break;
      default:
        value = 100 * Math.exp(-0.04 * i) + 10 + Math.random() * 2;
    }

    data.push({
      iteration: i,
      fitness: Math.max(value, 5),
      bestFitness: Math.max(value * 0.9, 3),
    });
  }
  return data;
};

const ConvergenceChart = ({
  algorithm = 'genetic',
  isRunning: externalRunning,
}: ConvergenceChartProps) => {
  const [iteration, setIteration] = useState(0);
  const [isRunning, setIsRunning] = useState(externalRunning ?? false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(algorithm);
  const [data, setData] = useState(generateConvergenceData(0, selectedAlgorithm));

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && iteration < 100) {
      interval = setInterval(() => {
        setIteration((prev) => {
          const newIteration = prev + 1;
          setData(generateConvergenceData(newIteration, selectedAlgorithm));
          return newIteration;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isRunning, iteration, selectedAlgorithm]);

  const handleReset = () => {
    setIteration(0);
    setIsRunning(false);
    setData(generateConvergenceData(0, selectedAlgorithm));
  };

  const algorithms = [
    { id: 'genetic', name: 'Genetic Algorithm', color: '#10b981' },
    { id: 'pso', name: 'Particle Swarm', color: '#3b82f6' },
    { id: 'annealing', name: 'Simulated Annealing', color: '#f59e0b' },
    { id: 'gradient', name: 'Gradient Descent', color: '#8b5cf6' },
  ];

  const currentAlgo = algorithms.find((a) => a.id === selectedAlgorithm) || algorithms[0];
  const currentFitness = data[data.length - 1]?.fitness.toFixed(2) || '0';
  const bestFitness = Math.min(...data.map((d) => d.fitness)).toFixed(2);

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-green-400" />
            Convergence Analysis
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={isRunning ? 'destructive' : 'default'}
              onClick={() => setIsRunning(!isRunning)}
              disabled={iteration >= 100}
            >
              {isRunning ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
              {isRunning ? 'Pause' : 'Run'}
            </Button>
            <Button size="sm" variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Algorithm Selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          {algorithms.map((algo) => (
            <motion.button
              key={algo.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedAlgorithm(algo.id);
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedAlgorithm === algo.id
                  ? 'text-white'
                  : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
              }`}
              style={{
                backgroundColor: selectedAlgorithm === algo.id ? algo.color : undefined,
              }}
            >
              {algo.name}
            </motion.button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-xs text-muted-foreground">Iteration</p>
            <p className="text-xl font-bold font-mono">{iteration}/100</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-xs text-muted-foreground">Current Fitness</p>
            <p className="text-xl font-bold font-mono" style={{ color: currentAlgo.color }}>
              {currentFitness}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-xs text-muted-foreground">Best Fitness</p>
            <p className="text-xl font-bold font-mono text-green-400">{bestFitness}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="convergenceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentAlgo.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={currentAlgo.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis
                dataKey="iteration"
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
                domain={[0, 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="fitness"
                stroke={currentAlgo.color}
                strokeWidth={2}
                fill="url(#convergenceGradient)"
                dot={false}
                animationDuration={100}
              />
              <Line
                type="monotone"
                dataKey="bestFitness"
                stroke="#22c55e"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: currentAlgo.color }}
              initial={{ width: 0 }}
              animate={{ width: `${iteration}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConvergenceChart;
