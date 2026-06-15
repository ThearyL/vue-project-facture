import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

    apiKey: "AIzaSyCT2zeAN3-ZKQSwCvN5884VEjhOpuhvb0Q",
    authDomain: "facture-projet-54892.firebaseapp.com",
    projectId: "facture-projet-54892",
    storageBucket: "facture-projet-54892.firebasestorage.app",
    messagingSenderId: "129141129404",
    appId: "1:129141129404:web:c6a1913f3384695587d0b9"

};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);


export default db;