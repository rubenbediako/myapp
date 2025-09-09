
'use client';

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, Trash2, PieChart as PieChartIcon, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeGovernmentBudget, AnalyzeGovernmentBudgetOutput } from '@/ai/flows/analyze-government-budget';
import { generatePodcast, GeneratePodcastOutput } from '@/ai/flows/generate-podcast';
import { countryNameMap } from '@/data/economic-data';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const countries = Object.keys(countryNameMap);
const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))", "hsl(var(--destructive))"];

const currencies = {
    'USD': '$', 'EUR': '€', 'JPY': '¥', 'GBP': '£', 'AUD': 'A$',
    'CAD': 'C$', 'CHF': 'Fr', 'CNY': '¥', 'SEK': 'kr', 'NZD': 'NZ$',
    'INR': '₹', 'GHS': '₵'
};

interface BudgetItem {
    id: number;
    name: string;
    amount: number;
    type: 'income' | 'expense';
}

const PersonalBudgetCreator = () => {
    const [items, setItems] = useState<BudgetItem[]>([]);
    const [itemName, setItemName] = useState('');
    const [itemAmount, setItemAmount] = useState('');
    const [itemType, setItemType] = useState<'income' | 'expense'>('income');
    const [currency, setCurrency] = useState('USD');
    const [loadingPdf, setLoadingPdf] = useState(false);
    const { toast } = useToast();
    const pdfRef = useRef<HTMLDivElement>(null);

    const handleAddItem = () => {
        if (!itemName || !itemAmount) {
            toast({ title: 'Missing fields', description: 'Please enter a name and amount.', variant: 'destructive' });
            return;
        }
        const newItem: BudgetItem = {
            id: Date.now(),
            name: itemName,
            amount: parseFloat(itemAmount),
            type: itemType,
        };
        setItems([...items, newItem]);
        setItemName('');
        setItemAmount('');
    };
    
    const handleDeleteItem = (id: number) => {
        setItems(items.filter(item => item.id !== id));
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
            pdf.save('personal_budget.pdf');
        } catch (error) {
            console.error("Error generating PDF:", error);
            toast({ title: "PDF Generation Error", description: "Could not generate PDF.", variant: "destructive" });
        } finally {
            setLoadingPdf(false);
        }
    };


    const incomeItems = items.filter(i => i.type === 'income');
    const expenseItems = items.filter(i => i.type === 'expense');
    const totalIncome = incomeItems.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = expenseItems.reduce((sum, item) => sum + item.amount, 0);
    const balance = totalIncome - totalExpenses;
    const currencySymbol = currencies[currency as keyof typeof currencies];

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Personal Budget Creator</CardTitle>
                    <CardDescription>Add your income and expenses to visualize your monthly budget.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Input Form */}
                        <div className='space-y-4'>
                            <CardTitle className="text-lg">Add New Item</CardTitle>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currency">Currency</Label>
                                    <Select value={currency} onValueChange={setCurrency}>
                                        <SelectTrigger id="currency"><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(currencies).map(([code, symbol]) => (
                                                <SelectItem key={code} value={code}>{code} ({symbol})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <Select onValueChange={(value: 'income' | 'expense') => setItemType(value)} value={itemType}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="income">Income</SelectItem>
                                            <SelectItem value="expense">Expense</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="item-name">Item Name (e.g., Salary, Rent)</Label>
                                <Input id="item-name" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Salary" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="item-amount">Amount</Label>
                                <Input id="item-amount" type="number" value={itemAmount} onChange={(e) => setItemAmount(e.target.value)} placeholder="2000" />
                            </div>
                            <Button onClick={handleAddItem}>Add to Budget</Button>
                        </div>
                        {/* Summary & Chart */}
                        <div className='space-y-4'>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg">Budget Summary</CardTitle>
                                <Button onClick={handleDownloadPdf} disabled={loadingPdf || items.length === 0} className="transform hover:-translate-y-1 transition-transform">
                                    {loadingPdf ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                                    Download PDF
                                </Button>
                            </div>
                            <div className="p-4 bg-muted rounded-lg space-y-2">
                                <div className="flex justify-between font-medium"><span>Total Income:</span> <span className='text-green-600'>{currencySymbol}{totalIncome.toFixed(2)}</span></div>
                                <div className="flex justify-between font-medium"><span>Total Expenses:</span> <span className='text-red-600'>{currencySymbol}{totalExpenses.toFixed(2)}</span></div>
                                <div className={`flex justify-between font-bold text-lg pt-2 border-t`}><span>Balance:</span> <span className={balance >= 0 ? 'text-green-700' : 'text-red-700'}>{currencySymbol}{balance.toFixed(2)}</span></div>
                            </div>
                            {expenseItems.length > 0 && (
                                <div>
                                    <h4 className="font-semibold mb-2 text-center">Expense Breakdown</h4>
                                    <ChartContainer config={{}} className="h-[250px] w-full">
                                        <PieChart>
                                            <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                                            <Pie data={expenseItems} dataKey="amount" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                                {expenseItems.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ChartContainer>
                                </div>
                            )}
                        </div>
                    </div>
                     <div className="pt-8">
                        <CardTitle className="text-lg mb-2">Budget Items</CardTitle>
                            <div className='space-y-2 max-h-60 overflow-y-auto pr-2'>
                            {items.length === 0 && <p className="text-muted-foreground text-sm">No items added yet.</p>}
                            {incomeItems.map(item => (
                                <div key={item.id} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                                    <span className="font-medium text-green-600">{item.name}</span>
                                    <div className='flex items-center gap-2'>
                                        <span>{currencySymbol}{item.amount.toFixed(2)}</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteItem(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                    </div>
                                </div>
                            ))}
                            {expenseItems.map(item => (
                                <div key={item.id} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                                    <span className="font-medium text-red-600">{item.name}</span>
                                    <div className='flex items-center gap-2'>
                                        <span>{currencySymbol}{item.amount.toFixed(2)}</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteItem(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
            {/* Hidden div for PDF generation */}
            <div className="absolute -left-[9999px] top-auto" aria-hidden="true">
                <div ref={pdfRef} className="bg-white text-black p-8" style={{ width: '210mm' }}>
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold">Personal Budget</h1>
                        <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
                    </div>
                    
                    <div className="mb-6 p-4 border rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">Budget Summary</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between"><span>Total Income:</span> <span className='font-medium'>{currencySymbol}{totalIncome.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Total Expenses:</span> <span className='font-medium'>{currencySymbol}{totalExpenses.toFixed(2)}</span></div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Final Balance:</span> <span>{currencySymbol}{balance.toFixed(2)}</span></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-xl font-semibold mb-2 border-b pb-1">Income Sources</h2>
                             <div className="space-y-1">
                                {incomeItems.map(item => (
                                    <div key={item.id} className="flex justify-between items-center">
                                        <span>{item.name}</span>
                                        <span>{currencySymbol}{item.amount.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                         <div>
                            <h2 className="text-xl font-semibold mb-2 border-b pb-1">Expense Items</h2>
                             <div className="space-y-1">
                                {expenseItems.map(item => (
                                    <div key={item.id} className="flex justify-between items-center">
                                        <span>{item.name}</span>
                                        <span>{currencySymbol}{item.amount.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

const GovernmentBudgetAnalysis = () => {
    const [country, setCountry] = useState<string>('');
    const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
    const [result, setResult] = useState<AnalyzeGovernmentBudgetOutput | null>(null);
    const [podcast, setPodcast] = useState<GeneratePodcastOutput | null>(null);
    const { toast } = useToast();

    const handleGenerateAnalysis = async () => {
        if (!country) {
            toast({ title: "Selection missing", description: "Please select a country.", variant: "destructive" });
            return;
        }
        setLoadingStatus("Generating analysis...");
        setResult(null);
        setPodcast(null);
        try {
            const apiResult = await analyzeGovernmentBudget({ country });
            setResult(apiResult);
            
            setLoadingStatus("Generating podcast audio...");
            const podcastTitle = `Government Budget Analysis: ${country}`;
            const narrationScript = `
Rita: Das, where does the government in ${country} get its money?
Das: ${apiResult.revenueSources.explanation}
Rita: And where does all that money go? What are the key areas of government spending?
Das: ${apiResult.expenditure.explanation}
Rita: Based on this, what can we say about the government's recent fiscal policy?
Das: ${apiResult.fiscalPolicy}
Rita: Let's talk about the bottom line. What is the situation with the national debt and budget deficit in ${country}?
Das: ${apiResult.debtAndDeficit}
Rita: Finally, what does the current budget mean for the average citizen and businesses in ${country}?
Das: ${apiResult.implications}
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

     const chartConfig = {
        value: { label: "Value" },
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Government Budget Analysis</CardTitle>
                <CardDescription>Select a country for an AI-powered podcast on its government budget, fiscal policy, and economic impact.</CardDescription>
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
                <Button onClick={handleGenerateAnalysis} disabled={!!loadingStatus || !country}>
                    {loadingStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {loadingStatus ? loadingStatus : 'Generate Podcast'}
                </Button>

                {result && (
                    <div className="pt-4 space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <CardTitle>Podcast: Budget Analysis for {country}</CardTitle>
                                     {podcast && (
                                        <audio controls autoPlay className="w-full max-w-md">
                                            <source src={podcast.audioUrl} type="audio/wav" />
                                            Your browser does not support the audio element.
                                        </audio>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible defaultValue="revenue" className="w-full">
                                    <AccordionItem value="revenue">
                                        <AccordionTrigger>Revenue Sources</AccordionTrigger>
                                        <AccordionContent className="space-y-4">
                                            <PodcastLine speaker="Rita" text={`Das, where does the government in ${country} get its money?`} />
                                            <PodcastLine speaker="Das" text={result.revenueSources.explanation} />
                                            <div className='pt-4'>
                                                <h4 className="font-semibold mb-2 text-center">Major Revenue Sources</h4>
                                                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                                                    <BarChart data={result.revenueSources.chartData} accessibilityLayer>
                                                        <CartesianGrid vertical={false} />
                                                        <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                                                        <ChartTooltip content={<ChartTooltipContent />} />
                                                        <Bar dataKey="value" fill="var(--color-chart-1)" radius={4} />
                                                    </BarChart>
                                                </ChartContainer>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="expenditure">
                                        <AccordionTrigger>Expenditure</AccordionTrigger>
                                        <AccordionContent className="space-y-4">
                                            <PodcastLine speaker="Rita" text="And where does all that money go?" />
                                            <PodcastLine speaker="Das" text={result.expenditure.explanation} />
                                             <div className='pt-4'>
                                                <h4 className="font-semibold mb-2 text-center">Major Spending Categories</h4>
                                                 <ChartContainer config={chartConfig} className="h-[250px] w-full">
                                                    <BarChart data={result.expenditure.chartData} accessibilityLayer>
                                                        <CartesianGrid vertical={false} />
                                                        <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                                                        <ChartTooltip content={<ChartTooltipContent />} />
                                                        <Bar dataKey="value" fill="var(--color-chart-2)" radius={4} />
                                                    </BarChart>
                                                </ChartContainer>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="policy">
                                        <AccordionTrigger>Fiscal Policy</AccordionTrigger>
                                        <AccordionContent className="space-y-2">
                                            <PodcastLine speaker="Rita" text="What can we say about the government's recent fiscal policy?" />
                                            <PodcastLine speaker="Das" text={result.fiscalPolicy} />
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="debt">
                                        <AccordionTrigger>National Debt & Deficit</AccordionTrigger>
                                        <AccordionContent className="space-y-2">
                                            <PodcastLine speaker="Rita" text="What is the situation with the national debt and budget deficit?" />
                                            <PodcastLine speaker="Das" text={result.debtAndDeficit} />
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="implications">
                                        <AccordionTrigger>Implications for You</AccordionTrigger>
                                        <AccordionContent className="space-y-2">
                                            <PodcastLine speaker="Rita" text="What does the current budget mean for citizens and businesses?" />
                                            <PodcastLine speaker="Das" text={result.implications} />
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default function BudgetPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Budget Central</h2>
            </div>

            <Tabs defaultValue="personal-budget" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="personal-budget">Personal Budget Creator</TabsTrigger>
                    <TabsTrigger value="gov-budget">Government Budget Analysis</TabsTrigger>
                </TabsList>
                <TabsContent value="personal-budget">
                   <PersonalBudgetCreator />
                </TabsContent>
                <TabsContent value="gov-budget">
                   <GovernmentBudgetAnalysis />
                </TabsContent>
            </Tabs>
        </div>
    );
}
