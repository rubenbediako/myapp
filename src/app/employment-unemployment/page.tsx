
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeEmploymentLandscape, AnalyzeEmploymentLandscapeOutput } from '@/ai/flows/analyze-employment-landscape';
import { generatePodcast, GeneratePodcastOutput } from '@/ai/flows/generate-podcast';
import { countryNameMap } from '@/data/economic-data';

const countries = Object.keys(countryNameMap);

export default function EmploymentPage() {
    const [country, setCountry] = useState<string>('');
    const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
    const [result, setResult] = useState<AnalyzeEmploymentLandscapeOutput | null>(null);
    const [podcast, setPodcast] = useState<GeneratePodcastOutput | null>(null);
    const { toast } = useToast();

    const handleGenerateAnalysis = async () => {
        if (!country) {
            toast({
                title: "Selection missing",
                description: "Please select a country.",
                variant: "destructive"
            });
            return;
        }
        setLoadingStatus("Generating analysis...");
        setResult(null);
        setPodcast(null);
        try {
            const apiResult = await analyzeEmploymentLandscape({ country });
            setResult(apiResult);

            setLoadingStatus("Generating podcast audio...");
            const podcastTitle = `Employment Landscape in ${country}`;
            const narrationScript = `
Rita: Das, let's start with the basics. What do economists mean by 'employment' and 'unemployment'?
Das: ${apiResult.meaning}
Rita: What are some of the key theories that explain why unemployment exists?
Das: ${apiResult.theories}
Rita: Focusing on ${country}, what are the main historical and current causes of unemployment here?
Das: ${apiResult.causes}
Rita: How has the government in ${country} typically tried to address these issues, and what have the trends in policy effectiveness been?
Das: ${apiResult.policies}
Rita: Finally, based on current trends, what is your key piece of advice for job seekers in ${country} right now?
Das: ${apiResult.advice}
            `.trim();
            
            const resultPodcast = await generatePodcast({
                title: podcastTitle,
                narrationScript: narrationScript,
            });
            setPodcast(resultPodcast);
        } catch (error) {
            console.error(error);
            toast({
                title: "Error generating analysis",
                description: "An error occurred while generating the analysis. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoadingStatus(null);
        }
    };
    
    const PodcastLine = ({ speaker, text }: { speaker: string, text: string }) => {
        const speakerClass = speaker.includes('Rita') ? 'text-speaker-rita' : 'text-speaker-das';
        return (
            <p className="text-muted-foreground">
                <strong className={speakerClass}>{speaker}:</strong> {text}
            </p>
        );
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Employment & Unemployment Podcast</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Analyze Employment Landscape</CardTitle>
                    <CardDescription>Select a country for a detailed AI-powered podcast on its employment and unemployment dynamics.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Country</Label>
                            <Select onValueChange={setCountry} value={country}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a country" />
                                </SelectTrigger>
                                <SelectContent>
                                    {countries.map(code => <SelectItem key={code} value={countryNameMap[code]}>{countryNameMap[code]}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button onClick={handleGenerateAnalysis} disabled={!!loadingStatus || !country}>
                        {loadingStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {loadingStatus ? loadingStatus : 'Generate Podcast'}
                    </Button>

                    {result && (
                        <div className="pt-4 space-y-4">
                            <Card>
                                <CardHeader>
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <CardTitle>Podcast: Employment Landscape in {country}</CardTitle>
                                         {podcast && (
                                            <audio controls autoPlay className="w-full max-w-md">
                                                <source src={podcast.audioUrl} type="audio/wav" />
                                                Your browser does not support the audio element.
                                            </audio>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Accordion type="single" collapsible defaultValue="meaning" className="w-full">
                                        <AccordionItem value="meaning">
                                            <AccordionTrigger>Meaning of Employment & Unemployment</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text="Das, let's start with the basics. What do economists mean by 'employment' and 'unemployment'?" />
                                                <PodcastLine speaker="Das" text={result.meaning} />
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="theories">
                                            <AccordionTrigger>Theories of Unemployment</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text="What are some of the key theories that explain why unemployment exists?" />
                                                <PodcastLine speaker="Das" text={result.theories} />
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="causes">
                                            <AccordionTrigger>Causes of Unemployment in {country}</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text={`Focusing on ${country}, what are the main historical and current causes of unemployment here?`} />
                                                <PodcastLine speaker="Das" text={result.causes} />
                                            </AccordionContent>
                                        </AccordionItem>
                                         <AccordionItem value="policies">
                                            <AccordionTrigger>Government Policies</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text={`How has the government in ${country} typically tried to address these issues, and what have the trends in policy effectiveness been?`} />
                                                <PodcastLine speaker="Das" text={result.policies} />
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="advice">
                                            <AccordionTrigger>Advice for Job Seekers</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text={`Finally, based on current trends, what is your key piece of advice for job seekers in ${country} right now?`} />
                                                <PodcastLine speaker="Das" text={result.advice} />
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
