import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Helper to get config from environment or injected global
const getFirebaseConfig = () => {
    if (typeof window !== 'undefined' && window.__firebase_config) {
        try {
            return JSON.parse(window.__firebase_config);
        } catch (e) {
            console.error("Failed to parse injected firebase config", e);
        }
    }

    return {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID
    };
};

export const app = initializeApp(getFirebaseConfig());
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
// Messaging is handled in notificationUtils to avoid errors in non-supported environments


export const getAppId = () => {
    if (typeof window !== 'undefined' && window.__app_id) {
        return window.__app_id;
    }
    return 'default'; // Fallback for standalone dev
}
