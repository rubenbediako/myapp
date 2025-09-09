
import UnderConstructionPage from '@/components/under-construction';

export default function SavingsPage() {
  return (
    <UnderConstructionPage 
      title="Savings Landscape Analysis"
      description="AI-powered savings analysis is being updated."
      backLink="/dashboard"
    />
  );
}
import { countryNameMap } from '@/data/economic-data';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const countries = Object.keys(countryNameMap);

export default function SavingsPage() {
    const [country, setCountry] = useState<string>('');
    const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
    const [result, setResult] = useState<AnalyzeSavingsLandscapeOutput | null>(null);
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
            const apiResult = await analyzeSavingsLandscape({ country });
            setResult(apiResult);
            
            setLoadingStatus("Generating podcast audio...");
            const podcastTitle = `Savings Landscape in ${country}`;
            const narrationScript = `
Rita: Das, how would you describe the general attitude towards saving money in ${country}, and have you seen that change recently?
Das: ${apiResult.savingsCulture}
Rita: What are the most popular ways for people to save and invest their money here, and how has their popularity trended?
Das: ${apiResult.commonInstruments.explanation}
Rita: How have government policies and incentives influenced savings habits over time in ${country}?
Das: ${apiResult.governmentPolicy}
Rita: Based on these trends, what does the future hold for savings in ${country}?
Das: ${apiResult.futureOutlook}
Rita: What's your number one piece of savings advice for our listeners in ${country}, given the current trends?
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
                <h2 className="text-3xl font-bold tracking-tight">Savings Landscape Podcast</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Analyze Savings Landscape</CardTitle>
                    <CardDescription>Select a country for a detailed AI-powered podcast on its savings landscape.</CardDescription>
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
                                        <CardTitle>Podcast: Savings Landscape in {country}</CardTitle>
                                         {podcast && (
                                            <audio controls autoPlay className="w-full max-w-md">
                                                <source src={podcast.audioUrl} type="audio/wav" />
                                                Your browser does not support the audio element.
                                            </audio>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Accordion type="single" collapsible defaultValue="culture" className="w-full">
                                        <AccordionItem value="culture">
                                            <AccordionTrigger>Savings Culture</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text={`Das, how would you describe the general attitude towards saving money in ${country}, and have you seen that change recently?`} />
                                                <PodcastLine speaker="Das" text={result.savingsCulture} />
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="instruments">
                                            <AccordionTrigger>Common Savings Instruments</AccordionTrigger>
                                            <AccordionContent className="space-y-4">
                                                <PodcastLine speaker="Rita" text="What are the most popular ways for people to save and invest their money here, and how has their popularity trended?" />
                                                <PodcastLine speaker="Das" text={result.commonInstruments.explanation} />
                                                <div className='pt-4'>
                                                    <h4 className="font-semibold mb-2 text-center">Popularity of Savings Instruments</h4>
                                                    <ChartContainer config={{}} className="h-[250px] w-full">
                                                        <BarChart data={result.commonInstruments.chartData} layout="vertical" margin={{ left: 30 }}>
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis type="number" />
                                                            <YAxis type="category" dataKey="name" width={100} />
                                                            <ChartTooltip content={<ChartTooltipContent />} />
                                                            <Bar dataKey="popularity" name="Popularity Score" fill="hsl(var(--primary))" />
                                                        </BarChart>
                                                    </ChartContainer>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="policy">
                                            <AccordionTrigger>Government Policy</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text={`How have government policies and incentives influenced savings habits over time in ${country}?`} />
                                                <PodcastLine speaker="Das" text={result.governmentPolicy} />
                                            </AccordionContent>
                                        </AccordionItem>
                                         <AccordionItem value="outlook">
                                            <AccordionTrigger>Future Outlook</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text={`Based on these trends, what does the future hold for savings in ${country}?`} />
                                                <PodcastLine speaker="Das" text={result.futureOutlook} />
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="advice">
                                            <AccordionTrigger>Advice for Individuals</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text={`What's your number one piece of savings advice for our listeners in ${country}, given the current trends?`} />
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
