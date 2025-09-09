
'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countryNameMap, economicData, indicators as allIndicators, years } from '@/data/economic-data';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';

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
    </div>
  );
}
