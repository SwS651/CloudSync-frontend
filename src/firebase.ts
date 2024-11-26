import { message } from "antd";
import axios from "axios";
import { FirebaseApp, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getURL } from "./utils/apiServices";

// Set up Google provider
const googleProvider = new GoogleAuthProvider();
let firebaseApp: FirebaseApp | null = null; 
export const loadFirebaseConfig = async() => {
    const url = await getURL()
    try {
        const response = await axios.post(`${url}/credentials/firebaseConfig`);
        const config = response.data.data;
        return config;
    } catch (error) {
        console.warn('Firebase configuration not available. Please ensure the credentials are uploaded to the backend.');
        return null
        
    } 
}
const initFirebase = async () => {
    if (!firebaseApp) {
        try {
            const config = await loadFirebaseConfig();
            firebaseApp = initializeApp(config);
        } catch (error) {
            // Handle the case where the configuration is not available
            message.error('Firebase configuration not available. Please contact the administrator or upload the credentials to the backend.');
        }
    }
    return firebaseApp
};

// Get Firebase Auth instance
const getFirebaseAuth = async () => {
    const app = await initFirebase();
    // if (!app) return { currentUser: null }; // Return null user if initialization fails
    if (!app) return console.log("Firebase is not initialized");
    const auth = getAuth(app);

    // Ensure the auth listener updates the user state
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            resolve(auth);
        });
    });
};



export { getFirebaseAuth,googleProvider };