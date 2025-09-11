'use client';

import Cookies from 'js-cookie';

export interface User {
  id: string;
  email: string;
  name?: string;
  emailVerified?: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}

// Simple in-memory user store (in production, this would be a database)
const users: User[] = [];

// Helper functions for password validation
export const validatePassword = (password: string): string | null => {
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/(?=.*\d)/.test(password)) {
    return 'Password must contain at least one number';
  }
  return null;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Authentication functions
export const signUp = async (email: string, password: string, name?: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        if (!validateEmail(email)) {
          throw new Error('Invalid email address');
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
          throw new Error(passwordError);
        }

        // Check if user already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
          throw new Error('An account with this email already exists');
        }

        // Create new user
        const newUser: User = {
          id: Date.now().toString(),
          email,
          name: name || email.split('@')[0],
          emailVerified: false,
          createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        
        // Set auth cookie
        const token = btoa(JSON.stringify({ userId: newUser.id, email: newUser.email }));
        Cookies.set('auth-token', token, { expires: 7 }); // 7 days
        
        resolve(newUser);
      } catch (error) {
        reject(error);
      }
    }, 500); // Simulate network delay
  });
};

export const signIn = async (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        if (!validateEmail(email)) {
          throw new Error('Invalid email address');
        }

        // Find user (in production, you'd also verify the password hash)
        const user = users.find(u => u.email === email);
        if (!user) {
          throw new Error('No account found with this email address');
        }

        // Set auth cookie
        const token = btoa(JSON.stringify({ userId: user.id, email: user.email }));
        Cookies.set('auth-token', token, { expires: 7 }); // 7 days
        
        resolve(user);
      } catch (error) {
        reject(error);
      }
    }, 500); // Simulate network delay
  });
};

export const signInWithGoogle = async (): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Simulate Google OAuth flow with random user data
        const googleUser: User = {
          id: 'google-' + Date.now().toString(),
          email: `user${Math.floor(Math.random() * 1000)}@gmail.com`,
          name: `Google User ${Math.floor(Math.random() * 100)}`,
          emailVerified: true,
          createdAt: new Date().toISOString(),
        };

        // Check if user already exists
        let user = users.find(u => u.email === googleUser.email);
        if (!user) {
          users.push(googleUser);
          user = googleUser;
        }

        // Set auth cookie
        const token = btoa(JSON.stringify({ userId: user.id, email: user.email }));
        Cookies.set('auth-token', token, { expires: 7 }); // 7 days
        
        resolve(user);
      } catch (error) {
        reject(error);
      }
    }, 1000); // Simulate OAuth delay
  });
};

export const signOut = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      Cookies.remove('auth-token');
      resolve();
    }, 200);
  });
};

export const getCurrentUser = (): User | null => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return null;
    }
    
    const token = Cookies.get('auth-token');
    if (!token) return null;

    const decoded = JSON.parse(atob(token));
    const user = users.find(u => u.id === decoded.userId);
    return user || null;
  } catch (error) {
    return null;
  }
};

export const sendPasswordReset = async (email: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        if (!validateEmail(email)) {
          throw new Error('Invalid email address');
        }

        const user = users.find(u => u.email === email);
        if (!user) {
          throw new Error('No account found with this email address');
        }

        // In production, you'd send an actual email
        console.log(`Password reset email sent to ${email}`);
        resolve();
      } catch (error) {
        reject(error);
      }
    }, 500);
  });
};

export const sendEmailVerification = async (user: User): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In production, you'd send an actual verification email
      console.log(`Email verification sent to ${user.email}`);
      resolve();
    }, 500);
  });
};

export const updateProfile = async (user: User, updates: Partial<Pick<User, 'name'>>): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex === -1) {
          throw new Error('User not found');
        }

        users[userIndex] = { ...users[userIndex], ...updates };
        resolve(users[userIndex]);
      } catch (error) {
        reject(error);
      }
    }, 500);
  });
};

// Admin functions
export const getAllUsers = (): User[] => {
  return [...users]; // Return a copy to prevent direct manipulation
};

export const getUserCount = (): number => {
  return users.length;
};
