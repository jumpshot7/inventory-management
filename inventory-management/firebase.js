// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import  {getFirestore} from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCF18QbeSa_eUeDUI2m4GT_9bM8HBSEN_Y",
  authDomain: "inventory-management-30bea.firebaseapp.com",
  projectId: "inventory-management-30bea",
  storageBucket: "inventory-management-30bea.appspot.com",
  messagingSenderId: "149502450935",
  appId: "1:149502450935:web:4df81caf5eee81562447f2",
  measurementId: "G-VH7EYYQZH5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}