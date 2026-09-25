// First Merit Bank - Firebase Configuration

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Paste your Firebase configuration here
const firebaseConfig = {
  apiKey: "AIzaSyDJovDxELDNrijQJxdSXz2O9VTDTjaNRoQ",
  authDomain: "first-merit-bank.firebaseapp.com",
  projectId: "first-merit-bank",
  storageBucket: "first-merit-bank.firebasestorage.app",
  messagingSenderId: "677563778915"
  appId: "1:677563778915:web:6a2b92b373c6608d63f556"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication
const auth = getAuth(app);

// Firestore Database
const db = getFirestore(app);

export { app, auth, db };
