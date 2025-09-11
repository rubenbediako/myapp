
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  getCurrentUser,
  signOut as authSignOut,
  sendEmailVerification as authSendEmailVerification,
  sendPasswordReset as authSendPasswordReset,
  updateProfile as authUpdateProfile,
} from '@/lib/auth';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  sendEmailVerification: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateUserProfile: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  sendEmailVerification: async () => {},
  sendPasswordReset: async () => {},
  updateUserProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user on mount
    try {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.warn('Error getting current user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }

    // Set up periodic check for auth state changes (cookie changes)
    const interval = setInterval(() => {
      try {
        const updatedUser = getCurrentUser();
        setUser(updatedUser);
      } catch (error) {
        console.warn('Error updating auth state:', error);
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, []);

  const logout = async () => {
    try {
      await authSignOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const sendEmailVerificationToUser = async () => {
    if (!user) throw new Error('No user logged in');
    try {
      await authSendEmailVerification(user);
    } catch (error) {
      console.error('Error sending email verification:', error);
      throw error;
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      await authSendPasswordReset(email);
    } catch (error) {
      console.error('Error sending password reset:', error);
      throw error;
    }
  };

  const updateUserProfile = async (name: string) => {
    if (!user) throw new Error('No user logged in');
    try {
      const updatedUser = await authUpdateProfile(user, { name });
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin" />
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      logout,
      sendEmailVerification: sendEmailVerificationToUser,
      sendPasswordReset,
      updateUserProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
