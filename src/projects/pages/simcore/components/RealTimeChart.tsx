import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Pause, Play, RefreshCw } from 'lucide-react';

interface DataPoint {
  time: string;
  cpu: number;
  memory: number;
  throughput: number;
  latency: number;
}

const generateDataPoint = (index: number): DataPoint => ({
  time: `${index}s`,
  cpu: 40 + Math.random() * 50,
  memory: 50 + Math.random() * 35,
  throughput: 100 + Math.random() * 150,
  latency: 5 + Math.random() * 20,
});

const RealTimeChart = () => {
  const [data, setData] = useState<DataPoint[]>(() =>
    Array.from({ length: 20 }, (_, i) => generateDataPoint(i))
  );
  const [isRunning, setIsRunning] = useState(true);
  const [activeMetric, setActiveMetric] = useState<'cpu' | 'memory' | 'throughput' | 'latency'>(
    'cpu'
  );

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev.slice(1), generateDataPoint(Date.now() % 1000)];
        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const metrics = [
    {
      key: 'cpu',
      label: 'CPU',
      color: 'hsl(var(--primary))',
      value: data[data.length - 1]?.cpu.toFixed(1),
    },
    {
      key: 'memory',
      label: 'Memory',
      color: 'hsl(var(--chart-2))',
      value: data[data.length - 1]?.memory.toFixed(1),
    },
    {
      key: 'throughput',
      label: 'Throughput',
      color: 'hsl(var(--chart-3))',
      value: data[data.length - 1]?.throughput.toFixed(0),
    },
    {
      key: 'latency',
      label: 'Latency',
      color: 'hsl(var(--chart-4))',
      value: data[data.length - 1]?.latency.toFixed(1),
    },
  ];

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Real-Time Metrics
            {isRunning && (
              <Badge variant="outline" className="text-green-400 border-green-500/30 animate-pulse">
                LIVE
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setIsRunning(!isRunning)}>
              {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setData(Array.from({ length: 20 }, (_, i) => generateDataPoint(i)))}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Metric Selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          {metrics.map((metric) => (
            <motion.button
              key={metric.key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveMetric(metric.key as typeof activeMetric)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                activeMetric === metric.key
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border/50 bg-muted/30 text-muted-foreground hover:border-primary/50'
              }`}
            >
              <div className="text-xs">{metric.label}</div>
              <div className="text-lg font-bold font-mono">
                {metric.value}
                {metric.key === 'cpu' || metric.key === 'memory'
                  ? '%'
                  : metric.key === 'latency'
                    ? 'ms'
                    : '/s'}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Chart */}
        <div className="h-[250px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis
                dataKey="time"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Area
                type="monotone"
                dataKey={activeMetric}
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#colorMetric)"
                dot={false}
                animationDuration={300}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeChart;
