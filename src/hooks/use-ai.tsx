import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseAIOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const callAPI = useCallback(async (
    endpoint: string, 
    data: any, 
    options?: UseAIOptions
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/ai/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || 'API request failed');
      }

      const result = await response.json();
      
      if (options?.onSuccess) {
        options.onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      
      if (options?.onError) {
        options.onError(error);
      } else {
        toast({
          title: "AI Error",
          description: error.message,
          variant: "destructive"
        });
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Specific AI functions
  const askDasAi = useCallback((query: string, options?: UseAIOptions) => {
    return callAPI('ask-das-ai', { query }, options);
  }, [callAPI]);

  const generateBusinessPlan = useCallback((data: {
    businessIdea: string;
    industry?: string;
    targetMarket?: string;
    budget?: string;
  }, options?: UseAIOptions) => {
    return callAPI('generate-business-plan', data, options);
  }, [callAPI]);

  const analyzeEconomics = useCallback((data: {
    topic: string;
    type?: string;
    region?: string;
    timeframe?: string;
  }, options?: UseAIOptions) => {
    return callAPI('economic-analysis', data, options);
  }, [callAPI]);

  return {
    isLoading,
    error,
    askDasAi,
    generateBusinessPlan,
    analyzeEconomics,
    callAPI,
  };
}
