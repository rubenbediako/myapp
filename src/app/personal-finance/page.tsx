
import UnderConstructionPage from '@/components/under-construction';

export default function PersonalFinancePage() {
  return (
    <UnderConstructionPage 
      title="Personal Finance Analysis"
      description="AI-powered personal finance analysis is being updated."
      backLink="/dashboard"
    />
  );
}
    const [country, setCountry] = useState<string>('');
    const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
    const [result, setResult] = useState<AnalyzePersonalFinanceOutput | null>(null);
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
            const apiResult = await analyzePersonalFinance({ country });
            setResult(apiResult);
            
            setLoadingStatus("Generating podcast audio...");
            const podcastTitle = `Personal Finance in ${country}`;
            const narrationScript = `
Rita: Das, let's talk about personal finance. To start, how can someone gain a better understanding of their finances in ${country}?
Das: ${apiResult.understandingFinances}
Rita: With that foundation, what is your advice on budgeting effectively given the current economic trends?
Das: ${apiResult.budgetingAdvice}
Rita: Beyond budgeting, how should people think about their revenue streams in light of economic changes?
Das: ${apiResult.revenueStreamsAdvice}
Rita: What's your advice for overall personal financial management, considering the economic environment?
Das: ${apiResult.personalManagementAdvice}
Rita: Finally, based on historical and current economic trends, what's your key piece of financial advice for our listeners in ${country}?
Das: ${apiResult.economicTrendsAdvice}
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
                <h2 className="text-3xl font-bold tracking-tight">Personal Finance Podcast</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Analyze Personal Finance</CardTitle>
                    <CardDescription>Select a country for a detailed AI-powered podcast on personal finance strategies.</CardDescription>
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
                                        <CardTitle>Podcast: Personal Finance in {country}</CardTitle>
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
                                            <AccordionTrigger>Understanding Your Finances</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text={`Das, let's talk about personal finance. To start, how can someone gain a better understanding of their finances in ${country}?`} />
                                                <PodcastLine speaker="Das" text={result.understandingFinances} />
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="budgeting">
                                            <AccordionTrigger>Budgeting Advice</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text="With that foundation, what is your advice on budgeting effectively in the current economic climate?" />
                                                <PodcastLine speaker="Das" text={result.budgetingAdvice} />
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="revenue">
                                            <AccordionTrigger>Revenue Streams</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text="Beyond budgeting, how should people think about their revenue streams?" />
                                                <PodcastLine speaker="Das" text={result.revenueStreamsAdvice} />
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="management">
                                            <AccordionTrigger>Personal Management</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                 <PodcastLine speaker="Rita" text="What's your advice for overall personal financial management, considering the economic environment?" />
                                                <PodcastLine speaker="Das" text={result.personalManagementAdvice} />
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="trends">
                                            <AccordionTrigger>Advice Based on Economic Trends</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text={`Finally, based on historical and current economic trends, what's your key piece of financial advice for our listeners in ${country}?`} />
                                                <PodcastLine speaker="Das" text={result.economicTrendsAdvice} />
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
