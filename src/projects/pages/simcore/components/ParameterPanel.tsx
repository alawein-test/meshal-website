import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Layers,
  Thermometer,
  Wind,
  Droplets,
  Atom,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
} from 'lucide-react';

interface Parameter {
  id: string;
  name: string;
  value: string;
  unit: string;
  description: string;
}

const defaultPhysicsParams: Parameter[] = [
  {
    id: '1',
    name: 'Temperature',
    value: '300',
    unit: 'K',
    description: 'Initial system temperature',
  },
  { id: '2', name: 'Pressure', value: '101.325', unit: 'kPa', description: 'Ambient pressure' },
  { id: '3', name: 'Density', value: '1.225', unit: 'kg/m³', description: 'Fluid density' },
  { id: '4', name: 'Viscosity', value: '1.81e-5', unit: 'Pa·s', description: 'Dynamic viscosity' },
];

const defaultBoundaryParams: Parameter[] = [
  { id: '1', name: 'Inlet Velocity', value: '10', unit: 'm/s', description: 'Velocity at inlet' },
  {
    id: '2',
    name: 'Outlet Pressure',
    value: '0',
    unit: 'Pa',
    description: 'Gauge pressure at outlet',
  },
  {
    id: '3',
    name: 'Wall Temperature',
    value: '350',
    unit: 'K',
    description: 'Fixed wall temperature',
  },
];

const defaultMaterialParams: Parameter[] = [
  {
    id: '1',
    name: 'Thermal Conductivity',
    value: '0.6',
    unit: 'W/m·K',
    description: 'Heat conduction coefficient',
  },
  {
    id: '2',
    name: 'Specific Heat',
    value: '4186',
    unit: 'J/kg·K',
    description: 'Specific heat capacity',
  },
  { id: '3', name: 'Molar Mass', value: '18.015', unit: 'g/mol', description: 'Molecular weight' },
];

const ParameterPanel = () => {
  const [physicsParams, setPhysicsParams] = useState(defaultPhysicsParams);
  const [boundaryParams, setBoundaryParams] = useState(defaultBoundaryParams);
  const [materialParams, setMaterialParams] = useState(defaultMaterialParams);
  const [expandedParam, setExpandedParam] = useState<string | null>(null);

  const updateParam = (
    params: Parameter[],
    setParams: React.Dispatch<React.SetStateAction<Parameter[]>>,
    id: string,
    value: string
  ) => {
    setParams(params.map((p) => (p.id === id ? { ...p, value } : p)));
  };

  const renderParams = (
    params: Parameter[],
    setParams: React.Dispatch<React.SetStateAction<Parameter[]>>
  ) => (
    <div className="space-y-2">
      {params.map((param) => (
        <motion.div
          key={param.id}
          layout
          className="p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-all"
        >
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setExpandedParam(expandedParam === param.id ? null : param.id)}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{param.name}</span>
              <Badge variant="outline" className="text-xs font-mono">
                {param.unit}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-primary">{param.value}</span>
              {expandedParam === param.id ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>

          <AnimatePresence>
            {expandedParam === param.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-3 mt-3 border-t border-border/50 space-y-3">
                  <p className="text-xs text-muted-foreground">{param.description}</p>
                  <div className="flex gap-2">
                    <Input
                      value={param.value}
                      onChange={(e) => updateParam(params, setParams, param.id, e.target.value)}
                      className="font-mono text-sm"
                    />
                    <Button size="sm" variant="outline">
                      Apply
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          Parameter Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="physics" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="physics" className="text-xs">
              <Thermometer className="h-3 w-3 mr-1" />
              Physics
            </TabsTrigger>
            <TabsTrigger value="boundary" className="text-xs">
              <Wind className="h-3 w-3 mr-1" />
              Boundary
            </TabsTrigger>
            <TabsTrigger value="material" className="text-xs">
              <Atom className="h-3 w-3 mr-1" />
              Material
            </TabsTrigger>
          </TabsList>

          <TabsContent value="physics" className="mt-0">
            {renderParams(physicsParams, setPhysicsParams)}
          </TabsContent>

          <TabsContent value="boundary" className="mt-0">
            {renderParams(boundaryParams, setBoundaryParams)}
          </TabsContent>

          <TabsContent value="material" className="mt-0">
            {renderParams(materialParams, setMaterialParams)}
          </TabsContent>
        </Tabs>

        <Button variant="outline" className="w-full mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Parameter
        </Button>
      </CardContent>
    </Card>
  );
};

export default ParameterPanel;
