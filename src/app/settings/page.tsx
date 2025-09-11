
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Shield, User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { useTextSettings } from "@/hooks/use-text-settings";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SettingsPage() {
  const { user, logout, sendEmailVerification, updateUserProfile } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { fontSize, setFontSize, fontFace, setFontFace } = useTextSettings();

  useEffect(() => {
    if (user?.name) {
      setDisplayName(user.name);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfile(displayName);
      toast({ title: 'Success', description: 'Profile updated successfully.' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerification = async () => {
    setVerificationLoading(true);
    try {
      await sendEmailVerification();
      toast({ title: 'Success', description: 'Verification email sent. Please check your inbox.' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setVerificationLoading(false);
    }
  };

  // Password update functionality removed - not supported in custom auth system

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: 'Success', description: 'Signed out successfully.' });
      router.push('/sign-in');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to sign out.',
        variant: 'destructive',
      });
    }
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  // Simplified auth system - all users are treated the same
  const isGoogleUser = false;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>

      <div className="grid gap-6">
        {/* Appearance Settings */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="text-lg font-medium">Theme</h3>
                  <p className="text-sm text-muted-foreground">Select a theme for the dashboard.</p>
                </div>
                <ThemeSwitcher />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Text</CardTitle>
              <CardDescription>Adjust text size and font style for better readability.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 border rounded-lg space-y-4">
                <div>
                  <Label htmlFor="font-size" className="text-lg font-medium">Font Size</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      id="font-size"
                      min={12}
                      max={24}
                      step={1}
                      value={[fontSize]}
                      onValueChange={(value) => setFontSize(value[0])}
                    />
                    <span className="text-sm font-medium text-muted-foreground w-12 text-center">{fontSize}px</span>
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded-lg space-y-4">
                <div>
                  <Label htmlFor="font-face" className="text-lg font-medium">Font Family</Label>
                  <Select onValueChange={(value) => setFontFace(value as any)} value={fontFace}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select a font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inter">Inter (Default)</SelectItem>
                      <SelectItem value="roboto">Roboto</SelectItem>
                      <SelectItem value="lato">Lato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="flex items-center gap-2">
                <Input value={user.email || ''} disabled />
                {user.emailVerified ? (
                  <Badge variant="default" className="text-xs">Verified</Badge>
                ) : (
                  <Badge variant="destructive" className="text-xs">Unverified</Badge>
                )}
              </div>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your display name"
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Profile
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Email Verification */}
        {!user.emailVerified && !isGoogleUser && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Verification
              </CardTitle>
              <CardDescription>Verify your email address to secure your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleSendVerification} disabled={verificationLoading}>
                {verificationLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Verification Email
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Password Change - Disabled for simplified auth system */}
        {/* Password update functionality has been removed */}

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>Manage your account access.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLogout} variant="outline" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
