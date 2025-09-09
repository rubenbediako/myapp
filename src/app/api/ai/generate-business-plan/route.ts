import { generateStructuredData, BusinessPlanSchema } from '@/lib/ai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const BusinessPlanRequestSchema = z.object({
  businessIdea: z.string().min(1, "Business idea is required"),
  industry: z.string().optional(),
  targetMarket: z.string().optional(),
  budget: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessIdea, industry, targetMarket, budget } = BusinessPlanRequestSchema.parse(body);

    const prompt = `Create a comprehensive business plan for the following business idea: "${businessIdea}"

${industry ? `Industry: ${industry}` : ''}
${targetMarket ? `Target Market: ${targetMarket}` : ''}
${budget ? `Budget Considerations: ${budget}` : ''}

Please provide a detailed business plan that includes:
1. A compelling title for the business
2. Executive summary that captures the essence of the business
3. Market analysis including target audience and competition
4. Business model explaining how the business will generate revenue
5. Financial projections with realistic estimates
6. Risk analysis identifying potential challenges and mitigation strategies

Make sure the business plan is practical, well-researched, and actionable.`;

    const result = await generateStructuredData(prompt, BusinessPlanSchema);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in generate-business-plan:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate business plan' },
      { status: 500 }
    );
  }
}
