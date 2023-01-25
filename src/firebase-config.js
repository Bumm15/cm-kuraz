import { initializeApp } from "firebase/app";
import {} from '@firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyAfVE26VurO5lw4Ik12wCWhS6Ygra2njYw",
    authDomain: "cm-kuraz-development.firebaseapp.com",
    databaseURL: "https://cm-kuraz-development-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "cm-kuraz-development",
    storageBucket: "cm-kuraz-development.appspot.com",
    messagingSenderId: "948674147521",
    appId: "1:948674147521:web:48c5b26b12353f0e525040"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)