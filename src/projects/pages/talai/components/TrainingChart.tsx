import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingDown, TrendingUp, RefreshCw } from 'lucide-react';

interface TrainingDataPoint {
  epoch: number;
  trainLoss: number;
  valLoss: number;
  trainAcc: number;
  valAcc: number;
}

const generateTrainingData = (epochs: number): TrainingDataPoint[] => {
  return Array.from({ length: epochs }, (_, i) => {
    const epoch = i + 1;
    const baseTrainLoss = 2 * Math.exp(-epoch / 15) + 0.1;
    const baseValLoss = 2.2 * Math.exp(-epoch / 18) + 0.15;

    return {
      epoch,
      trainLoss: baseTrainLoss + Math.random() * 0.05,
      valLoss: baseValLoss + Math.random() * 0.08,
      trainAcc: Math.min(0.99, 0.5 + epoch / 50 + Math.random() * 0.02),
      valAcc: Math.min(0.97, 0.45 + epoch / 55 + Math.random() * 0.03),
    };
  });
};

const TrainingChart = () => {
  const [data, setData] = useState<TrainingDataPoint[]>([]);
  const [activeChart, setActiveChart] = useState<'loss' | 'accuracy'>('loss');

  useEffect(() => {
    setData(generateTrainingData(50));
  }, []);

  const latestData = data[data.length - 1];

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {activeChart === 'loss' ? (
              <>
                <TrendingDown className="h-5 w-5 text-red-400" />
                Training Loss
              </>
            ) : (
              <>
                <TrendingUp className="h-5 w-5 text-green-400" />
                Accuracy
              </>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={activeChart === 'loss' ? 'default' : 'outline'}
              onClick={() => setActiveChart('loss')}
            >
              Loss
            </Button>
            <Button
              size="sm"
              variant={activeChart === 'accuracy' ? 'default' : 'outline'}
              onClick={() => setActiveChart('accuracy')}
            >
              Accuracy
            </Button>
            <Button size="sm" variant="outline" onClick={() => setData(generateTrainingData(50))}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Current Metrics */}
        <div className="flex gap-4 mb-4">
          {activeChart === 'loss' ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-sm text-muted-foreground">Train:</span>
                <Badge variant="outline" className="font-mono">
                  {latestData?.trainLoss.toFixed(4)}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500" />
                <span className="text-sm text-muted-foreground">Val:</span>
                <Badge variant="outline" className="font-mono">
                  {latestData?.valLoss.toFixed(4)}
                </Badge>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-sm text-muted-foreground">Train:</span>
                <Badge variant="outline" className="font-mono text-green-400">
                  {((latestData?.trainAcc || 0) * 100).toFixed(1)}%
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500" />
                <span className="text-sm text-muted-foreground">Val:</span>
                <Badge variant="outline" className="font-mono text-green-400">
                  {((latestData?.valAcc || 0) * 100).toFixed(1)}%
                </Badge>
              </div>
            </>
          )}
        </div>

        {/* Chart */}
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis
                dataKey="epoch"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                label={{ value: 'Epoch', position: 'insideBottom', offset: -5 }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                domain={activeChart === 'loss' ? [0, 'auto'] : [0, 1]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              {activeChart === 'loss' ? (
                <>
                  <Line
                    type="monotone"
                    dataKey="trainLoss"
                    name="Training Loss"
                    stroke="hsl(280, 100%, 70%)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="valLoss"
                    name="Validation Loss"
                    stroke="hsl(190, 100%, 60%)"
                    strokeWidth={2}
                    dot={false}
                  />
                </>
              ) : (
                <>
                  <Line
                    type="monotone"
                    dataKey="trainAcc"
                    name="Training Accuracy"
                    stroke="hsl(280, 100%, 70%)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="valAcc"
                    name="Validation Accuracy"
                    stroke="hsl(190, 100%, 60%)"
                    strokeWidth={2}
                    dot={false}
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingChart;
