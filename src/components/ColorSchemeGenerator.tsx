import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Palette, Copy, Check, RefreshCw, Shuffle, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface ColorSwatch {
  name: string;
  hsl: string;
  hex: string;
  usage: string;
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function generatePalette(baseHue: number, saturation: number, lightness: number): ColorSwatch[] {
  return [
    {
      name: 'Primary',
      hsl: `hsl(${baseHue}, ${saturation}%, ${lightness}%)`,
      hex: hslToHex(baseHue, saturation, lightness),
      usage: 'Buttons, links, accents',
    },
    {
      name: 'Primary Foreground',
      hsl: `hsl(${baseHue}, ${saturation}%, ${lightness > 50 ? 10 : 98}%)`,
      hex: hslToHex(baseHue, saturation, lightness > 50 ? 10 : 98),
      usage: 'Text on primary',
    },
    {
      name: 'Secondary',
      hsl: `hsl(${(baseHue + 30) % 360}, ${Math.max(saturation - 20, 10)}%, ${lightness + 10}%)`,
      hex: hslToHex((baseHue + 30) % 360, Math.max(saturation - 20, 10), lightness + 10),
      usage: 'Secondary actions',
    },
    {
      name: 'Accent',
      hsl: `hsl(${(baseHue + 180) % 360}, ${saturation}%, ${lightness}%)`,
      hex: hslToHex((baseHue + 180) % 360, saturation, lightness),
      usage: 'Highlights, badges',
    },
    {
      name: 'Muted',
      hsl: `hsl(${baseHue}, ${Math.max(saturation - 40, 5)}%, ${lightness > 50 ? 96 : 15}%)`,
      hex: hslToHex(baseHue, Math.max(saturation - 40, 5), lightness > 50 ? 96 : 15),
      usage: 'Backgrounds, borders',
    },
    {
      name: 'Background',
      hsl: `hsl(${baseHue}, ${Math.max(saturation - 50, 5)}%, ${lightness > 50 ? 100 : 5}%)`,
      hex: hslToHex(baseHue, Math.max(saturation - 50, 5), lightness > 50 ? 100 : 5),
      usage: 'Page background',
    },
    {
      name: 'Foreground',
      hsl: `hsl(${baseHue}, ${Math.max(saturation - 45, 5)}%, ${lightness > 50 ? 5 : 98}%)`,
      hex: hslToHex(baseHue, Math.max(saturation - 45, 5), lightness > 50 ? 5 : 98),
      usage: 'Body text',
    },
    {
      name: 'Success',
      hsl: `hsl(142, 76%, 36%)`,
      hex: '#16a34a',
      usage: 'Success states',
    },
    {
      name: 'Warning',
      hsl: `hsl(38, 92%, 50%)`,
      hex: '#f59e0b',
      usage: 'Warning states',
    },
    {
      name: 'Destructive',
      hsl: `hsl(0, 84%, 60%)`,
      hex: '#ef4444',
      usage: 'Error states, delete',
    },
  ];
}

export function ColorSchemeGenerator() {
  const [baseHue, setBaseHue] = useState(262);
  const [saturation, setSaturation] = useState(83);
  const [lightness, setLightness] = useState(58);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const palette = useMemo(() => {
    const adjustedLightness = isDarkMode ? Math.min(lightness, 60) : Math.max(lightness, 40);
    return generatePalette(baseHue, saturation, adjustedLightness);
  }, [baseHue, saturation, lightness, isDarkMode]);

  const randomize = () => {
    setBaseHue(Math.floor(Math.random() * 360));
    setSaturation(50 + Math.floor(Math.random() * 40));
    setLightness(40 + Math.floor(Math.random() * 30));
  };

  const copyColor = async (color: ColorSwatch, index: number) => {
    await navigator.clipboard.writeText(color.hex);
    setCopiedIndex(index);
    toast({
      title: 'Copied!',
      description: `${color.name}: ${color.hex}`,
    });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const exportCSS = () => {
    const css = `:root {\n${palette
      .map((c) => `  --${c.name.toLowerCase().replace(' ', '-')}: ${c.hsl};`)
      .join('\n')}\n}`;
    navigator.clipboard.writeText(css);
    toast({
      title: 'CSS Variables Copied!',
      description: 'Paste into your index.css file',
    });
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Palette className="w-5 h-5 text-primary" />
          Color Scheme Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label className="text-sm">Base Hue: {baseHue}°</Label>
            <div
              className="h-3 rounded-full"
              style={{
                background:
                  'linear-gradient(to right, hsl(0,80%,50%), hsl(60,80%,50%), hsl(120,80%,50%), hsl(180,80%,50%), hsl(240,80%,50%), hsl(300,80%,50%), hsl(360,80%,50%))',
              }}
            />
            <Slider
              value={[baseHue]}
              onValueChange={([v]) => setBaseHue(v)}
              max={360}
              step={1}
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Saturation: {saturation}%</Label>
              <Slider
                value={[saturation]}
                onValueChange={([v]) => setSaturation(v)}
                max={100}
                step={1}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Lightness: {lightness}%</Label>
              <Slider
                value={[lightness]}
                onValueChange={([v]) => setLightness(v)}
                max={100}
                step={1}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={randomize} className="gap-1.5">
              <Shuffle className="w-4 h-4" />
              Random
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="gap-1.5"
            >
              {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              {isDarkMode ? 'Dark' : 'Light'}
            </Button>
            <Button size="sm" onClick={exportCSS} className="gap-1.5 ml-auto">
              <Copy className="w-4 h-4" />
              Export CSS
            </Button>
          </div>
        </div>

        {/* Color Palette */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {palette.slice(0, 5).map((color, index) => (
            <motion.button
              key={color.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => copyColor(color, index)}
              className="group relative"
            >
              <div
                className="h-16 rounded-lg shadow-sm border border-border/50 transition-all group-hover:shadow-md"
                style={{ backgroundColor: color.hsl }}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {copiedIndex === index ? (
                  <Check className="w-5 h-5 text-white drop-shadow-lg" />
                ) : (
                  <Copy className="w-4 h-4 text-white drop-shadow-lg" />
                )}
              </div>
              <p className="text-xs mt-1 text-center truncate text-muted-foreground">
                {color.name}
              </p>
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {palette.slice(5).map((color, index) => (
            <motion.button
              key={color.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => copyColor(color, index + 5)}
              className="group relative"
            >
              <div
                className="h-16 rounded-lg shadow-sm border border-border/50 transition-all group-hover:shadow-md"
                style={{ backgroundColor: color.hsl }}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {copiedIndex === index + 5 ? (
                  <Check className="w-5 h-5 text-white drop-shadow-lg" />
                ) : (
                  <Copy className="w-4 h-4 text-white drop-shadow-lg" />
                )}
              </div>
              <p className="text-xs mt-1 text-center truncate text-muted-foreground">
                {color.name}
              </p>
            </motion.button>
          ))}
        </div>

        {/* Live Preview */}
        <div
          className="rounded-lg p-4 border"
          style={{
            backgroundColor: palette[5].hsl,
            borderColor: palette[4].hsl,
          }}
        >
          <h4 className="font-semibold mb-2" style={{ color: palette[6].hsl }}>
            Live Preview
          </h4>
          <p className="text-sm mb-3" style={{ color: palette[6].hsl, opacity: 0.8 }}>
            See how your colors work together in a real interface.
          </p>
          <div className="flex gap-2 flex-wrap">
            <button
              className="px-3 py-1.5 rounded text-sm font-medium transition-opacity hover:opacity-90"
              style={{ backgroundColor: palette[0].hsl, color: palette[1].hsl }}
            >
              Primary Button
            </button>
            <button
              className="px-3 py-1.5 rounded text-sm font-medium border transition-opacity hover:opacity-90"
              style={{
                backgroundColor: palette[2].hsl,
                color: palette[6].hsl,
                borderColor: palette[4].hsl,
              }}
            >
              Secondary
            </button>
            <span
              className="px-2 py-1 rounded text-xs font-medium"
              style={{ backgroundColor: palette[3].hsl, color: palette[1].hsl }}
            >
              Accent Badge
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
