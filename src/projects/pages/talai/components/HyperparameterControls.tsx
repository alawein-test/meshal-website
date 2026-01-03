import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings2, Zap, Layers, RotateCcw, Play, Save } from 'lucide-react';
import { toast } from 'sonner';

interface Hyperparameters {
  learningRate: number;
  batchSize: number;
  epochs: number;
  optimizer: string;
  dropout: number;
  weightDecay: number;
  scheduler: string;
  warmupSteps: number;
  gradientClipping: boolean;
  mixedPrecision: boolean;
}

const HyperparameterControls = () => {
  const [params, setParams] = useState<Hyperparameters>({
    learningRate: 0.001,
    batchSize: 32,
    epochs: 100,
    optimizer: 'adamw',
    dropout: 0.1,
    weightDecay: 0.01,
    scheduler: 'cosine',
    warmupSteps: 500,
    gradientClipping: true,
    mixedPrecision: true,
  });

  const handleStartTraining = () => {
    toast.success('Training started', {
      description: `LR: ${params.learningRate}, Batch: ${params.batchSize}, Epochs: ${params.epochs}`,
    });
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-purple-400" />
            Hyperparameters
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => toast.info('Reset to defaults')}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => toast.success('Config saved')}>
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="training" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="training">
              <Zap className="h-3 w-3 mr-1" />
              Training
            </TabsTrigger>
            <TabsTrigger value="model">
              <Layers className="h-3 w-3 mr-1" />
              Model
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <Settings2 className="h-3 w-3 mr-1" />
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="training" className="space-y-4">
            {/* Learning Rate */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-sm text-muted-foreground">Learning Rate</Label>
                <span className="text-sm font-mono text-purple-400">
                  {params.learningRate.toExponential(2)}
                </span>
              </div>
              <Slider
                value={[Math.log10(params.learningRate) + 5]}
                min={0}
                max={4}
                step={0.1}
                onValueChange={([v]) =>
                  setParams((p) => ({ ...p, learningRate: Math.pow(10, v - 5) }))
                }
              />
            </div>

            {/* Batch Size */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-sm text-muted-foreground">Batch Size</Label>
                <span className="text-sm font-mono text-purple-400">{params.batchSize}</span>
              </div>
              <Slider
                value={[Math.log2(params.batchSize)]}
                min={3}
                max={9}
                step={1}
                onValueChange={([v]) => setParams((p) => ({ ...p, batchSize: Math.pow(2, v) }))}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>8</span>
                <span>512</span>
              </div>
            </div>

            {/* Epochs */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-sm text-muted-foreground">Epochs</Label>
                <span className="text-sm font-mono text-purple-400">{params.epochs}</span>
              </div>
              <Slider
                value={[params.epochs]}
                min={10}
                max={500}
                step={10}
                onValueChange={([v]) => setParams((p) => ({ ...p, epochs: v }))}
              />
            </div>

            {/* Optimizer */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Optimizer</Label>
              <Select
                value={params.optimizer}
                onValueChange={(v) => setParams((p) => ({ ...p, optimizer: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sgd">SGD</SelectItem>
                  <SelectItem value="adam">Adam</SelectItem>
                  <SelectItem value="adamw">AdamW</SelectItem>
                  <SelectItem value="rmsprop">RMSprop</SelectItem>
                  <SelectItem value="adagrad">Adagrad</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="model" className="space-y-4">
            {/* Dropout */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-sm text-muted-foreground">Dropout</Label>
                <span className="text-sm font-mono text-cyan-400">{params.dropout.toFixed(2)}</span>
              </div>
              <Slider
                value={[params.dropout * 100]}
                min={0}
                max={50}
                step={5}
                onValueChange={([v]) => setParams((p) => ({ ...p, dropout: v / 100 }))}
              />
            </div>

            {/* Weight Decay */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-sm text-muted-foreground">Weight Decay</Label>
                <span className="text-sm font-mono text-cyan-400">
                  {params.weightDecay.toExponential(2)}
                </span>
              </div>
              <Slider
                value={[Math.log10(params.weightDecay) + 4]}
                min={0}
                max={4}
                step={0.5}
                onValueChange={([v]) =>
                  setParams((p) => ({ ...p, weightDecay: Math.pow(10, v - 4) }))
                }
              />
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            {/* LR Scheduler */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">LR Scheduler</Label>
              <Select
                value={params.scheduler}
                onValueChange={(v) => setParams((p) => ({ ...p, scheduler: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="step">Step LR</SelectItem>
                  <SelectItem value="cosine">Cosine Annealing</SelectItem>
                  <SelectItem value="exponential">Exponential</SelectItem>
                  <SelectItem value="plateau">Reduce on Plateau</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Warmup Steps */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-sm text-muted-foreground">Warmup Steps</Label>
                <span className="text-sm font-mono text-green-400">{params.warmupSteps}</span>
              </div>
              <Slider
                value={[params.warmupSteps]}
                min={0}
                max={2000}
                step={100}
                onValueChange={([v]) => setParams((p) => ({ ...p, warmupSteps: v }))}
              />
            </div>

            {/* Toggles */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <Label className="text-sm">Gradient Clipping</Label>
                <Switch
                  checked={params.gradientClipping}
                  onCheckedChange={(v) => setParams((p) => ({ ...p, gradientClipping: v }))}
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <Label className="text-sm">Mixed Precision (FP16)</Label>
                <Switch
                  checked={params.mixedPrecision}
                  onCheckedChange={(v) => setParams((p) => ({ ...p, mixedPrecision: v }))}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Button className="w-full mt-4" onClick={handleStartTraining}>
          <Play className="h-4 w-4 mr-2" />
          Start Training
        </Button>
      </CardContent>
    </Card>
  );
};

export default HyperparameterControls;
