
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeConsumptionPatterns, AnalyzeConsumptionPatternsOutput } from '@/ai/flows/analyze-consumption-patterns';
import { generatePodcast, GeneratePodcastOutput } from '@/ai/flows/generate-podcast';
import { countryNameMap } from '@/data/economic-data';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from 'recharts';

const countries = Object.keys(countryNameMap);
const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function ConsumptionPage() {
    const [country, setCountry] = useState<string>('');
    const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
    const [result, setResult] = useState<AnalyzeConsumptionPatternsOutput | null>(null);
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
            const apiResult = await analyzeConsumptionPatterns({ country });
            setResult(apiResult);

            setLoadingStatus("Generating podcast audio...");
            const podcastTitle = `Consumption Patterns in ${country}`;
            const narrationScript = `
Rita: Das, what are the primary factors and historical trends driving consumer spending in ${country}?
Das: ${apiResult.keyDrivers}
Rita: How do households in ${country} typically allocate their budgets, and how has that changed over time?
Das: ${apiResult.spendingHabits.explanation}
Rita: How have credit and debt shaped consumption habits here over the past few years?
Das: ${apiResult.creditAndDebt}
Rita: Based on these historical trends, what future direction do you see for consumption in ${country}?
Das: ${apiResult.futureTrends}
Rita: Finally, what's one piece of advice you'd give to consumers in ${country} based on these trends?
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
    
    const PodcastLine = ({ speaker, text }: { speaker: string, text: string | React.ReactNode }) => {
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
                <h2 className="text-3xl font-bold tracking-tight">Consumption Patterns Podcast</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Analyze Consumption Patterns</CardTitle>
                    <CardDescription>Select a country for a detailed AI-powered podcast on its consumption patterns.</CardDescription>
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
                                        <CardTitle>Podcast: Consumption Patterns in {country}</CardTitle>
                                        {podcast && (
                                            <audio controls autoPlay className="w-full max-w-md">
                                                <source src={podcast.audioUrl} type="audio/wav" />
                                                Your browser does not support the audio element.
                                            </audio>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Accordion type="single" collapsible defaultValue="drivers" className="w-full">
                                        <AccordionItem value="drivers">
                                            <AccordionTrigger>Key Drivers</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text={`Das, what are the primary factors and historical trends driving consumer spending in ${country}?`} />
                                                <PodcastLine speaker="Das" text={result.keyDrivers} />
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="habits">
                                            <AccordionTrigger>Spending Habits</AccordionTrigger>
                                            <AccordionContent className="space-y-4">
                                                <PodcastLine speaker="Rita" text={`How do households in ${country} typically allocate their budgets, and how has that changed over time?`} />
                                                <PodcastLine speaker="Das" text={result.spendingHabits.explanation} />
                                                <div className='pt-4'>
                                                    <h4 className="font-semibold mb-2 text-center">Typical Spending Breakdown (%)</h4>
                                                    <ChartContainer config={{}} className="h-[250px] w-full">
                                                        <PieChart>
                                                            <ChartTooltip content={<ChartTooltipContent />} />
                                                            <Pie data={result.spendingHabits.chartData} dataKey="percentage" nameKey="category" cx="50%" cy="50%" outerRadius={80} label>
                                                                {result.spendingHabits.chartData.map((entry, index) => (
                                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                                ))}
                                                            </Pie>
                                                        </PieChart>
                                                    </ChartContainer>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="credit">
                                            <AccordionTrigger>Role of Credit & Debt</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text="How have credit and debt shaped consumption habits here over the past few years?" />
                                                <PodcastLine speaker="Das" text={result.creditAndDebt} />
                                            </AccordionContent>
                                        </AccordionItem>
                                         <AccordionItem value="trends">
                                            <AccordionTrigger>Future Trends</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text={`Based on these historical trends, what future direction do you see for consumption in ${country}?`} />
                                                <PodcastLine speaker="Das" text={result.futureTrends} />
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="advice">
                                            <AccordionTrigger>Advice for Consumers</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text={`Finally, what's one piece of advice you'd give to consumers in ${country} based on these trends?`} />
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
