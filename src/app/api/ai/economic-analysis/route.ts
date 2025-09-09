import { generateStructuredData, EconomicAnalysisSchema } from '@/lib/ai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const EconomicAnalysisRequestSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  type: z.enum([
    'macro-economic',
    'micro-economic',
    'market-analysis',
    'employment',
    'inflation',
    'gdp',
    'investment',
    'consumption',
    'government-budget',
    'trade',
    'other'
  ]).optional(),
  region: z.string().optional(),
  timeframe: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, type, region, timeframe } = EconomicAnalysisRequestSchema.parse(body);

    const prompt = `Provide a comprehensive economic analysis on the following topic: "${topic}"

${type ? `Analysis Type: ${type}` : ''}
${region ? `Region/Country: ${region}` : ''}
${timeframe ? `Time Frame: ${timeframe}` : ''}

Please provide an analysis that includes:
1. A clear summary of the current economic situation
2. Key findings and data points with specific metrics where possible
3. Economic implications and potential impacts
4. Actionable recommendations for policymakers, businesses, or individuals

Base your analysis on factual economic principles and real-world data. Include relevant economic indicators, trends, and comparative analysis where appropriate.`;

    const result = await generateStructuredData(prompt, EconomicAnalysisSchema);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in economic analysis:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate economic analysis' },
      { status: 500 }
    );
  }
}
