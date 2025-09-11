
import type {Metadata} from 'next';
import './globals.css';
import 'katex/dist/katex.min.css';
import { Toaster } from "@/components/ui/toaster";
import { Dashboard } from '@/components/dashboard';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/hooks/use-auth';
import { TextSettingsProvider } from '@/hooks/use-text-settings';

export const metadata: Metadata = {
  title: 'The Economist',
  description: 'Visualize and analyze economic data with AI insights.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Lato:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-background">
        <AuthProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="theme-rose"
                enableSystem
                disableTransitionOnChange
            >
                <TextSettingsProvider>
                    <Dashboard>
                        {children}
                    </Dashboard>
                    <Toaster />
                </TextSettingsProvider>
            </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
