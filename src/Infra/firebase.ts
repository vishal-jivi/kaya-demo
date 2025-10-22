import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

//To-DO: Move firebaseConfig to env
const firebaseConfig = {
  apiKey: "AIzaSyDHE76qdbHo8Vx0KuedjVdTtaqZ85wDGa0",
  authDomain: "kaya-demo-25aa4.firebaseapp.com",
  projectId: "kaya-demo-25aa4",
  storageBucket: "kaya-demo-25aa4.firebasestorage.app",
  messagingSenderId: "168684184971",
  appId: "1:168684184971:web:937515773cc06ef593bb8e",
  measurementId: "G-L6N95KQDHT"
};

const app: FirebaseApp = initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

export default app;
