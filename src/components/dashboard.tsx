
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';
import { Bot, User, BarChart2, BrainCircuit, GitCompare, MessageCircleQuestion, Heart, Landmark, Scale, LineChart, Building2, Wallet, PiggyBank, ShoppingCart, Users, Globe, Briefcase, Settings, Info, Facebook, MessageSquare, Menu, ShieldAlert, LogOut, Download, Share, MoreVertical, Notebook, GraduationCap } from 'lucide-react';
import { ThemeSwitcher } from './ui/theme-switcher';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from './ui/scroll-area';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const navItems = [
  { href: '/dashboard', icon: BarChart2, label: 'Dashboard' },
  { 
    label: 'Core Analysis', 
    icon: BrainCircuit,
    subItems: [
      { href: '/core-analysis/macroeconomics-variables', icon: Globe, label: 'Macro Variables' },
      { href: '/core-analysis/microeconomics-variables', icon: Scale, label: 'Micro Variables' },
      { href: '/core-analysis/forecast-predictions', icon: LineChart, label: 'Forecasts' },
      { href: '/core-analysis/comparative-analysis', icon: GitCompare, label: 'Comparisons' },
    ]
  },
  { 
    label: 'Economic Landscape',
    icon: Landmark,
    subItems: [
      { href: '/investment', icon: LineChart, label: 'Investment' },
      { href: '/savings', icon: PiggyBank, label: 'Savings' },
      { href: '/consumption', icon: ShoppingCart, label: 'Consumption' },
      { href: '/wages', icon: Wallet, label: 'Wages' },
      { href: '/employment-unemployment', icon: Users, label: 'Employment' },
      { href: '/capital-market', icon: Briefcase, label: 'Capital Market' },
      { href: '/security-risk', icon: ShieldAlert, label: 'Security & Risk' },
    ]
  },
   { 
     label: 'Personal & Business',
     icon: Wallet,
     subItems: [
        { href: '/personal-finance', icon: Wallet, label: 'Financial Health' },
        { href: '/pricing', icon: Scale, label: 'Pricing Analysis' },
        { href: '/budget', icon: Notebook, label: 'Budgeting' },
        { href: '/entrepreneurship-hub', icon: Building2, label: 'Entrepreneurship' },
     ]
   },
   { href: '/courses', icon: GraduationCap, label: 'AI Courses' },
  { 
    label: 'About', 
    icon: Info,
    subItems: [
      { href: '/about', icon: Info, label: 'About Us' },
      { href: '/settings', icon: Settings, label: 'Settings' },
    ]
  },
];

const NavMenu = () => {
  const pathname = usePathname();

  return navItems.map((item, index) => {
    if (item.subItems) {
      return (
        <MenubarMenu key={index}>
          <MenubarTrigger className="text-base font-medium">{item.label}</MenubarTrigger>
          <MenubarContent>
            {item.subItems.map((subItem) => (
              <Link href={subItem.href} key={subItem.href}>
                <MenubarItem>
                  <subItem.icon className="mr-2 h-4 w-4" />
                  {subItem.label}
                </MenubarItem>
              </Link>
            ))}
          </MenubarContent>
        </MenubarMenu>
      );
    }
    return (
      <Link href={item.href} key={item.href}>
        <Button variant={pathname === item.href ? 'secondary' : 'ghost'} className="text-base font-medium">
          {item.label}
        </Button>
      </Link>
    );
  });
};

