import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwoBCSIRG49sdI7mQHqdtv7MTjcm2Hr2A",
  authDomain: "examensarbete-325c6.firebaseapp.com",
  projectId: "examensarbete-325c6",
  storageBucket: "examensarbete-325c6.firebasestorage.app",
  messagingSenderId: "817421660109",
  appId: "1:817421660109:web:f005b26ea564213e709e84"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
