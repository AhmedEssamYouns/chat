import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { enableLogging } from 'firebase/database';
// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEGmSfNtYPxQrP5crC98FBXC62ihvVKt0",
  authDomain: "chat-snap-talk.firebaseapp.com",
  projectId: "chat-snap-talk",
  storageBucket: "chat-snap-talk.appspot.com",
  messagingSenderId: "129056838610",
  appId: "1:129056838610:web:cdce5aeae0730b707c6e0b",
  measurementId: "G-BVQ0WQENX6"
};

// Initialize Firebase only if not already initialized
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Auth with AsyncStorage for persistence
export const FIREBASE_AUTH = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
enableLogging(true)