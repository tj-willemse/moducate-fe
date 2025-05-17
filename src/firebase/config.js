// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCPkUMP2w7r7A27Vm3VwIZNIPST6NwrUhM",
  authDomain: "moducate-demo.firebaseapp.com",
  projectId: "moducate-demo",
  storageBucket: "moducate-demo.firebasestorage.app",
  messagingSenderId: "99147063466",
  appId: "1:99147063466:web:4d3582ae721c97b43fc1b3",
  measurementId: "G-RDNKVB8H1R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
export default firebaseConfig;
