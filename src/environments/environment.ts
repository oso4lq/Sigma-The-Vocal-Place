// export const environment = {
//     production: false,
//     firebaseConfig: {
//       apiKey: "YOUR_API_KEY",
//       authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
//       projectId: "YOUR_PROJECT_ID",
//       storageBucket: "YOUR_PROJECT_ID.appspot.com",
//       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//       appId: "YOUR_APP_ID"
//     }
//   };

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB4rN8x2CzenHeVSvfNM_A7xl13xce1GRI",
    authDomain: "sigma-the-vocal-place.firebaseapp.com",
    projectId: "sigma-the-vocal-place",
    storageBucket: "sigma-the-vocal-place.appspot.com",
    messagingSenderId: "98097750547",
    appId: "1:98097750547:web:a9bfa2bff3979f302595e6",
    measurementId: "G-SP246NGJ35"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);