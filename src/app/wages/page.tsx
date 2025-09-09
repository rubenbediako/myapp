
import UnderConstructionPage from '@/components/under-construction';

export default function WagesPage() {
  return (
    <UnderConstructionPage 
      title="Wages Landscape Analysis"
      description="AI-powered wages analysis is being updated."
      backLink="/dashboard"
    />
  );
}
import { countryNameMap } from '@/data/economic-data';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const countries = Object.keys(countryNameMap);

export default function WagesPage() {
    const [country, setCountry] = useState<string>('');
    const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
    const [result, setResult] = useState<AnalyzeWagesLandscapeOutput | null>(null);
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
            const apiResult = await analyzeWagesLandscape({ country });
            setResult(apiResult);
            
            setLoadingStatus("Generating podcast audio...");
            const podcastTitle = `Wages Landscape in ${country}`;
            const narrationScript = `
Rita: Das, let's talk about income. How are wages typically distributed across the population in ${country}, and what are the trends in inequality?
Das: ${apiResult.wageDistribution.explanation}
Rita: What has been the role and economic impact of the minimum wage over time in ${country}?
Das: ${apiResult.minimumWage}
Rita: What key historical and current trends in the labor market are influencing wage growth?
Das: ${apiResult.laborMarket}
Rita: Looking ahead, what is the outlook for wages in ${country}, based on these trends?
Das: ${apiResult.futureOutlook}
Rita: For our listeners, what advice can you offer for negotiating a better salary in this market?
Das: ${apiResult.negotiationAdvice}
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
                <h2 className="text-3xl font-bold tracking-tight">Wages & Salary Podcast</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Analyze Wages Landscape</CardTitle>
                    <CardDescription>Select a country for a detailed AI-powered podcast on its wages and salary landscape.</CardDescription>
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
                                        <CardTitle>Podcast: Wages Landscape in {country}</CardTitle>
                                         {podcast && (
                                            <audio controls autoPlay className="w-full max-w-md">
                                                <source src={podcast.audioUrl} type="audio/wav" />
                                                Your browser does not support the audio element.
                                            </audio>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Accordion type="single" collapsible defaultValue="distribution" className="w-full">
                                        <AccordionItem value="distribution">
                                            <AccordionTrigger>Wage Distribution</AccordionTrigger>
                                            <AccordionContent className="space-y-4">
                                                <PodcastLine speaker="Rita" text={`Das, let's talk about income. How are wages typically distributed across the population in ${country}, and what are the trends in inequality?`} />
                                                <PodcastLine speaker="Das" text={result.wageDistribution.explanation} />
                                                <div className='pt-4'>
                                                    <h4 className="font-semibold mb-2 text-center">Annual Income by Percentile (USD)</h4>
                                                    <ChartContainer config={{}} className="h-[250px] w-full">
                                                        <BarChart data={result.wageDistribution.chartData}>
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis dataKey="percentile" />
                                                            <YAxis />
                                                            <ChartTooltip content={<ChartTooltipContent />} />
                                                            <Bar dataKey="income" name="Annual Income" fill="hsl(var(--primary))" />
                                                        </BarChart>
                                                    </ChartContainer>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="minimum-wage">
                                            <AccordionTrigger>Minimum Wage Impact</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text={`What has been the role and economic impact of the minimum wage over time in ${country}?`} />
                                                <PodcastLine speaker="Das" text={result.minimumWage} />
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="labor-market">
                                            <AccordionTrigger>Labor Market Dynamics</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text="What key historical and current trends in the labor market are influencing wage growth?" />
                                                <PodcastLine speaker="Das" text={result.laborMarket} />
                                            </AccordionContent>
                                        </AccordionItem>
                                         <AccordionItem value="outlook">
                                            <AccordionTrigger>Future Outlook</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text={`Looking ahead, what is the outlook for wages in ${country}, based on these trends?`} />
                                                <PodcastLine speaker="Das" text={result.futureOutlook} />
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="advice">
                                            <AccordionTrigger>Salary Negotiation Advice</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text="For our listeners, what advice can you offer for negotiating a better salary in this market?" />
                                                <PodcastLine speaker="Das" text={result.negotiationAdvice} />
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
