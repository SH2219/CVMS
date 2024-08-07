import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnF01lYbl89zFNeqpiK2Ufd4sv1dTgIeA",
  authDomain: "cvms-10c0b.firebaseapp.com",
  projectId: "cvms-10c0b",
  storageBucket: "cvms-10c0b.appspot.com",
  messagingSenderId: "156444335327",
  appId: "1:156444335327:web:2326a3974f977a6df4dd6a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);