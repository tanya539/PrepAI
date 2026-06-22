import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBAWsT4OSpgsriYOZBZjBVQNLN9FP_7nVM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "prepai-996bc.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "prepai-996bc",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "prepai-996bc.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "60229072334",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:60229072334:web:00feb5a0910750b9f1e79f",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-B30N5Q49EJ",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();