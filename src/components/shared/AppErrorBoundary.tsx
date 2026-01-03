// Cyberpunk-styled Error Boundary for graceful error handling
import { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-jules-dark flex items-center justify-center p-6 relative overflow-hidden">
          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(hsl(var(--jules-cyan)) 1px, transparent 1px),
                linear-gradient(90deg, hsl(var(--jules-cyan)) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Glowing orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--destructive) / 0.2) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 max-w-lg w-full"
          >
            <div className="bg-jules-surface/80 backdrop-blur-xl border border-destructive/30 rounded-2xl p-8 text-center">
              {/* Glitch effect header */}
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 border border-destructive/30 mb-6"
                animate={{
                  boxShadow: [
                    '0 0 20px hsl(var(--destructive) / 0.3)',
                    '0 0 40px hsl(var(--destructive) / 0.5)',
                    '0 0 20px hsl(var(--destructive) / 0.3)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertTriangle className="w-10 h-10 text-destructive" />
              </motion.div>

              <h1 className="text-2xl font-bold font-mono text-foreground mb-2">
                {'// SYSTEM_ERROR'}
              </h1>

              <p className="text-muted-foreground mb-6">
                Something went wrong. The quantum state collapsed unexpectedly.
              </p>

              {/* Error details (collapsible in production) */}
              {this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="text-sm text-jules-cyan cursor-pointer hover:text-jules-cyan/80 flex items-center gap-2">
                    <Bug className="w-4 h-4" />
                    Technical Details
                  </summary>
                  <pre className="mt-3 p-4 bg-jules-dark/50 rounded-lg text-xs text-destructive overflow-x-auto border border-destructive/20">
                    {this.state.error.message}
                    {this.state.errorInfo?.componentStack && (
                      <span className="text-muted-foreground block mt-2">
                        {this.state.errorInfo.componentStack.slice(0, 500)}...
                      </span>
                    )}
                  </pre>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={this.handleRetry}
                  className="bg-jules-cyan text-jules-dark hover:bg-jules-cyan/90"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="border-jules-cyan/30 hover:border-jules-cyan/50"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>
            </div>

            {/* Decorative scan line */}
            <motion.div
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-destructive/50 to-transparent"
              animate={{ top: ['0%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
