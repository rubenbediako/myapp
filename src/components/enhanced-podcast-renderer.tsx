'use client';

import React, { useEffect, useRef } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { BarChart, Bar, LineChart as RechartsLineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3, PieChart as PieChartIcon, LineChart } from 'lucide-react';

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
  currentWordIndex?: number;
}

export function EnhancedPodcastRenderer({ 
  text, 
  speaker, 
  isCurrentSpeaking = false,
  currentWordIndex = 0
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

  // Enhanced text processing for better readability
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

  // Function to render chart components based on type
  const renderChartComponent = (chartType: string, index: number) => {
    const type = chartType.toLowerCase();
    
    if (type.includes('gdp') || type.includes('bar')) {
      return (
        <Card key={`chart-${index}`} className="my-4 w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              GDP Comparison (Billions USD)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={sampleGDPData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="USA" fill="#0088FE" />
                <Bar dataKey="CHN" fill="#00C49F" />
                <Bar dataKey="DEU" fill="#FFBB28" />
                <Bar dataKey="JPN" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      );
    } else if (type.includes('inflation') || type.includes('line')) {
      return (
        <Card key={`chart-${index}`} className="my-4 w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Inflation Rates (%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <RechartsLineChart data={sampleInflationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="USA" stroke="#0088FE" strokeWidth={2} />
                <Line type="monotone" dataKey="CHN" stroke="#00C49F" strokeWidth={2} />
                <Line type="monotone" dataKey="DEU" stroke="#FFBB28" strokeWidth={2} />
                <Line type="monotone" dataKey="JPN" stroke="#FF8042" strokeWidth={2} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      );
    } else if (type.includes('pie') || type.includes('distribution')) {
      return (
        <Card key={`chart-${index}`} className="my-4 w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              Economic Indicators Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  dataKey="value"
                  data={economicIndicatorsPieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                >
                  {economicIndicatorsPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      );
    }

    // Default chart placeholder
    return (
      <Card key={`chart-${index}`} className="my-4 w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Economic Chart: {chartType}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
            <span className="text-gray-500 text-sm">Chart: {chartType}</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Enhanced content renderer with word highlighting
  const renderEnhancedContent = (inputText: string) => {
    const words = inputText.split(' ');
    
    return words.map((word, index) => {
      const isCurrentWord = index === currentWordIndex;
      const isStatistic = /^\d+\.?\d*%?$/.test(word) || /^\$\d+\.?\d*\s*(?:billion|trillion|million|k|B|T)?$/i.test(word);
      const economicTerms = ['GDP', 'inflation', 'unemployment', 'recession', 'growth', 'interest', 'monetary', 'fiscal'];
      const isEconomicTerm = economicTerms.some(term => 
        word.toLowerCase().includes(term.toLowerCase())
      );
      
      let className = 'inline-block transition-all duration-300';
      
      if (isCurrentWord) {
        className += ' current-word bg-yellow-200 text-yellow-900 font-semibold px-1 rounded shadow-sm scale-105';
      } else if (isStatistic) {
        className += ' statistic-highlight font-semibold text-blue-700 bg-blue-50 px-1 rounded border-b-2 border-blue-300';
      } else if (isEconomicTerm) {
        className += ' economic-term font-medium text-green-700 bg-green-50 px-1 rounded';
      } else if (isCurrentSpeaking) {
        className += ' text-gray-600';
      }

      return (
        <span 
          key={`word-${index}`} 
          className={className}
          data-word-index={index}
        >
          {word}{index < words.length - 1 ? ' ' : ''}
        </span>
      );
    });
  };

  // Function to detect mathematical formulas and economic models
  const containsMath = text.includes('$') || text.includes('equation') || text.includes('formula');
  const containsChart = text.includes('[CHART:') || text.includes('chart') || text.includes('graph');
  const containsStatistics = /(\d+\.?\d*%|\$\d+\.?\d*\s*(billion|trillion|million|k|B|T))/i.test(text);
  const containsEconomicTerms = /\b(GDP|inflation|unemployment|elasticity|supply|demand|market|economy|fiscal|monetary)\b/i.test(text);

  return (
    <div className="space-y-2">
      {/* Content badges */}
      <div className="flex flex-wrap gap-1 mb-2">
        {containsMath && (
          <Badge variant="secondary" className="text-xs">
            📊 Mathematical Model
          </Badge>
        )}
        {containsChart && (
          <Badge variant="secondary" className="text-xs">
            📈 Data Visualization
          </Badge>
        )}
        {containsStatistics && (
          <Badge variant="secondary" className="text-xs">
            📋 Real Statistics
          </Badge>
        )}
        {containsEconomicTerms && (
          <Badge variant="secondary" className="text-xs">
            🎓 Economic Theory
          </Badge>
        )}
        {speaker === 'Speaker2' && (
          <Badge variant="outline" className="text-xs">
            🧠 Expert Analysis
          </Badge>
        )}
      </div>

      {/* Enhanced content with word-level highlighting */}
      <div 
        ref={textRef}
        className={`space-y-2 leading-relaxed text-base text-white ${
          isCurrentSpeaking ? 'reading-mode' : ''
        }`}
        style={{ lineHeight: '1.8' }}
      >
        {renderEnhancedContent(text)}
      </div>

      {/* Mathematical equations as block math if detected */}
      {text.includes('$$') && (
        <Card className="my-4 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="text-center">
              <BlockMath math={text.match(/\$\$([^$]+)\$\$/)?.[1] || ''} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reading progress indicator for current speaking */}
      {isCurrentSpeaking && (
        <div className="mt-2">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-400 transition-all duration-300 ease-out"
              style={{ 
                width: `${Math.min(100, (currentWordIndex / (text.split(' ').length)) * 100)}%` 
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default EnhancedPodcastRenderer;
