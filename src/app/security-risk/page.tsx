
import UnderConstructionPage from '@/components/under-construction';

export default function SecurityRiskPage() {
  return (
    <UnderConstructionPage 
      title="Security Risk Analysis"
      description="AI-powered security risk analysis is being updated to use our new AI system."
      backLink="/dashboard"
    />
  );
}

const countries = Object.keys(countryNameMap);

export default function SecurityRiskPage() {
    const [country, setCountry] = useState<string>('');
    const [risks, setRisks] = useState<string>('');
    const [loadingStatus, setLoadingStatus] = useState<string|null>(null);
    const [result, setResult] = useState<AnalyzeSecurityRiskOutput | null>(null);
    const [podcast, setPodcast] = useState<GeneratePodcastOutput | null>(null);
    const { toast } = useToast();

    const handleGenerateAnalysis = async () => {
        if (!country || !risks) {
            toast({
                title: "Selection missing",
                description: "Please select a country and describe the risks you are interested in.",
                variant: "destructive"
            });
            return;
        }
        setLoadingStatus("Analyzing risks...");
        setResult(null);
        setPodcast(null);
        try {
            const apiResult = await analyzeSecurityRisk({ country, risks });
            setResult(apiResult);
            
            setLoadingStatus("Generating podcast audio...");
            const podcastTitle = `Security & Risk in ${country}`;
            const resultPodcast = await generatePodcast({
                title: podcastTitle,
                narrationScript: apiResult.analysis,
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
    
    const renderPodcastScript = (script: string) => {
        return script.split('\n').filter(line => line.trim()).map((line, index) => {
            if (line.startsWith('Rita:')) {
                return <p key={index}><strong className="text-speaker-rita">Rita:</strong>{line.substring(5)}</p>;
            }
            if (line.startsWith('Das:')) {
                return <p key={index}><strong className="text-speaker-das">Das:</strong>{line.substring(4)}</p>;
            }
            return <p key={index}>{line}</p>;
        });
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Security & Risk Analysis</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Analyze Security & Risk Landscape</CardTitle>
                    <CardDescription>Select a country and specify your concerns for a detailed AI-powered podcast on its security and risk environment.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                         <div className="space-y-2">
                            <Label htmlFor="risks">Risks of Interest</Label>
                            <Textarea 
                                id="risks"
                                placeholder="e.g., future business risks, political stability, emerging cybersecurity threats, incoming dangers for travelers"
                                value={risks}
                                onChange={(e) => setRisks(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>
                    <Button onClick={handleGenerateAnalysis} disabled={!!loadingStatus || !country || !risks}>
                        {loadingStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {loadingStatus ? loadingStatus : 'Generate Podcast'}
                    </Button>

                    {result && (
                        <div className="pt-4 space-y-4">
                            <Card>
                                <CardHeader>
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <CardTitle>Podcast: Security & Risk in {country}</CardTitle>
                                         {podcast && (
                                            <audio controls autoPlay className="w-full sm:w-auto flex-1">
                                                <source src={podcast.audioUrl} type="audio/wav" />
                                                Your browser does not support the audio element.
                                            </audio>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                     <div className="p-4 bg-muted/50 rounded-md max-h-96 overflow-y-auto space-y-2">
                                        {renderPodcastScript(result.analysis)}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
