'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UniversalPodcastPlayer } from '@/components/universal-podcast-player';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, PieChart as PieChartIcon, Activity } from 'lucide-react';

// Sample investment data
const portfolioData = [
  { name: 'Stocks', value: 45, amount: 45000 },
  { name: 'Bonds', value: 25, amount: 25000 },
  { name: 'Real Estate', value: 20, amount: 20000 },
  { name: 'Commodities', value: 10, amount: 10000 },
];

const performanceData = [
  { month: 'Jan', portfolio: 95000, sp500: 92000 },
  { month: 'Feb', portfolio: 97000, sp500: 94000 },
  { month: 'Mar', portfolio: 100000, sp500: 96000 },
  { month: 'Apr', portfolio: 98000, sp500: 95000 },
  { month: 'May', portfolio: 102000, sp500: 98000 },
  { month: 'Jun', portfolio: 105000, sp500: 100000 },
];

const sectorsData = [
  { sector: 'Technology', allocation: 30, performance: 12.5 },
  { sector: 'Healthcare', allocation: 20, performance: 8.3 },
  { sector: 'Financials', allocation: 15, performance: 6.2 },
  { sector: 'Consumer Goods', allocation: 15, performance: 4.8 },
  { sector: 'Energy', allocation: 10, performance: -2.1 },
  { sector: 'Utilities', allocation: 10, performance: 3.5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function InvestmentAnalysis() {
  const [selectedTopic, setSelectedTopic] = useState<string>('');

  const investmentTopics = [
    {
      title: 'Portfolio Diversification Strategies',
      description: 'Learn about risk reduction through asset allocation',
      query: 'Explain portfolio diversification strategies with real examples and mathematical risk calculations including correlation coefficients and Sharpe ratios'
    },
    {
      title: 'Compound Interest and Time Value of Money',
      description: 'Understanding exponential growth in investments',
      query: 'Explain compound interest and time value of money with real calculations, formulas like PV=FV/(1+r)^n, and examples from historical market data'
    },
    {
      title: 'Risk Assessment and Modern Portfolio Theory',
      description: 'Mathematical approaches to investment risk',
      query: 'Explain Modern Portfolio Theory, efficient frontier calculations, and risk assessment methods with real statistical data and mathematical formulas'
    },
    {
      title: 'Market Analysis and Technical Indicators',
      description: 'Understanding market trends and analysis tools',
      query: 'Explain technical analysis indicators like moving averages, RSI, MACD with real market examples and mathematical calculations behind these indicators'
    },
    {
      title: 'Real Estate Investment Analysis',
      description: 'Property investment evaluation methods',
      query: 'Explain real estate investment analysis including cap rates, cash-on-cash returns, NPV calculations with real property market data and examples'
    },
    {
      title: 'Cryptocurrency and Alternative Investments',
      description: 'Understanding digital assets and alternatives',
      query: 'Explain cryptocurrency investment principles, blockchain technology, and alternative investments with real market data, volatility statistics, and risk factors'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Investment Analysis Hub</h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Comprehensive investment education combining real market data, mathematical models, 
          and AI-powered podcast learning experiences.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Portfolio Overview</TabsTrigger>
          <TabsTrigger value="analysis">Market Analysis</TabsTrigger>
          <TabsTrigger value="education">Investment Education</TabsTrigger>
          <TabsTrigger value="podcast">AI Podcast Learning</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$105,000</div>
                <p className="text-xs text-muted-foreground">+5.2% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">YTD Return</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+10.5%</div>
                <p className="text-xs text-muted-foreground">Outperforming S&P 500</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Portfolio Beta</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0.85</div>
                <p className="text-xs text-muted-foreground">Lower market risk</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
                <PieChartIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.23</div>
                <p className="text-xs text-muted-foreground">Efficient risk-return</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>Current portfolio distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={portfolioData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {portfolioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Comparison</CardTitle>
                <CardDescription>Portfolio vs S&P 500 (YTD)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                    <Line type="monotone" dataKey="portfolio" stroke="#8884d8" strokeWidth={2} name="Portfolio" />
                    <Line type="monotone" dataKey="sp500" stroke="#82ca9d" strokeWidth={2} name="S&P 500" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sector Analysis</CardTitle>
              <CardDescription>Performance and allocation by sector</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={sectorsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sector" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="allocation" fill="#8884d8" name="Allocation %" />
                  <Bar yAxisId="right" dataKey="performance" fill="#82ca9d" name="Performance %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Portfolio Volatility:</span>
                  <span className="font-semibold">12.3%</span>
                </div>
                <div className="flex justify-between">
                  <span>Maximum Drawdown:</span>
                  <span className="font-semibold">-8.2%</span>
                </div>
                <div className="flex justify-between">
                  <span>Value at Risk (95%):</span>
                  <span className="font-semibold">$8,500</span>
                </div>
                <div className="flex justify-between">
                  <span>Information Ratio:</span>
                  <span className="font-semibold">0.76</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Annualized Return:</span>
                  <span className="font-semibold">9.8%</span>
                </div>
                <div className="flex justify-between">
                  <span>Alpha vs Market:</span>
                  <span className="font-semibold">+2.1%</span>
                </div>
                <div className="flex justify-between">
                  <span>Tracking Error:</span>
                  <span className="font-semibold">4.7%</span>
                </div>
                <div className="flex justify-between">
                  <span>Sortino Ratio:</span>
                  <span className="font-semibold">1.45</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="education" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investmentTopics.map((topic, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{topic.title}</CardTitle>
                  <CardDescription>{topic.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => setSelectedTopic(topic.query)}
                    className="w-full"
                  >
                    Generate Podcast
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="podcast" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Investment Education</CardTitle>
              <CardDescription>
                Learn investment concepts through interactive podcasts with real data and mathematical models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UniversalPodcastPlayer 
                title="Investment Portfolio Management"
                content={selectedTopic || "Explain the fundamentals of investment portfolio management with real market data, risk calculations including standard deviation and beta, and practical examples of diversification strategies"}
                options={{
                  contentType: 'investment',
                  title: 'Investment Portfolio Management',
                  description: 'Advanced investment strategies and portfolio optimization',
                  includeMath: true,
                  includeCharts: true,
                  includeStatistics: true,
                  audioPremium: true
                }}
                autoGenerate={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
