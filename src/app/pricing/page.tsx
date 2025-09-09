
import UnderConstructionPage from '@/components/under-construction';

export default function PricingPage() {
  return (
    <UnderConstructionPage 
      title="Pricing Analysis"
      description="AI-powered pricing analysis is being updated."
      backLink="/dashboard"
    />
  );
}
import { countryNameMap } from '@/data/economic-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const countries = Object.keys(countryNameMap);

const currencies = {
    'USD': '$', 'EUR': '€', 'JPY': '¥', 'GBP': '£', 'AUD': 'A$',
    'CAD': 'C$', 'CHF': 'Fr', 'CNY': '¥', 'SEK': 'kr', 'NZD': 'NZ$',
    'INR': '₹', 'GHS': '₵'
};

const PricingAnalysis = () => {
    const [country, setCountry] = useState<string>('');
    const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
    const [result, setResult] = useState<AnalyzePricingOutput | null>(null);
    const [podcast, setPodcast] = useState<GeneratePodcastOutput | null>(null);
    const { toast } = useToast();

    const handleGenerateAnalysis = async () => {
        if (!country) {
            toast({ title: "Selection missing", description: "Please select a country for context.", variant: "destructive" });
            return;
        }
        setLoadingStatus("Generating analysis...");
        setResult(null);
        setPodcast(null);
        try {
            const apiResult = await analyzePricing({ country });
            setResult(apiResult);
            
            setLoadingStatus("Generating podcast audio...");
            const podcastTitle = `A Discussion on Pricing in ${country}`;
            const narrationScript = `
Rita: Das, let's start with a fundamental concept. What exactly do we mean by 'pricing', and why is it so critical for a business?
Das: ${apiResult.meaning}
Rita: What are some of the most common strategies businesses in ${country} use to price their products or services?
Das: ${apiResult.strategies}
Rita: What are the main factors a business here should consider when setting a price?
Das: ${apiResult.factors}
Rita: Let's shift gears a bit. How is the pricing of assets like stocks, bonds, or real estate different from pricing a product?
Das: ${apiResult.assetPricing}
Rita: Finally, how does psychology play into all of this? Are there any tricks or common tactics that influence how we perceive a price?
Das: ${apiResult.psychology}
            `.trim();
            
            const resultPodcast = await generatePodcast({ title: podcastTitle, narrationScript });
            setPodcast(resultPodcast);

        } catch (error) {
            console.error(error);
            toast({ title: "Error generating analysis", description: "An error occurred. Please try again.", variant: "destructive" });
        } finally {
            setLoadingStatus(null);
        }
    };
    
    const PodcastLine = ({ speaker, text }: { speaker: string, text: string }) => {
        const speakerClass = speaker.includes('Rita') ? 'text-speaker-rita' : 'text-speaker-das';
        return <p className="text-muted-foreground"><strong className={speakerClass}>{speaker}:</strong> {text}</p>;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Analyze Pricing Concepts</CardTitle>
                <CardDescription>Select a country to generate an AI-powered podcast on pricing strategies and concepts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Country (for context-specific examples)</Label>
                    <Select onValueChange={setCountry} value={country}>
                        <SelectTrigger><SelectValue placeholder="Select a country" /></SelectTrigger>
                        <SelectContent>{countries.map(code => <SelectItem key={code} value={countryNameMap[code]}>{countryNameMap[code]}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <Button onClick={handleGenerateAnalysis} disabled={!!loadingStatus || !country}>
                    {loadingStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {loadingStatus ? loadingStatus : 'Generate Podcast'}
                </Button>

                {result && (
                    <div className="pt-4 space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <CardTitle>Podcast: The Economics of Pricing</CardTitle>
                                     {podcast && <audio controls autoPlay className="w-full max-w-md"><source src={podcast.audioUrl} type="audio/wav" /></audio>}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible defaultValue="meaning" className="w-full">
                                    <AccordionItem value="meaning"><AccordionTrigger>The Meaning and Importance of Pricing</AccordionTrigger><AccordionContent className="space-y-2"><PodcastLine speaker="Rita" text="What is 'pricing'?" /><PodcastLine speaker="Das" text={result.meaning} /></AccordionContent></AccordionItem>
                                    <AccordionItem value="strategies"><AccordionTrigger>Common Pricing Strategies</AccordionTrigger><AccordionContent className="space-y-2"><PodcastLine speaker="Rita" text="What are common strategies?" /><PodcastLine speaker="Das" text={result.strategies} /></AccordionContent></AccordionItem>
                                    <AccordionItem value="factors"><AccordionTrigger>Key Factors Influencing Price</AccordionTrigger><AccordionContent className="space-y-2"><PodcastLine speaker="Rita" text="What factors influence price?" /><PodcastLine speaker="Das" text={result.factors} /></AccordionContent></AccordionItem>
                                    <AccordionItem value="asset-pricing"><AccordionTrigger>Asset Pricing</AccordionTrigger><AccordionContent className="space-y-2"><PodcastLine speaker="Rita" text="How is asset pricing different?" /><PodcastLine speaker="Das" text={result.assetPricing} /></AccordionContent></AccordionItem>
                                    <AccordionItem value="psychology"><AccordionTrigger>The Psychology of Pricing</AccordionTrigger><AccordionContent className="space-y-2"><PodcastLine speaker="Rita" text="How does psychology affect pricing?" /><PodcastLine speaker="Das" text={result.psychology} /></AccordionContent></AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const PriceCreator = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState<string | null>(null);
    const [loadingPdf, setLoadingPdf] = useState(false);
    const [result, setResult] = useState<CreatePriceModelOutput | null>(null);
    const [podcast, setPodcast] = useState<GeneratePodcastOutput | null>(null);
    const [currency, setCurrency] = useState('USD');
    const [formData, setFormData] = useState({
        currentCost: '',
        previousCost: '',
        currentPrice: '',
        previousPrice: '',
        currentInflation: '',
        previousInflation: '',
        currentInterestRate: '',
        previousInterestRate: '',
        futureInterestRate: '',
        currentExchangeRate: '',
        previousExchangeRate: '',
        futureExchangeRate: '',
        currentGdpGrowth: '',
        previousGdpGrowth: '',
    });
    const pdfRef = useRef<HTMLDivElement>(null);
    const currencySymbol = currencies[currency as keyof typeof currencies] || '$';

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };
    
    const allFieldsFilled = () => {
        return Object.values(formData).every(value => value.trim() !== '');
    }

    const handleCreateModel = async () => {
        if (!allFieldsFilled()) {
            toast({ title: "Missing Fields", description: "Please fill in all fields to create the price model.", variant: "destructive"});
            return;
        }
        setLoading("Modeling price...");
        setResult(null);
        setPodcast(null);
        try {
            const numericData = Object.fromEntries(Object.entries(formData).map(([key, value]) => [key, parseFloat(value)]));
            const apiResult = await createPriceModel({ ...numericData, currency } as any); 
            setResult(apiResult);
            
            setLoading("Generating podcast...");
            const podcastResult = await generatePodcast({
                title: 'Price Model Analysis',
                narrationScript: apiResult.analysisForPodcast,
            });
            setPodcast(podcastResult);

        } catch (error) {
            console.error(error);
            toast({ title: "Error Creating Model", description: "An error occurred while generating the price model.", variant: "destructive"});
        } finally {
            setLoading(null);
        }
    };

    const handleDownloadPdf = async () => {
        const input = pdfRef.current;
        if (!input) return;

        setLoadingPdf(true);
        try {
            const canvas = await html2canvas(input, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('AI_Price_Model_Analysis.pdf');
        } catch (error) {
            console.error("Error generating PDF:", error);
            toast({ title: "PDF Generation Error", description: "Could not generate PDF.", variant: "destructive" });
        } finally {
            setLoadingPdf(false);
        }
    };
    
    const renderPodcastScript = (script: string) => {
        return script.split('\n').filter(line => line.trim()).map((line, index) => {
            if (line.startsWith('Rita:')) {
                return <p key={index}><strong className="text-speaker-rita">Rita:</strong>{line.substring(5)}</p>;
            }
            if (line.startsWith('Das:')) {
                return <p key={index}><strong className="text-speaker-das">Das:</strong>{line.substring(4)}</p>;
            }
            return <p key={index}>{line}</p>;
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>AI Price Creator</CardTitle>
                <CardDescription>Model a future price based on cost, economic, and market data. Provide all data points for an accurate AI-powered prediction.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 mb-6">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger id="currency" className='w-full md:w-1/3'><SelectValue/></SelectTrigger>
                        <SelectContent>
                            {Object.entries(currencies).map(([code, symbol]) => (
                                <SelectItem key={code} value={code}>{code} ({symbol})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-4">
                        <CardTitle className="text-lg">Cost & Price Data</CardTitle>
                        <div className="space-y-2"><Label htmlFor="currentCost">Current Cost (per unit)</Label><Input id="currentCost" type="number" value={formData.currentCost} onChange={handleInputChange} placeholder="e.g., 50"/></div>
                        <div className="space-y-2"><Label htmlFor="previousCost">Previous Cost (per unit)</Label><Input id="previousCost" type="number" value={formData.previousCost} onChange={handleInputChange} placeholder="e.g., 48"/></div>
                        <div className="space-y-2"><Label htmlFor="currentPrice">Current Price (per unit)</Label><Input id="currentPrice" type="number" value={formData.currentPrice} onChange={handleInputChange} placeholder="e.g., 100"/></div>
                        <div className="space-y-2"><Label htmlFor="previousPrice">Previous Price (per unit)</Label><Input id="previousPrice" type="number" value={formData.previousPrice} onChange={handleInputChange} placeholder="e.g., 95"/></div>
                    </div>
                    <div className="space-y-4">
                        <CardTitle className="text-lg">Economic Indicators</CardTitle>
                        <div className="space-y-2"><Label htmlFor="currentInflation">Current Inflation Rate (%)</Label><Input id="currentInflation" type="number" value={formData.currentInflation} onChange={handleInputChange} placeholder="e.g., 3.5"/></div>
                        <div className="space-y-2"><Label htmlFor="previousInflation">Previous Inflation Rate (%)</Label><Input id="previousInflation" type="number" value={formData.previousInflation} onChange={handleInputChange} placeholder="e.g., 4.1"/></div>
                        <div className="space-y-2"><Label htmlFor="currentInterestRate">Current Interest Rate (%)</Label><Input id="currentInterestRate" type="number" value={formData.currentInterestRate} onChange={handleInputChange} placeholder="e.g., 5.5"/></div>
                        <div className="space-y-2"><Label htmlFor="previousInterestRate">Previous Interest Rate (%)</Label><Input id="previousInterestRate" type="number" value={formData.previousInterestRate} onChange={handleInputChange} placeholder="e.g., 5.0"/></div>
                        <div className="space-y-2"><Label htmlFor="futureInterestRate">Future Interest Rate (Expected, %)</Label><Input id="futureInterestRate" type="number" value={formData.futureInterestRate} onChange={handleInputChange} placeholder="e.g., 5.25"/></div>
                        <div className="space-y-2"><Label htmlFor="currentGdpGrowth">Current GDP Growth Rate (%)</Label><Input id="currentGdpGrowth" type="number" value={formData.currentGdpGrowth} onChange={handleInputChange} placeholder="e.g., 2.5"/></div>
                        <div className="space-y-2"><Label htmlFor="previousGdpGrowth">Previous GDP Growth Rate (%)</Label><Input id="previousGdpGrowth" type="number" value={formData.previousGdpGrowth} onChange={handleInputChange} placeholder="e.g., 1.9"/></div>
                    </div>
                    <div className="space-y-4">
                         <CardTitle className="text-lg">Market Data</CardTitle>
                        <div className="space-y-2"><Label htmlFor="currentExchangeRate">Current Exchange Rate (vs USD)</Label><Input id="currentExchangeRate" type="number" value={formData.currentExchangeRate} onChange={handleInputChange} placeholder="e.g., 1.08"/></div>
                        <div className="space-y-2"><Label htmlFor="previousExchangeRate">Previous Exchange Rate</Label><Input id="previousExchangeRate" type="number" value={formData.previousExchangeRate} onChange={handleInputChange} placeholder="e.g., 1.05"/></div>
                        <div className="space-y-2"><Label htmlFor="futureExchangeRate">Future Exchange Rate (Expected)</Label><Input id="futureExchangeRate" type="number" value={formData.futureExchangeRate} onChange={handleInputChange} placeholder="e.g., 1.10"/></div>
                    </div>
                </div>
                <div className="mt-6">
                    <Button onClick={handleCreateModel} disabled={!!loading || !allFieldsFilled()}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                        {loading ? loading : 'Create Price Model Podcast'}
                    </Button>
                </div>
                
                {result && (
                    <div className="mt-6 pt-6 border-t">
                         <div className="flex justify-end mb-4">
                            <Button onClick={handleDownloadPdf} disabled={loadingPdf} className="transform hover:-translate-y-1 transition-transform">
                                {loadingPdf ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                                Download PDF Report
                            </Button>
                        </div>
                        <Card>
                            <CardHeader>
                                <CardTitle>AI Pricing Model Results</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-lg">Model Output</h4>
                                        <div className="p-4 bg-muted rounded-lg">
                                            <p className="text-sm text-muted-foreground">Predicted Future Price:</p>
                                            <p className="text-4xl font-bold text-primary">{currencySymbol}{result.predictedPrice.toFixed(2)}</p>
                                        </div>
                                         <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                                            <h5 className="font-semibold flex items-center gap-2"><Sigma className="h-4 w-4"/> Econometric Equation</h5>
                                            <p className="text-sm font-mono bg-background p-2 rounded">{result.equation}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-lg">Marginal Changes</h4>
                                        <div className="space-y-2 text-sm border p-4 rounded-lg">
                                            <p className="flex justify-between"><span>Marginal Cost:</span> <span className="font-medium">{currencySymbol}{result.marginalCost.toFixed(2)}</span></p>
                                            <p className="flex justify-between"><span>Marginal Price Change:</span> <span className="font-medium">{currencySymbol}{result.marginalPrice.toFixed(2)}</span></p>
                                            <p className="flex justify-between"><span>Marginal Inflation:</span> <span className="font-medium">{result.marginalInflation.toFixed(2)}%</span></p>
                                            <p className="flex justify-between"><span>Marginal Interest Rate:</span> <span className="font-medium">{result.marginalInterestRate.toFixed(2)}%</span></p>
                                            <p className="flex justify-between"><span>Marginal Exchange Rate:</span> <span className="font-medium">{result.marginalExchangeRate.toFixed(4)}</span></p>
                                            <p className="flex justify-between"><span>Marginal GDP Growth:</span> <span className="font-medium">{result.marginalGdpGrowth.toFixed(2)}%</span></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4 pt-4 border-t">
                                     <h4 className="font-semibold text-lg">Das's Analysis Podcast</h4>
                                     {podcast?.audioUrl && (
                                         <audio controls autoPlay className="w-full">
                                            <source src={podcast.audioUrl} type="audio/wav" />
                                            Your browser does not support the audio element.
                                         </audio>
                                     )}
                                     <div className="p-4 bg-muted/50 rounded-md text-sm text-muted-foreground space-y-2 whitespace-pre-wrap max-h-60 overflow-y-auto">
                                        {result.analysisForPodcast && renderPodcastScript(result.analysisForPodcast)}
                                     </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
                 {/* Hidden div for PDF generation */}
                <div className="absolute -left-[9999px] top-auto" aria-hidden="true">
                    <div ref={pdfRef} className="bg-white text-black p-8" style={{ width: '210mm' }}>
                        {result && (
                            <>
                                <div className="text-center mb-8">
                                    <h1 className="text-3xl font-bold">AI Price Model Analysis Report</h1>
                                    <p className="text-sm text-gray-500">Generated on: {new Date().toLocaleDateString()}</p>
                                </div>
                                
                                <div className="mb-6 p-4 border rounded-lg text-center bg-gray-50">
                                    <h2 className="text-lg font-semibold text-gray-700">Predicted Future Price</h2>
                                    <p className="text-5xl font-bold text-gray-900 mt-2">{currencySymbol}{result.predictedPrice.toFixed(2)}</p>
                                </div>

                                <div className="mb-6 p-4 border rounded-lg">
                                    <h2 className="text-xl font-semibold mb-2 flex items-center gap-2"><Sigma className="h-5 w-5"/> Model Equation</h2>
                                    <p className="text-base font-mono bg-gray-100 p-2 rounded">{result.equation}</p>
                                </div>
                                
                                <div className="mb-6 p-4 border rounded-lg">
                                    <h2 className="text-xl font-semibold mb-2">Marginal Changes Analysis</h2>
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-base">
                                        <p className="flex justify-between"><span>Marginal Cost:</span> <span className="font-medium">{currencySymbol}{result.marginalCost.toFixed(2)}</span></p>
                                        <p className="flex justify-between"><span>Marginal Price Change:</span> <span className="font-medium">{currencySymbol}{result.marginalPrice.toFixed(2)}</span></p>
                                        <p className="flex justify-between"><span>Marginal Inflation:</span> <span className="font-medium">{result.marginalInflation.toFixed(2)}%</span></p>
                                        <p className="flex justify-between"><span>Marginal Interest Rate:</span> <span className="font-medium">{result.marginalInterestRate.toFixed(2)}%</span></p>
                                        <p className="flex justify-between"><span>Marginal Exchange Rate:</span> <span className="font-medium">{result.marginalExchangeRate.toFixed(4)}</span></p>
                                        <p className="flex justify-between"><span>Marginal GDP Growth:</span> <span className="font-medium">{result.marginalGdpGrowth.toFixed(2)}%</span></p>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold mb-2 border-b pb-1">Das's AI Analysis</h2>
                                    <p className="text-base whitespace-pre-wrap">{result.analysis}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default function PricingPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Pricing Tools</h2>
            </div>
             <Tabs defaultValue="creator" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="creator">AI Price Creator</TabsTrigger>
                    <TabsTrigger value="analysis">Pricing Concepts Analysis</TabsTrigger>
                </TabsList>
                <TabsContent value="creator">
                   <PriceCreator />
                </TabsContent>
                <TabsContent value="analysis">
                   <PricingAnalysis />
                </TabsContent>
            </Tabs>
        </div>
    );
}

    