import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Copy, Check, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { NINJA_PATTERN, NINJA_PATTERN_WINK, getNinjaSvgString } from '@/components/icons/NinjaIcon';
import { downloadNinjaIcon, IconSize } from '@/components/icons/ninja-assets';
import { CyberpunkLayout, SEO } from '@/components/shared';

// Expression variants with custom patterns
const EXPRESSIONS = [
  { id: 'default', name: 'Default Ninja', emoji: '🥷', pattern: NINJA_PATTERN },
  { id: 'wink', name: 'Winking Ninja', emoji: '😉', pattern: NINJA_PATTERN_WINK },
  { id: 'happy', name: 'Happy Ninja', emoji: '😊', pattern: NINJA_PATTERN },
  { id: 'thinking', name: 'Thinking Ninja', emoji: '🤔', pattern: NINJA_PATTERN },
  { id: 'coding', name: 'Coding Ninja', emoji: '💻', pattern: NINJA_PATTERN },
  { id: 'celebrating', name: 'Celebrating Ninja', emoji: '🎉', pattern: NINJA_PATTERN },
  { id: 'sleepy', name: 'Sleepy Ninja', emoji: '😴', pattern: NINJA_PATTERN },
  { id: 'strong', name: 'Strong Ninja', emoji: '💪', pattern: NINJA_PATTERN },
] as const;

const SIZES: IconSize[] = [64, 128, 256, 512];

