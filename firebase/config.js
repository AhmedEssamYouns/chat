// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCEGmSfNtYPxQrP5crC98FBXC62ihvVKt0",
    authDomain: "chat-snap-talk.firebaseapp.com",
    projectId: "chat-snap-talk",
    storageBucket: "chat-snap-talk.appspot.com",
    messagingSenderId: "129056838610",
    appId: "1:129056838610:web:cdce5aeae0730b707c6e0b",
    measurementId: "G-BVQ0WQENX6"
  };
  
// Initialize Firebase 
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const db = getFirestore(FIREBASE_APP);
export const storage = getStorage(FIREBASE_APP);