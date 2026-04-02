import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBiqO4DDK1f7WbgPNZ4skrRGtlvWXJsUa8",
  authDomain: "picher-kenkou.firebaseapp.com",
  projectId: "picher-kenkou",
  storageBucket: "picher-kenkou.firebasestorage.app",
  messagingSenderId: "864545557031",
  appId: "1:864545557031:web:7259150868b3cadfa89c02"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