const StickerCard = ({
  expression,
  size,
}: {
  expression: (typeof EXPRESSIONS)[number];
  size: IconSize;
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const cellSize = size / 10;

  const getColor = (value: number): string => {
    switch (value) {
      case 0:
        return 'transparent';
      case 1:
        return 'hsl(var(--jules-cyan))';
      case 2:
        return 'hsl(var(--jules-magenta))';
      case 3:
        return 'hsl(var(--jules-magenta))';
      default:
        return 'transparent';
    }
  };

  const handleDownloadSvg = () => {
    downloadNinjaIcon(size, 'svg');
    toast({
      title: 'Downloaded!',
      description: `${expression.name} SVG saved`,
    });
  };

  const handleDownloadPng = async () => {
    await downloadNinjaIcon(size, 'png');
    toast({
      title: 'Downloaded!',
      description: `${expression.name} PNG saved`,
    });
  };

  const handleCopySvg = () => {
    const svg = getNinjaSvgString(size);
    navigator.clipboard.writeText(svg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Copied!',
      description: 'SVG copied to clipboard',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-jules-surface/30 backdrop-blur-xl border-jules-border/50 overflow-hidden group hover:border-jules-cyan/30 transition-all">
        <CardContent className="p-6">
          {/* Sticker Preview */}
          <div className="relative flex items-center justify-center p-8 mb-4 rounded-lg bg-jules-dark/50">
            <motion.div
              className="relative"
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            >
              {/* Glow effect */}
              <div
                className="absolute inset-0 blur-xl opacity-50"
                style={{
                  background:
                    'radial-gradient(circle, hsl(var(--jules-cyan) / 0.5) 0%, transparent 70%)',
                }}
              />

              <svg
                width={Math.min(size, 128)}
                height={Math.min(size, 128)}
                viewBox={`0 0 ${size} ${size}`}
                className="relative z-10"
              >
                {expression.pattern.map((row, y) =>
                  row.map((cell, x) =>
                    cell !== 0 ? (
                      <rect
                        key={`${x}-${y}`}
                        x={x * cellSize}
                        y={y * cellSize}
                        width={cellSize}
                        height={cellSize}
                        fill={getColor(cell)}
                      />
                    ) : null
                  )
                )}
              </svg>
            </motion.div>
          </div>

          {/* Sticker Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground flex items-center gap-2 font-mono">
                <span>{expression.emoji}</span>
                <span>{expression.name}</span>
              </h3>
              <Badge
                variant="outline"
                className="text-xs font-mono border-jules-cyan/30 text-jules-cyan"
              >
                {size}×{size}
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownloadSvg}
                className="flex-1 border-jules-cyan/30 text-jules-cyan hover:bg-jules-cyan/10"
              >
                <Download className="w-3 h-3 mr-1" />
                SVG
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownloadPng}
                className="flex-1 border-jules-magenta/30 text-jules-magenta hover:bg-jules-magenta/10"
              >
                <Download className="w-3 h-3 mr-1" />
                PNG
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopySvg}
                className="text-muted-foreground hover:text-jules-green"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-jules-green" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const StickerPack = () => {
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState<IconSize>(128);

  const handleDownloadAll = async () => {
    for (const expr of EXPRESSIONS) {
      await downloadNinjaIcon(selectedSize, 'png');
    }
    toast({
      title: 'Pack Downloaded!',
      description: `All ${EXPRESSIONS.length} stickers saved`,
    });
  };

  return (
    <CyberpunkLayout>
      <SEO
        title="Sticker Pack | Meshal Alawein"
        description="Download ninja sticker expressions for your projects"
      />

      <main className="container mx-auto px-6 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-12"
        >
          <div>
            <h1
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{
                background:
                  'linear-gradient(135deg, hsl(var(--jules-cyan)) 0%, hsl(var(--jules-magenta)) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 40px hsl(var(--jules-cyan) / 0.3)',
              }}
            >
              Ninja Sticker Pack
            </h1>
            <p className="text-muted-foreground font-mono">
              <span className="text-jules-green">// </span>
              Download Jules ninja expressions for your projects
            </p>
          </div>
          <Button
            onClick={handleDownloadAll}
            className="gap-2 bg-jules-cyan/20 text-jules-cyan border border-jules-cyan/30 hover:bg-jules-cyan/30"
            style={{ boxShadow: '0 0 20px hsl(var(--jules-cyan) / 0.2)' }}
          >
            <Package className="w-4 h-4" />
            Download All ({EXPRESSIONS.length})
          </Button>
        </motion.div>

        {/* Size Selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4 mb-8"
        >
          <span className="text-sm font-medium text-muted-foreground font-mono">Size:</span>
          <div className="flex gap-2">
            {SIZES.map((size) => (
              <Button
                key={size}
                size="sm"
                variant={selectedSize === size ? 'default' : 'outline'}
                onClick={() => setSelectedSize(size)}
                className={
                  selectedSize === size
                    ? 'bg-jules-cyan/20 text-jules-cyan border-jules-cyan/50'
                    : 'border-jules-border text-muted-foreground hover:border-jules-cyan/30 hover:text-jules-cyan'
                }
              >
                {size}px
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Sticker Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {EXPRESSIONS.map((expression, index) => (
            <motion.div
              key={expression.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <StickerCard expression={expression} size={selectedSize} />
            </motion.div>
          ))}
        </div>

        {/* Usage Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 rounded-xl border border-jules-purple/30 bg-jules-surface/30 backdrop-blur-xl"
          style={{ boxShadow: '0 0 25px hsl(var(--jules-purple) / 0.15)' }}
        >
          <h2 className="text-lg font-semibold mb-3 text-jules-purple font-mono">
            {'// Usage Guidelines'}
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground font-mono">
            <li>
              <span className="text-jules-cyan">→</span> SVG format is recommended for web use
              (infinitely scalable)
            </li>
            <li>
              <span className="text-jules-magenta">→</span> PNG format is best for messaging apps
              and social media
            </li>
            <li>
              <span className="text-jules-yellow">→</span> All stickers use the Jules color palette
              (cyan + magenta)
            </li>
            <li>
              <span className="text-jules-green">→</span> Free for personal and commercial use with
              attribution
            </li>
          </ul>
        </motion.div>
      </main>
    </CyberpunkLayout>
  );
};

export default StickerPack;
