import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ScanOptionsData {
  [key: string]: string | number | boolean | null | undefined;
}

interface ScanOptions {
  type: 'url' | 'code' | 'document' | 'api';
  source: string;
  depth?: 'shallow' | 'medium' | 'deep';
  options?: ScanOptionsData;
}

interface ResearchFilters {
  [key: string]: string | number | boolean | null | undefined;
}

interface ResearchOptions {
  query: string;
  sources?: string[];
  depth?: 'basic' | 'comprehensive' | 'deep';
  filters?: ResearchFilters;
}

/**
 * Hook for unified scanner and research system
 */
export function useUnifiedScanner() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scan = async (options: ScanOptions) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: scanError } = await supabase.functions.invoke('unified-scanner-api', {
        body: {
          action: 'scan',
          ...options,
        },
      });

      if (scanError) throw scanError;

      toast.success('Scan completed successfully');
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to perform scan';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const research = async (options: ResearchOptions) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: researchError } = await supabase.functions.invoke(
        'unified-scanner-api',
        {
          body: {
            action: 'research',
            ...options,
          },
        }
      );

      if (researchError) throw researchError;

      toast.success('Research completed successfully');
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to perform research';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const analyze = async (tools: string[], analysisType: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: analyzeError } = await supabase.functions.invoke('unified-scanner-api', {
        body: {
          action: 'analyze',
          tools,
          analysis_type: analysisType,
        },
      });

      if (analyzeError) throw analyzeError;

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to perform analysis';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    scan,
    research,
    analyze,
    loading,
    error,
  };
}
