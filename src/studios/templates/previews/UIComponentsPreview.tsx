import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, AlertCircle, Info, Loader2 } from 'lucide-react';

export function UIComponentsPreview() {
  return (
    <div className="p-6 space-y-6 bg-background min-h-[500px]">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold gradient-text mb-2">UI Component Library</h2>
        <p className="text-sm text-muted-foreground">Reusable components for rapid development</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Buttons Section */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Buttons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Primary</Button>
              <Button size="sm" variant="secondary">
                Secondary
              </Button>
              <Button size="sm" variant="outline">
                Outline
              </Button>
              <Button size="sm" variant="ghost">
                Ghost
              </Button>
              <Button size="sm" variant="destructive">
                Danger
              </Button>
            </div>
            <div className="flex gap-2">
              <Button size="sm" disabled>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Loading
              </Button>
              <Button size="sm" className="gap-1">
                <Check className="h-3 w-3" />
                Success
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Badges Section */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Badges & Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Error</Badge>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                <Check className="h-3 w-3 mr-1" /> Active
              </Badge>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                <AlertCircle className="h-3 w-3 mr-1" /> Pending
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Inputs Section */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Form Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Text input..." className="h-8 text-sm" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Toggle option</span>
              <Switch defaultChecked />
            </div>
            <Slider defaultValue={[60]} max={100} step={1} className="py-2" />
          </CardContent>
        </Card>

        {/* Progress Section */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Progress & Avatars</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span>75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/20 text-primary text-xs">JD</AvatarFallback>
              </Avatar>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-green-500/20 text-green-400 text-xs">
                  AB
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">+5 more</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Preview */}
      <Card className="glass-card">
        <CardContent className="pt-4">
          <Tabs defaultValue="overview">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default UIComponentsPreview;
