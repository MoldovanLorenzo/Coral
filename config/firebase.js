import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import messaging from '@react-native-firebase/messaging';
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: "AIzaSyB_dm_AnUkmA_C6tP-oS098jr5nyDT0c2I",
  authDomain: "coral-daca3.firebaseapp.com",
  projectId: "coral-daca3",
  storageBucket: "coral-daca3.appspot.com",
  messagingSenderId: "154615933866",
  appId: "1:154615933866:web:3ee4d38d9deaa5c75119d3"
};

  
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const FIREBASE_FIRESTORE = getFirestore(FIREBASE_APP);
//export const FIREBASE_TOKEN=await messaging().getToken();