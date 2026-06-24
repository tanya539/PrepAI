import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBAWsT4OSpgsriYOZBZjBVQNLN9FP_7nVM",
  authDomain: "prepai-996bc.firebaseapp.com",
  projectId: "prepai-996bc",
  storageBucket: "prepai-996bc.firebasestorage.app",
  messagingSenderId: "60229072334",
  appId: "1:60229072334:web:00feb5a0910750b9f1e79f",
  measurementId: "G-B30N5Q49EJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();