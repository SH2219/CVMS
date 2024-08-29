import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7JoHuEOUps5o_aVlJnzVu35q9njz45Cs",
  authDomain: "cvms2-a76e3.firebaseapp.com",
  projectId: "cvms2-a76e3",
  storageBucket: "cvms2-a76e3.appspot.com",
  messagingSenderId: "406606022748",
  appId: "1:406606022748:web:11611dd7c776b5a68ebe99",
  measurementId: "G-6731SS4JHX"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);