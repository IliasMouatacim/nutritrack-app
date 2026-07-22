import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDRuUUAdEKzCZm6CWGSUu55UXolrUeb0-A",
  authDomain: "nutriapp-b5ff8.firebaseapp.com",
  projectId: "nutriapp-b5ff8",
  storageBucket: "nutriapp-b5ff8.appspot.com",
  messagingSenderId: "623272399722",
  appId: "1:623272399722:web:f13e7346744d7de4018b13"
};

// Initialize Firebase only if it hasn't been initialized already and we have a config
const app = getApps().length === 0 
  ? initializeApp(firebaseConfig) 
  : getApp();

export const db = getFirestore(app);

let authInstance: ReturnType<typeof getAuth> | null = null;
try {
  authInstance = firebaseConfig.apiKey ? getAuth(app) : null;
} catch (e) {
  console.warn("Firebase Auth failed to initialize", e);
}

export const auth = authInstance;
export const googleProvider = new GoogleAuthProvider();
