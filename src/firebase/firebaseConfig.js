import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBflM2C3owvTLf1ehAJjf7FS5QjXNPFJNo",
  authDomain: "fir-blog-bb605.firebaseapp.com",
  projectId: "fir-blog-bb605",
  storageBucket: "fir-blog-bb605.appspot.com",
  messagingSenderId: "522767198808",
  appId: "1:522767198808:web:81c38f93f5ee618d2bf82d",
  measurementId: "G-P66V0RS3JP",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
