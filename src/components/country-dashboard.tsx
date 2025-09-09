'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { economicData, countryNameMap } from '@/data/economic-data';

interface CountryDashboardProps {
  countryCode: string;
}

const keyIndicators = [
    'GDP (Billions USD)',
    'Inflation Rate (%)',
    'Unemployment Rate (%)',
    'GDP Growth Rate (%)',
];

export function CountryDashboard({ countryCode }: CountryDashboardProps) {
  const countryName = countryNameMap[countryCode];

  const chartData = useMemo(() => {
    const data: { [indicator: string]: any[] } = {};
    keyIndicators.forEach(indicator => {
      const indicatorData = economicData[indicator];
      if (indicatorData) {
        data[indicator] = Object.entries(indicatorData).map(([year, values]) => ({
          year: parseInt(year),
          value: values[countryCode],
        }));
      }
    });
    return data;
  }, [countryCode]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard: {countryName}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {keyIndicators.map((indicator) => (
          <Card key={indicator}>
            <CardHeader>
              <CardTitle>{indicator}</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[250px] w-full">
                <LineChart data={chartData[indicator]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="value" name={indicator} stroke="hsl(var(--chart-1))" />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
