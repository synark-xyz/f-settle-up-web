import { useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook to sync user settings with Firestore
 * @param {string} settingKey - The key for the setting (e.g., 'currency', 'notifications')
 * @param {any} initialValue - Default value if no setting exists
 * @returns {[any, Function, boolean]} - [value, setValue, loading]
 */
export const useFirebaseSettings = (settingKey, initialValue) => {
    const { user } = useAuth();
    const [value, setValue] = useState(() => {
        // Initialize from localStorage first for immediate render
        const local = localStorage.getItem(`setting_${settingKey}`);
        return local ? JSON.parse(local) : initialValue;
    });
    const [loading, setLoading] = useState(true);

    // Sync with Firestore
    useEffect(() => {
        if (!user) {
            // Use setTimeout to avoid synchronous state update warning
            const timer = setTimeout(() => setLoading(false), 0);
            return () => clearTimeout(timer);
        }

        const settingsRef = doc(db, `users/${user.uid}/settings/${settingKey}`);

        const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setValue(data.value);
                // Update local storage to keep in sync
                localStorage.setItem(`setting_${settingKey}`, JSON.stringify(data.value));
            }
            setLoading(false);
        }, (error) => {
            console.error(`Error syncing setting ${settingKey}:`, error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, settingKey]);

    // Function to update setting
    const updateSetting = async (newValue) => {
        // Optimistic update
        setValue(newValue);
        localStorage.setItem(`setting_${settingKey}`, JSON.stringify(newValue));

        if (!user) return;

        try {
            const settingsRef = doc(db, `users/${user.uid}/settings/${settingKey}`);
            await setDoc(settingsRef, {
                value: newValue,
                updatedAt: new Date()
            }, { merge: true });
        } catch (error) {
            console.error(`Error updating setting ${settingKey}:`, error);
            // Revert on error (optional, but good practice)
        }
    };

    return [value, updateSetting, loading];
};
