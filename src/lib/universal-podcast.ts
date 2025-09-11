/**
 * Universal Podcast Service
 * Converts any app content into podcast format with AI-generated scripts and audio
 */

export interface PodcastLine {
  speaker: "Speaker1" | "Speaker2";
  line: string;
}

export interface UniversalPodcastOptions {
  contentType: 'course' | 'lesson' | 'dashboard' | 'personal-finance' | 'investment' | 'economics' | 'general';
  title: string;
  description?: string;
  data?: any;
  includeMath?: boolean;
  includeCharts?: boolean;
  includeStatistics?: boolean;
  audioPremium?: boolean;
}

export interface PodcastResponse {
  podcastScript: PodcastLine[];
  visualContent?: {
    equations?: Array<{
      title: string;
      latex: string;
      explanation: string;
      category: string;
      variables?: Array<{
        symbol: string;
        meaning: string;
        unit?: string;
      }>;
    }>;
    charts?: Array<{
      title: string;
      description: string;
      type: 'bar' | 'line' | 'pie' | 'function-plot';
      data: {
        labels: string[];
        values: number[];
        equation?: string;
      };
      xAxisLabel?: string;
      yAxisLabel?: string;
    }>;
    statistics?: Array<{
      label: string;
      value: string;
      context: string;
      formula?: string;
      source: string;
    }>;
    keyTerms?: Array<{
      term: string;
      definition: string;
      symbol?: string;
      formula?: string;
    }>;
  };
}

export class UniversalPodcastService {
  
