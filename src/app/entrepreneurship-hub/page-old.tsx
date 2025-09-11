
'use client';

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mic, FileText, Wand2, Download, FileSignature, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { countryNameMap } from '@/data/economic-data';
import { UniversalPodcastPlayer } from '@/components/universal-podcast-player';

const countries = Object.keys(countryNameMap);

// Type definitions for entrepreneurship analysis
interface AnalyzeEntrepreneurshipTopicOutput {
    introduction: string;
    coreConcepts: string;
    processAndStrategies: string;
    challengesAndSolutions: string;
    futureOutlook: string;
}

interface EntrepreneurshipLandscapeOutput {
    creationProcess: string;
    fundingOptions: string;
    scalingStrategies: string;
    keyQualities: string;
    businessIdeas: string;
}

interface PodcastLine {
    speaker: "Speaker1" | "Speaker2";
    line: string;
}

const entrepreneurshipTopics = [
    "Venture Capital Funding",
    "Lean Startup Methodology",
    "Social Entrepreneurship",
    "Intellectual Property for Startups",
    "Digital Marketing for Startups",
    "Scaling a Business Globally",
    "Product-Market Fit",
    "Building a Strong Company Culture",
    "Bootstrapping and Alternative Funding",
    "Exit Strategies for Founders"
];

const BusinessDocumentSection = ({ title, content }: { title: string, content: string | undefined }) => {
    if (!content) return null;
    return (
        <div className="py-4 border-b last:border-b-0">
            <h4 className="text-xl font-semibold mb-2 text-primary">{title}</h4>
            <p className="whitespace-pre-wrap text-muted-foreground">{content}</p>
        </div>
    );
};

const PodcastLine = ({ speaker, text }: { speaker: string, text: string }) => {
    const speakerClass = speaker.includes('Rita') ? 'text-speaker-rita' : 'text-speaker-das';
    return (
        <p className="text-muted-foreground">
            <strong className={speakerClass}>{speaker}:</strong> {text}
        </p>
    );
};


