
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeCapitalMarket, AnalyzeCapitalMarketOutput } from '@/ai/flows/analyze-capital-market';
import { generatePodcast, GeneratePodcastOutput } from '@/ai/flows/generate-podcast';
import { countryNameMap } from '@/data/economic-data';

const countries = Object.keys(countryNameMap);

export default function CapitalMarketPage() {
    const [country, setCountry] = useState<string>('');
    const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
    const [result, setResult] = useState<AnalyzeCapitalMarketOutput | null>(null);
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
            const apiResult = await analyzeCapitalMarket({ country });
            setResult(apiResult);
            
            setLoadingStatus("Generating podcast audio...");
            const podcastTitle = `Capital Market in ${country}`;
            const narrationScript = `
Rita: Das, let's break it down. What exactly is the capital market and why is it important for ${country}'s economy?
Das: ${apiResult.understanding}
Rita: How can an ordinary person or an institution start investing in the capital market here?
Das: ${apiResult.investing}
Rita: How has the stock market in ${country} been performing? What are the key historical trends and what's driving them?
Das: ${apiResult.performance}
Rita: Let's talk about the other side of the market. How are bond prices determined, and what is their relationship with interest rates?
Das: ${apiResult.bondPrices}
Rita: This is the million-dollar question for many: is there a 'right' time to invest, and what factors should people consider based on current trends?
Das: ${apiResult.whenToInvest}
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
                <h2 className="text-3xl font-bold tracking-tight">Capital Market Podcast</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Analyze Capital Market</CardTitle>
                    <CardDescription>Select a country for a detailed AI-powered podcast on its capital market.</CardDescription>
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
                                        <CardTitle>Podcast: Capital Market in {country}</CardTitle>
                                         {podcast && (
                                            <audio controls autoPlay className="w-full max-w-md">
                                                <source src={podcast.audioUrl} type="audio/wav" />
                                                Your browser does not support the audio element.
                                            </audio>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Accordion type="single" collapsible defaultValue="understanding" className="w-full">
                                        <AccordionItem value="understanding">
                                            <AccordionTrigger>Understanding Capital Markets</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text={`Das, let's break it down. What exactly is the capital market and why is it important for ${country}'s economy?`} />
                                                <PodcastLine speaker="Das" text={result.understanding} />
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="investing">
                                            <AccordionTrigger>How to Invest</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text="How can an ordinary person or an institution start investing in the capital market here?" />
                                                <PodcastLine speaker="Das" text={result.investing} />
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="performance">
                                            <AccordionTrigger>Market Performance & Trends</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text={`How has the stock market in ${country} been performing? What are the key historical trends and what's driving them?`} />
                                                <PodcastLine speaker="Das" text={result.performance} />
                                            </AccordionContent>
                                        </AccordionItem>
                                         <AccordionItem value="bonds">
                                            <AccordionTrigger>Bond Prices</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text="Let's talk about the other side of the market. How are bond prices determined, and what is their relationship with interest rates?" />
                                                <PodcastLine speaker="Das" text={result.bondPrices} />
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="when-to-invest">
                                            <AccordionTrigger>When to Invest</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text="This is the million-dollar question for many: is there a 'right' time to invest, and what factors should people consider based on current trends?" />
                                                <PodcastLine speaker="Das" text={result.whenToInvest} />
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
