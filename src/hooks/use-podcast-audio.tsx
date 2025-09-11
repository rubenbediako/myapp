import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface PodcastLine {
  speaker: "Speaker1" | "Speaker2";
  line: string;
}

interface VisualContent {
  images: Array<{
    title: string;
    description: string;
    prompt: string;
    type: "chart" | "infographic" | "illustration" | "diagram" | "mathematical-graph" | "economic-model";
  }>;
  statistics: Array<{
    label: string;
    value: string;
    context: string;
    source: string;
    formula?: string;
  }>;
  charts: Array<{
    title: string;
    type: "line" | "bar" | "pie" | "scatter" | "area" | "function-plot" | "regression";
    description: string;
    data: {
      labels: string[];
      values: number[];
      categories?: string[];
      equation?: string;
    };
    xAxisLabel?: string;
    yAxisLabel?: string;
  }>;
  equations: Array<{
    title: string;
    latex: string;
    explanation: string;
    variables: Array<{
      symbol: string;
      meaning: string;
      unit?: string;
    }>;
    category: "algebra" | "calculus" | "statistics" | "economics" | "finance";
  }>;
  keyTerms: Array<{
    term: string;
    definition: string;
    symbol?: string;
    formula?: string;
  }>;
}

interface AudioSegment {
  id: number;
  speaker: string;
  speakerName: string;
  text: string;
  voice: string;
}

