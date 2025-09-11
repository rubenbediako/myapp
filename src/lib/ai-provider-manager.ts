/**
 * AI Provider Management Utility
 * Allows easy switching between different AI providers based on use case
 */

import { AI_MODELS, AI_CONFIG, generateAIText } from './ai';

// Provider capabilities and best use cases
export const PROVIDER_INFO = {
  gemini: {
    name: 'Google Gemini',
    strengths: ['Fast inference', 'Multimodal capabilities', 'Cost-effective'],
    bestFor: ['General tasks', 'Quick responses', 'Code generation'],
    pricing: 'Low',
    speed: 'Fast'
  },
  claude: {
    name: 'Anthropic Claude',
    strengths: ['High-quality reasoning', 'Safety-focused', 'Long context'],
    bestFor: ['Complex analysis', 'Creative writing', 'Detailed explanations'],
    pricing: 'Medium',
    speed: 'Medium'
  }
} as const;

// Smart provider selection based on task type
export function selectOptimalProvider(taskType: string): keyof typeof AI_CONFIG {
  switch (taskType.toLowerCase()) {
    case 'economic-analysis':
    case 'research':
    case 'analysis':
      return 'economicAnalysis'; // Claude excels at analytical tasks
    
    case 'podcast':
    case 'creative':
    case 'storytelling':
      return 'podcastGeneration'; // Claude for creative content
    
    case 'multilingual':
    case 'translation':
    case 'international':
      return 'multilingualAnalysis'; // Gemini for multilingual tasks
    
    case 'quick':
    case 'simple':
    case 'fast':
    case 'code':
    case 'technical':
      return 'dataProcessing'; // Gemini for fast processing
    
    default:
      return 'economicAnalysis'; // Default to economic analysis with Claude
  }
}

// Enhanced text generation with automatic provider selection
export async function generateOptimizedText(
  prompt: string,
  taskType: string = 'general',
  options?: { 
    temperature?: number; 
    maxTokens?: number;
    forceTask?: keyof typeof AI_CONFIG;
  }
): Promise<{ text: string; provider: string; model: string }> {
  try {
    // Select optimal task config
    const selectedTask = options?.forceTask || selectOptimalProvider(taskType);
    const config = AI_CONFIG[selectedTask];
    
    // Generate text with optimal provider
    const text = await generateAIText(prompt, selectedTask, options);
    
    // Return result with metadata
    return {
      text: text,
      provider: getProviderForModel(config.model),
      model: config.model
    };
  } catch (error: any) {
    throw new Error(`Optimized text generation failed: ${error?.message || 'Unknown error'}`);
  }
}

// Helper to get provider from model name
function getProviderForModel(model: string): string {
  if (model.startsWith('gemini')) return 'gemini';
  if (model.startsWith('claude')) return 'claude';
  return 'claude';
}

// Provider health check utility
export async function checkProviderHealth(): Promise<Record<string, boolean>> {
  const healthStatus: Record<string, boolean> = {
    gemini: false,
    claude: false
  };
  
  const testPrompt = "Hello";
  
  // Test each provider with a simple prompt
  const tests = Object.keys(healthStatus).map(async (provider) => {
    try {
      // Map provider to task that uses that provider
      const taskMap: Record<string, keyof typeof AI_CONFIG> = {
        gemini: 'dataProcessing',
        claude: 'podcastGeneration'
      };
      
      await generateOptimizedText(testPrompt, 'quick', { 
        forceTask: taskMap[provider],
        maxTokens: 10 
      });
      healthStatus[provider] = true;
    } catch (error: any) {
      console.log(`${provider} health check failed:`, error?.message || 'Unknown error');
      healthStatus[provider] = false;
    }
  });
  
  await Promise.allSettled(tests);
  
  return healthStatus;
}

// Get provider recommendations for different use cases
export function getProviderRecommendations() {
  return {
    economicAnalysis: {
      primary: 'claude',
      alternative: 'gemini',
      reason: 'Claude excels at analytical and research tasks with deep reasoning'
    },
    podcastGeneration: {
      primary: 'claude',
      alternative: 'gemini',
      reason: 'Claude provides high-quality creative content and structured output'
    },
    multilingualContent: {
      primary: 'gemini',
      alternative: 'claude',
      reason: 'Gemini has broad multilingual capabilities and fast processing'
    },
    rapidPrototyping: {
      primary: 'gemini',
      alternative: 'claude',
      reason: 'Gemini offers fast, cost-effective generation for quick tasks'
    },
    complexAnalysis: {
      primary: 'claude',
      alternative: 'gemini',
      reason: 'Claude is designed for complex reasoning and detailed analysis'
    }
  };
}
