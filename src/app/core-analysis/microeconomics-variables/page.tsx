
import UnderConstructionPage from '@/components/under-construction';

export default function MicroeconomicsVariablesPage() {
  return (
    <UnderConstructionPage 
      title="Microeconomics Variables Analysis"
      description="AI-powered microeconomic analysis is being updated to use our new AI system."
      backLink="/dashboard"
    />
  );
}

const indicators = microIndicators;

export default function MicroeconomicsVariables() {
    const [variable, setVariable] = useState<string>('');
    const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
    const [result, setResult] = useState<AnalyzeMicroVariableOutput | null>(null);
    const [podcast, setPodcast] = useState<GeneratePodcastOutput | null>(null);
    const { toast } = useToast();

    const handleGenerateAnalysis = async () => {
        if (!variable) {
            toast({
                title: "Selection missing",
                description: "Please select a variable.",
                variant: "destructive"
            });
            return;
        }
        setLoadingStatus("Generating analysis...");
        setResult(null);
        setPodcast(null);
        try {
            const apiResult = await analyzeMicroVariable({ variable });
            setResult(apiResult);

            setLoadingStatus("Generating podcast audio...");
            const podcastTitle = `Analysis of ${variable}`;
            const narrationScript = `
Rita: Das, let's dive into a core microeconomic concept. What exactly is ${variable}?
Das: ${apiResult.meaning}
Rita: What are the key factors that determine or influence this?
Das: ${apiResult.determinants}
Rita: How does this play out in the market? What are the implications for consumers and businesses?
Das: ${apiResult.implications}
Rita: Can you give us a clear, real-world example of this that we can all understand?
Das: ${apiResult.realWorldExample}
Rita: And how does government policy interact with all of this?
Das: ${apiResult.policyRelevance}
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
                <h2 className="text-3xl font-bold tracking-tight">Microeconomic Variables Podcast</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Analyze Microeconomic Variable</CardTitle>
                    <CardDescription>Select a variable for a detailed AI-powered podcast dialogue.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Microeconomic Variable</Label>
                            <Select onValueChange={setVariable} value={variable}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a variable" />
                                </SelectTrigger>
                                <SelectContent>
                                    {indicators.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button onClick={handleGenerateAnalysis} disabled={!!loadingStatus || !variable}>
                        {loadingStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {loadingStatus ? loadingStatus : 'Generate Podcast'}
                    </Button>

                    {result && (
                        <div className="pt-4 space-y-4">
                            <Card>
                                <CardHeader>
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <CardTitle>Podcast: Analysis of {variable}</CardTitle>
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
                                            <AccordionTrigger>Meaning</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text={`Das, let's dive into a core microeconomic concept. What exactly is ${variable}?`} />
                                                <PodcastLine speaker="Das" text={result.meaning} />
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="determinants">
                                            <AccordionTrigger>Determinants</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text="What are the key factors that determine or influence this?" />
                                                <PodcastLine speaker="Das" text={result.determinants} />
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="implications">
                                            <AccordionTrigger>Implications</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text="How does this play out in the market? What are the implications for consumers and businesses?" />
                                                <PodcastLine speaker="Das" text={result.implications} />
                                            </AccordionContent>
                                        </AccordionItem>
                                         <AccordionItem value="example">
                                            <AccordionTrigger>Real-World Example</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                 <PodcastLine speaker="Rita" text="Can you give us a clear, real-world example of this that we can all understand?" />
                                                 <PodcastLine speaker="Das" text={result.realWorldExample} />
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="policy">
                                            <AccordionTrigger>Policy Relevance</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text="And how does government policy interact with all of this?" />
                                                <PodcastLine speaker="Das" text={result.policyRelevance} />
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
