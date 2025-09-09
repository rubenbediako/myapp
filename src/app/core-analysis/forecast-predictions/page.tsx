
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Loader2, Mic, ChevronDown } from 'lucide-react';
import { forecastEconomicData, ForecastEconomicDataOutput } from '@/ai/flows/forecast-economic-data';
import { generatePodcast, GeneratePodcastOutput } from '@/ai/flows/generate-podcast';
import { useToast } from '@/hooks/use-toast';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { indicators as allIndicators } from '@/data/economic-data';


const regions: Record<string, string[]> = {
    "Africa": ["Nigeria", "South Africa", "Egypt", "Kenya", "Ghana", "Ethiopia", "Algeria", "Morocco"],
    "Asia": ["China", "India", "Japan", "South Korea", "Indonesia", "Saudi Arabia", "United Arab Emirates", "Singapore"],
    "Europe": ["Germany", "United Kingdom", "France", "Italy", "Spain", "Netherlands", "Switzerland", "Sweden", "Russia"],
    "North America": ["United States", "Canada", "Mexico"],
    "South America": ["Brazil", "Argentina", "Colombia", "Chile", "Peru", "Venezuela"],
    "Oceania": ["Australia", "New Zealand"]
};
const indicators = allIndicators;
const forecastPeriods = ["3 months", "6 months", "1 year", "2 years", "3 years", "5 years"];

export default function ForecastPredictions() {
  const [region, setRegion] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [period, setPeriod] = useState<string>('1 year');
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
  const [forecast, setForecast] = useState<ForecastEconomicDataOutput | null>(null);
  const [podcast, setPodcast] = useState<GeneratePodcastOutput | null>(null);
  const { toast } = useToast();

  const handleIndicatorToggle = (indicator: string) => {
    setSelectedIndicators(prev => 
      prev.includes(indicator)
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator]
    );
  };
  
  const handleGenerateForecast = async () => {
    if (!country || selectedIndicators.length === 0 || !period) {
      toast({
        title: "Selection missing",
        description: "Please select a country, at least one indicator, and a forecast period.",
        variant: "destructive"
      });
      return;
    }
    setLoadingStatus("Generating forecast...");
    setForecast(null);
    setPodcast(null);
    try {
      const result = await forecastEconomicData({ country, indicators: selectedIndicators, period });
      setForecast(result);

      setLoadingStatus("Generating podcast...");
      const narrationScript = result.podcastScript.map(line => `${line.speaker}: ${line.line}`).join('\n');
      const podcastResult = await generatePodcast({
          title: result.title,
          narrationScript: narrationScript,
      });
      setPodcast(podcastResult);

    } catch (error) {
      console.error(error);
      toast({
        title: "Error generating forecast",
        description: "An error occurred while generating the forecast. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingStatus(null);
    }
  };
  
  const PodcastLine = ({ speaker, text }: { speaker: string, text: string }) => {
      const speakerClass = speaker.includes('Rita') ? 'text-speaker-rita' : 'text-speaker-das';
      return (
          <p>
              <strong className={speakerClass}>{speaker}:</strong> {text}
          </p>
      );
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Forecasts & Predictions</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Economic Forecast Podcast</CardTitle>
          <CardDescription>Select a country, one or more indicators, and a time period to generate an AI-powered forecast.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Region</Label>
              <Select onValueChange={(value) => { setRegion(value); setCountry(''); }} value={region}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a region" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(regions).map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Select onValueChange={setCountry} value={country} disabled={!region}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {region && regions[region].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Indicators</Label>
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>{selectedIndicators.length > 0 ? `${selectedIndicators.length} selected` : "Select indicators"}</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
                  <DropdownMenuLabel>Economic Indicators</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {indicators.map((indicator) => (
                    <DropdownMenuCheckboxItem
                      key={indicator}
                      checked={selectedIndicators.includes(indicator)}
                      onCheckedChange={() => handleIndicatorToggle(indicator)}
                      onSelect={(e) => e.preventDefault()} // Prevent menu from closing
                    >
                      {indicator}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
             <div className="space-y-2">
              <Label>Forecast Period</Label>
              <Select onValueChange={setPeriod} value={period}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a period" />
                </SelectTrigger>
                <SelectContent>
                  {forecastPeriods.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleGenerateForecast} disabled={!!loadingStatus || !country || selectedIndicators.length === 0}>
            {loadingStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loadingStatus ? loadingStatus : 'Generate Forecast'}
          </Button>

          {forecast && (
            <div className="pt-4 space-y-4">
              <Card>
                <CardHeader>
                    <CardTitle>{forecast.title}</CardTitle>
                    <CardDescription>A podcast episode discussing the forecast for {selectedIndicators.join(', ')} in {country}.</CardDescription>
                </CardHeader>
                <CardContent>
                    <h3 className="font-semibold mb-2">Podcast Audio</h3>
                    {podcast ? (
                      <audio controls autoPlay className="w-full sm:w-auto flex-1 mb-4">
                          <source src={podcast.audioUrl} type="audio/wav" />
                          Your browser does not support the audio element.
                      </audio>
                    ) : (
                      <div className="flex items-center text-muted-foreground mb-4">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <p>Audio is generating...</p>
                      </div>
                    )}
                    
                    <Accordion type="single" collapsible className="w-full mb-6">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>View Full Podcast Script</AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-2 text-sm text-muted-foreground max-h-60 overflow-y-auto">
                                    {forecast.podcastScript.map((line, index) => (
                                        <PodcastLine key={index} speaker={line.speaker} text={line.line} />
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    
                    <Tabs defaultValue={forecast.indicatorForecasts[0]?.indicator} className="w-full">
                        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                           {forecast.indicatorForecasts.map((indForecast) => (
                               <TabsTrigger key={indForecast.indicator} value={indForecast.indicator}>{indForecast.indicator}</TabsTrigger>
                           ))}
                        </TabsList>
                        {forecast.indicatorForecasts.map((indForecast) => (
                           <TabsContent key={indForecast.indicator} value={indForecast.indicator} className="mt-4">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                     <div>
                                        <h3 className="font-semibold mb-2">{period} Forecast Chart</h3>
                                        <ChartContainer config={{}} className="h-[250px] w-full">
                                            <LineChart data={indForecast.chartData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                                                <YAxis tick={{ fontSize: 12 }} />
                                                <ChartTooltip content={<ChartTooltipContent />} />
                                                <Legend />
                                                <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" name={indForecast.indicator} />
                                            </LineChart>
                                        </ChartContainer>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2">Deeper Analysis</h3>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem value="explanation">
                                                <AccordionTrigger>Forecast Explanation</AccordionTrigger>
                                                <AccordionContent className="text-muted-foreground pt-2">
                                                    {indForecast.detailedAnalysis.explanation}
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="intuition-life">
                                                <AccordionTrigger>Impact on Daily Life</AccordionTrigger>
                                                <AccordionContent className="text-muted-foreground pt-2">
                                                    {indForecast.detailedAnalysis.intuition.life}
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="intuition-firms">
                                                <AccordionTrigger>Impact on Firms</AccordionTrigger>
                                                <AccordionContent className="text-muted-foreground pt-2">
                                                    {indForecast.detailedAnalysis.intuition.firms}
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="intuition-gov">
                                                <AccordionTrigger>Impact on Government</AccordionTrigger>
                                                <AccordionContent className="text-muted-foreground pt-2">
                                                    {indForecast.detailedAnalysis.intuition.government}
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </div>
                                </div>
                           </TabsContent>
                        ))}
                    </Tabs>

                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
