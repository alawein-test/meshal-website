import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Settings, Play, Square, RotateCcw, Save, Beaker } from 'lucide-react';
import { toast } from 'sonner';

interface SimulationParams {
  timestep: number;
  iterations: number;
  convergence: number;
  parallelThreads: number;
  method: string;
  adaptiveMesh: boolean;
  outputFrequency: number;
}

const SimulationControls = () => {
  const [params, setParams] = useState<SimulationParams>({
    timestep: 0.001,
    iterations: 1000,
    convergence: 1e-6,
    parallelThreads: 8,
    method: 'runge-kutta',
    adaptiveMesh: true,
    outputFrequency: 100,
  });

  const [isRunning, setIsRunning] = useState(false);

  const handleStart = () => {
    setIsRunning(true);
    toast.success('Simulation started', {
      description: `Running with ${params.iterations} iterations`,
    });
  };

  const handleStop = () => {
    setIsRunning(false);
    toast.info('Simulation stopped');
  };

  const handleReset = () => {
    setParams({
      timestep: 0.001,
      iterations: 1000,
      convergence: 1e-6,
      parallelThreads: 8,
      method: 'runge-kutta',
      adaptiveMesh: true,
      outputFrequency: 100,
    });
    toast.info('Parameters reset to defaults');
  };

  const handleSave = () => {
    toast.success('Configuration saved');
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Simulation Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Control Buttons */}
        <div className="flex gap-2">
          {!isRunning ? (
            <Button onClick={handleStart} className="flex-1 bg-green-600 hover:bg-green-700">
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
          ) : (
            <Button onClick={handleStop} variant="destructive" className="flex-1">
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
          )}
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={handleSave}>
            <Save className="h-4 w-4" />
          </Button>
        </div>

        {/* Numerical Method */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Numerical Method</Label>
          <Select
            value={params.method}
            onValueChange={(value) => setParams((p) => ({ ...p, method: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="euler">Euler (1st order)</SelectItem>
              <SelectItem value="runge-kutta">Runge-Kutta (4th order)</SelectItem>
              <SelectItem value="adams-bashforth">Adams-Bashforth</SelectItem>
              <SelectItem value="crank-nicolson">Crank-Nicolson</SelectItem>
              <SelectItem value="leapfrog">Leapfrog</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Time Step */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label className="text-sm text-muted-foreground">Time Step (Δt)</Label>
            <span className="text-sm font-mono text-primary">
              {params.timestep.toExponential(3)}
            </span>
          </div>
          <Slider
            value={[Math.log10(params.timestep) + 5]}
            min={0}
            max={4}
            step={0.1}
            onValueChange={([v]) => setParams((p) => ({ ...p, timestep: Math.pow(10, v - 5) }))}
          />
        </div>

        {/* Iterations */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label className="text-sm text-muted-foreground">Max Iterations</Label>
            <span className="text-sm font-mono text-primary">
              {params.iterations.toLocaleString()}
            </span>
          </div>
          <Slider
            value={[params.iterations]}
            min={100}
            max={10000}
            step={100}
            onValueChange={([v]) => setParams((p) => ({ ...p, iterations: v }))}
          />
        </div>

        {/* Convergence Threshold */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label className="text-sm text-muted-foreground">Convergence Threshold</Label>
            <span className="text-sm font-mono text-primary">
              {params.convergence.toExponential(1)}
            </span>
          </div>
          <Slider
            value={[Math.log10(params.convergence) + 10]}
            min={0}
            max={6}
            step={1}
            onValueChange={([v]) => setParams((p) => ({ ...p, convergence: Math.pow(10, v - 10) }))}
          />
        </div>

        {/* Parallel Threads */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label className="text-sm text-muted-foreground">Parallel Threads</Label>
            <span className="text-sm font-mono text-primary">{params.parallelThreads}</span>
          </div>
          <Slider
            value={[params.parallelThreads]}
            min={1}
            max={32}
            step={1}
            onValueChange={([v]) => setParams((p) => ({ ...p, parallelThreads: v }))}
          />
        </div>

        {/* Output Frequency */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label className="text-sm text-muted-foreground">Output Frequency</Label>
            <span className="text-sm font-mono text-primary">
              Every {params.outputFrequency} steps
            </span>
          </div>
          <Slider
            value={[params.outputFrequency]}
            min={10}
            max={1000}
            step={10}
            onValueChange={([v]) => setParams((p) => ({ ...p, outputFrequency: v }))}
          />
        </div>

        {/* Adaptive Mesh Toggle */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
          <div className="flex items-center gap-2">
            <Beaker className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm">Adaptive Mesh Refinement</Label>
          </div>
          <Switch
            checked={params.adaptiveMesh}
            onCheckedChange={(checked) => setParams((p) => ({ ...p, adaptiveMesh: checked }))}
          />
        </div>

        {/* Status Indicator */}
        {isRunning && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-green-500/10 border border-green-500/30"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-green-400">Simulation running...</span>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default SimulationControls;
