
import UnderConstructionPage from '@/components/under-construction';

export default function MacroeconomicsVariablesPage() {
  return (
    <UnderConstructionPage 
      title="Macroeconomics Variables Analysis"
      description="AI-powered macroeconomic analysis is being updated to use our new AI system."
      backLink="/dashboard"
    />
  );
}

const countries = Object.keys(countryNameMap);
const indicators = allIndicators;

export default function MacroeconomicsVariables() {
    const [variable, setVariable] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
    const [result, setResult] = useState<AnalyzeMacroVariableOutput | null>(null);
    const [podcast, setPodcast] = useState<GeneratePodcastOutput | null>(null);
    const { toast } = useToast();

    const handleGenerateAnalysis = async () => {
        if (!variable || !country) {
            toast({
                title: "Selection missing",
                description: "Please select a variable and a country.",
                variant: "destructive"
            });
            return;
        }
        setLoadingStatus("Generating analysis...");
        setResult(null);
        setPodcast(null);
        try {
            const apiResult = await analyzeMacroVariable({ variable, country });
            setResult(apiResult);

            setLoadingStatus("Generating podcast audio...");
            const podcastTitle = `Analysis of ${variable} in ${country}`;
            const narrationScript = `
Rita: Das, let's start with the basics. What exactly is ${variable}?
Das: ${apiResult.meaning}
Rita: How do economists and governments actually measure that?
Das: ${apiResult.measurement}
Rita: Could you break down the chain reactions? What influences ${variable} and what does it affect downstream? Discuss the historical trends.
Das: ${apiResult.backwardEffects}
Das: And on the other side?
Das: ${apiResult.forwardEffects}
Rita: So who is in the driver's seat? How is ${variable} controlled, and how have those methods evolved over time?
Das: ${apiResult.control}
Rita: Let's make this real for our listeners. How does the trend of ${variable} impact daily life, government decisions, and businesses?
Das: For Your Life: ${apiResult.intuition.life}. For Government: ${apiResult.intuition.government}. For Firms: ${apiResult.intuition.firms}
Rita: Finally, the big question. Looking at ${country}'s historical trend for ${variable}, what's your prediction for it in the near future?
Das: ${apiResult.prediction}
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
                <h2 className="text-3xl font-bold tracking-tight">Macroeconomic Variables Podcast</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Analyze Macroeconomic Variable</CardTitle>
                    <CardDescription>Select a variable and a country for a detailed AI-powered podcast dialogue.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Macroeconomic Variable</Label>
                            <Select onValueChange={setVariable} value={variable}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a variable" />
                                </SelectTrigger>
                                <SelectContent>
                                    {indicators.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
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
                    <Button onClick={handleGenerateAnalysis} disabled={!!loadingStatus || !variable || !country}>
                        {loadingStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {loadingStatus ? loadingStatus : 'Generate Podcast'}
                    </Button>

                    {result && (
                        <div className="pt-4 space-y-4">
                            <Card>
                                <CardHeader>
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <CardTitle>Podcast: Analysis of {variable} in {country}</CardTitle>
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
                                                <PodcastLine speaker="Rita" text={`Das, let's start with the basics. What exactly is ${variable}?`} />
                                                <PodcastLine speaker="Das" text={result.meaning} />
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="measurement">
                                            <AccordionTrigger>Measurement</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text="How do economists and governments actually measure that?" />
                                                <PodcastLine speaker="Das" text={result.measurement} />
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="effects">
                                            <AccordionTrigger>Forward & Backward Effects</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text="Could you break down the chain reactions? What influences this variable and what does it affect downstream? Discuss the historical trends." />
                                                <h4 className="font-semibold pt-2">Backward Effects (Influences):</h4>
                                                <PodcastLine speaker="Das" text={result.backwardEffects} />
                                                <h4 className="font-semibold pt-2">Forward Effects (Impacts):</h4>
                                                <PodcastLine speaker="Das" text={result.forwardEffects} />
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="control">
                                            <AccordionTrigger>Control</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                 <PodcastLine speaker="Rita" text="So who is in the driver's seat? How is this variable controlled, and how have those methods evolved over time?" />
                                                 <PodcastLine speaker="Das" text={result.control} />
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="intuition">
                                            <AccordionTrigger>Intuitions</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text="Let's make this real for our listeners. How does the trend of this variable impact daily life, government decisions, and businesses?" />
                                                <h4 className="font-semibold pt-2">For Your Life:</h4>
                                                <PodcastLine speaker="Das" text={result.intuition.life} />
                                                <h4 className="font-semibold pt-2">For Government:</h4>
                                                <PodcastLine speaker="Das" text={result.intuition.government} />
                                                 <h4 className="font-semibold pt-2">For Firms:</h4>
                                                <PodcastLine speaker="Das" text={result.intuition.firms} />
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="prediction">
                                            <AccordionTrigger>Future Behaviour</AccordionTrigger>
                                            <AccordionContent className="space-y-2">
                                                <PodcastLine speaker="Rita" text={`Finally, the big question. Looking at ${country}'s historical trend for ${variable}, what's your prediction for it in the near future?`} />
                                                <PodcastLine speaker="Das" text={result.prediction} />
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
