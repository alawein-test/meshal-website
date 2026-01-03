// Component Documentation Page - Showcases all reusable UI components
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Palette,
  Layout,
  Type,
  MousePointer,
  Bell,
  Loader2,
  ChevronRight,
  Copy,
  Check,
  Zap,
  Box,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/hooks/use-toast';
import { PublicHeader } from '@/components/shared/PublicHeader';
import { NeonCard } from '@/components/ui/neon-card';
import { SkillBadge } from '@/components/ui/skill-badge';
import { SectionHeader } from '@/components/ui/section-header';
import { cn } from '@/lib/utils';

interface ComponentExample {
  name: string;
  description: string;
  category: string;
  preview: React.ReactNode;
  code: string;
}

const ComponentDocs = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string, name: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(name);
    toast({ title: 'Copied!', description: `${name} code copied to clipboard` });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const components: ComponentExample[] = [
    {
      name: 'Button',
      description: 'Primary action buttons with multiple variants',
      category: 'Actions',
      preview: (
        <div className="flex flex-wrap gap-3">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      ),
      code: `<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>`,
    },
    {
      name: 'Badge',
      description: 'Status indicators and labels',
      category: 'Display',
      preview: (
        <div className="flex flex-wrap gap-3">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      ),
      code: `<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>`,
    },
    {
      name: 'NeonCard',
      description: 'Cyberpunk-styled glowing cards',
      category: 'Layout',
      preview: (
        <div className="grid grid-cols-2 gap-4">
          <NeonCard color="cyan" glow className="p-4">
            <p className="text-sm font-mono">Cyan Glow</p>
          </NeonCard>
          <NeonCard color="magenta" glow className="p-4">
            <p className="text-sm font-mono">Magenta Glow</p>
          </NeonCard>
        </div>
      ),
      code: `<NeonCard color="cyan" glow className="p-4">
  <p>Cyan Glow</p>
</NeonCard>`,
    },
    {
      name: 'SkillBadge',
      description: 'Animated skill badges with color variants',
      category: 'Display',
      preview: (
        <div className="flex flex-wrap gap-3">
          <SkillBadge skill="React" color="cyan" />
          <SkillBadge skill="TypeScript" color="magenta" />
          <SkillBadge skill="Python" color="yellow" />
        </div>
      ),
      code: `<SkillBadge skill="React" color="cyan" />
<SkillBadge skill="TypeScript" color="magenta" />`,
    },
    {
      name: 'Progress',
      description: 'Progress bars for loading and completion states',
      category: 'Feedback',
      preview: (
        <div className="space-y-4 w-full">
          <Progress value={33} className="h-2" />
          <Progress value={66} className="h-3" />
          <Progress value={100} className="h-4" />
        </div>
      ),
      code: `<Progress value={66} className="h-2" />`,
    },
    {
      name: 'Input',
      description: 'Form input fields with various states',
      category: 'Forms',
      preview: (
        <div className="space-y-3 w-full max-w-sm">
          <Input placeholder="Default input" />
          <Input placeholder="Disabled" disabled />
        </div>
      ),
      code: `<Input placeholder="Enter text..." />`,
    },
    {
      name: 'Switch',
      description: 'Toggle switches for boolean settings',
      category: 'Forms',
      preview: (
        <div className="flex items-center gap-4">
          <Switch />
          <Switch defaultChecked />
        </div>
      ),
      code: `<Switch checked={value} onCheckedChange={setValue} />`,
    },
    {
      name: 'Slider',
      description: 'Range sliders for numeric inputs',
      category: 'Forms',
      preview: (
        <div className="w-full max-w-sm">
          <Slider defaultValue={[50]} max={100} step={1} />
        </div>
      ),
      code: `<Slider defaultValue={[50]} max={100} step={1} />`,
    },
    {
      name: 'Tabs',
      description: 'Tabbed navigation for content sections',
      category: 'Navigation',
      preview: (
        <Tabs defaultValue="tab1" className="w-full">
          <TabsList>
            <TabsTrigger value="tab1">Overview</TabsTrigger>
            <TabsTrigger value="tab2">Details</TabsTrigger>
            <TabsTrigger value="tab3">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" className="p-4 text-sm text-muted-foreground">
            Overview content goes here
          </TabsContent>
          <TabsContent value="tab2" className="p-4 text-sm text-muted-foreground">
            Details content goes here
          </TabsContent>
        </Tabs>
      ),
      code: `<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Overview</TabsTrigger>
    <TabsTrigger value="tab2">Details</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content</TabsContent>
</Tabs>`,
    },
    {
      name: 'Toast',
      description: 'Notification toasts for user feedback',
      category: 'Feedback',
      preview: (
        <div className="flex gap-3">
          <Button
            size="sm"
            onClick={() => toast({ title: 'Success!', description: 'Your action was completed.' })}
          >
            Show Toast
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() =>
              toast({
                title: 'Error',
                description: 'Something went wrong.',
                variant: 'destructive',
              })
            }
          >
            Error Toast
          </Button>
        </div>
      ),
      code: `toast({ title: 'Success!', description: 'Action completed.' })`,
    },
  ];

  const categories = [...new Set(components.map((c) => c.category))];

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <main className="pt-24 pb-16">
        <div className="container px-4 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-jules-cyan/10 border border-jules-cyan/20 mb-6">
              <Sparkles className="w-4 h-4 text-jules-cyan" />
              <span className="text-sm font-mono text-jules-cyan">Component Library</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold font-mono mb-4">
              <span className="text-jules-cyan">{'<'}</span>
              UI Components
              <span className="text-jules-magenta">{' />'}</span>
            </h1>

            <p className="text-muted-foreground max-w-2xl mx-auto">
              A collection of reusable, cyberpunk-styled React components built with Radix UI
              primitives and Tailwind CSS.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            {[
              { icon: Box, label: 'Components', value: components.length },
              { icon: Palette, label: 'Variants', value: '50+' },
              { icon: Zap, label: 'Accessible', value: '100%' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-4 rounded-xl bg-card/50 border border-border/50"
              >
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-jules-cyan" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Components by Category */}
          {categories.map((category) => (
            <motion.section
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-xl font-bold font-mono mb-6 flex items-center gap-2">
                <ChevronRight className="w-5 h-5 text-jules-magenta" />
                {category}
              </h2>

              <div className="grid gap-6">
                {components
                  .filter((c) => c.category === category)
                  .map((component) => (
                    <Card
                      key={component.name}
                      className="bg-card/50 border-border/50 hover:border-jules-cyan/30 transition-colors"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="font-mono">{component.name}</CardTitle>
                            <CardDescription>{component.description}</CardDescription>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyCode(component.code, component.name)}
                            className="text-muted-foreground hover:text-jules-cyan"
                          >
                            {copiedCode === component.name ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Preview */}
                        <div className="p-6 rounded-lg bg-muted/30 border border-border/50">
                          {component.preview}
                        </div>

                        {/* Code */}
                        <pre className="p-4 rounded-lg bg-jules-dark text-sm font-mono text-jules-cyan overflow-x-auto">
                          {component.code}
                        </pre>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </motion.section>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ComponentDocs;
