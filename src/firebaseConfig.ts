import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from 'firebase/messaging';


const firebaseConfig = {
  apiKey: "AIzaSyA7EjUCATFjVHNysKPuOqsz5RxqpWo29KU",
  authDomain: "shapex-3ae86.firebaseapp.com",
  projectId: "shapex-3ae86",
  storageBucket: "shapex-3ae86.firebasestorage.app",
  messagingSenderId: "144836163870",
  appId: "1:144836163870:web:57d2d0ab6870468d72b10f",
  measurementId: "G-B7X0MY0RXK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const messaging = getMessaging(app);
