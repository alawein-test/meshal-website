// PWA Install Page - Guides users to install the app
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Smartphone, Monitor, Apple, Chrome, CheckCircle, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PublicHeader } from '@/components/shared/PublicHeader';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if on iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(ios);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <main className="pt-24 pb-16">
        <div className="container px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-jules-cyan/10 border border-jules-cyan/20 mb-6">
              <Download className="w-4 h-4 text-jules-cyan" />
              <span className="text-sm font-mono text-jules-cyan">Install App</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold font-mono mb-4">
              <span className="text-jules-cyan">{'<'}</span>
              Install MA Studios
              <span className="text-jules-magenta">{' />'}</span>
            </h1>

            <p className="text-muted-foreground max-w-2xl mx-auto">
              Install this app on your device for the best experience. Access it anytime, even
              offline, with faster loading times.
            </p>
          </motion.div>

          {isInstalled ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-jules-green/20 border border-jules-green/30 mb-6">
                <CheckCircle className="w-10 h-10 text-jules-green" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Already Installed!</h2>
              <p className="text-muted-foreground">
                This app is already installed on your device. Enjoy the experience!
              </p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Android/Desktop Install */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="h-full bg-card/50 border-border/50 hover:border-jules-cyan/30 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-jules-cyan/10">
                        <Chrome className="w-6 h-6 text-jules-cyan" />
                      </div>
                      <div className="p-2 rounded-lg bg-jules-magenta/10">
                        <Monitor className="w-6 h-6 text-jules-magenta" />
                      </div>
                    </div>
                    <CardTitle>Chrome / Android / Desktop</CardTitle>
                    <CardDescription>
                      One-click install for Chrome, Edge, and Android devices
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {deferredPrompt ? (
                      <Button
                        onClick={handleInstall}
                        className="w-full bg-jules-cyan text-jules-dark hover:bg-jules-cyan/90"
                        size="lg"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Install Now
                      </Button>
                    ) : (
                      <div className="space-y-3 text-sm text-muted-foreground">
                        <p className="font-medium text-foreground">Manual Installation:</p>
                        <ol className="list-decimal list-inside space-y-2">
                          <li>Click the menu button (⋮) in your browser</li>
                          <li>Look for "Install App" or "Add to Home Screen"</li>
                          <li>Follow the prompts to install</li>
                        </ol>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* iOS Install */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="h-full bg-card/50 border-border/50 hover:border-jules-magenta/30 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-jules-magenta/10">
                        <Apple className="w-6 h-6 text-jules-magenta" />
                      </div>
                      <div className="p-2 rounded-lg bg-jules-yellow/10">
                        <Smartphone className="w-6 h-6 text-jules-yellow" />
                      </div>
                    </div>
                    <CardTitle>iPhone / iPad</CardTitle>
                    <CardDescription>Add to Home Screen using Safari</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">Installation Steps:</p>
                      <ol className="list-decimal list-inside space-y-2">
                        <li className="flex items-start gap-2">
                          <span>1.</span>
                          <span>
                            Tap the Share button{' '}
                            <Share className="inline w-4 h-4 text-jules-cyan" /> at the bottom of
                            Safari
                          </span>
                        </li>
                        <li>Scroll down and tap "Add to Home Screen"</li>
                        <li>Tap "Add" in the top right corner</li>
                      </ol>
                      {isIOS && (
                        <p className="text-jules-cyan text-xs mt-4">
                          You're on an iOS device. Follow the steps above!
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { icon: Smartphone, title: 'Works Offline', desc: 'Access content without internet' },
              { icon: Download, title: 'Fast Loading', desc: 'Cached resources load instantly' },
              { icon: Monitor, title: 'Native Feel', desc: 'Full-screen, app-like experience' },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="text-center p-6 rounded-xl bg-muted/30 border border-border/50"
              >
                <feature.icon className="w-8 h-8 mx-auto mb-3 text-jules-cyan" />
                <h3 className="font-bold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Install;
