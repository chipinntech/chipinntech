import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration using Vite environment variables with fallback
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDQjojFeO4DxuQ1XhNep6s2eO8kpuA73oE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "chipinntech.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "chipinntech",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "chipinntech.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "274400812739",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:274400812739:web:9e0a9d79d2e58b787bcc76",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-WGYS42PD93"
};

// Initialize Firebase App singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Cloud Firestore database
export const db = getFirestore(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firebase Cloud Storage
export const storage = getStorage(app);

// Initialize Firebase Analytics safely (only supported in browser environments)
export let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics unavailable or blocked by ad-blocker
  });
}

export default app;
