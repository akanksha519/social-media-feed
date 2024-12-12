import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3lHMvoqDQB--nmofzhE_yRcSp8lykIxw",
  authDomain: "socialmediaapp-ae424.firebaseapp.com",
  projectId: "socialmediaapp-ae424",
  storageBucket: "socialmediaapp-ae424.firebasestorage.app",
  messagingSenderId: "904399834663",
  appId: "1:904399834663:web:73509685a60ee485450802",
  measurementId: "G-CNKM4NBX39",
};

// Initialize Firebase only if it has not been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase services
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, provider, db, storage };
