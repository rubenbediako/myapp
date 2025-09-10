
import UnderConstructionPage from '@/components/under-construction';

export default function ComparativeAnalysisPage() {
  return (
    <UnderConstructionPage 
      title="Comparative Economic Analysis"
      description="AI-powered comparative analysis is being updated to use our new AI system."
      backLink="/dashboard"
    />
  );
}

const countries = Object.keys(countryNameMap);
const indicators = allIndicators;

export default function ComparativeAnalysis() {
  const [country1, setCountry1] = useState<string>('');
  const [country2, setCountry2] = useState<string>('');
  const [indicator, setIndicator] = useState<string>('');
  const [startYear, setStartYear] = useState<number>(years[0]);
  const [endYear, setEndYear] = useState<number>(years[years.length - 1]);
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
  const [result, setResult] = useState<CompareEconomicDataOutput | null>(null);
  const [podcast, setPodcast] = useState<GeneratePodcastOutput | null>(null);
  const { toast } = useToast();

  const handleGenerateComparison = async () => {
    if (!country1 || !country2 || !indicator) {
      toast({
        title: "Selection missing",
        description: "Please select two countries and an indicator.",
        variant: "destructive"
      });
      return;
    }
     if (country1 === country2) {
      toast({
        title: "Invalid selection",
        description: "Please select two different countries.",
        variant: "destructive"
      });
      return;
    }
    if (startYear > endYear) {
      toast({
        title: "Invalid Year Range",
        description: "Start year cannot be after the end year.",
        variant: "destructive"
      });
      return;
    }
    setLoadingStatus("Generating comparison...");
    setResult(null);
    setPodcast(null);
    try {
      const apiResult = await compareEconomicData({ 
        country1: countries.find(c => countryNameMap[c] === country1)!, 
        country2: countries.find(c => countryNameMap[c] === country2)!, 
        indicator,
        startYear,
        endYear
      });
      setResult(apiResult);

      setLoadingStatus("Generating podcast audio...");
      const podcastTitle = `Comparison: ${country1} vs. ${country2} for ${indicator} (${startYear}-${endYear})`;
      const resultPodcast = await generatePodcast({
          title: podcastTitle,
          narrationScript: apiResult.analysis,
      });
      setPodcast(resultPodcast);

    } catch (error) {
      console.error(error);
      toast({
        title: "Error generating comparison",
        description: "An error occurred while generating the comparison. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingStatus(null);
    }
  };

  const renderPodcastScript = (script: string) => {
    return script.split('\n').map((line, index) => {
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
        <h2 className="text-3xl font-bold tracking-tight">Comparative Analysis</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compare Economies</CardTitle>
          <CardDescription>Select two countries, an economic indicator, and a year range for an AI-powered comparison.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Country 1</Label>
              <Select onValueChange={setCountry1} value={country1}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(code => <SelectItem key={code} value={countryNameMap[code]}>{countryNameMap[code]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Country 2</Label>
               <Select onValueChange={setCountry2} value={country2}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(code => <SelectItem key={code} value={countryNameMap[code]}>{countryNameMap[code]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Indicator</Label>
              <Select onValueChange={setIndicator} value={indicator}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an indicator" />
                </SelectTrigger>
                <SelectContent>
                  {indicators.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                  <Label>Start Year</Label>
                  <Select onValueChange={(value) => setStartYear(parseInt(value))} value={startYear.toString()}>
                      <SelectTrigger>
                      <SelectValue placeholder="Start" />
                      </SelectTrigger>
                      <SelectContent>
                      {years.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
                      </SelectContent>
                  </Select>
              </div>
               <div className="space-y-2">
                  <Label>End Year</Label>
                  <Select onValueChange={(value) => setEndYear(parseInt(value))} value={endYear.toString()}>
                      <SelectTrigger>
                      <SelectValue placeholder="End" />
                      </SelectTrigger>
                      <SelectContent>
                      {years.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
                      </SelectContent>
                  </Select>
              </div>
            </div>
          </div>
          <Button onClick={handleGenerateComparison} disabled={!!loadingStatus || !country1 || !country2 || !indicator}>
            {loadingStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loadingStatus ? loadingStatus : 'Generate Comparison Podcast'}
          </Button>

          {result && (
            <div className="pt-4 space-y-4">
              <Card>
                <CardHeader>
                    <CardTitle>Comparison: {country1} vs. {country2} for {indicator}</CardTitle>
                     <CardDescription>AI-powered podcast and visual analysis for {startYear} - {endYear}.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold mb-2 text-lg">AI-Powered Analysis Podcast</h3>
                        {podcast && (
                            <audio controls autoPlay className="w-full sm:w-auto flex-1 mb-4">
                                <source src={podcast.audioUrl} type="audio/wav" />
                                Your browser does not support the audio element.
                            </audio>
                        )}
                        <div className="p-4 bg-muted/50 rounded-md max-h-60 overflow-y-auto space-y-2 text-sm">
                          {renderPodcastScript(result.analysis)}
                        </div>
                    </div>
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold mb-2 text-lg">Historical Trend</h3>
                             <ChartContainer config={{}} className="h-[250px] w-full">
                                <LineChart data={result.chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Legend />
                                    <Line type="monotone" dataKey="country1Value" name={country1} stroke="hsl(var(--chart-1))" strokeWidth={2} />
                                    <Line type="monotone" dataKey="country2Value" name={country2} stroke="hsl(var(--chart-2))" strokeWidth={2} />
                                </LineChart>
                            </ChartContainer>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2 text-lg">Year-over-Year Comparison</h3>
                             <ChartContainer config={{}} className="h-[250px] w-full">
                                <BarChart data={result.chartData}>
                                     <CartesianGrid strokeDasharray="3 3" />
                                     <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                                     <YAxis tick={{ fontSize: 12 }} />
                                     <ChartTooltip content={<ChartTooltipContent />} />
                                     <Legend />
                                     <Bar dataKey="country1Value" name={country1} fill="hsl(var(--chart-1))" radius={4} />
                                     <Bar dataKey="country2Value" name={country2} fill="hsl(var(--chart-2))" radius={4} />
                                </BarChart>
                             </ChartContainer>
                        </div>
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
