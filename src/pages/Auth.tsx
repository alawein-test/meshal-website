import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from '@/components/auth';
import { SignUpForm } from '@/components/auth';
import { Card } from '@/components/ui/card';
import { ArrowLeft, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGuestStore } from '@/stores/guestStore';
import { Separator } from '@/components/ui/separator';

const Auth = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const { enableGuestMode } = useGuestStore();

  const handleSuccess = () => {
    navigate('/projects', { replace: true });
  };

  const handleGuestMode = () => {
    enableGuestMode();
    navigate('/projects', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-4 left-4"
      >
        <Button variant="ghost" size="icon" onClick={() => navigate('/', { replace: true })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 gradient-text">Welcome Back</h1>
          <p className="text-muted-foreground">
            Unified platform for scientific computing and AI research
          </p>
        </div>

        <Card className="border-blue-500/20">
          <Tabs
            value={tab}
            onValueChange={(value) => setTab(value as 'login' | 'signup')}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Create Account</TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="login" className="mt-0">
                <LoginForm onSuccess={handleSuccess} />
              </TabsContent>

              <TabsContent value="signup" className="mt-0">
                <SignUpForm onSuccess={handleSuccess} />
              </TabsContent>

              <div className="mt-6">
                <div className="relative">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                    or
                  </span>
                </div>

                <Button variant="outline" className="w-full mt-4" onClick={handleGuestMode}>
                  <UserCircle className="h-4 w-4 mr-2" />
                  Continue as Guest
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Guest mode has limited features - data won't be saved
                </p>
              </div>
            </div>
          </Tabs>
        </Card>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm text-muted-foreground mt-6"
        >
          Secure authentication powered by the platform
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Auth;
