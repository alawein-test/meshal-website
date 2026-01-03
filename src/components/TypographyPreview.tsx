import { motion } from 'framer-motion';
import { Type, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface FontSample {
  name: string;
  family: string;
  variable: string;
  sample: string;
  weights: number[];
}

interface TypeScale {
  name: string;
  class: string;
  size: string;
  lineHeight: string;
  usage: string;
}

const fonts: FontSample[] = [
  {
    name: 'Inter',
    family: 'Inter, system-ui, sans-serif',
    variable: 'font-sans',
    sample: 'The quick brown fox jumps over the lazy dog',
    weights: [400, 500, 600, 700],
  },
  {
    name: 'JetBrains Mono',
    family: 'JetBrains Mono, monospace',
    variable: 'font-mono',
    sample: 'const quantum = { state: "superposition" };',
    weights: [400, 500, 600, 700],
  },
];

const typeScale: TypeScale[] = [
  {
    name: 'Display',
    class: 'text-4xl font-bold',
    size: '2.25rem',
    lineHeight: '2.5rem',
    usage: 'Hero headlines',
  },
  {
    name: 'Heading 1',
    class: 'text-3xl font-semibold',
    size: '1.875rem',
    lineHeight: '2.25rem',
    usage: 'Page titles',
  },
  {
    name: 'Heading 2',
    class: 'text-2xl font-semibold',
    size: '1.5rem',
    lineHeight: '2rem',
    usage: 'Section headers',
  },
  {
    name: 'Heading 3',
    class: 'text-xl font-medium',
    size: '1.25rem',
    lineHeight: '1.75rem',
    usage: 'Card titles',
  },
  {
    name: 'Heading 4',
    class: 'text-lg font-medium',
    size: '1.125rem',
    lineHeight: '1.75rem',
    usage: 'Subsections',
  },
  {
    name: 'Body Large',
    class: 'text-base',
    size: '1rem',
    lineHeight: '1.5rem',
    usage: 'Body copy, paragraphs',
  },
  {
    name: 'Body',
    class: 'text-sm',
    size: '0.875rem',
    lineHeight: '1.25rem',
    usage: 'UI text, labels',
  },
  {
    name: 'Caption',
    class: 'text-xs',
    size: '0.75rem',
    lineHeight: '1rem',
    usage: 'Metadata, timestamps',
  },
];

const semanticTokens = [
  { token: '--font-sans', value: 'Inter, system-ui, sans-serif', usage: 'Primary font for UI' },
  { token: '--font-mono', value: 'JetBrains Mono, monospace', usage: 'Code blocks, technical' },
  { token: 'tracking-tight', value: '-0.025em', usage: 'Headlines' },
  { token: 'tracking-normal', value: '0', usage: 'Body text' },
  { token: 'tracking-wide', value: '0.025em', usage: 'All caps, labels' },
  { token: 'leading-tight', value: '1.25', usage: 'Compact text' },
  { token: 'leading-normal', value: '1.5', usage: 'Body copy' },
  { token: 'leading-relaxed', value: '1.625', usage: 'Long-form content' },
];

export function TypographyPreview() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedItem(label);
    toast({
      title: 'Copied!',
      description: label,
    });
    setTimeout(() => setCopiedItem(null), 2000);
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Type className="w-5 h-5 text-primary" />
          Typography System
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="scale" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scale">Type Scale</TabsTrigger>
            <TabsTrigger value="fonts">Font Samples</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
          </TabsList>

          <TabsContent value="scale" className="space-y-3">
            {typeScale.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group flex items-center gap-4 p-3 rounded-lg border border-transparent hover:border-border hover:bg-muted/30 transition-all cursor-pointer"
                onClick={() => copyToClipboard(item.class, item.name)}
              >
                <div className="flex-1 min-w-0">
                  <p className={`${item.class} truncate`}>{item.name}</p>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="font-mono">{item.size}</span>
                  <span className="w-24 truncate">{item.usage}</span>
                  {copiedItem === item.name ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="fonts" className="space-y-6">
            {fonts.map((font) => (
              <div key={font.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{font.name}</h4>
                  <code className="text-xs bg-muted px-2 py-1 rounded">{font.variable}</code>
                </div>

                <div
                  className="p-4 rounded-lg bg-muted/30 border border-border/50"
                  style={{ fontFamily: font.family }}
                >
                  <p className="text-2xl mb-4">{font.sample}</p>
                  <div className="flex flex-wrap gap-4">
                    {font.weights.map((weight) => (
                      <div key={weight} className="text-center">
                        <p style={{ fontWeight: weight }} className="text-lg">
                          Aa
                        </p>
                        <span className="text-xs text-muted-foreground">{weight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Character set preview */}
                <div
                  className="text-sm text-muted-foreground grid grid-cols-2 gap-2"
                  style={{ fontFamily: font.family }}
                >
                  <div>
                    <span className="text-xs uppercase tracking-wide opacity-60">Uppercase</span>
                    <p>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wide opacity-60">Lowercase</span>
                    <p>abcdefghijklmnopqrstuvwxyz</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wide opacity-60">Numbers</span>
                    <p>0123456789</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wide opacity-60">Symbols</span>
                    <p>!@#$%^&*()+-=[]{}|;':",&lt;&gt;.?/</p>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="tokens" className="space-y-2">
            <p className="text-sm text-muted-foreground mb-4">
              Semantic typography tokens for consistent styling across the application.
            </p>

            <div className="space-y-2">
              {semanticTokens.map((token, index) => (
                <motion.div
                  key={token.token}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="group flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-border hover:bg-muted/20 transition-all cursor-pointer"
                  onClick={() => copyToClipboard(token.token, token.token)}
                >
                  <div className="flex items-center gap-3">
                    <code className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-mono">
                      {token.token}
                    </code>
                    <span className="text-sm text-muted-foreground hidden sm:inline">
                      {token.usage}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground hidden md:inline">
                      {token.value}
                    </span>
                    {copiedItem === token.token ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
