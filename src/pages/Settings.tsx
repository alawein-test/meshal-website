import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Settings as SettingsIcon,
  Bell,
  Shield,
  Palette,
  Keyboard,
  Database,
  Moon,
  Sun,
  Brain,
  Download,
  Trash2,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { useTheme, themeNames } from '@/context/ThemeContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Kbd } from '@/components/ui/kbd';
import { cn } from '@/lib/utils';
import { CyberpunkLayout, SEO } from '@/components/shared';
import { useAIConsentStore } from '@/stores/aiConsentStore';
import { toast } from 'sonner';

const shortcuts = [
  { keys: ['⌘/Ctrl', 'K'], description: 'Open command palette' },
  { keys: ['H'], description: 'Go to Home' },
  { keys: ['P'], description: 'Go to Portfolio' },
  { keys: ['D'], description: 'Go to Projects Hub' },
  { keys: ['1-5'], description: 'Open platform (1-5)' },
  { keys: ['Shift', '?'], description: 'Show keyboard shortcuts' },
];

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { consentLevel, consentDate, setConsentLevel, reset } = useAIConsentStore();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    updates: true,
    marketing: false,
  });

  const handleExportData = () => {
    // In production, this would fetch and export user's AI training data
    toast.success('Data export initiated. You will receive an email when ready.');
  };

  const handleDeleteData = () => {
    if (
      confirm('Are you sure you want to delete all your AI training data? This cannot be undone.')
    ) {
      // In production, this would delete user's AI training data
      toast.success('AI training data deletion requested.');
    }
  };

  return (
    <CyberpunkLayout>
      <SEO title="Settings | Meshal Alawein" description="Manage your preferences and settings" />

      {/* Page Header */}
      <div className="pt-24 pb-8 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link to="/platforms">
            <Button variant="ghost" size="icon" className="text-jules-cyan hover:bg-jules-cyan/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1
              className="text-3xl font-bold"
              style={{
                background:
                  'linear-gradient(135deg, hsl(var(--jules-cyan)) 0%, hsl(var(--jules-magenta)) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Settings
            </h1>
            <p className="text-sm text-muted-foreground font-mono">
              <span className="text-jules-green">// </span>
              Manage your preferences
            </p>
          </div>
        </motion.div>
      </div>

      <main className="container mx-auto px-4 pb-16 max-w-4xl">
        <Tabs defaultValue="appearance" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full bg-jules-surface/50 border border-jules-border">
            <TabsTrigger
              value="appearance"
              className="flex items-center gap-2 data-[state=active]:bg-jules-cyan/20 data-[state=active]:text-jules-cyan"
            >
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2 data-[state=active]:bg-jules-magenta/20 data-[state=active]:text-jules-magenta"
            >
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger
              value="shortcuts"
              className="flex items-center gap-2 data-[state=active]:bg-jules-yellow/20 data-[state=active]:text-jules-yellow"
            >
              <Keyboard className="h-4 w-4" />
              <span className="hidden sm:inline">Shortcuts</span>
            </TabsTrigger>
            <TabsTrigger
              value="data"
              className="flex items-center gap-2 data-[state=active]:bg-jules-purple/20 data-[state=active]:text-jules-purple"
            >
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Data</span>
            </TabsTrigger>
            <TabsTrigger
              value="ai-privacy"
              className="flex items-center gap-2 data-[state=active]:bg-jules-green/20 data-[state=active]:text-jules-green"
            >
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">AI Privacy</span>
            </TabsTrigger>
          </TabsList>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="border-jules-cyan/20 bg-jules-surface/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-jules-cyan font-mono">
                    <Palette className="h-5 w-5" />
                    {'// Theme'}
                  </CardTitle>
                  <CardDescription>Choose your preferred theme</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {themeNames.map((themeName) => (
                      <button
                        key={themeName}
                        onClick={() => setTheme(themeName)}
                        className={cn(
                          'p-4 rounded-lg border-2 transition-all text-left',
                          theme === themeName
                            ? 'border-jules-cyan bg-jules-cyan/10'
                            : 'border-jules-border hover:border-jules-cyan/50'
                        )}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {themeName === 'light' || themeName === 'pastel' ? (
                            <Sun className="h-4 w-4 text-jules-yellow" />
                          ) : (
                            <Moon className="h-4 w-4 text-jules-purple" />
                          )}
                          <span className="font-medium capitalize font-mono">{themeName}</span>
                        </div>
                        <div className="flex gap-1">
                          <div className="w-3 h-3 rounded-full bg-jules-cyan" />
                          <div className="w-3 h-3 rounded-full bg-jules-magenta" />
                          <div className="w-3 h-3 rounded-full bg-jules-yellow" />
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="border-jules-magenta/20 bg-jules-surface/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-jules-magenta font-mono">
                    <Bell className="h-5 w-5" />
                    {'// Notification Preferences'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-foreground">Email notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, email: checked })
                      }
                    />
                  </div>
                  <Separator className="bg-jules-border/50" />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-foreground">Push notifications</Label>
                      <p className="text-sm text-muted-foreground">Browser push notifications</p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, push: checked })
                      }
                    />
                  </div>
                  <Separator className="bg-jules-border/50" />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-foreground">Product updates</Label>
                      <p className="text-sm text-muted-foreground">News about new features</p>
                    </div>
                    <Switch
                      checked={notifications.updates}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, updates: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Shortcuts Tab */}
          <TabsContent value="shortcuts">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="border-jules-yellow/20 bg-jules-surface/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-jules-yellow font-mono">
                    <Keyboard className="h-5 w-5" />
                    {'// Keyboard Shortcuts'}
                  </CardTitle>
                  <CardDescription>Quick navigation using your keyboard</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {shortcuts.map((shortcut, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-2 border-b border-jules-border/50 last:border-0"
                      >
                        <span className="text-sm text-foreground">{shortcut.description}</span>
                        <div className="flex items-center gap-1">
                          {shortcut.keys.map((key, keyIdx) => (
                            <Kbd key={keyIdx}>{key}</Kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="border-jules-purple/20 bg-jules-surface/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-jules-purple font-mono">
                    <Database className="h-5 w-5" />
                    {'// Data Management'}
                  </CardTitle>
                  <CardDescription>Manage your data and privacy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Export all data</p>
                      <p className="text-sm text-muted-foreground">Download your data as JSON</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-jules-cyan/30 text-jules-cyan hover:bg-jules-cyan/10"
                    >
                      Export
                    </Button>
                  </div>
                  <Separator className="bg-jules-border/50" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Clear local cache</p>
                      <p className="text-sm text-muted-foreground">Reset local storage data</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-jules-yellow/30 text-jules-yellow hover:bg-jules-yellow/10"
                    >
                      Clear
                    </Button>
                  </div>
                  <Separator className="bg-jules-border/50" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-destructive">Delete account</p>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account
                      </p>
                    </div>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* AI Privacy Tab */}
          <TabsContent value="ai-privacy">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="border-jules-green/20 bg-jules-surface/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-jules-green font-mono">
                    <Brain className="h-5 w-5" />
                    {'// AI Training Consent'}
                  </CardTitle>
                  <CardDescription>
                    Control how your data is used to improve our AI systems
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current Consent Status */}
                  <div className="p-4 rounded-lg bg-muted/50 border border-jules-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-foreground">Current Consent Level</Label>
                      {consentLevel && (
                        <Badge
                          variant={
                            consentLevel === 'accept_all'
                              ? 'default'
                              : consentLevel === 'accept_anonymized'
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {consentLevel === 'accept_all'
                            ? 'Full Consent'
                            : consentLevel === 'accept_anonymized'
                              ? 'Anonymized Only'
                              : 'Declined'}
                        </Badge>
                      )}
                    </div>
                    {consentLevel ? (
                      <div className="space-y-1 text-sm">
                        <p className="text-muted-foreground">
                          You've opted{' '}
                          {consentLevel === 'accept_all'
                            ? 'in to full AI training'
                            : consentLevel === 'accept_anonymized'
                              ? 'in to anonymized data collection'
                              : 'out of AI training'}
                          .
                        </p>
                        {consentDate && (
                          <p className="text-xs text-muted-foreground">
                            Set on: {new Date(consentDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No consent preference set</p>
                    )}
                  </div>

                  {/* Consent Options */}
                  <div className="space-y-3">
                    <Label className="text-foreground">Change Consent Level</Label>
                    <div className="space-y-2">
                      <Button
                        variant={consentLevel === 'accept_all' ? 'default' : 'outline'}
                        className="w-full justify-start"
                        onClick={() => {
                          setConsentLevel('accept_all');
                          toast.success('Full AI training consent enabled');
                        }}
                      >
                        <div className="flex-1 text-left">
                          <div className="font-semibold">Accept All</div>
                          <div className="text-xs text-muted-foreground">
                            Full data collection for AI training. Get early access to features.
                          </div>
                        </div>
                      </Button>
                      <Button
                        variant={consentLevel === 'accept_anonymized' ? 'default' : 'outline'}
                        className="w-full justify-start"
                        onClick={() => {
                          setConsentLevel('accept_anonymized');
                          toast.success('Anonymized data collection enabled');
                        }}
                      >
                        <div className="flex-1 text-left">
                          <div className="font-semibold">Anonymized Only</div>
                          <div className="text-xs text-muted-foreground">
                            Only anonymized usage data collected
                          </div>
                        </div>
                      </Button>
                      <Button
                        variant={consentLevel === 'decline' ? 'default' : 'outline'}
                        className="w-full justify-start"
                        onClick={() => {
                          setConsentLevel('decline');
                          toast.info('AI training disabled. Some features may be limited.');
                        }}
                      >
                        <div className="flex-1 text-left">
                          <div className="font-semibold">Decline</div>
                          <div className="text-xs text-muted-foreground">
                            Opt out of AI training (some features unavailable)
                          </div>
                        </div>
                      </Button>
                    </div>
                  </div>

                  <Separator className="bg-jules-border/50" />

                  {/* Data Management */}
                  <div className="space-y-4">
                    <Label className="text-foreground">Data Management</Label>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Export AI training data</p>
                        <p className="text-sm text-muted-foreground">
                          Download all data used for AI training
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExportData}
                        className="border-jules-cyan/30 text-jules-cyan hover:bg-jules-cyan/10"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                    <Separator className="bg-jules-border/50" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">View data usage</p>
                        <p className="text-sm text-muted-foreground">
                          See how your data is being used
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-jules-green/30 text-jules-green hover:bg-jules-green/10"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                    <Separator className="bg-jules-border/50" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-destructive">Delete AI training data</p>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete all your AI training data
                        </p>
                      </div>
                      <Button variant="destructive" size="sm" onClick={handleDeleteData}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  <Separator className="bg-jules-border/50" />

                  {/* Links */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <Link to="/privacy" className="text-jules-cyan hover:underline">
                      Privacy Policy
                    </Link>
                    <Link to="/transparency" className="text-jules-cyan hover:underline">
                      Transparency Report
                    </Link>
                    <Link to="/terms" className="text-jules-cyan hover:underline">
                      Terms of Service
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </CyberpunkLayout>
  );
};

export default Settings;
