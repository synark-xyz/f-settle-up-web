import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { isDevMode } from '../lib/devMode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser && isDevMode() && currentUser.isAnonymous) {
                // Masquerade as John Doe for dev mode
                // We import MOCK_USER dynamically to avoid circular dependencies if any, 
                // but since it's a lib, we can import it at top level.
                // Let's assume we need to import it.
                // Actually, let's just hardcode the overlay here or import it.
                // I'll add the import to the file.
                setUser({
                    ...currentUser,
                    displayName: 'John Doe',
                    email: 'john@settleup.com'
                });
            } else {
                setUser(currentUser);
            }
            setLoading(false);
        });

        // Auto-sign in logic
        const initAuth = async () => {
            if (!auth.currentUser) {
                // In dev mode, immediately sign in anonymously
                if (isDevMode()) {
                    try {
                        await signInAnonymously(auth);
                    } catch (error) {
                        console.error("Dev mode anonymous auth failed", error);
                    }
                } else if (typeof window !== 'undefined' && window.__initial_auth_token) {
                    // Production: use custom token if available
                    console.log("Custom token found (not implemented in this demo)");
                } else {
                    // Production: don't auto-sign in, wait for user action
                    setLoading(false);
                }
            }
        };

        initAuth();

        return unsubscribe;
    }, []);

    const value = {
        user,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
