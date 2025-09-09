
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mic, Wand2, Square, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { askDasAi, AskDasAiOutput } from '@/ai/flows/ask-das-ai';
import { generatePodcast, GeneratePodcastOutput } from '@/ai/flows/generate-podcast';
import { generateImage, GenerateImageOutput } from '@/ai/flows/generate-image';

export default function AskDasAiPage() {
    const [query, setQuery] = useState('');
    const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
    const [result, setResult] = useState<AskDasAiOutput | null>(null);
    const [podcast, setPodcast] = useState<GeneratePodcastOutput | null>(null);
    const [imageResult, setImageResult] = useState<GenerateImageOutput | null>(null);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const { toast } = useToast();
    
    // State for voice input
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = 'en-US';

                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    setQuery(transcript);
                    setIsRecording(false);
                };

                recognition.onerror = (event) => {
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
            const apiResult = await askDasAi({ query });
            setResult(apiResult);
            
            setLoadingStatus("Generating podcast...");
            const podcastTitle = `Das Answers: ${query.substring(0, 30)}...`;
            const narrationScript = apiResult.podcastScript.map(line => `${line.speaker}: ${line.line}`).join('\n');
            const resultPodcast = await generatePodcast({
                title: podcastTitle,
                narrationScript,
            });
            setPodcast(resultPodcast);

        } catch (error) {
            console.error(error);
            toast({
                title: "Error getting answer",
                description: "An error occurred while generating the answer. Please try again.",
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
            const imagePrompt = `Create a professional, high-quality visual representation of the economic or business concept: "${query}". The style should be modern, clean, and suitable for a financial news publication.`;
            const result = await generateImage({ prompt: imagePrompt });
            setImageResult(result);
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
        return speaker === "Speaker1" ? "text-speaker-rita" : "text-speaker-das";
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Ask Das-AI</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Ask a Question</CardTitle>
                    <CardDescription>Have a question about economics, business, finance, or entrepreneurship? Ask Das, and get a custom podcast episode and visual in response.</CardDescription>
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
                    <Button onClick={handleAskQuestion} disabled={!!loadingStatus || !query}>
                        {loadingStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                        {loadingStatus ? loadingStatus : 'Ask Das & Generate Podcast'}
                    </Button>

                    {result && (
                        <div className="pt-4 space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <Card>
                                    <CardHeader>
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div className="flex-1">
                                                <CardTitle>Your Custom Podcast</CardTitle>
                                                <CardDescription className="mt-2">The dialogue between Rita and Das.</CardDescription>
                                            </div>
                                            {podcast?.audioUrl && (
                                                <audio controls autoPlay src={podcast.audioUrl} className="w-full sm:w-auto flex-1">
                                                    Your browser does not support the audio element.
                                                </audio>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="p-4 bg-muted/50 rounded-md max-h-96 overflow-y-auto space-y-2">
                                            {result.podcastScript.map((line, index) => (
                                                <p key={index}>
                                                    <strong className={getSpeakerClass(line.speaker)}>
                                                        {getSpeakerName(line.speaker)}:
                                                    </strong>
                                                    {` ${line.line}`}
                                                </p>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                                 <Card>
                                    <CardHeader>
                                        <CardTitle>Generated Visual</CardTitle>
                                        <CardDescription>An AI-generated image related to your query.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex flex-col items-center justify-center gap-4">
                                         {imageResult?.imageUrl ? (
                                            <Image 
                                                src={imageResult.imageUrl}
                                                alt="Generated visual for the query"
                                                width={500}
                                                height={500}
                                                className="rounded-lg object-cover aspect-square"
                                            />
                                         ) : (
                                            <div className="w-full aspect-square bg-muted rounded-lg flex flex-col items-center justify-center text-center p-4">
                                                 {isGeneratingImage ? (
                                                    <>
                                                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                                        <p className="mt-2 text-muted-foreground">Generating your visual...</p>
                                                    </>
                                                 ) : (
                                                    <>
                                                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                                                        <p className="mt-2 text-muted-foreground">Click the button below to generate a visual for your topic.</p>
                                                    </>
                                                 )}
                                            </div>
                                         )}
                                        <Button onClick={handleGenerateImage} disabled={isGeneratingImage || !!loadingStatus} className="w-full">
                                            {isGeneratingImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />}
                                            {isGeneratingImage ? 'Generating...' : (imageResult ? 'Regenerate Visual' : 'Generate Visual')}
                                        </Button>
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