const TopicDeepDive = () => {
    const { toast } = useToast();
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalyzeEntrepreneurshipTopicOutput | null>(null);
    const [podcastScript, setPodcastScript] = useState<PodcastLine[] | null>(null);

    // Use the podcast audio hook for ElevenLabs TTS
    const {
        isGenerating: isGeneratingAudio,
        isPlaying: isPlayingAudio,
        audioUrl,
        generateAudio,
        playAudio,
        stopAudio,
        downloadAudio
    } = usePodcastAudio({
        onComplete: () => {
            toast({
                title: "Podcast Audio Complete!",
                description: "Your entrepreneurship podcast is ready to play and download.",
            });
        },
        onError: (error) => {
            toast({
                title: "Audio Generation Failed",
                description: error.message,
                variant: "destructive"
            });
        }
    });

    const handleGenerateAnalysis = async () => {
        if (!topic) {
            toast({ title: "Selection missing", description: "Please select a topic.", variant: "destructive" });
            return;
        }
        setLoading(true);
        setResult(null);
        setPodcastScript(null);
        try {
            // Generate structured analysis using Google Gemini
            const response = await fetch('/api/ai/ask-das-ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `Create a comprehensive entrepreneurship podcast about "${topic}". Rita should ask insightful questions and Das should provide expert analysis covering: 1) Introduction and definition, 2) Core concepts entrepreneurs must understand, 3) Implementation process and strategies, 4) Common challenges and solutions, 5) Future outlook and trends. Make it conversational and practical.`
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate analysis');
            }

            const apiResult = await response.json();
            setPodcastScript(apiResult.podcastScript);
            
            // Parse the script into sections for display
            const script = apiResult.podcastScript || [];
            const sections = script.map((line: PodcastLine) => line.line).join(' ');
            
            // Extract key sections (simplified approach)
            const introduction = script.slice(0, 2).map((line: PodcastLine) => line.line).join(' ');
            const coreConcepts = script.slice(2, 4).map((line: PodcastLine) => line.line).join(' ');
            const processAndStrategies = script.slice(4, 6).map((line: PodcastLine) => line.line).join(' ');
            const challengesAndSolutions = script.slice(6, 8).map((line: PodcastLine) => line.line).join(' ');
            const futureOutlook = script.slice(8).map((line: PodcastLine) => line.line).join(' ');

            setResult({
                introduction,
                coreConcepts,
                processAndStrategies,
                challengesAndSolutions,
                futureOutlook
            });

            // Generate audio using ElevenLabs TTS
            if (apiResult.podcastScript && apiResult.podcastScript.length > 0) {
                toast({
                    title: "Analysis Complete!",
                    description: "Generating high-quality audio with ElevenLabs...",
                });
                await generateAudio(apiResult.podcastScript, `Entrepreneurship topic: ${topic}`, true);
            }

        } catch (error) {
            console.error(error);
            toast({ title: "Error generating analysis", description: "An error occurred while generating the analysis.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
         <Card>
            <CardHeader>
              <CardTitle>Entrepreneurship Topic Deep Dive</CardTitle>
              <CardDescription>Select a professional topic for a detailed, end-to-end podcast analysis from Das.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                  <Label>Topic</Label>
                  <Select onValueChange={setTopic} value={topic}>
                    <SelectTrigger><SelectValue placeholder="Select a topic" /></SelectTrigger>
                    <SelectContent>{entrepreneurshipTopics.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              <Button onClick={handleGenerateAnalysis} disabled={loading || !topic}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BookOpen className="mr-2 h-4 w-4" />}
                {loading ? 'Generating Analysis...' : 'Generate Deep Dive Podcast'}
              </Button>
              {result && (
                <div className="pt-4 space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <CardTitle>Podcast: {topic}</CardTitle>
                        
                        {/* ElevenLabs Audio Controls */}
                        <div className="flex items-center gap-2">
                          {isGeneratingAudio && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Generating ElevenLabs audio...</span>
                            </div>
                          )}
                          
                          {audioUrl && !isGeneratingAudio && (
                            <div className="flex items-center gap-2">
                              {!isPlayingAudio ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => podcastScript && playAudio(podcastScript)}
                                >
                                  <BookOpen className="h-4 w-4 mr-1" />
                                  Play Podcast
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={stopAudio}
                                >
                                  <Loader2 className="h-4 w-4 mr-1" />
                                  Stop
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => podcastScript && downloadAudio(podcastScript)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          )}
                          
                          {!audioUrl && !isGeneratingAudio && podcastScript && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => generateAudio(podcastScript, `Entrepreneurship topic: ${topic}`, true)}
                            >
                              <BookOpen className="h-4 w-4 mr-1" />
                              Generate Audio
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible defaultValue="introduction" className="w-full">
                        <AccordionItem value="introduction"><AccordionTrigger>Introduction</AccordionTrigger><AccordionContent className="space-y-2"><PodcastLine speaker="Rita" text={`Das, today we're diving deep into ${topic}. To start us off, what is it in a nutshell?`} /><PodcastLine speaker="Das" text={result.introduction} /></AccordionContent></AccordionItem>
                        <AccordionItem value="coreConcepts"><AccordionTrigger>Core Concepts</AccordionTrigger><AccordionContent className="space-y-2"><PodcastLine speaker="Rita" text="What are the fundamental principles that entrepreneurs need to understand about this?" /><PodcastLine speaker="Das" text={result.coreConcepts} /></AccordionContent></AccordionItem>
                        <AccordionItem value="processAndStrategies"><AccordionTrigger>Process & Strategies</AccordionTrigger><AccordionContent className="space-y-2"><PodcastLine speaker="Rita" text="Can you walk us through the process from beginning to end? What are the key strategies for success here?" /><PodcastLine speaker="Das" text={result.processAndStrategies} /></AccordionContent></AccordionItem>
                        <AccordionItem value="challengesAndSolutions"><AccordionTrigger>Challenges & Solutions</AccordionTrigger><AccordionContent className="space-y-2"><PodcastLine speaker="Rita" text={`What are the most common challenges or pitfalls associated with ${topic}, and how can they be overcome?`} /><PodcastLine speaker="Das" text={result.challengesAndSolutions} /></AccordionContent></AccordionItem>
                        <AccordionItem value="futureOutlook"><AccordionTrigger>Future Outlook</AccordionTrigger><AccordionContent className="space-y-2"><PodcastLine speaker="Rita" text="Finally, what's the future outlook for this? What trends should entrepreneurs be watching?" /><PodcastLine speaker="Das" text={result.futureOutlook} /></AccordionContent></AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
    );
}

export default function EntrepreneurshipHub() {
  const { toast } = useToast();
  const { generateBusinessPlan, analyzeEconomics, isLoading, callAPI } = useAI();
  const businessPlanRef = useRef<HTMLDivElement>(null);
  const businessProposalRef = useRef<HTMLDivElement>(null);

  // Local function for business proposal generation using Google Gemini
  const generateBusinessProposal = async (data: {
    clientName: string;
    projectDescription: string;
    proposedSolution: string;
    timeline: string;
    costAndPayment: string;
  }) => {
    const query = `Create a professional business proposal for client "${data.clientName}". Project: ${data.projectDescription}. Proposed solution: ${data.proposedSolution}. Timeline: ${data.timeline}. Cost: ${data.costAndPayment}. Format as a structured business proposal with executive summary, project scope, methodology, timeline, costs, and terms.`;
    
    const response = await fetch('/api/ai/ask-das-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate business proposal');
    }

    const result = await response.json();
    
    // Convert the podcast script to a formatted proposal
    const script = result.podcastScript || [];
    const content = script.map((line: any) => line.line).join('\n\n');
    
    return {
      title: `Business Proposal for ${data.clientName}`,
      content: content,
      sections: {
        executiveSummary: content.substring(0, 500),
        projectScope: data.projectDescription,
        methodology: data.proposedSolution,
        timeline: data.timeline,
        costs: data.costAndPayment
      }
    };
  };

  // State for Country Guide
  const [country, setCountry] = useState<string>('');
  const [loadingGuideStatus, setLoadingGuideStatus] = useState<string|null>(null);
  const [guideResult, setGuideResult] = useState<any | null>(null);
  const [guidePodcastScript, setGuidePodcastScript] = useState<PodcastLine[] | null>(null);

  // Podcast audio functionality for country guide
  const {
    isGenerating: isGeneratingGuideAudio,
    isPlaying: isPlayingGuideAudio,
    audioUrl: guideAudioUrl,
    generateAudio: generateGuideAudio,
    playAudio: playGuideAudio,
    stopAudio: stopGuideAudio,
    downloadAudio: downloadGuideAudio
  } = usePodcastAudio({
    onComplete: () => {
      toast({
        title: "Country Guide Podcast Complete!",
        description: "Your entrepreneurship guide is ready to play and download.",
      });
    },
    onError: (error) => {
      toast({
        title: "Audio Generation Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // State for Business Plan Generator
  const [planIdea, setPlanIdea] = useState('');
  const [planIndustry, setPlanIndustry] = useState('');
  const [planTargetMarket, setPlanTargetMarket] = useState('');
  const [planCountry, setPlanCountry] = useState('');
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingPlanPdf, setLoadingPlanPdf] = useState(false);
  const [planResult, setPlanResult] = useState<any | null>(null);
  
  // State for Business Proposal Generator
  const [proposalClient, setProposalClient] = useState('');
  const [proposalProject, setProposalProject] = useState('');
  const [proposalSolution, setProposalSolution] = useState('');
  const [proposalTimeline, setProposalTimeline] = useState('');
  const [proposalCost, setProposalCost] = useState('');
  const [loadingProposal, setLoadingProposal] = useState(false);
  const [loadingProposalPdf, setLoadingProposalPdf] = useState(false);
  const [proposalResult, setProposalResult] = useState<any | null>(null);


  const handleGenerateGuide = async () => {
    if (!country) {
      toast({ title: "Selection missing", description: "Please select a country.", variant: "destructive" });
      return;
    }
    setLoadingGuideStatus("Analyzing landscape...");
    setGuideResult(null);
    setGuidePodcastScript(null);
    try {
      // Generate structured guide using Google Gemini
      const response = await fetch('/api/ai/ask-das-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `Create a comprehensive entrepreneurship guide podcast for ${country}. Rita should ask practical questions and Das should provide expert insights about: 1) Business creation process and legal requirements, 2) Funding options for new ventures, 3) Strategies for scaling businesses, 4) Key personal qualities for success, 5) Promising business opportunities. Make it conversational and country-specific.`
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate entrepreneurship guide');
      }

      const apiResult = await response.json();
      setGuidePodcastScript(apiResult.podcastScript);
      
      // Parse the script into sections for display
      const script = apiResult.podcastScript || [];
      const sections = script.map((line: PodcastLine) => line.line).join(' ');
      
      // Extract key sections (simplified approach)
      const creationProcess = script.slice(0, 2).map((line: PodcastLine) => line.line).join(' ');
      const fundingOptions = script.slice(2, 4).map((line: PodcastLine) => line.line).join(' ');
      const scalingStrategies = script.slice(4, 6).map((line: PodcastLine) => line.line).join(' ');
      const keyQualities = script.slice(6, 8).map((line: PodcastLine) => line.line).join(' ');
      const businessIdeas = script.slice(8).map((line: PodcastLine) => line.line).join(' ');

      setGuideResult({
        creationProcess,
        fundingOptions,
        scalingStrategies,
        keyQualities,
        businessIdeas
      });

      // Generate audio using ElevenLabs TTS
      if (apiResult.podcastScript && apiResult.podcastScript.length > 0) {
        setLoadingGuideStatus("Generating podcast with ElevenLabs...");
        toast({
          title: "Guide Complete!",
          description: "Generating high-quality audio with ElevenLabs...",
        });
        await generateGuideAudio(apiResult.podcastScript, `Entrepreneurship guide for ${country}`, true);
      }

    } catch (error) {
      console.error(error);
      toast({ title: "Error generating guide", description: "An error occurred while generating the guide.", variant: "destructive" });
    } finally {
      setLoadingGuideStatus(null);
    }
  };

  const handleGeneratePlan = async () => {
    if (!planIdea || !planIndustry || !planTargetMarket || !planCountry) {
      toast({ title: "Input missing", description: "Please fill out all fields to generate a business plan.", variant: "destructive" });
      return;
    }
    setLoadingPlan(true);
    setPlanResult(null);
    try {
      const result = await generateBusinessPlan({ businessIdea: planIdea, industry: planIndustry, targetMarket: planTargetMarket, budget: planCountry });
      setPlanResult(result);
    } catch (error) {
      console.error(error);
      toast({ title: "Error generating plan", description: "An error occurred while generating the business plan.", variant: "destructive" });
    } finally {
      setLoadingPlan(false);
    }
  };

   const handleGenerateProposal = async () => {
    if (!proposalClient || !proposalProject || !proposalSolution) {
      toast({ title: "Input missing", description: "Please fill out Client Name, Project Description, and Your Solution.", variant: "destructive" });
      return;
    }
    setLoadingProposal(true);
    setProposalResult(null);
    try {
      const result = await generateBusinessProposal({ 
        clientName: proposalClient,
        projectDescription: proposalProject,
        proposedSolution: proposalSolution,
        timeline: proposalTimeline,
        costAndPayment: proposalCost
       });
      setProposalResult(result);
    } catch (error) {
      console.error(error);
      toast({ title: "Error generating proposal", description: "An error occurred while generating the business proposal.", variant: "destructive" });
    } finally {
      setLoadingProposal(false);
    }
  };

  const handleDownloadPdf = async (type: 'plan' | 'proposal') => {
    const input = type === 'plan' ? businessPlanRef.current : businessProposalRef.current;
    const documentTitle = type === 'plan' ? planResult?.title : proposalResult?.title;
    const setLoading = type === 'plan' ? setLoadingPlanPdf : setLoadingProposalPdf;
    const getLoadingState = type === 'plan' ? loadingPlanPdf : loadingProposalPdf;

    if (!input || !documentTitle || getLoadingState) {
        if(!input || !documentTitle) toast({ title: "Error", description: "Document content not found.", variant: "destructive"});
        return;
    }
    setLoading(true);
    try {
        const canvas = await html2canvas(input, { 
            scale: 2,
            useCORS: true,
            logging: true,
            windowWidth: input.scrollWidth,
            windowHeight: input.scrollHeight
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
          heightLeft -= pdfHeight;
        }

        pdf.save(`${documentTitle.replace(/ /g, '_')}.pdf`);
    } catch (error) {
        console.error("Error generating PDF:", error);
        toast({ title: "PDF Generation Error", description: "An error occurred while creating the PDF.", variant: "destructive"});
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Entrepreneurship Hub</h2>
      </div>

      <Tabs defaultValue="guide" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="guide">Country Guide</TabsTrigger>
          <TabsTrigger value="deep-dive">Topic Deep Dive</TabsTrigger>
          <TabsTrigger value="plan">Business Plan Generator</TabsTrigger>
          <TabsTrigger value="proposal">Business Proposal Generator</TabsTrigger>
        </TabsList>

        <TabsContent value="guide" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Entrepreneurship Landscape Podcast</CardTitle>
              <CardDescription>Select a country for a detailed AI-powered podcast on its entrepreneurial environment, including business ideas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Select onValueChange={setCountry} value={country}>
                    <SelectTrigger><SelectValue placeholder="Select a country" /></SelectTrigger>
                    <SelectContent>{countries.map(code => <SelectItem key={code} value={countryNameMap[code]}>{countryNameMap[code]}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleGenerateGuide} disabled={!!loadingGuideStatus || !country}>
                {loadingGuideStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loadingGuideStatus ? loadingGuideStatus : 'Generate Podcast'}
              </Button>
              {guideResult && (
                <div className="pt-4 space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <CardTitle>Podcast: Entrepreneurship in {country}</CardTitle>
                        
                        {/* ElevenLabs Audio Controls for Guide */}
                        <div className="flex items-center gap-2">
                          {isGeneratingGuideAudio && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Generating ElevenLabs audio...</span>
                            </div>
                          )}
                          
                          {guideAudioUrl && !isGeneratingGuideAudio && (
                            <div className="flex items-center gap-2">
                              {!isPlayingGuideAudio ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => guidePodcastScript && playGuideAudio(guidePodcastScript)}
                                >
                                  <BookOpen className="h-4 w-4 mr-1" />
                                  Play Guide
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={stopGuideAudio}
                                >
                                  <Loader2 className="h-4 w-4 mr-1" />
                                  Stop
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => guidePodcastScript && downloadGuideAudio(guidePodcastScript)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          )}
                          
                          {!guideAudioUrl && !isGeneratingGuideAudio && guidePodcastScript && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => generateGuideAudio(guidePodcastScript, `Entrepreneurship guide for ${country}`, true)}
                            >
                              <BookOpen className="h-4 w-4 mr-1" />
                              Generate Audio
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible defaultValue="process" className="w-full">
                        <AccordionItem value="process"><AccordionTrigger>Business Creation Process</AccordionTrigger><AccordionContent className="space-y-2"><PodcastLine speaker="Rita" text={`Das, for someone starting out in ${country}, what does the business creation process look like?`} /><PodcastLine speaker="Das" text={guideResult.creationProcess} /></AccordionContent></AccordionItem>
                        <AccordionItem value="funding"><AccordionTrigger>Funding Options</AccordionTrigger><AccordionContent className="space-y-2"><PodcastLine speaker="Rita" text="Once you have an idea, what are the typical funding routes for a new venture here?" /><PodcastLine speaker="Das" text={guideResult.fundingOptions} /></AccordionContent></AccordionItem>
                        <AccordionItem value="scaling"><AccordionTrigger>Scaling Strategies</AccordionTrigger><AccordionContent className="space-y-2"><PodcastLine speaker="Rita" text="Let's say a business is successful. What are the key strategies for scaling up in this market?" /><PodcastLine speaker="Das" text={guideResult.scalingStrategies} /></AccordionContent></AccordionItem>
                        <AccordionItem value="qualities"><AccordionTrigger>Key Qualities for Success</AccordionTrigger><AccordionContent className="space-y-2"><PodcastLine speaker="Rita" text={`Beyond the business plan, what personal qualities are most crucial for an entrepreneur to succeed in ${country}?`} /><PodcastLine speaker="Das" text={guideResult.keyQualities} /></AccordionContent></AccordionItem>
                        <AccordionItem value="ideas"><AccordionTrigger>Promising Business Ideas</AccordionTrigger><AccordionContent className="space-y-2"><PodcastLine speaker="Rita" text={`To make it concrete, what are 3 to 5 promising business ideas you see for ${country} right now?`} /><PodcastLine speaker="Das" text={guideResult.businessIdeas} /></AccordionContent></AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="deep-dive">
            <TopicDeepDive />
        </TabsContent>

        <TabsContent value="plan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Business Plan Generator</CardTitle>
              <CardDescription>Provide a few details about your business idea, and our AI consultant, Das, will generate a comprehensive business plan for you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="planIdea">Core Business Idea</Label>
                  <Textarea id="planIdea" placeholder="e.g., An eco-friendly subscription box for cleaning supplies." value={planIdea} onChange={e => setPlanIdea(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="planIndustry">Industry</Label>
                  <Input id="planIndustry" placeholder="e.g., E-commerce, SaaS, Retail" value={planIndustry} onChange={e => setPlanIndustry(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="planTargetMarket">Target Market</Label>
                  <Input id="planTargetMarket" placeholder="e.g., Environmentally conscious millennials in urban areas" value={planTargetMarket} onChange={e => setPlanTargetMarket(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Country for Context</Label>
                  <Select onValueChange={setPlanCountry} value={planCountry}>
                    <SelectTrigger><SelectValue placeholder="Select a country" /></SelectTrigger>
                    <SelectContent>{countries.map(code => <SelectItem key={code} value={countryNameMap[code]}>{countryNameMap[code]}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleGeneratePlan} disabled={loadingPlan || !planIdea || !planIndustry || !planTargetMarket || !planCountry}>
                {loadingPlan ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                {loadingPlan ? 'Generating Plan...' : 'Generate Business Plan'}
              </Button>

              {planResult && (
                <div className="pt-4 space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <FileText className="h-6 w-6 text-primary" />
                            <CardTitle>{planResult.title}</CardTitle>
                        </div>
                        <Button onClick={() => handleDownloadPdf('plan')} disabled={loadingPlanPdf} className="transform hover:-translate-y-1 transition-transform">
                            {loadingPlanPdf ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                            {loadingPlanPdf ? 'Downloading...' : 'Download PDF'}
                        </Button>
                      </div>
                      <CardDescription>A comprehensive business plan generated by Das.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div ref={businessPlanRef} className='p-6 bg-white text-black'>
                            <div className='text-center mb-8'>
                               <h1 className='text-4xl font-bold mb-2 text-gray-900'>{planResult.title}</h1>
                               <p className='text-lg text-gray-700'>Business Plan</p>
                               <p className='text-sm text-gray-500'>Prepared on: {new Date().toLocaleDateString()}</p>
                            </div>
                            <BusinessDocumentSection title="1. Executive Summary" content={planResult.executiveSummary} />
                            <BusinessDocumentSection title="2. Company Description" content={planResult.companyDescription} />
                            <BusinessDocumentSection title="3. Market Analysis" content={planResult.marketAnalysis} />
                            <BusinessDocumentSection title="4. Organization & Management" content={planResult.organizationAndManagement} />
                            <BusinessDocumentSection title="5. Products & Services" content={planResult.productsOrServices} />
                            <BusinessDocumentSection title="6. Marketing & Sales Strategy" content={planResult.marketingAndSales} />
                            <BusinessDocumentSection title="7. Feasibility Analysis" content={planResult.feasibilityAnalysis} />
                            <BusinessDocumentSection title="8. Cost-Benefit Analysis" content={planResult.costBenefitAnalysis} />
                            <BusinessDocumentSection title="9. Financial Projections" content={planResult.financialProjections} />
                        </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proposal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Business Proposal Generator</CardTitle>
              <CardDescription>Create a persuasive proposal to send to a potential client. Das will help you structure it professionally.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="proposalClient">Client Name / Company</Label>
                  <Input id="proposalClient" placeholder="e.g., ABC Corporation" value={proposalClient} onChange={e => setProposalClient(e.target.value)} />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="proposalProject">Project Description</Label>
                  <Textarea id="proposalProject" placeholder="Briefly describe the project or the client's problem." value={proposalProject} onChange={e => setProposalProject(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proposalSolution">Your Proposed Solution</Label>
                  <Textarea id="proposalSolution" placeholder="Outline the services or products you will provide to solve the client's problem." value={proposalSolution} onChange={e => setProposalSolution(e.target.value)} />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="proposalTimeline">Timeline (Optional)</Label>
                  <Input id="proposalTimeline" placeholder="e.g., 4-6 weeks, Q3 2024" value={proposalTimeline} onChange={e => setProposalTimeline(e.target.value)} />
                </div>
                 <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="proposalCost">Cost & Payment Terms (Optional)</Label>
                  <Input id="proposalCost" placeholder="e.g., $5,000 payable in two installments." value={proposalCost} onChange={e => setProposalCost(e.target.value)} />
                </div>
              </div>
              <Button onClick={handleGenerateProposal} disabled={loadingProposal || !proposalClient || !proposalProject || !proposalSolution}>
                {loadingProposal ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                {loadingProposal ? 'Generating Proposal...' : 'Generate Business Proposal'}
              </Button>

              {proposalResult && (
                 <div className="pt-4 space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <FileSignature className="h-6 w-6 text-primary" />
                            <CardTitle>{proposalResult.title}</CardTitle>
                        </div>
                        <Button onClick={() => handleDownloadPdf('proposal')} disabled={loadingProposalPdf} className="transform hover:-translate-y-1 transition-transform">
                            {loadingProposalPdf ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                            {loadingProposalPdf ? 'Downloading...' : 'Download PDF'}
                        </Button>
                      </div>
                      <CardDescription>A professional business proposal generated by Das.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div ref={businessProposalRef} className='p-6 bg-white text-black'>
                            <div className='text-center mb-8'>
                               <h1 className='text-4xl font-bold mb-2 text-gray-900'>{proposalResult.title}</h1>
                               <p className='text-lg text-gray-700'>Business Proposal</p>
                               <p className='text-sm text-gray-500'>Prepared for: {proposalResult.preparedFor}</p>
                               <p className='text-sm text-gray-500'>Date: {new Date().toLocaleDateString()}</p>
                            </div>
                            <BusinessDocumentSection title="1. Introduction" content={proposalResult.introduction} />
                            <BusinessDocumentSection title="2. Understanding the Need" content={proposalResult.understandingTheNeed} />
                            <BusinessDocumentSection title="3. Proposed Solution" content={proposalResult.proposedSolution} />
                            <BusinessDocumentSection title="4. Scope of Work" content={proposalResult.scopeOfWork} />
                            <BusinessDocumentSection title="5. Timeline" content={proposalResult.timeline} />
                            <BusinessDocumentSection title="6. Cost & Investment" content={proposalResult.costAndInvestment} />
                            <BusinessDocumentSection title="7. About Us" content={proposalResult.aboutUs} />
                            <BusinessDocumentSection title="8. Next Steps" content={proposalResult.nextSteps} />
                        </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
