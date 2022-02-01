import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCZ8ZusOQo25HDXE95cQEc-QQNw-4K4VlI",
  authDomain: "letspropagate-us.firebaseapp.com",
  projectId: "letspropagate-us",
  storageBucket: "letspropagate-us.appspot.com",
  messagingSenderId: "170006653892",
  appId: "1:170006653892:web:7bea10c472d7033a275291",
  measurementId: "G-V8XYKY15WB"
};

// Initialize Firebase 
firebase.initializeApp(firebaseConfig);

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = () => auth.signInWithPopup(provider);
export const db = firebase.firestore();
export const auth = firebase.auth();
export default firebase;