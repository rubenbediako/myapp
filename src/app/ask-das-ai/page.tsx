
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mic, Wand2, Square, Image as ImageIcon, Play, Download, Volume2, BarChart3, TrendingUp, PieChart, LineChart, Calculator, BookOpen, Sigma, Info, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePodcastAudio } from '@/hooks/use-podcast-audio';
import { BarChart, Bar, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InlineMath, BlockMath } from 'react-katex';
import { EnhancedPodcastRenderer } from '@/components/enhanced-podcast-renderer-new';

// Types for our API responses
interface PodcastLine {
  speaker: "Speaker1" | "Speaker2";
  line: string;
}

interface AskDasAiResponse {
  podcastScript: PodcastLine[];
}

interface GeneratePodcastResponse {
  audioUrl: string;
  duration: number;
}

interface GenerateImageResponse {
  imageUrl: string;
  description: string;
}

export default function AskDasAiPage() {
    const [query, setQuery] = useState('');
    const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
    const [result, setResult] = useState<AskDasAiResponse | null>(null);
    const [podcast, setPodcast] = useState<GeneratePodcastResponse | null>(null);
    const [imageResult, setImageResult] = useState<GenerateImageResponse | null>(null);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [usePremiumAudio, setUsePremiumAudio] = useState(true); // Default to true for Google Gemini
    const { toast } = useToast();
    
    // Podcast audio functionality
    const {
        isGenerating: isGeneratingAudio,
        isPlaying: isPlayingAudio,
        currentSegment,
        audioUrl,
        progress: audioProgress,
        visualContent,
        isGeneratingVisuals,
        generateAudio,
        playAudio,
        stopAudio,
        stopGeneration,
        downloadAudio
    } = usePodcastAudio({
        onComplete: () => {
            toast({
                title: "Podcast Audio Complete!",
                description: "Your podcast is ready to play and download.",
            });
        },
        onError: (error) => {
            toast({
                title: "Audio Generation Failed",
                description: error.message,
                variant: "destructive"
            });
        }
    });
    
    // State for voice input
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = 'en-US';

                recognition.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    setQuery(transcript);
                    setIsRecording(false);
                };

                recognition.onerror = (event: any) => {
                    console.error('Speech recognition error:', event.error);
                    toast({
                        title: "Voice Error",
                        description: `An error occurred during voice recognition: ${event.error}. Please ensure microphone access is allowed.`,
                        variant: "destructive"
                    });
                    setIsRecording(false);
                };

                recognition.onend = () => {
                    setIsRecording(false);
                };
                
                recognitionRef.current = recognition;
            }
        }
    }, [toast]);

    const handleToggleRecording = () => {
        if (!recognitionRef.current) {
            toast({
                title: "Voice Recognition Not Supported",
                description: "Your browser does not support voice recognition. Please type your question.",
                variant: "destructive"
            });
            return;
        }

        if (isRecording) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
        setIsRecording(!isRecording);
    };

    const handleAskQuestion = async () => {
        if (!query) {
            toast({
                title: "Question missing",
                description: "Please enter a question to ask Das.",
                variant: "destructive"
            });
            return;
        }
        setLoadingStatus("Generating analysis...");
        setResult(null);
        setPodcast(null);
        setImageResult(null);
        try {
            // Call our new API endpoint
            const response = await fetch('/api/ai/ask-das-ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            console.log('API Response status:', response.status);
            console.log('API Response ok:', response.ok);

            if (!response.ok) {
                let errorData;
                try {
                    const responseText = await response.text();
                    console.log('Raw error response:', responseText);
                    
                    if (responseText.trim()) {
                        try {
                            errorData = JSON.parse(responseText);
                            console.log('Parsed error data:', errorData);
                        } catch (parseError) {
                            console.error('Failed to parse error response as JSON:', parseError);
                            errorData = { error: responseText || 'Unknown server error' };
                        }
                    } else {
                        errorData = { error: `HTTP ${response.status} - ${response.statusText || 'No error message'}` };
                    }
                } catch (textError) {
                    console.error('Failed to read error response:', textError);
                    errorData = { error: `HTTP ${response.status} - Failed to read response` };
                }
                
                console.error('Final Error Data:', errorData);
                const errorMessage = errorData?.error || errorData?.details || errorData?.message || `HTTP ${response.status}`;
                throw new Error(errorMessage);
            }

            const apiResult: AskDasAiResponse = await response.json();
            console.log('API Success:', apiResult);
            setResult(apiResult);
            
            toast({
                title: "Analysis Complete!",
                description: `Generated ${apiResult.podcastScript?.length || 0} dialogue lines. Generating audio...`,
            });
            
            // Automatically generate audio after text generation
            if (apiResult.podcastScript && apiResult.podcastScript.length > 0) {
                setLoadingStatus("Generating podcast audio and visuals...");
                await generateAudio(apiResult.podcastScript, query, usePremiumAudio);
            }
            
            setLoadingStatus(null);

        } catch (error) {
            console.error('AI Generation Error:', error);
            console.error('Error type:', typeof error);
            console.error('Error details:', {
                name: error instanceof Error ? error.name : 'Unknown',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                stack: error instanceof Error ? error.stack : 'No stack trace'
            });
            
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            
            toast({
                title: "Error getting answer",
                description: `An error occurred while generating the answer: ${errorMessage}. Please try again.`,
                variant: "destructive"
            });
        } finally {
            setLoadingStatus(null);
        }
    };
    
    const handleGenerateImage = async () => {
        if (!query) return;
        setIsGeneratingImage(true);
        setImageResult(null);
        try {
            // TODO: Implement image generation with a proper image API
            toast({
                title: "Image Generation",
                description: "Image generation will be implemented with a dedicated image API.",
                variant: "default"
            });
            // const imagePrompt = `Create a professional, high-quality visual representation of the economic or business concept: "${query}". The style should be modern, clean, and suitable for a financial news publication.`;
            // const result = await generateImage({ prompt: imagePrompt });
            // setImageResult(result);
        } catch (error) {
            console.error(error);
            toast({
                title: "Error Generating Image",
                description: "Could not generate a visual for this topic. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const getSpeakerName = (speaker: "Speaker1" | "Speaker2") => {
        return speaker === "Speaker1" ? "Rita" : "Das";
    };

    const getSpeakerClass = (speaker: "Speaker1" | "Speaker2") => {
        return speaker === "Speaker1" ? "text-purple-600 dark:text-purple-400" : "text-blue-600 dark:text-blue-400";
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-8 w-8 text-blue-500" />
                        <Volume2 className="h-8 w-8 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">Enhanced Audio Podcast</h2>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-6 w-6 text-blue-500" />
                            <Volume2 className="h-6 w-6 text-green-500" />
                        </div>
                        Ask Das-AI
                    </CardTitle>
                    <CardDescription>
                        Ask about economics, business, finance, or entrepreneurship. Get an enhanced podcast with both text transcript featuring real data, statistics, mathematical models AND premium ElevenLabs audio.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative">
                        <Textarea 
                            placeholder="Type or speak your question here... e.g., 'What is quantitative easing?'"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            rows={4}
                            className="pr-12"
                        />
                         <Button 
                            size="icon" 
                            variant={isRecording ? "destructive" : "outline"} 
                            className="absolute top-1/2 right-3 -translate-y-1/2"
                            onClick={handleToggleRecording}
                        >
                            {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                            <span className="sr-only">{isRecording ? "Stop recording" : "Start recording"}</span>
                        </Button>
                    </div>
                    
                    {/* Premium Audio Toggle */}
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <Checkbox 
                                id="premium-audio" 
                                checked={usePremiumAudio}
                                onCheckedChange={(checked) => setUsePremiumAudio(checked as boolean)}
                            />
                            <label 
                                htmlFor="premium-audio" 
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Use Premium Voice (ElevenLabs)
                            </label>
                            <Badge variant="outline" className="text-xs">
                                Recommended
                            </Badge>
                        </div>
                        
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <HelpCircle className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-sm">
                                    <div className="space-y-2">
                                        <p className="font-medium">Enhanced Podcast: Text + Audio</p>
                                        <p className="text-xs">Complete podcast experience with both formats:</p>
                                        <ul className="text-xs space-y-1">
                                            <li>• <strong>Text:</strong> Real economic data, statistics & mathematical models</li>
                                            <li>• <strong>Audio:</strong> ElevenLabs premium professional voices</li>
                                            <li>• <strong>AI:</strong> Anthropic Claude + Google Gemini intelligence</li>
                                            <li>• <strong>Features:</strong> Charts, graphs, equations, and statistical analysis</li>
                                        </ul>
                                        <p className="text-xs">Read along while listening to enhance learning experience.</p>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    
                    <Button onClick={handleAskQuestion} disabled={!!loadingStatus || isGeneratingAudio || isGeneratingVisuals || !query}>
                        {(loadingStatus || isGeneratingAudio || isGeneratingVisuals) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                        {loadingStatus || (isGeneratingVisuals ? 'Generating Visuals...' : (isGeneratingAudio ? 'Generating Audio...' : 'Generate Enhanced Podcast (Text + Audio)'))}
                    </Button>

                    {result && (
                        <div className="pt-4 space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <Card>
                                    <CardHeader>
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div className="flex-1">
                                                <CardTitle className="flex items-center gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <BookOpen className="h-5 w-5" />
                                                        <Volume2 className="h-5 w-5" />
                                                    </div>
                                                    Enhanced Audio Podcast
                                                </CardTitle>
                                                <CardDescription className="mt-2">
                                                    Economics discussion with real data, mathematical models, and premium ElevenLabs audio
                                                </CardDescription>
                                            </div>
                                            
                                            {/* Audio Controls */}
                                            <div className="flex items-center gap-2">
                                                {isGeneratingAudio && (
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        <span>Generating audio... {Math.round(audioProgress)}%</span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={stopGeneration}
                                                        >
                                                            <Square className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                                                 {audioUrl && !isGeneratingAudio && (
                                    <div className="flex items-center gap-2">
                                        {!isPlayingAudio ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => playAudio(result.podcastScript)}
                                            >
                                                <Play className="h-4 w-4" />
                                                Play
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={stopAudio}
                                            >
                                                <Square className="h-4 w-4" />
                                                Stop
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => downloadAudio(result.podcastScript)}
                                        >
                                            <Download className="h-4 w-4" />
                                            Download
                                        </Button>
                                    </div>
                                )}
                                                
                                                {!audioUrl && !isGeneratingAudio && result.podcastScript && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => generateAudio(result.podcastScript)}
                                                    >
                                                        <Volume2 className="h-4 w-4" />
                                                        Generate Audio
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            {/* Audio-Only Experience Section */}
                                            <div className="flex items-center justify-center p-6 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                                <div className="text-center space-y-3">
                                                    <Volume2 className="h-12 w-12 mx-auto text-red-500" />
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">Premium Audio Experience</h3>
                                                        <p className="text-muted-foreground text-sm">ElevenLabs voice synthesis with highlighted text tracking</p>
                                                    </div>
                                                    {isPlayingAudio && currentSegment !== null && (
                                                        <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/40 rounded-lg">
                                                            <div className="flex items-center justify-center gap-2 text-red-700 dark:text-red-300">
                                                                <div className="animate-pulse flex space-x-1">
                                                                    <div className="h-2 w-1 bg-red-500 rounded-full animate-bounce"></div>
                                                                    <div className="h-2 w-1 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                                                    <div className="h-2 w-1 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                                                </div>
                                                                <span className="font-medium text-sm">
                                                                    🎧 Reading: Segment {(currentSegment || 0) + 1} of {result.podcastScript.length}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Enhanced Text Transcript */}
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 pb-2 border-b border-red-200 dark:border-red-800">
                                                    <BookOpen className="h-5 w-5 text-red-600" />
                                                    <h4 className="font-semibold text-red-800 dark:text-red-200">Interactive Transcript</h4>
                                                    <Badge variant="secondary" className="text-xs bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200">
                                                        Live Red Highlighting
                                                    </Badge>
                                                </div>
                                                
                                                {/* Red Highlighting Explanation */}
                                                <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                                    <div className="flex items-center gap-2 text-red-700 dark:text-red-300 text-sm">
                                                        <div className="flex space-x-1">
                                                            <div className="h-2 w-2 bg-red-500 rounded-full animate-bounce"></div>
                                                            <div className="h-2 w-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                                            <div className="h-2 w-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                                        </div>
                                                        <span className="font-medium">The current segment being read aloud is highlighted in red</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
                                                    {result.podcastScript.map((line, index) => (
                                                        <div key={index} className={currentSegment === index ? 
                                                            'bg-gradient-to-r from-red-200 to-red-300 dark:from-red-800/80 dark:to-red-700/80 p-4 rounded-lg border-l-4 border-red-600 shadow-lg ring-2 ring-red-300 dark:ring-red-600 transition-all duration-500 font-medium relative text-red-900 dark:text-red-100' : 
                                                            'p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 rounded-md border border-gray-200 dark:border-gray-700'
                                                        }>
                                                            {currentSegment === index && (
                                                                <div className="absolute -left-2 top-4 flex items-center gap-2">
                                                                    <span className="flex h-3 w-3">
                                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {currentSegment === index && (
                                                                <div className="flex items-center gap-2 mb-3 text-red-700 dark:text-red-300">
                                                                    <div className="flex space-x-1">
                                                                        <div className="h-2 w-2 bg-red-500 rounded-full animate-bounce"></div>
                                                                        <div className="h-2 w-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                                                        <div className="h-2 w-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                                                    </div>
                                                                    <span className="text-sm font-bold">🎧 NOW READING</span>
                                                                </div>
                                                            )}
                                                            <div className="mb-3">
                                                                <strong className={`${getSpeakerClass(line.speaker)} ${
                                                                    currentSegment === index ? 'text-red-800 dark:text-red-200' : ''
                                                                }`}>
                                                                    {getSpeakerName(line.speaker)}:
                                                                </strong>
                                                            </div>
                                                            <div className={`ml-4 ${
                                                                currentSegment === index ? 'text-red-900 dark:text-red-100 font-medium' : ''
                                                            }`}>
                                                                <EnhancedPodcastRenderer 
                                                                    text={line.line} 
                                                                    speaker={line.speaker}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                 <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <BarChart3 className="h-5 w-5" />
                                            Multimedia Content
                                        </CardTitle>
                                        <CardDescription>AI-generated charts, statistics, and visual concepts.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {isGeneratingVisuals && (
                                            <div className="flex items-center justify-center gap-2 py-8">
                                                <Loader2 className="h-6 w-6 animate-spin" />
                                                <span>Generating visual content...</span>
                                            </div>
                                        )}
                                        
                                        {visualContent && (
                                            <div className="space-y-6">
                                                {/* Statistics Section */}
                                                {visualContent.statistics && visualContent.statistics.length > 0 && (
                                                    <div>
                                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                            <TrendingUp className="h-4 w-4" />
                                                            Key Statistics
                                                        </h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {visualContent.statistics.map((stat, index) => (
                                                                <div key={index} className="p-4 bg-muted/50 rounded-lg">
                                                                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                                                                    <div className="font-medium">{stat.label}</div>
                                                                    <div className="text-sm text-muted-foreground mt-1">{stat.context}</div>
                                                                    {stat.formula && (
                                                                        <div className="mt-2 p-2 bg-background rounded text-center">
                                                                            <InlineMath math={stat.formula} />
                                                                        </div>
                                                                    )}
                                                                    <div className="text-xs text-muted-foreground mt-1">Source: {stat.source}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {/* Charts Section */}
                                                {visualContent.charts && visualContent.charts.length > 0 && (
                                                    <div>
                                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                            <LineChart className="h-4 w-4" />
                                                            Data Visualizations
                                                        </h4>
                                                        <div className="space-y-6">
                                                            {visualContent.charts.map((chart, index) => (
                                                                <div key={index} className="p-4 bg-muted/50 rounded-lg">
                                                                    <h5 className="font-medium mb-2">{chart.title}</h5>
                                                                    <p className="text-sm text-muted-foreground mb-4">{chart.description}</p>
                                                                    
                                                                    {chart.data.equation && (
                                                                        <div className="mb-3 p-2 bg-background rounded text-center">
                                                                            <InlineMath math={chart.data.equation} />
                                                                        </div>
                                                                    )}
                                                                    
                                                                    <div className="h-64">
                                                                        <ResponsiveContainer width="100%" height="100%">
                                                                            {(() => {
                                                                                if (chart.type === 'bar') {
                                                                                    return (
                                                                                        <BarChart data={chart.data.labels.map((label, i) => ({
                                                                                            name: label,
                                                                                            value: chart.data.values[i] || 0
                                                                                        }))}>
                                                                                            <CartesianGrid strokeDasharray="3 3" />
                                                                                            <XAxis 
                                                                                                dataKey="name" 
                                                                                                label={{ value: chart.xAxisLabel || 'X', position: 'insideBottom', offset: -5 }}
                                                                                            />
                                                                                            <YAxis 
                                                                                                label={{ value: chart.yAxisLabel || 'Y', angle: -90, position: 'insideLeft' }}
                                                                                            />
                                                                                            <RechartsTooltip />
                                                                                            <Bar dataKey="value" fill="#8884d8" />
                                                                                        </BarChart>
                                                                                    );
                                                                                } else if (chart.type === 'line' || chart.type === 'function-plot') {
                                                                                    return (
                                                                                        <RechartsLineChart data={chart.data.labels.map((label, i) => ({
                                                                                            name: label,
                                                                                            value: chart.data.values[i] || 0
                                                                                        }))}>
                                                                                            <CartesianGrid strokeDasharray="3 3" />
                                                                                            <XAxis 
                                                                                                dataKey="name" 
                                                                                                label={{ value: chart.xAxisLabel || 'X', position: 'insideBottom', offset: -5 }}
                                                                                            />
                                                                                            <YAxis 
                                                                                                label={{ value: chart.yAxisLabel || 'Y', angle: -90, position: 'insideLeft' }}
                                                                                            />
                                                                                            <RechartsTooltip />
                                                                                            <Legend />
                                                                                            <Line 
                                                                                                type="monotone" 
                                                                                                dataKey="value" 
                                                                                                stroke={chart.type === 'function-plot' ? "#ff7300" : "#8884d8"} 
                                                                                                strokeWidth={chart.type === 'function-plot' ? 3 : 2}
                                                                                                dot={chart.type === 'function-plot' ? false : true}
                                                                                            />
                                                                                        </RechartsLineChart>
                                                                                    );
                                                                                } else if (chart.type === 'scatter') {
                                                                                    return (
                                                                                        <RechartsLineChart data={chart.data.labels.map((label, i) => ({
                                                                                            name: label,
                                                                                            value: chart.data.values[i] || 0
                                                                                        }))}>
                                                                                            <CartesianGrid strokeDasharray="3 3" />
                                                                                            <XAxis 
                                                                                                dataKey="name" 
                                                                                                label={{ value: chart.xAxisLabel || 'X', position: 'insideBottom', offset: -5 }}
                                                                                            />
                                                                                            <YAxis 
                                                                                                label={{ value: chart.yAxisLabel || 'Y', angle: -90, position: 'insideLeft' }}
                                                                                            />
                                                                                            <RechartsTooltip />
                                                                                            <Line 
                                                                                                type="monotone" 
                                                                                                dataKey="value" 
                                                                                                stroke="#82ca9d" 
                                                                                                strokeWidth={0}
                                                                                                dot={{ fill: "#82ca9d", strokeWidth: 2, r: 4 }}
                                                                                            />
                                                                                        </RechartsLineChart>
                                                                                    );
                                                                                } else {
                                                                                    return <div>Unsupported chart type</div>;
                                                                                }
                                                                            })()}
                                                                        </ResponsiveContainer>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {/* Images/Concepts Section */}
                                                {visualContent.images && visualContent.images.length > 0 && (
                                                    <div>
                                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                            <ImageIcon className="h-4 w-4" />
                                                            Visual Concepts
                                                        </h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {visualContent.images.map((image, index) => (
                                                                <div key={index} className="p-4 bg-muted/50 rounded-lg">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                                                            {image.type}
                                                                        </span>
                                                                    </div>
                                                                    <h5 className="font-medium mb-2">{image.title}</h5>
                                                                    <p className="text-sm text-muted-foreground mb-2">{image.description}</p>
                                                                    <p className="text-xs bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-blue-800 dark:text-blue-200">
                                                                        Concept: {image.prompt}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {/* Mathematical Equations Section */}
                                                {visualContent.equations && visualContent.equations.length > 0 && (
                                                    <div>
                                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                            <Calculator className="h-4 w-4" />
                                                            Mathematical Equations
                                                        </h4>
                                                        <div className="space-y-4">
                                                            {visualContent.equations.map((equation, index) => (
                                                                <div key={index} className="p-4 bg-muted/50 rounded-lg">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <h5 className="font-medium">{equation.title}</h5>
                                                                        <Badge variant="outline" className="text-xs">
                                                                            {equation.category}
                                                                        </Badge>
                                                                    </div>
                                                                    
                                                                    <div className="my-4 p-3 bg-background rounded border text-center">
                                                                        <BlockMath math={equation.latex} />
                                                                    </div>
                                                                    
                                                                    <p className="text-sm text-muted-foreground mb-3">{equation.explanation}</p>
                                                                    
                                                                    {equation.variables && equation.variables.length > 0 && (
                                                                        <div>
                                                                            <h6 className="text-sm font-medium mb-2">Variables:</h6>
                                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                                {equation.variables.map((variable, varIndex) => (
                                                                                    <div key={varIndex} className="text-xs bg-background/50 p-2 rounded">
                                                                                        <span className="font-mono font-medium">{variable.symbol}</span>
                                                                                        <span className="mx-2">-</span>
                                                                                        <span>{variable.meaning}</span>
                                                                                        {variable.unit && <span className="text-muted-foreground"> ({variable.unit})</span>}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {/* Key Terms Section */}
                                                {visualContent.keyTerms && visualContent.keyTerms.length > 0 && (
                                                    <div>
                                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                            <BookOpen className="h-4 w-4" />
                                                            Key Terms & Concepts
                                                        </h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {visualContent.keyTerms.map((term, index) => (
                                                                <div key={index} className="p-4 bg-muted/50 rounded-lg">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <h5 className="font-medium">{term.term}</h5>
                                                                        {term.symbol && (
                                                                            <span className="font-mono text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                                                                                {term.symbol}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-sm text-muted-foreground mb-2">{term.definition}</p>
                                                                    {term.formula && (
                                                                        <div className="mt-2 p-2 bg-background rounded text-center">
                                                                            <InlineMath math={term.formula} />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        
                                        {!visualContent && !isGeneratingVisuals && audioUrl && (
                                            <div className="text-center py-8 text-muted-foreground">
                                                No educational content generated. Try asking a more specific academic question.
                                            </div>
                                        )}
                                        
                                        {!visualContent && !isGeneratingVisuals && !audioUrl && (
                                            <div className="text-center py-8 text-muted-foreground">
                                                Educational content will appear here after generating the podcast.
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
