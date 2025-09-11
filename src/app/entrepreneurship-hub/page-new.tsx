'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Building2, Lightbulb, TrendingUp, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UniversalPodcastPlayer } from '@/components/universal-podcast-player';

const entrepreneurshipTopics = [
    "Venture Capital Funding",
    "Lean Startup Methodology", 
    "Social Entrepreneurship",
    "Intellectual Property for Startups",
    "Digital Marketing for Startups",
    "Business Model Innovation",
    "Scaling and Growth Strategies",
    "Angel Investment and Fundraising",
    "Market Research and Validation",
    "Product Development Process"
];

const businessTypes = [
    "Technology Startup",
    "E-commerce Business", 
    "Service-based Business",
    "Manufacturing Company",
    "Consulting Firm",
    "Restaurant/Food Service",
    "Retail Store",
    "SaaS Platform",
    "Mobile App",
    "Subscription Business"
];

export default function EntrepreneurshipHub() {
  const { toast } = useToast();
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [businessType, setBusinessType] = useState<string>("");
  const [businessIdea, setBusinessIdea] = useState<string>("");
  const [targetMarket, setTargetMarket] = useState<string>("");
  const [budget, setBudget] = useState<string>("");

  const getTopicContent = (topic: string) => {
    const topicContents: { [key: string]: string } = {
      "Venture Capital Funding": `
        Venture Capital Funding - Complete Guide for Entrepreneurs

        Introduction to Venture Capital:
        Venture capital (VC) is a form of private equity financing that investors provide to startup companies and small businesses that are believed to have long-term growth potential. Unlike traditional bank loans, venture capital involves equity investment where investors receive ownership stakes in exchange for funding.

        Understanding the VC Ecosystem:
        The venture capital ecosystem consists of several key players: venture capital firms, limited partners (pension funds, endowments, wealthy individuals), angel investors, accelerators, and entrepreneurs. Each plays a crucial role in the funding lifecycle.

        Types of VC Funding Rounds:
        - Pre-Seed: Initial funding to develop proof of concept ($50K-$500K)
        - Seed Round: Early-stage funding for market validation ($500K-$2M)
        - Series A: Growth capital for proven business models ($2M-$15M)
        - Series B: Scaling operations and market expansion ($10M-$50M+)
        - Series C and beyond: International expansion and acquisition preparation

        What VCs Look For:
        1. Market Size and Opportunity: Total Addressable Market (TAM) of at least $1 billion
        2. Strong Management Team: Experienced, coachable, and committed founders
        3. Scalable Business Model: Ability to grow revenue without proportional cost increases
        4. Competitive Advantage: Unique value proposition and defensible market position
        5. Traction and Metrics: Proven customer demand and growth trajectory
        6. Clear Exit Strategy: IPO potential or acquisition opportunities

        Preparing for VC Funding:
        - Develop a compelling pitch deck (10-15 slides)
        - Prepare detailed financial projections (3-5 years)
        - Build a strong advisory board
        - Establish key performance indicators (KPIs)
        - Create a data room with legal and financial documents
        - Practice your pitch extensively

        The Due Diligence Process:
        VCs conduct thorough due diligence including market research, competitive analysis, financial audits, legal review, reference checks, and technical validation. This process typically takes 3-6 months.

        Term Sheets and Negotiations:
        Key terms include valuation, liquidation preferences, board composition, anti-dilution provisions, voting rights, and employee stock option pools. Understanding these terms is crucial for maintaining control and maximizing founder value.

        Post-Investment Relationship:
        Successful VC relationships involve regular board meetings, strategic guidance, network introductions, follow-on funding support, and exit preparation. VCs become strategic partners, not just financial investors.

        Alternative Funding Options:
        Consider angel investors, crowdfunding, revenue-based financing, government grants, bank loans, and bootstrapping as alternatives or supplements to VC funding.

        Success Stories and Lessons:
        Study successful VC-backed companies like Uber, Airbnb, and Spotify to understand how they leveraged venture capital for exponential growth while maintaining their vision and culture.
      `,
      "Lean Startup Methodology": `
        Lean Startup Methodology - Building Successful Businesses Through Validated Learning

        Introduction to Lean Startup:
        The Lean Startup methodology, developed by Eric Ries, is a revolutionary approach to building businesses that emphasizes rapid experimentation, validated learning, and iterative product development. This methodology reduces waste, minimizes risk, and increases the likelihood of startup success.

        Core Principles:
        1. Build-Measure-Learn Cycle: The fundamental feedback loop of creating minimal viable products, measuring customer response, and learning from results
        2. Validated Learning: Using scientific methods to test hypotheses about your business model
        3. Innovation Accounting: Measuring progress through actionable metrics rather than vanity metrics
        4. Minimum Viable Product (MVP): The simplest version of a product that allows maximum learning with minimum effort

        The Build-Measure-Learn Cycle:
        Build: Create the smallest possible product to test your hypothesis
        Measure: Collect data on how customers interact with your product
        Learn: Analyze the data to validate or invalidate your assumptions
        Iterate: Use insights to improve your product or pivot your strategy

        Developing Your MVP:
        Start with your riskiest assumptions and design experiments to test them. Your MVP should focus on core functionality that addresses your value hypothesis (does your product create value?) and growth hypothesis (how will customers discover your product?).

        Types of MVPs:
        - Landing Page MVP: Test demand before building
        - Concierge MVP: Manually deliver the service
        - Wizard of Oz MVP: Fake the backend functionality
        - Feature Fake MVP: Pretend features exist to gauge interest
        - Piecemeal MVP: Combine existing tools and services

        Validated Learning Process:
        1. Identify your leap-of-faith assumptions
        2. Design experiments to test these assumptions
        3. Build the minimum features needed for the experiment
        4. Measure customer behavior and feedback
        5. Learn whether to persevere or pivot

        Pivot Strategies:
        When data shows your current approach isn't working, consider these pivot types:
        - Zoom-in Pivot: Focus on a single feature
        - Zoom-out Pivot: Expand to include more features
        - Customer Segment Pivot: Target a different customer group
        - Customer Need Pivot: Solve a different problem for the same customers
        - Platform Pivot: Change from application to platform or vice versa
        - Business Architecture Pivot: Switch between high-margin/low-volume and low-margin/high-volume
        - Value Capture Pivot: Change your monetization strategy
        - Engine of Growth Pivot: Change your growth strategy
        - Channel Pivot: Change how you reach customers
        - Technology Pivot: Use different technology to solve the same problem

        Metrics That Matter:
        Focus on actionable metrics rather than vanity metrics:
        - Customer Acquisition Cost (CAC)
        - Lifetime Value (LTV)
        - Monthly Recurring Revenue (MRR)
        - Churn Rate
        - Net Promoter Score (NPS)
        - Daily/Monthly Active Users
        - Conversion Rates

        Innovation Accounting:
        Establish baseline metrics, tune the engine through experiments, and decide whether to pivot or persevere based on results. Use cohort analysis to understand customer behavior over time.

        Building a Learning Organization:
        Create a culture that embraces experimentation, failure as learning, data-driven decisions, and continuous improvement. Encourage rapid prototyping and customer feedback integration.

        Common Lean Startup Mistakes:
        - Building too much before testing
        - Ignoring customer feedback
        - Focusing on vanity metrics
        - Not pivoting when necessary
        - Perfectionism over iteration
        - Scaling before finding product-market fit

        Success Stories:
        Companies like Dropbox, Instagram, and Buffer successfully used lean startup principles to build billion-dollar businesses by starting small, testing assumptions, and iterating based on customer feedback.
      `,
      "Social Entrepreneurship": `
        Social Entrepreneurship - Creating Sustainable Solutions for Social Problems

        Introduction to Social Entrepreneurship:
        Social entrepreneurship combines the passion of a social mission with the discipline of business to create sustainable solutions to social problems. Social entrepreneurs identify market failures in society and develop innovative approaches to address them while generating revenue.

        Defining Social Entrepreneurship:
        Social entrepreneurship is characterized by:
        - Primary mission to create social value, not just private value
        - Recognition and pursuit of new opportunities to serve that mission
        - Continuous innovation, adaptation, and learning
        - Bold action without being limited by current resources
        - Accountability to constituencies served and outcomes created

        Types of Social Enterprises:
        1. For-Profit Social Ventures: Traditional businesses with social missions
        2. Hybrid Organizations: Blend of profit and non-profit structures
        3. Non-Profit Enterprises: Non-profits using business strategies
        4. Corporate Social Responsibility: Large corporations addressing social issues
        5. Social Impact Bonds: Innovative financing for social outcomes

        Identifying Social Problems:
        Successful social entrepreneurs identify problems through:
        - Personal experience with the issue
        - Community needs assessment
        - Research and data analysis
        - Stakeholder consultation
        - Gap analysis in existing services

        Developing Your Theory of Change:
        Create a logical framework that explains how your activities will lead to desired social outcomes:
        1. Define the social problem clearly
        2. Identify root causes
        3. Determine your target beneficiaries
        4. Design interventions and activities
        5. Map expected outputs, outcomes, and impact
        6. Establish measurement indicators

        Business Model Innovation:
        Social enterprises often require innovative business models:
        - Cross-subsidization: Profitable customers subsidize social customers
        - Base of the Pyramid: Serving low-income markets profitably
        - Platform Models: Connecting beneficiaries with resources
        - Freemium Models: Free basic services, premium paid features
        - Cooperative Models: Shared ownership and governance

        Funding Strategies:
        Social entrepreneurs can access diverse funding sources:
        - Impact Investors: Seeking financial and social returns
        - Foundations and Grants: Supporting specific social causes
        - Crowdfunding: Community-based fundraising
        - Government Contracts: Public sector partnerships
        - Revenue Generation: Earned income strategies
        - Social Impact Bonds: Pay-for-success contracts

        Measuring Social Impact:
        Develop robust measurement systems:
        - Define clear social objectives
        - Establish baseline measurements
        - Track outputs, outcomes, and impact
        - Use standardized metrics when possible
        - Conduct regular evaluations and assessments
        - Report transparently to stakeholders

        Social Impact Measurement Frameworks:
        - Social Return on Investment (SROI)
        - Logic Models
        - Balanced Scorecard
        - Impact Measurement and Management (IMM)
        - UN Sustainable Development Goals alignment

        Building Partnerships:
        Successful social enterprises build strong partnerships with:
        - Government agencies
        - Non-profit organizations
        - Corporate partners
        - Academic institutions
        - Community organizations
        - International development agencies

        Scaling Social Impact:
        Strategies for scaling include:
        - Direct Scaling: Growing your own organization
        - Franchising: Licensing your model to others
        - Open Source: Sharing your methodology freely
        - Government Adoption: Integrating into public policy
        - Corporate Partnership: Working with large companies

        Legal Structures:
        Choose appropriate legal structures:
        - Benefit Corporations (B-Corps)
        - Limited Liability Companies (LLCs)
        - Community Interest Companies (CICs)
        - Cooperative Organizations
        - Hybrid Structures

        Success Stories:
        Learn from successful social entrepreneurs like Muhammad Yunus (microfinance), Bill Drayton (Ashoka), and Melinda Gates (global health) who have created sustainable solutions to major social problems.

        Challenges and Solutions:
        Common challenges include balancing social and financial objectives, measuring impact, accessing appropriate funding, building sustainable revenue models, and scaling operations while maintaining mission focus.
      `
    };

    return topicContents[topic] || `
      ${topic} - Comprehensive Guide for Entrepreneurs

      This is a detailed analysis of ${topic} from an entrepreneurial perspective. This guide covers the fundamental concepts, implementation strategies, best practices, common challenges, and success stories related to ${topic}.

      Our AI-powered analysis provides you with actionable insights, real-world examples, and practical advice to help you understand and implement ${topic} effectively in your entrepreneurial journey.

      This podcast covers everything you need to know about ${topic}, including current trends, future outlook, and how it applies to different types of businesses and industries.
    `;
  };

  const getBusinessPlanContent = () => {
    if (!businessType || !businessIdea) return "";

    return `
      Comprehensive Business Plan for ${businessType}: ${businessIdea}

      Executive Summary:
      This business plan outlines the strategy and implementation roadmap for ${businessIdea}, a ${businessType.toLowerCase()} targeting ${targetMarket || 'identified market segments'}. Our analysis covers market opportunity, competitive landscape, operational strategy, financial projections, and growth plans.

      Business Concept and Value Proposition:
      ${businessIdea} addresses specific market needs through innovative solutions. As a ${businessType.toLowerCase()}, we focus on delivering exceptional value to our target customers while building a sustainable and scalable business model.

      Market Analysis:
      Our target market consists of ${targetMarket || 'various customer segments'} who are seeking solutions in this space. Market research indicates significant opportunity for growth and expansion in this sector.

      Product/Service Offering:
      Our core offering centers around ${businessIdea}, designed to solve key problems and create value for our customers. We will continuously innovate and improve our offerings based on market feedback and changing customer needs.

      Business Model:
      Our revenue model incorporates multiple streams including direct sales, subscriptions, partnerships, and additional services. This diversified approach ensures stable revenue generation and growth potential.

      Operations Plan:
      We will establish efficient operations including supply chain management, quality control, customer service, and technology infrastructure. Our operational strategy focuses on scalability and efficiency.

      Marketing and Sales Strategy:
      Our go-to-market strategy includes digital marketing, content marketing, partnerships, and direct sales. We will leverage both online and offline channels to reach our target customers effectively.

      Management Team:
      Our leadership team brings together expertise in technology, business development, marketing, and operations. We are committed to building a strong organizational culture and attracting top talent.

      Financial Projections:
      Based on a startup budget of ${budget || 'to be determined'}, our financial model projects revenue growth, expense management, and profitability timelines. We anticipate break-even within 18-24 months.

      Funding Requirements:
      We are seeking investment to fuel growth, expand operations, and accelerate market penetration. The funding will be used for product development, marketing, team expansion, and working capital.

      Risk Analysis:
      We have identified key risks including market competition, regulatory changes, technology disruptions, and operational challenges. Our mitigation strategies address each of these areas proactively.

      Growth Strategy:
      Our expansion plans include geographic growth, product line extensions, strategic partnerships, and potential acquisitions. We aim to become a market leader in our sector.

      Exit Strategy:
      Long-term exit opportunities include strategic acquisition by industry leaders or public offering once we achieve significant scale and market position.

      Implementation Timeline:
      Our 12-month roadmap includes product development milestones, market entry strategies, team building phases, and key performance indicators to track progress.

      This comprehensive business plan provides the foundation for building a successful ${businessType.toLowerCase()} and achieving our vision for ${businessIdea}.
    `;
  };

  const podcastOptions = {
    generateAudio: true,
    audioPremium: true,
    includeMusic: true,
    voice: 'alloy' as const,
    includeVisuals: true,
    includeCharts: true,
    includeMath: true
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          <Building2 className="inline-block w-8 h-8 mr-2 text-primary" />
          Entrepreneurship Hub
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Transform your business ideas into reality with AI-powered podcast guidance, comprehensive business plans, and expert entrepreneurial insights.
        </p>
      </div>

      <Tabs defaultValue="topics" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="topics">
            <Lightbulb className="w-4 h-4 mr-2" />
            Topic Deep Dives
          </TabsTrigger>
          <TabsTrigger value="business-plan">
            <Target className="w-4 h-4 mr-2" />
            Business Planning
          </TabsTrigger>
          <TabsTrigger value="growth">
            <TrendingUp className="w-4 h-4 mr-2" />
            Growth Strategies
          </TabsTrigger>
        </TabsList>

        <TabsContent value="topics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Entrepreneurship Topic Deep Dives
              </CardTitle>
              <CardDescription>
                Select any entrepreneurship topic for a comprehensive podcast analysis with actionable insights and strategies.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Topic</Label>
                <Select onValueChange={setSelectedTopic} value={selectedTopic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an entrepreneurship topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {entrepreneurshipTopics.map(topic => (
                      <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTopic && (
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedTopic} - Expert Analysis</CardTitle>
                    <CardDescription>
                      Comprehensive podcast covering all aspects of {selectedTopic}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UniversalPodcastPlayer
                      title={`${selectedTopic} - Complete Guide`}
                      content={getTopicContent(selectedTopic)}
                      options={podcastOptions}
                      autoGenerate={false}
                    />
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business-plan" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                AI Business Plan Generator
              </CardTitle>
              <CardDescription>
                Create a comprehensive business plan podcast tailored to your specific business idea and goals.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Business Type</Label>
                  <Select onValueChange={setBusinessType} value={businessType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Target Market</Label>
                  <Input
                    placeholder="e.g., Small businesses, Millennials, B2B companies"
                    value={targetMarket}
                    onChange={(e) => setTargetMarket(e.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Business Idea</Label>
                  <Textarea
                    placeholder="Describe your business idea, product, or service in detail..."
                    value={businessIdea}
                    onChange={(e) => setBusinessIdea(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Startup Budget</Label>
                  <Input
                    placeholder="e.g., $10,000, $50,000, $100,000+"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  />
                </div>
              </div>

              {businessIdea && businessType && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Business Plan Podcast</CardTitle>
                    <CardDescription>
                      Comprehensive business plan for {businessIdea}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UniversalPodcastPlayer
                      title={`Business Plan: ${businessIdea}`}
                      content={getBusinessPlanContent()}
                      options={podcastOptions}
                      autoGenerate={false}
                    />
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Growth and Scaling Strategies
              </CardTitle>
              <CardDescription>
                Learn proven strategies for scaling your business and achieving sustainable growth.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UniversalPodcastPlayer
                title="Business Growth and Scaling Strategies"
                content={`
                  Comprehensive Guide to Business Growth and Scaling Strategies

                  Introduction to Business Growth:
                  Business growth is the process of improving your company's performance through increased revenue, expanded market share, enhanced profitability, and sustainable scaling. Successful growth requires strategic planning, operational excellence, and continuous innovation.

                  Types of Business Growth:
                  1. Organic Growth: Internal expansion through increased sales, new products, or market penetration
                  2. Inorganic Growth: External expansion through mergers, acquisitions, or partnerships
                  3. Strategic Growth: Targeted expansion into new markets or customer segments
                  4. Financial Growth: Improved profitability and cash flow optimization

                  Growth Strategy Framework:
                  Market Penetration: Sell more to existing customers in current markets
                  Market Development: Enter new markets with existing products
                  Product Development: Create new products for existing markets
                  Diversification: Develop new products for new markets

                  Scaling Operations:
                  - Automate repetitive processes and workflows
                  - Build scalable technology infrastructure
                  - Develop standardized procedures and training
                  - Create efficient supply chain and logistics
                  - Implement quality control systems
                  - Build strong organizational culture

                  Financial Management for Growth:
                  - Monitor cash flow and working capital
                  - Secure appropriate funding for expansion
                  - Manage debt and equity financing
                  - Optimize pricing strategies
                  - Control costs and improve margins
                  - Plan for seasonal fluctuations

                  Building High-Performance Teams:
                  - Hire for culture fit and growth potential
                  - Develop leadership at all levels
                  - Create clear roles and responsibilities
                  - Implement performance management systems
                  - Foster innovation and creativity
                  - Build retention and engagement programs

                  Marketing and Customer Acquisition:
                  - Develop strong brand positioning
                  - Optimize digital marketing channels
                  - Build customer referral programs
                  - Create content marketing strategies
                  - Leverage social media and influencer partnerships
                  - Focus on customer lifetime value

                  Technology and Innovation:
                  - Invest in digital transformation
                  - Automate business processes
                  - Use data analytics for decision making
                  - Build customer relationship management systems
                  - Develop mobile and online capabilities
                  - Stay current with industry trends

                  International Expansion:
                  - Research target markets thoroughly
                  - Understand cultural and regulatory differences
                  - Develop local partnerships
                  - Adapt products and services for local markets
                  - Build international supply chains
                  - Manage currency and political risks

                  Common Growth Challenges:
                  - Cash flow management during rapid expansion
                  - Maintaining company culture during scaling
                  - Finding and retaining qualified talent
                  - Managing increased operational complexity
                  - Balancing growth speed with quality
                  - Avoiding overextension and loss of focus

                  Growth Metrics and KPIs:
                  - Revenue growth rate
                  - Customer acquisition cost (CAC)
                  - Customer lifetime value (CLV)
                  - Monthly recurring revenue (MRR)
                  - Gross and net profit margins
                  - Market share and competitive position

                  Exit Strategy Planning:
                  - Prepare for potential sale or IPO
                  - Build strong financial and operational systems
                  - Develop key management talent
                  - Create intellectual property assets
                  - Build strategic partnerships
                  - Maintain clean legal and financial records

                  Success Stories and Case Studies:
                  Learn from companies that have successfully scaled from startups to market leaders through strategic growth planning, operational excellence, and customer focus.
                `}
                options={podcastOptions}
                autoGenerate={false}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
