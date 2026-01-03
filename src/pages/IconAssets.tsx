import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Copy, Check } from 'lucide-react';
import { NinjaIcon, AnimatedNinja, downloadNinjaIcon, getNinjaSvgString } from '@/components/icons';
import type { IconSize } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { CyberpunkLayout, SEO } from '@/components/shared';

const SIZES: IconSize[] = [16, 32, 48, 64, 128, 256];
const ANIMATIONS = ['idle', 'wave', 'bounce', 'pulse', 'none'] as const;

const IconAssets: React.FC = () => {
  const [copiedSize, setCopiedSize] = useState<number | null>(null);
  const { toast } = useToast();

  const handleDownload = async (size: IconSize, format: 'svg' | 'png') => {
    try {
      await downloadNinjaIcon(size, format);
      toast({
        title: 'Download started',
        description: `${format.toUpperCase()} icon (${size}x${size}) downloading...`,
      });
    } catch (error) {
      toast({
        title: 'Download failed',
        description: 'Could not generate icon file.',
        variant: 'destructive',
      });
    }
  };

  const handleCopySvg = async (size: IconSize) => {
    try {
      const svg = getNinjaSvgString(size);
      await navigator.clipboard.writeText(svg);
      setCopiedSize(size);
      setTimeout(() => setCopiedSize(null), 2000);
      toast({
        title: 'Copied!',
        description: 'SVG code copied to clipboard.',
      });
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Could not copy to clipboard.',
        variant: 'destructive',
      });
    }
  };

  return (
    <CyberpunkLayout showNinja={false}>
      <SEO
        title="Icon Assets | Meshal Alawein"
        description="Download and preview ninja icon assets for branding"
      />

      <main className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1
              className="text-4xl font-bold mb-4"
              style={{
                background:
                  'linear-gradient(135deg, hsl(var(--jules-cyan)) 0%, hsl(var(--jules-magenta)) 50%, hsl(var(--jules-yellow)) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 40px hsl(var(--jules-cyan) / 0.3)',
              }}
            >
              Ninja Icon Assets
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto font-mono">
              <span className="text-jules-green">// </span>
              Download pixel-art ninja icons for use across platforms.
            </p>
          </motion.div>

          <Tabs defaultValue="static" className="space-y-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-jules-surface/50 border border-jules-border">
              <TabsTrigger
                value="static"
                className="data-[state=active]:bg-jules-cyan/20 data-[state=active]:text-jules-cyan"
              >
                Static Icons
              </TabsTrigger>
              <TabsTrigger
                value="animated"
                className="data-[state=active]:bg-jules-magenta/20 data-[state=active]:text-jules-magenta"
              >
                Animated Icons
              </TabsTrigger>
            </TabsList>

            <TabsContent value="static" className="space-y-8">
              {/* Size Preview Grid */}
              <Card className="border-jules-cyan/20 bg-jules-surface/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-jules-cyan font-mono">{'// Icon Sizes'}</CardTitle>
                  <CardDescription>Preview and download icons at standard sizes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {SIZES.map((size) => (
                      <motion.div
                        key={size}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: size / 500 }}
                        className="flex flex-col items-center gap-3 p-4 rounded-lg border border-jules-border/50 bg-jules-dark/50"
                      >
                        <div
                          className="flex items-center justify-center bg-jules-dark rounded-lg p-2"
                          style={{ minHeight: Math.max(size + 16, 48) }}
                        >
                          <NinjaIcon size={size} showGlow />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground font-mono">
                          {size}×{size}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs border-jules-cyan/30 text-jules-cyan hover:bg-jules-cyan/10"
                            onClick={() => handleDownload(size, 'svg')}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            SVG
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs border-jules-magenta/30 text-jules-magenta hover:bg-jules-magenta/10"
                            onClick={() => handleDownload(size, 'png')}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            PNG
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-xs w-full text-muted-foreground hover:text-jules-green"
                          onClick={() => handleCopySvg(size)}
                        >
                          {copiedSize === size ? (
                            <Check className="w-3 h-3 mr-1 text-jules-green" />
                          ) : (
                            <Copy className="w-3 h-3 mr-1" />
                          )}
                          Copy SVG
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Variant Preview */}
              <Card className="border-jules-magenta/20 bg-jules-surface/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-jules-magenta font-mono">
                    {'// Icon Variants'}
                  </CardTitle>
                  <CardDescription>Different expressions for the ninja icon</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap justify-center gap-8">
                    <div className="flex flex-col items-center gap-2">
                      <NinjaIcon size={64} variant="default" showGlow />
                      <span className="text-sm text-muted-foreground font-mono">Default</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <NinjaIcon size={64} variant="happy" showGlow />
                      <span className="text-sm text-muted-foreground font-mono">Happy</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <NinjaIcon size={64} variant="wink" showGlow />
                      <span className="text-sm text-muted-foreground font-mono">Wink</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Background Test */}
              <Card className="border-jules-purple/20 bg-jules-surface/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-jules-purple font-mono">
                    {'// Background Visibility Test'}
                  </CardTitle>
                  <CardDescription>Icons tested on various backgrounds</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center justify-center p-6 rounded-lg bg-black">
                      <NinjaIcon size={48} showGlow />
                    </div>
                    <div className="flex items-center justify-center p-6 rounded-lg bg-white">
                      <NinjaIcon size={48} showGlow />
                    </div>
                    <div className="flex items-center justify-center p-6 rounded-lg bg-gradient-to-br from-jules-purple to-jules-cyan">
                      <NinjaIcon size={48} showGlow />
                    </div>
                    <div className="flex items-center justify-center p-6 rounded-lg bg-gradient-to-br from-jules-dark to-jules-surface">
                      <NinjaIcon size={48} showGlow />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="animated" className="space-y-8">
              {/* Animation Types */}
              <Card className="border-jules-yellow/20 bg-jules-surface/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-jules-yellow font-mono">
                    {'// Animation Styles'}
                  </CardTitle>
                  <CardDescription>
                    Choose an animation style for interactive contexts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {ANIMATIONS.map((animation) => (
                      <div
                        key={animation}
                        className="flex flex-col items-center gap-3 p-4 rounded-lg border border-jules-border/50 bg-jules-dark/50"
                      >
                        <AnimatedNinja
                          size={64}
                          animation={animation}
                          enableBlink={animation !== 'none'}
                        />
                        <span className="text-sm font-medium capitalize text-muted-foreground font-mono">
                          {animation}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Interactive Demo */}
              <Card className="border-jules-green/20 bg-jules-surface/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-jules-green font-mono">
                    {'// Interactive Demo'}
                  </CardTitle>
                  <CardDescription>Click the ninja to see interaction animations</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-8">
                  <AnimatedNinja
                    size={128}
                    animation="idle"
                    enableBlink
                    onClick={() => {
                      toast({
                        title: '🥷 Ninja says hi!',
                        description: 'Thanks for clicking!',
                      });
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Usage Code */}
          <Card className="mt-8 border-jules-cyan/20 bg-jules-surface/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-jules-cyan font-mono">{'// Usage'}</CardTitle>
              <CardDescription>How to use the ninja icons in code</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-jules-dark/80 p-4 rounded-lg overflow-x-auto text-sm border border-jules-border/50">
                <code className="text-jules-green">{`import { NinjaIcon, AnimatedNinja } from '@/components/icons';

// Static icon
<NinjaIcon size="md" variant="default" showGlow />

// Animated icon
<AnimatedNinja
  size={64}
  animation="idle"
  enableBlink
  onClick={handleClick}
/>`}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </main>
    </CyberpunkLayout>
  );
};

export default IconAssets;
