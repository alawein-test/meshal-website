import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface WaveFunctionDisplayProps {
  systemType?: 'harmonic' | 'infinite-well' | 'hydrogen';
  quantumNumber?: number;
}

const WaveFunctionDisplay = ({
  systemType = 'harmonic',
  quantumNumber = 1,
}: WaveFunctionDisplayProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [energy, setEnergy] = useState([quantumNumber]);
  const [time, setTime] = useState(0);

  const waveData = useMemo(() => {
    const points = 200;
    const n = energy[0];

    return Array.from({ length: points }, (_, i) => {
      const x = (i / points) * 2 * Math.PI - Math.PI;
      let y = 0;

      if (systemType === 'harmonic') {
        // Hermite polynomial approximation
        y = Math.exp((-x * x) / 2) * Math.cos(n * x);
      } else if (systemType === 'infinite-well') {
        // Particle in a box
        y = Math.sin((n * (x + Math.PI)) / 2);
      } else if (systemType === 'hydrogen') {
        // Simplified radial function
        const r = Math.abs(x);
        y = Math.exp(-r / n) * Math.pow(r, n - 1);
      }

      return { x: i, y: y * 40 + 60 };
    });
  }, [energy, systemType]);

  const probabilityData = useMemo(() => {
    return waveData.map((point) => ({
      x: point.x,
      y: Math.pow((point.y - 60) / 40, 2) * 40 + 60,
    }));
  }, [waveData]);

  const pathD = waveData.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const probPathD = probabilityData.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="bg-slate-900/50 rounded-xl border border-cyan-500/20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-cyan-500/20">
        <div>
          <h4 className="text-sm font-medium text-white">Wave Function |Ψ(x)⟩</h4>
          <p className="text-xs text-cyan-400/70 font-mono">
            {systemType === 'harmonic' && 'Quantum Harmonic Oscillator'}
            {systemType === 'infinite-well' && 'Particle in Infinite Well'}
            {systemType === 'hydrogen' && 'Hydrogen-like Radial Function'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-cyan-400 hover:bg-cyan-500/20"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-cyan-400 hover:bg-cyan-500/20"
            onClick={() => setEnergy([1])}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Visualization */}
      <div className="relative h-40 p-2">
        <svg className="w-full h-full" viewBox="0 0 200 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="probGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#84cc16" />
            </linearGradient>
          </defs>

          {/* Center line */}
          <line x1="0" y1="60" x2="200" y2="60" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

          {/* Probability density */}
          <motion.path
            d={probPathD}
            fill="none"
            stroke="url(#probGrad)"
            strokeWidth="1.5"
            opacity="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />

          {/* Wave function */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="url(#waveGrad)"
            strokeWidth="2"
            className="drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5 }}
          />
        </svg>

        {/* Legend */}
        <div className="absolute bottom-2 right-2 flex items-center gap-3 text-[10px]">
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-gradient-to-r from-cyan-500 to-pink-500" />
            <span className="text-slate-400">Ψ(x)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-gradient-to-r from-green-500 to-lime-500 opacity-50" />
            <span className="text-slate-400">|Ψ|²</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-3 border-t border-cyan-500/20 bg-slate-800/30">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Quantum Number (n)</span>
              <span className="text-xs font-mono text-cyan-400">{energy[0]}</span>
            </div>
            <Slider
              value={energy}
              onValueChange={setEnergy}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">Energy</div>
            <div className="text-sm font-mono text-cyan-400">E = {energy[0]}ℏω</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaveFunctionDisplay;
