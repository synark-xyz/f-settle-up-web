import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { app } from './firebase';

// Initialize messaging
// Note: Messaging is only supported in secure contexts (HTTPS) and localhost
let messaging = null;

try {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        messaging = getMessaging(app);
    }
} catch (e) {
    console.error('Firebase Messaging initialization failed:', e);
}

/**
 * Request notification permission and get FCM token
 * @returns {Promise<string|null>} FCM Token or null
 */
export const requestNotificationPermission = async () => {
    if (!messaging) {
        console.warn('Messaging not supported');
        return null;
    }

    try {
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
            const token = await getToken(messaging, {
                vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
            });

            if (token) {
                console.log('FCM Token:', token);
                return token;
            } else {
                console.warn('No registration token available. Request permission to generate one.');
                return null;
            }
        } else {
            console.warn('Notification permission denied');
            return null;
        }
    } catch (error) {
        console.error('An error occurred while retrieving token. ', error);
        return null;
    }
};

/**
 * Listen for foreground messages
 * @param {Function} callback - Function to handle the message
 * @returns {Function} Unsubscribe function
 */
export const onMessageListener = (callback) => {
    if (!messaging) return () => { };

    return onMessage(messaging, (payload) => {
        console.log('Message received. ', payload);
        callback(payload);
    });
};

/**
 * Schedule a local notification (fallback or testing)
 * @param {string} title 
 * @param {string} body 
 */
export const sendLocalNotification = (title, body) => {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
        new Notification(title, {
            body,
            icon: '/pwa-192x192.png'
        });
    }
};