const MobileNav = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
         <VisuallyHidden asChild>
            <SheetHeader>
              <SheetTitle>Main Navigation</SheetTitle>
              <SheetDescription>
                A list of pages you can navigate to within the application.
              </SheetDescription>
            </SheetHeader>
          </VisuallyHidden>
          <ScrollArea className="h-full">
            <div className="flex flex-col space-y-2 p-4 pt-8">
                {navItems.map((item, index) => {
                if (item.subItems) {
                    return (
                    <div key={index}>
                        <h3 className="font-semibold text-lg px-2 pt-4 pb-2">{item.label}</h3>
                        {item.subItems.map((subItem) => (
                        <Link href={subItem.href} key={subItem.href} onClick={() => setOpen(false)}>
                            <Button variant={pathname === subItem.href ? 'secondary' : 'ghost'} className="w-full justify-start">
                                <subItem.icon className="mr-2 h-4 w-4" />
                                {subItem.label}
                            </Button>
                        </Link>
                        ))}
                    </div>
                    )
                }
                return (
                    <Link href={item.href} key={item.href} onClick={() => setOpen(false)}>
                    <Button variant={pathname === item.href ? 'secondary' : 'ghost'} className="w-full justify-start">
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                    </Button>
                    </Link>
                );
                })}
            </div>
         </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export function Dashboard({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const pathname = usePathname();
  const [showDonateDialog, setShowDonateDialog] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  const handleSignOut = async () => {
    try {
      await logout();
      toast({ title: 'Signed Out', description: 'You have been signed out successfully.' });
      router.push('/sign-in');
    } catch (error: any) {
      toast({ title: 'Error Signing Out', description: error.message, variant: 'destructive' });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'The Economist - AI Economic Analysis',
      text: 'Check out The Economist app for AI-powered economic insights, forecasts, and analysis.',
      url: window.location.origin,
    };

    try {
        const posterUrl = `https://placehold.co/1200x630/FFFFFF/000000/png?text=The%20Economist%0A%0AAnalyze%20%7C%20Forecast%20%7C%20Learn&font=lato&css=%7B%22background-image%22%3A%22url(https%3A%2F%2Fpicsum.photos%2Fseed%2Feconomist-colorful%2F1200%2F630)%22%2C%22background-size%22%3A%22cover%22%2C%22color%22%3A%22white%22%2C%22padding%22%3A%2250px%22%2C%22text-align%22%3A%22left%22%2C%22font-size%22%3A%225rem%22%2C%22font-weight%22%3A%22bold%22%2C%22text-shadow%22%3A%222px%202px%204px%20rgba(0%2C0%2C0%2C0.8)%22%7D`;
        const response = await fetch(posterUrl);
        if (!response.ok) throw new Error('Image fetch failed');
        
        const blob = await response.blob();
        const file = new File([blob], 'the-economist-poster.png', { type: blob.type });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                ...shareData,
                files: [file],
            });
        } else {
            await navigator.share(shareData);
        }
    } catch (error) {
        console.log('Sharing with image failed, falling back to text only:', error);
        try {
            await navigator.share(shareData);
        } catch (shareError) {
            console.log('Error sharing', shareError);
            navigator.clipboard.writeText(window.location.origin);
            toast({
                title: "Sharing not supported",
                description: "App link copied to your clipboard.",
            });
        }
    }
  };

  useEffect(() => {
    setMounted(true);
    let visibilityTimeout: NodeJS.Timeout | null = null;
    let mainTimeout: NodeJS.Timeout | null = null;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (!visibilityTimeout) {
          visibilityTimeout = setTimeout(() => {
            setShowDonateDialog(true);
          }, 3 * 60 * 1000); // 3 minutes
        }
      } else {
        if (visibilityTimeout) {
          clearTimeout(visibilityTimeout);
          visibilityTimeout = null;
        }
      }
    };
    
    // Fallback timer for very long sessions
    mainTimeout = setInterval(() => {
        if (document.visibilityState === 'hidden') {
            setShowDonateDialog(true);
        }
    }, 30 * 60 * 1000); // every 30 minutes


    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        if (visibilityTimeout) clearTimeout(visibilityTimeout);
        if (mainTimeout) clearInterval(mainTimeout);
    };
  }, []);
  
  // Timer for sign-in/sign-up prompt
  useEffect(() => {
    if (!user && mounted) {
      const timer = setTimeout(() => {
        // Only show if the user is not on a sign-in or sign-up page already
        if (pathname !== '/sign-in' && pathname !== '/sign-up') {
            setShowAuthDialog(true);
        }
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearTimeout(timer);
    }
  }, [user, mounted, pathname]);

  // Timer for download app prompt for logged-in users
  useEffect(() => {
    if (user && mounted) {
      const timer = setTimeout(() => {
          setShowDownloadDialog(true);
      }, 2 * 60 * 1000); // 2 minutes

      return () => clearTimeout(timer);
    }
  }, [user, mounted]);

  // Timer for share app prompt
  useEffect(() => {
    if(mounted) {
      const shareTimer = setTimeout(() => {
        setShowShareDialog(true);
      }, 5 * 60 * 1000); // 5 minutes
      
      return () => clearTimeout(shareTimer);
    }
  }, [mounted]);

  const isPublicPage = ['/sign-in', '/sign-up'].includes(pathname);
  
  if (isPublicPage) {
    return <>{children}</>;
  }


  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Bot className="h-6 w-6 text-primary" />
              <span className="font-bold hidden sm:inline-block">The Economist</span>
            </Link>
            {mounted && isMobile && (
              <MobileNav />
            )}
          </div>
          
          <div className="flex flex-1 items-center justify-end space-x-2">
             <div className="w-full flex-1 md:w-auto md:flex-none">
                {mounted && !isMobile && <Menubar className="border-none rounded-none bg-transparent"><NavMenu /></Menubar>}
            </div>
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              {user ? (
                 <Button onClick={handleSignOut} variant="outline" size="sm">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Sign Out</span>
                 </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button size="sm">
                        Get Started
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/sign-up">Sign Up</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/sign-in">Sign In</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button asChild variant="outline" size="sm">
                  <Link href="https://flutterwave.com/donate/ugtehnpw6nql" target="_blank">
                      <Heart className="mr-2 h-4 w-4 text-red-500" />
                      <span className="hidden sm:inline">Donate</span>
                  </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 relative">
        {children}
        <Link href="/ask-das-ai" passHref>
          <Button
            size="icon"
            className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl z-40 transform hover:-translate-y-1 transition-transform"
            aria-label="Ask Das-AI"
          >
            <MessageCircleQuestion className="h-8 w-8" />
          </Button>
        </Link>
      </main>
       <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
           <div className="flex items-center justify-center gap-4">
                <Link href="https://wa.me/233540456414" target="_blank" className="text-muted-foreground hover:text-foreground">
                    <MessageSquare className="h-5 w-5"/>
                    <span className="sr-only">WhatsApp</span>
                </Link>
                 <Link href="https://web.facebook.com/Das.Economist/" target="_blank" className="text-muted-foreground hover:text-foreground">
                    <Facebook className="h-5 w-5"/>
                    <span className="sr-only">Facebook</span>
                </Link>
                 <button onClick={handleShare} className="text-muted-foreground hover:text-foreground">
                    <Share className="h-5 w-5"/>
                    <span className="sr-only">Share</span>
                </button>
            </div>
          <p className="text-center text-base leading-loose text-muted-foreground md:text-left">
            The Economist built by Das
          </p>
        </div>
      </footer>
      <AlertDialog open={showDonateDialog} onOpenChange={setShowDonateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Support The Economist</AlertDialogTitle>
            <AlertDialogDescription>
              Thank you for using our application. Your support helps us keep the servers running and continue to provide valuable economic insights.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Maybe Later</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Link href="https://flutterwave.com/donate/ugtehnpw6nql" target="_blank" onClick={() => setShowDonateDialog(false)}>
                  <Heart className="mr-2 h-4 w-4" /> Donate Now
              </Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Join The Economist Community</AlertDialogTitle>
            <AlertDialogDescription>
              Sign up or sign in to access all features, including saving your analyses, taking courses, and getting personalized insights.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
             <AlertDialogCancel asChild>
                 <Button variant="outline" onClick={() => setShowAuthDialog(false)}>Later</Button>
             </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Link href="/sign-in" onClick={() => setShowAuthDialog(false)}>
                    Sign In
                </Link>
            </AlertDialogAction>
             <AlertDialogAction asChild>
                <Link href="/sign-up" onClick={() => setShowAuthDialog(false)}>
                    Sign Up
                </Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
       <AlertDialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Get the Full App Experience!</AlertDialogTitle>
            <AlertDialogDescription>
                For quicker access, add The Economist to your home screen. It's fast, easy, and works just like a regular app.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="text-sm space-y-4 py-2">
            <div>
              <h4 className="font-semibold">On iOS (Safari):</h4>
              <p className="text-muted-foreground">Tap the Share button <Share className="inline-block h-4 w-4 mx-1" />, then scroll down and tap 'Add to Home Screen'.</p>
            </div>
             <div>
              <h4 className="font-semibold">On Android (Chrome):</h4>
              <p className="text-muted-foreground">Tap the menu button <MoreVertical className="inline-block h-4 w-4 mx-1" />, then tap 'Install app' or 'Add to Home screen'.</p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowDownloadDialog(false)}>
                Got it!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Enjoying The Economist?</AlertDialogTitle>
            <AlertDialogDescription>
              If you find this app helpful, please consider sharing it with your friends or colleagues. It helps us grow!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowShareDialog(false)}>Maybe Later</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              handleShare();
              setShowShareDialog(false);
            }}>
              <Share className="mr-2 h-4 w-4" /> Share Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

    

    