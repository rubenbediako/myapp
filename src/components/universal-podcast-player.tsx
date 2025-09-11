'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Play, 
  Square, 
  Download, 
  Volume2, 
  Loader2, 
  Calculator, 
  BarChart3, 
  TrendingUp, 
  LineChart,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePodcastAudio } from '@/hooks/use-podcast-audio';
import { InlineMath, BlockMath } from 'react-katex';
import { BarChart, Bar, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { universalPodcastService, UniversalPodcastOptions, PodcastResponse } from '@/lib/universal-podcast';
import { EnhancedPodcastRenderer } from '@/components/enhanced-podcast-renderer-new';

interface UniversalPodcastPlayerProps {
  title: string;
  content: string;
  options?: UniversalPodcastOptions;
  autoGenerate?: boolean;
  className?: string;
}

export function UniversalPodcastPlayer({ 
  title, 
  content, 
  options = {}, 
  autoGenerate = false,
  className = ""
}: UniversalPodcastPlayerProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<PodcastResponse | null>(null);
  const [usePremiumAudio, setUsePremiumAudio] = useState(options.audioPremium ?? true);
  const [currentSpeakingIndex, setCurrentSpeakingIndex] = useState<number>(-1);
  const [showVisualContent, setShowVisualContent] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const [speakingTimer, setSpeakingTimer] = useState<NodeJS.Timeout | null>(null);

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
    downloadAudio
  } = usePodcastAudio({
    onComplete: () => {
      toast({
        title: "Podcast Ready!",
        description: `Your ${options.contentType} podcast is ready with enhanced content.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Podcast Generation Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    if (autoGenerate && content && !result) {
      generatePodcast();
    }
  }, [autoGenerate, content]);

  // Line-level navigation for automatic scrolling during playback
  useEffect(() => {
    if (isPlayingAudio && currentSegment !== -1 && result?.podcastScript) {
      setCurrentSpeakingIndex(currentSegment);
      
      // Auto-scroll to current line if enabled
      if (autoScroll) {
        const currentElement = document.getElementById(`podcast-line-${currentSegment}`);
        if (currentElement) {
          currentElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }
    } else {
      // Clear highlighting when not playing
      if (speakingTimer) {
        clearInterval(speakingTimer);
        setSpeakingTimer(null);
      }
      setCurrentSpeakingIndex(-1);
    }
  }, [isPlayingAudio, currentSegment, result, autoScroll]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (speakingTimer) {
        clearInterval(speakingTimer);
      }
    };
  }, [speakingTimer]);

  const generatePodcast = async () => {
    if (!content.trim()) return;

    setIsGenerating(true);
    try {
      const podcastResult = await universalPodcastService.generatePodcast(content, {
        ...options,
        audioPremium: usePremiumAudio
      });
      
      setResult(podcastResult);
      
      // Generate audio automatically
      if (podcastResult.podcastScript) {
        await generateAudio(podcastResult.podcastScript, content, usePremiumAudio);
      }
    } catch (error) {
      console.error('Error generating podcast:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate the podcast. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'course':
      case 'lesson':
        return <BookOpen className="h-5 w-5" />;
      case 'dashboard':
        return <BarChart3 className="h-5 w-5" />;
      case 'personal-finance':
      case 'investment':
        return <TrendingUp className="h-5 w-5" />;
      case 'economics':
        return <Calculator className="h-5 w-5" />;
      default:
        return <Volume2 className="h-5 w-5" />;
    }
  };

  const getContentTypeDescription = (type: string) => {
    switch (type) {
      case 'course':
      case 'lesson':
        return 'Educational content with mathematical concepts and real-world applications';
      case 'dashboard':
        return 'Economic data analysis with statistical insights and trends';
      case 'personal-finance':
        return 'Personalized financial advice with calculations and planning strategies';
      case 'investment':
        return 'Investment analysis with market insights and portfolio guidance';
      case 'economics':
        return 'Economic theory and analysis with mathematical models';
      default:
        return 'AI-powered audio content with enhanced educational features';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getContentTypeIcon(options.contentType)}
            {title} - AI Podcast
          </CardTitle>
          <CardDescription>
            {getContentTypeDescription(options.contentType)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Premium Audio Toggle */}
          {!result && (
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id={`premium-audio-${options.contentType}`}
                  checked={usePremiumAudio}
                  onCheckedChange={(checked) => setUsePremiumAudio(checked as boolean)}
                />
                <label 
                  htmlFor={`premium-audio-${options.contentType}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Use Premium Voice (ElevenLabs)
                </label>
                <Badge variant="outline" className="text-xs">
                  Enhanced
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
                      <p className="font-medium">Premium Audio Features</p>
                      <p className="text-xs">High-quality AI voices with natural speech patterns</p>
                      <p className="text-xs">Enhanced educational content generation</p>
                      <p className="text-xs">Mathematical and statistical analysis</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          
          {/* Generate Button */}
          {!result && (
            <Button 
              onClick={generatePodcast}
              disabled={!content.trim() || isGenerating || isGeneratingAudio}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating AI Podcast...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Generate AI Podcast
                </>
              )}
            </Button>
          )}

          {/* Audio Controls */}
          {(audioUrl || isGeneratingAudio) && (
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium mb-1">AI Podcast</div>
                <div className="text-sm text-muted-foreground">
                  {isGeneratingAudio ? 'Generating audio...' : 
                   isPlayingAudio ? `Playing segment ${currentSegment + 1}` : 'Ready to play'}
                </div>
                {audioProgress > 0 && (
                  <Progress value={audioProgress} className="mt-2" />
                )}
              </div>
              <div className="flex gap-2">
                {audioUrl && (
                  <>
                    <Button
                      onClick={() => isPlayingAudio ? stopAudio() : (result?.podcastScript && playAudio(result.podcastScript))}
                      disabled={isGeneratingAudio}
                      size="sm"
                    >
                      {isPlayingAudio ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button onClick={() => result?.podcastScript && downloadAudio(result.podcastScript)} size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Content Display */}
      {(result || visualContent) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Enhanced Educational Content
              {isGeneratingVisuals && <Loader2 className="h-4 w-4 animate-spin" />}
            </CardTitle>
            <CardDescription>
              Interactive content with mathematical concepts, charts, and key insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enhanced Navigation Controls */}
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="auto-scroll" 
                  checked={autoScroll}
                  onCheckedChange={setAutoScroll}
                />
                <label htmlFor="auto-scroll" className="text-sm font-medium">
                  Auto-scroll during playback
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="show-visuals" 
                  checked={showVisualContent}
                  onCheckedChange={setShowVisualContent}
                />
                <label htmlFor="show-visuals" className="text-sm font-medium">
                  Show visual content
                </label>
              </div>
            </div>

            {/* Podcast Script with Enhanced Navigation */}
            {result?.podcastScript && (
              <div className="space-y-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  Podcast Transcript
                  {isPlayingAudio && (
                    <Badge variant="outline" className="ml-auto">
                      Playing: {currentSpeakingIndex + 1} / {result.podcastScript.length}
                    </Badge>
                  )}
                </h4>
                <div className="space-y-3 bg-muted/30 p-4 rounded-lg max-h-96 overflow-y-auto scroll-smooth">
                  {result.podcastScript.map((line, index) => (
                    <div
                      key={index}
                      id={`podcast-line-${index}`}
                      className={`p-4 rounded-lg transition-all duration-500 ${
                        line.speaker === 'Speaker1' 
                          ? 'bg-blue-50 border-l-4 border-blue-500' 
                          : 'bg-green-50 border-l-4 border-green-500'
                      } ${
                        currentSpeakingIndex === index && isPlayingAudio 
                          ? 'ring-2 ring-primary shadow-lg transform scale-102' 
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant={line.speaker === 'Speaker1' ? 'default' : 'secondary'}
                          className="font-medium"
                        >
                          {line.speaker === 'Speaker1' ? '🎤 Host (Rita)' : '📊 Expert (Das)'}
                        </Badge>
                        {isPlayingAudio && currentSpeakingIndex === index && (
                          <Badge variant="outline" className="animate-pulse bg-primary/10">
                            🔊 Currently Speaking
                          </Badge>
                        )}
                      </div>
                      <div 
                        className={`leading-relaxed ${
                          currentSpeakingIndex === index && isPlayingAudio 
                            ? 'font-medium text-primary' 
                            : ''
                        }`}
                      >
                        <EnhancedPodcastRenderer 
                          text={line.line} 
                          speaker={line.speaker}
                          isCurrentSpeaking={isPlayingAudio && currentSpeakingIndex === index}
                          currentWordIndex={0}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Visual Content from either result or generated visuals */}
            {showVisualContent && (result?.visualContent || visualContent) && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="font-semibold">📊 Interactive Content & Data Visualizations</h3>
                  <Badge variant="secondary">Real Economic Data</Badge>
                </div>

                {/* Mathematical Equations */}
                {(result?.visualContent?.equations || visualContent?.equations) && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Calculator className="h-4 w-4" />
                      Mathematical Concepts & Formulas
                    </h4>
                    <div className="grid gap-4">
                      {(result?.visualContent?.equations || visualContent?.equations || []).map((equation, index) => (
                        <div key={index} className="p-4 bg-muted/50 rounded-lg border-l-4 border-blue-500">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-medium">{equation.title}</h5>
                            <Badge variant="outline">{equation.category}</Badge>
                          </div>
                          <div className="my-4 p-4 bg-background rounded border text-center shadow-sm">
                            <BlockMath math={equation.latex} />
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{equation.explanation}</p>
                          {equation.variables && equation.variables.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <h6 className="font-medium text-sm col-span-full">Variable Definitions:</h6>
                              {equation.variables.map((variable, varIndex) => (
                                <div key={varIndex} className="text-sm bg-background/70 p-3 rounded border">
                                  <span className="font-mono font-bold text-primary">{variable.symbol}</span>
                                  <span className="mx-2">—</span>
                                  <span>{variable.meaning}</span>
                                  {variable.unit && <span className="text-muted-foreground block text-xs mt-1">Unit: {variable.unit}</span>}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Charts and Graphs */}
                {(result?.visualContent?.charts || visualContent?.charts) && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <LineChart className="h-4 w-4" />
                      Data Visualizations
                    </h4>
                    <div className="space-y-6">
                      {(result?.visualContent?.charts || visualContent?.charts || []).map((chart, index) => (
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

                {/* Key Statistics */}
                {(result?.visualContent?.statistics || visualContent?.statistics) && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Key Statistics
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(result?.visualContent?.statistics || visualContent?.statistics || []).map((stat, index) => (
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

                {/* Key Terms */}
                {(result?.visualContent?.keyTerms || visualContent?.keyTerms) && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Key Terms & Concepts
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(result?.visualContent?.keyTerms || visualContent?.keyTerms || []).map((term, index) => (
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
