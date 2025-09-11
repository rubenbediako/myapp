'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AITestPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testAskDasAI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      console.log('Making request to /api/ai/ask-das-ai with query:', query);
      
      const response = await fetch('/api/ai/ask-das-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Success response:', data);
      setResult(data);
      
    } catch (err) {
      console.error('Request failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testEconomicAnalysis = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      console.log('Making request to /api/ai/economic-analysis');
      
      const response = await fetch('/api/ai/economic-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          topic: query || 'US economic situation',
          type: 'macro-economic',
          region: 'United States'
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Success response:', data);
      setResult(data);
      
    } catch (err) {
      console.error('Request failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">AI Functionality Test Page</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Test AI Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Test Query:</label>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a question (e.g., 'What is inflation?')"
            />
          </div>
          
          <div className="flex gap-4">
            <Button 
              onClick={testAskDasAI}
              disabled={loading || !query}
            >
              {loading ? 'Testing...' : 'Test Ask Das AI'}
            </Button>
            
            <Button 
              onClick={testEconomicAnalysis}
              disabled={loading}
              variant="outline"
            >
              {loading ? 'Testing...' : 'Test Economic Analysis'}
            </Button>
          </div>
          
          {error && (
            <div className="p-4 bg-red-100 border border-red-400 rounded">
              <h3 className="font-semibold text-red-800">Error:</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {result && (
            <div className="p-4 bg-green-100 border border-green-400 rounded">
              <h3 className="font-semibold text-green-800">Success!</h3>
              <Textarea
                value={JSON.stringify(result, null, 2)}
                readOnly
                className="mt-2 h-40"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
