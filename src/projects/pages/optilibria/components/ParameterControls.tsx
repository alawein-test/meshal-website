import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Settings, Dna, Thermometer, Zap } from 'lucide-react';

interface ParameterControlsProps {
  algorithm: string;
  onParametersChange?: (params: Record<string, number>) => void;
}

const algorithmParams: Record<
  string,
  { id: string; label: string; min: number; max: number; step: number; default: number }[]
> = {
  genetic: [
    { id: 'populationSize', label: 'Population Size', min: 10, max: 500, step: 10, default: 100 },
    { id: 'mutationRate', label: 'Mutation Rate', min: 0.01, max: 0.5, step: 0.01, default: 0.1 },
    { id: 'crossoverRate', label: 'Crossover Rate', min: 0.1, max: 1.0, step: 0.05, default: 0.8 },
    { id: 'elitismRate', label: 'Elitism Rate', min: 0, max: 0.3, step: 0.01, default: 0.05 },
  ],
  pso: [
    { id: 'swarmSize', label: 'Swarm Size', min: 10, max: 200, step: 5, default: 50 },
    { id: 'inertia', label: 'Inertia Weight', min: 0.1, max: 1.0, step: 0.05, default: 0.7 },
    { id: 'cognitive', label: 'Cognitive Factor', min: 0.5, max: 3.0, step: 0.1, default: 1.5 },
    { id: 'social', label: 'Social Factor', min: 0.5, max: 3.0, step: 0.1, default: 1.5 },
  ],
  annealing: [
    {
      id: 'initialTemp',
      label: 'Initial Temperature',
      min: 100,
      max: 10000,
      step: 100,
      default: 1000,
    },
    { id: 'coolingRate', label: 'Cooling Rate', min: 0.9, max: 0.999, step: 0.001, default: 0.95 },
    {
      id: 'minTemp',
      label: 'Minimum Temperature',
      min: 0.001,
      max: 10,
      step: 0.001,
      default: 0.01,
    },
    {
      id: 'iterationsPerTemp',
      label: 'Iterations/Temp',
      min: 10,
      max: 500,
      step: 10,
      default: 100,
    },
  ],
  gradient: [
    {
      id: 'learningRate',
      label: 'Learning Rate',
      min: 0.0001,
      max: 1.0,
      step: 0.0001,
      default: 0.01,
    },
    { id: 'momentum', label: 'Momentum', min: 0, max: 0.99, step: 0.01, default: 0.9 },
    { id: 'batchSize', label: 'Batch Size', min: 1, max: 256, step: 1, default: 32 },
    { id: 'epsilon', label: 'Epsilon', min: 1e-8, max: 1e-4, step: 1e-8, default: 1e-7 },
  ],
};

const algorithmIcons: Record<string, React.ReactNode> = {
  genetic: <Dna className="h-5 w-5 text-green-400" />,
  pso: <Zap className="h-5 w-5 text-blue-400" />,
  annealing: <Thermometer className="h-5 w-5 text-orange-400" />,
  gradient: <Settings className="h-5 w-5 text-purple-400" />,
};

const ParameterControls = ({ algorithm, onParametersChange }: ParameterControlsProps) => {
  const params = algorithmParams[algorithm] || algorithmParams.genetic;

  const initialValues = useMemo(() => {
    const values: Record<string, number> = {};
    params.forEach((p) => {
      values[p.id] = p.default;
    });
    return values;
  }, [params]);

  const [values, setValues] = useState<Record<string, number>>(initialValues);

  useEffect(() => {
    setValues(initialValues);
  }, [algorithm, initialValues]);

  const handleChange = (id: string, value: number[]) => {
    const newValues = { ...values, [id]: value[0] };
    setValues(newValues);
    onParametersChange?.(newValues);
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {algorithmIcons[algorithm] || <Settings className="h-5 w-5" />}
          Algorithm Parameters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {params.map((param, i) => (
          <motion.div
            key={param.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <label className="text-sm text-muted-foreground">{param.label}</label>
              <span className="text-sm font-mono text-primary">
                {values[param.id]?.toFixed(param.step < 0.01 ? 4 : param.step < 1 ? 2 : 0)}
              </span>
            </div>
            <Slider
              value={[values[param.id] || param.default]}
              min={param.min}
              max={param.max}
              step={param.step}
              onValueChange={(val) => handleChange(param.id, val)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{param.min}</span>
              <span>{param.max}</span>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ParameterControls;