interface UsePodcastAudioOptions {
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export function usePodcastAudio(options?: UsePodcastAudioOptions) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSegment, setCurrentSegment] = useState<number>(-1);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [visualContent, setVisualContent] = useState<VisualContent | null>(null);
  const [isGeneratingVisuals, setIsGeneratingVisuals] = useState(false);
  const { toast } = useToast();
  
  const audioChunks = useRef<Blob[]>([]);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  useEffect(() => {
    return () => {
      // Cleanup
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  // Helper function to safely decode base64 audio data
  const decodeBase64Audio = useCallback((base64Data: string): Uint8Array => {
    try {
      // Remove data URL prefix if present (e.g., "data:audio/mpeg;base64,")
      const base64String = base64Data.includes(',') 
        ? base64Data.split(',')[1] 
        : base64Data;
      
      // Clean the base64 string (remove any whitespace/newlines)
      const cleanBase64 = base64String.replace(/\s/g, '');
      
      // Validate base64 format
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleanBase64)) {
        throw new Error('Invalid base64 format');
      }
      
      // Decode base64 to binary
      const binaryString = atob(cleanBase64);
      return Uint8Array.from(binaryString, c => c.charCodeAt(0));
    } catch (error) {
      console.error('Base64 decode error:', error);
      throw new Error(`Failed to decode base64 audio data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, []);

  const playPremiumAudioSegments = useCallback(async (segments: any[]) => {
    try {
      setIsPlaying(true);
      
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        setCurrentSegment(i);
        setProgress((i / segments.length) * 100);
        
        // Create audio URL from base64 with safe decoding
        const audioBuffer = decodeBase64Audio(segment.base64Audio);
        const audioBlob = new Blob([new Uint8Array(audioBuffer)], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Play the audio segment
        await new Promise<void>((resolve, reject) => {
          const audio = new Audio(audioUrl);
          
          audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            // Add pause between segments
            setTimeout(resolve, i < segments.length - 1 ? 800 : 0);
          };
          
          audio.onerror = (error) => {
            URL.revokeObjectURL(audioUrl);
            reject(new Error('Audio playback failed'));
          };
          
          audio.play().catch(reject);
        });
        
        if (!isPlaying) break; // Allow stopping
      }
      
      setCurrentSegment(-1);
      setProgress(100);
      setIsPlaying(false);
      
      // Create combined audio blob for download
      // Decode each segment individually and combine the binary data
      const audioBuffers = segments.map(segment => decodeBase64Audio(segment.base64Audio));
      
      // Calculate total length and create combined buffer
      const totalLength = audioBuffers.reduce((sum, buffer) => sum + buffer.length, 0);
      const combinedBuffer = new Uint8Array(totalLength);
      
      let offset = 0;
      audioBuffers.forEach(buffer => {
        combinedBuffer.set(buffer, offset);
        offset += buffer.length;
      });
      
      const combinedBlob = new Blob([combinedBuffer], { type: 'audio/mpeg' });
      const combinedUrl = URL.createObjectURL(combinedBlob);
      setAudioUrl(combinedUrl);
      
    } catch (error) {
      console.error('Premium audio playback error:', error);
      setIsPlaying(false);
      setIsGenerating(false);
      options?.onError?.(error instanceof Error ? error : new Error('Audio playback failed'));
    }
  }, [isPlaying, options, decodeBase64Audio]);

  const generateAudio = useCallback(async (podcastScript: PodcastLine[], query?: string, usePremiumAudio?: boolean) => {
    if (!podcastScript || podcastScript.length === 0) {
      const error = new Error('No podcast script available');
      options?.onError?.(error);
      toast({
        title: "No Content",
        description: "No podcast script available to generate audio.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setIsGeneratingVisuals(true);

    try {
      // Use ElevenLabs for all audio generation
      if (!query) {
        throw new Error('Audio generation requires a query for context');
      }

      const response = await fetch('/api/ai/generate-podcast-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          podcastScript,
          query,
          generateVisuals: true,
          generatePremiumAudio: true, // Always require premium audio
          ttsProvider: 'elevenlabs' // Force ElevenLabs for all audio
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate premium audio');
      }

      const result = await response.json();
      
      // Set visual content
      if (result.visualContent) {
        setVisualContent(result.visualContent);
        toast({
          title: "Educational Content Generated!",
          description: `Generated ${result.visualContent.charts?.length || 0} charts, ${result.visualContent.statistics?.length || 0} statistics, ${result.visualContent.images?.length || 0} visual concepts, ${result.visualContent.equations?.length || 0} equations, and ${result.visualContent.keyTerms?.length || 0} key terms.`,
        });
      }
      
      // Check if ElevenLabs audio was generated
      if (result.premiumAudio && result.premiumAudio.segments && result.premiumAudio.segments.length > 0) {
        toast({
          title: "Premium Audio Generated!",
          description: `High-quality natural voice created using ${result.premiumAudio.provider}. Playing with professional voices!`,
        });
        
        // Play ElevenLabs audio segments sequentially
        await playPremiumAudioSegments(result.premiumAudio.segments);
        
        setProgress(100);
        setIsGenerating(false);
        setIsGeneratingVisuals(false);
        options?.onComplete?.();
        return;
      } else {
        throw new Error('Premium audio generation failed - no audio segments received');
      }

    } catch (error) {
      console.error('Premium audio generation error:', error);
      setIsGenerating(false);
      setIsGeneratingVisuals(false);
      setCurrentSegment(-1);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast({
        title: "Premium Audio Generation Failed",
        description: `Could not generate premium audio: ${errorMessage}. Please ensure ElevenLabs API is configured and try again.`,
        variant: "destructive"
      });
      
      options?.onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  }, [playPremiumAudioSegments, toast, options]);

  const playAudio = useCallback((podcastScript?: PodcastLine[]) => {
    if (!podcastScript || !audioUrl) {
      toast({
        title: "No Audio Available",
        description: "Please generate audio first using ElevenLabs TTS before playing.",
        variant: "destructive"
      });
      return;
    }
    
    // Use the generated audio URL
    const audio = new Audio(audioUrl);
    audio.play().catch(error => {
      toast({
        title: "Playback Error",
        description: "Failed to play the generated audio.",
        variant: "destructive"
      });
    });
  }, [audioUrl, toast]);

  const stopAudio = useCallback(() => {
    setIsPlaying(false);
    setCurrentSegment(-1);
  }, []);

  const stopGeneration = useCallback(() => {
    setIsGenerating(false);
    setCurrentSegment(-1);
    setProgress(0);
  }, []);

  const downloadAudio = useCallback((podcastScript?: PodcastLine[]) => {
    if (!podcastScript) return;
    
    const podcastText = podcastScript.map(line => 
      `${line.speaker === "Speaker1" ? "Rita" : "Das"}: ${line.line}`
    ).join('\n\n');
    
    const blob = new Blob([podcastText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'das-podcast-transcript.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Transcript Downloaded",
      description: "The podcast transcript has been saved to your downloads.",
    });
  }, [toast]);

  return {
    isGenerating,
    isPlaying,
    currentSegment,
    audioUrl,
    progress,
    visualContent,
    isGeneratingVisuals,
    generateAudio,
    playAudio,
    stopAudio,
    stopGeneration,
    downloadAudio
  };
}
