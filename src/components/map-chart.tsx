
'use client';

import React, { useState, useRef, useCallback } from 'react';
import { WorldMapSvg } from './world-map-svg';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { analyzeEconomicData } from '@/ai/flows/analyze-economic-data';
import { Skeleton } from './ui/skeleton';
import { Loader2 } from 'lucide-react';

interface MapChartProps {
  data: { [countryCode: string]: number };
  indicator: string;
  year: number;
  min: number;
  max: number;
  countryNames: { [key: string]: string };
}

interface TooltipData {
  countryName: string;
  value: number | string;
  analysis: string;
  x: number;
  y: number;
}

export function MapChart({ data, indicator, year, min, max, countryNames }: MapChartProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [isAnalysisLoading, setAnalysisLoading] = useState(false);
  const analysisTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getColor = useCallback((value: number | undefined) => {
    if (value === undefined || value === null) {
      return 'hsl(var(--muted))';
    }
    const percentage = (value - min) / (max - min);
    
    // Interpolate between a muted color (low) and primary (high)
    // Using HSL: h (hue), s (saturation), l (lightness)
    const lowColor = { h: 210, s: 10, l: 80 }; // A light, muted blue/gray
    const highColor = { h: 340, s: 90, l: 65 }; // primary color `hsl(var(--primary))` from the theme
    
    const h = Math.round(lowColor.h + percentage * (highColor.h - lowColor.h));
    const s = Math.round(lowColor.s + percentage * (highColor.s - lowColor.s));
    const l = Math.round(lowColor.l + percentage * (highColor.l - lowColor.l));
    
    return `hsl(${h}, ${s}%, ${l}%)`;
  }, [min, max]);

  const handleCountryHover = (code: string, event: React.MouseEvent) => {
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
    }
    setAnalysisLoading(true);
    
    const countryName = countryNames[code] || code;
    const value = data[code];
    
    setTooltip({
      countryName,
      value: value !== undefined ? `${value.toLocaleString()}` : 'No data',
      analysis: '',
      x: event.clientX,
      y: event.clientY,
    });

    if (value !== undefined) {
      analysisTimeoutRef.current = setTimeout(() => {
        analyzeEconomicData({
          indicator: indicator,
          region: countryName,
          timePeriod: year.toString(),
          dataValue: value,
        })
        .then((result) => {
          setTooltip((prev) => (prev ? { ...prev, analysis: result.analysis } : null));
        })
        .catch((error) => {
          console.error('AI analysis failed:', error);
          setTooltip((prev) => (prev ? { ...prev, analysis: 'Could not load analysis.' } : null));
        })
        .finally(() => {
          setAnalysisLoading(false);
        });
      }, 500);
    } else {
        setAnalysisLoading(false);
        setTooltip((prev) => (prev ? { ...prev, analysis: 'No data available for this year.' } : null));
    }
  };

  const handleCountryLeave = () => {
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
    }
    setTooltip(null);
    setAnalysisLoading(false);
  };

  return (
    <div className="w-full h-full relative" ref={containerRef} onMouseLeave={handleCountryLeave}>
      <WorldMapSvg data={data} getColor={getColor} onCountryHover={handleCountryHover} />
      {tooltip && (
        <div
          className="fixed pointer-events-none z-50 transition-transform"
          style={{
            top: tooltip.y + 10,
            left: tooltip.x + 10,
            transform: `translate(-${tooltip.x / (containerRef.current?.offsetWidth || window.innerWidth) * 100}%, -${tooltip.y / (containerRef.current?.offsetHeight || window.innerHeight) * 50}%)`,
          }}
        >
          <Card className="w-64 shadow-2xl animate-in fade-in-0 zoom-in-95">
            <CardHeader>
              <CardTitle>{tooltip.countryName}</CardTitle>
              <CardDescription>{indicator}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{tooltip.value}</p>
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-semibold mb-2 flex items-center">
                   {isAnalysisLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} AI Analysis
                </h4>
                {isAnalysisLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground whitespace-pre-wrap">{tooltip.analysis}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
