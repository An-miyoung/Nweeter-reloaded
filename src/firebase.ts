import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDcco93sIrOuCqznLX-ftJ3Zqse4ECwTKA",
  authDomain: "my-twitter-clone-b39b7.firebaseapp.com",
  projectId: "my-twitter-clone-b39b7",
  storageBucket: "my-twitter-clone-b39b7.appspot.com",
  messagingSenderId: "671942359325",
  appId: "1:671942359325:web:8b4c9a4654f9faff3ac9f4",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
