'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AuthTestPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser as any);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to access this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button onClick={() => router.push('/sign-in')} className="w-full">
                Sign In
              </Button>
              <Button onClick={() => router.push('/sign-up')} variant="outline" className="w-full">
                Sign Up
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication Success!</CardTitle>
          <CardDescription>You are successfully authenticated.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">User ID:</p>
              <p className="text-sm text-muted-foreground">{(user as any).id}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Email:</p>
              <p className="text-sm text-muted-foreground">{(user as any).email}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Name:</p>
              <p className="text-sm text-muted-foreground">{(user as any).name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Email Verified:</p>
              <Badge variant={(user as any).emailVerified ? "default" : "secondary"}>
                {(user as any).emailVerified ? "Verified" : "Not Verified"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Created:</p>
              <p className="text-sm text-muted-foreground">
                {new Date((user as any).createdAt).toLocaleDateString()}
              </p>
            </div>
            <Button onClick={() => router.push('/dashboard')} className="w-full">
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
