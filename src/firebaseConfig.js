// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";  

const firebaseConfig = {
  apiKey: "AIzaSyAUYla57GDl3oChLgtbe_sV9Vf-LGUNM1o",
  authDomain: "shiv-dhara-clinic.firebaseapp.com",
  projectId: "shiv-dhara-clinic",
  storageBucket: "shiv-dhara-clinic.appspot.com",
  messagingSenderId: "151285409972",
  appId: "1:151285409972:web:93604f04dd04c5b3550fe1",
  measurementId: "G-TQGMYY1RD2",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 