// Minimal Firebase client config
// Replace with your own config from the Firebase console

import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut 
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDdB_psU4z69gops5uL-OFxoS0YzcCZumc",
    authDomain: "project-path-c5a90.firebaseapp.com",
    projectId: "project-path-c5a90",
    storageBucket: "project-path-c5a90.firebasestorage.app",
    messagingSenderId: "905099102796",
    appId: "1:905099102796:web:f4949f014f807ee166c2e9",
    measurementId: "G-002PVH9KZJ"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export function signIn(email, pass) {
  return signInWithEmailAndPassword(auth, email, pass);
}

export function registerUser(email, pass) {
  return createUserWithEmailAndPassword(auth, email, pass);
}

export function logout() {
  return signOut(auth);
}
