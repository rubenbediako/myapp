
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

export default function AboutUsPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
                <Bot className="h-16 w-16 text-primary" />
                <h1 className="text-4xl font-bold tracking-tight">About The Economist</h1>
                <p className="max-w-2xl text-muted-foreground md:text-xl">
                    Our mission is to make global economic intelligence accessible to everyone. We combine real-time data with powerful AI analysis to bring you economic insights like never before.
                </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 pt-12">
                <Card>
                    <CardHeader>
                        <CardTitle>Our Vision</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        <p>
                            In an increasingly interconnected world, understanding economic forces is no longer just for economists. It's for students, entrepreneurs, investors, and curious minds. We envision a world where complex economic data is transformed into clear, actionable, and engaging narratives. The Economist is our step towards that future, providing tools that empower you to analyze, forecast, and learn about the economies that shape our world.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Contact Us</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground space-y-2">
                        <p>
                            Have questions, feedback, or partnership inquiries? We'd love to hear from you.
                        </p>
                        <p><strong>Email:</strong> <a href="mailto:das.the.economist@gmail.com" className="text-primary hover:underline">das.the.economist@gmail.com</a></p>
                        <p><strong>WhatsApp:</strong> <a href="https://wa.me/233540456414" target="_blank" className="text-primary hover:underline">+233 54 045 6414</a></p>
                        <p><strong>Facebook:</strong> <a href="https://web.facebook.com/Das.Economist/" target="_blank" className="text-primary hover:underline">fb.com/Das.Economist</a></p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
