// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: "monthly-activity-app",
  storageBucket: "monthly-activity-app.appspot.com",
  messagingSenderId: "229408794712",
  appId: "1:229408794712:web:6ddb6f39fe0992203bc22d",
  storageBucket: "gs://monthly-activity-app.appspot.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);
