'use client';

import { useState } from 'react';

export default function AITestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async (endpoint: string) => {
    setLoading(true);
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      setResult({ endpoint, status: response.status, data });
    } catch (error) {
      setResult({ endpoint, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">AI API Test Page</h1>
      
      <div className="space-y-4">
        <button
          onClick={() => testAPI('/api/diagnostic')}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2 disabled:opacity-50"
        >
          Test Diagnostic
        </button>
        
        <button
          onClick={() => testAPI('/api/test-ai-detailed')}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2 disabled:opacity-50"
        >
          Test AI Detailed
        </button>
        
        <button
          onClick={() => testAPI('/api/ai/ask-das-ai')}
          disabled={loading}
          className="bg-purple-500 text-white px-4 py-2 rounded mr-2 disabled:opacity-50"
        >
          Test Ask DAS AI
        </button>
      </div>

      {loading && <p className="mt-4">Loading...</p>}

      {result && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
