'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wrench } from "lucide-react";
import Link from "next/link";

export default function UnderConstructionPage({ 
  title = "Page Under Construction",
  description = "This page is being updated to use our new AI system.",
  backLink = "/"
}) {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link href={backLink}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center">
              <Wrench className="h-8 w-8 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription className="text-lg">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              We're upgrading this page to use the Vercel AI SDK for better performance and reliability. 
              This page will be available again soon with enhanced AI capabilities.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                In the meantime, you can:
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/ask-das-ai">
                  <Button variant="outline">Try Ask Das AI</Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline">Go to Dashboard</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
