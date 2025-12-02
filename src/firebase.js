// Firebase initialization (uses modular SDK)
// Provide config via environment variables in .env: REACT_APP_FIRE_API_KEY, REACT_APP_FIRE_AUTH_DOMAIN, REACT_APP_FIRE_PROJECT_ID, REACT_APP_FIRE_STORAGE_BUCKET, REACT_APP_FIRE_MESSAGING_SENDER_ID, REACT_APP_FIRE_APP_ID
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, updateDoc, onSnapshot, query, orderBy, writeBatch, setDoc } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, /* FacebookAuthProvider, */ signInWithPopup, signInWithRedirect, getRedirectResult, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged, setPersistence as fbSetPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIRE_API_KEY,
  authDomain: process.env.REACT_APP_FIRE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIRE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIRE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIRE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIRE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
// const facebookProvider = new FacebookAuthProvider();

// Debug: show config in development so we can confirm correct env values
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-console
  console.log('Firebase config:', {
    projectId: firebaseConfig.projectId,
    apiKey: firebaseConfig.apiKey ? '***' : undefined,
    authDomain: firebaseConfig.authDomain,
  });
  if (!firebaseConfig.projectId) {
    // eslint-disable-next-line no-console
    console.warn('Firebase projectId is missing. Please check your .env values.');
  }
}

export { db, collection, addDoc, doc, updateDoc, onSnapshot, query, orderBy, writeBatch, setDoc };
export { auth, googleProvider, /* facebookProvider, */ signInWithPopup, signInWithRedirect, getRedirectResult, signInWithEmailAndPassword, createUserWithEmailAndPassword, fbSignOut, onAuthStateChanged, fbSetPersistence, browserLocalPersistence, browserSessionPersistence };
