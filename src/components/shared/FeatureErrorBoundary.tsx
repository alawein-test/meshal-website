/**
 * @file FeatureErrorBoundary.tsx
 * @description Feature-level error boundary for graceful degradation of individual components
 */
import { Component, ReactNode, ErrorInfo } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface Props {
  children: ReactNode;
  featureName: string;
  onRetry?: () => void;
  showDetails?: boolean;
  compact?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class FeatureErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error(`[${this.props.featureName}] Error:`, error, errorInfo);

    // Could send to error tracking service here
    // reportError(error, { feature: this.props.featureName, ...errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onRetry?.();
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, featureName, showDetails = true, compact = false } = this.props;

    if (hasError) {
      if (compact) {
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20"
          >
            <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
            <span className="text-sm text-muted-foreground flex-1">
              {featureName} failed to load
            </span>
            <Button onClick={this.handleRetry} variant="ghost" size="sm" className="shrink-0">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </motion.div>
        );
      }

      return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-destructive/30 bg-destructive/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-destructive">
                <AlertCircle className="h-5 w-5" />
                {featureName} Error
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This component encountered an error and couldn't render properly. You can try again
                or continue using other features.
              </p>

              {showDetails && error && (
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <ChevronDown className="h-3 w-3" />
                    Technical Details
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <pre className="mt-2 p-3 bg-background/50 rounded-md text-xs text-destructive overflow-x-auto max-h-32">
                      {error.message}
                      {errorInfo?.componentStack && (
                        <span className="text-muted-foreground block mt-2 text-[10px]">
                          {errorInfo.componentStack.slice(0, 300)}...
                        </span>
                      )}
                    </pre>
                  </CollapsibleContent>
                </Collapsible>
              )}

              <Button
                onClick={this.handleRetry}
                variant="outline"
                size="sm"
                className="border-destructive/30 hover:border-destructive/50"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      );
    }

    return children;
  }
}

export default FeatureErrorBoundary;
