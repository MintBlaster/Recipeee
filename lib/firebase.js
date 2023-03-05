import { initializeApp, getApps, getApp } from "firebase/app";
import {getAuth, GoogleAuthProvider } from "firebase/auth";
import {getFirestore, collection, where, getDocs, query, limit} from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAeiALwH4vCSKD13Tfu1zxt3vrwHSd_m7o",
  authDomain: "recipeapp-200e6.firebaseapp.com",
  projectId: "recipeapp-200e6",
  storageBucket: "recipeapp-200e6.appspot.com",
  messagingSenderId: "580539267844",
  appId: "1:580539267844:web:279947d0ea8f018fab2e51",
  measurementId: "G-RF50N2L2SD"
};

// Initialize Firebase
function createFirebaseConfig(config){
    try {
        return getApp();
    } catch (error) {
        return initializeApp(config);
    }
}

const firebaseApp = createFirebaseConfig(firebaseConfig);

//export auth
export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider(auth);
export const firestore = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
