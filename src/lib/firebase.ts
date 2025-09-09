
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Check if environment variables are properly configured
const isValidConfig = (value: string | undefined) => {
  return value && !value.includes('your_') && !value.includes('_here');
};

const firebaseConfig = {
  apiKey: isValidConfig(process.env.NEXT_PUBLIC_FIREBASE_API_KEY) 
    ? process.env.NEXT_PUBLIC_FIREBASE_API_KEY 
    : "demo-api-key",
  authDomain: isValidConfig(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) 
    ? process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN 
    : "demo-project.firebaseapp.com",
  projectId: isValidConfig(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) 
    ? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID 
    : "demo-project",
  storageBucket: isValidConfig(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) 
    ? process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET 
    : "demo-project.appspot.com",
  messagingSenderId: isValidConfig(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) 
    ? process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID 
    : "123456789",
  appId: isValidConfig(process.env.NEXT_PUBLIC_FIREBASE_APP_ID) 
    ? process.env.NEXT_PUBLIC_FIREBASE_APP_ID 
    : "1:123456789:web:abcdef",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || `https://demo-project.firebaseio.com`
};

// Only initialize Firebase if we have valid config
let app, auth, googleProvider;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
} catch (error) {
  console.warn('Firebase initialization failed:', error);
  // Create mock objects for development
  app = null;
  auth = null;
  googleProvider = null;
}

export { app, auth, googleProvider };
