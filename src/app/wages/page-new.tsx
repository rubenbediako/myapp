'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, Users, BarChart3, Briefcase, Mic } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { UniversalPodcastPlayer } from '@/components/universal-podcast-player';
import { countryNameMap } from '@/data/economic-data';

const countries = Object.keys(countryNameMap);

const wageSectors = [
    'Technology and IT',
    'Healthcare and Medical',
    'Finance and Banking',
    'Manufacturing',
    'Education',
    'Retail and Hospitality',
    'Government and Public Sector',
    'Construction and Engineering',
    'Transportation and Logistics',
    'Media and Entertainment'
];

const wageAnalysisTypes = [
    'Gender Pay Gap Analysis',
    'Minimum Wage Impact Study',
    'Executive Compensation Trends',
    'Gig Economy Wage Patterns',
    'Remote Work Salary Adjustments',
    'Skills-Based Pay Analysis',
    'Regional Wage Disparities',
    'Union vs Non-Union Wage Comparison'
];

export default function WagesPage() {
    const [selectedCountry, setSelectedCountry] = useState<string>('France');
    const [selectedSector, setSelectedSector] = useState<string>('');
    const [selectedAnalysis, setSelectedAnalysis] = useState<string>('');

    const getWageAnalysisContent = (country: string) => {
        return `
            Comprehensive Wage Analysis for ${countryNameMap[country] || country}

            Introduction to Labor Economics and Wage Determination:
            Wages represent the price of labor in the economy and are influenced by supply and demand forces, government policies, institutional factors, and economic conditions. Understanding wage dynamics is crucial for workers, employers, and policymakers in creating fair and efficient labor markets.

            Current Wage Landscape in ${countryNameMap[country] || country}:

            National Wage Statistics:
            - Average gross monthly salary: Varies by sector and region
            - Median household income and distribution patterns
            - Real wage growth adjusted for inflation over past decade
            - Income inequality measures (Gini coefficient)
            - Purchasing power parity adjustments for international comparisons

            Minimum Wage Framework:
            - Current minimum wage rates and recent adjustments
            - Regional variations and sector-specific minimums
            - Comparison with living wage calculations
            - Coverage and exemptions in minimum wage legislation
            - Impact on employment levels and business costs

            Sectoral Wage Analysis:

            High-Paying Sectors:
            - Technology and software development: Premium for digital skills
            - Finance and banking: Risk-adjusted compensation models
            - Healthcare professionals: Specialized skill premiums
            - Legal services: Experience and specialization factors
            - Energy and utilities: Technical expertise requirements

            Service Sector Wages:
            - Retail and hospitality: Entry-level and management tiers
            - Education: Public vs. private sector variations
            - Transportation: Skill level and safety considerations
            - Personal services: Tip culture and total compensation

            Industrial and Manufacturing:
            - Skilled vs. unskilled labor wage gaps
            - Union representation and collective bargaining impact
            - Automation effects on wage structures
            - Export industry competitiveness factors
            - Safety premium and hazard pay considerations

            Factors Influencing Wage Levels:

            Human Capital and Education:
            - Educational attainment and earning premiums
            - Vocational training and certification value
            - Work experience and career progression patterns
            - Continuing education and skill development impact
            - Language skills and international competency

            Geographic and Regional Factors:
            - Urban vs. rural wage differentials
            - Cost of living adjustments and regional variations
            - Economic development and job market competition
            - Transportation costs and commuting considerations
            - Remote work impact on geographic wage differences

            Institutional and Policy Factors:
            - Labor market regulations and employment protection
            - Tax policies and take-home pay calculations
            - Social security contributions and benefits
            - Immigration policies and labor market competition
            - Trade union density and collective bargaining coverage

            Labor Market Dynamics:

            Supply and Demand Factors:
            - Skills shortages and surplus in different sectors
            - Demographic trends and workforce participation
            - Immigration and emigration effects on labor supply
            - Technological change and job displacement
            - Economic cycles and employment demand

            Employment Relationships:
            - Full-time vs. part-time wage differentials
            - Permanent vs. temporary contract compensation
            - Gig economy and platform work earnings
            - Freelance and independent contractor rates
            - Benefits and non-wage compensation packages

            Career Progression and Mobility:
            - Entry-level to senior position wage growth
            - Internal promotion vs. job switching strategies
            - Industry switching and transferable skills
            - Entrepreneurship and self-employment income
            - Career break impacts and re-entry challenges

            Gender and Diversity in Wages:

            Gender Pay Gap Analysis:
            - Unadjusted vs. adjusted gender pay differences
            - Occupational segregation and its impact
            - Motherhood penalty and fatherhood premium
            - Glass ceiling effects and leadership representation
            - Policies addressing gender wage disparities

            Diversity and Inclusion:
            - Ethnic and racial wage disparities
            - Age discrimination and older worker wages
            - Disability and accessibility accommodation costs
            - LGBTQ+ workplace inclusion and compensation
            - International worker and visa status impacts

            Technology and Future of Work:

            Automation Impact:
            - Job displacement and wage pressure in routine tasks
            - Skill premium for technology-complementary work
            - Retraining and reskilling program effectiveness
            - New job creation in emerging industries
            - Human-AI collaboration and wage implications

            Remote Work Revolution:
            - Geographic arbitrage and salary adjustments
            - Work-life balance and total compensation value
            - Technology infrastructure requirements and costs
            - Management and productivity measurement challenges
            - International remote work and tax implications

            Platform Economy:
            - Gig worker classification and compensation rights
            - Algorithmic management and earnings optimization
            - Benefits portability and social protection
            - Market concentration and platform power
            - Regulatory responses to platform work

            International Comparisons:

            Cross-Country Wage Benchmarking:
            - Purchasing power parity adjusted comparisons
            - Labor productivity and wage relationship
            - Trade competitiveness and wage pressures
            - Migration patterns and brain drain/gain
            - Multinational corporation compensation strategies

            Global Supply Chains:
            - Offshore manufacturing and wage arbitrage
            - Fair trade and ethical wage initiatives
            - Supply chain transparency and worker rights
            - International labor standards and enforcement
            - Consumer awareness and ethical consumption

            Policy Implications and Recommendations:

            Government Policy Tools:
            - Minimum wage setting and adjustment mechanisms
            - Progressive taxation and redistribution policies
            - Education and training investment strategies
            - Infrastructure development and job creation
            - Labor market flexibility and security balance

            Employer Strategies:
            - Competitive compensation package design
            - Performance-based pay and incentive systems
            - Work-life balance and non-monetary benefits
            - Career development and internal mobility
            - Diversity and inclusion compensation audits

            Worker Empowerment:
            - Collective bargaining and union participation
            - Skill development and lifelong learning
            - Negotiation strategies and market awareness
            - Career planning and job search optimization
            - Financial literacy and compensation evaluation

            Future Wage Trends and Projections:

            Emerging Factors:
            - Climate change and green job wage premiums
            - Demographic shifts and labor market tightening
            - Technological advancement and skill requirements
            - Globalization and trade policy changes
            - Social movements and worker rights advocacy

            Policy Innovations:
            - Universal basic income pilot programs
            - Job guarantee and public employment initiatives
            - Portable benefits and social insurance reform
            - Work sharing and reduced hour arrangements
            - Stakeholder capitalism and profit sharing

            Measurement and Data Challenges:

            Data Collection Issues:
            - Informal economy and unreported wages
            - Benefit valuation and total compensation
            - Regional and demographic representation
            - Real-time data and economic indicator timing
            - Privacy concerns and wage transparency

            Analytical Frameworks:
            - Econometric modeling and causal inference
            - Machine learning and predictive analytics
            - Behavioral economics and wage expectations
            - Intersectional analysis and multiple identities
            - Longitudinal studies and career tracking

            Conclusion and Strategic Recommendations:

            For Policymakers:
            - Balance labor market flexibility with worker protection
            - Invest in education and skills development programs
            - Address structural inequalities through targeted interventions
            - Monitor technological change and prepare adaptive responses
            - Strengthen data collection and analysis capabilities

            For Employers:
            - Develop comprehensive compensation strategies
            - Invest in employee development and career growth
            - Embrace diversity and inclusion in hiring and promotion
            - Adapt to changing work arrangements and expectations
            - Consider broader stakeholder interests in compensation decisions

            For Workers:
            - Continuously develop relevant skills and competencies
            - Understand market dynamics and negotiate effectively
            - Consider total compensation and career opportunities
            - Engage in collective action where appropriate
            - Plan for economic uncertainty and career transitions

            The wage landscape in ${countryNameMap[country] || country} reflects broader economic trends and policy choices while maintaining unique characteristics shaped by history, culture, and institutional frameworks. Success in navigating this landscape requires understanding these multiple factors and their interactions.
        `;
    };

    const getSectorContent = (sector: string) => {
        const sectorContents: { [key: string]: string } = {
            'Technology and IT': `
                Technology and IT Sector Wage Analysis - Digital Economy Compensation Trends

                Sector Overview:
                The technology and IT sector represents one of the highest-paying industries globally, driven by high demand for digital skills, rapid innovation, and significant value creation. This sector includes software development, cybersecurity, data science, cloud computing, and emerging technologies.

                Compensation Structure:
                Tech compensation typically includes base salary, equity/stock options, bonuses, and comprehensive benefits. Total compensation can significantly exceed base salary, especially in high-growth companies and senior positions.

                Key Roles and Salary Ranges:
                - Software Engineers: Entry to senior level progression
                - Data Scientists and Machine Learning Engineers: Premium for AI skills
                - Product Managers: Business and technical skill combination
                - DevOps and Cloud Engineers: Infrastructure expertise premium
                - Cybersecurity Specialists: Critical security skill shortage
                - UX/UI Designers: User experience and design thinking value

                Geographic Variations:
                Major tech hubs command premium salaries but also higher living costs. Remote work has enabled geographic arbitrage while companies adjust compensation strategies.

                Skills Premium and Market Dynamics:
                Emerging technologies command highest premiums, including AI/ML, blockchain, cloud platforms, and cybersecurity. Continuous learning and skill updates essential for maintaining competitive compensation.

                Equity and Stock Options:
                Significant portion of tech compensation often comes from equity, creating wealth opportunities but also income volatility. Understanding vesting schedules and tax implications crucial.

                Future Trends:
                - AI and automation impact on traditional roles
                - Specialization vs. full-stack skill preferences
                - Remote work and global talent competition
                - Regulatory changes affecting tech sector
                - Sustainability and ethical tech focus
            `,
            'Healthcare and Medical': `
                Healthcare and Medical Sector Wage Analysis - Essential Service Compensation

                Sector Characteristics:
                Healthcare represents a critical sector with diverse compensation patterns across roles, from entry-level support staff to highly specialized physicians. Compensation reflects education requirements, responsibility levels, and societal value.

                Professional Categories:
                - Physicians and Specialists: Medical degree and residency requirements
                - Nurses and Nurse Practitioners: Various education levels and specializations
                - Allied Health Professionals: Therapists, technicians, and support roles
                - Healthcare Administration: Management and operational roles
                - Mental Health Professionals: Growing demand and specialization

                Education and Training Investment:
                Healthcare careers often require significant educational investment with varying payback periods. Medical school debt affects physician compensation expectations and career choices.

                Public vs. Private Sector:
                Compensation differences between public healthcare systems, private hospitals, and independent practice. Benefits and job security considerations vary significantly.

                Geographic and Rural Factors:
                Rural healthcare faces staffing shortages leading to premium compensation packages. Urban centers offer specialization opportunities but higher competition.

                Shift Work and Demand Premiums:
                24/7 healthcare needs create shift differentials, overtime opportunities, and premium pay for weekend/holiday work. Emergency and critical care roles command higher compensation.

                Regulatory and Licensing Impact:
                Professional licensing requirements, continuing education mandates, and malpractice insurance costs affect net compensation and career mobility.

                Pandemic Impact and Hazard Pay:
                COVID-19 highlighted healthcare worker value with temporary hazard pay and increased recognition, but also demonstrated systemic compensation challenges.

                Future Outlook:
                - Aging population driving healthcare demand
                - Technology integration and telemedicine growth
                - Specialization vs. primary care compensation gaps
                - Healthcare reform and payment model changes
                - Workforce shortages and retention challenges
            `,
            'Finance and Banking': `
                Finance and Banking Sector Wage Analysis - Financial Services Compensation

                Sector Overview:
                Finance and banking offers diverse compensation models from stable salaries in commercial banking to performance-based compensation in investment banking and trading. Risk management and regulatory compliance create unique compensation considerations.

                Subsector Variations:
                - Investment Banking: High base plus significant bonuses
                - Commercial Banking: Stable salaries with moderate performance incentives
                - Asset Management: Fee-based revenue sharing models
                - Insurance: Mix of salary and commission structures
                - Fintech: Startup equity plus competitive salaries

                Performance-Based Compensation:
                Many finance roles include variable compensation tied to individual, team, or firm performance. Bonus cycles and deferred compensation common in senior roles.

                Regulatory Constraints:
                Financial sector regulation affects compensation structure, including clawback provisions, risk adjustment, and caps on certain types of compensation.

                Professional Qualifications:
                CFA, CPA, FRM, and other certifications command salary premiums. Continuing education requirements and professional development expectations.

                Geographic Financial Centers:
                Major financial hubs offer highest compensation but intense competition and long hours. Regional markets provide better work-life balance.

                Technology Impact:
                Fintech disruption creating new roles while automating traditional functions. Programming and data analysis skills increasingly valuable.

                Risk and Compliance Roles:
                Growing importance of risk management and regulatory compliance creating specialized high-value roles.

                Career Progression:
                Traditional advancement paths through analyst to associate to VP levels with significant compensation increases at each level.

                Market Cycles:
                Financial sector compensation highly sensitive to economic cycles, market conditions, and regulatory changes.

                Future Trends:
                - Digital transformation and automation
                - Sustainable finance and ESG focus
                - Cryptocurrency and blockchain integration
                - Open banking and platform models
                - Regulatory technology and compliance automation
            `
        };

        return sectorContents[sector] || `
            ${sector} Wage Analysis - Sector-Specific Compensation Insights

            This comprehensive analysis covers wage patterns, compensation structures, and market dynamics specific to the ${sector} industry.

            Key topics include:
            - Typical salary ranges and progression paths
            - Skills and qualifications that command premium compensation
            - Geographic variations and market factors
            - Industry-specific benefits and compensation structures
            - Future trends and technology impact on wages
            - Career development and advancement strategies

            Our analysis provides detailed insights into how ${sector} professionals can optimize their compensation and career growth.
        `;
    };

    const getAnalysisTypeContent = (analysisType: string) => {
        const analysisContents: { [key: string]: string } = {
            'Gender Pay Gap Analysis': `
                Gender Pay Gap Analysis - Understanding and Addressing Wage Disparities

                Definition and Measurement:
                The gender pay gap represents the difference in earnings between men and women, typically expressed as a percentage of men's earnings. Multiple measurement approaches include unadjusted gaps, adjusted gaps controlling for various factors, and intersectional analysis.

                Global and National Trends:
                - OECD countries average 12-15% unadjusted gender pay gap
                - Significant variation across countries and sectors
                - Gradual narrowing over decades but persistent disparities
                - COVID-19 impact on women's workforce participation
                - Intersectional gaps affecting women of color and marginalized groups

                Causes of Gender Pay Gaps:
                1. Occupational Segregation: Women concentrated in lower-paying sectors
                2. Career Interruptions: Motherhood and caregiving responsibilities
                3. Discrimination: Unconscious bias and systemic barriers
                4. Negotiation Differences: Varying approaches to salary negotiations
                5. Part-time Work Penalties: Reduced hourly wages for flexible work
                6. Glass Ceiling Effects: Limited access to senior leadership roles

                Industry Variations:
                Technology, finance, and legal sectors often show larger gaps, while healthcare and education may have smaller disparities. Government sectors typically have more standardized pay scales reducing gaps.

                Methodological Considerations:
                - Unadjusted vs. adjusted gap measurements
                - Selection bias and workforce participation differences
                - Total compensation vs. base salary analysis
                - Lifecycle earnings and career trajectory impacts
                - Benefits and non-wage compensation differences

                Policy Interventions:
                - Pay transparency legislation and requirements
                - Parental leave policies and shared caregiving
                - Flexible work arrangements and career continuity
                - Childcare support and family-friendly policies
                - Recruitment and promotion bias training
                - Pay equity audits and corrective measures

                Organizational Strategies:
                - Compensation structure reviews and adjustments
                - Bias interruption in hiring and promotion processes
                - Mentorship and sponsorship programs for women
                - Leadership development and pipeline building
                - Work-life integration and flexibility options
                - Regular pay equity monitoring and reporting

                Economic Impact:
                Closing gender pay gaps could increase GDP, improve household economic security, and enhance overall economic productivity and competitiveness.

                Measurement Challenges:
                - Data availability and quality issues
                - Controlling for relevant factors appropriately
                - Accounting for voluntary vs. involuntary differences
                - International comparison difficulties
                - Intersectional analysis complexity

                Future Outlook:
                Continued focus on pay equity, enhanced data collection, AI-assisted bias detection, and comprehensive policy approaches to addressing structural inequalities.
            `,
            'Minimum Wage Impact Study': `
                Minimum Wage Impact Study - Economic Effects and Policy Analysis

                Minimum Wage Overview:
                Minimum wage policies establish legal wage floors to protect low-income workers and ensure basic living standards. These policies have significant economic, social, and political implications requiring careful analysis and evaluation.

                Economic Theory and Debates:
                Traditional economic theory suggests minimum wages may reduce employment if set above market-clearing levels. However, modern research shows mixed effects with considerations for monopsony power, efficiency wages, and dynamic adjustments.

                Empirical Research Findings:
                - Employment effects vary by magnitude of increase and local conditions
                - Modest increases often show minimal employment impacts
                - Potential benefits include reduced turnover and increased productivity
                - Spillover effects on wages above minimum wage levels
                - Regional economic development and consumer spending impacts

                International Comparisons:
                - Nordic countries: High minimum wages with strong unions
                - Germany: Recent minimum wage introduction and effects
                - United States: Federal and state minimum wage variations
                - Developing countries: Informal sector and enforcement challenges
                - Australia: Complex award system and regional variations

                Sectoral Impact Analysis:
                - Retail and hospitality: High concentration of minimum wage workers
                - Food service: Tipped worker considerations and subminimum wages
                - Home care and personal services: Vulnerable worker populations
                - Manufacturing: Limited direct impact but supply chain effects
                - Agriculture: Seasonal work and special provisions

                Business Response Strategies:
                - Price adjustments and consumer impact
                - Automation and technology adoption
                - Productivity improvements and efficiency gains
                - Reduced hours or benefit adjustments
                - Geographic relocation considerations

                Worker and Household Effects:
                - Income increases for affected workers
                - Potential reduction in public assistance needs
                - Family economic stability improvements
                - Educational and health investment opportunities
                - Poverty reduction and social mobility effects

                Implementation Considerations:
                - Phase-in schedules and adjustment periods
                - Regional cost-of-living variations
                - Small business impact and support measures
                - Enforcement mechanisms and compliance
                - Indexation to inflation or economic indicators

                Distributional Effects:
                - Benefits concentration among different income groups
                - Teen and young worker employment impacts
                - Single vs. family earner household effects
                - Gender and minority worker impacts
                - Rural vs. urban differential effects

                Alternative Policy Approaches:
                - Earned Income Tax Credit and wage subsidies
                - Universal Basic Income pilot programs
                - Sectoral collective bargaining systems
                - Regional minimum wage variations
                - Living wage campaigns and voluntary adoption

                Measurement and Evaluation:
                - Natural experiments and quasi-experimental methods
                - Longitudinal data and worker tracking
                - Business survey and administrative data
                - Macroeconomic modeling and impact assessment
                - Cost-benefit analysis frameworks

                Political Economy:
                - Public opinion and political support factors
                - Business lobby and worker advocacy influences
                - Electoral cycles and policy timing
                - Federalism and multi-level governance
                - International competitiveness arguments

                Future Research Directions:
                - Automation response and technological change
                - Platform economy and gig worker coverage
                - Climate change and green job transitions
                - Globalization and trade impact interactions
                - Behavioral economics and worker motivation

                Policy Recommendations:
                Balance economic efficiency with social equity goals, consider local economic conditions, implement gradual adjustments, strengthen enforcement mechanisms, and develop complementary policies to support low-income workers and small businesses.
            `
        };

        return analysisContents[analysisType] || `
            ${analysisType} - Comprehensive Research and Analysis

            This detailed study examines ${analysisType.toLowerCase()} from multiple perspectives, including economic theory, empirical evidence, policy implications, and practical applications.

            Key research areas include:
            - Current trends and patterns in the data
            - Causal factors and underlying mechanisms  
            - Comparative analysis across regions and time periods
            - Policy interventions and their effectiveness
            - Future projections and scenario analysis
            - Stakeholder impacts and considerations

            Our analysis provides evidence-based insights for policymakers, researchers, and practitioners working on wage and labor market issues.
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
                    <DollarSign className="inline-block w-8 h-8 mr-2 text-primary" />
                    Wage Analysis & Labor Economics
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Comprehensive analysis of wage patterns, labor market dynamics, and compensation trends through expert podcast content and data-driven insights.
                </p>
            </div>

            <Tabs defaultValue="country-analysis" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="country-analysis">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Country Analysis
                    </TabsTrigger>
                    <TabsTrigger value="sector-analysis">
                        <Briefcase className="w-4 h-4 mr-2" />
                        Sector Analysis
                    </TabsTrigger>
                    <TabsTrigger value="research-studies">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Research Studies
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="country-analysis" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mic className="h-5 w-5" />
                                Country-Specific Wage Analysis
                            </CardTitle>
                            <CardDescription>
                                Detailed examination of wage patterns, labor market dynamics, and compensation trends by country
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Select Country</Label>
                                <Select onValueChange={setSelectedCountry} value={selectedCountry}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a country for wage analysis" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map(country => (
                                            <SelectItem key={country} value={country}>
                                                {countryNameMap[country]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Wage Analysis: {countryNameMap[selectedCountry]}</CardTitle>
                                    <CardDescription>
                                        Comprehensive labor market and compensation analysis
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <UniversalPodcastPlayer
                                        title={`Wage Analysis - ${countryNameMap[selectedCountry]}`}
                                        content={getWageAnalysisContent(selectedCountry)}
                                        options={podcastOptions}
                                        autoGenerate={false}
                                    />
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="sector-analysis" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5" />
                                Industry Sector Wage Analysis
                            </CardTitle>
                            <CardDescription>
                                Explore compensation patterns and trends across different industry sectors
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Select Industry Sector</Label>
                                <Select onValueChange={setSelectedSector} value={selectedSector}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose an industry sector for analysis" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {wageSectors.map(sector => (
                                            <SelectItem key={sector} value={sector}>
                                                {sector}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {selectedSector && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{selectedSector} Wage Analysis</CardTitle>
                                        <CardDescription>
                                            Detailed compensation insights for the {selectedSector.toLowerCase()} sector
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <UniversalPodcastPlayer
                                            title={`${selectedSector} Wage Analysis`}
                                            content={getSectorContent(selectedSector)}
                                            options={podcastOptions}
                                            autoGenerate={false}
                                        />
                                    </CardContent>
                                </Card>
                            )}
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {wageSectors.slice(0, 6).map((sector) => (
                            <Card key={sector} className="hover:shadow-lg transition-shadow cursor-pointer"
                                  onClick={() => setSelectedSector(sector)}>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Briefcase className="h-5 w-5" />
                                        {sector}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="outline" size="sm" className="w-full">
                                        <Mic className="w-4 h-4 mr-1" />
                                        Analyze Sector
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="research-studies" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Wage Research Studies and Analysis
                            </CardTitle>
                            <CardDescription>
                                In-depth research on specific wage-related topics and labor market phenomena
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Select Research Topic</Label>
                                <Select onValueChange={setSelectedAnalysis} value={selectedAnalysis}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a research topic for detailed analysis" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {wageAnalysisTypes.map(analysis => (
                                            <SelectItem key={analysis} value={analysis}>
                                                {analysis}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {selectedAnalysis && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{selectedAnalysis}</CardTitle>
                                        <CardDescription>
                                            Research-based analysis and policy insights
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <UniversalPodcastPlayer
                                            title={selectedAnalysis}
                                            content={getAnalysisTypeContent(selectedAnalysis)}
                                            options={podcastOptions}
                                            autoGenerate={false}
                                        />
                                    </CardContent>
                                </Card>
                            )}
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-4">
                        {wageAnalysisTypes.slice(0, 4).map((analysis) => (
                            <Card key={analysis} className="hover:shadow-lg transition-shadow cursor-pointer"
                                  onClick={() => setSelectedAnalysis(analysis)}>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5" />
                                        {analysis}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="outline" size="sm" className="w-full">
                                        <Mic className="w-4 h-4 mr-1" />
                                        Research Analysis
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            <Card className="bg-primary/5">
                <CardHeader>
                    <CardTitle>Why Wage Analysis Matters</CardTitle>
                    <CardDescription>
                        Understanding wage dynamics is crucial for economic policy and individual career decisions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <DollarSign className="h-8 w-8 text-primary" />
                            <h3 className="font-semibold">Economic Policy</h3>
                            <p className="text-sm text-muted-foreground">
                                Wage analysis informs minimum wage policy, labor regulations, and economic development strategies.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Users className="h-8 w-8 text-primary" />
                            <h3 className="font-semibold">Career Decisions</h3>
                            <p className="text-sm text-muted-foreground">
                                Understanding wage patterns helps individuals make informed career and education choices.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Briefcase className="h-8 w-8 text-primary" />
                            <h3 className="font-semibold">Business Strategy</h3>
                            <p className="text-sm text-muted-foreground">
                                Compensation analysis helps employers design competitive and fair compensation packages.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
