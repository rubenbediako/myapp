'use client';

import React, { useEffect, useRef } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { BarChart, Bar, LineChart as RechartsLineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

// Sample economic data for visualization
const sampleGDPData = [
  { year: 2020, USA: 21060, CHN: 14687, DEU: 3889, JPN: 5040 },
  { year: 2021, USA: 23316, CHN: 17820, DEU: 4260, JPN: 4941 },
  { year: 2022, USA: 25462, CHN: 18100, DEU: 4082, JPN: 4237 },
  { year: 2023, USA: 27360, CHN: 18566, DEU: 4429, JPN: 4409 },
  { year: 2024, USA: 28781, CHN: 19374, DEU: 4590, JPN: 4550 },
];

const sampleInflationData = [
  { year: 2020, USA: 1.2, CHN: 2.4, DEU: 0.4, JPN: 0.0 },
  { year: 2021, USA: 4.7, CHN: 0.9, DEU: 3.1, JPN: -0.2 },
  { year: 2022, USA: 8.0, CHN: 2.0, DEU: 7.9, JPN: 2.5 },
  { year: 2023, USA: 4.1, CHN: 0.7, DEU: 6.1, JPN: 3.2 },
  { year: 2024, USA: 3.1, CHN: 1.1, DEU: 2.9, JPN: 2.5 },
];

const economicIndicatorsPieData = [
  { name: 'GDP Growth', value: 35, color: '#0088FE' },
  { name: 'Inflation Control', value: 25, color: '#00C49F' },
  { name: 'Employment', value: 20, color: '#FFBB28' },
  { name: 'Trade Balance', value: 20, color: '#FF8042' },
];

interface EnhancedPodcastRendererProps {
  text: string;
  speaker: string;
  isCurrentSpeaking?: boolean;
  currentWordIndex?: number; // Keep for compatibility but don't use
}

export function EnhancedPodcastRenderer({ 
  text, 
  speaker, 
  isCurrentSpeaking = false
}: EnhancedPodcastRendererProps) {
  const textRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current speaking line
  useEffect(() => {
    if (isCurrentSpeaking && textRef.current) {
      textRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [isCurrentSpeaking]);

  // Enhanced text processing for better readability (no word-level highlighting)
  const processText = (inputText: string) => {
    return inputText
      .split(/(\$[^$]+\$)/g) // Split by LaTeX expressions
      .map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          // Render LaTeX expressions
          const latex = part.slice(1, -1);
          return (
            <span key={index} className="inline-block mx-1 p-1 bg-blue-50 rounded border border-blue-200">
              <InlineMath math={latex} />
            </span>
          );
        } else {
          // Process regular text for economic terms and statistics
          return part
            .split(/(\d+\.?\d*%?|\$\d+\.?\d*\s*(?:billion|trillion|million|k|B|T)?)/g)
            .map((segment, subIndex) => {
              if (/^\d+\.?\d*%?$/.test(segment) || /^\$\d+\.?\d*\s*(?:billion|trillion|million|k|B|T)?$/i.test(segment)) {
                return (
                  <span key={`${index}-${subIndex}`} className="statistic-highlight font-semibold text-blue-600 px-1 rounded bg-blue-50">
                    {segment}
                  </span>
                );
              }
              // Highlight economic terms
              const economicTerms = ['GDP', 'inflation', 'unemployment', 'recession', 'growth', 'interest', 'monetary', 'fiscal'];
              const hasEconomicTerm = economicTerms.some(term => 
                segment.toLowerCase().includes(term.toLowerCase())
              );
              
              if (hasEconomicTerm) {
                return (
                  <span key={`${index}-${subIndex}`} className="economic-term text-green-700 font-medium">
                    {segment}
                  </span>
                );
              }
              
              return segment;
            });
        }
      });
  };

  return (
    <div 
      ref={textRef}
      className={`podcast-content transition-all duration-300 ${
        isCurrentSpeaking ? 'reading-mode bg-yellow-50 border-l-4 border-yellow-400 pl-4' : ''
      }`}
    >
      {/* Enhanced Content with Math and Highlighting */}
      <div className="prose prose-sm max-w-none">
        {processText(text)}
      </div>

      {/* Charts for GDP or economic data */}
      {text.toLowerCase().includes('gdp') && (
        <Card className="my-4 border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              GDP Growth Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={sampleGDPData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}T`, 'GDP']} />
                <Legend />
                <Bar dataKey="USA" fill="#3b82f6" name="United States" />
                <Bar dataKey="CHN" fill="#ef4444" name="China" />
                <Bar dataKey="DEU" fill="#10b981" name="Germany" />
                <Bar dataKey="JPN" fill="#f59e0b" name="Japan" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Inflation charts */}
      {text.toLowerCase().includes('inflation') && (
        <Card className="my-4 border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Inflation Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <RechartsLineChart data={sampleInflationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Inflation']} />
                <Legend />
                <Line type="monotone" dataKey="USA" stroke="#3b82f6" name="United States" />
                <Line type="monotone" dataKey="CHN" stroke="#ef4444" name="China" />
                <Line type="monotone" dataKey="DEU" stroke="#10b981" name="Germany" />
                <Line type="monotone" dataKey="JPN" stroke="#f59e0b" name="Japan" />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Economic Indicators Pie Chart */}
      {text.toLowerCase().includes('economic') && text.toLowerCase().includes('indicator') && (
        <Card className="my-4 border-purple-200 bg-purple-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              Economic Indicators Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={economicIndicatorsPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {economicIndicatorsPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Importance']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Mathematical equation display */}
      {text.includes('$$') && (
        <Card className="my-4 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="text-center">
              <BlockMath math={text.match(/\$\$([^$]+)\$\$/)?.[1] || ''} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Line-level reading indicator for current speaking */}
      {isCurrentSpeaking && (
        <div className="mt-3 flex items-center gap-2">
          <div className="h-2 bg-yellow-200 rounded-full overflow-hidden flex-1">
            <div 
              className="h-full bg-yellow-500 transition-all duration-1000 ease-linear animate-pulse"
              style={{ width: '100%' }}
            />
          </div>
          <Badge variant="secondary" className="text-xs">
            🎙️ Reading
          </Badge>
        </div>
      )}
    </div>
  );
}

export default EnhancedPodcastRenderer;
