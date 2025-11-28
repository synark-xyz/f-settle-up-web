import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

const UserMenu = ({ onNavigate, onLogin }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setIsOpen(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleNavigation = (page) => {
        onNavigate(page);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
                {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold">
                        {user?.displayName?.[0] || user?.email?.[0] || 'U'}
                    </div>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-surface rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 z-50">
                    {user ? (
                        <>
                            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                    {user.displayName || 'User'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {user.email || 'No email'}
                                </p>
                            </div>

                            <button
                                onClick={() => handleNavigation('profile')}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <User size={16} />
                                Profile
                            </button>

                            <button
                                onClick={() => handleNavigation('settings')}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <Settings size={16} />
                                Settings
                            </button>
                        </>
                    ) : (
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Guest User</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Sign in to save data</p>
                        </div>
                    )}

                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </button>

                    <div className="border-t border-gray-100 dark:border-gray-800 mt-2 pt-2">
                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    onLogin?.();
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-brand-primary font-semibold hover:bg-brand-primary/10 transition-colors"
                            >
                                <User size={16} />
                                Sign In / Sign Up
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
