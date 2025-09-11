'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Play, 
  Square, 
  Download, 
  Volume2, 
  Loader2, 
  Mic, 
  Users,
  FileText,
  Headphones,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePodcastAudio } from '@/hooks/use-podcast-audio';
import { universalPodcastService } from '@/lib/universal-podcast';

interface PodcastLine {
  speaker: "Speaker1" | "Speaker2";
  line: string;
}

export default function PodcastCreatorPage() {
  const { toast } = useToast();
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [podcastScript, setPodcastScript] = useState<PodcastLine[] | null>(null);
  const [currentSpeaking, setCurrentSpeaking] = useState<number>(-1);

  // Audio functionality
  const {
    isGenerating: isGeneratingAudio,
    isPlaying: isPlayingAudio,
    currentSegment,
    audioUrl,
    progress: audioProgress,
    generateAudio,
    playAudio,
    stopAudio,
    downloadAudio
  } = usePodcastAudio({
    onComplete: () => {
      toast({
        title: "Audio Ready!",
        description: "Your podcast audio is ready to play and download.",
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

  const generatePodcast = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic for your podcast.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const content = `Topic: ${topic}\n\nDescription: ${description || 'Generate an engaging educational podcast about this topic with detailed analysis and insights.'}`;
      
      const result = await universalPodcastService.generatePodcast(content, {
        contentType: 'general',
        title: topic,
        description: description,
        includeMath: true,
        includeStatistics: true,
        audioPremium: true
      });

      setPodcastScript(result.podcastScript);
      
      // Auto-generate audio
      if (result.podcastScript) {
        await generateAudio(result.podcastScript, topic, true);
      }

      toast({
        title: "Podcast Generated!",
        description: `Created ${result.podcastScript.length} exchanges for "${topic}"`,
      });
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

  const resetPodcast = () => {
    setPodcastScript(null);
    setTopic('');
    setDescription('');
    stopAudio();
  };

  // Update current speaking segment
  React.useEffect(() => {
    setCurrentSpeaking(currentSegment);
  }, [currentSegment]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Mic className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Podcast Creator</h1>
                <p className="text-sm text-gray-600">AI-powered podcast generation with premium voices</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50">
              <Sparkles className="h-3 w-3 mr-1" />
              Premium AI
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Podcast Details
                </CardTitle>
                <CardDescription>
                  Create your AI-powered educational podcast with Claude AI and ElevenLabs voices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic *</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., Understanding Cryptocurrency, Climate Change Economics, AI in Healthcare"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={isGenerating}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide additional context or specific aspects you'd like the podcast to cover..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isGenerating}
                    className="min-h-[100px]"
                  />
                </div>

                <Separator />

                <div className="flex gap-3">
                  <Button 
                    onClick={generatePodcast}
                    disabled={!topic.trim() || isGenerating}
                    className="flex-1"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Podcast
                      </>
                    )}
                  </Button>
                  {podcastScript && (
                    <Button variant="outline" onClick={resetPodcast}>
                      New Podcast
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Features Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Podcast Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Mic className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Two AI Hosts</p>
                    <p className="text-sm text-gray-600">Rita (Host) and Das (Expert) with natural conversations</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Volume2 className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Premium Audio</p>
                    <p className="text-sm text-gray-600">ElevenLabs high-quality text-to-speech voices</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FileText className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Educational Content</p>
                    <p className="text-sm text-gray-600">In-depth analysis with real data and statistics</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            {/* Audio Controls */}
            {(audioUrl || isGeneratingAudio) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Headphones className="h-5 w-5" />
                    Audio Player
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="font-medium mb-1">
                        {isGeneratingAudio ? 'Generating Audio...' : 
                         isPlayingAudio ? `Playing: Segment ${currentSegment + 1}` : 'Ready to Play'}
                      </div>
                      {audioProgress > 0 && (
                        <Progress value={audioProgress} className="h-2" />
                      )}
                    </div>
                    <div className="flex gap-2">
                      {audioUrl && (
                        <>
                          <Button
                            onClick={() => isPlayingAudio ? stopAudio() : playAudio(podcastScript!)}
                            disabled={isGeneratingAudio}
                            size="sm"
                          >
                            {isPlayingAudio ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button 
                            onClick={() => downloadAudio(podcastScript!)} 
                            size="sm" 
                            variant="outline"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Podcast Script */}
            {podcastScript && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Podcast Transcript
                    {isPlayingAudio && (
                      <Badge variant="outline" className="ml-auto">
                        Playing: {currentSpeaking + 1} / {podcastScript.length}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    AI-generated conversation between Rita (Host) and Das (Expert)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {podcastScript.map((line, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg transition-all duration-300 ${
                          line.speaker === 'Speaker1' 
                            ? 'bg-blue-50 border-l-4 border-blue-500' 
                            : 'bg-green-50 border-l-4 border-green-500'
                        } ${
                          currentSpeaking === index && isPlayingAudio 
                            ? 'ring-2 ring-primary shadow-lg' 
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
                          {currentSpeaking === index && isPlayingAudio && (
                            <Badge variant="outline" className="animate-pulse">
                              🔊 Speaking
                            </Badge>
                          )}
                        </div>
                        <p className="leading-relaxed text-gray-800">{line.line}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {!podcastScript && !isGenerating && (
              <Card className="border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <Mic className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Create</h3>
                  <p className="text-gray-600 mb-4">
                    Enter a topic above to generate your AI-powered podcast with premium voices
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Claude AI</span>
                    <ArrowRight className="h-3 w-3" />
                    <span>Script Generation</span>
                    <ArrowRight className="h-3 w-3" />
                    <span>ElevenLabs Audio</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