  /**
   * Generate podcast content for any app feature
   */
  async generatePodcast(content: string, options: UniversalPodcastOptions): Promise<PodcastResponse> {
    const prompt = this.buildPrompt(content, options);
    
    try {
      const response = await fetch('/api/ai/ask-das-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: prompt,
          contentType: options.contentType,
          enhancedMode: true 
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate podcast: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Universal podcast generation error:', error);
      
      // Fallback podcast script
      return {
        podcastScript: [
          {
            speaker: "Speaker1",
            line: `Welcome to The Economist's AI-powered podcast on ${options.title}.`
          },
          {
            speaker: "Speaker2", 
            line: "Today we'll explore this topic with detailed analysis, mathematical insights, and real-world applications."
          },
          {
            speaker: "Speaker1",
            line: content.slice(0, 500) + "..."
          }
        ]
      };
    }
  }

  /**
   * Build detailed, factual prompt based on content type
   */
  private buildPrompt(content: string, options: UniversalPodcastOptions): string {
    const basePrompt = `You are Das, The Economist's AI Expert. Create a comprehensive, factual educational podcast script between an Economics Interviewer (Speaker1/Rita) and Expert Economist (Speaker2/Das) about "${options.title}".

CRITICAL REQUIREMENTS FOR FACTUAL CONTENT:
1. Use ONLY real, verifiable economic data and statistics
2. Reference actual economic events, policies, and historical data
3. Never create fictional companies, scenarios, or data points
4. Cite real sources and timeframes for all statistics
5. Use established economic theories and principles
6. Include real-world case studies from actual countries/economies
7. MANDATORY: Host (Speaker1) must provide comprehensive conclusion at the end

MATHEMATICAL NOTATION GUIDELINES:
- Use LaTeX format for equations: $GDP = C + I + G + (X - M)$
- Include variable definitions: where C = consumption, I = investment, etc.
- For audio reading, provide phonetic equivalents: "GDP equals C plus I plus G plus X minus M"
- Use internationally accepted economic symbols and notation
- Reference standard economic formulas from textbooks
- When presenting equations, explain them verbally for audio: "The formula reads as..."
- Use proper mathematical language: "is equal to", "plus", "minus", "multiplied by", "divided by"
- For complex formulas, break them down into components
- Use descriptive language for Greek letters: "sigma for standard deviation", "beta for risk coefficient"
- Explain statistical concepts in plain language alongside mathematical notation

AUDIO-FRIENDLY MATHEMATICAL PRESENTATION:
- Before stating a formula, say "The mathematical expression is" or "The formula reads as"
- Use clear pronunciation guides for mathematical terms
- Explain symbols: "The Greek letter alpha represents the intercept"
- Break complex equations into parts: "This formula has three main components"
- Provide real-world interpretations of mathematical relationships

CONCLUSION REQUIREMENT:
- Speaker1 (Host) MUST end the podcast with a comprehensive summary
- Summarize all key points discussed
- Highlight the most important takeaways
- Connect the topic to broader economic concepts
- Thank the expert and close the conversation professionally`;
    
    let specificInstructions = '';
    
    switch (options.contentType) {
      case 'course':
      case 'lesson':
        specificInstructions = `
          EDUCATIONAL RIGOR Requirements:
          - Start with precise definition and historical origins
          - Include founding economists and their contributions
          - Mathematical models with LaTeX notation: $equations$
          - Statistical evidence from multiple countries and time periods
          - Case studies with specific data, years, and outcomes
          - Assessment of different schools of economic thought
          - Practical applications in modern economic policy
          - Learning objectives with measurable outcomes
          - Progressive complexity building from basic principles
        `;
        break;
        
      case 'dashboard':
        specificInstructions = `
          COMPREHENSIVE ECONOMIC ANALYSIS Requirements:
          - Macroeconomic indicators: GDP, inflation, unemployment with current data
          - Statistical analysis of economic trends with specific numbers
          - Mathematical relationships: $\\frac{\\Delta GDP}{GDP} \\times 100 = \\text{Growth Rate}$
          - Policy implications backed by economic research
          - International comparisons with specific data points
          - Forward-looking analysis based on economic modeling
          - Historical context with dates and specific events
        `;
        break;
        
      case 'personal-finance':
        specificInstructions = `
          PRACTICAL FINANCIAL LITERACY Requirements:
          - Fundamental principles of money management and compound interest: $FV = PV(1+r)^n$
          - Statistical data on savings rates, debt levels, investment returns
          - Behavioral economics insights backed by research (Kahneman, Thaler)
          - Real examples with specific dollar amounts and timeframes
          - Economic indicators affecting personal financial decisions
          - Evidence-based strategies from financial research
          - Mathematical formulas for loans, investments, retirement planning
        `;
        break;
        
      case 'investment':
        specificInstructions = `
          INVESTMENT ANALYSIS Requirements:
          - Modern Portfolio Theory and CAPM with mathematical foundations: $r_i = r_f + \\beta_i(r_m - r_f)$
          - Historical market data and performance statistics
          - Risk metrics: standard deviation ($\\sigma$), beta ($\\beta$), Sharpe ratio
          - Economic indicators and quantitative impact on markets
          - Real case studies from major market events with specific dates and numbers
          - Valuation models: DCF, P/E ratios, dividend discount model
          - Behavioral finance research and market efficiency theories
        `;
        break;
        
      case 'economics':
        specificInstructions = `
          COMPREHENSIVE ECONOMIC THEORY Requirements:
          - Microeconomic principles: supply and demand curves, elasticity formulas
          - Macroeconomic models: IS-LM, Phillips Curve, production functions
          - Historical development from Adam Smith to modern economists
          - Mathematical representations of economic relationships
          - Statistical analysis of economic trends across countries and time
          - Policy implications backed by economic research and historical evidence
          - Comparative economic systems with specific examples
        `;
        break;
        
      default:
        specificInstructions = `
          COMPREHENSIVE ECONOMIC FOUNDATIONS Requirements:
          - Fundamental economic principles and their mathematical expressions
          - Historical context and evolution of economic thought
          - Statistical evidence and real-world data with sources
          - Practical applications in modern economic systems
          - Critical analysis of different economic perspectives
        `;
    }

    const mathInstructions = options.includeMath ? `
      Include mathematical content:
      - Economic formulas in LaTeX format
      - Statistical calculations
      - Graphical representations
      - Quantitative analysis
    ` : '';

    const chartInstructions = options.includeCharts ? `
      Include data visualizations:
      - Charts and graphs
      - Trend analysis
      - Comparative data
      - Statistical distributions
    ` : '';

    const statisticsInstructions = options.includeStatistics ? `
      Include key statistics:
      - Economic indicators
      - Performance metrics
      - Historical data points
      - Comparative statistics
    ` : '';

    return `${basePrompt}

    ${specificInstructions}
    ${mathInstructions}
    ${chartInstructions}
    ${statisticsInstructions}

    Content to analyze: ${content}

    ${options.data ? `Additional data: ${JSON.stringify(options.data)}` : ''}

    PODCAST STRUCTURE REQUIREMENTS:
    1. Introduction by Speaker1 (Host) - engaging opening
    2. Educational discussion between both speakers
    3. Mathematical and statistical analysis when relevant
    4. Real-world examples and applications
    5. MANDATORY: Comprehensive conclusion by Speaker1 (Host) that:
       - Summarizes all key points discussed
       - Highlights the most important takeaways
       - Connects the topic to broader economic concepts
       - Thanks the expert professionally
       - Provides clear closure to the conversation

    FACTUAL CONTENT ONLY:
    - Use real economic data and events
    - Reference actual policies and countries
    - Cite established economic theories
    - Include verifiable statistics with sources
    - Never create fictional scenarios or data

    Respond with a JSON object containing:
    - podcastScript: Array of {speaker, line} objects (8-15 lines total)
    - visualContent: Object with equations, charts, statistics, and keyTerms arrays

    Ensure the podcast ends with Speaker1 providing a thorough conclusion.`;
  }

  /**
   * Generate podcast for dashboard data
   */
  async generateDashboardPodcast(countryData: any, selectedCountry: string): Promise<PodcastResponse> {
    const content = `Economic Dashboard Analysis for ${selectedCountry}. 
    GDP data, inflation rates, unemployment figures, and economic growth trends.
    Current economic indicators and their implications for policy and investment decisions.`;
    
    return this.generatePodcast(content, {
      contentType: 'dashboard',
      title: `Economic Dashboard: ${selectedCountry}`,
      description: 'Comprehensive analysis of economic indicators and trends',
      data: countryData,
      includeMath: true,
      includeCharts: true,
      includeStatistics: true,
      audioPremium: true
    });
  }

  /**
   * Generate podcast for personal finance analysis
   */
  async generatePersonalFinancePodcast(
    income: string,
    expenses: string,
    country: string,
    age: string,
    goals: string[]
  ): Promise<PodcastResponse> {
    const content = `Personal Finance Analysis for someone aged ${age} in ${country}.
    Monthly income: ${income}, Monthly expenses: ${expenses}.
    Financial goals: ${goals.join(', ')}.
    Provide comprehensive financial planning advice, budgeting strategies, and investment recommendations.`;
    
    return this.generatePodcast(content, {
      contentType: 'personal-finance',
      title: 'Personal Finance Analysis',
      description: 'Customized financial planning and investment advice',
      data: { income, expenses, country, age, goals },
      includeMath: true,
      includeCharts: true,
      includeStatistics: true,
      audioPremium: true
    });
  }

  /**
   * Generate podcast for investment analysis
   */
  async generateInvestmentPodcast(investmentData: any): Promise<PodcastResponse> {
    const content = `Investment Analysis and Market Insights.
    Portfolio analysis, risk assessment, and return projections.
    Market trends and investment opportunities across different asset classes.`;
    
    return this.generatePodcast(content, {
      contentType: 'investment',
      title: 'Investment Analysis',
      description: 'Professional investment insights and market analysis',
      data: investmentData,
      includeMath: true,
      includeCharts: true,
      includeStatistics: true,
      audioPremium: true
    });
  }

  /**
   * Generate podcast for economic concepts
   */
  async generateEconomicsPodcast(topic: string, data?: any): Promise<PodcastResponse> {
    const content = `Economics Topic: ${topic}.
    Comprehensive analysis of economic principles, theories, and real-world applications.
    Mathematical models, statistical analysis, and policy implications.`;
    
    return this.generatePodcast(content, {
      contentType: 'economics',
      title: topic,
      description: 'In-depth economic analysis and insights',
      data,
      includeMath: true,
      includeCharts: true,
      includeStatistics: true,
      audioPremium: true
    });
  }

  /**
   * Generate podcast for general content
   */
  async generateGeneralPodcast(title: string, content: string, data?: any): Promise<PodcastResponse> {
    return this.generatePodcast(content, {
      contentType: 'general',
      title,
      description: 'Educational content with AI-powered insights',
      data,
      includeMath: true,
      includeCharts: true,
      includeStatistics: true,
      audioPremium: true
    });
  }
}

// Export singleton instance
export const universalPodcastService = new UniversalPodcastService();
