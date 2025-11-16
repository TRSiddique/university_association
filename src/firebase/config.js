// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // ADD THIS IMPORT

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkR-VmDSmNSV_KbbRSHx3n-9I5HyhcNu8",
  authDomain: "cusap-admin.firebaseapp.com",
  projectId: "cusap-admin",
  storageBucket: "cusap-admin.firebasestorage.app",
  messagingSenderId: "1095678719944",
  appId: "1:1095678719944:web:441dcf1a5b75aed8c172fd",
  measurementId: "G-2QTDVP0WPM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // ADD THIS LINE

// Export the auth object
export { auth };
export default app;