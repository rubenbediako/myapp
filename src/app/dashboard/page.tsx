
'use client';

import { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { countryNameMap, economicData, indicators as allIndicators, years } from '@/data/economic-data';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { UniversalPodcastPlayer } from '@/components/universal-podcast-player';
import { Volume2, BarChart3 } from 'lucide-react';

const keyIndicators = [
    'GDP (Billions USD)',
    'Inflation Rate (%)',
    'Unemployment Rate (%)',
    'GDP Growth Rate (%)',
];

const countries = Object.keys(countryNameMap);

export default function DashboardPage() {
  const [selectedCountry, setSelectedCountry] = useState<string>(countries[0]);

  const chartData = keyIndicators.reduce((acc, indicator) => {
    const indicatorData = economicData[indicator];
    if (indicatorData) {
      acc[indicator] = years.map(year => ({
        year,
        value: indicatorData[year]?.[selectedCountry],
      }));
    }
    return acc;
  }, {} as Record<string, { year: number; value: number | undefined }[]>);

  // Generate content for podcast
  const podcastContent = useMemo(() => {
    const countryName = countryNameMap[selectedCountry];
    const latestYear = Math.max(...years);
    
    let content = `Economic Analysis for ${countryName} - Dashboard Overview\n\n`;
    
    keyIndicators.forEach(indicator => {
      const data = chartData[indicator];
      const latestData = data?.find(d => d.year === latestYear);
      const previousYearData = data?.find(d => d.year === latestYear - 1);
      
      if (latestData?.value !== undefined) {
        content += `${indicator}: ${latestData.value}`;
        if (previousYearData?.value !== undefined) {
          const change = latestData.value - previousYearData.value;
          const changePercent = ((change / previousYearData.value) * 100).toFixed(2);
          content += ` (${change > 0 ? '+' : ''}${change.toFixed(2)}, ${changePercent}% change from previous year)`;
        }
        content += '\n';
      }
    });
    
    content += `\nAnalyze these economic indicators, their trends over time, policy implications, and economic outlook for ${countryName}. Include mathematical relationships between indicators and comparative analysis with regional and global averages.`;
    
    return content;
  }, [selectedCountry, chartData]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Economic Dashboard: {countryNameMap[selectedCountry]}</h2>
         <div className="flex gap-4">
            <Select onValueChange={setSelectedCountry} value={selectedCountry}>
                <SelectTrigger className="w-full sm:w-[280px]">
                    <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                    {countries.map(code => (
                        <SelectItem key={code} value={code}>{countryNameMap[code]}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Data Dashboard
          </TabsTrigger>
          <TabsTrigger value="podcast" className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            AI Podcast Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {keyIndicators.map((indicator) => (
                <Card key={indicator}>
                    <CardHeader>
                        <CardTitle>{indicator}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[250px] w-full">
                            <LineChart data={chartData[indicator]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Legend />
                                <Line type="monotone" dataKey="value" name={indicator} stroke="hsl(var(--primary))" />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="podcast" className="space-y-4">
          <UniversalPodcastPlayer
            title={`Economic Analysis: ${countryNameMap[selectedCountry]}`}
            content={podcastContent}
            options={{
              contentType: 'dashboard',
              title: `Economic Dashboard: ${countryNameMap[selectedCountry]}`,
              description: 'Comprehensive analysis of economic indicators and trends',
              data: { selectedCountry, chartData, economicData },
              includeMath: true,
              includeCharts: true,
              includeStatistics: true,
              audioPremium: true
            }}
            autoGenerate={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
