import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyD6p79OSzpchhw-SJgqpl65cexbI2RR4HI",
  authDomain: "unihub-ad001.firebaseapp.com",
  projectId: "unihub-ad001",
  storageBucket: "unihub-ad001.firebasestorage.app",
  messagingSenderId: "799102761576",
  appId: "1:799102761576:web:1ab72b7372476a2f3e19dd"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const db = getFirestore(app)