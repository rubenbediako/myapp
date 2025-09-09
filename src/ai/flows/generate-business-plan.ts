
'use server';

/**
 * @fileOverview A flow for generating a comprehensive business plan.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateBusinessPlanInputSchema = z.object({
  idea: z.string().describe("The core business idea or concept."),
  industry: z.string().describe("The industry the business will operate in."),
  targetMarket: z.string().describe("The primary target audience or customer segment."),
  country: z.string().describe("The country where the business will be based, for context."),
});

export type GenerateBusinessPlanInput = z.infer<typeof GenerateBusinessPlanInputSchema>;

const GenerateBusinessPlanOutputSchema = z.object({
    title: z.string().describe("A catchy and professional title for the business plan."),
    executiveSummary: z.string().describe("A concise and compelling overview of the entire business plan, written in a professional tone."),
    companyDescription: z.string().describe("A detailed description of the business, its legal structure, mission, vision, and long-term objectives."),
    marketAnalysis: z.string().describe("A thorough analysis of the industry, target market size and demographics, and a detailed assessment of key competitors, their strengths, and weaknesses."),
    organizationAndManagement: z.string().describe("A detailed description of the business's organizational structure, the key management team members, their roles, and their expertise."),
    productsOrServices: z.string().describe("A highly detailed description of the products or services offered, including unique features, benefits, and competitive advantages."),
    marketingAndSales: z.string().describe("A comprehensive strategy for marketing and selling the products or services, including pricing, promotion, and distribution channels."),
    feasibilityAnalysis: z.string().describe("A detailed analysis of the business's feasibility, covering market feasibility (demand), technical feasibility (resources/tech), and operational feasibility (day-to-day execution)."),
    costBenefitAnalysis: z.string().describe("A detailed cost-benefit analysis, outlining all potential costs (startup, fixed, variable) against expected tangible and intangible benefits (revenue, market share, brand value)."),
    financialProjections: z.string().describe("A detailed summary of financial projections, including startup costs, a 3-year revenue forecast, profit and loss statement, and funding requirements."),
});

export type GenerateBusinessPlanOutput = z.infer<typeof GenerateBusinessPlanOutputSchema>;

export async function generateBusinessPlan(input: GenerateBusinessPlanInput): Promise<GenerateBusinessPlanOutput> {
  return generateBusinessPlanFlow(input);
}

const businessPlanPrompt = ai.definePrompt({
  name: 'generateBusinessPlanPrompt',
  input: { schema: GenerateBusinessPlanInputSchema },
  output: { schema: GenerateBusinessPlanOutputSchema },
  prompt: `You are Das, a highly intelligent economist and expert business consultant. A client has come to you with a business concept, and your task is to generate an exceptionally detailed, professional, and comprehensive business plan for them.

  The business will be based in {{{country}}}. Use this context to inform the plan with relevant market data and insights. Your analysis must be grounded in realistic, verifiable economic trends and figures for the specified country.

  Client's Input:
  - Business Idea: {{{idea}}}
  - Industry: {{{industry}}}
  - Target Market: {{{targetMarket}}}

  Generate a business plan with the following sections, ensuring each is thorough, well-researched, and written in a professional, persuasive tone:
  1.  **Title**: Create a professional title for the business.
  2.  **Executive Summary**: A compelling, concise summary of the entire plan.
  3.  **Company Description**: Detail what the business does, its legal structure, mission, and long-term vision.
  4.  **Market Analysis**: Deeply analyze the {{{industry}}}, the size and demographics of the {{{targetMarket}}}, and provide a sharp assessment of competitors. Use real data and figures.
  5.  **Organization and Management**: Outline the ideal team structure and the roles and expertise of key personnel.
  6.  **Products or Services**: Describe what is being sold in extensive detail, highlighting all unique features and benefits.
  7.  **Marketing and Sales Strategy**: Detail a multi-channel strategy for reaching and attracting customers, including pricing, promotion, and sales tactics.
  8.  **Feasibility Analysis**: Provide a rigorous assessment of market, technical, and operational feasibility.
  9.  **Cost-Benefit Analysis**: Conduct a detailed analysis comparing estimated costs (financial, time, resources) with potential benefits (revenue, market share, social impact). Be specific.
  10. **Financial Projections**: Provide a detailed high-level overview of expected financials, including startup costs, a 3-year revenue forecast, and funding requirements.

  The final output must be professional, highly detailed, and ready for presentation to investors.`,
});

const generateBusinessPlanFlow = ai.defineFlow(
  {
    name: 'generateBusinessPlanFlow',
    inputSchema: GenerateBusinessPlanInputSchema,
    outputSchema: GenerateBusinessPlanOutputSchema,
  },
  async (input) => {
    const { output } = await businessPlanPrompt(input);
    return output!;
  }
);
