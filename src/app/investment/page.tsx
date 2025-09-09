
import UnderConstructionPage from '@/components/under-construction';

export default function InvestmentPage() {
  return (
    <UnderConstructionPage 
      title="Investment Landscape Analysis"
      description="AI-powered investment analysis is being updated."
      backLink="/dashboard"
    />
  );
}
import { countryNameMap } from '@/data/economic-data';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const countries = Object.keys(countryNameMap);

export default function InvestmentPage() {
    const [country, setCountry] = useState<string>('');
    const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
    const [result, setResult] = useState<AnalyzeInvestmentLandscapeOutput | null>(null);
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
            const apiResult = await analyzeInvestmentLandscape({ country });
            setResult(apiResult);
            
            setLoadingStatus("Generating podcast audio...");
            const podcastTitle = `Investment Landscape: ${country}`;
            const narrationScript = `
Rita: Das, let's start with a foundational concept. What's a key investment theory we should understand when looking at ${country}?
Das: ${apiResult.investmentTheory.explanation}
Rita: How should our listeners in ${country} think about investing across their lifetime, say from their 20s to their 60s?
Das: ${apiResult.lifetimeInvestment}
Rita: Where do you see the most promising investment opportunities and trends in ${country} right now?
Das: ${apiResult.opportunities}
Rita: Looking ahead, what are your predictions for the investment market in ${country}, based on historical trends?
Das: ${apiResult.predictions}
Rita: Finally, what's the most important piece of advice or intuition you can share with an individual investor in ${country}, considering the current trends?
Das: ${apiResult.intuition}
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
                <h2 className="text-3xl font-bold tracking-tight">Investment Landscape Podcast</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Analyze Investment Landscape</CardTitle>
                    <CardDescription>Select a country for a detailed AI-powered podcast on its investment landscape.</CardDescription>
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
                                        <CardTitle>Podcast: Investment Landscape in {country}</CardTitle>
                                         {podcast && (
                                            <audio controls autoPlay className="w-full max-w-md">
                                                <source src={podcast.audioUrl} type="audio/wav" />
                                                Your browser does not support the audio element.
                                            </audio>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Accordion type="single" collapsible defaultValue="theory" className="w-full">
                                        <AccordionItem value="theory">
                                            <AccordionTrigger>Investment Theory</AccordionTrigger>
                                            <AccordionContent className="space-y-4">
                                                <PodcastLine speaker="Rita" text={`Das, let's start with a foundational concept. What's a key investment theory we should understand when looking at ${country}?`} />
                                                <PodcastLine speaker="Das" text={result.investmentTheory.explanation} />
                                                <div className='pt-4'>
                                                    <h4 className="font-semibold mb-2 text-center">Illustrative Risk/Reward Spectrum</h4>
                                                    <ChartContainer config={{}} className="h-[250px] w-full">
                                                        <BarChart data={result.investmentTheory.chartData} layout="vertical" margin={{ left: 20 }}>
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis type="number" />
                                                            <YAxis type="category" dataKey="name" width={80} />
                                                            <ChartTooltip content={<ChartTooltipContent />} />
                                                            <Bar dataKey="value" name="Risk/Reward Score" fill="hsl(var(--primary))" />
                                                        </BarChart>
                                                    </ChartContainer>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="lifetime">
                                            <AccordionTrigger>Lifetime Investment Strategy</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text={`How should our listeners in ${country} think about investing across their lifetime, say from their 20s to their 60s?`} />
                                                <PodcastLine speaker="Das" text={result.lifetimeInvestment} />
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="opportunities">
                                            <AccordionTrigger>Investment Opportunities</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text={`Where do you see the most promising investment opportunities and trends in ${country} right now?`} />
                                                <PodcastLine speaker="Das" text={result.opportunities} />
                                            </AccordionContent>
                                        </AccordionItem>
                                         <AccordionItem value="predictions">
                                            <AccordionTrigger>Predictions</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text={`Looking ahead, what are your predictions for the investment market in ${country}, based on historical trends?`} />
                                                <PodcastLine speaker="Das" text={result.predictions} />
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="intuition">
                                            <AccordionTrigger>Intuition for Individuals</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text={`Finally, what's the most important piece of advice or intuition you can share with an individual investor in ${country}, considering the current trends?`} />
                                                <PodcastLine speaker="Das" text={result.intuition} />
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
