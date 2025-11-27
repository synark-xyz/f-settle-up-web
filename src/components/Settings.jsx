import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Bell, CreditCard, Shield, Palette, Info, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = ({ onNavigate }) => {
    const { theme, toggleTheme } = useTheme();
    // In a real router setup, we'd use useNavigate. Here we might need a prop or just rely on the parent handling navigation if it's conditional rendering.
    // Assuming App.jsx passes a way to go back or we use a simple state change in App.jsx.
    // Since App.jsx uses conditional rendering based on 'currentPage' state, we need to accept a prop 'onNavigate' or similar.
    // Let's check App.jsx again. It passes nothing to Settings currently.
    // We need to update App.jsx to pass onNavigate to Settings and Profile.

    // For now, let's assume we will receive onNavigate prop.
    // But wait, I need to check App.jsx first to pass the prop.

    const settingsSections = [
        {
            title: 'Appearance',
            icon: Palette,
            settings: [
                {
                    label: 'Theme',
                    description: 'Choose your preferred color scheme',
                    action: (
                        <button
                            onClick={toggleTheme}
                            className="px-4 py-2 rounded-lg bg-brand-gradient text-white text-sm font-medium"
                        >
                            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                        </button>
                    )
                }
            ]
        },
        {
            title: 'Notifications',
            icon: Bell,
            settings: [
                {
                    label: 'Payment Reminders',
                    description: 'Get notified before payment due dates',
                    action: (
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-primary"></div>
                        </label>
                    )
                },
                {
                    label: 'Email Notifications',
                    description: 'Receive updates via email',
                    action: (
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-primary"></div>
                        </label>
                    )
                }
            ]
        },
        {
            title: 'Cards',
            icon: CreditCard,
            settings: [
                {
                    label: 'Auto-populate from OCR',
                    description: 'Automatically fill card details from statements',
                    action: (
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-primary"></div>
                        </label>
                    )
                }
            ]
        },
        {
            title: 'Privacy & Security',
            icon: Shield,
            settings: [
                {
                    label: 'Data Collection',
                    description: 'All data is stored securely and encrypted',
                    action: (
                        <span className="text-xs text-gray-500 dark:text-gray-400">Enabled</span>
                    )
                }
            ]
        }
    ];

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => onNavigate?.('home')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-900 dark:text-white" />
                </button>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            </div>

            <div className="space-y-6">
                {settingsSections.map((section, sectionIdx) => (
                    <div key={sectionIdx} className="bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                            <div className="flex items-center gap-3">
                                <section.icon size={20} className="text-brand-primary" />
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{section.title}</h2>
                            </div>
                        </div>

                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {section.settings.map((setting, idx) => (
                                <div key={idx} className="px-6 py-4 flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{setting.label}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{setting.description}</p>
                                    </div>
                                    <div className="ml-4">
                                        {setting.action}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* About Section */}
                <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Info size={20} className="text-brand-primary" />
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">About</h2>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        SettleUp v1.0.0<br />
                        Credit Card & Expense Management System
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Settings;
