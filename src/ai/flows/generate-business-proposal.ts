
'use server';

/**
 * @fileOverview A flow for generating a professional business proposal.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateBusinessProposalInputSchema = z.object({
  clientName: z.string().describe("The name of the potential client or company."),
  projectDescription: z.string().describe("A brief description of the client's project or problem."),
  proposedSolution: z.string().describe("A summary of the products or services you are offering."),
  timeline: z.string().optional().describe("An optional estimated timeline for the project (e.g., '4-6 weeks', 'Q3 2024')."),
  costAndPayment: z.string().optional().describe("Optional details about the cost, pricing, and payment terms (e.g., '$5,000 payable in two installments')."),
});

export type GenerateBusinessProposalInput = z.infer<typeof GenerateBusinessProposalInputSchema>;

const GenerateBusinessProposalOutputSchema = z.object({
    title: z.string().describe("A professional title for the business proposal (e.g., 'Proposal for Web Development Services for ABC Corp')."),
    preparedFor: z.string().describe("The name of the client the proposal is for."),
    introduction: z.string().describe("A compelling introduction that grabs the client's attention and briefly introduces your company."),
    understandingTheNeed: z.string().describe("A section that demonstrates your understanding of the client's problem, needs, and goals."),
    proposedSolution: z.string().describe("A detailed description of the solution you are offering, highlighting the features and benefits."),
    scopeOfWork: z.string().describe("A clear and detailed list of the specific deliverables, tasks, and services that will be provided."),
    timeline: z.string().describe("A proposed timeline for the project, outlining key phases and milestones. If no input is provided, create a reasonable, standard timeline."),
    costAndInvestment: z.string().describe("A clear breakdown of the costs, pricing structure, and payment terms. If no input is provided, create a sample pricing table."),
    aboutUs: z.string().describe("A brief, professional overview of your company, its expertise, and its qualifications."),
    nextSteps: z.string().describe("A clear call to action, outlining the next steps for the client to proceed with the proposal."),
});

export type GenerateBusinessProposalOutput = z.infer<typeof GenerateBusinessProposalOutputSchema>;

export async function generateBusinessProposal(input: GenerateBusinessProposalInput): Promise<GenerateBusinessProposalOutput> {
  return generateBusinessProposalFlow(input);
}

const businessProposalPrompt = ai.definePrompt({
  name: 'generateBusinessProposalPrompt',
  input: { schema: GenerateBusinessProposalInputSchema },
  output: { schema: GenerateBusinessProposalOutputSchema },
  prompt: `You are Das, a highly intelligent economist and expert business consultant. A user needs you to generate a highly professional, detailed, and persuasive business proposal to win a new client.

  Client & Project Information:
  - Client Name: {{{clientName}}}
  - Project Description / Problem: {{{projectDescription}}}
  - Proposed Solution: {{{proposedSolution}}}
  - Provided Timeline (Optional): {{{timeline}}}
  - Provided Cost & Payment (Optional): {{{costAndPayment}}}

  Your task is to generate a comprehensive business proposal with the following sections. Each section must be well-written, clear, and professional.

  1.  **Title**: Create a professional title for the proposal.
  2.  **Prepared For**: Use the client's name.
  3.  **Introduction**: Write a strong opening that introduces your business and the purpose of the proposal.
  4.  **Understanding the Need**: Show you've listened. Elaborate on the client's problem ({{{projectDescription}}}) to demonstrate a deep understanding of their needs and goals.
  5.  **Proposed Solution**: Detail the solution ({{{proposedSolution}}}). Explain how it directly addresses the client's need and what the key benefits are. Be specific.
  6.  **Scope of Work**: Create a detailed, itemized list of deliverables and tasks. Be very clear about what is included in the project.
  7.  **Timeline**: If a timeline was provided ({{{timeline}}}), use it to create a phased project plan. If not, create a realistic, sample project timeline with key milestones (e.g., Week 1-2: Discovery, Week 3-4: Development, etc.).
  8.  **Cost & Investment**: If cost information was provided ({{{costAndPayment}}}), present it clearly. If not, create a professional-looking sample pricing table with a breakdown of services and costs. Include payment terms.
  9.  **About Us**: Write a brief, confident paragraph about why your company is the right choice for this project. Mention expertise and commitment.
  10. **Next Steps**: Provide a clear call to action. Tell the client exactly what to do next to move forward (e.g., "To proceed, please sign and return this proposal...").

  The final output must be professional, highly detailed, and ready to be sent to a client.`,
});

const generateBusinessProposalFlow = ai.defineFlow(
  {
    name: 'generateBusinessProposalFlow',
    inputSchema: GenerateBusinessProposalInputSchema,
    outputSchema: GenerateBusinessProposalOutputSchema,
  },
  async (input) => {
    const { output } = await businessProposalPrompt(input);
    return output!;
  }
);
